import { addDays, format, parseISO } from 'date-fns'

/*
  Fixed plans transcribed from the Flyday Hong Kong 2026 / 2027 leave guides.
  Assumption: Monday–Friday work week; Saturdays, Sundays and HK public holidays are days off.
  Gold dashed dates = annual leave needed. Teal dashed dates = other dates included in the same break.
*/

const flydayPlans = {
  2026: [
    { name: '元旦', start: '2026-01-01', end: '2026-01-04', leaveDates: ['2026-01-02'], totalDays: 4 },
    { name: '農曆新年', start: '2026-02-14', end: '2026-02-22', leaveDates: ['2026-02-16', '2026-02-20'], totalDays: 9 },
    { name: '復活節＋清明節', start: '2026-04-03', end: '2026-04-07', leaveDates: [], totalDays: 5 },
    { name: '勞動節', start: '2026-05-01', end: '2026-05-03', leaveDates: [], totalDays: 3 },
    { name: '佛誕', start: '2026-05-23', end: '2026-05-25', leaveDates: [], totalDays: 3 },
    { name: '端午節', start: '2026-06-19', end: '2026-06-21', leaveDates: [], totalDays: 3 },
    { name: '香港特別行政區成立紀念日', start: '2026-06-27', end: '2026-07-01', leaveDates: ['2026-06-29', '2026-06-30'], totalDays: 5 },
    { name: '國慶日', start: '2026-10-01', end: '2026-10-04', leaveDates: ['2026-10-02'], totalDays: 4 },
    { name: '重陽節', start: '2026-10-17', end: '2026-10-19', leaveDates: [], totalDays: 3 },
    { name: '聖誕節', start: '2026-12-24', end: '2026-12-27', leaveDates: ['2026-12-24'], totalDays: 4 }
  ],
  2027: [
    { name: '元旦', start: '2027-01-01', end: '2027-01-03', leaveDates: [], totalDays: 3 },
    { name: '農曆新年', start: '2027-02-06', end: '2027-02-14', leaveDates: ['2027-02-10', '2027-02-11', '2027-02-12'], totalDays: 9 },
    { name: '復活節＋清明節', start: '2027-03-26', end: '2027-04-05', leaveDates: ['2027-03-30', '2027-03-31', '2027-04-01', '2027-04-02'], totalDays: 11 },
    { name: '佛誕', start: '2027-05-13', end: '2027-05-16', leaveDates: ['2027-05-14'], totalDays: 4 },
    { name: '端午節', start: '2027-06-09', end: '2027-06-13', leaveDates: ['2027-06-10', '2027-06-11'], totalDays: 5 },
    { name: '香港特別行政區成立紀念日', start: '2027-07-01', end: '2027-07-04', leaveDates: ['2027-07-02'], totalDays: 4 },
    { name: '中秋節', start: '2027-09-11', end: '2027-09-19', leaveDates: ['2027-09-13', '2027-09-14', '2027-09-15', '2027-09-17'], totalDays: 9 },
    { name: '國慶日', start: '2027-10-01', end: '2027-10-10', leaveDates: ['2027-10-04', '2027-10-05', '2027-10-06', '2027-10-07'], totalDays: 10 },
    { name: '聖誕節', start: '2027-12-25', end: '2028-01-02', leaveDates: ['2027-12-28', '2027-12-29', '2027-12-30', '2027-12-31'], totalDays: 9 }
  ]
}

function allDates(start, end) {
  const output = []
  for (let day = parseISO(start); day <= parseISO(end); day = addDays(day, 1)) {
    output.push(format(day, 'yyyy-MM-dd'))
  }
  return output
}

export function getLeavePlans(year) {
  return (flydayPlans[year] || []).map((plan, index) => ({
    ...plan,
    id: `${year}-${index}-${plan.start}`,
    allDates: allDates(plan.start, plan.end),
    leaveDays: plan.leaveDates.length,
    holidayLabels: [plan.name]
  }))
}

export function leaveMaps(year) {
  const plans = getLeavePlans(year)
  const leave = new Set()
  const included = new Set()

  plans.forEach((plan) => {
    plan.allDates.forEach((date) => included.add(date))
    plan.leaveDates.forEach((date) => leave.add(date))
  })

  return { plans, leave, included }
}
