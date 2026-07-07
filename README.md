# Ajo — Automated ROSCA API 🏦

**Nomba Hackathon Submission — Infrastructure Track**

Ajo digitizes and automates the traditional African rotating savings model (Ajo / Esusu / ROSCA). It replaces the manual "treasurer," removes trust issues, and programmatically manages group funds end-to-end — from virtual account provisioning to auto-disbursement — on top of Nomba's payment infrastructure.

> **Pitch:** We didn't just build an Ajo app — we built an **Automated ROSCA API**. Any developer building a community, fintech, or social app can plug into our API to instantly add automated, trustless savings groups to their platform.

## Live Demo

| Resource | URL |
|:---|:---|
| **GitHub Repository** | https://github.com/Denis-pyth/ajo-nomba-hackathon |
| **🌐 Live App (Vercel)** | https://ajo-nomba-hackathon.vercel.app/ |
| **🔧 Backend API (Render)** | https://ajo-backend-ua6o.onrender.com |
| **📖 Swagger / API Docs** | https://ajo-backend-ua6o.onrender.com/api/docs |
| **🎨 Figma UI/UX Designs** | https://www.figma.com/design/HGuN1fhVYES7DhqVNerycp/Ajo?node-id=0-1&t=rMwbmzqKPY5QCEF1-1 |

## Monorepo Structure

This repo contains both the backend engine and the web frontend:

```
.
├── backend/     # NestJS + PostgreSQL API — see backend/README.md
│   └── docs/openapi.yaml   # Static OpenAPI spec
└── frontend/    # Next.js 16 + React 19 + Tailwind — see frontend/README.md
```

- **This root README** covers the product story, architecture, and API — the core of what's being judged.
- **[`backend/README.md`](./backend/README.md)** — backend-specific setup, env vars, edge cases.
- **[`frontend/README.md`](./frontend/README.md)** — frontend routes, design system, and its own setup steps.

The frontend (Next.js, deployed on Vercel) is a full dashboard experience — landing page, auth, group creation/browsing, ledger, statements, and settings — talking to this backend via a typed API client (`src/lib/api.ts`) with JWT persisted in `localStorage`.

> ⚠️ **Local dev note:** the frontend's example `.env.local` points to `http://localhost:3001`, but the backend defaults to port `3000` (`process.env.PORT || 3000` in `main.ts`). If running both locally, make sure `NEXT_PUBLIC_API_URL` matches whichever port the backend actually boots on.

---

