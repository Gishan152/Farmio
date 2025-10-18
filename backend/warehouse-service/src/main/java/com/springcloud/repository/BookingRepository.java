package com.springcloud.repository;

import com.springcloud.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByOwnerId(Long ownerId);
    List<Booking> findByWarehouseIdAndOwnerId(Long warehouseId, Long ownerId);
}
