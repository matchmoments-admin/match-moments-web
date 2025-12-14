# Salesforce OAuth 2.0 Setup Guide

This application uses **Web Server OAuth 2.0 Flow** to authenticate with Salesforce. This allows users to log in with their Salesforce credentials and the application to access Salesforce data.

## Overview

The authentication flow works as follows:

1. User clicks "Log in with Salesforce" on the homepage
2. User is redirected to Salesforce login page
3. User enters their Salesforce credentials
4. User grants permission to the application
5. User is redirected back to the application with an authorization code
6. Application exchanges the code for access tokens
7. Tokens are stored in secure HTTP-only cookies
8. User can now access the dashboard showing Salesforce data

## Prerequisites

- A Salesforce Developer Edition org or sandbox
- Admin access to Salesforce Setup

## Step 1: Create a Connected App in Salesforce

### 1.1 Navigate to App Manager

1. Log into your Salesforce org
2. Click the gear icon (⚙️) in the top right
3. Select **Setup**
4. In the Quick Find box, search for **App Manager**
5. Click **New Connected App**

### 1.2 Configure Basic Information

- **Connected App Name**: `Match Moments Web` (or any name you prefer)
- **API Name**: `Match_Moments_Web` (auto-filled)
- **Contact Email**: Your email address

### 1.3 Configure OAuth Settings

Check the box: **✅ Enable OAuth Settings**

**Callback URL**: 
```
http://localhost:3001/api/oauth2/callback
```

For production (Vercel), also add:
```
https://your-app.vercel.app/api/oauth2/callback
```

**Selected OAuth Scopes**: Add these to the "Selected OAuth Scopes" column:
- ✅ Manage user data via APIs (api)
- ✅ Perform requests on your behalf at any time (refresh_token, offline_access)
- ✅ Access unique user identifiers (openid)

**Additional Settings**:
- ✅ Check **Require Secret for Web Server Flow**
- ⬜ Leave other checkboxes unchecked

### 1.4 Save and Get Credentials

1. Click **Save**
2. Click **Continue**
3. Click **Manage Consumer Details** (you may need to verify with a code sent to your email)
4. Copy the **Consumer Key** (this is your Client ID)
5. Copy the **Consumer Secret**

## Step 2: Configure Environment Variables

### 2.1 Create `.env.local` file

In the root of your project, create a file named `.env.local`:

```bash
# Salesforce OAuth 2.0 Configuration
SALESFORCE_CLIENT_ID=paste_your_consumer_key_here
SALESFORCE_CLIENT_SECRET=paste_your_consumer_secret_here
SALESFORCE_INSTANCE_URL=https://your-instance.my.salesforce.com
SALESFORCE_REDIRECT_URI=http://localhost:3001/api/oauth2/callback
```

**Important**: 
- For **Developer Edition** orgs, use `https://login.salesforce.com` as the login URL (the code handles this automatically)
- For **Sandbox** orgs, use `https://test.salesforce.com` (the code detects this automatically)

### 2.2 Get a Refresh Token (Optional - for server-to-server operations)

If you want the application to access Salesforce data without user login (for background jobs, cron tasks, etc.), you need a refresh token:

```bash
npm run sf:oauth-setup
```

This will:
1. Open your browser
2. Ask you to log into Salesforce
3. Request permission (click "Allow")
4. Give you a refresh token

Add the refresh token to `.env.local`:

```bash
SALESFORCE_REFRESH_TOKEN=your_refresh_token_here
```

## Step 3: Test the Integration

### 3.1 Start the development server

```bash
npm run dev
```

### 3.2 Test User Login Flow

1. Open http://localhost:3001
2. Click **"Log in with Salesforce"**
3. Log in with your Salesforce credentials
4. Click **"Allow"** when prompted for permissions
5. You should be redirected to `/dashboard` showing Salesforce accounts

### 3.3 Test Server Connection (if you set up refresh token)

