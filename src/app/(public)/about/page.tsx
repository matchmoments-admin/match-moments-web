import { BreadcrumbNav } from '@/components/sports/breadcrumb-nav';

export const metadata = {
  title: "About Us | Match Moments",
  description: "Learn about Match Moments - Your 24/7 sports companion focusing on women's sports",
};

export default function AboutPage() {
  return (
    <main className="bg-background">
      <div className="container-main py-8">
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about', current: true },
          ]}
        />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800 p-12 text-white">
            <div className="relative z-10">
              <h1 className="text-5xl font-bold mb-4">About Match Moments</h1>
              <p className="text-xl opacity-90">
                Your 24/7 sports companion focusing on women's sports
              </p>
            </div>
          </div>
        </section>

        <div className="space-y-12">
          {/* Mission */}
          <section className="bg-white p-8 rounded-3xl border border-gray-200">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Match Moments is dedicated to providing comprehensive sports coverage with a special focus on women&apos;s athletics. 
              We believe in equal representation and visibility for women&apos;s sports, dedicating 60% of our coverage to women&apos;s 
              competitions, athletes, and moments.
            </p>
          </section>

          {/* What We Do */}
          <section>
            <h2 className="text-3xl font-bold mb-6">What We Do</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-3xl border border-gray-200">
                <div className="text-4xl mb-3">🏆</div>
                <h3 className="text-xl font-bold mb-2">Live Coverage</h3>
                <p className="text-gray-600">
                  Real-time scores, updates, and commentary for matches across multiple sports
                </p>
              </div>
              
              <div className="p-6 bg-white rounded-3xl border border-gray-200">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="text-xl font-bold mb-2">Viral Moments</h3>
                <p className="text-gray-600">
                  Capturing and sharing the most exciting plays, goals, and highlights
                </p>
              </div>
              
              <div className="p-6 bg-white rounded-3xl border border-gray-200">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="text-xl font-bold mb-2">Statistics & Analysis</h3>
                <p className="text-gray-600">
                  Comprehensive stats, standings, and in-depth analysis of competitions
                </p>
              </div>
            </div>
          </section>

          {/* Our Focus */}
          <section className="bg-black text-white p-8 rounded-3xl">
            <h2 className="text-3xl font-bold mb-6">Our Focus on Women&apos;s Sports</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold mb-2">60%</div>
                <p className="opacity-90">of our coverage dedicated to women&apos;s sports</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">25+</div>
                <p className="opacity-90">women&apos;s competitions tracked</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">300+</div>
                <p className="opacity-90">women&apos;s teams featured</p>
              </div>
            </div>
          </section>

          {/* Sports We Cover */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Sports We Cover</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Soccer', 'Basketball', 'Cricket', 'Tennis', 'Rugby', 'American Football', 'Padel', 'Pickleball'].map((sport) => (
                <div key={sport} className="p-4 bg-white rounded-2xl border border-gray-200 text-center">
                  <p className="font-bold">{sport}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Our Values */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-3xl border border-gray-200">
                <h3 className="text-xl font-bold mb-3">🌟 Equality</h3>
                <p className="text-gray-700">
                  We believe in equal coverage and representation for all athletes, regardless of gender
                </p>
              </div>
              
              <div className="p-6 bg-white rounded-3xl border border-gray-200">
                <h3 className="text-xl font-bold mb-3">⚡ Speed</h3>
                <p className="text-gray-700">
                  Real-time updates and instant highlights so you never miss a moment
                </p>
              </div>
              
              <div className="p-6 bg-white rounded-3xl border border-gray-200">
                <h3 className="text-xl font-bold mb-3">🎯 Accuracy</h3>
                <p className="text-gray-700">
                  Reliable data and verified information from official sources
                </p>
              </div>
              
              <div className="p-6 bg-white rounded-3xl border border-gray-200">
                <h3 className="text-xl font-bold mb-3">🌍 Global</h3>
                <p className="text-gray-700">
                  Coverage of sports and competitions from around the world
                </p>
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="bg-secondary p-8 rounded-3xl text-center">
            <h2 className="text-3xl font-bold mb-4">Get Involved</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Want to partner with us, contribute content, or share feedback? We&apos;d love to hear from you.
            </p>
            <a href="/contact" className="btn-primary inline-block">
              Contact Us
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}

