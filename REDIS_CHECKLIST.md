# 🚀 Redis Implementation Checklist

Quick checklist to activate Redis caching for Match Moments.

---

## ✅ Implementation Status

### Code Changes (COMPLETED ✅)
- [x] Removed `ioredis` dependency
- [x] Installed `@upstash/redis` for serverless compatibility
- [x] Updated `src/lib/cache/redis.ts` to use Upstash
- [x] Created test endpoint `/api/test-redis`
- [x] Created monitoring endpoint `/api/cache/stats`
- [x] Created invalidation endpoint `/api/cache/invalidate`
- [x] Updated README.md with Redis section
- [x] Created comprehensive documentation
- [x] Tested build successfully

### Query Functions (ALREADY IMPLEMENTED ✅)
- [x] Fixtures queries use caching
- [x] Stats queries use caching
- [x] Revenue queries use caching
- [x] Sales queries use caching
- [x] Cache strategies defined

---

## 📋 Activation Checklist

### Local Development Setup

#### 1. Create Upstash Account
- [ ] Visit https://upstash.com
- [ ] Sign up (GitHub/Google)
- [ ] Verify email

#### 2. Create Redis Database
- [ ] Click "Create Database"
- [ ] Name: `match-moments-cache`
- [ ] Region: `us-east-1` (or closest to you)
- [ ] Plan: Free (10K requests/day)
- [ ] Click "Create"

#### 3. Get Credentials
- [ ] Click on database
- [ ] Copy `UPSTASH_REDIS_REST_URL`
- [ ] Copy `UPSTASH_REDIS_REST_TOKEN`

#### 4. Configure Local Environment
- [ ] Create/update `.env.local` file
- [ ] Add `UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io`
- [ ] Add `UPSTASH_REDIS_REST_TOKEN=your_token_here`
- [ ] Save file

#### 5. Test Locally
- [ ] Run `npm run dev`
- [ ] Visit http://localhost:3000/api/test-redis
- [ ] Verify response shows `"success": true`
- [ ] Visit http://localhost:3000/api/cache/stats
- [ ] Verify cache is enabled

#### 6. Verify Cache is Working
- [ ] Check console logs for cache indicators:
  - `✅ [CACHE HIT]` messages
  - `❌ [CACHE MISS]` messages
  - `💾 [CACHE SET]` messages
- [ ] Visit `/games` page twice - second load should be faster
- [ ] Check cache stats show cached keys

---

### Production Deployment

#### 7. Configure Vercel Environment Variables
- [ ] Go to https://vercel.com
- [ ] Select project: `match-moments-web`
- [ ] Click Settings → Environment Variables
- [ ] Add `UPSTASH_REDIS_REST_URL`:
  - Name: `UPSTASH_REDIS_REST_URL`
  - Value: `https://xxxxx.upstash.io`
  - Environments: ✓ Production, ✓ Preview, ✓ Development
  - Click Add
- [ ] Add `UPSTASH_REDIS_REST_TOKEN`:
  - Name: `UPSTASH_REDIS_REST_TOKEN`
  - Value: Your token
  - Environments: ✓ Production, ✓ Preview, ✓ Development
  - Click Add

#### 8. Deploy to Production
- [ ] Commit changes: `git add . && git commit -m "feat: activate Redis caching"`
- [ ] Push to GitHub: `git push`
- [ ] Wait for Vercel auto-deployment (2-3 minutes)
- [ ] Check deployment status in Vercel dashboard

#### 9. Test Production
- [ ] Visit https://match-moments-web.vercel.app/api/test-redis
- [ ] Verify response shows `"success": true`
- [ ] Visit https://match-moments-web.vercel.app/api/cache/stats
- [ ] Check cache is enabled
- [ ] Visit https://match-moments-web.vercel.app/games
- [ ] Check page loads faster

#### 10. Monitor Performance
- [ ] Open Upstash Console: https://console.upstash.io
- [ ] Click on your database
- [ ] Monitor:
  - Commands per second (cache activity)
  - Daily requests (should be under 10K for free tier)
  - Storage used
- [ ] Check Vercel logs: `vercel logs --follow`
- [ ] Look for cache hit/miss patterns

---

## 🎯 Success Criteria

### Local Development
- ✅ `/api/test-redis` returns success
- ✅ Console shows cache HIT/MISS messages
- ✅ Page loads are noticeably faster on reload
- ✅ `/api/cache/stats` shows cached keys

### Production
- ✅ `/api/test-redis` returns success in production
- ✅ `/api/cache/stats` shows cache is enabled
- ✅ Vercel logs show cache activity
- ✅ Upstash dashboard shows request activity
- ✅ Page loads are 5-10x faster

