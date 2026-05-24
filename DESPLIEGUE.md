# Guía de imágenes y despliegue — Morpho Glamping

Esta guía explica cómo subir tus fotos reales y publicar el sitio en internet con tu dominio (por ejemplo `morphoglamping.com`).

---

## 1. Subir fotos al proyecto

Todas las imágenes locales van en la carpeta **`public/images/`**. Vite las sirve tal cual en la URL `/images/nombre.jpg`.

### Archivos que debes colocar

| Archivo | Uso | Recomendación |
|---------|-----|---------------|
| `public/images/logo.jpg` | Logo circular del navbar | 256×256 px o 512×512 px, JPG o PNG, cuadrado |
| `public/images/hero.jpg` | Imagen principal del hero | 1800 px de ancho mínimo, horizontal, JPG optimizado |
| `public/images/gallery-01.jpg` | Galería — foto principal (grande) | 1600 px de ancho |
| `public/images/gallery-02.jpg` | Galería | 1200–1600 px |
| `public/images/gallery-03.jpg` | Galería | 1200–1600 px |
| `public/images/gallery-04.jpg` | Galería | 1200–1600 px |

### Pasos

1. Copia tus fotos a `public/images/` con esos nombres exactos.
2. Si tu logo tiene otro nombre o formato, edita `src/data/site.ts`:

```ts
export const siteBrand = {
  name: 'Morpho Glamping',
  logoSrc: '/images/logo.jpg',   // ← cambia aquí si usas otro nombre
  logoFallback: '/favicon.svg',
}
```

3. Para cambiar rutas de galería o hero, edita el mismo archivo (`galleryImages` y `heroImage`).

### Optimizar antes de subir

- Exportá en **JPG** con calidad 80–85 % (suficiente para web).
- Redimensioná en [Squoosh](https://squoosh.app) o similar — no subas RAW ni fotos de 10 MB.
- Objetivo: hero ~300–500 KB, galería ~150–300 KB cada una, logo ~30–80 KB.

### Probar en local

```bash
npm install
npm run dev
```

Abrí `http://localhost:5173` y verificá logo, hero y galería.

---

## 2. Build de producción

Antes de publicar, generá la versión optimizada:

```bash
npm run build
npm run preview   # opcional: previsualizar el build en local
```

El resultado queda en la carpeta **`dist/`**. Eso es lo que se sube al hosting.

---

## 3. Hostear el sitio (recomendado: Cloudflare Pages)

Cloudflare Pages es gratuito, rápido, funciona bien con Safari móvil y permite conectar tu dominio custom.

### Opción A — Desde GitHub (recomendada)

1. **Subí el repo a GitHub** (si aún no lo hiciste):
   ```bash
   git add .
   git commit -m "Morpho Glamping landing"
   git remote add origin https://github.com/TU-USUARIO/morpho-glamping.git
   git push -u origin main
   ```

2. Entrá a [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.

3. Elegí tu repositorio y configurá el build:

   | Campo | Valor |
   |-------|-------|
   | Framework preset | None (o Vite si aparece) |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Node version | 20 o superior |

4. **Deploy**. En 1–2 minutos tendrás una URL tipo `morpho-glamping.pages.dev`.

5. **Dominio custom** (ej. `morphoglamping.com`):
   - En Pages → tu proyecto → **Custom domains** → **Set up a custom domain**.
   - Si el dominio ya está en Cloudflare, se configura solo.
   - Si no, Cloudflare te indica qué registro DNS agregar (CNAME o A).

### Opción B — Subida manual (sin Git)

1. Ejecutá `npm run build`.
2. En Cloudflare Pages → **Upload assets** → arrastrá el contenido de **`dist/`**.
3. Conectá el dominio igual que arriba.

### SPA / rutas

El archivo `public/_redirects` ya está incluido para que todas las rutas apunten a `index.html` (necesario por React Router).

---

## 4. Alternativa: Vercel

Si preferís Vercel:

1. [vercel.com](https://vercel.com) → **Add New Project** → importá el repo de GitHub.
2. Framework: **Vite**.
3. Build: `npm run build`, output: `dist`.
4. Deploy → **Settings → Domains** para agregar `morphoglamping.com`.

---

## 5. Checklist antes de publicar

- [ ] Fotos en `public/images/` con los nombres correctos
- [ ] Logo circular se ve bien en navbar (desktop y móvil)
- [ ] `npm run build` termina sin errores
- [ ] Probado en Safari iOS (menú hamburguesa, scroll, calendario)
- [ ] Dominio apuntando al hosting
- [ ] HTTPS activo (Cloudflare/Vercel lo dan automático)

---

## 6. Actualizar el sitio después

1. Cambiá fotos en `public/images/` o textos en `src/i18n.ts`.
2. Commit + push a GitHub (si usás Cloudflare con Git).
3. El deploy se regenera solo.

Para fechas bloqueadas del calendario, editá `bookedDateKeys` en `src/data/site.ts`.

---

## 7. Estructura rápida de archivos clave

```
public/
  images/          ← tus fotos aquí
  favicon.svg
  _redirects       ← routing SPA (no borrar)
src/
   data/site.ts     ← rutas de imágenes, fechas reservadas, logo
   config/siteConfig.ts ← links de contacto y reservas desde variables de entorno
   i18n.ts          ← textos ES / EN
   App.tsx          ← secciones de la landing
   components/
      Navbar.tsx     ← navbar + menú móvil
```

---

## 8. Soporte

Si algo no carga en producción pero sí en local:

- Revisá que las imágenes estén dentro de `public/` (no en `src/`).
- Revisá la consola del navegador (404 en `/images/...`).
- Verificá que el build incluya `dist/images/` después de `npm run build`.

---

## 9. Variables de entorno

Antes de publicar, crea un archivo `.env` a partir de [`.env.example`](.env.example) y completa:

- `VITE_BUSINESS_EMAIL`
- `VITE_BUSINESS_PHONE`
- `VITE_WHATSAPP_NUMBER`
- `VITE_WHATSAPP_MESSAGE`
- `VITE_AIRBNB_URL`
- `VITE_AIRBNB_ICAL_URL`
- `VITE_GOOGLE_MAPS_URL`

Nota importante: Airbnb normalmente se integra por iCal; no existe una API pública general para leer el calendario directamente desde el frontend.
