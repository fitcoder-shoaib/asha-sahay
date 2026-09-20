import type { L } from './types'
import type { VitalValues } from '../lib/vitals'

export type Visit = {
  date: string
  vitals: VitalValues
  symptoms: string[]
  notes: L
  urgent: boolean
}

export type Patient = {
  id: string
  name: L
  age: number
  gender: 'male' | 'female' | 'other'
  household: string
  visits: Visit[]
}

const v = (
  systolic: string, diastolic: string, pulse: string,
  temp: string, weight: string, spo2: string, sugar: string,
): VitalValues => ({ systolic, diastolic, pulse, temp, weight, spo2, sugar })

export const patients: Patient[] = [
  {
    id: 'p1',
    name: { en: 'Sarasamma K', hi: 'सरसम्मा के', ml: 'സരസമ്മ കെ' },
    age: 64, gender: 'female', household: 'HH-0412',
    visits: [
      {
        date: '2026-09-18',
        vitals: v('186', '118', '96', '98.4', '58', '96', '243'),
        symptoms: ['headache', 'dizziness', 'blurredVision'],
        notes: {
          en: 'BP very high on repeat reading. Advised immediate PHC visit, son informed.',
          hi: 'दोबारा जाँच में बीपी बहुत अधिक। तुरंत पीएचसी जाने की सलाह, पुत्र को सूचित किया।',
          ml: 'വീണ്ടും പരിശോധിച്ചപ്പോഴും ബിപി വളരെ ഉയർന്നത്. ഉടൻ പിഎച്ച്‌സിയിൽ പോകാൻ നിർദ്ദേശിച്ചു, മകനെ അറിയിച്ചു.',
        },
        urgent: true,
      },
      {
        date: '2026-08-21',
        vitals: v('158', '94', '84', '98.2', '58', '97', '198'),
        symptoms: ['headache'],
        notes: {
          en: 'On amlodipine. Reminded to take medicine daily.',
          hi: 'एम्लोडिपिन पर। प्रतिदिन दवा लेने की याद दिलाई।',
          ml: 'ആംലോഡിപ്പിൻ കഴിക്കുന്നു. ദിവസവും മരുന്ന് കഴിക്കാൻ ഓർമ്മിപ്പിച്ചു.',
        },
        urgent: false,
      },
    ],
  },
  {
    id: 'p2',
    name: { en: 'Nabeesa Beevi', hi: 'नबीसा बीवी', ml: 'നബീസ ബീവി' },
    age: 29, gender: 'female', household: 'HH-0377',
    visits: [
      {
        date: '2026-09-17',
        vitals: v('112', '74', '88', '98.6', '61', '98', '104'),
        symptoms: ['nausea'],
        notes: {
          en: '7 months pregnant. ANC on track, IFA tablets taken regularly.',
          hi: '7 माह की गर्भवती। एएनसी सही, आईएफए गोलियाँ नियमित।',
          ml: '7 മാസം ഗർഭിണി. എഎൻസി കൃത്യം, ഐഎഫ്എ ഗുളികകൾ പതിവായി കഴിക്കുന്നു.',
        },
        urgent: false,
      },
    ],
  },
  {
    id: 'p3',
    name: { en: 'Raman Nair', hi: 'रमन नायर', ml: 'രാമൻ നായർ' },
    age: 71, gender: 'male', household: 'HH-0298',
    visits: [
      {
        date: '2026-09-15',
        vitals: v('148', '88', '78', '98.1', '66', '91', '156'),
        symptoms: ['breathless', 'cough'],
        notes: {
          en: 'Low oxygen and breathlessness on exertion. Referred, family arranging transport.',
          hi: 'ऑक्सीजन कम और परिश्रम पर साँस फूलना। रेफर किया, परिवार वाहन की व्यवस्था कर रहा है।',
          ml: 'ഓക്സിജൻ കുറവും അധ്വാനിക്കുമ്പോൾ ശ്വാസംമുട്ടലും. റഫർ ചെയ്തു, കുടുംബം വാഹനം ഒരുക്കുന്നു.',
        },
        urgent: true,
      },
    ],
  },
  {
    id: 'p4',
    name: { en: 'Ayisha Rahman', hi: 'आयशा रहमान', ml: 'ആയിഷ റഹ്മാൻ' },
    age: 4, gender: 'female', household: 'HH-0451',
    visits: [
      {
        date: '2026-09-14',
        vitals: v('', '', '104', '100.8', '14', '97', ''),
        symptoms: ['fever', 'cough'],
        notes: {
          en: 'Mild fever, feeding well. ORS explained, review in two days.',
          hi: 'हल्का बुखार, दूध-भोजन ठीक। ओआरएस समझाया, दो दिन में पुनः जाँच।',
          ml: 'നേരിയ പനി, ഭക്ഷണം കഴിക്കുന്നുണ്ട്. ഒആർഎസ് വിശദീകരിച്ചു, രണ്ട് ദിവസത്തിനകം വീണ്ടും പരിശോധന.',
        },
        urgent: false,
      },
    ],
  },
  {
    id: 'p5',
    name: { en: 'Velayudhan P', hi: 'वेलायुधन पी', ml: 'വേലായുധൻ പി' },
    age: 58, gender: 'male', household: 'HH-0205',
    visits: [
      {
        date: '2026-09-11',
        vitals: v('134', '86', '80', '98.3', '72', '97', '182'),
        symptoms: ['thirst', 'frequentUrination'],
        notes: {
          en: 'Sugar trending up. Diet counselling given, repeat fasting test advised.',
          hi: 'शुगर बढ़ रही है। आहार परामर्श दिया, खाली पेट जाँच दोबारा कराने की सलाह।',
          ml: 'പഞ്ചസാര കൂടിവരുന്നു. ഭക്ഷണ കൗൺസിലിംഗ് നൽകി, വീണ്ടും ഫാസ്റ്റിംഗ് ടെസ്റ്റ് നിർദ്ദേശിച്ചു.',
        },
        urgent: false,
      },
    ],
  },
  {
    id: 'p6',
    name: { en: 'Kamala Devi', hi: 'कमला देवी', ml: 'കമല ദേവി' },
    age: 47, gender: 'female', household: 'HH-0330',
    visits: [
      {
        date: '2026-09-09',
        vitals: v('126', '82', '76', '98.0', '54', '98', '118'),
        symptoms: [],
        notes: {
          en: 'Routine NCD screening, all within range.',
          hi: 'नियमित एनसीडी स्क्रीनिंग, सब सामान्य सीमा में।',
          ml: 'പതിവ് എൻസിഡി സ്ക്രീനിംഗ്, എല്ലാം സാധാരണ പരിധിയിൽ.',
        },
        urgent: false,
      },
    ],
  },
]

