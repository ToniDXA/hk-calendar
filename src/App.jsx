import { useState } from 'react'
import { MonthGrid } from './components/MonthGrid'
import { MonthDetail } from './components/MonthDetail'

export default function App() {
  const [year, setYear] = useState(2026)
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [lang, setLang] = useState('zh')
  const [theme, setTheme] = useState('dark')

  if (selectedMonth) {
    return <div className={`app theme-${theme}`}><MonthDetail year={year} month={selectedMonth} lang={lang} onBack={() => setSelectedMonth(null)} /></div>
  }

  return <div className={`app theme-${theme}`}><MonthGrid
    year={year} lang={lang} theme={theme}
    onYearChange={setYear}
    onMonthClick={setSelectedMonth}
    onLanguageChange={() => setLang(lang === 'zh' ? 'en' : 'zh')}
    onThemeChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
  /></div>
}