Visit: http://localhost:3001/api/test-sf-oauth

You should see:
```json
{
  "success": true,
  "message": "OAuth connection successful!",
  "data": {
    "user": "Your Name",
    "username": "your@email.com",
    "organizationId": "00D...",
    "instanceUrl": "https://your-instance.my.salesforce.com"
  }
}
```

## Step 4: Deploy to Production (Vercel)

### 4.1 Update Connected App

1. Go back to your Connected App in Salesforce
2. Edit the OAuth Settings
3. Add your production callback URL:
   ```
   https://your-app.vercel.app/api/oauth2/callback
   ```
4. Save

### 4.2 Set Environment Variables in Vercel

1. Go to your Vercel project
2. Navigate to **Settings** → **Environment Variables**
3. Add all the variables from your `.env.local`:
   - `SALESFORCE_CLIENT_ID`
   - `SALESFORCE_CLIENT_SECRET`
   - `SALESFORCE_INSTANCE_URL`
   - `SALESFORCE_REDIRECT_URI` (use your Vercel URL)
   - `SALESFORCE_REFRESH_TOKEN` (if applicable)

### 4.3 Deploy

```bash
git push
```

Vercel will automatically deploy your application.

## Authentication Architecture

### Routes

- **`/api/oauth2/auth`** - Initiates OAuth flow, redirects to Salesforce login
- **`/api/oauth2/callback`** - Handles OAuth callback, stores tokens in cookies
- **`/dashboard`** - Protected page that displays Salesforce data

### Connection Functions

The application uses these functions from `src/lib/salesforce/connection-oauth.ts`:

1. **`getSalesforceConnectionFromSession()`** - Gets connection from user's cookies (for user-authenticated routes like `/dashboard`)
2. **`getSalesforceConnection()`** - Gets connection using refresh token (for server-side operations)

### Token Storage

- **Access Token**: Stored in HTTP-only cookie, expires in 2 hours
- **Instance URL**: Stored in HTTP-only cookie
- **Refresh Token**: Stored in HTTP-only cookie, expires in 30 days

## Troubleshooting

### Error: "No authorization code found"

**Problem**: The OAuth callback didn't receive an authorization code.

**Solution**: 
- Check that your callback URL exactly matches the one in your Connected App
- Make sure you're using the correct port (3001)

### Error: "invalid_grant"

**Problem**: The refresh token is invalid or expired.

**Solution**: 
- Run `npm run sf:oauth-setup` again to get a new refresh token
- Update your `.env.local` with the new token

### Error: "redirect_uri_mismatch"

**Problem**: The redirect URI doesn't match what's configured in Salesforce.

**Solution**: 
- Check that `SALESFORCE_REDIRECT_URI` in `.env.local` exactly matches the callback URL in your Connected App
- Check for http vs https
- Check for trailing slashes

### Users can't log in (wrong login URL)

**Problem**: Using `test.salesforce.com` for Developer Edition orgs.

**Solution**: 
- Developer Edition orgs use `login.salesforce.com`
- The code automatically detects this based on your `SALESFORCE_INSTANCE_URL`
- Make sure your instance URL is correctly set in `.env.local`

## Security Notes

1. **Never commit `.env.local` to Git** - It contains sensitive credentials
2. **Use HTTPS in production** - Always use secure connections for OAuth flows
3. **HTTP-only cookies** - Tokens are stored in HTTP-only cookies to prevent XSS attacks
4. **Refresh token rotation** - Consider implementing refresh token rotation for added security

## Additional Resources

- [Salesforce OAuth 2.0 Documentation](https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_web_server_flow.htm)
- [JSforce Documentation](https://jsforce.github.io/)
- [Next.js API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)

## Need Help?

Run the diagnostic script to check your configuration:

```bash
npm run sf:diagnose
```

This will test your OAuth credentials and provide specific error messages if something is wrong.