/** Symptom checklist shown in step 3. */
export const SYMPTOMS: { id: string; label: L; danger: boolean }[] = [
  { id: 'chestPain', label: { en: 'Chest pain', hi: 'सीने में दर्द', ml: 'നെഞ്ചുവേദന' }, danger: true },
  { id: 'breathless', label: { en: 'Breathlessness', hi: 'साँस फूलना', ml: 'ശ്വാസംമുട്ടൽ' }, danger: true },
  { id: 'bleeding', label: { en: 'Heavy bleeding', hi: 'अत्यधिक रक्तस्राव', ml: 'കടുത്ത രക്തസ്രാവം' }, danger: true },
  { id: 'fits', label: { en: 'Fits / convulsions', hi: 'दौरे', ml: 'അപസ്മാരം' }, danger: true },
  { id: 'unconscious', label: { en: 'Loss of consciousness', hi: 'बेहोशी', ml: 'ബോധക്ഷയം' }, danger: true },
  { id: 'severeHeadache', label: { en: 'Severe headache', hi: 'तेज़ सिरदर्द', ml: 'കഠിനമായ തലവേദന' }, danger: true },

  { id: 'fever', label: { en: 'Fever', hi: 'बुखार', ml: 'പനി' }, danger: false },
  { id: 'cough', label: { en: 'Cough', hi: 'खाँसी', ml: 'ചുമ' }, danger: false },
  { id: 'headache', label: { en: 'Headache', hi: 'सिरदर्द', ml: 'തലവേദന' }, danger: false },
  { id: 'dizziness', label: { en: 'Dizziness', hi: 'चक्कर', ml: 'തലകറക്കം' }, danger: false },
  { id: 'blurredVision', label: { en: 'Blurred vision', hi: 'धुंधला दिखना', ml: 'കാഴ്ച മങ്ങൽ' }, danger: false },
  { id: 'nausea', label: { en: 'Nausea', hi: 'जी मिचलाना', ml: 'ഓക്കാനം' }, danger: false },
  { id: 'thirst', label: { en: 'Excessive thirst', hi: 'अत्यधिक प्यास', ml: 'അമിത ദാഹം' }, danger: false },
  { id: 'frequentUrination', label: { en: 'Frequent urination', hi: 'बार-बार पेशाब', ml: 'ഇടയ്ക്കിടെ മൂത്രമൊഴിക്കൽ' }, danger: false },
  { id: 'swelling', label: { en: 'Swelling in legs', hi: 'पैरों में सूजन', ml: 'കാലുകളിൽ നീർവീക്കം' }, danger: false },
  { id: 'weightLoss', label: { en: 'Unexplained weight loss', hi: 'अकारण वज़न घटना', ml: 'കാരണമില്ലാത്ത ഭാരക്കുറവ്' }, danger: false },
]

export const symptomById = (id: string) => SYMPTOMS.find((s) => s.id === id)

export const lastVisit = (p: Patient) => p.visits[0]
export const isUrgent = (p: Patient) => p.visits[0]?.urgent ?? false
