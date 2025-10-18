package com.springcloud.service;

import com.springcloud.exception.BadRequestException;
import com.springcloud.exception.ResourceNotFoundException;
import com.springcloud.model.Booking;
import com.springcloud.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class BookingService {

    private final BookingRepository repo;

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

    @Transactional
    public Booking approve(Long bookingId, Long ownerId){
        Booking b = getBooking(bookingId, ownerId);
        if(!"PENDING".equals(b.getStatus()))
            throw new BadRequestException("Only pending bookings can be approved");
        b.setStatus("APPROVED");
        return repo.save(b);
    }

    @Transactional
    public Booking reject(Long bookingId, Long ownerId, String reason){
        Booking b = getBooking(bookingId, ownerId);
        if(!"PENDING".equals(b.getStatus()))
            throw new BadRequestException("Only pending bookings can be rejected");
        b.setStatus("REJECTED");
        b.setRejectionReason(reason);
        return repo.save(b);
    }

    @Transactional
    public Booking handleEarlyRetrieval(Long bookingId, Long ownerId, boolean approve){
        Booking b = getBooking(bookingId, ownerId);
        if(!"RETRIEVAL_REQUESTED".equals(b.getStatus()))
            throw new BadRequestException("No retrieval request pending");
        b.setStatus(approve ? "APPROVED_FOR_RETRIEVAL" : "RETRIEVAL_REJECTED");
        return repo.save(b);
    }

    public Map<String,Long> stats(Long ownerId){
        List<Booking> list = repo.findByOwnerId(ownerId);
        return list.stream()
                   .collect(Collectors.groupingBy(Booking::getStatus, Collectors.counting()));
    }
}