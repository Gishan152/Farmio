# Waste Agent Payment Integration

## Overview
This document describes the implementation of PayHere payment gateway integration for waste agents, allowing them to pay farmers for waste collections.

## Backend Changes

### 1. PaymentService.java (waste-service)
**Location:** `backend/waste-service/src/main/java/com/springcloud/service/PaymentService.java`

Added the `initiateWastePayment` method that:
- Validates the payment exists and belongs to the requesting agent
- Checks the payment status is PENDING
- Creates a `PaymentInitiationRequest` with:
  - **Escrow Percentage:** 100% (full amount held in escrow)
  - **Payment Type:** "WASTE"
  - **Payer:** Waste agent (agentId)
  - **Payee:** Farmer/Requester (requesterId)
- Calls the payment-service via Feign client to initiate PayHere payment
- Returns `PayHerePaymentResponse` with checkout URL and payment parameters

**Key Features:**
```java
public PayHerePaymentResponse initiateWastePayment(Long agentId, Long paymentId) {
    // Validates ownership and payment state
    // Creates payment initiation with 100% escrow
    PaymentInitiationRequest paymentInitRequest = new PaymentInitiationRequest(
        payment.getId().toString(),
        payment.getGrossAmount().doubleValue(),
        payment.getAgentId(),        // payer (agent)
        payment.getRequesterId(),     // payee (farmer)
        "WASTE",                      // payment type
        100.0,                        // 100% escrow
        "Waste payment for listing #" + listing.getId()
    );
    return paymentServiceClient.initiatePayment(paymentInitRequest);
}
```

### 2. PaymentController.java (waste-service)
**Location:** `backend/waste-service/src/main/java/com/springcloud/controller/PaymentController.java`

The endpoint was already present:
```java
@PostMapping("/{id}/pay")
public PayHerePaymentResponse initiatePay(
    @RequestHeader("X-User-Id") String userId,
    @PathVariable("id") Long paymentId
) {
    Long agentId = Long.valueOf(userId);
    return paymentService.initiateWastePayment(agentId, paymentId);
}
```

## Frontend Changes

### 3. Payments.jsx (WasteAgent)
**Location:** `frontend/src/Pages/WasteAgent/Sections/Payments.jsx`

Updated `handleMakePayment` function to:
- Call `/api/waste/payments/{paymentId}/pay` endpoint
- Receive PayHere payment parameters from backend
- Dynamically create and submit a PayHere checkout form
- Redirect user to PayHere payment gateway

**Implementation:**
```javascript
const handleMakePayment = async (paymentId) => {
    try {
        // Call backend to initiate payment
        const res = await api.post(`/api/waste/payments/${paymentId}/pay`);
        
        if (res.data && res.data.hash) {
            // Create dynamic form with PayHere parameters
            const form = document.createElement("form");
            form.method = "POST";
            form.action = "https://sandbox.payhere.lk/pay/checkout";
            
            // Add all payment fields (merchantId, orderId, amount, hash, etc.)
            // Submit form to redirect to PayHere
            form.submit();
        }
    } catch (err) {
        // Error handling with toast notifications
    }
};
```

## Payment Flow

1. **Waste Agent** clicks "Process Payment" button in Payments tab
2. **Frontend** calls `POST /api/waste/payments/{id}/pay`
3. **Backend (waste-service)** validates and creates payment initiation request:
   - Type: WASTE
   - Escrow: 100%
4. **Backend (payment-service)** generates PayHere parameters and MD5 hash
5. **Frontend** receives PayHere parameters and submits form to PayHere gateway
6. **User** completes payment on PayHere
7. **PayHere** sends notification to `notify_url` (payment-service webhook)
8. **Payment-service** updates escrow status
9. **User** redirected back to waste agent payments page

## Security Features

- User ID validation from JWT headers
- Payment ownership verification
- Payment state validation (must be PENDING)
- 100% escrow protection for farmers
- Secure hash generation for PayHere

## Return URLs

- **Success/Return URL:** `{origin}/waste-agent/payments`
- **Cancel URL:** `{origin}/waste-agent/payments`
- **Notify URL:** `http://localhost:8080/api/payment/payhere/notify`

## Payment States

1. **PENDING** - Initial state, payment can be initiated
2. **PROCESSING** - Payment initiated (handled by PayHere)
3. **PAID** - Payment completed successfully
4. **FAILED** - Payment failed

## Testing

To test the integration:
1. Navigate to Waste Agent > Payments
2. Find a payment with status "PENDING"
3. Click "Process Payment" button
4. Complete payment on PayHere sandbox
5. Verify payment status updates after webhook notification

## Build Status

✅ Build successful: `waste-service` compiled without errors
