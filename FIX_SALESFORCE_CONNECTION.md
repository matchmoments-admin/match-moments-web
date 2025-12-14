# 🔧 Fix Salesforce Connection Issue

## 🎯 The Problem

Your Salesforce Developer org has **SOAP API disabled**, which prevents username/password authentication from working.

**Error:** `INVALID_OPERATION: SOAP API login() is disabled by default in this org.`

---

## ✅ Solutions (Choose One)

### Option 1: Enable SOAP API (Quickest)

**Pros:** Quick fix, minimal code changes
**Cons:** Less secure, not recommended for production

1. Log into Salesforce
2. Go to **Setup** → Search "Profiles"
3. Click your profile (e.g., "System Administrator")
4. Enable **"API Enabled"** under Administrative Permissions
5. Click **Save**
6. Run diagnostic: `npm run sf:diagnose`

✅ If successful, you're done! Your existing setup will work.

📖 **Full instructions:** See `ENABLE_SOAP_API.md`

---

### Option 2: Switch to OAuth 2.0 (Recommended)

**Pros:** More secure, auto-refreshing tokens, Salesforce recommended
**Cons:** Requires one-time setup

#### Step 1: Create Connected App in Salesforce

1. Log into Salesforce
2. **Setup** → Search "App Manager"
3. Click **"New Connected App"**
4. Fill in:
   - **App Name:** Match Moments Web
   - **API Name:** Match_Moments_Web
   - **Contact Email:** your@email.com
   - **Enable OAuth Settings:** ✅
   - **Callback URL:** `http://localhost:3333/callback`
   - **Selected OAuth Scopes:**
     - Full access (full)
     - Perform requests on your behalf at any time (refresh_token, offline_access)
   - **Require Secret for Web Server Flow:** ✅
5. **Save** → **Continue**
6. Click **"Manage Consumer Details"** to reveal credentials
7. Copy the **Consumer Key** (Client ID) and **Consumer Secret**

#### Step 2: Update Environment Variables

Add to your `.env.local`:

```bash
# OAuth 2.0 Configuration
SALESFORCE_CLIENT_ID=your_consumer_key_from_step_1
SALESFORCE_CLIENT_SECRET=your_consumer_secret_from_step_1
SALESFORCE_INSTANCE_URL=https://orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com
SALESFORCE_REDIRECT_URI=http://localhost:3333/callback

# You can remove these (no longer needed):
# SALESFORCE_USERNAME=...
# SALESFORCE_PASSWORD=...
# SALESFORCE_SECURITY_TOKEN=...
```

#### Step 3: Get Refresh Token

Run the OAuth setup wizard:

```bash
npm run sf:oauth-setup
```

This will:
1. Open your browser
2. Ask you to log into Salesforce
3. Request authorization
4. Give you a refresh token

Copy the refresh token and add it to `.env.local`:

```bash
SALESFORCE_REFRESH_TOKEN=your_refresh_token_from_oauth_setup
```

#### Step 4: Update Connection Code

Replace the import in your API route:

**Before:**
```typescript
import { getSalesforceConnection } from '@/lib/salesforce/connection';
```

**After:**
```typescript
import { getSalesforceConnection } from '@/lib/salesforce/connection-oauth';
```

#### Step 5: Test Connection

```bash
curl http://localhost:3001/api/test-salesforce-data/connection | jq .
```

You should see:
```json
{
  "connected": true,
  "message": "Successfully connected to Salesforce",
  ...
}
```

✨ **Done!** Your tokens will now refresh automatically forever.

---

## 📊 Comparison

| Feature | Username/Password | OAuth 2.0 |
|---------|-------------------|-----------|
| **Setup Time** | 2 minutes | 10 minutes |
| **Security** | ❌ Less secure | ✅ More secure |
| **Token Refresh** | ❌ Manual | ✅ Automatic |
| **Salesforce Recommended** | ❌ No | ✅ Yes |
| **Production Ready** | ❌ No | ✅ Yes |
| **SOAP API Required** | ✅ Yes | ❌ No |

---

## 🎯 Recommendation

**For quick testing:** Use Option 1 (Enable SOAP API)
**For production/long-term:** Use Option 2 (OAuth 2.0)

---

## ❓ Answering Your Questions

### Q: How often do I have to refresh the security token?

**A:** Security tokens **never expire automatically**. You only need to update them if:
- You manually reset the token
- Your admin resets your password
- Your admin resets your token

### Q: How can we automate authentication?

**A:** Use **OAuth 2.0** (Option 2 above). Benefits:
- Tokens refresh automatically
- No manual updates needed
- More secure (no passwords in environment variables)
- Refresh tokens last indefinitely (until revoked)

### Q: Can I test this on the web?

**A:** Yes! Once set up (either option):

**Local testing:**
```
http://localhost:3001/api/test-salesforce-data/connection
```

**Production testing** (after deploying to Vercel):
1. Add environment variables in Vercel dashboard
2. Redeploy
3. Visit: `https://your-domain.vercel.app/api/test-salesforce-data/connection`

---

## 🆘 Still Having Issues?

Run the diagnostic tool:

```bash
npm run sf:diagnose
```

This will:
- Check all your environment variables
- Test multiple login configurations
- Identify specific issues
- Suggest fixes

---

## 📚 Additional Resources

- `SALESFORCE_SETUP.md` - Complete setup guide
- `ENABLE_SOAP_API.md` - Detailed SOAP API enablement
- [JSforce Documentation](https://jsforce.github.io/)
- [Salesforce OAuth Guide](https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_web_server_flow.htm)
