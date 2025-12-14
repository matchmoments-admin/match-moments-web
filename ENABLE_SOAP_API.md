# Enable SOAP API in Salesforce Developer Edition

## The Problem
You're getting: `SOAP API login() is disabled by default in this org`

This means SOAP API is disabled at the **ORG level**, not just the profile level.

## Solution: Enable SOAP API

### Option 1: Contact Salesforce Support (Developer Edition Limitation)
Unfortunately, **Developer Edition orgs have SOAP API disabled by default** and you cannot enable it yourself through the UI. You have two options:

1. **Contact Salesforce Support** to enable SOAP API for your org
2. **Use OAuth 2.0 instead** (recommended, no SOAP API needed)

### Option 2: Switch to OAuth 2.0 (Recommended) ✅

OAuth 2.0 doesn't require SOAP API and is the modern approach. Here's how:

#### Step 1: Create Connected App in Salesforce

1. Go to Salesforce Setup
2. Quick Find → Search "App Manager"
3. Click "New Connected App"
4. Fill in:
   - **Connected App Name**: Match Moments Web
   - **API Name**: Match_Moments_Web
   - **Contact Email**: your email
   - **Enable OAuth Settings**: ✅ Check this
   - **Callback URL**: `http://localhost:3001/api/auth/callback`
   - **Selected OAuth Scopes**: Add these:
     - Full access (full)
     - Manage user data via APIs (api)
     - Perform requests at any time (refresh_token, offline_access)
5. Click **Save**
6. Wait 2-10 minutes for the app to propagate
7. Go back to App Manager → Find your app → Click "View"
8. Click "Manage Consumer Details"
9. Copy **Consumer Key** and **Consumer Secret**

#### Step 2: Update Your .env.local

Replace your current Salesforce config with:

```env
# Remove these (SOAP API credentials):
# SALESFORCE_USERNAME=...
# SALESFORCE_PASSWORD=...
# SALESFORCE_SECURITY_TOKEN=...
# SALESFORCE_LOGIN_URL=...

# Add these (OAuth 2.0 credentials):
SALESFORCE_CLIENT_ID=your_consumer_key_here
SALESFORCE_CLIENT_SECRET=your_consumer_secret_here
SALESFORCE_REDIRECT_URI=http://localhost:3001/api/auth/callback
SALESFORCE_INSTANCE_URL=https://orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com
```

#### Step 3: Run the OAuth Setup Script

```bash
npm run sf:setup
```

This will:
1. Open a browser to authorize the app
2. You'll log into Salesforce
3. It will automatically save your refresh token
4. Done! Your app can now access Salesforce

---

## Why OAuth 2.0 is Better

✅ No SOAP API required
✅ More secure (no password in .env file)
✅ Modern standard
✅ Better for production
✅ Tokens can be revoked easily
✅ No security token to manage

---

## If You Really Need SOAP API

If you absolutely need SOAP API:

1. **Sign up for a new Developer Edition org** - Sometimes newer orgs have it enabled
2. **Upgrade to a Professional or Enterprise Edition trial** - These have SOAP API enabled
3. **Use a Sandbox** - If you have access to one

---

## Next Steps

1. Do you want to switch to OAuth 2.0? (Recommended)
2. Or do you want to try signing up for a new Developer Edition org?

Let me know which approach you prefer!
