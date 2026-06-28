# Khilafat Detergent — Production Next.js App

A production-ready e-commerce website for **Khilafat Detergent by RH & Sons**, built with Next.js 15 and optimized for **Vercel Free & Pro plans**. No VPS or traditional server required.

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Database** | PostgreSQL via **Neon** (serverless) |
| **ORM** | Prisma 5 |
| **Auth — Customers** | **Clerk** (social login, email/password) |
| **Auth — Admin** | Custom JWT (HTTP-only cookie) |
| **File Uploads** | **Cloudinary** (images auto-optimized to WebP) |
| **Transactional Email** | **Resend** (order confirmations, contact forms) |
| **Styling** | Tailwind CSS |
| **Deployment** | **Vercel** (zero-config) |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- npm 9+
- Git

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/khilafat-detergent.git
cd khilafat-detergent
npm install
```

### 2. Environment Variables

Copy the example file and fill in each value:

```bash
cp .env.example .env.local
```

Edit `.env.local` — all required services are explained below.

### 3. Set Up External Services (One-Time)

#### 🗄 Neon (PostgreSQL Database) — Free Tier
1. Go to [console.neon.tech](https://console.neon.tech) → **New Project**
2. Name it `khilafat-detergent`
3. From **Connection Details**, copy:
   - `DATABASE_URL` — the pooled connection string (with `?pgbouncer=true`)
   - `DIRECT_URL` — the direct connection string (no pgbouncer param)
4. Paste both into `.env.local`

#### 🔐 Clerk (Customer Authentication) — Free Tier
1. Go to [dashboard.clerk.com](https://dashboard.clerk.com) → **Create Application**
2. Name it `Khilafat Detergent`, enable **Email + Google sign-in**
3. Copy **Publishable Key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
4. Copy **Secret Key** → `CLERK_SECRET_KEY`
5. Go to **Webhooks** → **Add Endpoint**:
   - URL: `https://your-vercel-url.vercel.app/api/webhooks/clerk`
   - Events: `user.created`, `user.updated`, `user.deleted`
   - Copy **Signing Secret** → `CLERK_WEBHOOK_SECRET`

