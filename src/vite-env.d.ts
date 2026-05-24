/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BUSINESS_EMAIL?: string
  readonly VITE_BUSINESS_PHONE?: string
  readonly VITE_WHATSAPP_NUMBER?: string
  readonly VITE_WHATSAPP_MESSAGE?: string
  readonly VITE_AIRBNB_URL?: string
  readonly VITE_AIRBNB_ICAL_URL?: string
  readonly VITE_GOOGLE_MAPS_URL?: string
  readonly VITE_GA_MEASUREMENT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
