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

const businessEmail = 'morphoglamping@gmail.com'
const businessPhone = '+506 7071-1103'
const whatsappNumber = '+506 7071-1103'
const whatsappMessage = 'Hola, me interesa reservar una estadía en Morpho Glamping, del ______ al ______ .'
const airbnbUrl = 'https://es-l.airbnb.com/rooms/1299488275343790947?guests=1&adults=1&s=67&unique_share_id=397abca1-d149-46e1-9d1b-aa591d423c2c'
const googleMapsUrl = 'https://www.google.com/maps/@10.5438422,-84.8927285,61m/data=!3m1!1e3?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D'

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
    airbnbUrl,
    googleMapsUrl,
  },
  social: {
    instagramUrl: 'https://www.instagram.com/morphoglampingcr/',
    tiktokUrl: 'https://www.tiktok.com/@morpho.glamping',
  },
} as const

export function buildReservationEmailHref(subject: string) {
  return buildMailtoHref(siteConfig.contact.email, subject)
}
