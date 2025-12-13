# Deploy Salesforce Integration to Vercel

## Prerequisites Checklist

Before deploying, make sure:
- [x] System Admin is enabled in Salesforce
- [ ] SOAP API is enabled (API Enabled checkbox in your profile)
- [ ] All code changes are committed
- [ ] Environment variables are ready

---

## Step 1: Enable SOAP API in Salesforce

### Option A: Through User Permissions
1. Setup → Users → Your User
2. Find "API Enabled" checkbox
3. Check it and Save

### Option B: Through Profile (Recommended)
1. Setup → Profiles
2. Click "System Administrator"
3. Click "Edit"
4. Under "Administrative Permissions", check "API Enabled"
5. Click "Save"

### Test Locally First:
```bash
# Test the connection locally before deploying
npm run dev
```

Then visit: http://localhost:3000/api/test-salesforce-data/connection

You should see:
```json
{
  "connected": true,
  "message": "Successfully connected to Salesforce"
}
```

---

## Step 2: Commit Your Changes

Run these commands to commit your work:

```bash
# Check what's changed
git status

# Add the changes
git add package.json package-lock.json src/lib/salesforce/connection.ts
git add scripts/ src/app/api/test-salesforce-data/

# Commit
git commit -m "Add Salesforce connection with username/password auth and test endpoint"

# Push to deploy to Vercel
git push origin main
```

**Note:** The markdown documentation files (*.md) are for reference only. You can add them if you want, but they're not needed for deployment.

---

## Step 3: Configure Vercel Environment Variables

### Method A: Through Vercel Dashboard (Easiest)

1. Go to https://vercel.com/brendan-miltons-projects/match-moments-web/settings/environment-variables

2. Add these environment variables:

   | Name | Value | Notes |
   |------|-------|-------|
   | `SALESFORCE_USERNAME` | Your Salesforce login email | e.g., user@company.com |
   | `SALESFORCE_PASSWORD` | Your Salesforce password | Keep this secret! |
   | `SALESFORCE_SECURITY_TOKEN` | Your security token | Get from Salesforce if needed |
   | `SALESFORCE_INSTANCE_URL` | Your org URL | e.g., https://orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com |

3. Set environment to: **Production, Preview, and Development** (check all three)

4. Click "Save"

### Method B: Through Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Add environment variables
vercel env add SALESFORCE_USERNAME
vercel env add SALESFORCE_PASSWORD
vercel env add SALESFORCE_SECURITY_TOKEN
vercel env add SALESFORCE_INSTANCE_URL

# Follow prompts for each variable
```

### Getting Your Salesforce Security Token

If you don't have your security token:

1. Log into Salesforce
2. Click your profile picture → Settings
3. Left sidebar: "My Personal Information" → "Reset My Security Token"
4. Click "Reset Security Token"
5. Check your email for the new token

---

## Step 4: Redeploy Vercel

After adding environment variables, trigger a redeploy:

### Method A: Through Dashboard
1. Go to https://vercel.com/brendan-miltons-projects/match-moments-web
2. Click on the latest deployment
3. Click "..." menu → "Redeploy"
4. Check "Use existing Build Cache" (optional, faster)
5. Click "Redeploy"

### Method B: Push a New Commit
```bash
# Any commit will trigger a deploy
git commit --allow-empty -m "Trigger Vercel redeploy with env vars"
git push origin main
```

### Method C: Through CLI
```bash
vercel --prod
```

---

## Step 5: Test the Deployment

### Test the Connection Endpoint

Visit: **https://match-moments-web.vercel.app/api/test-salesforce-data/connection**

**Expected Success Response:**
```json
{
  "connected": true,
  "message": "Successfully connected to Salesforce",
  "instanceUrl": "https://orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com",
  "userId": "005...",
  "orgId": "00D...",
  "userInfo": {
    "displayName": "Your Name",
    "email": "you@email.com"
  }
}
```

**If you see an error:**
```json
{
  "connected": false,
  "message": "Authentication failed...",
  "solution": "..."
}
```

Check:
1. Are environment variables set correctly in Vercel?
2. Is SOAP API enabled in Salesforce?
3. Is the security token correct? (no spaces, copy entire token)
4. Did you trigger a redeploy after adding env vars?

---

## Step 6: View Deployment Logs

If something goes wrong:

1. Go to https://vercel.com/brendan-miltons-projects/match-moments-web
2. Click on the latest deployment
3. Click "Functions" tab
4. Click on the function that's failing
5. View the logs for error details

Or use CLI:
```bash
vercel logs
```

---

## Troubleshooting

### Error: "INVALID_LOGIN"
- **Cause:** SOAP API not enabled or wrong credentials
- **Fix:** 
  1. Enable API in Salesforce (see Step 1)
  2. Verify credentials in Vercel env vars
  3. Reset security token if needed

### Error: "Failed to connect"
- **Cause:** Environment variables not set
- **Fix:**
  1. Check Vercel dashboard for env vars
  2. Make sure all 4 variables are set
  3. Redeploy after adding vars

### Error: "Instance URL not valid"
- **Cause:** Wrong instance URL format
- **Fix:** Use format: `https://your-domain.my.salesforce.com` (no trailing slash)

### Success locally but fails on Vercel
- **Cause:** Environment variables not synced
- **Fix:**
  1. Double-check all env vars in Vercel
  2. Make sure you clicked "Save" in Vercel
  3. Trigger a fresh deploy

---

## Security Best Practices

⚠️ **Important Security Notes:**

1. **Never commit `.env.local`** - It contains sensitive credentials
2. **Use OAuth 2.0 for production** - More secure than username/password
3. **Rotate credentials regularly** - Change passwords and tokens periodically
4. **Use Vercel environment variables** - Never hardcode credentials
5. **Monitor API usage** - Check Salesforce login history

### Migrate to OAuth Later (Recommended)

Once you have this working, consider migrating to OAuth 2.0:

```bash
npm run sf:oauth-setup
```

See `START_HERE.md` → Option 2 for full OAuth setup.

---

## Quick Reference Commands

```bash
# Test locally
npm run dev
# Visit: http://localhost:3000/api/test-salesforce-data/connection

# Diagnose Salesforce connection
npm run sf:diagnose

# Commit and deploy
git add .
git commit -m "Your message"
git push origin main

# View Vercel logs
vercel logs

# Redeploy
vercel --prod
```

---

## Success Checklist

- [ ] SOAP API enabled in Salesforce
- [ ] Code changes committed and pushed
- [ ] Environment variables added to Vercel
- [ ] Vercel redeployed with new env vars
- [ ] Test endpoint returns `"connected": true`
- [ ] No errors in Vercel deployment logs

---

## Next Steps After Success

Once your Salesforce connection is working:

1. **Build your features** - Query data, create records, etc.
2. **Add more endpoints** - Create new API routes as needed
3. **Consider OAuth migration** - For production-grade security
4. **Add monitoring** - Track API usage and errors
5. **Document your API** - For your team

---

## Need Help?

- **Connection issues:** Run `npm run sf:diagnose`
- **Salesforce setup:** Read `START_HERE.md`
- **OAuth setup:** Read `SALESFORCE_SETUP.md`
- **Vercel issues:** Check deployment logs

Good luck! 🚀
