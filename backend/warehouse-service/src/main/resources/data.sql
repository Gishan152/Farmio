-- Database initialization script for slot management
-- This will be executed if the slots table doesn't exist

-- Create slots table if not exists
CREATE TABLE IF NOT EXISTS slots (
    id BIGSERIAL PRIMARY KEY,
    slot_number VARCHAR(20) NOT NULL,
    warehouse_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    capacity_kg INTEGER NOT NULL,
    current_load_kg INTEGER DEFAULT 0,
    reserved_load_kg INTEGER DEFAULT 0,
    product_type VARCHAR(100),
    reserved_by_user_id BIGINT,
    reserved_until TIMESTAMP,
    last_cleaned TIMESTAMP,
    temperature DECIMAL(5,2),
    humidity DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT uk_warehouse_slot_number UNIQUE (warehouse_id, slot_number),
    CONSTRAINT chk_capacity_positive CHECK (capacity_kg > 0),
    CONSTRAINT chk_current_load_non_negative CHECK (current_load_kg >= 0),
    CONSTRAINT chk_reserved_load_non_negative CHECK (reserved_load_kg >= 0),
    CONSTRAINT chk_temperature_range CHECK (temperature BETWEEN -50 AND 50),
    CONSTRAINT chk_humidity_range CHECK (humidity BETWEEN 0 AND 100),
    CONSTRAINT chk_status_valid CHECK (status IN ('AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE', 'OUT_OF_ORDER', 'CLEANING'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_slots_warehouse_id ON slots(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_slots_status ON slots(status);
CREATE INDEX IF NOT EXISTS idx_slots_reserved_by_user ON slots(reserved_by_user_id);
CREATE INDEX IF NOT EXISTS idx_slots_reserved_until ON slots(reserved_until);
CREATE INDEX IF NOT EXISTS idx_slots_product_type ON slots(product_type);
CREATE INDEX IF NOT EXISTS idx_slots_last_cleaned ON slots(last_cleaned);

-- Create index for available capacity queries
CREATE INDEX IF NOT EXISTS idx_slots_availability ON slots(warehouse_id, status, capacity_kg, current_load_kg, reserved_load_kg);

-- Note: Sample data insertion removed to avoid foreign key constraint issues
-- Slots will be created through the API when warehouses exist