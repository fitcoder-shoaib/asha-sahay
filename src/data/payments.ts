import type { L } from './types'

export type PayStatus = 'received' | 'pending' | 'process'

export type Payment = {
  id: string
  scheme: L
  status: PayStatus
  date: string       // due date, or credit date once received
  amount: number
  units: number
  rate: number
}

const S = {
  fixed: { en: 'ASHA monthly fixed incentive', hi: 'आशा मासिक निश्चित प्रोत्साहन', ml: 'ആശ പ്രതിമാസ സ്ഥിര ഇൻസെന്റീവ്' },
  jsy: { en: 'JSY — delivery escort', hi: 'जेएसवाई — प्रसव सहायता', ml: 'ജെഎസ്‌വൈ — പ്രസവ സഹായം' },
  immun: { en: 'Routine immunisation session', hi: 'नियमित टीकाकरण सत्र', ml: 'പതിവ് പ്രതിരോധ കുത്തിവയ്പ്പ് സെഷൻ' },
  hbnc: { en: 'Home-based newborn care visit', hi: 'गृह आधारित नवजात देखभाल', ml: 'ഭവനാധിഷ്ഠിത നവജാത പരിചരണം' },
  ncd: { en: 'NCD screening (CBAC form)', hi: 'एनसीडी स्क्रीनिंग (सीबीएसी फॉर्म)', ml: 'എൻസിഡി സ്ക്രീനിംഗ് (സിബിഎസി ഫോം)' },
  vhsnd: { en: 'VHSND session support', hi: 'वीएचएसएनडी सत्र सहयोग', ml: 'വിഎച്ച്എസ്എൻഡി സെഷൻ പിന്തുണ' },
  tb: { en: 'TB treatment support (NIKSHAY)', hi: 'टीबी उपचार सहयोग (निक्षय)', ml: 'ടിബി ചികിത്സാ പിന്തുണ (നിക്ഷയ്)' },
  anc: { en: 'ANC check-up facilitation', hi: 'एएनसी जाँच सुविधा', ml: 'എഎൻസി പരിശോധനാ സഹായം' },
  fp: { en: 'Family planning counselling', hi: 'परिवार नियोजन परामर्श', ml: 'കുടുംബാസൂത്രണ കൗൺസിലിംഗ്' },
  ab: { en: 'Ayushman card registration', hi: 'आयुष्मान कार्ड पंजीकरण', ml: 'ആയുഷ്മാൻ കാർഡ് രജിസ്ട്രേഷൻ' },
} satisfies Record<string, L>
// Catalogue of real NHM scheme names. Only the three seeded below are shown;
// the rest are here so another example is a one-line addition.

const p = (
  id: string, scheme: L, status: PayStatus, date: string, units: number, rate: number,
): Payment => ({ id, scheme, status, date, units, rate, amount: units * rate })

export const payments: Payment[] = [
  // One worked example per status, all in the current month so the default
  // view shows all three. Dates are spread so each lands on its own day.
  p('c1', S.fixed, 'received', '2026-09-05', 1, 2000),   // completed
  p('c2', S.jsy, 'process', '2026-09-12', 2, 600),       // in process
  p('c3', S.ncd, 'pending', '2026-09-25', 34, 25),       // due
]

export const STATUS_ORDER: PayStatus[] = ['received', 'pending', 'process']

export const statusVar: Record<PayStatus, string> = {
  received: 'received',
  process: 'process',
  pending: 'pending',
}

export const paymentsOn = (isoDate: string) => payments.filter((x) => x.date === isoDate)

export const paymentsInMonth = (year: number, month: number) =>
  payments.filter((x) => {
    const [y, m] = x.date.split('-').map(Number)
    return y === year && m - 1 === month
  })

export const sumBy = (list: Payment[], status: PayStatus) =>
  list.filter((x) => x.status === status).reduce((a, x) => a + x.amount, 0)
