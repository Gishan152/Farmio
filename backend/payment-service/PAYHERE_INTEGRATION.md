# PayHere Integration Documentation

## Overview
This implementation provides integration with PayHere payment gateway for the Farmio payment service. It supports marketplace payments with escrow functionality, automatic wallet crediting, and comprehensive transaction management.

## Key Features

✅ **PayHere Integration** - Secure payment processing via PayHere gateway  
✅ **Escrow Management** - Automatic escrow split based on percentage  
✅ **Wallet System** - User wallets with balance and escrow tracking  
✅ **Transaction History** - Complete audit trail of all transactions  
✅ **Admin Dashboard** - Payment statistics for admins/moderators  
✅ **Bank Withdrawals** - Secure withdrawal to bank accounts  

## Configuration

Add the following configuration to your `application.yml`:

```yaml
payhere:
  merchant-id: ${PAYHERE_MERCHANT_ID:your_merchant_id}
  merchant-secret: ${PAYHERE_MERCHANT_SECRET:your_merchant_secret}
  notify-url: ${PAYHERE_NOTIFY_URL:http://your-domain.com/api/payment/payhere/notify}
  sandbox: ${PAYHERE_SANDBOX:true}
```

## Environment Variables

Set these environment variables:
- `PAYHERE_MERCHANT_ID`: Your PayHere merchant ID
- `PAYHERE_MERCHANT_SECRET`: Your PayHere merchant secret (specific to your domain/app)
- `PAYHERE_NOTIFY_URL`: Public URL for PayHere notifications
- `PAYHERE_SANDBOX`: Set to `false` for production

## API Endpoints

### 1. Payment Initialization (from other services)
**POST** `/api/payment/payhere/initiate`

```json
{
  "reference": "ORDER_001",
  "amount": 1000.00,
  "payerId": 123,
  "payeeId": 456,
  "escrowPercentage": 10.0,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "0771234567",
  "address": "123 Main St",
  "city": "Colombo",
  "country": "Sri Lanka",
  "returnUrl": "http://app.com/success",
  "cancelUrl": "http://app.com/cancel",
  "description": "Product purchase"
}
```

### 2. Generate Payment Form
**POST** `/api/payment/payhere/form` (Returns HTML)

Same request body as above. Returns HTML form that redirects to PayHere.

### 3. Release Escrow
**POST** `/api/payment/release-escrow`

```json
{
  "reference": "ORDER_001",
  "payeeId": 456
}
```

### 4. Refund Escrow
**POST** `/api/payment/refund-escrow`

```json
{
  "reference": "ORDER_001",
  "payeeId": 456,
  "payerId": 123
}
```

### 5. Withdraw to Bank
**POST** `/api/payment/withdraw`

```json
{
  "userId": 123,
  "amount": 500.00,
  "description": "Monthly withdrawal"
}
```

### 6. Get Wallet Info
**GET** `/api/payment/wallet/{userId}`

Returns wallet balance, escrow amount, and payment history.

### 7. Get Payment Statistics (Admin)
**GET** `/api/payment/statistics`

Returns total amounts, revenue, transaction counts, etc.

## Payment Flow

1. **Service Integration**: Order/Transport service calls `/payhere/initiate`
2. **Payment Creation**: Creates payment record with escrow percentage
3. **Hash Generation**: Generates secure PayHere hash
4. **Redirect**: User redirects to PayHere with form
5. **Payment Processing**: User completes payment on PayHere
6. **Notification**: PayHere sends webhook to `/payhere/notify`
7. **Amount Split**: Automatically splits payment:
   - `amount * escrowPercentage` → Payee's escrow
   - `amount - escrowAmount` → Payee's wallet balance
8. **Transaction Records**: Creates audit trail entries

## Escrow Logic

- **On Payment Success**: Amount is split between escrow and direct wallet credit
- **Release Escrow**: Moves escrowed amount to payee's wallet balance
- **Refund Escrow**: Moves escrowed amount back to payer's wallet
- **Withdrawals**: Only from wallet balance (excludes escrow)

## Security

- All PayHere notifications verified with MD5 hash
- Merchant secret never exposed to client-side
- Escrow amounts protected from unauthorized access
- Complete transaction audit trail

## Integration Example

```java
// In OrderService
@Autowired
private PaymentServiceClient paymentServiceClient;

public void processOrderPayment(Order order) {
    PaymentInitiationRequest request = new PaymentInitiationRequest(
        order.getId(),
        order.getTotalAmount(),
        order.getBuyerId(),
        order.getSellerId(),
        BigDecimal.valueOf(10.0), // 10% escrow
        // ... other customer details
    );
    
    PayHerePaymentResponse response = paymentServiceClient.initiatePayment(request);
    // Redirect user to PayHere with response data
}
```

## Testing

1. Use PayHere sandbox environment
2. Set publicly accessible notify URL
3. Test with real PayHere merchant credentials
4. Verify escrow calculations and wallet updates

## Admin Features

- View payment statistics
- Monitor transaction volumes
- Track escrow amounts
- Generate revenue reports
- Manage user wallet information
