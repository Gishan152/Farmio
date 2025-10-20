package com.springcloud.controller;

import com.springcloud.model.*;
import com.springcloud.repository.WarehouseRepository;
import com.springcloud.repository.SlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.time.LocalDateTime;

@Component
public class AppRunner implements ApplicationRunner {
    @Autowired
    private DataSource ds;
    
    @Autowired
    private WarehouseRepository warehouseRepository;
    
    @Autowired
    private SlotRepository slotRepository;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        try (var conn = ds.getConnection()) {
            System.out.println("Connected to: " + conn.getMetaData().getURL());
            
            // Initialize sample data if warehouses table is empty
            if (warehouseRepository.count() == 0) {
                initializeSampleData();
            }
        }
    }
    
    private void initializeSampleData() {
        System.out.println("Initializing sample warehouse data...");
        
        // Create sample warehouses
        Warehouse warehouse1 = new Warehouse();
        warehouse1.setName("Colombo Cold Storage A");
        warehouse1.setAddress("Industrial Zone, Colombo 15");
        warehouse1.setCity("Colombo");
        warehouse1.setStorageType(StorageType.COLD_STORAGE);
        warehouse1.setTemperatureMin(2);
        warehouse1.setTemperatureMax(8);
        warehouse1.setTotalSlots(50);
        warehouse1.setCapacityPerSlot(100);
        warehouse1.setTotalCapacity(5000);
        warehouse1.setPricePerKg(25.0);
        warehouse1.setCertifications("HACCP, ISO 22000");
        warehouse1.setStatus(WarehouseStatus.OPEN);
        warehouse1.setKeeperName("John Perera");
        warehouse1.setKeeperContact("0771234567");
        warehouse1.setKeeperEmail("john@coldstorage.lk");
        warehouse1.setOwnerId(1L);
        warehouse1.setCreatedAt(LocalDateTime.now());
        warehouse1.setUpdatedAt(LocalDateTime.now());
        warehouse1 = warehouseRepository.save(warehouse1);
        
        Warehouse warehouse2 = new Warehouse();
        warehouse2.setName("Kandy Dry Storage Facility");
        warehouse2.setAddress("Peradeniya Road, Kandy");
        warehouse2.setCity("Kandy");
        warehouse2.setStorageType(StorageType.DRY_STORAGE);
        warehouse2.setTemperatureMin(15);
        warehouse2.setTemperatureMax(25);
        warehouse2.setTotalSlots(30);
        warehouse2.setCapacityPerSlot(150);
        warehouse2.setTotalCapacity(4500);
        warehouse2.setPricePerKg(15.0);
        warehouse2.setCertifications("Food Safety, GMP");
        warehouse2.setStatus(WarehouseStatus.OPEN);
        warehouse2.setKeeperName("Saman Silva");
        warehouse2.setKeeperContact("0719876543");
        warehouse2.setKeeperEmail("saman@drystorage.lk");
        warehouse2.setOwnerId(1L);
        warehouse2.setCreatedAt(LocalDateTime.now());
        warehouse2.setUpdatedAt(LocalDateTime.now());
        warehouse2 = warehouseRepository.save(warehouse2);
        
        Warehouse warehouse3 = new Warehouse();
        warehouse3.setName("Galle Freezer Complex");
        warehouse3.setAddress("Port Area, Galle");
        warehouse3.setCity("Galle");
        warehouse3.setStorageType(StorageType.FREEZER);
        warehouse3.setTemperatureMin(-18);
        warehouse3.setTemperatureMax(-10);
        warehouse3.setTotalSlots(25);
        warehouse3.setCapacityPerSlot(200);
        warehouse3.setTotalCapacity(5000);
        warehouse3.setPricePerKg(35.0);
        warehouse3.setCertifications("HACCP, FDA Approved");
        warehouse3.setStatus(WarehouseStatus.OPEN);
        warehouse3.setKeeperName("Kumari Fernando");
        warehouse3.setKeeperContact("0778765432");
        warehouse3.setKeeperEmail("kumari@gallefreezer.lk");
        warehouse3.setOwnerId(1L);
        warehouse3.setCreatedAt(LocalDateTime.now());
        warehouse3.setUpdatedAt(LocalDateTime.now());
        warehouse3 = warehouseRepository.save(warehouse3);
        
        // Create sample slots for each warehouse
        createSampleSlots(warehouse1);
        createSampleSlots(warehouse2);
        createSampleSlots(warehouse3);
        
        System.out.println("Sample warehouse data initialized successfully!");
    }
    
    private void createSampleSlots(Warehouse warehouse) {
        System.out.println("Creating slots for warehouse: " + warehouse.getName());
        
        // Create slots based on warehouse configuration
        int slotsToCreate = Math.min(warehouse.getTotalSlots(), 10); // Create up to 10 sample slots
        
        for (int i = 1; i <= slotsToCreate; i++) {
            Slot slot = new Slot();
            slot.setSlotNumber(String.format("S%03d", i));
            slot.setWarehouseId(warehouse.getId());
            slot.setCapacityKg(warehouse.getCapacityPerSlot());
            slot.setCurrentLoadKg(0);
            slot.setReservedLoadKg(0);
            
            // Set different statuses for variety
            if (i <= 6) {
                slot.setStatus(SlotStatus.AVAILABLE);
            } else if (i <= 8) {
                slot.setStatus(SlotStatus.OCCUPIED);
                slot.setCurrentLoadKg(warehouse.getCapacityPerSlot() * 80 / 100); // 80% occupied
            } else {
                slot.setStatus(SlotStatus.RESERVED);
                slot.setReservedLoadKg(warehouse.getCapacityPerSlot() * 50 / 100); // 50% reserved
                slot.setReservedByUserId(2L);
                slot.setReservedUntil(LocalDateTime.now().plusDays(7));
            }
            
            slot.setCreatedAt(LocalDateTime.now());
            slot.setUpdatedAt(LocalDateTime.now());
            slotRepository.save(slot);
        }
        
        System.out.println("Created " + slotsToCreate + " slots for " + warehouse.getName());
    }
}
