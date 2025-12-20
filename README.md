# Match Moments Web Platform

A comprehensive sports media platform built with Next.js 16, featuring match moments, highlights, competitions, and player statistics. Focused on women's sports (60% of coverage) with a modern, minimalist design inspired by The Ringer.

## 🌟 Features

### Public Features
- **Match Moments**: Trending highlights and key moments from live matches
- **Live Scores**: Real-time match updates with period breakdowns
- **Competitions**: Browse leagues and tournaments (WSL, WNBA, Tennis Grand Slams, etc.)
- **Teams & Players**: Detailed profiles with statistics and recent moments
- **Gender-First Navigation**: Women's sports prominently featured
- **Modern Design**: Clean, minimalist black & white aesthetic

### Design System
- **Typography**: Inter font family (GT America alternative)
- **Colors**: Monochromatic palette with accent colors for events
- **Icons**: react-icons library with Material Design & Ionicons
- **Components**: shadcn/ui with custom sports components
- **Responsive**: Mobile-first design with smooth animations

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + custom sports components
- **Icons**: react-icons (Material Design, Ionicons, Bootstrap Icons)
- **CRM Integration**: Salesforce (Native REST API with JWT Bearer)
- **Caching**: Redis (Upstash for serverless) - recommended
- **AI**: Anthropic Claude API
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- Salesforce org with custom objects (see [match-moments-salesforce](https://github.com/matchmoments-admin/match-moments-salesforce))
- Salesforce Connected App with JWT Bearer configured
- Redis instance (Upstash recommended) - optional but highly recommended for production
- Anthropic API key

## 🔧 Installation

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/matchmoments-admin/match-moments-web.git
cd match-moments-web
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
# Salesforce OAuth Configuration
SALESFORCE_LOGIN_URL=https://login.salesforce.com
SALESFORCE_CLIENT_ID=your_connected_app_client_id
SALESFORCE_CLIENT_SECRET=your_connected_app_secret
SALESFORCE_REDIRECT_URI=http://localhost:3000/api/oauth2/callback
SALESFORCE_INSTANCE_URL=https://your-instance.salesforce.com

# NextAuth Configuration
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000

# Redis Cache
REDIS_URL=redis://localhost:6379

# Anthropic API
ANTHROPIC_API_KEY=sk-ant-***

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
\`\`\`

**Generate NEXTAUTH_SECRET:**
\`\`\`bash
openssl rand -base64 32
\`\`\`

### 4. Set Up Salesforce

#### Create Connected App
1. Navigate to: **Setup → App Manager → New Connected App**
2. Fill in basic information (name, email, etc.)
3. **Enable OAuth Settings:**
   - Callback URLs:
     - `http://localhost:3000/api/oauth2/callback` (local)
     - `https://your-production-domain.com/api/oauth2/callback` (production)
   - **Selected OAuth Scopes:**
     - `Access and manage your data (api)`
     - `Provide access to your data via the Web (web)`
     - `Perform requests on your behalf at any time (refresh_token, offline_access)`
     - `Access your basic information (id)`
4. **OAuth Policies:**
   - IP Relaxation: "Relax IP restrictions" (for development)
   - Refresh Token Policy: "Refresh token is valid until revoked"
5. Save and copy **Consumer Key** (CLIENT_ID) and **Consumer Secret** (CLIENT_SECRET)

#### OAuth Authentication Flow
The app uses **OAuth2 Web Server Flow** with jsforce:
- Navigate to `/dashboard` → Automatically redirects to Salesforce login
- After authentication → Returns to dashboard with session stored in cookies
- Access tokens stored in secure HTTP-only cookies
- No manual login button needed - seamless OAuth flow

#### Add Dashboard Role Field (Optional)
1. Navigate to: Setup → Object Manager → User → Fields & Relationships
2. Create new Picklist field: `Dashboard_Role__c`
3. Values: `super_admin`, `ceo`, `sales`, `marketing`, `operations`, `customer_success`
4. Assign roles to users

### 5. Set Up Redis Cache (Optional but Recommended)

Redis caching provides **7-10x faster page loads** (500ms → 50ms) and reduces Salesforce API calls by 99%. Free tier available.

#### Why Use Redis?
- ✅ **7-10x faster** page loads
- ✅ **99% fewer** Salesforce API calls  
- ✅ **Better user experience**
- ✅ **Free tier**: 10,000 requests/day (Upstash)
- ✅ **Serverless-compatible** (works on Vercel)

#### Option A: Upstash (Recommended for Production & Vercel)

**Step 1: Create Upstash Account**
1. Sign up at [https://upstash.com](https://upstash.com)
2. Create new Redis database:
   - **Name**: `match-moments-cache`
   - **Type**: `Redis`
   - **Region**: Choose closest to users (e.g., `us-east-1`)
   - **Plan**: `Free` (10,000 requests/day)

**Step 2: Get Credentials**
1. Click on your database
2. Copy **UPSTASH_REDIS_REST_URL**
3. Copy **UPSTASH_REDIS_REST_TOKEN**

**Step 3: Add to Environment Variables**

Add to `.env.local`:
\`\`\`env
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
\`\`\`

Add to **Vercel Dashboard** (for production):
1. Go to: Project Settings → Environment Variables
2. Add `UPSTASH_REDIS_REST_URL` (Production, Preview, Development)
3. Add `UPSTASH_REDIS_REST_TOKEN` (Production, Preview, Development)

**Step 4: Test Redis**
\`\`\`bash
# Start dev server
npm run dev

# Test Redis connection
curl http://localhost:3000/api/test-redis

# Expected response: { success: true, tests: { caching: true } }
\`\`\`

#### Option B: Local Redis (Development Only - NOT for Vercel)
\`\`\`bash
# Install Redis (macOS)
brew install redis
brew services start redis

# Add to .env.local (NOT compatible with Vercel)
UPSTASH_REDIS_REST_URL=redis://localhost:6379
\`\`\`

⚠️ **Note**: Local Redis won't work on Vercel. Use Upstash for production.

#### Verify Cache is Working

**Check Logs:**
\`\`\`bash
# Look for cache indicators in console:
✅ [CACHE HIT] fixtures:today
❌ [CACHE MISS] fixtures:today
💾 [CACHE SET] fixtures:today (TTL: 60s)
\`\`\`

**Monitor Cache:**
\`\`\`bash
# View cache statistics
curl http://localhost:3000/api/cache/stats

# Clear fixture cache (useful after data updates)
curl -X DELETE "http://localhost:3000/api/cache/invalidate?scope=fixtures"
\`\`\`

#### Cache Configuration

The app uses intelligent caching strategies:

- **Live Data** (30 seconds): Live fixtures, live scores
- **Frequent Updates** (5 minutes): Today's fixtures, recent moments
- **Moderate Updates** (30 minutes): Upcoming fixtures, standings
- **Static Data** (1 hour): Team info, player stats, historical data

All cache strategies are defined in `src/lib/cache/strategies.ts`.

#### Without Redis

If you don't configure Redis, the app will still work perfectly - it will just query Salesforce directly on every request. You'll see this warning in logs:

\`\`\`
[CACHE] Redis credentials not configured, caching disabled
\`\`\`

This is fine for development or low-traffic sites, but **highly recommended for production**.

### 6. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

\`\`\`
match-moments-web/
├── src/
│   ├── app/
│   │   ├── (public)/           # Public pages (games, news, etc.)
│   │   ├── (dashboard)/        # Protected dashboard
│   │   ├── api/                # API routes
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Homepage
│   ├── components/
│   │   ├── ui/                 # shadcn components
│   │   ├── layout/             # Navigation, Footer
│   │   ├── games/              # Game components
│   │   ├── dashboard/          # Dashboard components
│   │   └── shared/             # Shared components
│   ├── lib/
│   │   ├── salesforce/         # SF connection & queries
│   │   │   ├── client.ts       # Native REST API client
│   │   │   ├── types.ts        # TypeScript types
│   │   │   └── queries/        # Query functions
│   │   ├── cache/              # Redis caching (optional)
│   │   └── utils/              # Utilities
│   ├── types/                  # TypeScript types
│   └── middleware.ts           # Auth middleware
├── public/                     # Static assets
├── SETUP.md                    # Detailed setup guide
└── README.md                   # This file
\`\`\`

## 🔐 Authentication & Authorization

### User Roles

- **Super Admin**: Full access to everything
- **CEO**: Read access to all dashboards
- **Sales**: Write access to sales and customers
- **Marketing**: Write access to marketing, read access to revenue
- **Operations**: Write access to operations and content
- **Customer Success**: Write access to customers

### Sign In Flow

1. User clicks "Sign In" → redirected to Google OAuth
2. After Google auth, system checks if user email exists in Salesforce
3. If exists, fetch user's `Dashboard_Role__c` from Salesforce
4. Grant access based on role permissions
5. Middleware protects dashboard routes

## 📊 Dashboard Features

### Revenue Dashboard (`/dashboard/revenue`)
- MRR (Monthly Recurring Revenue)
- ARR (Annual Recurring Revenue)
- Women's revenue percentage (target: 60%)
- Revenue by stream (Subscription, Advertising, Sponsorship, etc.)
- Revenue by gender comparison
- Recent transactions table

### Sales Dashboard (`/dashboard/sales`)
- Pipeline funnel visualization
- Opportunities table (filterable by stage, owner, date)
- Monthly forecast chart
- Win rate, average deal size, sales cycle metrics

### Customers Dashboard (`/dashboard/customers`)
- Customer list with health scores
- Churn risk indicators
- Filter by type, status, health score
- Customer detail views

### Operations Dashboard (`/dashboard/operations`)
- API usage tracking (ESPN, Anthropic)
- System health status
- Background job monitoring
- Error logs

## 🎨 Design System

See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for complete design specifications.

### Colors
- **Background**: #FFFFFF (white)
- **Text**: #000000 (black)
- **Muted**: #696969 (gray)
- **Border**: #E5E7EB (light gray)
- **Accent**: Blues, purples (gender-specific)

### Typography
- **Font**: Inter (GT America alternative)
- **H1**: 56px, bold, tight tracking
- **H2**: 24px, medium
- **Body**: 16px, regular, 24px line-height
- **Weights**: 400 (regular), 500 (medium), 700 (bold)

### Icons
- **Library**: react-icons
- **Sports**: Material Design icons (MdSportsSoccer, MdSportsBasketball, etc.)
- **UI**: Ionicons 5 (IoSearchOutline, IoMenuOutline, etc.)
- **Special**: Bootstrap icons (BsFireFlame, BsTrophy)

## 🚢 Deployment

### Deploy to Vercel

1. Connect GitHub repository to Vercel
2. Configure environment variables (production values)
3. Set custom domain: `matchmoments.co`
4. Deploy

### Environment Variables (Production)
- Update all URLs to production domains
- **Use Upstash Redis** (required for Vercel - local Redis won't work)
- Salesforce production org credentials
- Enable error tracking (Sentry recommended)

### Cron Jobs

Configure in `vercel.json`:
- `/api/cron/sync-live` - Every minute (live scores)
- `/api/cron/generate-questions` - Every hour (AI trivia)

## 🧪 Testing

\`\`\`bash
# Run tests
npm test

# Run linter
npm run lint

# Check types
npm run type-check
\`\`\`

### Test Checklist
- [ ] All roles can access permitted pages
- [ ] Role boundaries enforced (403 errors for unauthorized access)
- [ ] Salesforce queries return data correctly
- [ ] Redis caching working (check logs for HIT/MISS)
- [ ] Live scores update automatically
- [ ] Mobile responsive on all pages

## 📚 API Documentation

### Public API Routes

#### Get Today's Fixtures
\`\`\`
GET /api/fixtures/today
Response: { fixtures: Fixture[] }
\`\`\`

#### Get Live Fixtures
\`\`\`
GET /api/fixtures/live
Response: { fixtures: Fixture[] }
\`\`\`

### Protected API Routes (Require Authentication)

#### Get Revenue Metrics
\`\`\`
GET /api/dashboard/revenue/metrics
Headers: { Cookie: session token }
Response: { mrr, arr, womensRevenue, ... }
\`\`\`

#### Get Sales Pipeline
\`\`\`
GET /api/dashboard/sales/pipeline
Headers: { Cookie: session token }
Response: { stages: Stage[] }
\`\`\`

## 🐛 Troubleshooting

### Salesforce OAuth Connection Issues
- **Error: "No authorization code found"**
  - Verify callback URL in Connected App matches exactly: `http://localhost:3000/api/oauth2/callback`
  - Check that both local and production URLs are added
- **Error: "invalid_grant: authentication failure"**
  - Verify IP restrictions are relaxed in Connected App settings
  - Ensure using `login.salesforce.com` (not `test.salesforce.com` for Developer Edition)
  - Check OAuth scopes include: api, web, refresh_token, id
- **Session expires quickly**
  - Access tokens expire after 2 hours by default
  - App will automatically redirect to login when session expires
  - Consider implementing refresh token flow for longer sessions

### Testing OAuth Flow
1. Open http://localhost:3000/dashboard
2. Should auto-redirect to Salesforce login
3. Log in with Salesforce credentials
4. Should redirect back to dashboard
5. Dashboard displays Salesforce accounts

### Redis Connection Issues
- **Redis not configured warning**: Normal if you haven't set up Redis yet - app works without it
- **Test connection**: Visit `http://localhost:3000/api/test-redis`
- **Upstash connection fails**: Verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are correct
- **Check cache stats**: Visit `http://localhost:3000/api/cache/stats`
- **Clear cache**: `curl -X DELETE "http://localhost:3000/api/cache/invalidate?scope=all"`

### Authentication Issues
- Clear browser cookies
- Regenerate `NEXTAUTH_SECRET`
- Check Google OAuth redirect URIs match

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Commit Convention
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style/formatting
- `refactor:` Code refactoring
- `test:` Adding/updating tests

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Salesforce for CRM infrastructure
- Next.js team for the amazing framework
- shadcn/ui for beautiful components
- Anthropic for AI capabilities
- Women's sports athletes for inspiration

---

**Built with ❤️ for Women's Sports**

For design specifications, see [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)
For Salesforce backend, see [match-moments-salesforce](https://github.com/matchmoments-admin/match-moments-salesforce)
