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
    <div className="reviews-grid">
      {reviews.map((review, index) => (
        <motion.figure
          key={review.author}
          className="review-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
        >
          <div className="review-card__stars" aria-label={`${review.stars} out of 5 stars`}>
            {Array.from({ length: review.stars }, (_, starIndex) => (
              <span key={`${review.author}-${starIndex}`} aria-hidden="true">
                •
              </span>
            ))}
          </div>
          <blockquote>{review.quote}</blockquote>
          <figcaption>
            <strong>{review.author}</strong>
            <span>{review.detail}</span>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  )
}
