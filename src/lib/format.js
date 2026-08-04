// Formatting helpers ported verbatim from the design prototypes.

export const MN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export function uid() { return 'id' + Math.random().toString(36).slice(2, 9) }

// The prototype pins "today" to a fixed demo date; we use the real date here.
export function today() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export function fmt(n) { return 'FRw ' + Math.round(n || 0).toLocaleString('en-US') }

export function fmtShort(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(n >= 10000000 ? 0 : 1) + 'M'
  if (n >= 1000) return Math.round(n / 1000) + 'k'
  return '' + Math.round(n)
}

export function dateLabel(d) {
  if (!d) return ''
  const p = String(d).split('-')
  return parseInt(p[2], 10) + ' ' + MN[parseInt(p[1], 10) - 1] + ' ' + p[0]
}

export function monthLabel(mk) { return MN[parseInt(String(mk).slice(5, 7), 10) - 1] }
export function monthFull(mk) { return MN[parseInt(String(mk).slice(5, 7), 10) - 1] + ' ' + String(mk).slice(0, 4) }

export function mLabel(ym) {
  if (!ym) return ''
  const p = String(ym).split('-')
  return MN[(parseInt(p[1], 10) || 1) - 1] + ' ' + p[0]
}

export function workRange(s, e) {
  if (!s) return ''
  return mLabel(s) + ' – ' + (e ? mLabel(e) : 'Present')
}

export function workDuration(s, e) {
  if (!s) return ''
  const sp = s.split('-')
  const ep = (e || today().slice(0, 7)).split('-')
  let mo = (parseInt(ep[0]) - parseInt(sp[0])) * 12 + (parseInt(ep[1]) - parseInt(sp[1])) + 1
  if (mo < 1) mo = 1
  const y = Math.floor(mo / 12)
  const m = mo % 12
  const parts = []
  if (y) parts.push(y + (y > 1 ? ' yrs' : ' yr'))
  if (m) parts.push(m + (m > 1 ? ' mos' : ' mo'))
  return parts.join(' ') || (mo + ' mos')
}

export function rgba(hex, a) {
  return 'rgba(' + parseInt(hex.slice(1, 3), 16) + ',' + parseInt(hex.slice(3, 5), 16) + ',' + parseInt(hex.slice(5, 7), 16) + ',' + a + ')'
}

export function initial(s) { return (s || '?').charAt(0).toUpperCase() }
