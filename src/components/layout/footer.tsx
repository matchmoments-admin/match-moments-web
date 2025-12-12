import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-[#E5E7EB]">
      <div className="max-w-[1920px] mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4">The Match Moments Newsletter</h3>
            <p className="text-base font-normal text-[#696969] mb-4">
              Just the hits, straight to your inbox every week
            </p>
            {/* Newsletter form would go here */}
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 border border-[#E5E7EB] rounded text-base font-normal focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button className="px-6 py-2 bg-black text-white text-base font-normal hover:opacity-90 transition-opacity">
                Submit
              </button>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-base font-normal text-black hover:underline transition-all duration-150">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/masthead" className="text-base font-normal text-black hover:underline transition-all duration-150">
                  Masthead
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-base font-normal text-black hover:underline transition-all duration-150">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-normal text-black hover:underline transition-all duration-150"
              >
                Instagram
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-normal text-black hover:underline transition-all duration-150"
              >
                X
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-[#E5E7EB] text-center text-sm text-[#696969]">
          © 2025 Match Moments
        </div>
      </div>
    </footer>
  );
}

