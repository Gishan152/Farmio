# Payment Service API Interface

This document describes the unified interface for the Payment Service, including endpoint responsibilities, input/output structures, and usage notes.

---

## Using PayHere for Escrow and Buyer-to-Seller Payments

PayHere can be used as the payment gateway for collecting buyer payments, while escrow and payouts to sellers are managed by your platform's custom wallet logic. Here’s how to achieve this:

### Workflow
1. **Buyer Payment:** Buyer pays via PayHere; funds are received into the platform’s merchant account.
2. **Escrow Logic:** The platform marks the funds as escrowed for the transaction/order in its internal wallet system.
3. **Release to Seller:** Upon order completion, the platform releases the escrowed funds and pays the seller via manual bank transfer or other payout method.
4. **Refunds/Disputes:** Refunds are handled by the platform and initiated via PayHere if needed.

### Key Points
- PayHere is used only for collecting payments; escrow and payouts are managed by your backend.
- Sellers must provide bank details for payouts.
- Payouts are done manually or via online banking, not automated by PayHere.
- Accurate transaction records and compliance are essential.

### Example Database Schema
- `Wallet`: Tracks user balances, escrowed amounts, and transaction history.
- `Transaction`: Records each payment, escrow, release, and refund event.
- `Payout`: Records payouts to sellers, including bank details and status.

### Limitations
- Escrow is simulated in your platform, not by PayHere.
- Payouts to sellers are not automated by PayHere.

This approach is commonly used by Sri Lankan marketplaces to achieve escrow and buyer-to-seller payments with PayHere.

---

## Responsibilities
- Maintain wallet for each user (balance, escrowed amount)
- Track all payments and their status
- Support payments for different types (order, transport, etc.) with references
- Handle escrow transactions (hold, release, refund)
- Generate invoices and receipts
- Provide payment status and tracking
- Maintain audit logs
- Offer admin reporting tools
- Enforce payment limits and controls
- Manage user bank details and withdrawals

---

## API Endpoints

### 1. Wallet Info
**GET** `/api/payment/wallet/{userId}`
- **Input:** `userId` (Long)
- **Output:** `WalletInfo` (balance, escrowedAmount, etc.)
- **Responsibility:** Returns wallet details for a user.

### 2. Transaction History
**GET** `/api/payment/history/{userId}`
- **Input:** `userId` (Long)
- **Output:** List of `TransactionHistory` (payments, status, type, reference)
- **Responsibility:** Returns all transactions for a user.

### 3. Make a Payment
**POST** `/api/payment/pay`
- **Input:** `PaymentRequest` (userId, amount, type, reference, etc.)
- **Output:** `PaymentResponse` (status, message, transactionId)
- **Responsibility:** Initiates a payment for order, transport, etc.

### 4. Escrow Funds
**POST** `/api/payment/escrow`
- **Input:** `PaymentRequest`
- **Output:** `PaymentResponse`
- **Responsibility:** Holds funds in escrow for a transaction.

### 5. Release Escrowed Funds
**POST** `/api/payment/release-escrow`
- **Input:** `PaymentRequest`
- **Output:** `PaymentResponse`
- **Responsibility:** Releases escrowed funds to the recipient.

### 6. Refund Payment
**POST** `/api/payment/refund`
- **Input:** `PaymentRequest`
- **Output:** `PaymentResponse`
- **Responsibility:** Refunds a payment to the user.

### 7. Get Payment Details
**GET** `/api/payment/details/{reference}`
- **Input:** `reference` (String)
- **Output:** `PaymentResponse`
- **Responsibility:** Returns details for a specific payment by reference.

### 8. Invoices & Receipts
- **POST** `/api/payment/invoice` — Generate invoice
  - **Input:** `InvoiceRequest`
  - **Output:** `InvoiceResponse`
- **GET** `/api/payment/invoice/{invoiceId}` — Get invoice
  - **Input:** `invoiceId` (String)
  - **Output:** `InvoiceResponse`
