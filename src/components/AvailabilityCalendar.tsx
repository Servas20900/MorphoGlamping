import Calendar from 'react-calendar'

type AvailabilityCalendarProps = {
  selectedDate: Date
  bookedDateKeys: Set<string>
  onSelectDate: (date: Date) => void
  locale: 'es' | 'en'
  onDateSelected?: (date: Date) => void
}

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function AvailabilityCalendar({ selectedDate, bookedDateKeys, onSelectDate, locale, onDateSelected }: AvailabilityCalendarProps) {
  return (
    <Calendar
      value={selectedDate}
      onChange={(value) => {
        if (value instanceof Date) {
          onSelectDate(value)
          onDateSelected?.(value)
        }
      }}
      locale={locale === 'es' ? 'es-CR' : 'en-US'}
      minDate={new Date()}
      next2Label={null}
      prev2Label={null}
      showNeighboringMonth={false}
      tileClassName={({ date, view }) => {
        if (view !== 'month') {
          return undefined
        }

        const classes = ['calendar-tile--available']

        if (bookedDateKeys.has(getDateKey(date))) {
          classes.push('calendar-tile--booked')
        }

        if (getDateKey(date) === getDateKey(selectedDate)) {
          classes.push('calendar-tile--selected')
        }

        if (getDateKey(date) === getDateKey(new Date())) {
          classes.push('calendar-tile--today')
        }

        return classes.join(' ')
      }}
      tileDisabled={({ date, view }) => view === 'month' && bookedDateKeys.has(getDateKey(date))}
    />
  )
}