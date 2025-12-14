# OAuth Setup Complete! ✅

## What Was Changed

### 1. Auth Route Updated
**File:** `src/app/api/auth/[...nextauth]/route.ts`

Changed the import from username/password to OAuth:
```typescript
// OLD (username/password)
import { getSalesforceConnection } from '@/lib/salesforce/connection';

// NEW (OAuth)
import { getSalesforceConnection } from '@/lib/salesforce/connection-oauth';
```

### 2. Test Endpoint Created
**File:** `src/app/api/test-sf-oauth/route.ts`

New endpoint to test your OAuth connection:
```bash
curl http://localhost:3000/api/test-sf-oauth
```

## Required Environment Variables

Make sure your `.env.local` file has these variables:

```bash
# =============================================================================
# SALESFORCE OAUTH CREDENTIALS
# =============================================================================
# From your Connected App in Salesforce (Setup > App Manager)

SALESFORCE_CLIENT_ID=3MVG9...your_consumer_key
SALESFORCE_CLIENT_SECRET=204ACB6...your_consumer_secret

# From running: npm run sf:oauth-setup
SALESFORCE_REFRESH_TOKEN=5Aep861...your_refresh_token

# Your Salesforce org instance URL
SALESFORCE_INSTANCE_URL=https://orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com

# Callback URL (must match Connected App settings)
SALESFORCE_REDIRECT_URI=http://localhost:3333/callback

# =============================================================================
# GOOGLE OAUTH (for NextAuth user sign-in)
# =============================================================================

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# =============================================================================
# NEXTAUTH
# =============================================================================

NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
```

## Testing Your Setup

### Step 1: Test OAuth Connection

Start your dev server and test the OAuth connection:

```bash
# Start the server
npm run dev

# Test OAuth (in another terminal)
curl http://localhost:3000/api/test-sf-oauth
```

**Expected Success Response:**
```json
{
  "success": true,
  "message": "OAuth connection successful!",
  "data": {
    "user": "Your Name",
    "username": "your.email@company.com",
    "organizationId": "00D...",
    "instanceUrl": "https://..."
  }
}
```

### Step 2: Test User Sign-In

1. Navigate to: http://localhost:3000
2. Click "Sign in with Google"
3. Authenticate with Google
4. The app will check if your email exists in Salesforce
5. If found, you'll be signed in!

## Common Issues & Solutions

### ❌ Error: "Missing SALESFORCE_REFRESH_TOKEN"

**Solution:** Run the OAuth setup script:
```bash
npm run sf:oauth-setup
```

This will:
1. Open your browser to Salesforce
2. Ask you to authorize the app
3. Generate a refresh token
4. Save it to your `.env.local` file

### ❌ Error: "invalid_grant"

**Cause:** Your refresh token expired or was revoked.

**Solution:** Re-run the OAuth setup:
```bash
npm run sf:oauth-setup
```

### ❌ Error: "User not found in Salesforce"

**Cause:** The email you're signing in with doesn't exist in your Salesforce org.

**Solutions:**
1. Use an email that exists in Salesforce
2. Or create a User in Salesforce with that email
3. Make sure the `Dashboard_Role__c` field exists on the User object

### ❌ OAuth Setup Fails to Open Browser

**Solution:** Manually navigate to the authorization URL shown in the terminal.

## Understanding the Two Authentication Systems

Your app uses **two separate** authentication systems:

### 1. jsforce OAuth (Salesforce API Access)
- **Purpose:** Your app connects to Salesforce API
- **Uses:** `SALESFORCE_CLIENT_ID`, `SALESFORCE_CLIENT_SECRET`, `SALESFORCE_REFRESH_TOKEN`
- **File:** `src/lib/salesforce/connection-oauth.ts`

### 2. NextAuth with Google (User Sign-In)
- **Purpose:** Users sign into your app
- **Uses:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- **File:** `src/app/api/auth/[...nextauth]/route.ts`

**Flow:**
1. User signs in with Google (NextAuth)
2. App verifies user exists in Salesforce (using jsforce OAuth)
3. App fetches user's role from Salesforce
4. User gains access based on their role

## Next Steps

1. ✅ OAuth import updated in auth route
2. ✅ Test endpoint created
3. ⏳ Run `npm run dev` to start the server
4. ⏳ Test OAuth: `curl http://localhost:3000/api/test-sf-oauth`
5. ⏳ Test sign-in flow through the UI

## Need Help?

If you're still having issues:

1. Check the terminal output for detailed error messages
2. Verify all environment variables are set correctly
3. Make sure your Connected App in Salesforce has:
   - OAuth enabled
   - Correct callback URL: `http://localhost:3333/callback`
   - Required scopes: `api`, `refresh_token`, `offline_access`
4. Run `npm run sf:oauth-setup` if your refresh token is expired
