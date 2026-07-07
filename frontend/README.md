# Ajó Frontend

The landing page and web application for **Ajó** — a digital platform for rotating savings (Ajó/Esusu) groups. Built with Next.js, React, and Tailwind CSS, it provides a responsive, modern interface for users to discover the platform, manage their groups, and track contributions.

**Live URL:** https://ajo-nomba-hackathon.vercel.app/

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Font:** Poppins (Google Fonts)
- **Icons:** Custom SVG icon set (see `src/app/dashboard/icons.tsx`)

---

## Features & Pages

### Landing Page (`/`)
A marketing-focused landing page composed of modular sections:

- **Hero** — Value proposition with CTA buttons (Sign In / Get Started)
- **Problem Section** — Highlights pain points of traditional rotating savings
- **How It Works** — Step-by-step guide to using Ajó
- **Ways to Save** — Showcases Classic, Purpose-Bound, and Agent-Led modes
- **Features Section** — Key platform benefits (Auto-Rotations, Bank-Grade Security, Transparent Ledger, Trust Score)
- **Dashboard Mockup** — Visual preview of the member dashboard
- **Testimonials** — Social proof from early users
- **FAQs** — Common questions and answers
- **Get Started / CTA** — Final call-to-action and footer

### Authentication
- **Register** (`/register`) — Account creation form wired to the backend registration API
- **Login** (`/login`) — Secure sign-in with JWT token persistence

### Dashboard (`/dashboard`)
A protected, authenticated workspace with a responsive sidebar layout.

| Route | Description |
|:---|:---|
| `/dashboard` | Overview — stats cards, active groups list, upcoming payments, and recent activity |
| `/dashboard/groups` | Browse all groups and join available ones |
| `/dashboard/groups/new` | Create a new savings group (Classic, Purpose-Bound, or Agent-Led) |
| `/dashboard/payments` | View payment history and manage upcoming contributions |
| `/dashboard/ledger` | Group transaction ledger and audit trail |
| `/dashboard/statements` | Downloadable financial statements |
| `/dashboard/trust` | Trust score and reputation metrics (roadmap) |
| `/dashboard/notifications` | In-app alerts and group updates |
| `/dashboard/settings` | Profile and bank account settings |
| `/dashboard/help` | Support and FAQ resources |

---

## Architecture

### API Layer (`src/lib/api.ts`)
A typed, lightweight `fetch` wrapper that communicates with the live NestJS backend:

- **Automatic JWT injection** — reads `ajo_token` from `localStorage` and attaches it as a `Bearer` header
- **Typed request/response interfaces** — `RegisterRequest`, `LoginRequest`, `Group`, `CreateGroupRequest`, etc.
- **Error handling** — `ApiError` class surfaces backend messages with HTTP status codes
- **Endpoints covered:**
  - `POST /auth/register` & `POST /auth/login`
  - `GET /groups` & `POST /groups`
  - `POST /groups/:id/join`
  - `PATCH /users/profile/bank`

### Auth Layer (`src/lib/auth.ts`)
Simple, client-side auth state management using `localStorage`:

- `setAuth(token, user)` — stores JWT and user profile after login/register
- `getToken()` / `getUser()` — retrieves session data
- `clearAuth()` — removes all auth state (used by logout)
- `isAuthenticated()` — boolean guard for protected routes

### Dashboard Layout (`src/app/dashboard/layout.tsx`)
A persistent sidebar + top navigation shell used across all dashboard routes:

- **Responsive sidebar** — collapsible on mobile with an overlay; sticky on desktop
- **Active route highlighting** — main menu items highlight based on exact or prefix match
- **Profile dropdown** — user email, verified badge, and logout action
- **Top bar** — search input, message/notification icons, and a "New Group" quick-action button
- **Auth gate** — unauthenticated users are redirected to `/login`

---

## Design System

