package com.springcloud.repository;

import com.springcloud.model.Booking;
import com.springcloud.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByOwnerId(Long ownerId);
    List<Booking> findByWarehouseIdAndOwnerId(Long warehouseId, Long ownerId);
    List<Booking> findByWarehouseIdAndOwnerIdAndStatus(Long warehouseId, Long ownerId, BookingStatus status);
    List<Booking> findByWarehouseIdAndStatus(Long warehouseId, BookingStatus status);
    List<Booking> findByFarmerId(Long farmerId);
    Optional<Booking> findByPaymentId(String paymentId);
}
