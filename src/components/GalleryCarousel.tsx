import { useState } from 'react'

type GalleryImage = {
  src: string
  alt: string
}

type GalleryCarouselProps = {
  images: readonly GalleryImage[]
}

export function GalleryCarousel({ images }: GalleryCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (images.length === 0) {
    return null
  }

  const goToPrevious = () => {
    setActiveIndex((currentIndex) => (currentIndex - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % images.length)
  }

  const activeImage = images[activeIndex % images.length]

  return (
    <div className="gallery-carousel">
      <div className="gallery-carousel__stage" aria-label="Gallery carousel" role="region">
        <button type="button" className="gallery-carousel__arrow gallery-carousel__arrow--left" onClick={goToPrevious} aria-label="Previous photo">
          ‹
        </button>

        <figure className="gallery-carousel__frame">
          <img
            src={activeImage.src}
            alt={activeImage.alt}
            loading={activeIndex === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        </figure>

        <button type="button" className="gallery-carousel__arrow gallery-carousel__arrow--right" onClick={goToNext} aria-label="Next photo">
          ›
        </button>
      </div>
    </div>
  )
}