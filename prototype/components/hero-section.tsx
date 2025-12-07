export function HeroSection() {
  return (
    <section className="relative mx-auto max-w-screen-2xl overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      {/* Category Badge */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-full bg-black px-8 py-3 text-2xl font-bold text-white">Sports</div>
      </div>

      {/* Hero Article */}
      <article className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-400 to-green-600">
        <img
          src="/dramatic-sports-action-celebration.jpg"
          alt="Hero article"
          className="h-[500px] w-full object-cover mix-blend-overlay opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h2 className="mb-4 text-balance text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Week 14 Championship Moments and Big Game Analysis
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <span className="text-xs font-bold">MM</span>
            </div>
            <span>By Match Moments Staff</span>
            <span>•</span>
            <span>Dec. 7</span>
            <span>•</span>
            <span>8 min read</span>
          </div>
        </div>
      </article>
    </section>
  )
}
