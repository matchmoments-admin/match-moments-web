import { SectionHeader } from '@/components/shared/sections/section-header';
import { BreadcrumbNav } from '@/components/sports/breadcrumb-nav';

export const metadata = {
  title: "Sports Podcasts | Match Moments",
  description: "Listen to the best sports podcasts featuring insights, analysis, and interviews",
};

export default function PodcastsPage() {
  return (
    <main className="bg-background">
      <div className="container-main py-8">
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: 'Podcasts', href: '/podcasts', current: true },
          ]}
        />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800 p-12 text-white">
            <div className="relative z-10">
              <h1 className="text-5xl font-bold mb-4 flex items-center gap-4">
                <span className="text-6xl">🎙️</span>
                Sports Podcasts
              </h1>
              <p className="text-xl opacity-90 mb-6">
                Insights, analysis, and conversations from the world of sports
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <SectionHeader
            title="Featured Podcasts"
            description="Top sports podcasts and shows"
          />
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
            <div className="text-6xl mb-4">🎧</div>
            <h3 className="text-2xl font-bold mb-2">Coming Soon!</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We're working on bringing you the best sports podcasts and audio content. 
              Check back soon for exclusive interviews, match analysis, and behind-the-scenes stories.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-gray-200">
              <div className="text-4xl mb-3">🎤</div>
              <h3 className="text-xl font-bold mb-2">Interviews</h3>
              <p className="text-gray-600 text-sm">
                In-depth conversations with athletes, coaches, and sports personalities
              </p>
            </div>
            <div className="p-6 bg-white rounded-3xl border border-gray-200">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-xl font-bold mb-2">Analysis</h3>
              <p className="text-gray-600 text-sm">
                Expert breakdowns of tactics, strategies, and match performances
              </p>
            </div>
            <div className="p-6 bg-white rounded-3xl border border-gray-200">
              <div className="text-4xl mb-3">🗣️</div>
              <h3 className="text-xl font-bold mb-2">Commentary</h3>
              <p className="text-gray-600 text-sm">
                Live match commentary and post-game discussions
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="bg-secondary p-8 rounded-3xl text-center">
            <h3 className="text-2xl font-bold mb-3">Want to feature your podcast?</h3>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              We're building a platform for sports content creators. Get in touch to learn more about featuring your podcast on Match Moments.
            </p>
            <button className="btn-primary">
              Get in Touch
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

