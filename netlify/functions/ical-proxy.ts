type NetlifyResponse = {
  statusCode: number
  headers?: Record<string, string>
  body: string
}

export async function handler(): Promise<NetlifyResponse> {
  const icalUrl = process.env.VITE_AIRBNB_ICAL_URL

  if (!icalUrl) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'ICAL URL not configured' }),
    }
  }

  try {
    const response = await fetch(icalUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch iCal: ${response.status}`)
    }

    const feed = await response.text()

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
      body: feed,
    }
  } catch {
    return {
      statusCode: 502,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Unable to fetch availability' }),
    }
  }
}