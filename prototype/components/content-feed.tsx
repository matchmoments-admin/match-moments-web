import { Play } from "lucide-react"

const contentItems = [
  {
    id: 1,
    type: "podcast",
    category: "Fantasy Football",
    title:
      "Week 14 Start-Sit Dilemmas, Caleb's Big Test, Josh vs. Burrow, Chiefs Against the Wall, and Spotify Wrapped",
    show: "The Match Moments Sports Show",
    date: "Dec. 5",
    duration: "1 hr 38 min",
    image: "/sports-podcast-hosts-collage.jpg",
  },
  {
    id: 2,
    type: "podcast",
    category: "Sports",
    title: "An NBA Six-Pack, Netflix's WBD Pursuit, NFL Picks, and Championship Analysis",
    show: "The Weekly Sports Podcast",
    date: "Dec. 5",
    duration: "3 hr 25 min",
    image: "/sports-commentators-discussion.jpg",
  },
]

export function ContentFeed() {
  return (
    <section className="py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold">
          More on <span className="text-neutral-400">Sports</span>
        </h2>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex gap-2">
          <button className="rounded-full bg-black px-6 py-2 text-sm font-semibold text-white">All</button>
          <button className="rounded-full border border-neutral-300 px-6 py-2 text-sm font-semibold hover:border-neutral-900 hover:bg-neutral-50">
            Articles
          </button>
          <button className="rounded-full border border-neutral-300 px-6 py-2 text-sm font-semibold hover:border-neutral-900 hover:bg-neutral-50">
            Podcasts
          </button>
          <button className="rounded-full border border-neutral-300 px-6 py-2 text-sm font-semibold hover:border-neutral-900 hover:bg-neutral-50">
            Videos
          </button>
        </div>
        <button className="flex items-center gap-2 rounded-full border border-neutral-300 px-6 py-2 text-sm font-semibold hover:border-neutral-900 hover:bg-neutral-50">
          <span>Filter</span>
          <span>-o-</span>
        </button>
      </div>

      {/* Content List */}
      <div className="space-y-6">
        {contentItems.map((item) => (
          <article
            key={item.id}
            className="group flex cursor-pointer gap-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:shadow-lg"
          >
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.title}
              className="h-32 w-32 shrink-0 rounded-lg object-cover"
            />
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <div className="mb-2 inline-block rounded-full bg-neutral-200 px-3 py-1 text-xs font-semibold">
                  {item.category}
                </div>
                <h3 className="mb-2 text-balance text-xl font-bold leading-snug group-hover:underline">{item.title}</h3>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Play className="h-4 w-4 fill-current" />
                  <span>{item.show}</span>
                  <span>•</span>
                  <span>{item.date}</span>
                  <span>•</span>
                  <span>{item.duration}</span>
                </div>
              </div>
            </div>
            <button className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-black transition-transform hover:scale-105">
              <Play className="h-8 w-8 fill-white text-white" />
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
