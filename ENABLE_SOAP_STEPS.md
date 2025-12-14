# Enable SOAP API - Visual Guide

## 🎯 You Are Here (Based on Your Screenshot)

Your screenshot shows you're viewing **User Permissions** in Salesforce. Perfect location!

```
┌─────────────────────────────────────────────────────┐
│ Salesforce Setup                                    │
│                                                     │
│ User Permissions                                    │
│ ┌─────────────────────────────────────────────┐   │
│ │ ☐ Add Assignment Element to Flows            │   │
│ │ ☑ Administer territory operations            │   │
│ │ ☐ Allow blockchain data upload               │   │
│ │ ☑ API Enabled          ← YOU NEED THIS!     │   │  ⬅️ ENABLE THIS
│ │ ☐ Api Only User                              │   │
│ │ ☑ Approval Admin                             │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│ [Save]                                             │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Step-by-Step: Enable API Access

### Finding "API Enabled" Checkbox

Look for **"API Enabled"** in the permissions list. It should be near:
- "API Enabled" ← **THIS ONE!**
- "Api Only User" (you can see this in your screenshot)

### Enable It

```
☐ API Enabled    →    ☑ API Enabled
```

Then click **[Save]** at the bottom!

---

## Alternative: Through Profile Settings

If you can't edit on the current screen:

### Method 1: Via Profile
```
Setup
  → Quick Find: "Profiles"
  → System Administrator
  → Edit
  → Administrative Permissions
    → ☑ API Enabled
  → Save
```

### Method 2: Via Permission Set
```
Setup
  → Quick Find: "Permission Sets"
  → New
  → Name: "API Access"
  → System Permissions
    → ☑ API Enabled
  → Save
  → Manage Assignments
  → Add your user
```

---

## 🧪 Test That It Worked

### Test 1: Run Diagnostic
```bash
npm run sf:diagnose
```

**Expected output:**
```
✅ SUCCESS! Connected to Salesforce
Instance URL: https://orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com
User: Your Name (your.email@company.com)
Org: Your Org Name
```

### Test 2: Try the API Endpoint Locally
```bash
npm run dev
```

Visit: http://localhost:3000/api/test-salesforce-data/connection

**Expected:**
```json
{
  "connected": true,
  "message": "Successfully connected to Salesforce"
}
```

---

## 🚨 If It Still Doesn't Work

### Wait a Few Minutes
Salesforce permissions can take 2-5 minutes to propagate.

### Try Logging Out
1. Log out of Salesforce
2. Log back in
3. Try the test again

### Verify Your Profile
```
Setup → Users → Click your name
→ Check which Profile you have
→ Make sure that profile has "API Enabled"
```

### Check Permission Sets
```
Setup → Users → Click your name
→ Scroll to "Permission Set Assignments"
→ Check if any of them have "API Enabled"
```

---

## 📊 Decision Tree

```
Can you find "API Enabled" on current screen?
│
├─ YES → Check it → Save → Test (npm run sf:diagnose)
│         │
│         ├─ ✅ Works → DONE! Go to deployment
│         └─ ❌ Still fails → Wait 5 min → Try again
│
└─ NO → Use alternative method (Profile or Permission Set)
        → Follow Method 1 or 2 above
        → Test (npm run sf:diagnose)
```

---

## After API is Enabled ✅

Once you get the ✅ success message, move to deployment:

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Add Vercel Environment Variables**
   - Go to Vercel dashboard
   - Add your 4 Salesforce credentials
   - See: `QUICK_START.md` for details

3. **Test Production**
   - Visit: https://match-moments-web.vercel.app/api/test-salesforce-data/connection

---

## 🔑 What "API Enabled" Actually Does

When you check "API Enabled":

```
❌ BEFORE:
- Web login: ✅ Works
- SOAP API: ❌ Blocked
- REST API: ❌ Blocked
- jsforce: ❌ Can't connect

✅ AFTER:
- Web login: ✅ Works
- SOAP API: ✅ Works
- REST API: ✅ Works
- jsforce: ✅ Can connect
```

This is why you were getting `INVALID_LOGIN` - not because your password was wrong, but because API access was disabled!

---

## 📚 More Info

- **Quick Start Guide:** `QUICK_START.md`
- **Full Deployment Guide:** `DEPLOY_TO_VERCEL.md`
- **Main Documentation:** `START_HERE.md`

---

## Need to Reset Your Security Token?

While you're in Salesforce:

1. Click your profile picture (top right)
2. Settings
3. My Personal Information → Reset My Security Token
4. Click "Reset Security Token"
5. Check your email 📧

You'll need this for the `SALESFORCE_SECURITY_TOKEN` environment variable!

---

Good luck! Once you see that checkbox enabled, you're golden! 🎉
