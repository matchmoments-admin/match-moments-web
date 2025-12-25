import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

export const metadata = {
  title: 'Trending Match Moments | Match Moments',
  description: 'Discover viral highlights, goals, saves, and plays from women\'s and men\'s sports',
};

async function getMoments(sport?: string, gender?: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    let url = `${baseUrl}/api/sports/moments/trending?limit=50`;
    
    if (sport) url += `&sport=${sport}`;
    if (gender) url += `&gender=${gender}`;
    
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      return [];
    }

    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error fetching moments:', error);
    return [];
  }
}

export default async function MomentsPage({
  searchParams,
}: {
  searchParams?: { sport?: string; gender?: string };
}) {
  const moments = await getMoments(searchParams?.sport, searchParams?.gender);

  return (
    <main className="bg-background">
      <div className="container-main py-8">
        {/* Page Header */}
        <section className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Trending Match Moments</h1>
          <p className="text-xl text-gray-600">
            Discover viral highlights, goals, saves, and incredible plays from around the world
          </p>
        </section>

        {/* Filter Section */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-4">
            <Link
              href="/moments"
              className={`px-4 py-2 rounded-full transition-colors ${
                !searchParams?.sport && !searchParams?.gender
                  ? 'bg-black text-white'
                  : 'bg-white border border-gray-200 hover:border-black'
              }`}
            >
              All Sports
            </Link>
            <Link
              href="/moments?sport=Soccer&gender=Women's Team"
              className={`px-4 py-2 rounded-full transition-colors ${
                searchParams?.sport === 'Soccer' && searchParams?.gender === "Women's Team"
                  ? 'bg-black text-white'
                  : 'bg-white border border-gray-200 hover:border-black'
              }`}
            >
              Women's Soccer
            </Link>
            <Link
              href="/moments?sport=Soccer&gender=Men's Team"
              className={`px-4 py-2 rounded-full transition-colors ${
                searchParams?.sport === 'Soccer' && searchParams?.gender === "Men's Team"
                  ? 'bg-black text-white'
                  : 'bg-white border border-gray-200 hover:border-black'
              }`}
            >
              Men's Soccer
            </Link>
            <Link
              href="/moments?sport=Basketball&gender=Women's Team"
              className={`px-4 py-2 rounded-full transition-colors ${
                searchParams?.sport === 'Basketball' && searchParams?.gender === "Women's Team"
                  ? 'bg-black text-white'
                  : 'bg-white border border-gray-200 hover:border-black'
              }`}
            >
              Women's Basketball
            </Link>
          </div>
        </section>

        {/* Moments Grid */}
        {moments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moments.map((moment: any) => (
              <div
                key={moment.Id}
                className="group rounded-3xl bg-white border border-gray-200 overflow-hidden hover:border-black transition-colors"
              >
                {/* Moment Header */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-sm font-medium">
                      {moment.Event_Type__c}
                    </span>
                    {moment.Viral_Score__c && moment.Viral_Score__c >= 50 && (
                      <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">
                        🔥 {moment.Viral_Score__c}
                      </span>
                    )}
                    {moment.Event_Minute__c && (
                      <span className="text-sm text-gray-600">{moment.Event_Minute__c}'</span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-2 group-hover:underline">
                    {moment.Social_Share_Title__c || moment.Description__c}
                  </h3>

                  {/* Player Info */}
                  {moment.Primary_Player__r && (
                    <Link
                      href={`/womens/soccer/players/${moment.Primary_Player__r.Id}`}
                      className="flex items-center gap-3 mb-4 hover:underline"
                    >
                      {moment.Primary_Player__r.Profile_Image_URL__c && (
                        <Image
                          src={moment.Primary_Player__r.Profile_Image_URL__c}
                          alt={moment.Primary_Player__r.Name || ''}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      )}
                      <span className="font-medium">{moment.Primary_Player__r.Name}</span>
                    </Link>
                  )}

                  {/* Match Info */}
                  {moment.Match__r && (
                    <Link
                      href={`/womens/soccer/fixtures/${moment.Match__r.Id}`}
                      className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>{moment.Match__r.Home_Team__r?.Name}</span>
                        <span className="font-bold">{moment.Match__r.Home_Team__r?.Abbreviation__c}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>{moment.Match__r.Away_Team__r?.Name}</span>
                        <span className="font-bold">{moment.Match__r.Away_Team__r?.Abbreviation__c}</span>
                      </div>
                      {moment.Match__r.Competition__r && (
                        <div className="text-xs text-gray-500 mt-2">
                          {moment.Match__r.Competition__r.Name}
                        </div>
                      )}
                    </Link>
                  )}

                  {/* Engagement Stats */}
                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                    {moment.View_Count__c && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {moment.View_Count__c.toLocaleString()}
                      </span>
                    )}
                    {moment.Share_Count__c && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        {moment.Share_Count__c.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-3xl bg-white border border-gray-200">
            <p className="text-gray-500">No moments available yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}