---

## 🚨 Troubleshooting

### ❌ Test endpoint fails

**Error:** "Redis credentials not configured"

**Fix:**
1. Verify `.env.local` contains correct credentials
2. Restart dev server: `npm run dev`
3. Re-test: `curl http://localhost:3000/api/test-redis`

---

### ❌ Cache not working in production

**Fix:**
1. Check Vercel dashboard → Settings → Environment Variables
2. Verify both variables are set for all environments
3. Trigger new deployment: `vercel --prod`
4. Wait 2-3 minutes, then re-test

---

### ❌ "Connection refused" error

**Fix:**
1. Check Upstash database is active (not paused/deleted)
2. Verify URL format: `https://xxxxx.upstash.io` (includes https://)
3. Test in Upstash dashboard: Redis → CLI → `PING` (should return `PONG`)

---

### ❌ Still seeing Salesforce queries in logs

**This is normal!** Cache misses will still query Salesforce. After the first request, subsequent requests use cache.

**Verify:**
1. Visit page once (cache miss - queries Salesforce)
2. Visit same page again immediately (cache hit - no Salesforce query)
3. Check logs for `[CACHE HIT]` messages

---

## 📊 Performance Validation

### Before Redis (Baseline)
Run this test BEFORE activating Redis:
\`\`\`bash
time curl http://localhost:3000/games
# Note the time (e.g., 0.5-1.0 seconds)
\`\`\`

### After Redis (Should be 5-10x faster)
Run this test AFTER activating Redis:
\`\`\`bash
# First request (cache miss)
time curl http://localhost:3000/games
# Note: Similar to baseline (~0.5-1.0s)

# Second request (cache hit)
time curl http://localhost:3000/games
# Note: Should be much faster (~0.05-0.1s)
\`\`\`

**Expected Results:**
- First request: 500-1000ms (cache miss)
- Second request: 50-100ms (cache hit)
- **10x improvement!** 🚀

---

## 🎯 Optional: Advanced Configuration

### Secure Cache Invalidation Endpoint
- [ ] Generate secure token: `openssl rand -base64 32`
- [ ] Add to `.env.local`: `CACHE_ADMIN_TOKEN=your_generated_token`
- [ ] Add to Vercel environment variables
- [ ] Update `/api/cache/invalidate` to check token

### Set Up Cache Warming
- [ ] Create Vercel cron job to pre-warm cache
- [ ] Configure in `vercel.json`
- [ ] Test cron execution

### Monitor with Alerts
- [ ] Set up Upstash alerts for quota usage
- [ ] Configure Vercel notifications for errors
- [ ] Create dashboard for cache metrics

---

## 📚 Documentation Reference

| Document | Purpose |
|----------|---------|
| `REDIS_IMPLEMENTATION_SUMMARY.md` | Overview of what was implemented |
| `REDIS_SETUP.md` | Complete step-by-step setup guide |
| `REDIS_QUICK_REFERENCE.md` | Quick commands and examples |
| `ENV_SETUP.md` | Environment variables guide |
| `REDIS_CHECKLIST.md` | This file - activation checklist |
| `README.md` | Updated with Redis section |

---

## 🎉 Completion

When all checkboxes are marked:

### Local Development ✅
- [x] Upstash account created
- [x] Redis database configured
- [x] Environment variables set
- [x] Tests passing
- [x] Cache working

### Production ✅
- [x] Vercel variables configured
- [x] Deployed to production
- [x] Tests passing in production
- [x] Cache working in production
- [x] Performance improved

---

## 🚀 Next Steps

1. **Monitor Performance**
   - Check Upstash dashboard daily
   - Review cache hit rates in `/api/cache/stats`
   - Monitor Vercel function execution times

2. **Optimize Cache Strategies**
   - Adjust TTLs based on usage patterns
   - Review and update `src/lib/cache/strategies.ts`

3. **Scale Confidently**
   - Current setup handles 10K requests/day (free)
   - Upgrade to Pro ($10/mo) when needed (100K/day)
   - Continue monitoring usage

---

## 📞 Support

**Upstash Issues:**
- Dashboard: https://console.upstash.io
- Discord: https://upstash.com/discord
- Docs: https://docs.upstash.com/redis

**Vercel Issues:**
- Dashboard: https://vercel.com
- Logs: `vercel logs --follow`
- Docs: https://vercel.com/docs

**App Issues:**
- Test endpoint: `/api/test-redis`
- Cache stats: `/api/cache/stats`
- Check console logs for cache activity

---

**Ready?** Start with Step 1: Create Upstash Account ☝️

**Estimated Time:** 10-15 minutes total

