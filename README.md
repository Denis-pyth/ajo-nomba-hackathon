# Ajó

> A multi-modal digital savings ecosystem that modernizes traditional communal savings (Ajó/Esusu) using Nomba Virtual Accounts for secure, automated, and auditable payouts.

---

## Overview

Ajó digitizes the centuries-old tradition of rotating savings groups — where members contribute a fixed amount periodically and take turns receiving the collective pot. Built for the **Nomba Hackathon**, Ajó replaces cash-based ledgers and manual collection with an automated, bank-grade platform powered by Nomba's financial infrastructure.

Every savings group gets its own dedicated Nomba Virtual Account. Members deposit via bank transfer, and once the pot reaches its target, the backend automatically disburses the funds to the next member in the rotation — no middlemen, no disputes, no delays.

---

## Live Links & Resources

| Resource | URL |
|:---|:---|
| **GitHub Repository** | https://github.com/Denis-pyth/ajo-nomba-hackathon |
| **Live API Documentation (Swagger)** | https://ajo-backend-ua6o.onrender.com/api/docs |
| **Base API URL** | https://ajo-backend-ua6o.onrender.com |
| **Figma UI/UX Designs** | https://www.figma.com/design/HGuN1fhVYES7DhqVNerycp/Ajo?node-id=0-1&t=rMwbmzqKPY5QCEF1-1 |
| **Live Frontend (Vercel)** | https://ajo-nomba-hackathon.vercel.app/ |

---

## Tech Stack

### Backend
- **Framework:** NestJS (Node.js)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT (Passport) + BcryptJS
- **External Integration:** Nomba API (Auth, Sub-Accounts, v2 Transfers, Webhooks)

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Font:** Poppins (Google Fonts)

---

## Completed Features & Milestones

### Live Cloud Infrastructure
- The NestJS backend and PostgreSQL database are deployed on Render, strictly typed with TypeORM to prevent schema drift.

### Inbound Payment Security
- Integrated Nomba Virtual Accounts for group deposits.
- Built a secure webhook listener with **HMAC SHA-512 cryptographic verification** to block spoofed payloads.
- Implemented strict **idempotency checks** to prevent duplicate transactions.

### Edge-Case Engineering (Suspense Ledger)
- Engineered a fallback system where late payments sent to a closed group are securely caught in a **Suspense Account** rather than disappearing, ensuring ledger accuracy.

### Core Group Logic
- User registration and JWT authentication.
- Group creation with dynamic **first-come-first-served slot assignment**.
- Automated Virtual Account provisioning per group via Nomba Sub-Accounts.

### UI/UX Design
- High-fidelity **Figma screens** are complete, showcasing the Classic MVP mode, as well as the product roadmap for **B2C merchant integration** and **Nomba POS agent-assisted Offline mode**.

---

## What's Left to Build

- **Automated Payout Execution:** Integrate the outgoing Nomba Transfer API to securely disburse funds from a full pot to the target member's bank account.
- **Expanded Use Cases (B2C & Offline):** Develop backend logic to route funds directly to Nomba Merchant accounts (B2C mode) and set up endpoints for POS agent / USSD integration (Offline mode).
- **Frontend Integration:** Wire the completed UI dashboards to the live backend endpoints using the generated Swagger documentation.
- **Lifecycle Testing:** Run complete flow tests from frontend user registration through to the final automated payout to ensure seamless state management across the stack.

---

## Project Structure

```
ajo-nomba-hackathon/
├── backend/          # NestJS API — see backend/README.md for local setup
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── group/
│   │   ├── nomba/
│   │   └── webhook/
│   └── README.md
├── frontend/         # Next.js app — see frontend/README.md for local setup
│   ├── src/app/
│   └── README.md
└── README.md         # ← You are here
```

---

## Quick Start

### Backend
```bash
cd backend
npm install
# Create .env (see backend/README.md for required variables)
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

For detailed environment variables, webhook testing instructions, and module architecture, refer to the individual `README.md` files inside `backend/` and `frontend/`.

---

*Built with ❤️ by Team Ajó for the Nomba Hackathon.*
