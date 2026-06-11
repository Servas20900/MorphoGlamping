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
const googleMapsUrl = 'https://maps.app.goo.gl/VF4KYuG6Rj3oMRET9'
const googleMapsEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d245.15322097066266!2d-84.8926582!3d10.5437951!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa00102f8aeee9d%3A0x9315c6533bfca04b!2sMorphoGlamping!5e0!3m2!1ses-419!2scr!4v1781150720521!5m2!1ses-419!2scr'

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
    googleMapsEmbedUrl,
  },
  social: {
    instagramUrl: 'https://www.instagram.com/morphoglampingcr/',
    tiktokUrl: 'https://www.tiktok.com/@morpho.glamping',
  },
} as const

export function buildReservationEmailHref(subject: string) {
  return buildMailtoHref(siteConfig.contact.email, subject)
}
