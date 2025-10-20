# Waste Request Management System

## Overview
This document describes the waste request management system that allows warehouse owners and farmers to create, view, and cancel waste collection requests.

## Features

### 1. Create Waste Request
- Warehouse owners can create new waste collection requests
- Required fields:
  - Location
  - Waste type
  - Quantity
  - Price per unit
  - Total offer
- Optional fields:
  - Preferred pickup time
  - Farm rating
  - Avatar URL
  - Description (max 1000 characters)

### 2. View Requests
- Users can view all their created requests
- Requests display:
  - Status (Pending, Accepted, Rejected)
  - Waste type and quantity
  - Location
  - Pricing information
  - Request date
- Search functionality by waste type, location, or description
- Filter by status (All, Pending, Accepted, Rejected)

### 3. Cancel Request
- Users can cancel their pending requests
- Only requests with "Pending" status can be cancelled
- Users can only cancel their own requests
- Confirmation dialog before cancellation

## Backend Implementation

### API Endpoints

#### 1. GET /api/waste/requests/my-requests
**Description:** Get all requests created by the current user

**Headers:**
- `X-User-Name`: Required (username of the current user)
- `Authorization`: Bearer token

**Response:**
```json
[
  {
    "id": 1,
    "requesterName": "warehouse_owner_1",
    "requesterLocation": "Colombo, Sri Lanka",
    "farmRating": 4.5,
    "requesterAvatar": "https://example.com/avatar.jpg",
    "wasteType": "Organic Waste",
    "quantity": "280 kg",
    "preferredPickupTime": "Morning",
    "description": "Fresh vegetable waste",
    "offeredPrice": 25.00,
    "totalOffer": 7000.00,
    "status": "Pending",
    "requestDate": "2025-10-19"
  }
]
```

#### 2. POST /api/waste/requests
**Description:** Create a new waste request

**Headers:**
- `X-User-Name`: Required (username of the current user)
- `Authorization`: Bearer token

**Request Body:**
```json
{
  "requesterLocation": "Colombo, Sri Lanka",
  "farmRating": 4.5,
  "requesterAvatar": "https://example.com/avatar.jpg",
  "wasteType": "Organic Waste",
  "quantity": "280 kg",
  "preferredPickupTime": "Morning",
  "description": "Fresh vegetable waste",
  "offeredPrice": 25.00,
  "totalOffer": 7000.00
}
```

**Response:**
```json
{
  "id": 1,
  "requesterName": "warehouse_owner_1",
  "requesterLocation": "Colombo, Sri Lanka",
  "farmRating": 4.5,
  "requesterAvatar": "https://example.com/avatar.jpg",
  "wasteType": "Organic Waste",
  "quantity": "280 kg",
  "preferredPickupTime": "Morning",
  "description": "Fresh vegetable waste",
  "offeredPrice": 25.00,
  "totalOffer": 7000.00,
  "status": "Pending",
  "requestDate": "2025-10-19"
}
```

#### 3. DELETE /api/waste/requests/{id}/cancel
**Description:** Cancel a pending request

**Headers:**
- `X-User-Name`: Required (username of the current user)
- `Authorization`: Bearer token

**Path Parameters:**
- `id`: Request ID to cancel

**Response:** 204 No Content

**Error Responses:**
- 400 Bad Request: "X-User-Name header is required"
- 403 Forbidden: "You can only cancel your own requests"
- 409 Conflict: "Only pending requests can be cancelled"
- 404 Not Found: "Request not found with id {id}"

### Service Layer

#### RequestService Methods

1. **getRequestsByRequesterName(String requesterName)**
   - Returns all requests created by a specific user
   - Uses `findByRequesterNameContainingIgnoreCase` from repository

2. **cancelRequest(Long id, String requesterName)**
   - Validates that the user owns the request
   - Ensures only pending requests can be cancelled
   - Deletes the request if validation passes

## Frontend Implementation

### Component: WasteRequest.jsx
**Location:** `frontend/src/Pages/Warehouse/Sections/WasteRequest.jsx`

**Features:**
1. **Request List View**
   - Displays all user requests in card format
   - Color-coded status badges
   - Request details in grid layout
   - Cancel button for pending requests

2. **Search & Filters**
   - Search by waste type, location, or description
   - Filter by status (All, Pending, Accepted, Rejected)

3. **Create Request Modal**
   - Form with validation
   - Required and optional fields
   - Character counter for description
   - Error messages for validation failures

### API Service: wasteRequestService.js
**Location:** `frontend/src/API/wasteRequestService.js`

**Methods:**
- `getMyRequests()`: Fetch user's requests
- `createRequest(requestData)`: Create new request
- `cancelRequest(id)`: Cancel a request
- `getAllRequests(status)`: Get all requests (admin/agent view)
- `getRequestById(id)`: Get single request
- `updateRequestStatus(id, status)`: Update request status
- `acceptRequest(id, relatedListingId)`: Accept a request

