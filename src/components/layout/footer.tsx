import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="mx-auto max-w-[1140px] px-2 py-12">
        {/* Newsletter Section */}
        <div className="mb-12 text-center">
          <p className="text-xl font-light mb-2">Modernize Your Life</p>
          <h2 className="text-3xl font-bold mb-2">Get in the Know</h2>
          <p className="text-xl font-light mb-6 max-w-2xl mx-auto">
            You&apos;ll always hear it from Match Moments first. Our passion is discovering and highlighting emerging talent, and we&apos;re energized by and for our community of like-minded sports lovers — like you!
          </p>
          {/* Newsletter form would go here */}
        </div>

        {/* Footer Links */}
        <div className="grid gap-8 md:grid-cols-3 mb-12">
          <div>
            <h4 className="text-2xl font-bold mb-4">About Match Moments</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-xl font-light text-black hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/mission" className="text-xl font-light text-black hover:underline">
                  Our Mission
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-2xl font-bold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/advertise" className="text-xl font-light text-black hover:underline">
                  Advertise
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-xl font-light text-black hover:underline">
                  Editorial Submissions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-xl font-light text-black hover:underline">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-2xl font-bold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-xl font-light text-black hover:underline">
                Instagram
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-xl font-light text-black hover:underline">
                X
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-black/10 pt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-base font-light text-black">
            Photo copyright retained by photo owners, everything else © 2025 Match Moments®.
          </p>
          <div className="flex gap-4 text-base font-light">
            <Link href="/privacy" className="text-black hover:underline">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link href="/terms" className="text-black hover:underline">
              Terms of Use
            </Link>
            <span>|</span>
            <Link href="/cookies" className="text-black hover:underline">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

