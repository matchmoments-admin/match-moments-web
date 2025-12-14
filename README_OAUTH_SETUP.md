# 🔐 Salesforce OAuth Setup - Complete Guide

## 📖 Table of Contents

1. [What I Fixed](#what-i-fixed)
2. [What You Need to Do Now](#what-you-need-to-do-now)
3. [Understanding Your Setup](#understanding-your-setup)
4. [Step-by-Step Instructions](#step-by-step-instructions)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)
7. [YouTube Tutorial vs Your Setup](#youtube-tutorial-vs-your-setup)

---

## ✅ What I Fixed

### Problem 1: Wrong Login URL ✅ FIXED
**Issue**: Your OAuth setup was using `test.salesforce.com` for a Developer Edition org.

**Your org**: `orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com`
- This is a **Developer Edition** org (has `.develop.` in URL)
- Should use: `login.salesforce.com`
- Was using: `test.salesforce.com` ❌

**What I changed**:
- ✅ Updated `scripts/setup-oauth.js` to use correct logic
- ✅ Updated `src/lib/salesforce/connection-oauth.ts` to match
- ✅ Now correctly identifies Developer Edition vs Sandbox

### Problem 2: Understanding Required
**Issue**: Confusion between two different OAuth approaches

**Your current setup** (what you have):
```
Users log in with Google → App queries Salesforce for data
```

**YouTube tutorial** (different architecture):
```
Users log in with Salesforce → No Google involved
```

**Resolution**: I've documented both approaches so you can choose.

---

## 🎯 What You Need to Do Now

Your refresh token is invalid because it was obtained with the wrong login URL. You need a new one.

### ⚡ Quick Steps:

```bash
# 1. Get new refresh token (browser will open)
npm run sf:oauth-setup

# 2. Follow browser prompts:
#    - Log into Salesforce
#    - Click "Allow"
#    - Copy refresh token from terminal

# 3. Add to .env.local:
#    SALESFORCE_REFRESH_TOKEN=your_new_token

# 4. Test it
npm run sf:test

# 5. If test passes, start your app
npm run dev
```

**Full instructions**: See [`QUICK_FIX_STEPS.md`](QUICK_FIX_STEPS.md)

---

## 🏗️ Understanding Your Setup

### Current Architecture

```
┌─────────────┐
│    User     │
└─────┬───────┘
      │ Clicks "Login with Google"
      ▼
┌─────────────────────┐
│   Google OAuth      │
│   (NextAuth)        │
└─────┬───────────────┘
      │ Returns user info
      ▼
┌─────────────────────┐
│   Your Next.js App  │
│                     │
│   Checks: Does this │
│   Google email exist│
│   in Salesforce?    │
└─────┬───────────────┘
      │ Background connection
      ▼
┌─────────────────────┐
│   Salesforce        │
│   (OAuth 2.0)       │
│                     │
│   - Query users     │
│   - Get data        │
│   - Check roles     │
└─────────────────────┘
```

### What Each Piece Does

**NextAuth (Google OAuth)**:
- Handles user login UI
- Manages sessions
- Stores user info in cookies/JWT
- File: `src/app/api/auth/[...nextauth]/route.ts`

**Salesforce OAuth Connection**:
- Background connection (users don't see it)
- Uses refresh token (never expires)
- Queries Salesforce data
- File: `src/lib/salesforce/connection-oauth.ts`

**Environment Variables**:
- `GOOGLE_CLIENT_ID` - For user login
- `GOOGLE_CLIENT_SECRET` - For user login
- `SALESFORCE_CLIENT_ID` - For data queries
- `SALESFORCE_CLIENT_SECRET` - For data queries
- `SALESFORCE_REFRESH_TOKEN` - Auto-refreshing token

---

## 📋 Step-by-Step Instructions

### Step 1: Verify Connected App (2 min)

1. Log into Salesforce: https://orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com

2. **Setup** → Search "App Manager"

3. Find your Connected App or create new one:
   - Click **New Connected App**
   - Fill in:
     ```
     Connected App Name: Match Moments OAuth
     API Name: Match_Moments_OAuth
     Contact Email: your@email.com
     ```

4. **Enable OAuth Settings** ✅:
   - Check "Enable OAuth Settings"
   - **Callback URL**: `http://localhost:3333/callback`
   - **Selected OAuth Scopes**:
     - ✅ Full access (full)
     - ✅ Perform requests on your behalf at any time (refresh_token, offline_access)
     - ✅ Manage user data via APIs (api)
   - ✅ Check "Require Secret for Web Server Flow"

5. Save → Continue → **Manage Consumer Details**

6. Copy:
   - **Consumer Key** (= Client ID)
   - **Consumer Secret**

### Step 2: Configure Environment (1 min)

Edit `.env.local`:

```bash
# Salesforce OAuth (for data queries)
SALESFORCE_CLIENT_ID=3MVG9dAEux... (your Consumer Key)
SALESFORCE_CLIENT_SECRET=ABC123... (your Consumer Secret)
SALESFORCE_INSTANCE_URL=https://orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com
SALESFORCE_REDIRECT_URI=http://localhost:3333/callback

# Google OAuth (for user login - keep existing)
GOOGLE_CLIENT_ID=your_existing_value
GOOGLE_CLIENT_SECRET=your_existing_value
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_existing_value

# Don't add SALESFORCE_REFRESH_TOKEN yet - we'll get it in Step 3
```

### Step 3: Get Refresh Token (3 min)

```bash
npm run sf:oauth-setup
```

**What happens**:
1. Terminal starts a local server on port 3333
2. Browser opens to **login.salesforce.com** (✅ correct now!)
3. You log in with Salesforce credentials
4. Salesforce asks "Allow access?" → Click **Allow**
5. Browser shows success page
6. Terminal displays refresh token

**Copy the refresh token** from terminal output.

### Step 4: Add Refresh Token (30 sec)

Add to `.env.local`:

```bash
SALESFORCE_REFRESH_TOKEN=5Aep861... (paste your token)
```

### Step 5: Test Connection (1 min)

```bash
npm run sf:test
```

**Expected output**:
```
✅ SUCCESS! Connected to Salesforce

📊 Connection Details:
User ID: 005...
Username: brendan.milton1211795@agentforce.com
Display Name: Brendan Milton
Email: brendan.milton1211795@agentforce.com
Organization ID: 00D...
Instance URL: https://orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com

🎉 Your OAuth setup is working correctly!
```

### Step 6: Start Your App (30 sec)

```bash
npm run dev
```

### Step 7: Test in Browser (30 sec)

Visit: http://localhost:3001/api/test-salesforce-data/connection

Should see:
```json
{
  "connected": true,
  "message": "Successfully connected to Salesforce",
  "instanceUrl": "https://orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com",
  "userId": "005...",
  "orgId": "00D..."
}
```

**✅ Success!** Your OAuth setup is complete.

---

## 🧪 Testing

### Available Test Commands

```bash
# Test OAuth connection
npm run sf:test

# Get new refresh token (if needed)
npm run sf:oauth-setup

# Test in browser
npm run dev
# Then visit: http://localhost:3001/api/test-salesforce-data/connection
```

### What to Test

1. **OAuth Connection**:
   - Run: `npm run sf:test`
   - Should connect successfully

2. **API Endpoint**:
   - Visit: http://localhost:3001/api/test-salesforce-data/connection
   - Should return connection details

3. **User Login Flow**:
   - Go to your login page
   - Sign in with Google
   - App should check Salesforce for your email
   - Should grant/deny access based on Salesforce User table

---

## 🆘 Troubleshooting

### Error: "invalid_grant" or "authentication failure"

**Cause**: Refresh token is invalid, expired, or obtained with wrong login URL

**Fix**:
1. Delete `SALESFORCE_REFRESH_TOKEN` from `.env.local`
2. Run `npm run sf:oauth-setup` again
3. **Verify** browser opens to `login.salesforce.com` (not `test.salesforce.com`)
4. Log in and approve
5. Copy new refresh token to `.env.local`

### Error: "redirect_uri_mismatch"

**Cause**: Connected App callback URL doesn't match

**Fix**:
1. Salesforce Setup → App Manager → Edit your Connected App
2. Make sure **Callback URL** is exactly: `http://localhost:3333/callback`
3. No extra paths, no trailing slash
4. Save
5. Run `npm run sf:oauth-setup` again

### Browser doesn't open

**Not a problem!**

Copy the URL from the terminal and paste into your browser manually.

### Port 3333 already in use

**Fix**:
```bash
# Kill process on port 3333
lsof -ti:3333 | xargs kill -9

# Then try again
npm run sf:oauth-setup
```

### "Missing OAuth credentials"

**Cause**: `.env.local` is missing required variables

**Fix**: Make sure `.env.local` has:
- `SALESFORCE_CLIENT_ID`
- `SALESFORCE_CLIENT_SECRET`
- `SALESFORCE_INSTANCE_URL`
- `SALESFORCE_REDIRECT_URI`

### Still having issues?

Run the diagnostic:
```bash
npm run sf:diagnose
```

This will check your environment and provide specific guidance.

---

## 🎥 YouTube Tutorial vs Your Setup

### YouTube Tutorial (Different Approach)

The video shows:
```
User → Clicks "Login with Salesforce" → Salesforce OAuth → Your App
```

**Routes required** (NOT in your codebase):
- `/api/oauth2/auth/route.ts` - Redirects to Salesforce login
- `/api/oauth2/callback/route.ts` - Handles callback
- `/dashboard/page.tsx` - Shows user's Salesforce data

**Session management**: Cookies to store access tokens

**Use case**: Users have Salesforce accounts and want to log in with them

### Your Current Setup (What You Have)

```
User → Clicks "Login with Google" → Google OAuth → Your App → Queries Salesforce
```

**Routes you have**:
- `/api/auth/[...nextauth]/route.ts` - NextAuth with Google
- Background Salesforce connection for data queries

**Session management**: NextAuth sessions (JWT)

**Use case**: Users have Google accounts, Salesforce is just a data source

### Which Should You Use?

**Use your current setup if**:
- ✅ Users log in with Google/email
- ✅ Salesforce is your database
- ✅ You want to check if users exist in Salesforce
- ✅ You need to query Salesforce data

**Use YouTube tutorial approach if**:
- ✅ All users have Salesforce accounts
- ✅ You want Salesforce-native login
- ✅ You don't need Google login
- ✅ You want user-specific Salesforce access

### Want Both?

You can have both! Let me know if you want to add Salesforce login alongside Google login.

---

## 🎯 Next Steps

After OAuth is working:

1. **Test your auth flow**:
   - Log in with Google
   - App checks Salesforce
   - Verifies email exists

2. **Query Salesforce data**:
   ```typescript
   import { getSalesforceConnection } from '@/lib/salesforce/connection-oauth';
   
   const conn = await getSalesforceConnection();
   const accounts = await conn.query('SELECT Id, Name FROM Account LIMIT 10');
   ```

3. **Build your dashboard**:
   - Use Salesforce data
   - Display based on user roles
   - Implement your business logic

4. **Deploy to production**:
   - Add env vars to Vercel
   - Update callback URLs to production domain
   - Test thoroughly

---

## 📚 Documentation

- **Quick Start**: [`QUICK_FIX_STEPS.md`](QUICK_FIX_STEPS.md)
- **What's Wrong**: [`WHAT_IS_WRONG_AND_HOW_TO_FIX.md`](WHAT_IS_WRONG_AND_HOW_TO_FIX.md)
- **Detailed Guide**: [`SALESFORCE_OAUTH_FIX.md`](SALESFORCE_OAUTH_FIX.md)
- **Original Setup**: [`START_HERE.md`](START_HERE.md)

---

## 🎉 Success Checklist

- [ ] Connected App created with correct callback URL
- [ ] Environment variables in `.env.local`
- [ ] Ran `npm run sf:oauth-setup` successfully
- [ ] Browser opened to `login.salesforce.com` (not `test.salesforce.com`)
- [ ] Clicked "Allow" in Salesforce
- [ ] Copied refresh token to `.env.local`
- [ ] `npm run sf:test` shows success
- [ ] Dev server starts without errors
- [ ] API endpoint returns `"connected": true`
- [ ] Can query Salesforce data

---

## ❓ Questions?

If you're stuck or want to implement the YouTube tutorial approach, just ask!

I can also help with:
- Adding Salesforce login alongside Google
- Querying specific Salesforce objects
- Implementing role-based access
- Deploying to production
- Performance optimization

Good luck! 🚀
