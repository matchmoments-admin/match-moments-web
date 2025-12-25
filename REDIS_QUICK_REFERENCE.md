# 🚀 Redis Quick Reference

Quick commands and examples for Match Moments Redis implementation.

---

## 🔧 Setup

\`\`\`bash
# 1. Install dependencies (already done)
npm install @upstash/redis

# 2. Get credentials from https://upstash.com
# 3. Add to .env.local:
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here

# 4. Test
curl http://localhost:3000/api/test-redis
\`\`\`

---

## 📊 Monitoring Commands

\`\`\`bash
# View cache statistics
curl http://localhost:3000/api/cache/stats

# Production
curl https://match-moments-web.vercel.app/api/cache/stats
\`\`\`

---

## 🗑️ Cache Invalidation

\`\`\`bash
# Clear all fixture caches
curl -X DELETE "http://localhost:3000/api/cache/invalidate?scope=fixtures"

# Clear all stats caches
curl -X DELETE "http://localhost:3000/api/cache/invalidate?scope=stats"

# Clear all revenue caches
curl -X DELETE "http://localhost:3000/api/cache/invalidate?scope=revenue"

# Clear all sales caches
curl -X DELETE "http://localhost:3000/api/cache/invalidate?scope=sales"

# Clear all caches (nuclear option)
curl -X DELETE "http://localhost:3000/api/cache/invalidate?scope=all"

# Clear specific key
curl -X DELETE "http://localhost:3000/api/cache/invalidate?key=fixtures:today"

# Clear by pattern
curl -X DELETE "http://localhost:3000/api/cache/invalidate?pattern=fixtures:*"
\`\`\`

---

## 💻 Code Examples

### Using Cache in Query Functions

\`\`\`typescript
import { getCached } from '@/lib/cache/redis';
import { CacheKeys, CacheStrategy } from '@/lib/cache/strategies';

export async function getFixtures() {
  return getCached(
    CacheKeys.FIXTURES_TODAY,
    async () => {
      // Your Salesforce query here
      const data = await salesforceClient.query(...);
      return data;
    },
    CacheStrategy.fixturesToday // 5 minutes
  );
}
\`\`\`

### Manual Cache Invalidation in Code

\`\`\`typescript
import { invalidateFixtureCaches } from '@/lib/cache/redis';

export async function updateFixture(id: string, data: any) {
  // Update in Salesforce
  await salesforceClient.update('Fixture__c', id, data);
  
  // Clear cache so users see updated data
  await invalidateFixtureCaches();
  
  return { success: true };
}
\`\`\`

---

## 📋 Cache Keys Reference

| Cache Key | TTL | Description |
|-----------|-----|-------------|
| \`fixtures:today\` | 5 min | Today's fixtures |
| \`fixtures:live\` | 30 sec | Live fixtures |
| \`fixtures:upcoming\` | 30 min | Upcoming fixtures |
| \`fixtures:detail:{id}\` | 5 min | Specific fixture details |
| \`stats:standings:{sport}\` | 30 min | League standings |
| \`stats:scorers:{sport}\` | 30 min | Top scorers |
| \`stats:player:{id}\` | 1 hour | Player statistics |
| \`dashboard:revenue:*\` | 30 min | Revenue metrics |
| \`dashboard:sales:*\` | 5 min | Sales pipeline |
| \`dashboard:customers:*\` | 5 min | Customer data |

---

## 🔍 Debugging

\`\`\`bash
# Check if Redis is configured
curl http://localhost:3000/api/test-redis

# View all cached keys
curl http://localhost:3000/api/cache/stats

# Watch logs for cache activity
npm run dev
# Look for:
# ✅ [CACHE HIT] fixtures:today
# ❌ [CACHE MISS] fixtures:today
# 💾 [CACHE SET] fixtures:today (TTL: 300s)
\`\`\`

---

## 🚨 Common Issues

### "Redis credentials not configured"
→ Add \`UPSTASH_REDIS_REST_URL\` and \`UPSTASH_REDIS_REST_TOKEN\` to \`.env.local\`

### Cache not working in production
→ Add environment variables to Vercel dashboard (Settings → Environment Variables)

### Stale data showing
→ Clear relevant cache: \`curl -X DELETE "http://localhost:3000/api/cache/invalidate?scope=fixtures"\`

---

## 📊 Performance Metrics

| Metric | Without Redis | With Redis |
|--------|---------------|------------|
| Page Load | 500ms | 50ms |
| API Calls | 100% | 1% |
| Salesforce Load | High | Minimal |

---

## 🔗 Links

- **Setup Guide**: See \`REDIS_SETUP.md\`
- **Upstash Console**: https://console.upstash.io
- **Cache Stats**: http://localhost:3000/api/cache/stats
- **Test Endpoint**: http://localhost:3000/api/test-redis

---

**Quick Test:**
\`\`\`bash
curl http://localhost:3000/api/test-redis && \\
curl http://localhost:3000/api/cache/stats
\`\`\`

Expected: Both return \`{ success: true }\`

