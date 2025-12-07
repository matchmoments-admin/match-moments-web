interface ArticleCardProps {
  title: string
  author: string
  date: string
  readTime: string
  image: string
}

export function ArticleCard({ title, author, date, readTime, image }: ArticleCardProps) {
  return (
    <article className="group cursor-pointer overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all hover:shadow-lg">
      <div className="overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="aspect-[3/2] w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="mb-3 text-balance text-xl font-bold leading-snug group-hover:underline">{title}</h3>
        <p className="text-sm text-neutral-600">
          By {author} • {date} • {readTime}
        </p>
      </div>
    </article>
  )
}
