-- Create waste_agents table
CREATE TABLE IF NOT EXISTS waste_agents (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    postal_code VARCHAR(10),
    license_number VARCHAR(50) UNIQUE,
    company_name VARCHAR(100),
    specialization VARCHAR(50),
    service_radius DECIMAL(8,2),
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waste_agents_city ON waste_agents(city);
CREATE INDEX IF NOT EXISTS idx_waste_agents_specialization ON waste_agents(specialization);
CREATE INDEX IF NOT EXISTS idx_waste_agents_active ON waste_agents(is_active);
CREATE INDEX IF NOT EXISTS idx_waste_agents_verified ON waste_agents(is_verified);
CREATE INDEX IF NOT EXISTS idx_waste_agents_rating ON waste_agents(rating);
CREATE INDEX IF NOT EXISTS idx_waste_agents_email ON waste_agents(email);
CREATE INDEX IF NOT EXISTS idx_waste_agents_license_number ON waste_agents(license_number);
CREATE INDEX IF NOT EXISTS idx_waste_agents_active_verified ON waste_agents(is_active, is_verified);

-- Insert sample data
INSERT INTO waste_agents (
    name, email, phone_number, address, city, state, postal_code, 
    license_number, company_name, specialization, service_radius, 
    rating, total_reviews, is_active, is_verified
) VALUES 
(
    'John Smith', 
    'john.smith@ecowaste.com', 
    '+1234567890', 
    '123 Green St', 
    'New York', 
    'NY', 
    '10001', 
    'WA001', 
    'EcoWaste Solutions', 
    'organic', 
    25.0, 
    4.5, 
    12, 
    true, 
    true
),
(
    'Maria Garcia', 
    'maria.garcia@cleanearth.com', 
    '+1234567891', 
    '456 Clean Ave', 
    'Los Angeles', 
    'CA', 
    '90001', 
    'WA002', 
    'Clean Earth Inc', 
    'electronic', 
    30.0, 
    4.2, 
    8, 
    true, 
    true
),
(
    'David Johnson', 
    'david.johnson@greenrecycle.com', 
    '+1234567892', 
    '789 Recycle Blvd', 
    'Chicago', 
    'IL', 
    '60601', 
    'WA003', 
    'Green Recycle Co', 
    'general', 
    20.0, 
    4.8, 
    25, 
    true, 
    true
),
(
    'Sarah Wilson', 
    'sarah.wilson@hazmat.com', 
    '+1234567893', 
    '321 Safety Rd', 
    'Houston', 
    'TX', 
    '77001', 
    'WA004', 
    'HazMat Disposal', 
    'hazardous', 
    50.0, 
    4.7, 
    15, 
    true, 
    true
),
(
    'Mike Brown', 
    'mike.brown@organicwaste.com', 
    '+1234567894', 
    '654 Compost Way', 
    'Phoenix', 
    'AZ', 
    '85001', 
    'WA005', 
    'Organic Waste Management', 
    'organic', 
    35.0, 
    4.1, 
    6, 
    true, 
    false
),
(
    'Lisa Anderson', 
    'lisa.anderson@metalrecovery.com', 
    '+1234567895', 
    '987 Metal St', 
    'Philadelphia', 
    'PA', 
    '19101', 
    'WA006', 
    'Metal Recovery Solutions', 
    'electronic', 
    40.0, 
    4.6, 
    18, 
    true, 
    true
),
(
    'Robert Taylor', 
    'robert.taylor@generalwaste.com', 
    '+1234567896', 
    '147 Disposal Ave', 
    'San Antonio', 
    'TX', 
    '78201', 
    'WA007', 
    'General Waste Co', 
    'general', 
    15.0, 
    3.9, 
    4, 
    false, 
    false
),
(
    'Jennifer Davis', 
    'jennifer.davis@ecosafe.com', 
    '+1234567897', 
    '258 Eco Lane', 
    'San Diego', 
    'CA', 
    '92101', 
    'WA008', 
    'EcoSafe Disposal', 
    'hazardous', 
    45.0, 
    4.4, 
    11, 
    true, 
    true
),
(
    'William Miller', 
    'william.miller@compostking.com', 
    '+1234567898', 
    '369 Organic Dr', 
    'Dallas', 
    'TX', 
    '75201', 
    'WA009', 
    'Compost King', 
    'organic', 
    28.0, 
    4.3, 
    9, 
    true, 
    true
),
(
    'Amanda Wilson', 
    'amanda.wilson@techrecycle.com', 
    '+1234567899', 
    '741 Tech Blvd', 
    'San Jose', 
    'CA', 
    '95101', 
    'WA010', 
    'Tech Recycle Solutions', 
    'electronic', 
    22.0, 
    4.9, 
    31, 
    true, 
    true
);

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at column
DROP TRIGGER IF EXISTS update_waste_agents_updated_at ON waste_agents;
CREATE TRIGGER update_waste_agents_updated_at 
    BEFORE UPDATE ON waste_agents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();