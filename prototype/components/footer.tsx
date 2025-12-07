import { Mail, BookOpen } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Footer Actions */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <button className="rounded-2xl border border-neutral-300 bg-white px-6 py-4 text-center font-semibold transition-all hover:border-neutral-900 hover:shadow-lg">
            Contact
          </button>
          <button className="rounded-2xl border border-neutral-300 bg-white px-6 py-4 text-center font-semibold transition-all hover:border-neutral-900 hover:shadow-lg">
            Masthead
          </button>
          <button className="rounded-2xl border border-neutral-300 bg-white px-6 py-4 text-center font-semibold transition-all hover:border-neutral-900 hover:shadow-lg">
            Shop
          </button>
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

          {/* Archive */}
          <div className="rounded-2xl border border-neutral-300 bg-white p-8 text-center">
            <div className="mb-4 flex justify-center">
              <BookOpen className="h-16 w-16" strokeWidth={1.5} />
            </div>
            <h3 className="mb-2 text-2xl font-bold">Archive</h3>
            <p className="text-balance text-lg text-neutral-600">We've been around since Brady was a QB</p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-8">
          <div className="flex flex-wrap gap-6 text-sm">
            <a href="#" className="hover:underline">
              Terms of Use
            </a>
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <a href="#" className="hover:underline">
              Accessibility
            </a>
          </div>

          <div className="text-sm text-neutral-600">© 2025 Match Moments</div>

          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:underline">
              Instagram
            </a>
            <a href="#" className="hover:underline">
              X
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