## Table of Contents
- [Live Demo](#live-demo)
- [Monorepo Structure](#monorepo-structure)
- [Why This Exists](#why-this-exists)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Core Feature: Automated Payout Engine](#core-feature-automated-payout-engine)
- [Product Roadmap](#product-roadmap)
- [API Reference](#api-reference)
- [Edge Cases Handled](#edge-cases-handled)
- [Getting Started](#getting-started)
- [Testing the Flow](#testing-the-flow)
- [How We Map to the Judging Rubric](#how-we-map-to-the-judging-rubric)

---

## Why This Exists

Millions of Nigerians and Africans participate in informal rotating savings groups every day. These groups depend entirely on trust in a human collector (the *Alajo*) — who can make errors, disappear with funds, or charge steep informal fees (often a full contribution cycle). Ajo removes the human bottleneck entirely: deposits are tracked via webhooks, payout eligibility is calculated automatically, and funds move to the right person the moment a cycle is complete — with zero manual intervention.

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **NestJS** (Node.js/TypeScript) | Strict modular architecture + DI, critical for isolating financial domains (Groups, Nomba, Webhooks) |
| Database | **PostgreSQL** via **TypeORM** | ACID-compliant ledger; internal DB mirrors Nomba's gateway state exactly |
| Auth | **JWT** (Passport) + **BcryptJS** | Stateless auth for user sessions |
| Payments | **Nomba API** (Virtual Accounts, V2 Transfers, Webhooks, Transactions, NIBSS lookup) | Core financial rails |
| Security | **HMAC SHA-256** webhook signature verification | Prevents spoofed/fraudulent deposit events |
| Docs | **Swagger / OpenAPI** (`@nestjs/swagger`) | Auto-generated, interactive API reference for third-party developers |

## Architecture

```
                [ Shared Backend Core ]
   (Nomba Virtual Accounts + Webhooks + NestJS Engine)
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
   [Classic Mode]  [Purpose-Bound]  [Agent-Led]
     (LIVE - MVP)     (Phase 2)      (Phase 2)
```

**Module breakdown:**
- `AuthModule` / `UsersModule` — registration, JWT issuance, storage of bank details (NUBAN + bank code) for downstream payouts
- `GroupModule` — group creation, membership + rotation slot assignment ("fastest-finger" logic), CSV ledger export, VA lifecycle
- `NombaModule` — isolated wrapper for all outbound Nomba API calls (auth token caching, VA generation/expiry, transfer execution, NIBSS lookup, reconciliation)
- `WebhookModule` — the central nervous system: verifies signatures, updates the ledger, triggers the payout engine

## Core Feature: Automated Payout Engine

1. **Provision** — creating a group calls Nomba to provision a dedicated Virtual Account (NUBAN), mapped 1:1 to the group in Postgres.
2. **Catch** — member deposits hit the account; Nomba fires a webhook; we verify the `nomba-signature` header via HMAC SHA-256 before touching the DB.
3. **Calculate** — we sum verified deposits against the group's target pot in real time.
4. **Verify & Disburse** — once the pot is full, we run a live NIBSS lookup to confirm the next recipient's account name, then trigger the Nomba V2 Transfer API. The transaction is marked `PENDING`.
5. **Reconcile** — a second webhook (`transfer_success`) closes the loop, flipping the ledger entry to `SUCCESS` and resetting the group for its next cycle.

No manual "withdraw" button exists anywhere in this system — that's the point.

## Product Roadmap

| Phase | Mode | Status | Description |
|---|---|---|---|
| 1 | **Classic** | ✅ Live (MVP) | Standard ROSCA — rotating payouts to individual members |
| 2 | **Purpose-Bound** | 🔜 Planned | Locked funds disburse to a verified third-party vendor once a communal goal is funded |
| 2 | **Agent-Led** | 🔜 Planned | A verified community agent bridges cash-in-hand deposits into the digital system for unbanked members |

All three modes share the exact same backend engine — Nomba Virtual Accounts, webhooks, and the payout engine — so shipping the next two is a routing exercise, not a rebuild.

## API Reference

Full interactive documentation (Swagger UI) is available at:

```
GET /api/docs
```

when the server is running locally (see [Getting Started](#getting-started)). A static OpenAPI 3.0 spec is also included in this repo at [`docs/openapi.yaml`](./docs/openapi.yaml) so the API contract can be reviewed without booting the server.

### Endpoint summary

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | — | Register a new user, returns JWT |
| `POST` | `/auth/login` | — | Login, returns JWT |
| `PATCH` | `/users/profile/bank` | JWT | Attach NUBAN + bank code for payouts |
| `POST` | `/groups` | — | Create an Ajo group + provision a Nomba Virtual Account |
| `POST` | `/groups/:id/join` | — | Join a group, get assigned a rotation slot |
| `GET` | `/groups` | — | List all groups |
| `DELETE` | `/groups/:id/virtual-account` | — | Close a group & expire its Nomba VA |
| `GET` | `/groups/:id/reconcile` | — | Manually requery Nomba's Transactions API for missed webhooks |
| `GET` | `/groups/:id/statement` | — | Download a CSV ledger of all group deposits/payouts |
| `POST` | `/webhook/nomba` | HMAC signature | Nomba's webhook receiver (deposits + transfer confirmations) |

## Edge Cases Handled

- **Webhook spoofing / fraud** — HMAC SHA-256 signature check; anything that fails is dropped with a 401 before it reaches the DB.
- **Sub-account 403 routing** — Parent Account token stays in the `Authorization` header; the sub-account ID is injected directly into the URL path (`/v1/accounts/virtual/{subAccountId}`).
- **Late/imbalanced payments (Suspense Ledger)** — deposits that don't perfectly match the target pot are logged and held rather than misfiring the rotation.
- **Premature payouts ("ghost member" problem)** — if a deposit arrives before a group has its minimum member count, rotation pauses until the group is structurally viable.
- **Invalid NIBSS/KYC details** — a failed NIBSS checksum halts the transfer before it's attempted, protecting capital and flagging the user's profile.
- **Duplicate webhook delivery** — transactions are deduplicated by `nombaReference` before processing.
- **Late payments to a completed group** — funds are logged as "requires refund" rather than silently disappearing or re-triggering a payout.

## Getting Started

```bash
# 1. Clone & install
git clone <this-repo>
cd backend
npm install

# 2. Configure environment
cp .env.example .env   # then fill in your Nomba sandbox credentials
```

Required environment variables:

```env
DATABASE_URL="postgres://user:password@localhost:5432/ajo_db"
JWT_SECRET="your_secure_jwt_secret"

NOMBA_CLIENT_ID="your_nomba_client_id"
NOMBA_SECRET="your_nomba_client_secret"
NOMBA_ACCOUNT_ID="your_nomba_parent_account_id"
NOMBA_SUB_ACCOUNT_ID="your_nomba_sub_account_id"
NOMBA_API_BASE_URL="https://sandbox.nomba.com"

NOMBA_WEBHOOK_SECRET="your_nomba_webhook_secret_key"
```

```bash
# 3. Run
npm run start:dev
```

Swagger UI will be live at `http://localhost:3000/api/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

See [`frontend/README.md`](./frontend/README.md) for the full environment variable list, routes, and design system.

## Testing the Flow

1. `POST /auth/register` → get a JWT
2. `PATCH /users/profile/bank` → attach a NUBAN + bank code
3. `POST /groups` → creates a group + a real Nomba sandbox Virtual Account
4. `POST /groups/:id/join` → add members (minimum 2 required to activate rotation)
5. `POST /webhook/nomba` → simulate a deposit against the group's virtual account number, matching the target pot
6. Watch the logs: signature verification → NIBSS lookup → outbound transfer fired
7. `GET /groups/:id/statement` → download the CSV ledger to confirm the full audit trail

## How We Map to the Judging Rubric

| Criterion | Weight | Where to look |
|---|---|---|
| **Problem Relevance** | 20% | [Why This Exists](#why-this-exists) — replaces the informal *Alajo* trust model |
| **Technical Execution** | 25% | [Core Feature: Automated Payout Engine](#core-feature-automated-payout-engine), [Edge Cases Handled](#edge-cases-handled) |
| **Security & Reliability** | 20% | HMAC SHA-256 webhook verification + live NIBSS pre-transfer checks |
| **Product UX & Clarity** | 15% | Zero manual withdrawal flows; users just link a bank account once and watch `PENDING` → `SUCCESS` |
| **Nomba Integration Depth** | 20% | Virtual Accounts, V2 Transfer API, Webhooks, Transactions (requery) API, and NIBSS name-verification — all wired into one closed-loop product |

---

*Built for the Nomba Hackathon (Infrastructure Track).*
