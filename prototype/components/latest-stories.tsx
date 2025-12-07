import { ArticleCard } from "@/components/article-card"
import { ChevronRight } from "lucide-react"

const stories = [
  {
    id: 1,
    title: "Six Instant Reactions to the 2026 World Cup Draw",
    author: "Match Moments Staff",
    date: "Dec. 5",
    readTime: "8 min read",
    image: "/world-cup-soccer-celebration-collage.jpg",
  },
  {
    id: 2,
    title: "What's Smoke and What's Fire in the Latest NBA Trade Drama",
    author: "Danny Chau",
    date: "Dec. 4",
    readTime: "6 min read",
    image: "/nba-basketball-player-dramatic-action.jpg",
  },
  {
    id: 3,
    title: "The Best NFL Bets for Week 14",
    author: "Anthony Dabbundo",
    date: "Dec. 4",
    readTime: "15 min read",
    image: "/nfl-football-quarterbacks-collage.jpg",
  },
  {
    id: 4,
    title: "Get Ready for the 2026 Quarterback Carousel",
    author: "Diante Lee",
    date: "Dec. 4",
    readTime: "30 min read",
    image: "/nfl-coach-and-quarterback-dramatic.jpg",
  },
]

export function LatestStories() {
  return (
    <section className="py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold">Latest Stories</h2>
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stories.map((story) => (
          <ArticleCard key={story.id} {...story} />
        ))}
      </div>
    </section>
  )
}
