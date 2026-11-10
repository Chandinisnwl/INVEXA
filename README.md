# INVEXA — Where Ambition Meets Investment

The premier venture capital SaaS platform connecting high-growth startups with verified angel investors and venture funds.

---

## 🚀 Key Features Implemented

1. **Design System & Visual Identity**
   - Brand Palette: Deep Navy (`#10172A`), Electric Blue (`#536DFE`), Soft Violet (`#8B5CF6`), and Light Grey Surface (`#F7F8FC`).
   - Custom geometric SVG logo with venture vector dynamics.
   - Clean Figma-grade typography, subtle borders, card hover depth, and responsive layouts.

2. **High-Converting Landing Page (`/`)**
   - Dynamic Hero with simulated live matchmaking session preview.
   - Real-time platform statistics (Startups, Verified Investors, Pitch Meetings, Capital Deployed).
   - "How INVEXA Works" 3-step walkthrough.
   - Dual Showcase: Featured Startups raising rounds and Featured Venture Investors.
   - Testimonials and trust badges.
   - Responsive navigation with mobile menu and sticky header.

3. **Authentication & User Management**
   - Role-based registration (`/register`) for Founders (`startup`) and Investors (`investor`).
   - Secure login (`/login`) with Bcrypt password hashing and HTTP-Only JWT tokens (`invexa_token`).
   - **One-Click Demo Access**: Instant demo buttons on the login screen for immediate testing of both roles without manual signup.

4. **Startup Founder Portal (`/dashboard/startup`)**
   - **Overview**: Pitch request KPIs, profile completion progress, interactive Recharts analytics.
   - **Profile Management (`/dashboard/startup/profile`)**: Company economics, pitch stage, founding team, and funding requirements.
   - **Pitch Deck Vault (`/dashboard/startup/pitch-deck`)**: Drag-and-drop PDF upload, file size validation (max 20MB), encrypted metadata storage, live PDF iframe preview, version history, and download/delete controls.
   - **Direct Meeting Booking (`/dashboard/startup/book`)**: Select verified investors, choose open calendar dates and time slots, add pitch agendas, and auto-prevent double booking.
   - **My Meetings (`/dashboard/startup/meetings`)**: Status filtering (Pending, Accepted, Rejected, Cancelled), Google Meet video call links, and meeting cancellation.
   - **Notifications & Settings**: Real-time alerts and security preferences.

5. **Investor & Partner Portal (`/dashboard/investor`)**
   - **Overview**: Dealflow pipeline volume, monthly pitch request bar charts, recent startup applications.
   - **Investor Profile (`/dashboard/investor/profile`)**: Fund name, check sizes ($50K - $2M+), thesis sectors, and preferred stages.
   - **Incoming Pitch Requests (`/dashboard/investor/requests`)**: Inspect founder proposals, review pitch decks, and Accept/Decline requests with instant feedback.
   - **Interactive Meeting Calendar (`/dashboard/investor/calendar`)**: Full month grid view with color-coded status badges and detailed modal views.
   - **Availability Rules (`/dashboard/investor/availability`)**: Manage weekly recurring availability slots (Monday through Friday).
   - **Scheduled Sessions & Notifications**.

6. **Marketplace Discovery**
   - **Investor Marketplace (`/investors`)**: Search by name or firm, filter by sector, stage, and check size, view full investor credentials, and book pitch slots directly.
   - **Startup Marketplace (`/startups`)**: Filter startups by funding target, stage, and industry, inspect deal architecture, and view verified pitch decks.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript (ES6+ / strictly NO TypeScript as requested)
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (`jsonwebtoken`) + `bcryptjs` + HTTP-Only secure cookies
- **Icons**: Lucide React
- **Data Visualization**: Recharts (Responsive bar, line, and pie charts)
- **Date Handling**: `date-fns`

---

## 💻 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local instance at `mongodb://127.0.0.1:27017/invexa` or MongoDB Atlas URI)

### 2. Environment Variables
Create or verify `.env.local` in the project root:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/invexa
JWT_SECRET=invexa_super_secret_jwt_key_2026_venture_growth
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Quick Demo Credentials

You can use the one-click demo login buttons directly on the **[Login Page](http://localhost:3000/login)** or use these credentials:

| Role | Email | Password | Pre-seeded Persona |
| :--- | :--- | :--- | :--- |
| **Startup Founder** | `founder@invexa.com` | `password123` | Alex Rivera (CEO, NeuralPulse AI) |
| **Venture Investor** | `investor@invexa.com` | `password123` | Marcus Vance (General Partner, Horizon Capital) |

