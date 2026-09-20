import type { L } from './types'

export type ServiceEntry = { from: string; to: string | null; role: L; place: L }
export type Training = { name: L; date: string; hours: number; certified: boolean }
export type Achievement = { title: L; year: string; note: L }

export const profile = {
  ashaId: 'KL-PKD-04-2291',
  name: {
    en: 'Lakshmi Menon',
    hi: 'लक्ष्मी मेनन',
    ml: 'ലക്ഷ്മി മേനോൻ',
  } as L,
  initials: 'LM',
  // Repeated-digit placeholders: this prototype is public, so no number
  // here should resolve to a real person.
  phone: '+91 99999 00001',
  joiningDate: '2016-03-14',

  village: 'Vadakkanchery',
  villageL: { en: 'Vadakkanchery', hi: 'वडक्कनचेरी', ml: 'വടക്കഞ്ചേരി' } as L,
  block: { en: 'Alathur Block', hi: 'अलाथुर ब्लॉक', ml: 'ആലത്തൂർ ബ്ലോക്ക്' } as L,
  district: 'Palakkad',
  districtL: { en: 'Palakkad', hi: 'पालक्काड', ml: 'പാലക്കാട്' } as L,
  state: { en: 'Kerala', hi: 'केरल', ml: 'കേരളം' } as L,

  supervisor: 'Smt. Radhika P · +91 99999 00002',
  anm: 'Sub-centre Vadakkanchery · +91 99999 00003',

  households: 187,
  population: 842,

  serviceHistory: [
    {
      from: '2016-03', to: '2019-06',
      role: { en: 'ASHA Worker', hi: 'आशा कार्यकर्ता', ml: 'ആശ വർക്കർ' },
      place: { en: 'Ward 7, Vadakkanchery', hi: 'वार्ड 7, वडक्कनचेरी', ml: 'വാർഡ് 7, വടക്കഞ്ചേരി' },
    },
    {
      from: '2019-07', to: '2022-11',
      role: { en: 'ASHA Worker · Maternal Health focus', hi: 'आशा कार्यकर्ता · मातृ स्वास्थ्य', ml: 'ആശ വർക്കർ · മാതൃ ആരോഗ്യം' },
      place: { en: 'Ward 7 & 8, Vadakkanchery', hi: 'वार्ड 7 व 8, वडक्कनचेरी', ml: 'വാർഡ് 7 & 8, വടക്കഞ്ചേരി' },
    },
    {
      from: '2022-12', to: null,
      role: { en: 'Senior ASHA · NCD Screening lead', hi: 'वरिष्ठ आशा · एनसीडी स्क्रीनिंग प्रमुख', ml: 'സീനിയർ ആശ · എൻസിഡി സ്ക്രീനിംഗ് ലീഡ്' },
      place: { en: 'Alathur Block', hi: 'अलाथुर ब्लॉक', ml: 'ആലത്തൂർ ബ്ലോക്ക്' },
    },
  ] as ServiceEntry[],

  trainings: [
    {
      name: { en: 'ASHA Induction Training (Module 1–4)', hi: 'आशा प्रेरण प्रशिक्षण (मॉड्यूल 1–4)', ml: 'ആശ ഇൻഡക്ഷൻ പരിശീലനം (മൊഡ്യൂൾ 1–4)' },
      date: '2016-05-20', hours: 96, certified: true,
    },
    {
      name: { en: 'Maternal & Newborn Care', hi: 'मातृ एवं नवजात देखभाल', ml: 'മാതൃ-നവജാത ശിശു പരിചരണം' },
      date: '2018-02-11', hours: 40, certified: true,
    },
    {
      name: { en: 'Routine Immunisation & Cold Chain', hi: 'नियमित टीकाकरण एवं कोल्ड चेन', ml: 'പതിവ് പ്രതിരോധ കുത്തിവയ്പ്പും കോൾഡ് ചെയിനും' },
      date: '2019-09-03', hours: 24, certified: true,
    },
    {
      name: { en: 'NCD Screening (Hypertension & Diabetes)', hi: 'एनसीडी स्क्रीनिंग (उच्च रक्तचाप एवं मधुमेह)', ml: 'എൻസിഡി സ്ക്രീനിംഗ് (രക്താതിമർദ്ദം, പ്രമേഹം)' },
      date: '2021-07-16', hours: 32, certified: true,
    },
    {
      name: { en: 'Mental Health First Aid', hi: 'मानसिक स्वास्थ्य प्राथमिक सहायता', ml: 'മാനസികാരോഗ്യ പ്രഥമശുശ്രൂഷ' },
      date: '2023-04-25', hours: 16, certified: true,
    },
    {
      name: { en: 'Digital Health Records (mobile reporting)', hi: 'डिजिटल स्वास्थ्य रिकॉर्ड (मोबाइल रिपोर्टिंग)', ml: 'ഡിജിറ്റൽ ആരോഗ്യ രേഖകൾ (മൊബൈൽ റിപ്പോർട്ടിംഗ്)' },
      date: '2025-01-30', hours: 12, certified: true,
    },
  ] as Training[],

  ncd: {
    total: 1348,
    byMonth: [
      { month: { en: 'Apr', hi: 'अप्रैल', ml: 'ഏപ്രിൽ' }, count: 38 },
      { month: { en: 'May', hi: 'मई', ml: 'മെയ്' }, count: 52 },
      { month: { en: 'Jun', hi: 'जून', ml: 'ജൂൺ' }, count: 46 },
      { month: { en: 'Jul', hi: 'जुलाई', ml: 'ജൂലൈ' }, count: 61 },
      { month: { en: 'Aug', hi: 'अगस्त', ml: 'ഓഗസ്റ്റ്' }, count: 57 },
      { month: { en: 'Sep', hi: 'सितंबर', ml: 'സെപ്റ്റംബർ' }, count: 34 },
    ] as { month: L; count: number }[],
  },

  achievements: [
    {
      title: { en: 'Best ASHA — Alathur Block', hi: 'सर्वश्रेष्ठ आशा — अलाथुर ब्लॉक', ml: 'മികച്ച ആശ — ആലത്തൂർ ബ്ലോക്ക്' },
      year: '2024',
      note: { en: 'Highest institutional delivery rate', hi: 'उच्चतम संस्थागत प्रसव दर', ml: 'ഏറ്റവും ഉയർന്ന ആശുപത്രി പ്രസവ നിരക്ക്' },
    },
    {
      title: { en: '100% Immunisation Ward', hi: '100% टीकाकरण वार्ड', ml: '100% പ്രതിരോധ കുത്തിവയ്പ്പ് വാർഡ്' },
      year: '2023',
      note: { en: 'Ward 7 full coverage, two years running', hi: 'वार्ड 7 पूर्ण कवरेज, लगातार दो वर्ष', ml: 'വാർഡ് 7 പൂർണ്ണ കവറേജ്, തുടർച്ചയായി രണ്ട് വർഷം' },
    },
    {
      title: { en: 'State Recognition — NCD Drive', hi: 'राज्य सम्मान — एनसीडी अभियान', ml: 'സംസ്ഥാന അംഗീകാരം — എൻസിഡി ഡ്രൈവ്' },
      year: '2022',
      note: { en: '1000+ screenings in a single year', hi: 'एक वर्ष में 1000+ स्क्रीनिंग', ml: 'ഒരു വർഷത്തിൽ 1000+ സ്ക്രീനിംഗ്' },
    },
    {
      title: { en: '10 Years of Service', hi: '10 वर्ष की सेवा', ml: '10 വർഷത്തെ സേവനം' },
      year: '2026',
      note: { en: 'Continuous service since 2016', hi: '2016 से निरंतर सेवा', ml: '2016 മുതൽ തുടർച്ചയായ സേവനം' },
    },
  ] as Achievement[],
}

/** No vowels and no 0/O/1/I lookalikes: codes stay unambiguous read aloud. */
const CODE_ALPHABET = '23456789BCDFGHJKLMNPQRSTVWXZ'

/** Stable 6-character verification code derived from the ASHA ID (FNV-1a). */
export function verifyCode(seed = profile.ashaId, len = 6) {
  let h = 2166136261
  for (const ch of seed) {
    h ^= ch.charCodeAt(0)
    h = Math.imul(h, 16777619)
  }
  let out = ''
  for (let i = 0; i < len; i++) {
    h = Math.imul(h ^ (h >>> 13), 1274126177)
    out += CODE_ALPHABET[Math.abs(h) % CODE_ALPHABET.length]
  }
  return out
}

/** Payload encoded into the QR ID card. */
export function qrPayload() {
  return `ASHA:${profile.ashaId}:${profile.name.en}:${profile.district}:${verifyCode()}`
}
