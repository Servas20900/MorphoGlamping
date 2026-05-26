import { useEffect, useMemo, useState } from 'react'

type AvailabilityCalendarProps = {
  bookedDateKeys: Set<string>
  onRangeSelected: (start: Date, end: Date) => void
  whatsappPhone: string
}

type CalendarCell = {
  key: string
  date: Date | null
}

const DAY_MS = 24 * 60 * 60 * 1000
const MONTHS_TO_RENDER = 1
const MONTH_NAMES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]
const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

function startOfDay(date: Date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)

  if (!year || !month || !day) {
    return null
  }

  return new Date(year, month - 1, day)
}

function isSameDay(firstDate: Date, secondDate: Date) {
  return getDateKey(firstDate) === getDateKey(secondDate)
}

function isBeforeDay(firstDate: Date, secondDate: Date) {
  return startOfDay(firstDate).getTime() < startOfDay(secondDate).getTime()
}

function isAfterDay(firstDate: Date, secondDate: Date) {
  return startOfDay(firstDate).getTime() > startOfDay(secondDate).getTime()
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * DAY_MS)
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1)
}

function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat('es-CR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function formatMonthLabel(year: number, month: number) {
  return `${MONTH_NAMES[month]} ${year}`
}

function getFirstBookedAfter(startDate: Date, bookedDateKeys: Set<string>) {
  const startTime = startOfDay(startDate).getTime()
  let nextBookedDate: Date | null = null

  for (const bookedDateKey of bookedDateKeys) {
    const bookedDate = parseDateKey(bookedDateKey)

    if (!bookedDate) {
      continue
    }

    const bookedTime = startOfDay(bookedDate).getTime()

    if (bookedTime <= startTime) {
      continue
    }

    if (!nextBookedDate || bookedTime < nextBookedDate.getTime()) {
      nextBookedDate = bookedDate
    }
  }

  return nextBookedDate ? startOfDay(nextBookedDate) : null
}

function hasBookedDayInRange(startDate: Date, endDate: Date, bookedDateKeys: Set<string>) {
  const rangeStart = startOfDay(startDate)
  const rangeEnd = startOfDay(endDate)
  const cursor = addDays(rangeStart, 1)

  while (cursor.getTime() < rangeEnd.getTime()) {
    if (bookedDateKeys.has(getDateKey(cursor))) {
      return true
    }

    cursor.setDate(cursor.getDate() + 1)
  }

  return false
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getCalendarCells(year: number, month: number) {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = new Date(year, month, 1)
  const startPadding = (firstDayOfMonth.getDay() + 6) % 7
  const cells: CalendarCell[] = []

  for (let index = 0; index < startPadding; index += 1) {
    cells.push({ key: `padding-${year}-${month}-${index}`, date: null })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day)
    cells.push({ key: getDateKey(date), date })
  }

  while (cells.length % 7 !== 0) {
    cells.push({ key: `padding-end-${year}-${month}-${cells.length}`, date: null })
  }

  return cells
}

