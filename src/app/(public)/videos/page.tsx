import { SectionHeader } from '@/components/shared/sections/section-header';
import { BreadcrumbNav } from '@/components/sports/breadcrumb-nav';

export const metadata = {
  title: "Sports Videos | Match Moments",
  description: "Watch the best sports videos, highlights, and exclusive content",
};

export default function VideosPage() {
  return (
    <main className="bg-background">
      <div className="container-main py-8">
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: 'Videos', href: '/videos', current: true },
          ]}
        />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 to-red-800 p-12 text-white">
            <div className="relative z-10">
              <h1 className="text-5xl font-bold mb-4 flex items-center gap-4">
                <span className="text-6xl">📹</span>
                Sports Videos
              </h1>
              <p className="text-xl opacity-90 mb-6">
                Watch highlights, analysis, and exclusive sports video content
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <SectionHeader
            title="Featured Videos"
            description="Top sports highlights and exclusive content"
          />
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
            <div className="text-6xl mb-4">▶️</div>
            <h3 className="text-2xl font-bold mb-2">Coming Soon!</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We're curating the best sports video content for you. 
              Check back soon for match highlights, player profiles, and exclusive behind-the-scenes footage.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-gray-200">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-xl font-bold mb-2">Highlights</h3>
              <p className="text-gray-600 text-sm">
                Match highlights, goals, and key moments from recent games
              </p>
            </div>
            <div className="p-6 bg-white rounded-3xl border border-gray-200">
              <div className="text-4xl mb-3">🎬</div>
              <h3 className="text-xl font-bold mb-2">Documentaries</h3>
              <p className="text-gray-600 text-sm">
                In-depth stories about athletes, teams, and historic moments
              </p>
            </div>
            <div className="p-6 bg-white rounded-3xl border border-gray-200">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-bold mb-2">Skills & Training</h3>
              <p className="text-gray-600 text-sm">
                Training videos, skill tutorials, and technique breakdowns
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <SectionHeader
            title="Browse by Sport"
            description="Find videos for your favorite sports"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Soccer', 'Basketball', 'Cricket', 'Tennis', 'Rugby', 'NFL'].map((sport) => (
              <div key={sport} className="p-4 bg-white rounded-2xl border border-gray-200 text-center hover:border-black transition-colors cursor-pointer">
                <h4 className="font-bold">{sport}</h4>
                <p className="text-xs text-gray-500 mt-1">Coming soon</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="bg-secondary p-8 rounded-3xl text-center">
            <h3 className="text-2xl font-bold mb-3">Submit your content</h3>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Have great sports video content? We're looking for creators to feature on our platform. 
              Share your highlights, analysis, or documentaries with our community.
            </p>
            <button className="btn-primary">
              Submit Video
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

