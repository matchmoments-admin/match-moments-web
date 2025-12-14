# 🚀 Salesforce Integration Quick Start

## 🎯 Current Status

You're getting an **INVALID_LOGIN** error because:
- **SOAP API is disabled** in your Salesforce Developer org
- Username/password authentication requires SOAP API

## 🔧 Quick Fix

Choose one solution:

### 1️⃣ Enable SOAP API (2 minutes)
✅ Quick and easy
❌ Less secure, not for production

```bash
# See instructions in:
cat ENABLE_SOAP_API.md
```

Then test: `npm run sf:diagnose`

### 2️⃣ Switch to OAuth 2.0 (10 minutes) ⭐ **Recommended**
✅ Secure and automatic
✅ Production-ready
✅ No SOAP API needed

```bash
# Follow the guide:
cat FIX_SALESFORCE_CONNECTION.md

# Run OAuth setup:
npm run sf:oauth-setup
```

---

## 📖 Documentation

| File | Purpose |
|------|---------|
| **FIX_SALESFORCE_CONNECTION.md** | 🔧 **START HERE** - Complete fix guide |
| **SALESFORCE_SETUP.md** | 📚 Full setup documentation |
| **ENABLE_SOAP_API.md** | ⚡ Quick SOAP API enablement |

---

## 🛠️ Useful Commands

```bash
# Diagnose connection issues
npm run sf:diagnose

# Set up OAuth 2.0 (interactive)
npm run sf:oauth-setup

# Test connection (after starting dev server)
curl http://localhost:3001/api/test-salesforce-data/connection | jq .
```

---

## ❓ FAQ

**Q: How often do security tokens expire?**
A: They don't! Only when manually reset.

**Q: Can we automate authentication?**
A: Yes! Use OAuth 2.0 - tokens refresh automatically.

**Q: Which option should I choose?**
A: For testing → Enable SOAP API. For production → OAuth 2.0.

---

## 🆘 Need Help?

1. Read: `FIX_SALESFORCE_CONNECTION.md`
2. Run: `npm run sf:diagnose`
3. Check: Environment variables in `.env.local`

---

**Next Step:** Open `FIX_SALESFORCE_CONNECTION.md` and follow Option 1 or Option 2.
