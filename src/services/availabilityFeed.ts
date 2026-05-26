function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function parseIcalDate(value: string) {
  const match = value.match(/^(\d{4})(\d{2})(\d{2})/)

  if (!match) {
    return null
  }

  const year = Number(match[1])
  const month = Number(match[2]) - 1
  const day = Number(match[3])

  return new Date(year, month, day)
}

export function parseBookedDateKeysFromIcalFeed(feed: string) {
  const bookedDateKeys = new Set<string>()
  const events = feed.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) ?? []

  for (const event of events) {
    const startMatch = event.match(/DTSTART(?:;[^:]+)?:([^\r\n]+)/)
    const endMatch = event.match(/DTEND(?:;[^:]+)?:([^\r\n]+)/)

    if (!startMatch) {
      continue
    }

    const startDate = parseIcalDate(startMatch[1])

    if (!startDate) {
      continue
    }

    const exclusiveEnd = endMatch ? parseIcalDate(endMatch[1]) : null
    const cursor = new Date(startDate)

    if (exclusiveEnd) {
      while (cursor < exclusiveEnd) {
        bookedDateKeys.add(dateKey(cursor))
        cursor.setDate(cursor.getDate() + 1)
      }
    } else {
      bookedDateKeys.add(dateKey(cursor))
    }
  }

  return bookedDateKeys
}