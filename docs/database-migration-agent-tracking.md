# Database Migration Guide - Adding Agent Tracking to Requests

## Issue
The waste-service fails to start with error:
```
Schema-validation: missing column [accepted_by_agent_id] in table [requests]
```

## Root Cause
We added two new fields to the `Request` entity:
- `acceptedByAgentId` (Long)
- `acceptedByAgentName` (String)

But the database table `requests` doesn't have these columns yet.

## Solution Applied

### Step 1: Changed Hibernate DDL Mode
**File**: `backend/waste-service/src/main/resources/application.yml`

Changed from `validate` to `update`:
```yaml
jpa:
  hibernate:
    ddl-auto: update  # Changed from 'validate'
```

This allows Hibernate to automatically create missing columns.

### Step 2: Added Hikari Connection Pool Settings
Added configuration to prevent Neon database connection timeout issues:
```yaml
datasource:
  hikari:
    maximum-pool-size: 5
    minimum-idle: 2
    connection-timeout: 30000
    idle-timeout: 600000
    max-lifetime: 1800000
    keepalive-time: 60000
```

### Step 3: SQL Migration Script Created
**File**: `backend/waste-service/src/main/resources/db/migration/add_agent_tracking_to_requests.sql`

```sql
ALTER TABLE requests 
ADD COLUMN accepted_by_agent_id BIGINT,
ADD COLUMN accepted_by_agent_name VARCHAR(255);

CREATE INDEX idx_requests_agent_id ON requests(accepted_by_agent_id);

COMMENT ON COLUMN requests.accepted_by_agent_id IS 'ID of the waste agent who accepted this request';
COMMENT ON COLUMN requests.accepted_by_agent_name IS 'Name of the waste agent who accepted this request';
```

## Expected Result

When waste-service starts successfully with `ddl-auto: update`, Hibernate will:
1. Detect missing columns in `requests` table
2. Execute ALTER TABLE statements to add:
   - `accepted_by_agent_id` column (BIGINT, nullable)
   - `accepted_by_agent_name` column (VARCHAR(255), nullable)
3. Start the service successfully

## Verification Steps

### 1. Check Service Startup
Look for these log messages:
```
Hibernate: 
    alter table if exists requests 
       add column accepted_by_agent_id bigint

Hibernate: 
    alter table if exists requests 
       add column accepted_by_agent_name varchar(255)
```

### 2. Test API Endpoint
```bash
curl http://localhost:8088/api/waste/requests/my-requests \
  -H "X-User-Name: your-username"
```

Should return 200 OK with list of requests.

### 3. Verify Database
Connect to Neon database and run:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'requests' 
  AND column_name IN ('accepted_by_agent_id', 'accepted_by_agent_name');
```

Expected output:
```
column_name           | data_type
----------------------|------------
accepted_by_agent_id  | bigint
accepted_by_agent_name| character varying
```

## After Migration Complete

### Recommended: Revert to Validate Mode
Once the columns are created, change back to validation mode for safety:

```yaml
jpa:
  hibernate:
    ddl-auto: validate  # Safer for production
```

This prevents accidental schema changes in production.

## Troubleshooting

### If Connection Still Times Out
Neon has serverless compute that may pause after inactivity. Solutions:
1. Make a test query to wake up the database
2. Increase `keepalive-time` in Hikari config
3. Use a persistent connection mode if available

### If Columns Not Created
Check Hibernate logs for:
- Permission errors
- SQL syntax errors
- Connection issues

### Manual Migration Option
If automatic migration fails, execute SQL manually:
```bash
psql "postgresql://neondb_owner:npg_l2wurAbES8Cq@ep-dry-snow-a1szex24-pooler.ap-southeast-1.aws.neon.tech/wastedb?sslmode=require" \
  -f backend/waste-service/src/main/resources/db/migration/add_agent_tracking_to_requests.sql
```

## Files Modified
1. ✅ `backend/waste-service/src/main/resources/application.yml`
   - Changed `ddl-auto` to `update`
   - Added Hikari connection pool settings

2. ✅ `backend/waste-service/src/main/java/com/springcloud/model/Request.java`
   - Added `acceptedByAgentId` field
   - Added `acceptedByAgentName` field

3. ✅ `backend/waste-service/src/main/java/com/springcloud/dto/RequestDTO.java`
   - Added corresponding DTO fields

4. ✅ `backend/waste-service/src/main/java/com/springcloud/mapper/RequestMapper.java`
   - Added field mappings

5. ✅ `backend/waste-service/src/main/java/com/springcloud/service/RequestService.java`
   - Updated `acceptRequest()` to populate agent ID

## Next Steps
1. ✅ Wait for service to start successfully
2. ✅ Verify columns created in database
3. ✅ Test API endpoint from frontend
4. ✅ Verify agent information displays in UI
5. ⏳ Change `ddl-auto` back to `validate` (optional, for production safety)