- **GET** `/api/payment/receipt/{paymentId}` — Get receipt
  - **Input:** `paymentId` (String)
  - **Output:** `ReceiptResponse`
- **Responsibility:** Manage invoices and receipts for payments.

### 9. Payment Status & Tracking
**GET** `/api/payment/status/{paymentId}`
- **Input:** `paymentId` (String)
- **Output:** `PaymentStatusResponse`
- **Responsibility:** Returns the status of a payment.

### 10. Audit Logs
**GET** `/api/payment/audit/{userId}`
- **Input:** `userId` (Long)
- **Output:** List of `AuditLogEntry`
- **Responsibility:** Returns audit logs for a user's payment actions.

### 11. Admin & Reporting Tools
- **GET** `/api/payment/report/summary` — Payment summary report
  - **Output:** `PaymentReport`
- **GET** `/api/payment/report/user/{userId}` — User payment report
  - **Input:** `userId` (Long)
  - **Output:** `PaymentReport`
- **Responsibility:** Provides analytics and reporting for payments.

### 12. Limits & Controls
- **POST** `/api/payment/limit` — Set user payment limit
  - **Input:** `PaymentLimitRequest`
- **GET** `/api/payment/limit/{userId}` — Get user payment limit
  - **Input:** `userId` (Long)
  - **Output:** `PaymentLimitResponse`
- **Responsibility:** Set and get payment limits for users.

### 13. Bank Details & Withdrawals
- **POST** `/api/payment/bank-details` — Add/update bank details
  - **Input:** `BankDetailsRequest` (bank, branch, account number, account holder name, etc.)
- **GET** `/api/payment/bank-details/{userId}` — Get bank details
  - **Input:** `userId` (Long)
  - **Output:** `BankDetailsResponse`
- **POST** `/api/payment/withdraw` — Withdraw to bank
  - **Input:** `WithdrawalRequest` (userId, amount, etc.)
  - **Output:** `WithdrawalResponse`
- **Responsibility:** Manage user bank details and allow withdrawals to bank accounts.

---

## Data Structures

### PaymentRequest
- `userId`: Long
- `amount`: BigDecimal
- `type`: String ("order", "transport", ...)
- `reference`: String
- ...other fields as needed

### PaymentResponse
- `status`: String
- `message`: String
- `transactionId`: String
- ...other fields as needed

### WalletInfo
- `userId`: Long
- `balance`: BigDecimal
- `escrowedAmount`: BigDecimal
- ...other fields as needed

### TransactionHistory
- `transactionId`: String
- `amount`: BigDecimal
- `type`: String
- `status`: String
- `reference`: String
- `timestamp`: Date
- ...other fields as needed

### InvoiceRequest / InvoiceResponse
- Invoice details, payment references, amounts, etc.

### ReceiptResponse
- Receipt details, payment references, amounts, etc.

### PaymentStatusResponse
- `paymentId`: String
- `status`: String
- ...other fields as needed

### AuditLogEntry
- `userId`: Long
- `action`: String
- `timestamp`: Date
- ...other fields as needed

### PaymentReport
- Summary statistics, totals, breakdowns, etc.

### PaymentLimitRequest / PaymentLimitResponse
- Limit details per user

### BankDetailsRequest / BankDetailsResponse
- `userId`: Long
- `bank`: String
- `branch`: String
- `accountNumber`: String
- `accountHolderName`: String
- ...other fields as needed

### WithdrawalRequest / WithdrawalResponse
- `userId`: Long
- `amount`: BigDecimal
- `bankDetails`: BankDetails
- `status`: String
- ...other fields as needed

---

## Notes
- All endpoints use REST conventions and JSON payloads.
- Authentication and authorization should be enforced for sensitive operations.
- Input validation and error handling are required for all endpoints.

---

## Interface Reference

````java
// See previous message for full PaymentService interface
````

---

For further details, see DTO definitions and implementation notes in the backend source code.
