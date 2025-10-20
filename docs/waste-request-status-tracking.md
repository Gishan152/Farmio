# Waste Request Status Tracking Implementation

## Overview
This document outlines the implementation of request status tracking for waste collection requests made by warehouse owners.

## Backend Changes

### 1. Request Model Updates
**File**: `backend/waste-service/src/main/java/com/springcloud/model/Request.java`

Added fields:
```java
private Long acceptedByAgentId;
private String acceptedByAgentName;
```

Updated status comment to include all states:
```
// Status: Pending / Accepted / Rejected / In Progress / Completed / Payment Pending / Paid
```

### 2. RequestDTO Updates
**File**: `backend/waste-service/src/main/java/com/springcloud/dto/RequestDTO.java`

Added corresponding DTO fields:
```java
private Long acceptedByAgentId;
private String acceptedByAgentName;
```

### 3. RequestMapper Updates
**File**: `backend/waste-service/src/main/java/com/springcloud/mapper/RequestMapper.java`

Added mappings for new fields to eliminate compilation warnings.

### 4. RequestService Updates
**File**: `backend/waste-service/src/main/java/com/springcloud/service/RequestService.java`

Updated `acceptRequest` method to store agent ID:
```java
request.setAcceptedByAgentId(agentId);
```

## Request Status Flow

### Status Progression

1. **Pending** → Initial state when warehouse owner creates request
2. **Accepted** → Waste agent accepts the request
3. **In Progress** → Waste agent starts collection (updates WasteListing status)
4. **Completed** → Waste agent completes collection
5. **Payment Pending** → Collection complete, payment initiated
6. **Paid** → Payment confirmed

### Status Colors (Frontend)

- **Pending**: Yellow (`bg-yellow-100 text-yellow-800`)
- **Accepted**: Green (`bg-green-100 text-green-800`)
- **In Progress**: Blue (`bg-blue-100 text-blue-800`) with spinning icon
- **Completed**: Purple (`bg-purple-100 text-purple-800`)
- **Payment Pending**: Orange (`bg-orange-100 text-orange-800`)
- **Paid**: Emerald (`bg-emerald-100 text-emerald-800`)
- **Rejected**: Red (`bg-red-100 text-red-800`)

### Status Icons

- **Pending**: `RotateCcw` (yellow)
- **Accepted**: `CheckCircle` (green)
- **In Progress**: `RotateCcw` (blue, animated spin)
- **Completed**: `CheckCircle` (purple)
- **Payment Pending**: `DollarSign` (orange)
- **Paid**: `Banknote` (emerald)
- **Rejected**: `XMarkIcon` (gray)

## Frontend UI Changes

### New Table-Based Layout

The WasteRequest component now matches the WasteListings design with:

#### 1. Header Section
- Title: "My Waste Requests"
- Description: "Manage your waste collection requests"
- "Create New Request" button (green)

#### 2. Filters Section
Contains:
- **Waste Type** input (text filter)
- **Location** dropdown (Popover + Command for searchable districts)
- **Status** select dropdown with all statuses

#### 3. Table Columns
1. **Request ID**: ID # and date
2. **Waste Details**: Type and description (truncated to 40 chars)
3. **Location**: With location icon
4. **Quantity**: Full quantity string (e.g., "280 kg")
5. **Pricing**: Price per unit + total (with NumberFlow animation)
6. **Pickup Time**: Preferred time slot
7. **Status**: Badge with icon
8. **Actions**: Dropdown menu with View Details / Cancel

#### 4. Loading States
- 5 skeleton rows with animated pulse effect
- Matches WasteListings skeleton design

#### 5. Empty State
- "No requests found" message
- Centered layout

#### 6. Actions Dropdown
Uses `HiDotsVertical` icon with menu:
- **View Details**: Always available
- **Cancel Request**: Only for "Pending" status

#### 7. Details Modal
Enhanced to show:
- Status with icon and badge
- Request ID and date
- Waste type and quantity (2-column grid)
- Location (blue background)
- Pickup time (green background)
- Pricing (green and blue bordered cards)
- Description (gray background)
- **Accepted By Agent** (purple background) - shown if agent accepted

## Component Structure

