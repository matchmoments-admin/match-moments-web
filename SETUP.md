# Match Moments Web - Setup Guide

## Prerequisites

Before starting, ensure you have:
- Node.js 18+ installed
- Access to Salesforce org
- Redis instance (local or Upstash)
- Google OAuth credentials (for authentication)
- Anthropic API key (for AI content generation)

## Step 1: Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in the following values in `.env.local`:

### Salesforce Setup

1. **Create Connected App in Salesforce:**
   - Navigate to: Setup → App Manager → New Connected App
   - Enable OAuth Settings
   - Callback URL: `http://localhost:3000/api/auth/salesforce/callback`
   - Selected OAuth Scopes: `api`, `refresh_token`, `offline_access`
   - Save and note the Consumer Key (CLIENT_ID) and Consumer Secret (CLIENT_SECRET)

2. **Add Custom Field to User Object:**
   - Navigate to: Setup → Object Manager → User → Fields & Relationships
   - New Field → Picklist
   - Field Label: `Dashboard Role`
   - API Name: `Dashboard_Role__c`
   - Values (one per line):
     ```
     super_admin
     ceo
     sales
     marketing
     operations
     customer_success
     ```
   - Save and assign field-level security

3. **Assign Roles to Users:**
   - Go to any User record
   - Edit and set their `Dashboard Role` field

4. **Get OAuth Tokens:**
   - Use Salesforce OAuth flow or Postman to get initial access/refresh tokens
   - Or use username/password flow initially for development

### Redis Setup

**Option A: Local Redis**
```bash
# Install Redis (macOS)
brew install redis

# Start Redis
brew services start redis

# Redis URL
REDIS_URL=redis://localhost:6379
```

**Option B: Upstash (Recommended for production)**
1. Sign up at https://upstash.com
2. Create new Redis database
3. Copy the Redis URL from dashboard

### Google OAuth Setup

1. Go to https://console.cloud.google.com
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret

### Anthropic API

1. Sign up at https://console.anthropic.com
2. Create API key
3. Copy key starting with `sk-ant-`

### NextAuth Secret

Generate a secure secret:
```bash
openssl rand -base64 32
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Step 4: Verify Setup

1. Navigate to http://localhost:3000
2. Try to access `/dashboard` - should redirect to sign-in
3. Sign in with Google account that exists in Salesforce
4. Should see dashboard based on your role

## Troubleshooting

### Salesforce Connection Issues
- Verify Connected App credentials
- Check if OAuth tokens are valid
- Ensure user email matches between Google and Salesforce

### Redis Connection Issues
- Verify Redis is running: `redis-cli ping` (should return PONG)
- Check REDIS_URL format

### Authentication Issues
- Clear browser cookies
- Regenerate NEXTAUTH_SECRET
- Check Google OAuth redirect URIs

## Next Steps

1. Add sample data to Salesforce (Fixtures, Teams, etc.)
2. Test public pages (games, news)
3. Test dashboard with different roles
4. Set up production environment on Vercel

