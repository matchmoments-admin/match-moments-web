# Match Moments Web Platform

A comprehensive sports data platform built with Next.js 14, featuring live scores, AI-powered trivia, match statistics, and admin dashboard with role-based access control. Integrated with Salesforce CRM for data management.

## 🌟 Features

### Public Features
- **Live Scores**: Real-time match updates across multiple sports
- **Match Statistics**: Comprehensive stats, standings, and player performance data
- **AI-Powered Trivia**: Test knowledge with questions generated from real match data
- **Women's Sports Focus**: 60% of coverage dedicated to women's sports

### Admin Dashboard
- **Role-Based Access Control**: Super Admin, CEO, Sales, Marketing, Operations, Customer Success
- **Revenue Tracking**: MRR, ARR, revenue by stream and gender
- **Sales Pipeline**: Opportunity management, forecasting, win rates
- **Customer Management**: Health scores, churn risk tracking
- **Operations Monitoring**: API usage, system health, background jobs

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: NextAuth.js with Google OAuth
- **CRM Integration**: Salesforce (jsforce)
- **Caching**: Redis (ioredis)
- **AI**: Anthropic Claude API
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- Salesforce org with custom objects (see [match-moments-salesforce](https://github.com/matchmoments-admin/match-moments-salesforce))
- Redis instance (local or Upstash)
- Google OAuth credentials
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
# Salesforce Configuration
SALESFORCE_LOGIN_URL=https://login.salesforce.com
SALESFORCE_CLIENT_ID=your_connected_app_client_id
SALESFORCE_CLIENT_SECRET=your_connected_app_secret
SALESFORCE_REDIRECT_URI=http://localhost:3000/api/auth/salesforce/callback
SALESFORCE_INSTANCE_URL=https://your-instance.salesforce.com
SALESFORCE_ACCESS_TOKEN=your_access_token
SALESFORCE_REFRESH_TOKEN=your_refresh_token

# NextAuth Configuration
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000

# Redis Cache
REDIS_URL=redis://localhost:6379

# Anthropic API
ANTHROPIC_API_KEY=sk-ant-***

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
\`\`\`

### 4. Set Up Salesforce

#### Create Connected App
1. Navigate to: Setup → App Manager → New Connected App
2. Enable OAuth Settings
3. Callback URL: `http://localhost:3000/api/auth/salesforce/callback`
4. Selected OAuth Scopes: `api`, `refresh_token`, `offline_access`
5. Save and copy Consumer Key (CLIENT_ID) and Consumer Secret (CLIENT_SECRET)

#### Add Dashboard Role Field
1. Navigate to: Setup → Object Manager → User → Fields & Relationships
2. Create new Picklist field: `Dashboard_Role__c`
3. Values: `super_admin`, `ceo`, `sales`, `marketing`, `operations`, `customer_success`
4. Assign roles to users

### 5. Set Up Redis

**Option A: Local Redis (macOS)**
\`\`\`bash
brew install redis
brew services start redis
\`\`\`

**Option B: Upstash (Recommended for production)**
1. Sign up at https://upstash.com
2. Create new Redis database
3. Copy Redis URL

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
│   │   ├── auth/               # RBAC & permissions
│   │   ├── cache/              # Redis caching
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

### Colors
- Primary: `#1a1a1a` (dark)
- Accent: `#0066cc` (blue)
- Live indicator: `#ff0000` (red with pulse animation)
- Success: `#00c853`
- Warning: `#ffa000`
- Error: `#d32f2f`

### Typography
- Font: System fonts (Geist Sans, Geist Mono)
- Scale: 12px to 48px
- Weights: 400, 500, 600, 700, 900

## 🚢 Deployment

### Deploy to Vercel

1. Connect GitHub repository to Vercel
2. Configure environment variables (production values)
3. Set custom domain: `matchmoments.co`
4. Deploy

### Environment Variables (Production)
- Update all URLs to production domains
- Use Upstash Redis
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

### Salesforce Connection Issues
- Verify Connected App credentials
- Check OAuth tokens are valid
- Ensure user email matches between Google and Salesforce

### Redis Connection Issues
- Verify Redis is running: `redis-cli ping`
- Check `REDIS_URL` format

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

For detailed setup instructions, see [SETUP.md](SETUP.md)
For Salesforce backend, see [match-moments-salesforce](https://github.com/matchmoments-admin/match-moments-salesforce)
