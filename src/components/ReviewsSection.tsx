import { motion } from 'framer-motion'

type Review = {
  quote: string
  author: string
  detail: string
  stars: number
}

type ReviewsSectionProps = {
  reviews: Review[]
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review, index) => (
        <motion.figure
          key={review.author}
          className="m-0 p-5 border border-black/[.07] rounded-section bg-white/60"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
        >
          <div className="flex gap-[.2rem] mb-3 text-accent text-sm" aria-label={`${review.stars} out of 5 stars`}>
            {Array.from({ length: review.stars }, (_, starIndex) => (
              <span key={`${review.author}-${starIndex}`} aria-hidden="true">★</span>
            ))}
          </div>
          <blockquote className="m-0 text-[.92rem] leading-[1.65] text-ink">"{review.quote}"</blockquote>
          <figcaption className="mt-3 flex flex-col gap-[.2rem]">
            <strong className="text-[.88rem] font-semibold">{review.author}</strong>
            <span className="text-[.8rem] text-muted">{review.detail}</span>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  )
}
