import Link from 'next/link';
import { Mail, BookOpen, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Footer Actions */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <Link
            href="/contact"
            className="rounded-2xl border border-neutral-300 bg-white px-6 py-4 text-center font-semibold transition-all hover:border-neutral-900 hover:shadow-lg"
          >
            Contact
          </Link>
          <Link
            href="/about"
            className="rounded-2xl border border-neutral-300 bg-white px-6 py-4 text-center font-semibold transition-all hover:border-neutral-900 hover:shadow-lg"
          >
            About
          </Link>
          <Link
            href="/dashboard"
            className="rounded-2xl border border-neutral-300 bg-white px-6 py-4 text-center font-semibold transition-all hover:border-neutral-900 hover:shadow-lg"
          >
            Dashboard
          </Link>
        </div>

        {/* Newsletter & Archive */}
        <div className="mb-12 grid gap-6 lg:grid-cols-2">
          {/* Newsletter */}
          <div className="rounded-2xl bg-green-600 p-8 text-center text-white">
            <div className="mb-4 flex justify-center">
              <Mail className="h-16 w-16" strokeWidth={1.5} />
            </div>
            <h3 className="mb-2 text-2xl font-bold">Match Moments Newsletter</h3>
            <p className="text-balance text-lg">Just the hits, straight to your inbox every week</p>
          </div>

          {/* Women's Sports */}
          <div className="rounded-2xl border border-neutral-300 bg-white p-8 text-center">
            <div className="mb-4 flex justify-center">
              <Heart className="h-16 w-16 fill-red-500 text-red-500" strokeWidth={1.5} />
            </div>
            <h3 className="mb-2 text-2xl font-bold">Women&apos;s Sports</h3>
            <p className="text-balance text-lg text-neutral-600">
              60% of our coverage dedicated to women&apos;s sports
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-8">
          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="/terms" className="hover:underline">
              Terms of Use
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/accessibility" className="hover:underline">
              Accessibility
            </Link>
          </div>

          <div className="text-sm text-neutral-600">© 2025 Match Moments</div>

          <div className="flex gap-4 text-sm">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Instagram
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
              X
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

