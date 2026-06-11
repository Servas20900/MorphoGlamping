import { useState, useCallback } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

type GalleryImage = {
  src: string
  alt: string
}

type GalleryCarouselProps = {
  images: readonly GalleryImage[]
}

export function GalleryCarousel({ images }: GalleryCarouselProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openAt = useCallback((index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }, [])

  const slides = images.map((img) => ({ src: img.src, alt: img.alt }))

  return (
    <>
      <div className="grid grid-cols-3 gap-[0.4rem] max-[960px]:grid-cols-2 max-[600px]:grid-cols-2">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => openAt(i)}
            aria-label={`Ver foto: ${img.alt}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-section border-0 p-0 bg-surface cursor-pointer"
          >
            <img
              src={img.src}
              alt={img.alt}
              loading={i < 6 ? 'eager' : 'lazy'}
              decoding="async"
              className="w-full h-full object-cover object-center transition-transform duration-[380ms] ease-[cubic-bezier(.25,.46,.45,.94)] group-hover:scale-[1.04]"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-[280ms] pointer-events-none"
            />
          </button>
        ))}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
        plugins={[Thumbnails, Zoom]}
        thumbnails={{ border: 0, borderRadius: 6, padding: 3, gap: 6 }}
        zoom={{ maxZoomPixelRatio: 3 }}
        styles={{
          container: { backgroundColor: 'rgba(0,0,0,0.92)' },
          thumbnailsContainer: { backgroundColor: 'rgba(0,0,0,0.75)' },
        }}
      />
    </>
  )
}
