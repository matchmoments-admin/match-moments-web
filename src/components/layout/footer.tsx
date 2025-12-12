import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border">
      <div className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4">The Match Moments Newsletter</h3>
            <p className="text-metadata mb-4">
              Just the hits, straight to your inbox every week
            </p>
            {/* Newsletter form would go here */}
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 border border-border rounded text-base font-normal focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button className="btn-primary">
                Submit
              </button>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="link-standard">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/masthead" className="link-standard">
                  Masthead
                </Link>
              </li>
              <li>
                <Link href="/about" className="link-standard">
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
                className="link-standard"
              >
                Instagram
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="link-standard"
              >
                X
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © 2025 Match Moments
        </div>
      </div>
    </footer>
  );
}

