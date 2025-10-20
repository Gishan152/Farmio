package com.springcloud.controller;

import com.springcloud.dto.*;
import com.springcloud.model.Booking;
import com.springcloud.service.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor @Slf4j
public class BookingController {

    private final BookingService service;

    // Get bookings for warehouse owner
    @GetMapping
    public List<Booking> list(@RequestParam(required = false) Long warehouseId,
                              @RequestHeader("X-User-Id") Long ownerId){
        return service.getBookings(ownerId, warehouseId);
    }

    @GetMapping("/{id}")
    public Booking one(@PathVariable Long id,
                       @RequestHeader("X-User-Id") Long ownerId){
        return service.getBooking(id, ownerId);
    }

    // Step 1: Create booking request (called by farmer/buyer)
    @PostMapping("/request")
    public ResponseEntity<Booking> createRequest(@RequestBody BookingRequestDTO dto,
                                                @RequestHeader("X-User-Id") Long userId) {
        try {
            Booking booking = service.createBookingRequest(dto, userId);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            log.error("Error creating booking request", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // Step 2: Warehouse owner approves request and creates slot
    @PutMapping("/{id}/approve")
    public ResponseEntity<Map<String, Object>> approve(@PathVariable Long id,
                                                      @RequestBody SlotCreationDTO slotDTO,
                                                      @RequestHeader("X-User-Id") Long ownerId){
        try {
            Map<String, Object> result = service.approveBookingRequest(id, ownerId, slotDTO);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error approving booking", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Step 3: Farmer/buyer initiates payment
    @PostMapping("/{id}/initiate-payment")
    public ResponseEntity<PaymentInitiationDTO> initiatePayment(@PathVariable Long id,
                                                               @RequestHeader("X-User-Id") Long userId) {
        try {
            PaymentInitiationDTO payment = service.initiatePayment(id, userId);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            log.error("Error initiating payment", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // Step 4: PayHere webhook to confirm payment
    @PostMapping("/payment/confirm")
    public ResponseEntity<Map<String, String>> confirmPayment(@RequestBody Map<String, Object> paymentData) {
        try {
            String paymentId = (String) paymentData.get("paymentId");
            String transactionId = (String) paymentData.get("transactionId");
            BigDecimal amount = new BigDecimal(paymentData.get("amount").toString());
            
            service.confirmPaymentFromPayHere(paymentId, transactionId, amount);
            return ResponseEntity.ok(Map.of("status", "success", "message", "Payment confirmed"));
        } catch (Exception e) {
            log.error("Error confirming payment", e);
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    // Step 5: Warehouse owner approves payment
    @PutMapping("/{id}/approve-payment")
    public ResponseEntity<Map<String, Object>> approvePayment(@PathVariable Long id,
                                                             @RequestHeader("X-User-Id") Long ownerId) {
        try {
            Map<String, Object> result = service.approvePayment(id, ownerId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error approving payment", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Step 6: Start storage period
    @PutMapping("/{id}/start-storage")
    public ResponseEntity<Booking> startStorage(@PathVariable Long id,
                                               @RequestHeader("X-User-Id") Long ownerId) {
        try {
            Booking booking = service.startStoragePeriod(id, ownerId);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            log.error("Error starting storage", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // Legacy endpoints (updated)
    @PutMapping("/{id}/reject")
    public Booking reject(@PathVariable Long id,
                          @RequestHeader("X-User-Id") Long ownerId,
                          @RequestBody Map<String,String> body){
        return service.reject(id, ownerId, body.get("reason"));
    }

    @PutMapping("/{id}/early-retrieval")
    public Booking retrieval(@PathVariable Long id,
                             @RequestHeader("X-User-Id") Long ownerId,
                             @RequestParam boolean approve){
        return service.handleEarlyRetrieval(id, ownerId, approve);
    }

    @GetMapping("/stats")
    public Map<String,Long> stats(@RequestHeader("X-User-Id") Long ownerId){
        return service.stats(ownerId);
    }
}