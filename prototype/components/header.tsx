import { Search, Video, Headphones, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const navCategories = [
  "The Latest",
  "NBA",
  "NFL",
  "College Football",
  "MLB",
  "Soccer",
  "Fantasy Sports",
  "TV & Movies",
  "Podcasts",
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600">
              <div className="text-xl font-black text-white">M</div>
            </div>
            <div className="text-xl font-black uppercase tracking-tight">Match Moments</div>
          </div>

          {/* Search Bar */}
          <div className="relative hidden flex-1 max-w-md md:block">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <Input
              type="search"
              placeholder="Discover anything"
              className="w-full rounded-full border-neutral-300 bg-neutral-50 pl-10 pr-4"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden gap-2 lg:flex">
              <Video className="h-5 w-5" />
              <span>Videos</span>
            </Button>
            <Button variant="ghost" size="sm" className="hidden gap-2 lg:flex">
              <Headphones className="h-5 w-5" />
              <span>Podcasts</span>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hide-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 py-3">
            {navCategories.map((category) => (
              <Button
                key={category}
                variant="outline"
                className="shrink-0 rounded-full border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50 bg-transparent"
              >
                {category}
              </Button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}
