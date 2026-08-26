# Supabase Integration Setup Guide for SplitMate

SplitMate is now fully configured to integrate with **Supabase** for:
1. **Google OAuth Authentication**
2. **PostgreSQL Relational Database & Real-Time Sync**
3. **Supabase Storage Buckets (`receipts` and `avatars`)**

---

## 1. Quick Setup Steps

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create a new project.
2. Under **Project Settings -> API**, copy your:
   - **Project URL**
   - **Anon / Public Key**

### Step 2: Configure Environment Variables
Set the following keys in your `.env` file or hosting environment:
```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-public-key"
```

### Step 3: Run Database Schema
1. In your Supabase Dashboard, navigate to the **SQL Editor**.
2. Open `supabase/schema.sql` from this repository.
3. Paste the SQL script and click **Run**.
4. This will create:
   - `profiles` table with automatic `on_auth_user_created` trigger hook
   - `groups` and `group_members` tables
   - `expenses`, `settlements`, and `notifications` tables
   - `receipts` and `avatars` public storage buckets with Row Level Security (RLS) policies

### Step 4: Enable Google Provider in Supabase Auth
1. In Supabase Dashboard, go to **Authentication -> Providers -> Google**.
2. Enable the Google provider.
3. Add your Google OAuth Client ID and Secret (from Google Cloud Console).
4. Add your app redirect URL: `https://<YOUR_APP_DOMAIN>/` or `http://localhost:3000`.

---

## 2. Features Enabled
- **Google Sign-In**: Automatically links user profiles in the database.
- **Durable Database Persistence**: Expenses, Groups, and Settlements sync seamlessly to PostgreSQL with instant offline fallback.
- **Storage Buckets**: Upload and host scanned receipt images (`receipts`) and student profile pictures (`avatars`).
