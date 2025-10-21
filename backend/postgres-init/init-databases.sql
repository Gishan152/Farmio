-- Create databases for all services
CREATE DATABASE userdb;
CREATE DATABASE transportdb;
CREATE DATABASE orderdb;
CREATE DATABASE wastedb;
CREATE DATABASE warehousedb;
CREATE DATABASE productdb;
CREATE DATABASE paymentdb;
CREATE DATABASE notificationdb;
CREATE DATABASE chatdb;
CREATE DATABASE analyticdb;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE userdb TO postgres;
GRANT ALL PRIVILEGES ON DATABASE transportdb TO postgres;
GRANT ALL PRIVILEGES ON DATABASE orderdb TO postgres;
GRANT ALL PRIVILEGES ON DATABASE wastedb TO postgres;
GRANT ALL PRIVILEGES ON DATABASE warehousedb TO postgres;
GRANT ALL PRIVILEGES ON DATABASE productdb TO postgres;
GRANT ALL PRIVILEGES ON DATABASE paymentdb TO postgres;
GRANT ALL PRIVILEGES ON DATABASE notificationdb TO postgres;
GRANT ALL PRIVILEGES ON DATABASE chatdb TO postgres;
GRANT ALL PRIVILEGES ON DATABASE analyticdb TO postgres;
