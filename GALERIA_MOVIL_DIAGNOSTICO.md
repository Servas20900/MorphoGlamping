# Diagnóstico de la galería en móvil

## Qué está pasando

La galería se maneja como un carrusel con estado local en React. El componente guarda el índice activo, cambia entre fotos con los botones de anterior/siguiente y también permite seleccionar una imagen desde las miniaturas.

El problema aparece en teléfono porque el alto visible de la galería no está fijado por una proporción estable. En lugar de tener una caja que mantenga siempre el mismo formato, el contenedor termina dependiendo demasiado de la proporción real de cada foto.

Eso provoca tres efectos:

1. La sección de galería cambia de alto según la imagen activa.
2. En algunas fotos la página se ve más “estirada” y en otras más “apretada”.
3. Como las flechas están posicionadas respecto al alto del stage, también se mueven de lugar.

## Dónde ocurre

### Componente

Archivo: [src/components/GalleryCarousel.tsx](src/components/GalleryCarousel.tsx)

```tsx
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
```

### Estilos base

Archivo: [src/App.css](src/App.css)

```css
.gallery-carousel {
  display: grid;
  gap: 1rem;
  width: min(100%, 62rem);
  margin-inline: auto;
}

.gallery-carousel__layout {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(15rem, 0.62fr);
  gap: 1rem;
  align-items: stretch;
}

.gallery-carousel__stage {
  position: relative;
  display: grid;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: clamp(0.8rem, 1.5vw, 1.15rem);
  border-radius: var(--radius-xxl);
  border: 1px solid var(--color-border);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-white) 84%, transparent), color-mix(in srgb, var(--color-white) 60%, transparent)),
    var(--color-surface);
  box-shadow: 0 18px 42px rgba(17, 17, 17, 0.08);
  min-height: clamp(16rem, 38vw, 24rem);
  overflow: hidden;
}

.gallery-carousel__frame {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  padding: 0;
  margin: 0;
  border: 0;
  border-radius: calc(var(--radius-xxl) - 0.75rem);
  background: color-mix(in srgb, var(--color-white) 40%, var(--color-surface));
  box-shadow: none;
  overflow: hidden;
}

.gallery-carousel__frame img {
  position: relative;
  z-index: 1;
  width: auto;
  height: auto;
  max-width: 84%;
  max-height: 84%;
  object-fit: contain;
  object-position: center;
  display: block;
}

.gallery-carousel__arrow {
  position: absolute;
  top: 50%;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 2.9rem;
  height: 2.9rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.82);
  color: var(--color-text);
  font-size: 1.8rem;
  line-height: 1;
  transform: translateY(-50%);
  box-shadow: 0 8px 22px rgba(17, 17, 17, 0.12);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
```

## Por qué se desacomoda en móvil

En desktop el layout reparte mejor el espacio, pero en móvil la galería pasa a una sola columna y el alto real del bloque depende más de la imagen visible. Como cada foto tiene una proporción distinta, el contenedor no conserva siempre la misma altura.

Además, las flechas están centradas con `top: 50%` sobre un stage cuya altura cambia. Por eso, cuando cambia la foto, cambia también la posición visual de las flechas.

## Ajuste recomendado

La solución más estable es darle al frame principal una proporción fija en móvil y dejar que la imagen se acomode dentro de esa caja con `object-fit: contain` o `cover`, según el efecto visual que se quiera.

### Ejemplo de corrección

Archivo: [src/App.css](src/App.css)

```css
.gallery-carousel__stage {
  position: relative;
  display: grid;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: clamp(0.8rem, 1.5vw, 1.15rem);
  border-radius: var(--radius-xxl);
  border: 1px solid var(--color-border);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-white) 84%, transparent), color-mix(in srgb, var(--color-white) 60%, transparent)),
    var(--color-surface);
  box-shadow: 0 18px 42px rgba(17, 17, 17, 0.08);
  min-height: clamp(16rem, 38vw, 24rem);
  overflow: hidden;
}

.gallery-carousel__frame {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  display: grid;
  place-items: center;
  padding: 0;
  margin: 0;
  border: 0;
  border-radius: calc(var(--radius-xxl) - 0.75rem);
  background: color-mix(in srgb, var(--color-white) 40%, var(--color-surface));
  box-shadow: none;
  overflow: hidden;
}

.gallery-carousel__frame img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
}

@media (max-width: 600px) {
  .gallery-carousel__stage {
    min-height: unset;
    padding: 0.55rem;
  }

  .gallery-carousel__frame {
    aspect-ratio: 1 / 1;
  }

  .gallery-carousel__arrow {
    width: 2.55rem;
    height: 2.55rem;
    font-size: 1.55rem;
  }

  .gallery-carousel__arrow--left {
    left: 0.45rem;
  }

  .gallery-carousel__arrow--right {
    right: 0.45rem;
  }
}
```

## Resumen corto

El problema no está en React sino en el CSS. La galería no tiene una caja visual fija en móvil, así que la altura cambia según la foto. Al cambiar esa altura, también se mueve la posición de las flechas.

La corrección correcta es fijar una proporción para el frame principal y hacer que la imagen se adapte dentro de ese espacio, en vez de dejar que cada archivo de imagen decida el alto del bloque.
