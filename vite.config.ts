import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const icalUrl = env.VITE_AIRBNB_ICAL_URL || ''
  const icalTarget = icalUrl ? new URL(icalUrl) : null

  return {
    plugins: [react()],
    server: icalTarget
      ? {
          proxy: {
            '/.netlify/functions/ical-proxy': {
              target: icalTarget.origin,
              changeOrigin: true,
              secure: true,
              rewrite: () => `${icalTarget.pathname}${icalTarget.search}`,
            },
          },
        }
      : undefined,
  }
})
