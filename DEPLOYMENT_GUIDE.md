# Deployment Guide - Match Moments Platform

## Pre-Deployment Checklist

### ✅ Environment Variables
Ensure all required environment variables are set in production:

```bash
# Salesforce JWT Authentication (Required)
SALESFORCE_JWT_CLIENT_ID=<consumer_key>
SALESFORCE_JWT_USERNAME=<integration_user@domain.com>
SALESFORCE_JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
SALESFORCE_INSTANCE_URL=https://your-instance.salesforce.com

# Public API Base URL (Required)
NEXT_PUBLIC_API_BASE_URL=https://your-domain.com

# Redis Cache (Highly Recommended - Use Upstash for Vercel)
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token

# Optional OAuth (for Dashboard)
SALESFORCE_CLIENT_ID=<oauth_consumer_key>
SALESFORCE_CLIENT_SECRET=<oauth_consumer_secret>
NEXTAUTH_SECRET=<generate_with_openssl>
NEXTAUTH_URL=https://your-domain.com
```

### ✅ Salesforce Configuration

1. **JWT Connected App** (for public website):
   - Digital certificate uploaded
   - "Admin approved users are pre-authorized" policy set
   - System Administrator profile added
   - API scopes: api, web, refresh_token, id

2. **Data Population**:
   - All 25 Salesforce objects created
   - Sample data populated for all sports/genders
   - Record Types configured (Team, Player)
   - Lookup relationships established

3. **API Limits**:
   - Check daily API call limits
   - Monitor usage in Setup → System Overview
   - Consider upgrading if approaching limits

### ✅ Redis Cache Setup

Using Upstash for Vercel deployment:

1. Create Upstash Redis database
2. Copy REST API credentials
3. Add to Vercel environment variables
4. Test connection: `curl https://your-domain.com/api/health/redis`

### ✅ Build and Type Check

```bash
# Install dependencies
npm install

# Type check
npm run type-check

# Lint
npm run lint

# Build for production
npm run build
```

## Deployment Steps (Vercel)

### 1. Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Select the `match-moments-web` repository

### 2. Configure Project

**Framework Preset**: Next.js  
**Root Directory**: `./` (or specify if in monorepo)  
**Build Command**: `npm run build`  
**Output Directory**: `.next`  
**Install Command**: `npm install`

### 3. Add Environment Variables

In Vercel project settings → Environment Variables:

- Add all variables from `.env.local`
- Set for: Production, Preview, Development
- **Important**: Use multiline editor for `SALESFORCE_JWT_PRIVATE_KEY`

### 4. Deploy

Click "Deploy" and wait for build to complete.

### 5. Configure Domain

1. Go to Settings → Domains
2. Add your custom domain: `matchmoments.co`
3. Configure DNS:
   ```
   A Record: @ → 76.76.21.21
   CNAME: www → cname.vercel-dns.com
   ```
4. Enable HTTPS (automatic with Vercel)

### 6. Verify Deployment

After deployment, test:

```bash
# Health check
curl https://matchmoments.co/api/health/salesforce
# Should return: { status: "healthy", authentication: { connected: true } }

# Redis check
curl https://matchmoments.co/api/health/redis
# Should return: { success: true, tests: { caching: true } }

# Test API routes
curl https://matchmoments.co/api/sports/matches/live
curl https://matchmoments.co/api/sports/teams
curl https://matchmoments.co/api/sports/players
```

## Post-Deployment Testing

### Manual Testing Checklist

#### Homepage
- [ ] Live matches widget displays
- [ ] Navigation links work
- [ ] Global search functions
- [ ] Featured content loads

#### Women's Soccer Section
- [ ] Competition cards display
- [ ] Fixtures list loads
- [ ] Trending moments show
- [ ] All links navigate correctly

#### Match Detail Page
- [ ] Match data loads from Salesforce
- [ ] Live indicator shows for live matches
- [ ] Auto-refresh works (30s interval)
- [ ] Period breakdown displays
- [ ] Match timeline renders
- [ ] Related articles link

#### Player Detail Page
- [ ] Player profile loads
- [ ] Season statistics display
- [ ] Awards section shows (Transfermarkt style)
- [ ] Career history timeline works
- [ ] Player moments display

#### Team Detail Page
- [ ] Team information loads
- [ ] Squad list displays
- [ ] Season stats show
- [ ] Recent fixtures list
- [ ] Team news articles

