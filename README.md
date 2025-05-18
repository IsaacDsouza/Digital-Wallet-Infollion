
# Digital Wallet System

A backend wallet system for virtual cash management with JWT-based authentication, fraud detection, soft deletion, email alerts, and Swagger documentation.
All APIs are documented via Swagger hosted : https://digital-wallet-infollion-production.up.railway.app/api-docs/

## Tech Stack

Backend   | Node.js, Express, MongoDB  
Auth      | JWT (Bearer Tokens)        
Docs      | Swagger UI 

### 1️Backend Setup

```bash
cd wallet-system
npm install
```

Create `.env`:

```env
MONGO_URI=mongodb+srv://your-atlas-url
JWT_SECRET=your-secret-key
```

Start backend:

```bash
npm start
```

Access Swagger:  
https://digital-wallet-infollion-production.up.railway.app/api-docs/

### Bonus
Soft delete of user and user transactions |
Email alerts (mocked via Nodemailer) |
Daily fraud scan job (via `node-cron`) |
Currency

## Authentication

Use the `/api/auth/login` endpoint to get a JWT token.

Include the token in requests:

```
Authorization: Bearer <your-token>
```

## Admin Endpoints

| Route                         | Description                     |
|-------------------------------|---------------------------------|
| `/api/admin/flagged`          | Get flagged transactions        |
| `/api/admin/total-balances`   | Total across all currencies     |
| `/api/admin/top-users`        | Richest users by wallet         |
| `/api/admin/user/:username`   | Soft-delete a user              |
| `/api/admin/transaction/:id`  | Soft-delete a transaction       |

### Deposit Funds

```http
POST /api/wallet/deposit
Authorization: Bearer <token>

{
  "amount": 100,
  "currency": "USD"
}
```

### Withdraw Funds

```http
POST /api/wallet/withdraw
Authorization: Bearer <token>

{
  "amount": 50,
  "currency": "USD"
}
```

### Transfer Funds

```http
POST /api/wallet/transfer
Authorization: Bearer <token>

{
  "toUsername": "alice",
  "amount": 75,
  "currency": "USD"
}
```

## Email Alerts

Email alerts are mocked using:

```js
transporter = nodemailer.createTransport({ jsonTransport: true });
```

You’ll see the email content printed to the console.

## Scheduled Fraud Scan

Runs daily at 2:00 AM using `node-cron`. Flags:

- Withdrawals over $1000
- 5+ transfers within 24 hours

## Swagger Documentation

All APIs are documented via Swagger hosted : https://digital-wallet-infollion-production.up.railway.app/api-docs/


(All APIs are documented via Swagger locally : http://localhost:5000/api-docs)


## Author

Developed by Isaac Marian Dsouza for Infollion Internship assignment.
