# Morpho Glamping

Landing page concept for Morpho Glamping in Nuevo Arenal, Costa Rica.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- GSAP + ScrollTrigger
- Lenis
- React Router
- i18next
- React Calendar

## Run

```bash
npm install
npm run dev
```

## Environment variables

Copy [`.env.example`](.env.example) to `.env` and complete these values before publishing:

- `VITE_BUSINESS_EMAIL` for the business reservation email.
- `VITE_BUSINESS_PHONE` for the visible phone number.
- `VITE_WHATSAPP_NUMBER` and `VITE_WHATSAPP_MESSAGE` for the WhatsApp booking link.
- `VITE_AIRBNB_URL` for the Airbnb listing.
- `VITE_AIRBNB_ICAL_URL` for the Airbnb calendar feed URL, which is iCal, not an API key.
- `VITE_GOOGLE_MAPS_URL` for the optional map link.


## Build

```bash
npm run build
npm run lint
```