#### Competition Detail Page
- [ ] Competition info loads
- [ ] Standings table displays
- [ ] Top scorers list shows
- [ ] Fixtures list works

#### Season Overview Page
- [ ] Season info displays
- [ ] Cross-competition stats aggregate
- [ ] Top scorers (combined) show
- [ ] Top assists (combined) show
- [ ] Team standings display

#### Articles System
- [ ] Articles list loads
- [ ] Article detail page works
- [ ] Latest articles endpoint
- [ ] Filtering by team/player/competition
- [ ] Featured images display

#### Moments Gallery
- [ ] Trending moments load
- [ ] Viral score sorting works
- [ ] Video clips display
- [ ] Social engagement stats show

#### Search Functionality
- [ ] Global search opens
- [ ] Search results display
- [ ] Teams search works
- [ ] Players search works
- [ ] Competitions search works
- [ ] Articles search works
- [ ] Search result links navigate

#### Performance & Caching
- [ ] Redis cache HIT in logs
- [ ] Page load times < 2s
- [ ] Images load optimized (Next Image)
- [ ] No console errors
- [ ] No 500 errors in logs

#### SEO & Metadata
- [ ] Page titles dynamic
- [ ] Meta descriptions present
- [ ] Open Graph tags correct
- [ ] Twitter cards work
- [ ] Structured data (JSON-LD) present
- [ ] Breadcrumbs schema valid

### Automated Tests (Future)

```bash
# Run tests (when implemented)
npm test

# E2E tests
npm run test:e2e

# Performance tests
npm run test:perf
```

## Monitoring & Maintenance

### Vercel Analytics

Enable in Vercel dashboard:
- Core Web Vitals
- Real User Monitoring
- Performance insights

### Error Tracking

Recommended: [Sentry](https://sentry.io)

```bash
npm install @sentry/nextjs
```

Configure in `sentry.config.js`.

### Salesforce API Monitoring

- Monitor daily API call usage
- Set up alerts for 80% threshold
- Review API logs weekly

### Redis Cache Monitoring

- Check Upstash dashboard for:
  - Request count
  - Cache hit ratio (aim for >80%)
  - Memory usage
  - Connection errors

### Performance Monitoring

Key metrics to track:
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

## Rollback Procedure

If issues occur after deployment:

1. **Immediate Rollback** (Vercel):
   - Go to Deployments tab
   - Find previous stable deployment
   - Click "Promote to Production"

2. **Fix Forward** (Preferred):
   - Create hotfix branch
   - Make fix
   - Deploy to preview
   - Test thoroughly
   - Merge and deploy to production

## Troubleshooting

### Salesforce Authentication Issues

```bash
# Check JWT authentication
curl https://matchmoments.co/api/health/salesforce

# Common issues:
- Private key format incorrect (include header/footer)
- Username doesn't match connected app profile
- Consumer key incorrect
```

### Redis Connection Issues

```bash
# Check Redis connection
curl https://matchmoments.co/api/health/redis

# Common issues:
- UPSTASH_REDIS_REST_URL or TOKEN incorrect
- Upstash database paused (free tier)
- Network timeout (check Upstash status)
```

### Build Failures

```bash
# Common issues:
- TypeScript errors: Run npm run type-check locally
- Missing dependencies: Ensure package.json is committed
- Environment variables: Check they're set in Vercel
- Node version: Verify in package.json "engines"
```

### Performance Issues

```bash
# Check cache performance
curl https://matchmoments.co/api/cache/stats

# If cache hit ratio < 50%:
- Verify Redis is connected
- Check cache TTL settings
- Monitor Salesforce API calls
```

## Success Criteria

Deployment is successful when:

✅ All health checks pass  
✅ 5+ test users can navigate site  
✅ Live matches auto-refresh  
✅ Search returns results  
✅ No console errors  
✅ Page load < 2s  
✅ Cache hit ratio > 70%  
✅ SEO metadata present  
✅ Mobile responsive  
✅ Analytics tracking  

## Support Contacts

- **Platform Issues**: [Your support email]
- **Salesforce Issues**: Salesforce Admin
- **Vercel Issues**: [Vercel Support](https://vercel.com/support)
- **Upstash Issues**: [Upstash Support](https://upstash.com/support)

---

**Last Updated**: December 2024  
**Version**: 1.0.0

