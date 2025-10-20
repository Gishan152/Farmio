# Quick Fix: Manual Database Column Addition

## Problem
Neon serverless database closes connections during Hibernate schema updates, preventing automatic migration.

## Solution: Manual SQL Execution

### Option 1: Using psql Command Line

Run this in your terminal (PowerShell):

```powershell
$env:PGPASSWORD='npg_l2wurAbES8Cq'; psql -h ep-dry-snow-a1szex24-pooler.ap-southeast-1.aws.neon.tech -U neondb_owner -d wastedb -c "ALTER TABLE requests ADD COLUMN IF NOT EXISTS accepted_by_agent_id BIGINT, ADD COLUMN IF NOT EXISTS accepted_by_agent_name VARCHAR(255);"
```

### Option 2: Using Neon Web Console

1. Go to https://console.neon.tech
2. Select your project
3. Go to SQL Editor
4. Run this SQL:

```sql
ALTER TABLE requests 
ADD COLUMN IF NOT EXISTS accepted_by_agent_id BIGINT,
ADD COLUMN IF NOT EXISTS accepted_by_agent_name VARCHAR(255);
```

### Option 3: Temporarily Use create-drop (Dangerous!)

⚠️ **WARNING: This will DELETE all data in your database!**

Only use if you don't have important data.

1. Change `application.yml`:
```yaml
jpa:
  hibernate:
    ddl-auto: create-drop  # DANGER: Drops all tables!
```

2. Start service (will recreate all tables with new columns)
3. Change back to `validate`

## Recommended: Option 2 (Web Console)

This is the safest and easiest option. The SQL uses `IF NOT EXISTS` so it's safe to run multiple times.

## After Running SQL

1. Change `application.yml` back to:
```yaml
jpa:
  hibernate:
    ddl-auto: validate
```

2. Remove or reduce Hikari settings (they're not helping with Neon's serverless timeout):
```yaml
datasource:
  url: jdbc:postgresql://...
  username: neondb_owner
  password: npg_l2wurAbES8Cq
  driver-class-name: org.postgresql.Driver
```

3. Restart waste-service:
```powershell
cd backend/waste-service
mvn spring-boot:run
```

## Verification

Once service starts, test the endpoint:
```powershell
curl http://localhost:8088/api/waste/requests/my-requests -H "X-User-Name: testuser"
```

Should return `200 OK` with your requests list.
