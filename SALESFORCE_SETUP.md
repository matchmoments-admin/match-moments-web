# Salesforce Connection Setup

Simple guide to connect your Match Moments website to Salesforce.

## ⚠️ Important: Authentication Methods

There are **two ways** to authenticate with Salesforce:

1. **Username/Password + Security Token** (Current - Quick but less secure)
   - ✅ Easy to set up for testing
   - ❌ Security token never expires but can be reset
   - ❌ Must update token manually if reset
   - ❌ Not recommended for production by Salesforce

2. **OAuth 2.0** (Recommended - Automated and secure)
   - ✅ Tokens refresh automatically
   - ✅ More secure (no password in env vars)
   - ✅ Salesforce recommended approach
   - ❌ Requires one-time Connected App setup

**Current Status:** You're using method #1. See [Migrate to OAuth 2.0](#migrate-to-oauth-20-recommended) below to automate authentication.

---

## Quick Setup - Username/Password (5 minutes)

### 1. Get Your Salesforce Credentials

You need three things from Salesforce:

#### A. Username & Password
- Your Salesforce login email and password

#### B. Security Token
1. Log into Salesforce
2. Click your profile picture (top right) → Settings
3. In the left sidebar: Personal → Reset My Security Token
4. Click "Reset Security Token"
5. Check your email for the new security token

#### C. Instance URL
Your Salesforce org URL. It's in your browser when you're logged into Salesforce.

**Examples:**
- Production: `https://yourorg.my.salesforce.com`
- Sandbox: `https://yourorg--sandbox.sandbox.my.salesforce.com`
- Developer Edition: `https://orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com`

### 2. Add to .env.local

Copy `.env.example` to `.env.local` and fill in your Salesforce credentials:

```bash
# Salesforce Connection
SALESFORCE_USERNAME=your_username@example.com
SALESFORCE_PASSWORD=your_password
SALESFORCE_SECURITY_TOKEN=your_security_token
SALESFORCE_INSTANCE_URL=https://orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com
```

### 3. Test Connection

Start your dev server:

```bash
npm run dev
```

Test the connection:

```bash
# Visit this URL in your browser:
http://localhost:3000/api/test-salesforce-data/connection
```

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

## Deployment to Vercel

1. Go to your Vercel project settings
2. Navigate to: Settings → Environment Variables
3. Add the same 4 Salesforce variables:
   - `SALESFORCE_USERNAME`
   - `SALESFORCE_PASSWORD`
   - `SALESFORCE_SECURITY_TOKEN`
   - `SALESFORCE_INSTANCE_URL`

4. Redeploy your app

5. Test production connection:
   ```
   https://match-moments-web.vercel.app/api/test-salesforce-data/connection
   ```

## Troubleshooting

### Error: "Invalid username, password, security token"

**Common Causes:**

1. **Security token not concatenated correctly**
   - The password + token should be one string with NO spaces
   - Example: If password is `MyPass123` and token is `abc123xyz`, then:
     ```
     SALESFORCE_PASSWORD=MyPass123abc123xyz
     ```
   - OR keep them separate (recommended):
     ```
     SALESFORCE_PASSWORD=MyPass123
     SALESFORCE_SECURITY_TOKEN=abc123xyz
     ```

2. **Wrong login URL**
   - Developer/Sandbox orgs use `test.salesforce.com`
   - Production orgs use `login.salesforce.com`
   - The code auto-detects this from your `SALESFORCE_INSTANCE_URL`

3. **Account locked**
   - Too many failed login attempts can lock your account
   - Contact your Salesforce admin or wait for auto-unlock (usually 15-30 min)

4. **IP Restrictions**
   - Your Salesforce profile may restrict login to certain IP addresses
   - From untrusted IPs, you MUST use a security token
   - Or add your IP to Trusted IP Ranges (Setup → Network Access)

5. **Incorrect credentials**
   - Double-check your username (email) has no typos
   - Try logging into Salesforce web interface with same credentials
   - If web login works but API doesn't, it's likely a security token issue

**Debug Steps:**
1. Check the new detailed error output at `/api/test-salesforce-data/connection`
2. Verify credentials work on Salesforce web login
3. Reset security token and update `.env.local`
4. Restart dev server: `npm run dev`

### Error: "Login.salesforce.com refuses to connect"

**Solution:** You're using a sandbox/developer org but the app is trying to connect to production.
- Make sure `SALESFORCE_INSTANCE_URL` is set correctly
- The code automatically detects sandbox/develop/test URLs and uses the correct login endpoint

### How Often Do I Need to Refresh the Security Token?

**Answer:** Security tokens **do NOT expire automatically**. You only need to update them if:
- You manually reset the token in Salesforce
- Your Salesforce admin resets your password
- Your Salesforce admin resets your token

However, this is why OAuth 2.0 is recommended - it handles token refresh automatically.

## How It Works

The connection code is in `src/lib/salesforce/connection.ts`. It:

