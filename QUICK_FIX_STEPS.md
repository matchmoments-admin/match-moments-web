# ⚡ Quick Fix - Do This Now

## 🎯 The 5-Minute Fix

Your OAuth setup is using the **wrong login URL**. Here's how to fix it:

---

## Steps (Copy & Paste)

### 1️⃣ Check Your Connected App

Log into Salesforce: https://orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com

**Setup → App Manager → Your Connected App**

Make sure it has:
```
Callback URL: http://localhost:3333/callback
OAuth Scopes: Full access, Refresh token, API access
```

Copy your **Consumer Key** and **Consumer Secret**

---

### 2️⃣ Update .env.local

Open `.env.local` and make sure you have:

```bash
SALESFORCE_CLIENT_ID=your_consumer_key
SALESFORCE_CLIENT_SECRET=your_consumer_secret
SALESFORCE_INSTANCE_URL=https://orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com
SALESFORCE_REDIRECT_URI=http://localhost:3333/callback
```

**Delete this line if it exists** (it's invalid):
```bash
SALESFORCE_REFRESH_TOKEN=... ❌ DELETE THIS
```

---

### 3️⃣ Get New Refresh Token

Run this command:

```bash
npm run sf:oauth-setup
```

**What happens:**
- Browser opens to **login.salesforce.com** (✅ correct now!)
- You log in with Salesforce credentials
- Click "Allow"
- Terminal shows your refresh token

**Copy the refresh token** from the terminal output.

---

### 4️⃣ Add Refresh Token to .env.local

Add this line to `.env.local`:

```bash
SALESFORCE_REFRESH_TOKEN=paste_your_token_here
```

---

### 5️⃣ Test It

```bash
npm run sf:test
```

**Expected output:**
```
✅ SUCCESS! Connected to Salesforce

📊 Connection Details:
User ID: ...
Username: ...
Display Name: ...
```

---

## ✅ If Test Passes

Start your app:

```bash
npm run dev
```

Visit: http://localhost:3001/api/test-salesforce-data/connection

Should show: `"connected": true`

**You're done!** 🎉

---

## ❌ If Test Fails

### Error: "invalid_grant"

**Cause**: Something still wrong with credentials

**Fix**:
1. Double-check all values in `.env.local`
2. Make sure Consumer Key/Secret are correct
3. Run `npm run sf:oauth-setup` again
4. Make sure browser opens to `login.salesforce.com` (NOT `test.salesforce.com`)

### Error: "redirect_uri_mismatch"

**Cause**: Callback URL doesn't match

**Fix**:
1. Salesforce Setup → App Manager → Edit Connected App
2. Set Callback URL to: `http://localhost:3333/callback`
3. Save
4. Run `npm run sf:oauth-setup` again

### Browser doesn't open

**Fix**: Copy the URL from terminal and paste into browser

---

## 🆘 Still Not Working?

Read the detailed guides:
- `WHAT_IS_WRONG_AND_HOW_TO_FIX.md` - Full explanation
- `SALESFORCE_OAUTH_FIX.md` - Step-by-step with screenshots

Or ask for help with the specific error message you're seeing.

---

## 🧪 Test Commands

```bash
# Test OAuth connection
npm run sf:test

# Get new refresh token
npm run sf:oauth-setup

# Start dev server
npm run dev
```

---

## 📝 What Changed

I fixed the login URL logic:

**Before:**
- Using `test.salesforce.com` for Developer Edition ❌
- This is wrong - Developer Edition uses `login.salesforce.com`

**After:**
- Using `login.salesforce.com` for Developer Edition ✅
- Only Sandbox orgs (`.sandbox.my.salesforce.com`) use `test.salesforce.com`

Your org ends with `.develop.my.salesforce.com` = Developer Edition = `login.salesforce.com`

---

## ⏱️ Timeline

- **1 min**: Update .env.local
- **2 min**: Run oauth setup
- **1 min**: Add refresh token
- **1 min**: Test connection
- **Total**: ~5 minutes

Let's do this! 🚀
