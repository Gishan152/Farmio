package com.springcloud.controller;

import com.springcloud.model.Booking;
import com.springcloud.service.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor @Slf4j
public class BookingController {

    private final BookingService service;

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

    @PutMapping("/{id}/approve")
    public Booking approve(@PathVariable Long id,
                           @RequestHeader("X-User-Id") Long ownerId){
        return service.approve(id, ownerId);
    }

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