1. Uses jsforce library to connect to Salesforce
2. Automatically detects if you're using a sandbox/developer org
3. Maintains a connection pool to avoid re-authenticating on every request
4. Provides a simple `getSalesforceConnection()` function you can import anywhere

**Example usage:**

```typescript
import { getSalesforceConnection } from '@/lib/salesforce/connection';

// In any API route or server component:
const conn = await getSalesforceConnection();

// Query Salesforce data
const result = await conn.query('SELECT Id, Name FROM Account LIMIT 10');
console.log(result.records);
```

---

## Migrate to OAuth 2.0 (Recommended)

OAuth 2.0 tokens refresh automatically, so you never need to manually update credentials.

### Step 1: Create a Connected App in Salesforce

1. Log into Salesforce
2. Go to Setup → Apps → App Manager
3. Click "New Connected App"
4. Fill in:
   - **Connected App Name:** Match Moments Web
   - **API Name:** Match_Moments_Web
   - **Contact Email:** your@email.com
   - **Enable OAuth Settings:** ✅ Check this
   - **Callback URL:** 
     - Local: `http://localhost:3000/api/auth/salesforce/callback`
     - Production: `https://yourdomain.com/api/auth/salesforce/callback`
   - **Selected OAuth Scopes:** Add these:
     - `Full access (full)`
     - `Perform requests on your behalf at any time (refresh_token, offline_access)`
   - **Require Secret for Web Server Flow:** ✅ Check this
5. Click "Save"
6. Click "Continue"
7. Click "Manage Consumer Details" to get your credentials

### Step 2: Update Your Environment Variables

Replace your current `.env.local` with:

```bash
# OAuth 2.0 Credentials
SALESFORCE_CLIENT_ID=your_consumer_key_from_connected_app
SALESFORCE_CLIENT_SECRET=your_consumer_secret_from_connected_app
SALESFORCE_INSTANCE_URL=https://orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com

# Initial authentication (one-time)
SALESFORCE_USERNAME=your_username@example.com
SALESFORCE_PASSWORD=your_password_with_security_token
```

### Step 3: Update Connection Code

Create a new file `src/lib/salesforce/connection-oauth.ts`:

```typescript
import { Connection, OAuth2 } from 'jsforce';

let connectionPool: Connection | null = null;
let refreshToken: string | null = null;

export async function getSalesforceConnection(): Promise<Connection> {
  // Check if we have a valid connection
  if (connectionPool && connectionPool.accessToken) {
    try {
      await connectionPool.identity();
      return connectionPool;
    } catch (error) {
      console.log('[Salesforce] Token expired, refreshing...');
      connectionPool = null;
    }
  }

  // Set up OAuth2
  const oauth2 = new OAuth2({
    clientId: process.env.SALESFORCE_CLIENT_ID!,
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET!,
    redirectUri: process.env.SALESFORCE_REDIRECT_URI || 'http://localhost:3000/api/auth/salesforce/callback',
    loginUrl: process.env.SALESFORCE_INSTANCE_URL?.includes('sandbox') || 
              process.env.SALESFORCE_INSTANCE_URL?.includes('develop')
      ? 'https://test.salesforce.com' 
      : 'https://login.salesforce.com',
  });

  // If we have a refresh token, use it
  if (refreshToken) {
    try {
      const conn = new Connection({ oauth2, refreshToken });
      await conn.identity();
      connectionPool = conn;
      return conn;
    } catch (error) {
      console.log('[Salesforce] Refresh token invalid, re-authenticating...');
      refreshToken = null;
    }
  }

  // Initial authentication using username/password (one-time)
  const conn = new Connection({ oauth2 });
  const userInfo = await conn.login(
    process.env.SALESFORCE_USERNAME!,
    process.env.SALESFORCE_PASSWORD!
  );

  // Store refresh token for future use
  refreshToken = conn.refreshToken!;
  connectionPool = conn;

  // TODO: Store refresh token in secure storage (database, KMS, etc.)
  console.log('[Salesforce] ✓ OAuth connected. Store this refresh token securely:', refreshToken);

  return conn;
}
```

### Step 4: Store Refresh Token Securely

For production, store the refresh token in:
- Environment variable (Vercel)
- Database (encrypted)
- Secret manager (AWS Secrets Manager, etc.)

Add to `.env.local`:
```bash
SALESFORCE_REFRESH_TOKEN=your_refresh_token_from_first_login
```

### Benefits of OAuth 2.0

✅ **Automatic Token Refresh** - Never manually update credentials again
✅ **More Secure** - No passwords stored in environment variables
✅ **Revocable** - Can revoke access without changing passwords
✅ **Salesforce Recommended** - Official best practice
✅ **Audit Trail** - Better tracking in Salesforce logs

---

## Next Steps

Once connected, you can:
- Query any Salesforce object
- Create/update/delete records
- Build custom dashboards
- Implement authentication flows

**Recommendation:** Start with username/password for initial testing, then migrate to OAuth 2.0 before production deployment.
