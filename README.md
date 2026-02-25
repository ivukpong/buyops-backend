# buyops-backend (NestJS + Prisma + Postgres)

Overview

- Single backend for Admin, Investor, Sales apps
- Auth: JWT
- DB: Postgres (Prisma)
- Roles: ADMIN, INVESTOR, SALES

Quick start (local)

1. Copy env:
   cp .env.example .env
   Edit .env to match environment if needed.

2. Start postgres:
   docker-compose up -d

3. Install dependencies:
   npm install

4. Generate Prisma client:
   npx prisma generate

5. Run migrations / create DB schema:
   npx prisma migrate dev --name init

6. Seed initial users:
   npm run seed

7. Start dev server:
   npm run start:dev
   Server runs on PORT (default 4000)

Twilio SMS setup

- SMS notifications are sent through Twilio when user phone numbers are available.
- Set these environment variables in `.env`:
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_PHONE_NUMBER` (Twilio sender number in E.164 format, e.g. `+1234567890`)
- If any Twilio variable is missing, SMS sending is skipped and the backend keeps running.

Payment gateway setup (Paystack + Flutterwave)

- Backend payment endpoints:
  - `POST /payments/initialize`
  - `GET /payments/verify?provider=paystack|flutterwave&reference=<ref>`
  - `GET /payments/providers`
- Set these environment variables in `.env`:
  - `PAYSTACK_PUBLIC_KEY`
  - `PAYSTACK_SECRET_KEY`
  - `FLUTTERWAVE_PUBLIC_KEY`
  - `FLUTTERWAVE_SECRET_KEY`
  - `PAYMENT_CALLBACK_URL`
- All app clients (Admin, Sales Dashboard, Investors Mobile) expose a `paymentsApi` with `getProviders`, `initialize`, and `verify` methods against these backend endpoints.

API highlights

- POST /auth/login { email, password } -> { access_token, user }
- POST /auth/register { email, password, name, role? }
- GET /products
- POST /products (ADMIN only)
- POST /investments (INVESTOR only)
- POST /sales (SALES only)
- GET /users (ADMIN only)
- GET /sales (ADMIN only) for reports

Linking to frontends

- Set frontend env var to call backend, e.g.:
  REACT_APP_API_URL=http://localhost:4000 or VITE_API_URL=http://localhost:4000 for Vite apps
- Include Authorization header: `Authorization: Bearer <token>`

Seeded users (password: password123)

- admin@buyops.local (ADMIN)
- investor@buyops.local (INVESTOR)
- sales@buyops.local (SALES)
