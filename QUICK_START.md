# 🚀 Quick Start - Enable SOAP API & Deploy

## Current Status
✅ Code committed and ready to deploy
📦 Commit: `feat: Add Salesforce connection with username/password auth`

## What You Need To Do Now

### 1️⃣ Enable SOAP API in Salesforce (2 minutes)

You're already in the right place based on your screenshot! Here's what to do:

**Quick Path:**
1. In your current Salesforce screen, find the **"API Enabled"** checkbox
2. ✅ **Check it**
3. Click **Save**

**If you can't find it:**
1. Go to **Setup** (gear icon top-right)
2. Quick Find → Type **"Profiles"**
3. Click **"System Administrator"**
4. Click **Edit**
5. Scroll to **"Administrative Permissions"**
6. Check **"API Enabled"**
7. Click **Save**

---

### 2️⃣ Test Locally (1 minute)

Before deploying, test that it works locally:

```bash
# Start the dev server
npm run dev
```

Then open: **http://localhost:3000/api/test-salesforce-data/connection**

**✅ Success looks like:**
```json
{
  "connected": true,
  "message": "Successfully connected to Salesforce",
  "userInfo": { ... }
}
```

**❌ If you get an error:**
- Make sure you enabled API in Salesforce (step 1)
- Check your `.env.local` has all 4 variables:
  - `SALESFORCE_USERNAME`
  - `SALESFORCE_PASSWORD`
  - `SALESFORCE_SECURITY_TOKEN`
  - `SALESFORCE_INSTANCE_URL`

---

### 3️⃣ Push to GitHub (30 seconds)

```bash
git push origin main
```

This will automatically trigger a Vercel deployment!

---

### 4️⃣ Add Environment Variables to Vercel (2 minutes)

Go to: **https://vercel.com/brendan-miltons-projects/match-moments-web/settings/environment-variables**

Add these 4 variables (copy from your `.env.local`):

| Variable Name | Example Value | Where to Get It |
|--------------|---------------|-----------------|
| `SALESFORCE_USERNAME` | `your.email@company.com` | Your Salesforce login |
| `SALESFORCE_PASSWORD` | `YourPassword123` | Your Salesforce password |
| `SALESFORCE_SECURITY_TOKEN` | `abc123XYZ456...` | Salesforce → Settings → Reset Security Token |
| `SALESFORCE_INSTANCE_URL` | `https://orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com` | Your Salesforce domain |

**Important:** Select **Production, Preview, and Development** for each variable!

#### Don't Have Your Security Token?
1. Log into Salesforce
2. Click your profile picture → **Settings**
3. Left menu: **My Personal Information** → **Reset My Security Token**
4. Click **Reset Security Token**
5. Check your email 📧

---

### 5️⃣ Redeploy Vercel (30 seconds)

After adding environment variables:

**Method A - Dashboard:**
1. Go to https://vercel.com/brendan-miltons-projects/match-moments-web
2. Click on the latest deployment
3. Click **"..."** menu → **"Redeploy"**
4. Click **"Redeploy"** again to confirm

**Method B - CLI:**
```bash
vercel --prod
```

**Method C - Push empty commit:**
```bash
git commit --allow-empty -m "redeploy"
git push origin main
```

---

### 6️⃣ Test Production (30 seconds)

Visit: **https://match-moments-web.vercel.app/api/test-salesforce-data/connection**

**Expected result:**
```json
{
  "connected": true,
  "message": "Successfully connected to Salesforce",
  "instanceUrl": "https://orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com",
  "userInfo": { ... }
}
```

---

## ✅ Success Checklist

- [ ] SOAP API enabled in Salesforce (API Enabled checkbox)
- [ ] Tested locally and got `"connected": true`
- [ ] Pushed code to GitHub: `git push origin main`
- [ ] Added 4 environment variables to Vercel
- [ ] Triggered redeploy in Vercel
- [ ] Production endpoint returns success

---

## 🆘 Troubleshooting

### "INVALID_LOGIN" Error
**Problem:** SOAP API not enabled or wrong credentials

**Fix:**
1. ✅ Make sure you checked "API Enabled" in Salesforce
2. Wait 2-3 minutes for changes to propagate
3. Log out and back into Salesforce
4. Try again

### Works Locally But Not on Vercel
**Problem:** Environment variables not set

**Fix:**
1. Go to Vercel settings → Environment Variables
2. Make sure all 4 variables are there
3. Click "Redeploy" (not just refresh)

### "Security Token" Error
**Problem:** Missing or wrong security token

**Fix:**
1. Reset your security token in Salesforce
2. Check your email for the new token
3. Update `SALESFORCE_SECURITY_TOKEN` in Vercel
4. Redeploy

---

## 📚 Need More Help?

- **Full deployment guide:** `DEPLOY_TO_VERCEL.md`
- **Main documentation:** `START_HERE.md`
- **Diagnostic tool:** `npm run sf:diagnose`

---

## Commands Reference

```bash
# Test locally
npm run dev
# Then visit: http://localhost:3000/api/test-salesforce-data/connection

# Run diagnostic
npm run sf:diagnose

# Push and deploy
git push origin main

# Deploy via CLI
vercel --prod

# View logs
vercel logs
```

---

## What's Next?

Once this is working, you can:
1. ✅ Start building Salesforce features
2. 🔄 Consider migrating to OAuth 2.0 (more secure)
3. 📊 Add more API endpoints for your data
4. 🧪 Add automated tests

**For OAuth setup later:**
```bash
npm run sf:oauth-setup
```

See `START_HERE.md` → Option 2 for full OAuth guide.

---

Good luck! 🎉
