const env = import.meta.env

function readEnv(value: string | undefined, fallback = '') {
  return value?.trim() || fallback
}

function toDialableNumber(value: string) {
  return value.replace(/[^0-9]/g, '')
}

function buildMailtoHref(email: string, subject = '') {
  if (!email) {
    return ''
  }

  return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`
}

function buildWhatsAppHref(number: string, message: string) {
  const dialableNumber = toDialableNumber(number)

  if (!dialableNumber) {
    return ''
  }

  return `https://wa.me/${dialableNumber}?text=${encodeURIComponent(message)}`
}

const businessEmail = readEnv(env.VITE_BUSINESS_EMAIL)
const businessPhone = readEnv(env.VITE_BUSINESS_PHONE)
const whatsappNumber = readEnv(env.VITE_WHATSAPP_NUMBER)
const whatsappMessage = readEnv(env.VITE_WHATSAPP_MESSAGE)

export const siteConfig = {
  contact: {
    email: businessEmail,
    emailHref: buildMailtoHref(businessEmail),
    phone: businessPhone,
    phoneHref: businessPhone ? `tel:${toDialableNumber(businessPhone)}` : '',
    whatsappNumber,
    whatsappMessage,
    whatsappHref: buildWhatsAppHref(whatsappNumber, whatsappMessage),
  },
  booking: {
    airbnbUrl:
      readEnv(env.VITE_AIRBNB_URL) ||
      'https://es-l.airbnb.com/rooms/1299488275343790947?guests=1&adults=1&s=67&unique_share_id=28aa6230-9abe-4f80-8131-51a07c3e89d9',
    airbnbIcalUrl: readEnv(env.VITE_AIRBNB_ICAL_URL),
    googleMapsUrl: readEnv(env.VITE_GOOGLE_MAPS_URL),
  },
  social: {
    instagramUrl: 'https://www.instagram.com/morphoglampingcr/',
    tiktokUrl: 'https://www.tiktok.com/@morpho.glamping',
  },
} as const

export function buildReservationEmailHref(subject: string) {
  return buildMailtoHref(siteConfig.contact.email, subject)
}
