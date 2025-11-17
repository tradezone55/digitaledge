# CompTIA Network+ Testing System – PayPal Integration & Subscription Access

A web-based testing platform for CompTIA Network+ exam preparation, now integrated with **PayPal subscription payments**, **secure user access**, and an **admin dashboard** for subscription control.

## 🧩 Features

### ✅ Payment Integration (PayPal)

- 1-month & 6-month subscription plans
- Secure payment via PayPal SDK
- Access granted on successful payment
- Automatic expiration based on plan

### 👥 User Access Control

- User registration and login
- Access based on active subscription
- Auto-expiry after plan duration
- "Access Denied" message for unpaid/expired users

### 🔁 Subscription Management

- Track subscription start and end dates
- Display remaining access time
- Allow renewals and grace periods

### 🛠️ Admin Dashboard

- View current subscribers
- Manually add/remove users
- See payment history and statuses

---

## 🚀 Project Phases

### Phase 1: Base Setup & UI Integration

- [x] Integrate PayPal SDK (client-side)
- [x] Add PayPal button to pricing page
- [x] Create 1-month & 6-month plans
- [x] UI for payment status and plan choice

### Phase 2: Backend & Database

- [x] Setup Supabase:
  - User authentication (email/password)
  - Storing users, plans, and access status
  - Saving subscription metadata (start, end, transaction ID)

### Phase 3: Secure Access Control

- [x] Restrict protected content (test pages)
- [x] "Access Denied" screen for expired/unpaid users
- [x] Automatically revoke access after expiry
- [x] Preserve test progress in local storage
- [x] Grace period implementation (3 days default)
- [x] Session restoration after browser refresh
- [x] Comprehensive localStorage persistence

### Phase 4: Payment Confirmation & Webhooks

- [x] Handle PayPal webhook to:
  - Verify payment
  - Grant access
  - Update expiry
- [x] Handle failed payments / cancellations

### Phase 5: Admin Panel

- [x] Create simple dashboard
- [x] View all users + subscription status
- [x] Manual grant/revoke access
- [x] View transactions by user and plan
- [x] Add and delete user

---

## 🔧 Tech Stack

- **Frontend:** React, TailwindCSS, PayPal SDK
- **Backend (Serverless):** Firebase Functions / Netlify Functions
- **Database:** Firebase Firestore or Supabase
- **Deployment:** Netlify
- **Auth:** Firebase Auth / Supabase Auth
- **State Management:** React Context / Redux (optional)

---

## 🗃️ Project Structure
## Test change via GitHub Desktop