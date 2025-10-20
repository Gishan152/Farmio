# Testing Request Status Synchronization

## Quick Test Guide

This guide helps you verify that the Request status synchronization is working correctly.

## Prerequisites

1. ✅ Backend services running (waste-service on port 8088)
2. ✅ Frontend running (Vite dev server)
3. ✅ Two user accounts:
   - Warehouse Owner account
   - Waste Agent account

## Test Scenario: Complete Waste Collection Flow

### Step 1: Create Request (Warehouse Owner)

1. **Login** as warehouse owner
2. **Navigate** to "Waste Requests" page
3. **Click** "Create New Request" button
4. **Fill in** the form:
   - Waste Type: e.g., "Plastic"
   - Quantity: e.g., "50"
   - Unit: "kg"
   - Location: Select your location
   - Pickup Date: Choose future date
5. **Submit** the request

**Expected Result**:
- ✅ New row appears in table
- ✅ Status badge shows "Pending" in yellow
- ✅ Spinning loading icon next to "Pending"

### Step 2: Accept Request (Waste Agent)

1. **Login** as waste agent
2. **Navigate** to "Waste Listings" page
3. **Find** the pending request
4. **Click** "Accept" button
5. **Confirm** acceptance

**Expected Result**:
- ✅ Request disappears from agent's pending list
- ✅ New listing appears in agent's active listings with status "ACCEPTED"

### Step 3: Verify Acceptance (Warehouse Owner)

1. **Switch back** to warehouse owner account
2. **Refresh** the page or wait for auto-refresh
3. **Check** the request status

**Expected Result**:
- ✅ Status badge changed to "Accepted" in green
- ✅ Green checkmark icon displayed
- ✅ "Agent" column shows agent's name
- ✅ "Accepted By Agent" field visible in details modal

### Step 4: Start Collection (Waste Agent)

1. **As waste agent**, open the listing details
2. **Click** the status dropdown or "Update Status" button
3. **Select** "IN_PROGRESS" or "In Progress"
4. **Confirm** the status change

**Behind the scenes**:
```
PUT /api/waste/listings/{id}/status?status=IN_PROGRESS
→ WasteListingService.updateStatus()
→ syncRequestStatus() called
→ Request status updated to "In Progress"
```

**Expected Result**:
- ✅ Listing status changes to "IN_PROGRESS"

### Step 5: Verify In Progress (Warehouse Owner)

1. **Switch to** warehouse owner account
2. **Refresh** or wait for auto-refresh
3. **Check** the request status

**Expected Result**:
- ✅ Status badge changed to "In Progress" in blue
- ✅ Spinning refresh icon (RotateCcw) displayed
- ✅ Icon should be animating/spinning
- ✅ Status filter includes "In Progress" option

**If this doesn't work**: The sync implementation is not functioning. Check:
- Backend logs for errors
- Network tab for API responses
- Database to verify Request.status column value

### Step 6: Complete Collection (Waste Agent)

1. **As waste agent**, update the listing again
2. **Select** "COMPLETED" status
3. **Confirm** the completion

**Behind the scenes**:
```
PUT /api/waste/listings/{id}/status?status=COMPLETED
→ WasteListingService.updateStatus()
→ syncRequestStatus() updates Request to "Completed"
→ Payment record created with status "PENDING"
```

**Expected Result**:
- ✅ Listing status changes to "COMPLETED"
- ✅ Payment record appears in agent's payments list

### Step 7: Verify Completion (Warehouse Owner)

1. **Switch to** warehouse owner
2. **Refresh** the page
3. **Check** the request status

**Expected Result**:
- ✅ Status badge changed to "Completed" in purple
- ✅ Purple checkmark icon displayed
- ✅ Row color may be lighter (completed state)

### Step 8: Initiate Payment (Waste Agent)

1. **As waste agent**, go to "Payments" page
2. **Find** the payment for this listing
3. **Click** "Pay Now" or "Initiate Payment"
4. **Confirm** (may redirect to PayHere)

**Behind the scenes**:
```
POST /api/waste/payments/{id}/initiate
→ PaymentService.initiateWastePayment()
→ syncRequestStatusFromPayment() updates Request to "Payment Pending"
```

**Expected Result**:
- ✅ Payment gateway opens (or test mode confirmation)
- ✅ Payment status shows "PENDING"

### Step 9: Verify Payment Pending (Warehouse Owner)

1. **Switch to** warehouse owner
2. **Refresh** the page
3. **Check** the request status

**Expected Result**:
- ✅ Status badge changed to "Payment Pending" in orange
- ✅ Orange dollar sign icon displayed
- ✅ Payment amount visible in details modal

**Critical**: If status is still "Completed", the PaymentService sync is not working.

### Step 10: Complete Payment (Waste Agent/System)

**Option A: Simulate webhook** (if in test mode):
```bash
# Using curl or Postman
PUT http://localhost:8088/api/waste/payments/{paymentId}/status
Content-Type: application/json

{
  "status": "PAID",
  "method": "PayHere",
  "transactionRef": "TEST123456"
}
```

**Option B**: Complete actual PayHere payment flow

**Behind the scenes**:
```
PUT /api/waste/payments/{id}/status
→ PaymentService.updatePaymentStatus()
→ syncRequestStatusFromPayment() updates Request to "Paid"
```

