import { SportGrid } from '@/components/sports/sport-grid';
import { SectionHeader } from '@/components/shared/sections/section-header';
import { GenderNav } from '@/components/sports/gender-nav';

export const metadata = {
  title: "All Sports | Match Moments",
  description: "Browse all sports covered on Match Moments - Soccer, Basketball, Cricket, Tennis & more",
};

export default function SportsHubPage() {
  return (
    <main className="bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black to-gray-900 text-white py-16">
        <div className="container-main">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4">All Sports</h1>
            <p className="text-xl opacity-90 mb-8">
              Comprehensive coverage of major sports from around the world
            </p>
            
            {/* Quick Stats */}
            <div className="flex justify-center gap-12 mt-12">
              <div>
                <div className="text-4xl font-bold">9</div>
                <div className="text-sm opacity-75">Sports</div>
              </div>
              <div>
                <div className="text-4xl font-bold">50+</div>
                <div className="text-sm opacity-75">Competitions</div>
              </div>
              <div>
                <div className="text-4xl font-bold">800+</div>
                <div className="text-sm opacity-75">Teams</div>
              </div>
              <div>
                <div className="text-4xl font-bold">25K+</div>
                <div className="text-sm opacity-75">Moments</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gender Navigation */}
      <section className="py-12 bg-white">
        <div className="container-main">
          <SectionHeader
            title="Browse by Gender"
            description="Choose between women's and men's sports coverage"
          />
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {/* Women's Sports Card */}
            <a href="/womens" className="group">
              <div className="relative overflow-hidden rounded-3xl bg-black p-12 text-white transition-transform hover:scale-[1.02]">
                <div className="relative z-10">
                  <span className="inline-block rounded bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide">
                    60% of our coverage
                  </span>
                  <h2 className="mt-4 text-5xl font-bold text-white">
                    Women's Sports
                  </h2>
                  <p className="mt-4 text-lg opacity-90">
                    Soccer, Basketball, Cricket, Tennis & more
                  </p>
                  <div className="mt-6 flex gap-8">
                    <div>
                      <div className="text-3xl font-bold">25+</div>
                      <div className="text-sm opacity-75">Competitions</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">300+</div>
                      <div className="text-sm opacity-75">Teams</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">10K+</div>
                      <div className="text-sm opacity-75">Moments</div>
                    </div>
                  </div>
                </div>
              </div>
            </a>

            {/* Men's Sports Card */}
            <a href="/mens" className="group">
              <div className="relative overflow-hidden rounded-3xl bg-gray-100 p-12 text-black transition-transform hover:scale-[1.02]">
                <div className="relative z-10">
                  <span className="inline-block rounded bg-black/10 px-3 py-1 text-xs font-bold uppercase tracking-wide">
                    Comprehensive coverage
                  </span>
                  <h2 className="mt-4 text-5xl font-bold text-black">
                    Men's Sports
                  </h2>
                  <p className="mt-4 text-lg opacity-75">
                    Soccer, Basketball, Cricket, NFL & more
                  </p>
                  <div className="mt-6 flex gap-8">
                    <div>
                      <div className="text-3xl font-bold">30+</div>
                      <div className="text-sm opacity-60">Competitions</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">500+</div>
                      <div className="text-sm opacity-60">Teams</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">15K+</div>
                      <div className="text-sm opacity-60">Moments</div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* All Sports Grid */}
      <section className="py-16 bg-secondary">
        <div className="container-main">
          <SectionHeader
            title="Browse All Sports"
            description="Explore content from the world's most popular sports"
          />
          <SportGrid showGenderLinks className="mt-8" />
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-16 bg-white">
        <div className="container-main">
          <SectionHeader
            title="Quick Access"
            description="Jump directly to popular content"
          />
          <div className="grid md:grid-cols-4 gap-6 mt-8">
            <a href="/games" className="p-6 bg-secondary rounded-3xl hover:bg-gray-200 transition-colors">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-xl font-bold mb-2">Games</h3>
              <p className="text-gray-600 text-sm">Live scores & fixtures</p>
            </a>
            <a href="/moments" className="p-6 bg-secondary rounded-3xl hover:bg-gray-200 transition-colors">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-xl font-bold mb-2">Moments</h3>
              <p className="text-gray-600 text-sm">Trending highlights</p>
            </a>
            <a href="/articles" className="p-6 bg-secondary rounded-3xl hover:bg-gray-200 transition-colors">
              <div className="text-4xl mb-3">📰</div>
              <h3 className="text-xl font-bold mb-2">Articles</h3>
              <p className="text-gray-600 text-sm">Latest sports news</p>
            </a>
            <a href="/podcasts" className="p-6 bg-secondary rounded-3xl hover:bg-gray-200 transition-colors">
              <div className="text-4xl mb-3">🎙️</div>
              <h3 className="text-xl font-bold mb-2">Podcasts</h3>
              <p className="text-gray-600 text-sm">Sports audio content</p>
            </a>
          </div>
        </div>
      </section>

      {/* Featured Sports Highlight */}
      <section className="py-16 bg-secondary">
        <div className="container-main">
          <div className="relative overflow-hidden rounded-3xl bg-primary p-12 text-primary-foreground">
            <div className="relative z-10">
              <span className="inline-block rounded bg-primary-foreground/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">
                Featured
              </span>
              <h2 className="mt-4 text-4xl font-bold text-primary-foreground">
                Women's Soccer World Cup
              </h2>
              <p className="mt-4 text-lg opacity-90 text-primary-foreground">
                Follow all the action from the world's biggest women's soccer tournament. 
                Match highlights, player profiles, and exclusive behind-the-scenes content.
              </p>
              <a
                href="/womens/soccer"
                className="mt-6 inline-block rounded-full bg-primary-foreground px-6 py-3 text-base font-medium text-primary transition-opacity hover:opacity-90"
              >
                View Coverage
              </a>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/2 opacity-10">
              <div className="h-full w-full bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px]"></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

