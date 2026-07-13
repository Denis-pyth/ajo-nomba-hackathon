 Ajo API - Backend Engine
This repository contains the core backend service for the Ajo rotating savings platform, developed for the Nomba Hackathon (Infrastructure Track). Built with NestJS, it serves as an event-driven ledger that automates group savings rotations, reconciles transactions, and interfaces directly with Nomba's financial infrastructure. The local setup below runs against Nomba's sandbox environment so the automated payout engine can be exercised end-to-end without touching real bank transfers.

Tech Stack
Framework: NestJS (Node.js)

Language: TypeScript

Database: PostgreSQL

ORM: TypeORM

Authentication: JWT (Passport), BcryptJS

External Integration: Nomba API (Auth, Virtual Accounts, v2 Transfers, Webhooks, Transactions API)

Core Engineering Features
Automated Payout Engine & Ledger Reconciliation
The backend utilizes an event-driven architecture to eliminate manual withdrawals.

Listens for inbound Nomba deposits via webhooks.

Calculates internal pot totals against group targets.

Automatically identifies the next eligible rotation slot.

Performs live NIBSS account lookups before initiating outbound Nomba v2 Bank Transfers.

Maintains a closed-loop ledger: Outbound transfers are marked PENDING and only updated to SUCCESS asynchronously when Nomba fires a transfer_success webhook.

Dynamic Infrastructure Provisioning
Integrates with Nomba's Sub-Account API. Upon the creation of a new savings group, the backend automatically provisions a dedicated, live NIBSS virtual bank account tied specifically to that group's internal ledger.

Comprehensive Infrastructure Lifecycle (Track Requirements)
Account Closure & Expiry: Automatically expires the Nomba Virtual Account via API when a savings cycle completes to prevent misdirected or zombie payments.

Manual Requery Fallback: Implements a fallback reconciliation endpoint that directly queries Nomba's Transactions API to sync any dropped or delayed webhook payloads.

Transparent Customer Statements: Features a dedicated reporting endpoint that generates and downloads an immutable, group-level CSV ledger for all deposits and payouts.

Webhook Security & Data Integrity
All incoming external requests from Nomba are cryptographically verified. The backend intercepts the payload, hashes it using HMAC SHA-256 against the internal webhook secret, and validates the signature before processing any database state changes.

Module Architecture
The system follows a strict Service-Repository pattern, divided into isolated domain modules:

UsersModule & AuthModule: Handles secure user provisioning, stateless JWT issuance, and storage of NUBAN banking details required for downstream payouts.

GroupModule: Manages relationship mappings, rotation slot assignments (fastest-finger logic), triggers Virtual Account generation, and handles CSV ledger exports.

NombaModule: An isolated, globally available wrapper for all external Nomba API communications (Token caching, VA generation, Transfer execution, Requery).

WebhookModule: The central processor for inbound payment events, state machine updates, and automated disbursement logic.

Local Development Setup
1. Installation
Clone the repository and install the required dependencies:

Bash
npm install
2. Environment Variables
Create a .env file in the root directory. Sandbox Nomba credentials are provided below so the API can be run and tested immediately.

Code snippet
# Database
DATABASE_URL="postgres://user:password@localhost:5432/ajo_db"

# Security
JWT_SECRET="any-string-you-like"

# Nomba Integration
NOMBA_CLIENT_ID="706df6c4-b8bb-4130-88c4-d21b052f8631"
NOMBA_SECRET="k8UobYk3APgOoxUnNL7VpuxzwTsH4LsXtydfjcHs8RH0YISBB4OMqJsaafG+U8fWETu9YZ96bNXE+DelCDuMPw=="
NOMBA_ACCOUNT_ID="f666ef9b-888e-4799-85ce-acb505b28023"
NOMBA_SUB_ACCOUNT_ID="d26a43a0-c2ff-4da8-813a-eb71bb639eb5"
NOMBA_API_BASE_URL="https://sandbox.nomba.com"

# Webhook Verification
NOMBA_WEBHOOK_SECRET="any-string-you-like"
3. Running the Application
The project uses TypeORM's synchronize feature for local development schema generation.

Bash
# Start in development mode
npm run start:dev

# Start in production mode
npm run build
npm run start:prod
Testing the Infrastructure & Webhook Engine (Local / Sandbox)
To test the automated payout execution lifecycle and infrastructure endpoints, run the app locally against the sandbox environment configured above:

Provision User: Register a user and attach their NUBAN details (PATCH /users/profile/bank).

Provision Group: Create a group to trigger the generation of a Nomba Virtual Account.

Simulate Deposit: Send a mock webhook payload to POST /webhook/nomba using the generated Virtual Account number. Ensure the amount fulfills the target pot condition. Use a nomba-signature header value of bypass-test to skip live signature verification during local testing.

Observe Execution: The console will log the signature verification, NIBSS lookup, and the successful firing of the outbound payout transfer.

Verify Ledger: Call GET /groups/{id}/statement to download the CSV statement verifying all state changes.

Test Requery: Call GET /groups/{id}/reconcile to manually sync sandbox data from Nomba's API.
