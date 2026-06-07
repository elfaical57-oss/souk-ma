# Souk MA — سوق MA

Marketplace B2B & B2C pour le Maroc | المتجر الإلكتروني للمغرب

## Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL, Socket.io
- **Contact**: WhatsApp (no payment gateway)

## Setup

### 1. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL connection string

# Frontend — already configured for localhost
```

### 3. Setup database

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run

```bash
# Backend (terminal 1)
cd backend
npm run dev

# Frontend (terminal 2)
cd frontend
npm run dev
```

Open http://localhost:3000

## Features
- Product listings (B2B + B2C) with search & filters
- Seller storefronts with WhatsApp contact button
- Cart — grouped by seller, order via WhatsApp
- Real-time chat (buyer ↔ seller)
- Seller dashboard
- Admin dashboard
- Arabic / French / Darija support
- MAD currency, Moroccan cities
