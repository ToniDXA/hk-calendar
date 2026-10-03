import { addDays, differenceInCalendarDays, endOfYear, format, getDay, startOfYear } from 'date-fns'

const key = (date) => format(date, 'yyyy-MM-dd')
const isWeekend = (date) => getDay(date) === 0 || getDay(date) === 6

function between(start, end) {
  const output = []
  for (let day = start; day <= end; day = addDays(day, 1)) output.push(day)
  return output
}

export function getLeavePlans(year, hkHolidays) {
  const holidayNames = new Map(hkHolidays.map((item) => [item.date, item.name]))
  const first = startOfYear(new Date(year, 0, 1))
  const last = endOfYear(new Date(year, 0, 1))
  const candidates = []

  for (let start = first; start <= last; start = addDays(start, 1)) {
    for (let end = start; end <= last && differenceInCalendarDays(end, start) < 16; end = addDays(end, 1)) {
      const days = between(start, end)
      const leaveDates = days.filter((day) => !isWeekend(day) && !holidayNames.has(key(day))).map(key)
      const holidayLabels = [...new Set(days.map((day) => holidayNames.get(key(day))).filter(Boolean))]
      if (holidayLabels.length === 0 || leaveDates.length < 1 || leaveDates.length > 5 || days.length < 4) continue
      candidates.push({ start: key(start), end: key(end), totalDays: days.length, leaveDays: leaveDates.length, leaveDates, holidayLabels })
    }
  }

  const selected = []
  for (let leaveDays = 1; leaveDays <= 5; leaveDays += 1) {
    const options = candidates.filter((plan) => plan.leaveDays === leaveDays).sort((a, b) => b.totalDays - a.totalDays || a.start.localeCompare(b.start))
    const best = options.find((plan) => !selected.some((saved) => !(plan.end < saved.start || plan.start > saved.end)))
    if (best) selected.push({ ...best, id: `${best.start}-${best.end}` })
  }
  return selected.sort((a, b) => a.start.localeCompare(b.start))
}

export function recommendedLeaveDates(year, hkHolidays) {
  return new Set(getLeavePlans(year, hkHolidays).flatMap((plan) => plan.leaveDates))
}