function buildWhatsAppUrl(phone: string, message: string) {
  const normalizedPhone = phone.replace(/[^0-9]/g, '')

  if (!normalizedPhone) {
    return ''
  }

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`
}

export function AvailabilityCalendar({ bookedDateKeys, onRangeSelected, whatsappPhone }: AvailabilityCalendarProps) {
  const today = useMemo(() => startOfDay(new Date()), [])
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [rangeStart, setRangeStart] = useState<Date | null>(null)
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null)
  const [picking, setPicking] = useState(false)
  const [maxSelectableDate, setMaxSelectableDate] = useState<Date | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!toastMessage) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setToastMessage(null)
    }, 3200)

    return () => window.clearTimeout(timeoutId)
  }, [toastMessage])

  const renderedMonths = useMemo(() => {
    const startDate = new Date(viewYear, viewMonth, 1)

    return Array.from({ length: MONTHS_TO_RENDER }, (_, index) => {
      const monthDate = addMonths(startDate, index)

      return {
        key: `${monthDate.getFullYear()}-${monthDate.getMonth()}`,
        year: monthDate.getFullYear(),
        month: monthDate.getMonth(),
        label: formatMonthLabel(monthDate.getFullYear(), monthDate.getMonth()),
        cells: getCalendarCells(monthDate.getFullYear(), monthDate.getMonth()),
      }
    })
  }, [viewMonth, viewYear])

  const monthLabel = useMemo(() => {
    const firstMonth = renderedMonths[0]
    const lastMonth = renderedMonths[renderedMonths.length - 1]

    if (!firstMonth || !lastMonth) {
      return ''
    }

    if (firstMonth.key === lastMonth.key) {
      return firstMonth.label
    }

    return `${firstMonth.label} - ${lastMonth.label}`
  }, [renderedMonths])
  const nightCount = useMemo(() => {
    if (!rangeStart || !rangeEnd) {
      return 0
    }

    return Math.max(1, Math.round((startOfDay(rangeEnd).getTime() - startOfDay(rangeStart).getTime()) / DAY_MS))
  }, [rangeEnd, rangeStart])
  const selectionLabel = useMemo(() => {
    if (!rangeStart) {
      return 'Seleccioná las fechas'
    }

    if (rangeStart && !rangeEnd) {
      return `${formatDisplayDate(rangeStart)} → elegí fecha de salida`
    }

    if (rangeStart && rangeEnd) {
      return `${formatDisplayDate(rangeStart)} → ${formatDisplayDate(rangeEnd)} • ${nightCount} noches`
    }

    return 'Seleccioná las fechas'
  }, [nightCount, rangeEnd, rangeStart])

  const hasCompleteRange = Boolean(rangeStart && rangeEnd)
  const reservationUrl = useMemo(() => {
    if (!rangeStart || !rangeEnd) {
      return ''
    }

    const message = `Hola! Me interesa reservar del ${formatDisplayDate(rangeStart)} al ${formatDisplayDate(rangeEnd)} (${nightCount} noches). ¿Está disponible?`

    return buildWhatsAppUrl(whatsappPhone, message)
  }, [nightCount, rangeEnd, rangeStart, whatsappPhone])

  function resetSelection(nextStart: Date | null = null) {
    setRangeStart(nextStart)
    setRangeEnd(null)
    setPicking(Boolean(nextStart))
    setMaxSelectableDate(nextStart ? getFirstBookedAfter(nextStart, bookedDateKeys) : null)
  }

  function handleDayClick(day: Date) {
    const clickedDate = startOfDay(day)

    if (isBeforeDay(clickedDate, today)) {
      return
    }

    if (bookedDateKeys.has(getDateKey(clickedDate))) {
      return
    }

    if (!rangeStart || !picking || rangeEnd) {
      resetSelection(clickedDate)
      return
    }

    if (isSameDay(clickedDate, rangeStart)) {
      resetSelection()
      return
    }

    if (isBeforeDay(clickedDate, rangeStart)) {
      resetSelection(clickedDate)
      return
    }

    if (maxSelectableDate && !isBeforeDay(clickedDate, maxSelectableDate)) {
      return
    }

    if (hasBookedDayInRange(rangeStart, clickedDate, bookedDateKeys)) {
      setToastMessage('Hay días ocupados en ese rango, elegí otras fechas')
      resetSelection(clickedDate)
      return
    }

    setRangeEnd(clickedDate)
    setPicking(false)
    setMaxSelectableDate(null)
    onRangeSelected(rangeStart, clickedDate)
  }

  function handleReserve() {
    if (!reservationUrl) {
      return
    }

    window.open(reservationUrl, '_blank', 'noopener,noreferrer')
  }

  function goToPreviousMonth() {
    setViewMonth((currentMonth) => {
      if (currentMonth === 0) {
        setViewYear((currentYear) => currentYear - 1)
        return 11
      }

      return currentMonth - 1
    })
  }

  function goToNextMonth() {
    setViewMonth((currentMonth) => {
      if (currentMonth === 11) {
        setViewYear((currentYear) => currentYear + 1)
        return 0
      }

      return currentMonth + 1
    })
  }

  return (
    <div className="availability-calendar">
      <div className="availability-calendar__header">
        <button type="button" className="availability-calendar__nav" onClick={goToPreviousMonth} aria-label="Mes anterior">
          ‹
        </button>

        <div className="availability-calendar__title-group">
          <p className="availability-calendar__eyebrow">Disponibilidad</p>
          <h3 className="availability-calendar__title">{monthLabel}</h3>
        </div>

        <button type="button" className="availability-calendar__nav" onClick={goToNextMonth} aria-label="Mes siguiente">
          ›
        </button>
      </div>

      <div className="availability-calendar__weekdays" aria-hidden="true">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="availability-calendar__months" aria-label={`Calendario de ${monthLabel}`}>
        {renderedMonths.map((month) => (
          <section key={month.key} className="availability-calendar__month">
            <h4 className="availability-calendar__month-label">{month.label}</h4>

            <div className="availability-calendar__grid" role="grid" aria-label={`Calendario de ${month.label}`}>
              {month.cells.map((cell) => {
                if (!cell.date) {
                  return <div key={cell.key} className="availability-calendar__cell availability-calendar__cell--empty" aria-hidden="true" />
                }

                const date = cell.date
                const dateKey = getDateKey(date)
                const isBooked = bookedDateKeys.has(dateKey)
                const isPast = isBeforeDay(date, today)
                const isToday = isSameDay(date, today)
                const isSelectedStart = Boolean(rangeStart && isSameDay(date, rangeStart) && !rangeEnd)
                const isRangeStart = Boolean(rangeStart && rangeEnd && isSameDay(date, rangeStart))
                const isRangeEnd = Boolean(rangeStart && rangeEnd && isSameDay(date, rangeEnd))
                const isInRange = Boolean(rangeStart && rangeEnd && isAfterDay(date, rangeStart) && isBeforeDay(date, rangeEnd))
                const isBlockedByRange = Boolean(picking && maxSelectableDate && isAfterDay(date, maxSelectableDate))
                const isDisabled = isBooked || isPast || isBlockedByRange

                const cellClasses = [
                  'availability-calendar__cell',
                  isBooked ? 'booked' : '',
                  isPast ? 'past' : '',
                  isToday ? 'today' : '',
                  isSelectedStart ? 'selected' : '',
                  isRangeStart ? 'range-start' : '',
                  isRangeEnd ? 'range-end' : '',
                  isInRange ? 'in-range' : '',
                  isBlockedByRange ? 'blocked-by-range' : '',
                ]
                  .filter(Boolean)
                  .join(' ')

                return (
                  <button
                    key={cell.key}
                    type="button"
                    className={cellClasses}
                    onClick={() => handleDayClick(date)}
                    disabled={isDisabled}
                    aria-pressed={isSelectedStart || isRangeStart || isRangeEnd || isInRange}
                    aria-label={`${formatDisplayDate(date)}${isBooked ? ', ocupado' : ''}${isPast ? ', pasado' : ''}`}
                  >
                    <span className="availability-calendar__day-number">{date.getDate()}</span>
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="availability-calendar__selection-bar" role="status" aria-live="polite">
        <div className="availability-calendar__selection-copy">
          <span className="availability-calendar__selection-text">{selectionLabel}</span>
          {hasCompleteRange ? (
            <span className="availability-calendar__badge">
              {nightCount} noches
            </span>
          ) : null}
        </div>

        <button
          type="button"
          className="availability-calendar__reserve"
          onClick={handleReserve}
          disabled={!hasCompleteRange || !reservationUrl}
        >
          Reservar
        </button>
      </div>

      {toastMessage ? <div className="availability-calendar__toast" role="alert">{toastMessage}</div> : null}
    </div>
  )
}