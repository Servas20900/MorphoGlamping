import { useState, type CSSProperties } from 'react'

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
  const activeSlideNumber = String(activeIndex + 1).padStart(2, '0')
  const frameStyle = {
    '--gallery-carousel-background': `url("${activeImage.src}")`,
  } as CSSProperties & Record<string, string>

  return (
    <div className="gallery-carousel">
      <div className="gallery-carousel__layout" aria-label="Gallery carousel" role="region">
        <div className="gallery-carousel__stage">
          <button type="button" className="gallery-carousel__arrow gallery-carousel__arrow--left" onClick={goToPrevious} aria-label="Previous photo">
            ‹
          </button>

          <figure className="gallery-carousel__frame" style={frameStyle}>
            <div className="gallery-carousel__badge">
              <span>Gallery</span>
              <strong>
                {activeSlideNumber}/{String(images.length).padStart(2, '0')}
              </strong>
            </div>
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

        <aside className="gallery-carousel__sidebar">
          <div className="gallery-carousel__meta">
            <p className="gallery-carousel__eyebrow">Selected view</p>
            <h3 className="gallery-carousel__headline">{activeImage.alt}</h3>
            <p className="gallery-carousel__description">
              Cada foto se adapta a su proporción real dentro de una tarjeta fija, sin recortes forzados.
            </p>
          </div>

          <div className="gallery-carousel__thumbs" aria-label="Select a photo">
            {images.map((image, index) => {
              const thumbnailNumber = String(index + 1).padStart(2, '0')

              return (
                <button
                  key={image.src}
                  type="button"
                  className={`gallery-carousel__thumb ${index === activeIndex ? 'gallery-carousel__thumb--active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`View photo ${thumbnailNumber}: ${image.alt}`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                >
                  <img src={image.src} alt="" loading="lazy" decoding="async" />
                  <span>{thumbnailNumber}</span>
                </button>
              )
            })}
          </div>
        </aside>
      </div>
    </div>
  )
}