**Expected Result**:
- ✅ Payment status changes to "PAID"

### Step 11: Verify Paid Status (Warehouse Owner)

1. **Switch to** warehouse owner
2. **Final refresh**
3. **Check** the request status

**Expected Result**:
- ✅ Status badge changed to "Paid" in emerald green
- ✅ Green banknote icon displayed
- ✅ Payment reference visible
- ✅ Transaction complete

## Visual Verification Checklist

Use this checklist while testing:

| Step | Expected Status | Badge Color | Icon | Frontend Display |
|------|----------------|-------------|------|------------------|
| Created | Pending | Yellow | RotateCcw | Yellow badge, spinning |
| Accepted | Accepted | Green | CheckCircle | Green badge, static |
| Started | In Progress | Blue | RotateCcw | Blue badge, spinning |
| Finished | Completed | Purple | CheckCircle | Purple badge, static |
| Payment Init | Payment Pending | Orange | DollarSign | Orange badge, static |
| Payment Done | Paid | Emerald | Banknote | Emerald badge, static |

## API Endpoints Reference

### Check Request Status (Warehouse Owner)
```bash
GET http://localhost:8088/api/waste/requests/my-requests
Authorization: Bearer {warehouse_token}
```

**Response** should include:
```json
{
  "id": 1,
  "status": "In Progress",  // This should update!
  "acceptedByAgentId": 123,
  "acceptedByAgentName": "John Agent",
  ...
}
```

### Update Listing Status (Waste Agent)
```bash
PUT http://localhost:8088/api/waste/listings/{id}/status?status=IN_PROGRESS
Authorization: Bearer {agent_token}
```

### Check Payment Status
```bash
GET http://localhost:8088/api/waste/payments/agent/{agentId}
Authorization: Bearer {agent_token}
```

## Troubleshooting

### Problem: Status Not Updating

**Symptoms**: Warehouse owner sees "Accepted" but agent has "IN_PROGRESS"

**Check**:
1. **Backend Logs**: Look for exceptions in WasteListingService
2. **Database**:
   ```sql
   SELECT id, status, accepted_by_agent_id 
   FROM requests 
   WHERE id = {requestId};
   ```
3. **Matching Logic**: Verify requester name, waste type, and agent ID match

### Problem: "In Progress" Never Appears

**Likely Cause**: syncRequestStatus() not finding matching request

**Debug**:
```java
// Add logging to WasteListingService.syncRequestStatus()
System.out.println("Searching for requests with requester: " + 
    listing.getRequester().getName());
System.out.println("Found " + matchingRequests.size() + " requests");
```

### Problem: Payment Status Doesn't Sync

**Likely Cause**: syncRequestStatusFromPayment() failing to find request

**Check**:
1. WasteListing exists for the payment
2. Request exists with matching criteria
3. Agent ID matches between all entities

### Problem: Build Fails

**Solution**:
```bash
cd d:\Projects\Farmio\backend
mvn clean install -DskipTests
mvn -pl waste-service -am package
```

## Database Verification

### Check Request Status Directly:
```sql
SELECT 
    r.id,
    r.status,
    r.waste_type,
    r.accepted_by_agent_id,
    r.accepted_by_agent_name
FROM requests r
WHERE r.id = {requestId};
```

### Check Listing Status:
```sql
SELECT 
    wl.id,
    wl.status,
    wl.waste_type,
    wl.accepted_by
FROM waste_listings wl
WHERE wl.id = {listingId};
```

### Check Payment Status:
```sql
SELECT 
    p.id,
    p.status,
    p.waste_listing_id,
    p.transaction_ref
FROM payments p
WHERE p.waste_listing_id = {listingId};
```

### Verify Sync Relationship:
```sql
SELECT 
    r.id as request_id,
    r.status as request_status,
    wl.id as listing_id,
    wl.status as listing_status,
    p.status as payment_status
FROM requests r
LEFT JOIN waste_listings wl ON wl.accepted_by = r.accepted_by_agent_id 
    AND wl.waste_type = r.waste_type
LEFT JOIN payments p ON p.waste_listing_id = wl.id
WHERE r.id = {requestId};
```

## Success Criteria

The implementation is successful if:

✅ **Warehouse owner sees**:
- Pending → Accepted → In Progress → Completed → Payment Pending → Paid

✅ **Status updates automatically** (with page refresh)

✅ **Icons animate** for "In Progress" status

✅ **Color coding** matches the specification

✅ **Agent information** displays correctly

✅ **No errors** in backend logs

✅ **Database consistency** maintained

## Performance Check

Monitor these metrics:
- API response time: < 500ms
- Status update latency: < 1 second
- Database queries: Maximum 3 per status update
- No N+1 query problems

## Next Steps After Testing

Once verified:
1. Test with multiple simultaneous requests
2. Test concurrent status updates
3. Test error scenarios (network failures, invalid data)
4. Consider adding WebSocket for real-time updates
5. Add automated integration tests
6. Document any edge cases discovered

## Support

If issues persist:
1. Check `REQUEST_STATUS_SYNC_IMPLEMENTATION.md` for detailed flow
2. Review backend logs: `logs/waste-service.log`
3. Check database constraints and indexes
4. Verify all migrations applied correctly
