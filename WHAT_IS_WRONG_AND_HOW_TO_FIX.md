# 🔴 What's Wrong & How to Fix It

## 📊 Current Situation

You have **two different authentication architectures** getting mixed up:

### What You Have Now (Current Codebase)
```
User → Google Login (NextAuth) → Your App → Salesforce (background data queries)
```
- Users log in with **Google**
- App connects to Salesforce **separately** to fetch data
- App checks if Google email exists in Salesforce User table

### What the YouTube Tutorial Shows
```
User → Salesforce Login → Your App (gets data from same connection)
```
- Users log in with **Salesforce credentials**
- No Google involved
- Direct Salesforce OAuth flow

## 🔴 The Problems

### Problem 1: Wrong Login URL ❌
Your script was using `test.salesforce.com` for a Developer Edition org.

**Your org**: `orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com`
- Has `.develop.` in the URL = **Developer Edition**
- Should use: `login.salesforce.com`
- Was using: `test.salesforce.com` ❌

✅ **FIXED** - I've corrected the login URL logic in:
- `scripts/setup-oauth.js`
- `src/lib/salesforce/connection-oauth.ts`

### Problem 2: Invalid Refresh Token ❌
Your refresh token is expired or was obtained with the wrong URL.

Error: `"error": "invalid_grant", "error_description": "authentication failure"`

✅ **NEEDS ACTION** - You need to get a new refresh token (see below)

### Problem 3: Missing YouTube Tutorial Routes ❌
The YouTube tutorial routes don't exist:
- ❌ `/api/oauth2/auth/route.ts` - Missing
- ❌ `/api/oauth2/callback/route.ts` - Missing
- ❌ Dashboard page using Salesforce login - Missing

✅ **OPTIONAL** - Only needed if you want to switch to Salesforce login (see Option B below)

---

## ✅ How to Fix It

You have **two options**:

---

## 🎯 OPTION A: Fix Your Current Setup (RECOMMENDED - Faster)

**What it does**: Keep Google login, fix Salesforce background connection

**Time**: ~5 minutes

**Architecture**:
```
User login: Google OAuth (NextAuth)
Data fetching: Salesforce OAuth (background)
```

### Steps:

#### 1. Verify Connected App in Salesforce

Log into: https://orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com

**Setup → App Manager → Find or Create Connected App**

Required settings:
- **Callback URL**: `http://localhost:3333/callback` (exactly this!)
- **OAuth Scopes**:
  - ✅ Full access (full)
  - ✅ Perform requests on your behalf at any time (refresh_token, offline_access)
  - ✅ Manage user data via APIs (api)

Copy your **Consumer Key** and **Consumer Secret**

#### 2. Update .env.local

```bash
# Salesforce OAuth
SALESFORCE_CLIENT_ID=your_consumer_key_here
SALESFORCE_CLIENT_SECRET=your_consumer_secret_here
SALESFORCE_INSTANCE_URL=https://orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com
SALESFORCE_REDIRECT_URI=http://localhost:3333/callback

# Google OAuth (keep your existing values)
GOOGLE_CLIENT_ID=existing_value
GOOGLE_CLIENT_SECRET=existing_value
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=existing_value
```

#### 3. Get New Refresh Token

```bash
npm run sf:oauth-setup
```

This will:
1. Open browser to **login.salesforce.com** (correct URL now!)
2. Ask you to log in and approve
3. Give you a refresh token in the terminal

**Copy the refresh token** and add to `.env.local`:
```bash
SALESFORCE_REFRESH_TOKEN=paste_token_here
```

#### 4. Test the Connection

```bash
npm run sf:test
```

You should see: `✅ SUCCESS! Connected to Salesforce`

#### 5. Start Your App

```bash
npm run dev
```

Test:
- http://localhost:3001/api/test-salesforce-data/connection
- Should return `"connected": true`

**Done!** Your app now:
- Accepts Google login
- Connects to Salesforce for data
- Works with your existing code

---

## 🎯 OPTION B: Follow YouTube Tutorial (More Work)

**What it does**: Complete architecture change to Salesforce login

**Time**: ~30 minutes

**Architecture**:
```
User login: Salesforce OAuth (direct)
Data fetching: Same connection
```

### What needs to be created:

1. **OAuth Routes** (following YouTube tutorial exactly):
   - `src/app/api/oauth2/auth/route.ts` - Redirects to Salesforce
   - `src/app/api/oauth2/callback/route.ts` - Handles callback
   
2. **Dashboard Page**:
   - `src/app/dashboard/page.tsx` - Shows Salesforce data
   
3. **Home Page Update**:
   - Add "Login with Salesforce" button

4. **Remove/Modify**:
   - Current NextAuth setup (or keep both if you want dual login)

### Would you like me to implement this?

If yes, I will:
1. Create all the routes from the YouTube tutorial
2. Update your pages
3. Add proper session handling
4. Keep your existing Google login as backup (optional)

---

## 🚦 What Should You Do Right Now?

### Quick Decision Guide:

**Choose Option A if:**
- ✅ You want Google login for users
- ✅ You just need Salesforce data in the background
- ✅ You want the quickest fix
- ✅ Your users don't have Salesforce accounts

**Choose Option B if:**
- ✅ You want users to log in WITH Salesforce
- ✅ All your users have Salesforce accounts
- ✅ You want to follow the YouTube tutorial exactly
- ✅ You don't need Google login

---

## 📋 My Recommendation

**Start with Option A** because:
1. It's 90% working already
2. Takes 5 minutes instead of 30
3. You can test Salesforce integration quickly
4. You can always switch to Option B later

**Then** if you decide you want Salesforce login:
- Let me know and I'll implement Option B
- We can keep both login methods (Google + Salesforce)

---

## 🎬 Step-by-Step for Option A (The Fix)

Run these commands in order:

```bash
# 1. Test current setup (will fail but shows what's wrong)
npm run sf:test

# 2. Get new refresh token (browser will open)
npm run sf:oauth-setup
# → Log in to Salesforce
# → Click "Allow"
# → Copy refresh token from terminal

# 3. Add token to .env.local
# Edit .env.local and add:
# SALESFORCE_REFRESH_TOKEN=your_token_here

# 4. Test again (should succeed now)
npm run sf:test

# 5. Start dev server
npm run dev

# 6. Test in browser
# Visit: http://localhost:3001/api/test-salesforce-data/connection
```

---

## 🆘 Troubleshooting

### "Invalid grant" error
- Means: Wrong login URL or expired token
- Fix: The login URL is now fixed. Just run `npm run sf:oauth-setup` again

### "Redirect URI mismatch"
- Means: Connected App callback URL doesn't match
- Fix: Set callback to exactly `http://localhost:3333/callback` in Salesforce

### Browser doesn't open
- Fix: Copy the URL from terminal and paste in browser

### Port 3333 in use
- Fix: `lsof -ti:3333 | xargs kill -9`

---

## 📞 Next Steps

1. **Read**: `SALESFORCE_OAUTH_FIX.md` for detailed Option A guide
2. **Run**: `npm run sf:oauth-setup` to get new token
3. **Test**: `npm run sf:test` to verify
4. **Let me know**: Which option you want to pursue

If you want Option B (YouTube tutorial approach), just say:
> "Implement the YouTube tutorial Salesforce OAuth routes"

And I'll create all the necessary files!
