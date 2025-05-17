
# Digital Wallet System

A backend wallet system for virtual cash management with JWT-based authentication, fraud detection, soft deletion, email alerts, and Swagger documentation.

## Tech Stack

Backend   | Node.js, Express, MongoDB  
Auth      | JWT (Bearer Tokens)        
Docs      | Swagger UI                 

### Bonus
Email alerts (mocked via Nodemailer)
Daily fraud scan job (via `node-cron`)
Currency

## Authentication

Use the `/api/auth/login` endpoint to get a JWT token.

Include the token in requests:

```
Authorization: Bearer <your-token>
```

## Swagger Documentation

All APIs are documented via Swagger: http://localhost:5000/api-docs


## Author

Developed by Isaac Marian Dsouza for Infollion Internship assignment.