### Colors
| Token | Hex | Usage |
|:---|:---|:---|
| **Primary** | `#0F9D58` | Brand green — CTAs, active nav, buttons, links |
| **Grey** | `#808080` | Secondary text, muted elements |
| **Background** | `#FAFAFA` | Dashboard page background |
| **Surface** | `#FFFFFF` | Cards, sidebar, top bar |
| **Border** | `#F0F0F0` | Card and section borders |
| **Text Primary** | `#0A0A0A` | Headings, primary body text |
| **Text Secondary** | `#737373` | Labels, captions, placeholder text |
| **Text Muted** | `#A3A3A3` | Disabled states, tertiary text |
| **Accent Blue** | `#3B82F6` | Weekly cycle indicators, trust badges |
| **Accent Amber** | `#F59E0B` | Monthly cycle indicators, active group status |
| **Accent Red** | `#EF4444` | Pending payments, errors, logout hover |

### Typography
- **Font:** Poppins (Google Fonts)
- **Weights:** Medium (500), SemiBold (600), Bold (700)
- **Scale:** fluid sizing from `10px` labels up to `text-lg` headings, with `tracking-[-0.01em]` on headlines

### Spacing & Shapes
- **Border radius:** `rounded-2xl` (16px) for cards and buttons; `rounded-full` (56px) for profile buttons
- **Shadows:** subtle green-tinted shadows (`shadow-[#0f9d58]/15` through `/25`) for interactive elevation
- **Transitions:** `transition-all duration-200` with `active:scale-[0.98]` on buttons for tactile feedback

---

## Project Structure

```
frontend/
├── public/                      # Static assets (logo, icons, mockups)
│   └── logo.png
├── src/
│   ├── app/
│   │   ├── components/           # Landing page sections
│   │   │   ├── AjoCircle.tsx
│   │   │   ├── DashboardMockup.tsx
│   │   │   ├── FAQs.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── GetStarted.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── Nav.tsx
│   │   │   ├── ProblemSection.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── WaysToSave.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx        # Dashboard shell (sidebar + top nav)
│   │   │   ├── page.tsx          # Dashboard overview
│   │   │   ├── icons.tsx         # Custom SVG icon set
│   │   │   ├── groups/
│   │   │   │   ├── page.tsx      # Group browser
│   │   │   │   └── new/
│   │   │   │       └── page.tsx  # Group creation form
│   │   │   ├── help/
│   │   │   │   └── page.tsx
│   │   │   ├── ledger/
│   │   │   │   └── page.tsx
│   │   │   ├── notifications/
│   │   │   │   └── page.tsx
│   │   │   ├── payments/
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   ├── statements/
│   │   │   │   └── page.tsx
│   │   │   └── trust/
│   │   │       └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── globals.css           # Tailwind theme + Ajó design tokens
│   │   ├── layout.tsx            # Root layout (Poppins font, metadata)
│   │   ├── page.tsx              # Landing page composition
│   │   └── template.tsx
│   └── lib/
│       ├── api.ts                # Backend API client + typed interfaces
│       └── auth.ts               # LocalStorage auth helpers
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+ (or 20+ recommended)
- npm

### Installation

```bash
cd frontend
npm install
```

### Environment Variables
Create a `.env.local` file in the `frontend/` directory:

```env
# Backend API URL (defaults to the live Render deployment)
NEXT_PUBLIC_API_URL=https://ajo-backend-ua6o.onrender.com
```

For local development against a local backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

### Build for Production

```bash
npm run build
```

---

## Deployment

The frontend is deployed on **Vercel** with zero-config Next.js support. Pushes to the `main` branch auto-deploy to:

https://ajo-nomba-hackathon.vercel.app/

---

## Related Resources

- **Backend API Docs:** https://ajo-backend-ua6o.onrender.com/api/docs
- **Backend README:** `../backend/README.md`
- **Figma Designs:** https://www.figma.com/design/HGuN1fhVYES7DhqVNerycp/Ajo?node-id=0-1&t=rMwbmzqKPY5QCEF1-1