### Routing

**Route:** `/warehouse/waste-requests`

Added to `WarehouseRoutes.js`:
```javascript
{
    path: 'waste-requests',
    Component: WasteRequest
}
```

### Navigation

Added to warehouse sidebar:
```javascript
{ 
    label: 'Waste Requests', 
    to: '/warehouse/waste-requests', 
    icon: DocumentTextIcon 
}
```

## User Flow

### Creating a Request
1. User clicks "New Request" button
2. Modal form opens with all fields
3. User fills required fields (location, waste type, quantity, price, total)
4. User optionally fills additional details
5. Form validates input
6. On submit, request is created with "Pending" status
7. Request date is automatically set to current date
8. Modal closes and request list refreshes

### Viewing Requests
1. User navigates to "Waste Requests" from sidebar
2. System loads all requests created by the user
3. Requests are displayed with full details
4. User can search or filter requests
5. Status is clearly indicated with color-coded badges

### Cancelling a Request
1. User finds a pending request
2. Clicks "Cancel" button
3. Confirmation dialog appears
4. On confirmation, request is deleted
5. Request list refreshes

## Validation Rules

### Backend Validation (RequestCreateDTO)
- `requesterLocation`: Required, not blank
- `wasteType`: Required, not blank
- `quantity`: Required, not blank
- `offeredPrice`: Required, must be positive (> 0)
- `totalOffer`: Required, must be positive (> 0)
- `farmRating`: Optional, if provided must be between 0.0 and 5.0
- `description`: Optional, max 1000 characters

### Frontend Validation
- Location: Required, cannot be empty
- Waste Type: Required, cannot be empty
- Quantity: Required, cannot be empty
- Price per Unit: Required, must be > 0
- Total Offer: Required, must be > 0
- Farm Rating: Optional, must be between 0 and 5
- Description: Optional, max 1000 characters with counter

## Status Workflow

1. **Pending**: Initial status when request is created
   - User can cancel
   - Waste agents can accept or reject

2. **Accepted**: Waste agent has accepted the request
   - Request cannot be cancelled
   - Creates a WasteListing in the system

3. **Rejected**: Waste agent has rejected the request
   - Request cannot be cancelled
   - No further action possible

## Security

1. **Authentication**: All endpoints require valid JWT token
2. **Authorization**: Users can only view and cancel their own requests
3. **Headers**: 
   - `X-User-Name` header identifies the current user
   - Backend validates ownership before allowing operations

## Database Schema

### Request Table
```sql
CREATE TABLE requests (
    id BIGSERIAL PRIMARY KEY,
    requester_name VARCHAR(255),
    requester_location VARCHAR(255),
    farm_rating DECIMAL(3,2),
    requester_avatar VARCHAR(255),
    waste_type VARCHAR(255),
    quantity VARCHAR(255),
    preferred_pickup_time VARCHAR(255),
    description TEXT,
    offered_price DECIMAL(10,2),
    total_offer DECIMAL(10,2),
    status VARCHAR(50),
    request_date DATE
);
```

## Future Enhancements

1. **Real-time Notifications**: Notify users when request status changes
2. **Request History**: View cancelled and expired requests
3. **Request Templates**: Save common request configurations
4. **Bulk Operations**: Create multiple similar requests at once
5. **Request Editing**: Allow editing pending requests
6. **Image Upload**: Attach photos of waste
7. **Location Autocomplete**: Google Maps integration for location
8. **Price Suggestions**: AI-based price recommendations
9. **Request Expiry**: Auto-expire old pending requests
10. **Analytics**: Track request patterns and success rates

## Testing

### Manual Testing Checklist

#### Create Request
- [ ] Can create request with all required fields
- [ ] Validation works for missing required fields
- [ ] Optional fields are truly optional
- [ ] Description character limit enforced
- [ ] Rating validation (0-5) works
- [ ] Price validation (positive numbers) works
- [ ] Request appears in list after creation
- [ ] Status is set to "Pending"
- [ ] Request date is set to today

#### View Requests
- [ ] All user requests are displayed
- [ ] Search functionality works
- [ ] Status filter works correctly
- [ ] Request details are accurate
- [ ] Empty state shows when no requests

#### Cancel Request
- [ ] Cancel button only appears for pending requests
- [ ] Confirmation dialog appears
- [ ] Request is deleted on confirmation
- [ ] Cannot cancel accepted requests
- [ ] Cannot cancel rejected requests
- [ ] Cannot cancel other users' requests
- [ ] Error messages display correctly

## Build and Deploy

### Backend
```bash
cd backend/waste-service
mvn clean package -DskipTests
```

### Frontend
The component is automatically included in the warehouse section. No additional build steps required.

## Support

For issues or questions, contact the development team or create an issue in the project repository.
