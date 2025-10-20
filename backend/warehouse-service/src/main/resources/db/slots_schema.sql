-- Slot Management System Database Schema
-- This script creates the slots table and its related indexes

-- Create slots table
CREATE TABLE IF NOT EXISTS slots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slot_number VARCHAR(20) NOT NULL,
    warehouse_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL,
    capacity_kg INT NOT NULL,
    current_load_kg INT DEFAULT 0,
    reserved_load_kg INT DEFAULT 0,
    product_type VARCHAR(100),
    reserved_by_user_id BIGINT,
    reserved_until TIMESTAMP,
    last_cleaned TIMESTAMP,
    temperature DECIMAL(5,2),
    humidity DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT uk_warehouse_slot_number UNIQUE (warehouse_id, slot_number),
    CONSTRAINT chk_capacity_positive CHECK (capacity_kg > 0),
    CONSTRAINT chk_current_load_non_negative CHECK (current_load_kg >= 0),
    CONSTRAINT chk_reserved_load_non_negative CHECK (reserved_load_kg >= 0),
    CONSTRAINT chk_temperature_range CHECK (temperature BETWEEN -50 AND 50),
    CONSTRAINT chk_humidity_range CHECK (humidity BETWEEN 0 AND 100),
    CONSTRAINT chk_status_valid CHECK (status IN ('AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE', 'OUT_OF_ORDER', 'CLEANING')),
    
    -- Foreign key to warehouses table (assuming it exists)
    CONSTRAINT fk_slot_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_slots_warehouse_id ON slots(warehouse_id);
CREATE INDEX idx_slots_status ON slots(status);
CREATE INDEX idx_slots_reserved_by_user ON slots(reserved_by_user_id);
CREATE INDEX idx_slots_reserved_until ON slots(reserved_until);
CREATE INDEX idx_slots_product_type ON slots(product_type);
CREATE INDEX idx_slots_last_cleaned ON slots(last_cleaned);

-- Create index for available capacity queries
CREATE INDEX idx_slots_availability ON slots(warehouse_id, status, capacity_kg, current_load_kg, reserved_load_kg);

-- Insert some sample data (optional - for testing)
-- This assumes warehouse with id 1 exists
INSERT INTO slots (slot_number, warehouse_id, status, capacity_kg, current_load_kg, reserved_load_kg) VALUES
('A001', 1, 'AVAILABLE', 1000, 0, 0),
('A002', 1, 'AVAILABLE', 1000, 0, 0),
('A003', 1, 'OCCUPIED', 1000, 800, 0),
('A004', 1, 'RESERVED', 1000, 0, 500),
('A005', 1, 'MAINTENANCE', 1000, 0, 0),
('B001', 1, 'AVAILABLE', 1500, 0, 0),
('B002', 1, 'AVAILABLE', 1500, 0, 0),
('B003', 1, 'AVAILABLE', 1500, 0, 0),
('C001', 1, 'AVAILABLE', 2000, 0, 0),
('C002', 1, 'AVAILABLE', 2000, 0, 0)
ON DUPLICATE KEY UPDATE 
    status = VALUES(status),
    current_load_kg = VALUES(current_load_kg),
    reserved_load_kg = VALUES(reserved_load_kg);