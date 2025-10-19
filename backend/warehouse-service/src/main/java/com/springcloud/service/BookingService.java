package com.springcloud.service;

import com.springcloud.dto.*;
import com.springcloud.exception.BadRequestException;
import com.springcloud.exception.ResourceNotFoundException;
import com.springcloud.model.*;
import com.springcloud.repository.BookingRepository;
import com.springcloud.repository.SlotRepository;
import com.springcloud.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class BookingService {

    private final BookingRepository repo;
    private final SlotRepository slotRepository;
    private final WarehouseRepository warehouseRepository;

    public List<Booking> getBookings(Long ownerId, Long warehouseId){
        return warehouseId == null
               ? repo.findByOwnerId(ownerId)
               : repo.findByWarehouseIdAndOwnerId(warehouseId, ownerId);
    }

    public Booking getBooking(Long bookingId, Long ownerId){
        return repo.findById(bookingId)
                   .filter(b -> b.getOwnerId().equals(ownerId))
                   .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
    }

    // Step 1: Create booking request
    @Transactional
    public Booking createBookingRequest(BookingRequestDTO dto, Long userId) {
        // Find warehouse and owner
        Warehouse warehouse = warehouseRepository.findById(dto.getWarehouseId())
            .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found"));
        
        Booking booking = new Booking();
        booking.setWarehouseId(dto.getWarehouseId());
        booking.setFarmerId(userId);
        booking.setOwnerId(warehouse.getOwnerId());
        booking.setStatus(BookingStatus.PENDING);
        booking.setPaymentStatus(PaymentStatus.NOT_REQUIRED);
        booking.setQuantityKg(dto.getQuantityKg());
        booking.setDurationDays(dto.getDurationDays());
        booking.setProductType(dto.getProductType());
        booking.setNotes(dto.getNotes());
        
        return repo.save(booking);
    }

    // Step 2: Warehouse owner approves and creates slot
    @Transactional
    public Map<String, Object> approveBookingRequest(Long bookingId, Long ownerId, SlotCreationDTO slotDTO) {
        Booking booking = getBooking(bookingId, ownerId);
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only pending bookings can be approved");
        }
        
        // Verify warehouse ownership
        Warehouse warehouse = warehouseRepository.findById(booking.getWarehouseId())
            .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found"));
        
        // Calculate pricing
        BigDecimal baseCost = calculateBaseCost(booking, warehouse.getPricePerKg());
        BigDecimal bufferCost = calculateBufferCost(booking, warehouse.getPricePerKg());
        BigDecimal platformFee = calculatePlatformFee(baseCost, bufferCost);
        BigDecimal totalAmount = baseCost.add(bufferCost).add(platformFee);
        
        // Create slot for this booking
        Slot slot = createSlotForBooking(booking, slotDTO, warehouse);
        
        // Update booking
        booking.setStatus(BookingStatus.APPROVED);
        booking.setPaymentStatus(PaymentStatus.PENDING);
        booking.setAssignedSlotId(slot.getId());
        booking.setSlotNumber(slot.getSlotNumber());
        booking.setBaseCost(baseCost);
        booking.setBufferCost(bufferCost);
        booking.setPlatformFee(platformFee);
        booking.setTotalAmount(totalAmount);
        booking.setApprovedAt(LocalDateTime.now());
        
        Booking savedBooking = repo.save(booking);
        
        // TODO: Send notification to farmer/buyer about payment requirement
        // notificationService.sendPaymentRequiredNotification(booking);
        
        return Map.of(
            "bookingId", savedBooking.getId(),
            "status", "APPROVED",
            "paymentRequired", true,
            "totalAmount", totalAmount,
            "slotNumber", slot.getSlotNumber(),
            "message", "Booking approved. Payment required to confirm."
        );
    }

    // Step 3: Initiate payment (called by farmer/buyer)
    @Transactional
    public PaymentInitiationDTO initiatePayment(Long bookingId, Long userId) {
        Booking booking = repo.findById(bookingId)
            .filter(b -> b.getFarmerId().equals(userId))
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
            
        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new BadRequestException("Booking must be approved before payment");
        }
        
        if (booking.getPaymentStatus() != PaymentStatus.PENDING) {
            throw new BadRequestException("Payment already initiated or processed");
        }
        
        // Generate payment ID (you might want to use a more sophisticated ID generation)
        String paymentId = "PAY_" + bookingId + "_" + System.currentTimeMillis();
        
        // Update booking
        booking.setPaymentStatus(PaymentStatus.PROCESSING);
        booking.setPaymentId(paymentId);
        booking.setPaymentInitiatedAt(LocalDateTime.now());
        repo.save(booking);
        
        // TODO: Integrate with PayHere to get actual payment URL
        String paymentUrl = generatePayHereUrl(booking, paymentId);
        
        return new PaymentInitiationDTO(
            paymentId,
            paymentUrl,
            booking.getTotalAmount(),
            bookingId.toString(),
            "Payment initiated successfully. Complete payment to confirm booking."
        );
    }

    // Step 4: Confirm payment (webhook from PayHere)
    @Transactional
    public void confirmPaymentFromPayHere(String paymentId, String payHereTransactionId, BigDecimal amount) {
        Booking booking = repo.findByPaymentId(paymentId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found for payment: " + paymentId));
        
        if (booking.getPaymentStatus() != PaymentStatus.PROCESSING) {
            throw new BadRequestException("Payment not in processing state");
        }
        
        // Verify amount
        if (amount.compareTo(booking.getTotalAmount()) != 0) {
            throw new BadRequestException("Payment amount mismatch");
        }
        
        // Update booking
        booking.setStatus(BookingStatus.PAYMENT_CONFIRMED);
        booking.setPaymentStatus(PaymentStatus.AWAITING_APPROVAL);
        booking.setPayHereTransactionId(payHereTransactionId);
        booking.setPaidAmount(amount);
        booking.setPaymentConfirmedAt(LocalDateTime.now());
        
        repo.save(booking);
        
        // TODO: Send notification to warehouse owner about payment confirmation
        // notificationService.sendPaymentConfirmationToOwner(booking);
    }

    // Step 5: Warehouse owner approves payment
    @Transactional
    public Map<String, Object> approvePayment(Long bookingId, Long ownerId) {
        Booking booking = getBooking(bookingId, ownerId);
        if (booking.getStatus() != BookingStatus.PAYMENT_CONFIRMED) {
            throw new BadRequestException("Payment must be confirmed before approval");
        }
        
        // Update booking to confirmed status
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setPaymentStatus(PaymentStatus.HELD_IN_ESCROW);
        
        // Activate the slot
        Slot slot = slotRepository.findById(booking.getAssignedSlotId())
            .orElseThrow(() -> new ResourceNotFoundException("Assigned slot not found"));
        
        slot.setStatus(SlotStatus.OCCUPIED);
        slot.setCurrentLoadKg(booking.getQuantityKg().intValue());
        slot.setReservedByUserId(booking.getFarmerId());
        
        slotRepository.save(slot);
        Booking savedBooking = repo.save(booking);
        
        // TODO: Move payment to escrow in payment service
        // paymentService.moveToEscrow(booking.getPaymentId(), booking.getTotalAmount());
        
        // TODO: Send booking confirmation to farmer/buyer
        // notificationService.sendBookingConfirmationToCustomer(booking);
        
        return Map.of(
            "bookingId", savedBooking.getId(),
            "status", "CONFIRMED",
            "slotNumber", slot.getSlotNumber(),
            "message", "Payment approved. Booking confirmed and slot activated."
        );
    }

    // Step 6: Start storage period
    @Transactional
    public Booking startStoragePeriod(Long bookingId, Long ownerId) {
        Booking booking = getBooking(bookingId, ownerId);
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new BadRequestException("Booking must be confirmed to start storage");
        }
        
        booking.setStatus(BookingStatus.ACTIVE);
        booking.setStartDate(LocalDateTime.now());
        booking.setEndDate(LocalDateTime.now().plusDays(booking.getDurationDays()));
        booking.setStorageStartedAt(LocalDateTime.now());
        
        return repo.save(booking);
    }

    // Legacy methods updated for new status system
    @Transactional
    public Booking reject(Long bookingId, Long ownerId, String reason){
        Booking b = getBooking(bookingId, ownerId);
        if(b.getStatus() != BookingStatus.PENDING)
            throw new BadRequestException("Only pending bookings can be rejected");
        b.setStatus(BookingStatus.REJECTED);
        b.setPaymentStatus(PaymentStatus.NOT_REQUIRED);
        b.setRejectionReason(reason);
        return repo.save(b);
    }

    @Transactional
    public Booking handleEarlyRetrieval(Long bookingId, Long ownerId, boolean approve){
        Booking b = getBooking(bookingId, ownerId);
        if(b.getStatus() != BookingStatus.RETRIEVAL_REQUESTED)
            throw new BadRequestException("No retrieval request pending");
        b.setStatus(approve ? BookingStatus.APPROVED_FOR_RETRIEVAL : BookingStatus.RETRIEVAL_REJECTED);
        return repo.save(b);
    }

    public Map<String,Long> stats(Long ownerId){
        List<Booking> list = repo.findByOwnerId(ownerId);
        return list.stream()
                   .collect(Collectors.groupingBy(b -> b.getStatus().name(), Collectors.counting()));
    }

    // Helper methods
    private BigDecimal calculateBaseCost(Booking booking, Double pricePerKg) {
        return BigDecimal.valueOf(booking.getQuantityKg())
            .multiply(BigDecimal.valueOf(booking.getDurationDays()))
            .multiply(BigDecimal.valueOf(pricePerKg));
    }

    private BigDecimal calculateBufferCost(Booking booking, Double pricePerKg) {
        // 3-day buffer period
        return BigDecimal.valueOf(booking.getQuantityKg())
            .multiply(BigDecimal.valueOf(3))
            .multiply(BigDecimal.valueOf(pricePerKg));
    }

    private BigDecimal calculatePlatformFee(BigDecimal baseCost, BigDecimal bufferCost) {
        // 10% platform fee
        return baseCost.add(bufferCost).multiply(BigDecimal.valueOf(0.10));
    }

    private Slot createSlotForBooking(Booking booking, SlotCreationDTO slotDTO, Warehouse warehouse) {
        // Check if slot number already exists
        if (slotRepository.existsByWarehouseIdAndSlotNumber(booking.getWarehouseId(), slotDTO.getSlotNumber())) {
            throw new BadRequestException("Slot number already exists: " + slotDTO.getSlotNumber());
        }
        
        Slot slot = new Slot();
        slot.setSlotNumber(slotDTO.getSlotNumber());
        slot.setWarehouseId(booking.getWarehouseId());
        slot.setStatus(SlotStatus.RESERVED); // Reserved until payment confirmed
        slot.setCapacityKg(slotDTO.getCapacityKg());
        slot.setReservedLoadKg(booking.getQuantityKg().intValue());
        slot.setProductType(booking.getProductType());
        slot.setReservedByUserId(booking.getFarmerId());
        slot.setNotes(slotDTO.getNotes());
        
        return slotRepository.save(slot);
    }

    private String generatePayHereUrl(Booking booking, String paymentId) {
        // TODO: Implement actual PayHere integration
        return "https://sandbox.payhere.lk/pay/" + paymentId;
    }
}