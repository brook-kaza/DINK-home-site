# Dink Home - Deployment Setup Guide

## ✅ Quick Setup Checklist

### 1. Supabase Setup

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Open your project (or create a new one)

2. **Get Connection String**
   - Click **Project Settings** (gear icon) → **Database**
   - Under **Connection string** → Select **URI**
   - Copy the **Session pooler** connection string (port **6543**)
   - Format: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
   - **Important:** Replace `[PASSWORD]` with your actual database password

3. **Create Users Table**
   - In Supabase, go to **SQL Editor** → **New query**
   - Open `supabase-schema.sql` from this project
   - Copy ALL contents and paste into Supabase SQL Editor
   - Click **Run** (or press Ctrl+Enter)
   - You should see "Success. No rows returned"

### 2. Vercel Setup

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com
   - Open your project: **DINK-home-site**

2. **Add Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Add these THREE variables:

   **Variable 1:**
   - Name: `DATABASE_URL`
   - Value: Paste your Supabase connection string (from step 1.2)
   - Environment: Select **Production**, **Preview**, and **Development** (all three)

   **Variable 2:**
   - Name: `SESSION_SECRET`
   - Value: `mysecretkey123` (or generate a random string)
   - Environment: Select **Production**, **Preview**, and **Development**

   **Variable 3:**
   - Name: `NODE_ENV`
   - Value: `production`
   - Environment: Select **Production** only

3. **Redeploy**
   - Go to **Deployments** tab
   - Click **⋯** (three dots) on the latest deployment
   - Click **Redeploy**
   - Wait for deployment to finish (green checkmark)

### 3. Test Your Site

1. Visit your site URL (e.g., `dink-home-site.vercel.app`)
2. Test these pages:
   - ✅ Home page (`/`)
   - ✅ Catalog (`/catalog`)
   - ✅ Product pages (`/product/[code]`)
   - ✅ Register (`/auth/register`) - should work if DATABASE_URL is set
   - ✅ Login (`/auth/login`) - should work if DATABASE_URL is set

## 🔧 Troubleshooting

### Site shows "500 Internal Server Error"

1. **Check Vercel Logs:**
   - Go to Vercel → Your Project → **Deployments**
   - Click on latest deployment → **Functions** → `api/index.js`
   - Look for error messages

2. **Common Issues:**

   **"DATABASE_URL not set"**
   - Solution: Add `DATABASE_URL` in Vercel Environment Variables

   **"Database connection failed"**
   - Solution: Check your Supabase connection string format
   - Make sure you're using **Session pooler** (port 6543), not direct connection
   - Verify your database password is correct

   **"Users table doesn't exist"**
   - Solution: Run the SQL from `supabase-schema.sql` in Supabase SQL Editor

### Login/Register Not Working

- Make sure `DATABASE_URL` is set in Vercel
- Verify the users table exists in Supabase (run the SQL)
- Check Vercel logs for database connection errors

### Pages Load But Database Features Don't Work

- This is normal if `DATABASE_URL` is not set
- The site will work for browsing (home, catalog, etc.)
- But login/register/dashboard require the database

## 📝 Notes

- **Never commit `.env` file** - it contains secrets
- **Always use Session pooler** (port 6543) for Supabase on Vercel
- **Redeploy after adding environment variables** for them to take effect