> **Local webhooks**: Use [ngrok](https://ngrok.com) to expose localhost for webhook testing.

#### ☁️ Cloudinary (Image CDN) — Free Tier (25GB)
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. From your **Dashboard**, copy:
   - Cloud Name → `CLOUDINARY_CLOUD_NAME` + `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - API Key → `CLOUDINARY_API_KEY`
   - API Secret → `CLOUDINARY_API_SECRET`

#### 📧 Resend (Transactional Email) — Free Tier (3,000 emails/month)
1. Sign up at [resend.com](https://resend.com)
2. Go to **API Keys** → **Create API Key** → copy to `RESEND_API_KEY`
3. Go to **Domains** → add and verify your domain (e.g., `rhasons.com`)
4. Set `RESEND_FROM_EMAIL="Khilafat Detergent <orders@rhasons.com>"`
5. Set `ORDER_NOTIFICATION_EMAIL="info@rhasons.com"`

> **Testing without a domain**: Use `onboarding@resend.dev` as FROM and your personal email as TO.

### 4. Initialize Database

```bash
# Push schema to Neon (creates all tables)
npm run db:push

# Seed with products, banners, admin user
npm run db:seed
```

### 5. Start Dev Server

```bash
npm run dev
```

Visit:
- **Storefront**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin (login with credentials from `.env.local`)

---

## 📦 Deployment to Vercel

### Method A: Vercel CLI (Recommended)

```bash
npm install -g vercel
vercel login
vercel --prod
```

Follow the prompts — Vercel detects Next.js automatically.

### Method B: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repo
4. Vercel auto-detects Next.js settings

### ⚙️ Add Environment Variables in Vercel

In your Vercel project → **Settings** → **Environment Variables**, add **all** variables from `.env.example`:

```
DATABASE_URL               → from Neon (pooled URL)
DIRECT_URL                 → from Neon (direct URL)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
CLERK_WEBHOOK_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
RESEND_API_KEY
RESEND_FROM_EMAIL
ORDER_NOTIFICATION_EMAIL
JWT_SECRET                 → run: openssl rand -hex 32
ADMIN_USERNAME
ADMIN_PASSWORD
NEXT_PUBLIC_SITE_URL       → https://www.rhasons.com
```

Apply to: **Production**, **Preview**, and **Development** environments.

### After First Deploy

Update your Clerk webhook URL to your real Vercel domain:
```
https://your-app.vercel.app/api/webhooks/clerk
```

### Run Database Seed on Neon

After deploying, seed the production database via Neon's SQL editor or by temporarily adding your Neon `DIRECT_URL` to a local `.env.production.local` and running:

```bash
DATABASE_URL="your-neon-direct-url" npm run db:seed
```

---

## 🛠 Admin Panel

Access at `/admin/login` with your `ADMIN_USERNAME` / `ADMIN_PASSWORD`.

| Section | URL |
|---------|-----|
| Dashboard | `/admin` |
| Products | `/admin/products` |
| Orders | `/admin/orders` |
| Banners | `/admin/banners` |
| Media Library | `/admin/media` |
| Site Settings | `/admin/settings` |

### Admin features:
- ✅ Full product CRUD with Cloudinary image uploads
- ✅ Order management with status updates
- ✅ Hero banner management
- ✅ Cloudinary-powered media library
- ✅ Export orders to Excel
- ✅ Site settings (logo, colors, fonts, contact, SEO, testimonials, FAQs)

---

## 🛍 Customer Features

- ✅ Browse products by category and size
- ✅ Add to cart (persisted in localStorage)
- ✅ Cash on Delivery checkout
- ✅ Order confirmation page
- ✅ **Clerk auth** — sign in with email or Google
- ✅ **Order history** in `/account` (linked orders when signed in)
- ✅ Order confirmation email (Resend) to customer
- ✅ WhatsApp button

---

## 📁 Project Structure

```
khilafat-detergent/
├── prisma/
│   ├── schema.prisma       # PostgreSQL schema (Neon)
│   └── seed.js             # Initial data seed
├── public/
│   └── images/             # Static brand & product images
├── src/
│   ├── app/
│   │   ├── (storefront)    # Customer-facing pages
│   │   ├── admin/          # Admin dashboard
│   │   ├── account/        # User account & order history
│   │   ├── sign-in/        # Clerk sign-in page
│   │   ├── sign-up/        # Clerk sign-up page
│   │   └── api/
│   │       ├── auth/       # Admin JWT auth
│   │       ├── orders/     # Order CRUD
│   │       ├── products/   # Product CRUD
│   │       ├── banners/    # Banner CRUD
│   │       ├── upload/     # Cloudinary upload
│   │       ├── contact/    # Contact form (Resend)
│   │       ├── settings/   # Site settings
│   │       └── webhooks/
│   │           └── clerk/  # Clerk user sync webhook
│   ├── components/         # React components
│   ├── lib/
│   │   ├── auth.js         # Admin JWT helpers
│   │   ├── cloudinary.js   # Cloudinary upload/delete
│   │   ├── mailer.js       # Resend email helpers
│   │   ├── prisma.js       # Prisma client singleton
│   │   ├── settings.js     # Site settings helpers
│   │   └── validate.js     # Input validation
│   └── middleware.js       # Clerk + admin JWT middleware
├── vercel.json             # Vercel deployment config
├── next.config.js
├── tailwind.config.js
└── .env.example            # Template for all env vars
```

---

## 🔒 Security

- **Admin panel** protected by HTTP-only JWT cookie (7-day expiry)
- **Customer auth** via Clerk (OAuth 2.0 + session management)
- **Webhook signature** verification for Clerk events (Svix)
- **Server-side price validation** — client prices are never trusted
- **Input sanitization** on all user-submitted fields
- **Security headers** via `vercel.json` (X-Frame-Options, CSP, etc.)
- **HTTPS enforced** by Vercel automatically

---

## 🔧 Common Commands

```bash
npm run dev          # Start local development server
npm run build        # Production build (test before deploying)
npm run db:push      # Sync Prisma schema to database
npm run db:seed      # Seed initial data
npm run db:studio    # Open Prisma Studio (visual DB browser)
npm run lint         # Run ESLint
```

---

## 🆓 Free Tier Limits

| Service | Free Limit | Notes |
|---------|-----------|-------|
| **Vercel** | 100GB bandwidth, unlimited deploys | Plenty for most sites |
| **Neon** | 0.5GB storage, 190 compute hours/month | ~1,000 products & orders |
| **Clerk** | 10,000 monthly active users | More than enough |
| **Cloudinary** | 25GB storage, 25GB bandwidth | ~25,000 product images |
| **Resend** | 3,000 emails/month | ~100 orders/day |

All free tiers are sufficient for a growing Pakistani e-commerce store.

---

## 🤝 Support

For deployment help, open an issue or reach out at info@rhasons.com.
