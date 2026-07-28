// client/src/utils/formatDate.js

// "2026-07-23" -> "7/23/2026", display-only — the API stays ISO everywhere
export function formatDisplayDate(isoDate) {
  const [year, month, day] = isoDate.split('-')
  return `${Number(month)}/${Number(day)}/${year}`
}