### Imports
```javascript
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/WasteUI/table';
import { Toaster, toast } from 'sonner';
import { IoLocationOutline, IoFilter } from 'react-icons/io5';
import NumberFlow from '@number-flow/react';
import { HiDotsVertical } from 'react-icons/hi';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/Components/WasteUI/dropdown-menu';
import { CardDescription, CardTitle } from '@/Components/WasteUI/card';
import { CheckCircle, RotateCcw, DollarSign, Banknote } from 'lucide-react';
```

### State Management
```javascript
const [filters, setFilters] = useState({
    wasteType: '',
    location: '',
    status: 'All',
});
```

Removed:
- `searchTerm` (replaced with `filters.wasteType`)
- `statusFilter` (replaced with `filters.status`)

### Key Functions

#### `getStatusBadge(status)`
Returns appropriate background and text color classes for each status.

#### `getStatusIcon(status)`
Returns appropriate Lucide React icon component for each status.

#### Filtering Logic
```javascript
const filteredRequests = requests.filter(request => {
    const matchesWasteType = !filters.wasteType || request.wasteType?.toLowerCase().includes(filters.wasteType.toLowerCase());
    const matchesLocation = !filters.location || request.requesterLocation?.toLowerCase().includes(filters.location.toLowerCase());
    const matchesStatus = filters.status === 'All' || request.status === filters.status;
    
    return matchesWasteType && matchesLocation && matchesStatus;
});
```

## API Integration

### Request Status Updates
The waste agent updates the WasteListing status which should be reflected in the Request:

```javascript
// Waste agent updates listing status
PUT /api/waste/listings/{listingId}/status?status=IN_PROGRESS
PUT /api/waste/listings/{listingId}/status?status=COMPLETED
```

**Future Enhancement**: Add endpoint to sync Request status with associated WasteListing:
```java
// In RequestController
@PutMapping("/{id}/sync-status")
public RequestDTO syncStatusFromListing(@PathVariable Long id) {
    // Find associated listing and copy status
}
```

## Testing Checklist

### Backend
- [x] Request model compiles with new fields
- [x] RequestDTO includes agent fields
- [x] RequestMapper handles all mappings
- [x] acceptRequest stores agent ID
- [ ] Test GET /api/waste/requests/my-requests returns agent info
- [ ] Verify agent info persists after accepting request

### Frontend
- [ ] Table renders correctly with all columns
- [ ] Status badges show correct colors
- [ ] Status icons display properly
- [ ] Animated spinner works for "In Progress"
- [ ] Filters work for all three fields
- [ ] Location dropdown is searchable
- [ ] NumberFlow animates price values
- [ ] Details modal shows agent info when available
- [ ] Cancel button only visible for "Pending" status
- [ ] Toast notifications work for all actions
- [ ] Loading skeletons display during fetch
- [ ] Empty state shows when no results

## Migration Notes

### Breaking Changes
- Grid layout replaced with table
- Search bar removed (waste type filter replaces it)
- Card-based design replaced with row-based design

### Preserved Features
- Create modal (unchanged)
- Details modal (enhanced with agent info)
- Form validation
- Auto-calculated total offer
- All dropdown options
- Cancel functionality

## Next Steps

1. **Implement Status Synchronization**
   - Create listener for WasteListing status changes
   - Update Request status automatically
   - Notify warehouse owner of status changes

2. **Payment Integration**
   - Add payment initiation from "Completed" status
   - Update to "Payment Pending" when payment starts
   - Mark as "Paid" when PayHere confirms payment

3. **Real-time Updates**
   - Add WebSocket connection
   - Push status updates to warehouse owner
   - Show notifications for status changes

4. **Agent Contact**
   - Add "Contact Agent" button in details modal
   - Link to chat with agent
   - Show agent profile information

## File Manifest

### Modified Files
1. `backend/waste-service/src/main/java/com/springcloud/model/Request.java`
2. `backend/waste-service/src/main/java/com/springcloud/dto/RequestDTO.java`
3. `backend/waste-service/src/main/java/com/springcloud/mapper/RequestMapper.java`
4. `backend/waste-service/src/main/java/com/springcloud/service/RequestService.java`
5. `frontend/src/Pages/Warehouse/Sections/WasteRequest.jsx`

### New Files
1. `docs/waste-request-status-tracking.md` (this file)
