# PayHere Integration Documentation

## Overview
This implementation provides integration with PayHere payment gateway for the Farmio payment service. It supports initiating payments, handling notifications, and automatically crediting user wallets upon successful payments.

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

### 1. Initiate PayHere Payment
**POST** `/api/payment/payhere/initiate`

Request body:
```json
{
  "userId": 123,
  "orderId": "ORDER_001",
  "items": "Product Purchase",
  "currency": "LKR",
  "amount": 1000.00,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "0771234567",
  "address": "123 Main Street",
  "city": "Colombo",
  "country": "Sri Lanka",
  "returnUrl": "http://your-app.com/payment/success",
  "cancelUrl": "http://your-app.com/payment/cancel",
  "custom1": "user_id_123",
  "custom2": "order_type_product"
}
```

Response:
```json
{
  "status": "SUCCESS",
  "message": "Payment initiated successfully",
  "checkoutUrl": "https://sandbox.payhere.lk/pay/checkout",
  "orderId": "ORDER_001",
  "hash": "generated_hash_value"
}
```

### 2. Generate PayHere Payment Form
**POST** `/api/payment/payhere/form` (Returns HTML)

Same request body as above. Returns an HTML form that automatically redirects to PayHere.

### 3. PayHere Notification Handler (Webhook)
**POST** `/api/payment/payhere/notify`

This endpoint is called by PayHere automatically. Do not call manually.

## Payment Flow

1. **Frontend calls** `/api/payment/payhere/form` with payment details
2. **Service generates** HTML form with PayHere parameters and hash
3. **User is redirected** to PayHere payment gateway
4. **User completes payment** on PayHere
5. **PayHere calls** `/api/payment/payhere/notify` with payment result
6. **Service verifies** payment notification and updates database
7. **On success**, funds are automatically added to user's wallet
8. **User is redirected** back to your return URL

## Security

- All payment notifications are verified using MD5 hash
- Merchant secret is never exposed to client-side
- Payment status is only updated after successful verification

## Testing

For testing, use PayHere sandbox:
- Set `payhere.sandbox=true` in configuration
- Use test merchant credentials
- Use publicly accessible notify URL (not localhost)

## Error Handling

The service handles various error scenarios:
- Invalid payment notifications (verification failed)
- Payment failures, cancellations, and chargebacks
- Network errors and timeouts

All errors are logged and appropriate responses are sent to PayHere.

## Wallet Integration

Upon successful payment:
1. User's wallet balance is automatically increased
2. Transaction record is created
3. Payment status is updated to COMPLETED

The wallet can then be used for:
- Making payments to other users
- Escrow transactions
- Withdrawals to bank accounts
