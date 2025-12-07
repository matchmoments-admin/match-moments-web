import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { LatestStories } from "@/components/latest-stories"
import { ContentFeed } from "@/components/content-feed"
import { LiveScores } from "@/components/live-scores"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <LatestStories />
          <LiveScores />
          <ContentFeed />
        </div>
      </main>
      <Footer />
    </div>
  )
}
