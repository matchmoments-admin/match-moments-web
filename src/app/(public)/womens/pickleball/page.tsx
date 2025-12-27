import { SectionHeader } from '@/components/shared/sections/section-header';
import { BreadcrumbNav } from '@/components/sports/breadcrumb-nav';
import { GenderNav } from '@/components/sports/gender-nav';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Women's Pickleball | Match Moments",
  description: "Complete coverage of women's pickleball",
};

async function getPageData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    
    const [competitionsRes, matchesRes, momentsRes] = await Promise.all([
      fetch(`${baseUrl}/api/sports/competitions?sport=Pickleball&gender=Women's Team&limit=10`, {
        cache: 'no-store',
      }),
      fetch(`${baseUrl}/api/sports/matches?sport=Pickleball&gender=Women's Team&limit=10`, {
        cache: 'no-store',
      }),
      fetch(`${baseUrl}/api/sports/moments/trending?sport=Pickleball&gender=Women's Team&limit=10`, {
        cache: 'no-store',
      }),
    ]);

    const [competitions, matches, moments] = await Promise.all([
      competitionsRes.json(),
      matchesRes.json(),
      momentsRes.json(),
    ]);

    return {
      competitions: competitions.success ? competitions.data : [],
      matches: matches.success ? matches.data : [],
      moments: moments.success ? moments.data : [],
    };
  } catch (error) {
    console.error('Error fetching page data:', error);
    return {
      competitions: [],
      matches: [],
      moments: [],
    };
  }
}

export default async function WomensPickleballPage() {
  const { competitions, matches, moments } = await getPageData();

  return (
    <main className="bg-background">
      <div className="container-main py-8">
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: "Women's Sports", href: '/womens' },
            { label: 'Pickleball', href: '/womens/pickleball', current: true },
          ]}
        />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-600 to-pink-800 p-12 text-white">
            <div className="relative z-10">
              <h1 className="text-5xl font-bold mb-4 flex items-center gap-4">
                <span className="text-6xl">🏓</span>
                Women's Pickleball
              </h1>
              <p className="text-xl opacity-90 mb-6">
                Professional women's pickleball tours and competitions
              </p>
            </div>
          </div>
        </section>

        <section className="py-8 bg-white">
          <div className="container-main">
            <GenderNav currentGender="womens" />
          </div>
        </section>

        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
          <div className="text-6xl mb-4">🏓</div>
          <h3 className="text-2xl font-bold mb-2">Coming Soon!</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Women's pickleball coverage is coming soon to Match Moments.
          </p>
        </div>
      </div>
    </main>
  );
}

