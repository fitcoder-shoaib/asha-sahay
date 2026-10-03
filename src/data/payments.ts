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

const p = (
  id: string, scheme: L, status: PayStatus, date: string, units: number, rate: number,
): Payment => ({ id, scheme, status, date, units, rate, amount: units * rate })

export const payments: Payment[] = [
  // ---- August 2026 (settled) ----
  p('a1', S.fixed, 'received', '2026-08-05', 1, 2000),
  p('a2', S.jsy, 'received', '2026-08-11', 3, 600),
  p('a3', S.immun, 'received', '2026-08-18', 4, 150),
  p('a4', S.ncd, 'received', '2026-08-26', 57, 25),

  // ---- September 2026 (current month) ----
  p('s1', S.fixed, 'received', '2026-09-05', 1, 2000),
  p('s2', S.hbnc, 'received', '2026-09-08', 6, 250),
  p('s3', S.jsy, 'process', '2026-09-12', 2, 600),
  p('s4', S.immun, 'process', '2026-09-12', 3, 150),
  p('s5', S.anc, 'pending', '2026-09-16', 9, 100),
  p('s6', S.ncd, 'pending', '2026-09-16', 34, 25),
  p('s7', S.vhsnd, 'pending', '2026-09-19', 1, 200),
  p('s8', S.tb, 'process', '2026-09-22', 2, 500),
  p('s9', S.fp, 'pending', '2026-09-25', 5, 100),
  p('s10', S.ab, 'pending', '2026-09-28', 12, 50),
  p('s11', S.immun, 'pending', '2026-09-30', 4, 150),

  // ---- October 2026 (not yet paid) ----
  p('o1', S.fixed, 'pending', '2026-10-05', 1, 2000),
  p('o2', S.hbnc, 'pending', '2026-10-09', 4, 250),
  p('o3', S.ncd, 'pending', '2026-10-20', 40, 25),
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
