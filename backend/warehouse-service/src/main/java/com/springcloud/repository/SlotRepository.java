package com.springcloud.repository;

import com.springcloud.model.Slot;
import com.springcloud.model.SlotStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SlotRepository extends JpaRepository<Slot, Long> {
    
    // Find slots by warehouse
    List<Slot> findByWarehouseIdOrderBySlotNumberAsc(Long warehouseId);
    
    // Find slots by warehouse and status
    List<Slot> findByWarehouseIdAndStatusOrderBySlotNumberAsc(Long warehouseId, SlotStatus status);
    
    // Find available slots in a warehouse
    @Query("SELECT s FROM Slot s WHERE s.warehouseId = :warehouseId AND s.status = 'AVAILABLE' AND (s.capacityKg - s.currentLoadKg - s.reservedLoadKg) > 0 ORDER BY s.slotNumber ASC")
    List<Slot> findAvailableSlotsByWarehouse(@Param("warehouseId") Long warehouseId);
    
    // Find slots with sufficient capacity
    @Query("SELECT s FROM Slot s WHERE s.warehouseId = :warehouseId AND s.status = 'AVAILABLE' AND (s.capacityKg - s.currentLoadKg - s.reservedLoadKg) >= :requiredCapacity ORDER BY s.slotNumber ASC")
    List<Slot> findSlotsWithSufficientCapacity(@Param("warehouseId") Long warehouseId, @Param("requiredCapacity") Integer requiredCapacity);
    
    // Find slot by warehouse and slot number
    Optional<Slot> findByWarehouseIdAndSlotNumber(Long warehouseId, String slotNumber);
    
    // Find expired reservations
    @Query("SELECT s FROM Slot s WHERE s.status = 'RESERVED' AND s.reservedUntil < :currentTime")
    List<Slot> findExpiredReservations(@Param("currentTime") LocalDateTime currentTime);
    
    // Find slots reserved by user
    List<Slot> findByReservedByUserIdOrderByReservedUntilAsc(Long userId);
    
    // Find slots needing cleaning (not cleaned in specified days)
    @Query("SELECT s FROM Slot s WHERE s.lastCleaned IS NULL OR s.lastCleaned < :cutoffDate ORDER BY s.lastCleaned ASC")
    List<Slot> findSlotsNeedingCleaning(@Param("cutoffDate") LocalDateTime cutoffDate);
    
    // Count slots by status for a warehouse
    @Query("SELECT s.status, COUNT(s) FROM Slot s WHERE s.warehouseId = :warehouseId GROUP BY s.status")
    List<Object[]> countSlotsByStatusForWarehouse(@Param("warehouseId") Long warehouseId);
    
    // Get warehouse utilization statistics
    @Query("SELECT " +
           "COUNT(s), " +
           "SUM(s.capacityKg), " +
           "SUM(s.currentLoadKg), " +
           "SUM(s.reservedLoadKg) " +
           "FROM Slot s WHERE s.warehouseId = :warehouseId")
    Object[] getWarehouseUtilizationStats(@Param("warehouseId") Long warehouseId);
    
    // Search slots by product type
    @Query("SELECT s FROM Slot s WHERE s.warehouseId = :warehouseId AND LOWER(s.productType) LIKE LOWER(CONCAT('%', :productType, '%')) ORDER BY s.slotNumber ASC")
    List<Slot> findByWarehouseIdAndProductTypeContainingIgnoreCase(@Param("warehouseId") Long warehouseId, @Param("productType") String productType);
    
    // Check if slot number exists in warehouse
    boolean existsByWarehouseIdAndSlotNumber(Long warehouseId, String slotNumber);
    
    // Find slots by temperature range
    @Query("SELECT s FROM Slot s WHERE s.warehouseId = :warehouseId AND s.temperature BETWEEN :minTemp AND :maxTemp ORDER BY s.slotNumber ASC")
    List<Slot> findSlotsByTemperatureRange(@Param("warehouseId") Long warehouseId, @Param("minTemp") Double minTemp, @Param("maxTemp") Double maxTemp);
    
    // Get slots that are due for maintenance (various criteria)
    @Query("SELECT s FROM Slot s WHERE s.status = 'MAINTENANCE' OR s.status = 'OUT_OF_ORDER' ORDER BY s.updatedAt ASC")
    List<Slot> findSlotsUnderMaintenance();

   
        /*  Add inside the existing interface  */
    @Query("SELECT s FROM Slot s WHERE s.warehouseId = :w AND s.status IN ('RESERVED','OCCUPIED') ORDER BY s.slotNumber")
    List<Slot> findBookedSlots(@Param("w") Long warehouseId);

    @Query(value = """
            SELECT generate_series(1, :total) EXCEPT SELECT slot_number::int FROM slots WHERE warehouse_id = :w
            """, nativeQuery = true)
    List<Integer> findAvailableNumbers(@Param("w") Long warehouseId, @Param("total") int total);

}

