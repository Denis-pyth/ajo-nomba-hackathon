Ajó API – Backend Engine
This repository contains the core backend service for the Ajó rotating savings platform, developed for the Nomba Hackathon. Built with NestJS, it serves as an event-driven ledger that automates group savings rotations, reconciles transactions, and interfaces directly with Nomba's financial infrastructure.

Tech Stack
Framework: NestJS (Node.js)

Language: TypeScript

Database: PostgreSQL

ORM: TypeORM

Authentication: JWT (Passport), BcryptJS

External Integration: Nomba API (Auth, Sub-Accounts, v2 Transfers, Webhooks)

Core Engineering Features
1. Automated Payout Engine & Ledger Reconciliation
The backend utilizes an event-driven architecture to eliminate manual withdrawals.

Listens for inbound Nomba deposits via webhooks.

Calculates internal pot totals against group targets.

Automatically identifies the next eligible rotation slot.

Performs live NIBSS account lookups before initiating outbound Nomba v2 Bank Transfers.

Maintains a closed-loop ledger: Outbound transfers are marked PENDING and only updated to SUCCESS asynchronously when Nomba fires a transfer_success webhook.

2. Dynamic Infrastructure Provisioning
Integrates with Nomba's Sub-Account API. Upon the creation of a new savings group, the backend automatically provisions a dedicated, live NIBSS virtual bank account tied specifically to that group's internal ledger.

3. Webhook Security & Data Integrity
All incoming external requests from Nomba are cryptographically verified. The backend intercepts the payload, hashes it using HMAC SHA-256 against the internal webhook secret, and validates the signature before processing any database state changes.

Module Architecture
The system follows a strict Service-Repository pattern, divided into isolated domain modules:

UsersModule & AuthModule: Handles secure user provisioning, stateless JWT issuance, and storage of NUBAN banking details required for downstream payouts.

GroupModule: Manages relationship mappings, rotation slot assignments (fastest-finger logic), and triggers Virtual Account generation.

NombaModule: An isolated, globally available wrapper for all external Nomba API communications (Token caching, VA generation, Transfer execution).

WebhookModule: The central processor for inbound payment events, state machine updates, and automated disbursement logic.

Local Development Setup
1. Installation
Clone the repository and install the required dependencies:

Bash
npm install
2. Environment Variables
Create a .env file in the root directory. Ensure you have your Nomba Sandbox credentials available.

Code snippet
# Database
DATABASE_URL="postgres://user:password@localhost:5432/ajo_db"

# Security
JWT_SECRET="your_secure_jwt_secret"

# Nomba Integration
NOMBA_CLIENT_ID="your_nomba_client_id"
NOMBA_SECRET="your_nomba_client_secret"
NOMBA_ACCOUNT_ID="your_nomba_parent_account_id"
NOMBA_SUB_ACCOUNT_ID="your_nomba_sub_account_id"
NOMBA_API_BASE_URL="https://api.nomba.com"

# Webhook Verification
NOMBA_WEBHOOK_SECRET="your_nomba_webhook_secret_key"
3. Running the Application
The project uses TypeORM's synchronize feature for local development schema generation.

Bash
# Start in development mode
npm run start:dev

# Start in production mode
npm run build
npm run start:prod
Testing the Webhook Engine (Local / Sandbox)
To test the automated payout execution lifecycle:

Provision User: Register a user and attach their NUBAN details (PATCH /users/profile/bank).

Provision Group: Create a group to trigger the generation of a Nomba Virtual Account.

Simulate Deposit: Send a mock webhook payload to POST /webhook/nomba using the generated Virtual Account number. Ensure the amount fulfills the target pot condition.

Observe Execution: The console will log the signature verification, NIBSS lookup, and the successful firing of the outbound payout transfer.