import { useEffect, useState } from 'react'

export function useHolidays(year) {
  const [holidays, setHolidays] = useState({})
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    fetch(`${import.meta.env.BASE_URL}holidays.json`)
      .then((res) => { if (!res.ok) throw new Error(`Holiday data HTTP ${res.status}`); return res.json() })
      .then((data) => setHolidays(data[String(year)] || {}))
      .catch((error) => { console.error(error); setHolidays({}) })
      .finally(() => setLoading(false))
  }, [year])
  return { holidays, loading }
}
