# 🔧 Salesforce OAuth Setup - Fixed Guide

## 🔴 What Went Wrong

Your OAuth setup was using the **wrong login URL**:
- ❌ Was using: `test.salesforce.com` (for Sandbox orgs)
- ✅ Should use: `login.salesforce.com` (for Developer Edition)

Your org (`orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com`) is a **Developer Edition**, not a Sandbox.

---

## ✅ Step-by-Step Fix

### Step 1: Verify Connected App in Salesforce (2 minutes)

1. Log into Salesforce: https://orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com

2. Go to **Setup** → Search "App Manager"

3. Find your Connected App (or create a new one):
   - Click **New Connected App**
   - Fill in:
     - **Connected App Name**: `Match Moments OAuth`
     - **API Name**: `Match_Moments_OAuth` (auto-filled)
     - **Contact Email**: your@email.com
   
4. **Enable OAuth Settings** (Check the box):
   - ✅ Enable OAuth Settings
   - **Callback URL**: `http://localhost:3333/callback`
   - **Selected OAuth Scopes** (move these to "Selected OAuth Scopes"):
     - ✅ Full access (full)
     - ✅ Perform requests on your behalf at any time (refresh_token, offline_access)
     - ✅ Manage user data via APIs (api)
   - ✅ Check "Require Secret for Web Server Flow"

5. Click **Save** → **Continue**

6. Click **Manage Consumer Details**
   - Copy the **Consumer Key** (this is your Client ID)
   - Copy the **Consumer Secret**

---

### Step 2: Update Your .env.local File (1 minute)

Make sure your `.env.local` file has these variables:

```bash
# Salesforce OAuth Configuration
SALESFORCE_CLIENT_ID=your_consumer_key_from_step_1
SALESFORCE_CLIENT_SECRET=your_consumer_secret_from_step_1
SALESFORCE_INSTANCE_URL=https://orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com
SALESFORCE_REDIRECT_URI=http://localhost:3333/callback

# Google OAuth (for NextAuth - keep your existing values)
GOOGLE_CLIENT_ID=your_existing_google_client_id
GOOGLE_CLIENT_SECRET=your_existing_google_client_secret
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_existing_secret

# Don't worry about SALESFORCE_REFRESH_TOKEN yet - we'll get it in Step 3
```

⚠️ **Replace the placeholder values** with your actual credentials!

---

### Step 3: Get Your Refresh Token (3 minutes)

Now run the **fixed** OAuth setup script:

```bash
npm run sf:oauth-setup
```

This will:
1. ✅ Start a local server on port 3333
2. ✅ Open your browser to Salesforce login (using **login.salesforce.com** now!)
3. ✅ Ask you to authorize the app
4. ✅ Give you a refresh token

**What to do in the browser:**
1. Log into Salesforce with your credentials
2. Click **Allow** to authorize access
3. You'll see a success page
4. Check your terminal - it will show the refresh token

**Copy the refresh token** and add it to `.env.local`:

```bash
SALESFORCE_REFRESH_TOKEN=your_refresh_token_from_terminal
```

---

### Step 4: Update Your Code to Use OAuth (1 minute)

Your auth route is already set up, but we need to make sure it's using the OAuth connection.

The file `/src/app/api/auth/[...nextauth]/route.ts` currently imports:

```typescript
import { getSalesforceConnection } from '@/lib/salesforce/connection-oauth';
```

✅ This is correct! It's already using OAuth.

---

### Step 5: Test Your Connection (1 minute)

1. **Restart your dev server**:
   ```bash
   # Stop the current server (Ctrl+C in the terminal where it's running)
   npm run dev
   ```

2. **Test the connection**:
   - Open: http://localhost:3001/api/test-salesforce-data/connection
   
   You should see:
   ```json
   {
     "connected": true,
     "message": "Successfully connected to Salesforce",
     "instanceUrl": "https://orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com",
     "userId": "...",
     "orgId": "..."
   }
   ```

3. **Test Google Login**:
   - Go to your login page
   - Sign in with Google
   - Your app will check if your Google email exists in Salesforce

---

## 🎯 What This Setup Does

Your current architecture:
1. **Users log in with Google** (via NextAuth)
2. **App connects to Salesforce in background** (via OAuth)
3. **App queries Salesforce data** for the logged-in user

This is **different** from the YouTube tutorial where users log in WITH Salesforce.

---

## 🆘 Troubleshooting

### Issue: "invalid_grant" error

**Cause**: Wrong login URL or expired refresh token

**Fix**: 
1. Delete `SALESFORCE_REFRESH_TOKEN` from `.env.local`
2. Run `npm run sf:oauth-setup` again
3. Make sure the browser opens to `login.salesforce.com` (not `test.salesforce.com`)

---

### Issue: Browser doesn't open automatically

**Fix**: Copy the URL from the terminal and paste it into your browser manually

---

### Issue: "Callback URL mismatch"

**Fix**: Make sure your Connected App has exactly:
- `http://localhost:3333/callback` (not 3000, not 3001)

---

### Issue: Port 3333 already in use

**Fix**: 
1. Find and kill the process: `lsof -ti:3333 | xargs kill -9`
2. Or change the port in both places:
   - `scripts/setup-oauth.js` (line 16: `const PORT = 3334;`)
   - Your Connected App callback URL
   - `.env.local` REDIRECT_URI

---

## 📊 Environment Variables Summary

After setup, your `.env.local` should have:

| Variable | Purpose | Where to get it |
|----------|---------|-----------------|
| `SALESFORCE_CLIENT_ID` | Connected App Consumer Key | Salesforce Setup → App Manager |
| `SALESFORCE_CLIENT_SECRET` | Connected App Consumer Secret | Salesforce Setup → App Manager |
| `SALESFORCE_REFRESH_TOKEN` | OAuth Refresh Token | From `npm run sf:oauth-setup` |
| `SALESFORCE_INSTANCE_URL` | Your Salesforce org URL | From Salesforce URL bar |
| `SALESFORCE_REDIRECT_URI` | OAuth callback | Must match Connected App |

---

## 🎉 Success Checklist

- [ ] Connected App created with correct callback URL
- [ ] All environment variables in `.env.local`
- [ ] Ran `npm run sf:oauth-setup` successfully
- [ ] Got refresh token and added to `.env.local`
- [ ] Restarted dev server
- [ ] Connection test returns `"connected": true`
- [ ] Can log in with Google and app queries Salesforce

---

## 💡 Next Steps After This Works

Once this is working, you can:
1. Query Salesforce data in your app
2. Display user-specific information
3. Build dashboards with Salesforce data
4. Deploy to Vercel (add env vars there too)

---

## 🤔 Want to Follow the YouTube Tutorial Instead?

The YouTube tutorial shows a **different approach** where users log in WITH Salesforce credentials (not Google).

If you want that, I can help you:
1. Create `/api/oauth2/auth/route.ts`
2. Create `/api/oauth2/callback/route.ts`
3. Create a dashboard page
4. Update your home page with a "Login with Salesforce" button

Let me know if you want to switch to that approach!
