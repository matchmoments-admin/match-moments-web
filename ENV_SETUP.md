# Environment Variables Setup Guide

Complete guide for configuring environment variables for Match Moments Web Platform.

---

## 📋 Required Environment Variables

### Salesforce JWT Authentication (REQUIRED)

\`\`\`env
# Salesforce Login URL
SALESFORCE_LOGIN_URL=https://login.salesforce.com

# Connected App Consumer Key
SALESFORCE_CLIENT_ID=3MVG9...your_consumer_key_here

# Service Account Username
SALESFORCE_USERNAME=integration@yourdomain.com

# JWT Private Key (multi-line, keep quotes)
SALESFORCE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
...your private key here...
-----END PRIVATE KEY-----"
\`\`\`

**Setup Instructions**: See \`JWT-SETUP.md\`

---

## ⚡ Redis Cache (OPTIONAL - Recommended for Production)

\`\`\`env
# Upstash Redis REST API
UPSTASH_REDIS_REST_URL=https://your-database-name.upstash.io
UPSTASH_REDIS_REST_TOKEN=AabBcc...your_token_here
\`\`\`

**Benefits**:
- 7-10x faster page loads
- 99% fewer Salesforce API calls
- Free tier: 10,000 requests/day

**Setup Instructions**: See \`REDIS_SETUP.md\`

**Without Redis**: App works fine but queries Salesforce on every request.

---

## 🔧 Optional Environment Variables

### Next.js Configuration

\`\`\`env
# Public API base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# Vercel (automatically set in production)
# VERCEL_ENV=production
# NEXT_PUBLIC_VERCEL_URL=match-moments-web.vercel.app
\`\`\`

### Development Debugging

\`\`\`env
# Enable verbose logging
# DEBUG=true
# LOG_LEVEL=verbose
\`\`\`

---

## 📁 File Structure

### Local Development

\`\`\`
.env.local          ← Create this file (gitignored)
.env.example        ← Template (committed to git)
\`\`\`

### Vercel Production

Set in: **Vercel Dashboard** → **Settings** → **Environment Variables**

---

## 🚀 Setup Instructions

### Local Development

**Step 1: Create .env.local**

\`\`\`bash
cd /path/to/match-moments-web
touch .env.local
\`\`\`

**Step 2: Add Required Variables**

Copy from \`.env.example\` and fill in your values:

\`\`\`bash
# Minimum required for app to run:
SALESFORCE_LOGIN_URL=https://login.salesforce.com
SALESFORCE_CLIENT_ID=your_consumer_key
SALESFORCE_USERNAME=your_username@domain.com
SALESFORCE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----"
\`\`\`

**Step 3: Add Redis (Optional)**

\`\`\`bash
# After setting up Upstash account:
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token
\`\`\`

**Step 4: Test**

\`\`\`bash
npm run dev
curl http://localhost:3000/api/health/salesforce
curl http://localhost:3000/api/test-redis
\`\`\`

---

### Vercel Production

**Step 1: Open Vercel Dashboard**

1. Go to: https://vercel.com/brendan-miltons-projects/match-moments-web
2. Click: **Settings** → **Environment Variables**

**Step 2: Add Salesforce Variables**

| Name | Value | Environments |
|------|-------|--------------|
| \`SALESFORCE_LOGIN_URL\` | \`https://login.salesforce.com\` | ✓ Production, ✓ Preview, ✓ Development |
| \`SALESFORCE_CLIENT_ID\` | Your consumer key | ✓ Production, ✓ Preview, ✓ Development |
| \`SALESFORCE_USERNAME\` | Your service account | ✓ Production, ✓ Preview, ✓ Development |
| \`SALESFORCE_PRIVATE_KEY\` | Your private key | ✓ Production, ✓ Preview, ✓ Development |

**Step 3: Add Redis Variables (Recommended)**

| Name | Value | Environments |
|------|-------|--------------|
| \`UPSTASH_REDIS_REST_URL\` | \`https://xxxxx.upstash.io\` | ✓ Production, ✓ Preview, ✓ Development |
| \`UPSTASH_REDIS_REST_TOKEN\` | Your token | ✓ Production, ✓ Preview, ✓ Development |

**Step 4: Redeploy**

After adding variables, trigger a new deployment:

\`\`\`bash
git commit --allow-empty -m "Trigger redeploy with new env vars"
git push
\`\`\`

Or use Vercel CLI:

\`\`\`bash
vercel --prod
\`\`\`

**Step 5: Verify**

\`\`\`bash
curl https://match-moments-web.vercel.app/api/health/salesforce
curl https://match-moments-web.vercel.app/api/test-redis
\`\`\`

---

## 🔒 Security Best Practices

### ✅ DO:
- Use \`.env.local\` for local development (gitignored)
- Use Vercel dashboard for production secrets
- Rotate credentials regularly
- Use service accounts (not personal accounts)
- Keep private keys secure

### ❌ DON'T:
- Commit \`.env.local\` to git
- Share credentials in Slack/email
- Use production credentials locally
- Hardcode secrets in code

---

## 🧪 Testing Configuration

### Test Salesforce Connection

\`\`\`bash
# Local
curl http://localhost:3000/api/health/salesforce

# Production
curl https://match-moments-web.vercel.app/api/health/salesforce
\`\`\`

**Expected Response:**
\`\`\`json
{
  "status": "healthy",
  "authentication": {
    "connected": true,
    "method": "JWT Bearer"
  }
}
\`\`\`

### Test Redis Connection

\`\`\`bash
# Local
curl http://localhost:3000/api/test-redis

# Production
curl https://match-moments-web.vercel.app/api/test-redis
\`\`\`

**Expected Response:**
\`\`\`json
{
  "success": true,
  "status": "All tests passed! 🎉"
}
\`\`\`

---

## 🐛 Troubleshooting

### "SALESFORCE_CLIENT_ID is not defined"

**Solution**: Add all Salesforce variables to \`.env.local\` or Vercel dashboard

### "Redis credentials not configured"

**Solution**: This is just a warning. App works without Redis. To enable caching, add Upstash credentials.

### "Authentication failed"

**Solution**: 
1. Verify \`SALESFORCE_PRIVATE_KEY\` is formatted correctly (includes BEGIN/END markers)
2. Check username matches Connected App settings
3. Ensure Connected App is approved in Salesforce

### Changes not taking effect

**Solution**:
1. **Local**: Restart dev server (\`npm run dev\`)
2. **Vercel**: Trigger new deployment after changing variables

---

## 📊 Environment-Specific Configuration

### Development (\`.env.local\`)
- Local Salesforce sandbox
- Local Redis (optional)
- Debug logging enabled

### Preview (Vercel)
- Staging Salesforce org
- Upstash Redis
- Production-like testing

### Production (Vercel)
- Production Salesforce org
- Upstash Redis
- Error tracking enabled
- Performance monitoring

---

## 🔄 Rotating Credentials

### Salesforce JWT Key Rotation

1. Generate new key pair:
   \`\`\`bash
   openssl req -newkey rsa:2048 -nodes -keyout server.key -out server.csr
   \`\`\`

2. Upload new certificate to Salesforce Connected App

3. Update \`SALESFORCE_PRIVATE_KEY\` in:
   - \`.env.local\` (local)
   - Vercel dashboard (production)

4. Test before removing old key

### Redis Token Rotation

1. Upstash Dashboard → Your Database → Settings
2. Click "Regenerate Token"
3. Update \`UPSTASH_REDIS_REST_TOKEN\` in:
   - \`.env.local\` (local)
   - Vercel dashboard (production)

---

## 📝 Example .env.local File

\`\`\`env
# ==============================================================================
# Match Moments - Local Development Environment Variables
# ==============================================================================

# ------------------------------------------------------------------------------
# Salesforce JWT Authentication (REQUIRED)
# ------------------------------------------------------------------------------
SALESFORCE_LOGIN_URL=https://login.salesforce.com
SALESFORCE_CLIENT_ID=3MVG9...your_consumer_key_here
SALESFORCE_USERNAME=integration@yourdomain.com
SALESFORCE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
...your private key here...
-----END PRIVATE KEY-----"

# ------------------------------------------------------------------------------
# Upstash Redis Cache (OPTIONAL - Highly Recommended)
# ------------------------------------------------------------------------------
UPSTASH_REDIS_REST_URL=https://your-database-name.upstash.io
UPSTASH_REDIS_REST_TOKEN=AabBcc...your_token_here

# ------------------------------------------------------------------------------
# Next.js Configuration (Optional)
# ------------------------------------------------------------------------------
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# ------------------------------------------------------------------------------
# Development Debugging (Optional)
# ------------------------------------------------------------------------------
# DEBUG=true
# LOG_LEVEL=verbose
\`\`\`

---

## ✅ Configuration Checklist

### Initial Setup
- [ ] Create \`.env.local\` file
- [ ] Add Salesforce credentials
- [ ] Test Salesforce connection: \`curl http://localhost:3000/api/health/salesforce\`
- [ ] App loads successfully: \`npm run dev\`

### Redis Setup (Optional)
- [ ] Create Upstash account
- [ ] Create Redis database
- [ ] Add Redis credentials to \`.env.local\`
- [ ] Test Redis: \`curl http://localhost:3000/api/test-redis\`

### Production Deployment
- [ ] Add all variables to Vercel dashboard
- [ ] Deploy to Vercel
- [ ] Test production endpoints
- [ ] Monitor for errors

---

## 🔗 Related Documentation

- **Salesforce Setup**: See \`JWT-SETUP.md\`
- **Redis Setup**: See \`REDIS_SETUP.md\`
- **Redis Quick Reference**: See \`REDIS_QUICK_REFERENCE.md\`
- **General Setup**: See \`README.md\`

---

## 🆘 Need Help?

1. Check error logs: \`vercel logs --follow\`
2. Test endpoints: \`/api/health/salesforce\` and \`/api/test-redis\`
3. Verify variables are set: Vercel Dashboard → Settings → Environment Variables
4. Review documentation: \`README.md\` and setup guides

---

**Quick Start:**
\`\`\`bash
# 1. Create .env.local
cp .env.example .env.local

# 2. Edit with your credentials
nano .env.local

# 3. Test
npm run dev
curl http://localhost:3000/api/health/salesforce
\`\`\`

