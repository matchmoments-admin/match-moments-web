# 🚀 START HERE - Salesforce Connection Fix

## 🔴 Current Problem

```
❌ INVALID_LOGIN: Invalid username, password, security token; or user locked out.
```

**Root Cause:** SOAP API is disabled in your Salesforce org.

---

## 🎯 Choose Your Solution

```
┌─────────────────────────────────────────────────────────────┐
│           Which approach do you want?                       │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
            ▼                               ▼
    ┌───────────────┐              ┌───────────────┐
    │   QUICK FIX   │              │ BEST SOLUTION │
    │  (2 minutes)  │              │ (10 minutes)  │
    └───────────────┘              └───────────────┘
            │                               │
            │                               │
            ▼                               ▼
    Enable SOAP API                 Switch to OAuth 2.0
    ✅ Fast                          ✅ Automated forever
    ✅ Works immediately             ✅ More secure
    ❌ Less secure                   ✅ Production-ready
    ❌ Not for production            ✅ No manual updates
            │                               │
            │                               │
            ▼                               ▼
    ┌───────────────┐              ┌───────────────┐
    │   Follow      │              │     Run       │
    │ OPTION 1      │              │   OPTION 2    │
    │    below      │              │    below      │
    └───────────────┘              └───────────────┘
```

---

## Option 1: Enable SOAP API (Quick Fix)

### ⏱️ Time: 2-5 minutes
### 🎯 Best for: Testing, development, quick demos

### Steps:

1. **Open Salesforce**
   - Log into https://orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com

2. **Go to Setup**
   - Click the gear icon (top right)
   - Click "Setup"

3. **Find Profiles**
   - In Quick Find (left sidebar), type "Profiles"
   - Click "Profiles"

4. **Edit Your Profile**
   - Click on "System Administrator" (or your profile name)
   - Look for "Administrative Permissions"
   - Check the box for "API Enabled"
   - Click "Save"

5. **Test the Fix**
   ```bash
   npm run sf:diagnose
   ```

   You should see: `✅ SUCCESS!`

6. **Start Using It**
   ```bash
   npm run dev
   ```

   Visit: http://localhost:3001/api/test-salesforce-data/connection

✅ **Done!** Your existing `.env.local` settings will work.

---

## Option 2: OAuth 2.0 (Recommended)

### ⏱️ Time: 10 minutes (one-time)
### 🎯 Best for: Production, long-term use, automation

### Steps:

#### Part 1: Create Connected App (5 minutes)

1. **Open Salesforce**
   - Log into https://orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com

2. **Go to App Manager**
   - Setup → Search "App Manager"
   - Click "New Connected App"

3. **Fill in the Form**
   - **Connected App Name:** `Match Moments Web`
   - **API Name:** `Match_Moments_Web`
   - **Contact Email:** your@email.com
   
   - **Enable OAuth Settings:** ✅ Check this box
   - **Callback URL:** `http://localhost:3333/callback`
   - **Selected OAuth Scopes:** Move these to "Selected":
     - `Full access (full)`
     - `Perform requests on your behalf at any time (refresh_token, offline_access)`
   - **Require Secret for Web Server Flow:** ✅ Check this

4. **Save and Get Credentials**
   - Click "Save"
   - Click "Continue"
   - Click "Manage Consumer Details"
   - Copy the **Consumer Key** (this is your Client ID)
   - Copy the **Consumer Secret**

#### Part 2: Configure Environment (2 minutes)

5. **Update `.env.local`**
   
   Add these lines:
   ```bash
   SALESFORCE_CLIENT_ID=paste_consumer_key_here
   SALESFORCE_CLIENT_SECRET=paste_consumer_secret_here
   SALESFORCE_INSTANCE_URL=https://orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com
   SALESFORCE_REDIRECT_URI=http://localhost:3333/callback
   ```

#### Part 3: Get Refresh Token (3 minutes)

6. **Run OAuth Setup Wizard**
   ```bash
   npm run sf:oauth-setup
   ```

   This will:
   - Open your browser
   - Ask you to log into Salesforce
   - Request permission (click "Allow")
   - Give you a refresh token

7. **Copy the Refresh Token**
   
   Add this line to `.env.local`:
   ```bash
   SALESFORCE_REFRESH_TOKEN=paste_refresh_token_here
   ```

#### Part 4: Update Code (1 minute)

8. **Switch to OAuth Connection**
   
   Update `src/app/api/test-salesforce-data/connection/route.ts`:
   
   **Change this line:**
   ```typescript
   import { getSalesforceConnection } from '@/lib/salesforce/connection';
   ```
   
   **To this:**
   ```typescript
   import { getSalesforceConnection } from '@/lib/salesforce/connection-oauth';
   ```

9. **Test It**
   ```bash
   npm run dev
   ```

   Visit: http://localhost:3001/api/test-salesforce-data/connection

   You should see:
   ```json
   {
     "connected": true,
     "message": "Successfully connected to Salesforce"
   }
   ```

✅ **Done!** Tokens will now refresh automatically forever.

---

## 🆘 Troubleshooting

### Run the diagnostic tool:
```bash
npm run sf:diagnose
```

This will tell you exactly what's wrong and how to fix it.

### Still stuck?

Read the detailed guides:
- **Quick reference:** `SALESFORCE_README.md`
- **Complete guide:** `FIX_SALESFORCE_CONNECTION.md`
- **Full summary:** `SALESFORCE_SUMMARY.md`

---

## 📊 Quick Comparison

|  | Option 1: SOAP API | Option 2: OAuth 2.0 |
|---|---|---|
| **Setup Time** | 2 min | 10 min |
| **Future Updates** | Manual (if token reset) | Never |
| **Security** | Medium | High |
| **Production Ready** | No | Yes |
| **Salesforce Recommended** | No | Yes |

---

## 💡 My Recommendation

**For you right now:**
1. Start with **Option 1** (Enable SOAP API) - get it working in 2 minutes
2. Test your Salesforce integration, build features
3. When you're ready to deploy, switch to **Option 2** (OAuth 2.0)

This way you can start working immediately and migrate to OAuth later!

---

## 🎯 Next Step

Choose one:
- [ ] **Option 1:** Enable SOAP API (scroll up)
- [ ] **Option 2:** Set up OAuth 2.0 (scroll up)

Then run:
```bash
npm run sf:diagnose
```

To verify everything works! 🎉
