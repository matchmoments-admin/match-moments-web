import { BreadcrumbNav } from '@/components/sports/breadcrumb-nav';

export const metadata = {
  title: "Contact Us | Match Moments",
  description: "Get in touch with Match Moments - Your 24/7 sports companion",
};

export default function ContactPage() {
  return (
    <main className="bg-background">
      <div className="container-main py-8">
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: 'Contact', href: '/contact', current: true },
          ]}
        />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 p-12 text-white">
            <div className="relative z-10">
              <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
              <p className="text-xl opacity-90">
                Get in touch with the Match Moments team
              </p>
            </div>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Send us a message</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-black focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-black focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-black focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="What's this about?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-black focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Tell us more..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full btn-primary py-4 text-lg"
              >
                Send Message
              </button>
            </form>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-3xl border border-gray-200">
                <div className="text-4xl mb-3">📧</div>
                <h3 className="text-xl font-bold mb-2">Email</h3>
                <p className="text-gray-600">
                  For general inquiries and support
                </p>
                <a href="mailto:contact@matchmoments.com" className="text-primary hover:underline mt-2 block">
                  contact@matchmoments.com
                </a>
              </div>

              <div className="p-6 bg-white rounded-3xl border border-gray-200">
                <div className="text-4xl mb-3">💼</div>
                <h3 className="text-xl font-bold mb-2">Business Inquiries</h3>
                <p className="text-gray-600">
                  Partnerships and collaboration opportunities
                </p>
                <a href="mailto:business@matchmoments.com" className="text-primary hover:underline mt-2 block">
                  business@matchmoments.com
                </a>
              </div>

              <div className="p-6 bg-white rounded-3xl border border-gray-200">
                <div className="text-4xl mb-3">📰</div>
                <h3 className="text-xl font-bold mb-2">Press & Media</h3>
                <p className="text-gray-600">
                  Media inquiries and press releases
                </p>
                <a href="mailto:press@matchmoments.com" className="text-primary hover:underline mt-2 block">
                  press@matchmoments.com
                </a>
              </div>

              <div className="p-6 bg-white rounded-3xl border border-gray-200">
                <div className="text-4xl mb-3">🐛</div>
                <h3 className="text-xl font-bold mb-2">Report an Issue</h3>
                <p className="text-gray-600">
                  Found a bug or technical problem?
                </p>
                <a href="mailto:support@matchmoments.com" className="text-primary hover:underline mt-2 block">
                  support@matchmoments.com
                </a>
              </div>
            </div>

            <div className="mt-8 p-6 bg-secondary rounded-3xl">
              <h3 className="text-xl font-bold mb-3">Follow Us</h3>
              <p className="text-gray-600 mb-4">
                Stay updated with the latest sports news and moments
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors">
                  <span className="text-xl">𝕏</span>
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors">
                  <span className="text-xl">📘</span>
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors">
                  <span className="text-xl">📷</span>
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors">
                  <span className="text-xl">▶️</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

