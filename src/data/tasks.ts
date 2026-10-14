import type { L } from './types'

export type TaskKind = 'visit' | 'immunisation' | 'anc' | 'ncd' | 'meeting' | 'record'
export type Priority = 'high' | 'normal'

export type Task = {
  id: string
  kind: TaskKind
  /** Scheduled slot, 24h. Sorted by this. */
  time: string
  title: L
  /** The actual instruction — what to carry, what to check, who to tell. */
  detail: L
  who: L
  where: L
  priority: Priority
  done: boolean
}

export const tasks: Task[] = [
  {
    id: 't1',
    kind: 'visit',
    time: '08:30',
    priority: 'high',
    done: true,
    title: { en: 'Recheck BP — Sarasamma K', hi: 'बीपी दोबारा जाँचें — सरसम्मा के', ml: 'ബിപി വീണ്ടും പരിശോധിക്കുക — സരസമ്മ കെ' },
    who: { en: 'Sarasamma K, 64', hi: 'सरसम्मा के, 64', ml: 'സരസമ്മ കെ, 64' },
    where: { en: 'Thekkeveedu, Ward 7', hi: 'थेक्केवीडु, वार्ड 7', ml: 'തെക്കേവീട്, വാർഡ് 7' },
    detail: {
      en: 'BP was 186/118 at her last visit and she was referred. Confirm she reached the PHC, take a fresh reading after 5 minutes rest, and check she has her amlodipine strip.',
      hi: 'पिछले भ्रमण में बीपी 186/118 था और रेफर किया गया। पुष्टि करें कि वे पीएचसी पहुँचीं, 5 मिनट आराम के बाद दोबारा जाँचें, और एम्लोडिपिन की पत्ती देखें।',
      ml: 'കഴിഞ്ഞ സന്ദർശനത്തിൽ ബിപി 186/118 ആയിരുന്നു, റഫർ ചെയ്തു. പിഎച്ച്‌സിയിൽ എത്തിയോ എന്ന് ഉറപ്പാക്കുക, 5 മിനിറ്റ് വിശ്രമശേഷം വീണ്ടും പരിശോധിക്കുക, ആംലോഡിപ്പിൻ ഗുളിക ഉണ്ടോയെന്ന് നോക്കുക.',
    },
  },
  {
    id: 't2',
    kind: 'anc',
    time: '09:30',
    priority: 'normal',
    done: true,
    title: { en: 'ANC visit — 7th month', hi: 'एएनसी भ्रमण — 7वाँ माह', ml: 'എഎൻസി സന്ദർശനം — 7-ാം മാസം' },
    who: { en: 'Nabeesa Beevi, 29', hi: 'नबीसा बीवी, 29', ml: 'നബീസ ബീവി, 29' },
    where: { en: 'Puthanpurayil, Ward 8', hi: 'पुथनपुरयिल, वार्ड 8', ml: 'പുത്തൻപുരയിൽ, വാർഡ് 8' },
    detail: {
      en: 'Weigh her, check BP and swelling in feet. Confirm IFA tablets are being taken daily and count the strip. Remind her of the scan appointment at the PHC later this week.',
      hi: 'वज़न लें, बीपी और पैरों की सूजन देखें। आईएफए गोलियाँ प्रतिदिन ली जा रही हैं, पत्ती गिनें। इसी सप्ताह पीएचसी में होने वाले स्कैन की याद दिलाएँ।',
      ml: 'ഭാരം നോക്കുക, ബിപിയും കാലിലെ നീരും പരിശോധിക്കുക. ഐഎഫ്എ ഗുളിക ദിവസവും കഴിക്കുന്നുണ്ടോയെന്ന് ഉറപ്പാക്കി എണ്ണം നോക്കുക. ഈ ആഴ്ച പിഎച്ച്‌സിയിലെ സ്കാൻ ഓർമ്മിപ്പിക്കുക.',
    },
  },
  {
    id: 't3',
    kind: 'immunisation',
    time: '11:00',
    priority: 'high',
    done: false,
    title: { en: 'Immunisation session — Anganwadi 3', hi: 'टीकाकरण सत्र — आंगनवाड़ी 3', ml: 'പ്രതിരോധ കുത്തിവയ്പ്പ് — അങ്കണവാടി 3' },
    who: { en: '6 children due', hi: '6 बच्चे देय', ml: '6 കുട്ടികൾ' },
    where: { en: 'Anganwadi 3, Ward 7', hi: 'आंगनवाड़ी 3, वार्ड 7', ml: 'അങ്കണവാടി 3, വാർഡ് 7' },
    detail: {
      en: 'Carry the due list and MCP cards. Four MR-1 doses and two Penta-3 are due. Reach 30 minutes early to receive the vaccine carrier from the ANM and check the ice packs.',
      hi: 'देय सूची और एमसीपी कार्ड ले जाएँ। चार एमआर-1 और दो पेंटा-3 देय हैं। एएनएम से वैक्सीन कैरियर लेने और आइस पैक जाँचने हेतु 30 मिनट पहले पहुँचें।',
      ml: 'ലിസ്റ്റും എംസിപി കാർഡുകളും കൊണ്ടുപോകുക. നാല് എംആർ-1, രണ്ട് പെന്റ-3 ഡോസുകൾ വേണം. എഎൻഎമ്മിൽ നിന്ന് വാക്സിൻ കാരിയർ വാങ്ങാനും ഐസ് പാക്ക് പരിശോധിക്കാനും 30 മിനിറ്റ് നേരത്തെ എത്തുക.',
    },
  },
  {
    id: 't4',
    kind: 'ncd',
    time: '14:00',
    priority: 'normal',
    done: false,
    title: { en: 'NCD screening — 8 households', hi: 'एनसीडी स्क्रीनिंग — 8 परिवार', ml: 'എൻസിഡി സ്ക്രീനിംഗ് — 8 കുടുംബങ്ങൾ' },
    who: { en: 'Adults over 30, Ward 6', hi: '30 से अधिक आयु के वयस्क, वार्ड 6', ml: '30 വയസ്സിന് മുകളിലുള്ളവർ, വാർഡ് 6' },
    where: { en: 'Ward 6, east lane', hi: 'वार्ड 6, पूर्वी गली', ml: 'വാർഡ് 6, കിഴക്കേ വഴി' },
    detail: {
      en: 'Fill a CBAC form for each adult over 30. Record BP and random blood sugar. Anyone at 140/90 or above gets a repeat reading before you mark them for referral.',
      hi: '30 से अधिक आयु के प्रत्येक वयस्क का सीबीएसी फॉर्म भरें। बीपी और रैंडम शुगर दर्ज करें। 140/90 या अधिक वालों की दोबारा जाँच के बाद ही रेफरल चिह्नित करें।',
      ml: '30 വയസ്സിന് മുകളിലുള്ള ഓരോരുത്തർക്കും സിബിഎസി ഫോം പൂരിപ്പിക്കുക. ബിപിയും റാൻഡം ഷുഗറും രേഖപ്പെടുത്തുക. 140/90 ഓ അതിനു മുകളിലോ ഉള്ളവരെ വീണ്ടും പരിശോധിച്ച ശേഷമേ റഫറലിന് അടയാളപ്പെടുത്താവൂ.',
    },
  },
  {
    id: 't5',
    kind: 'visit',
    time: '16:00',
    priority: 'high',
    done: false,
    title: { en: 'Follow-up — Raman Nair', hi: 'फ़ॉलो-अप — रमन नायर', ml: 'തുടർ സന്ദർശനം — രാമൻ നായർ' },
    who: { en: 'Raman Nair, 71', hi: 'रमन नायर, 71', ml: 'രാമൻ നായർ, 71' },
    where: { en: 'Nair Madom, Ward 7', hi: 'नायर मडोम, वार्ड 7', ml: 'നായർ മഠം, വാർഡ് 7' },
    detail: {
      en: 'SpO2 was 91 and he was referred at the last visit. Check whether the family arranged transport. If he is still at home and breathless at rest, call the ambulance yourself.',
      hi: 'पिछले भ्रमण में ऑक्सीजन 91 था और रेफर किया गया। देखें कि परिवार ने वाहन की व्यवस्था की या नहीं। यदि वे अब भी घर पर हैं और आराम में भी साँस फूल रही है, तो स्वयं एम्बुलेंस बुलाएँ।',
      ml: 'കഴിഞ്ഞ സന്ദർശനത്തിൽ ഓക്സിജൻ 91 ആയിരുന്നു, റഫർ ചെയ്തു. കുടുംബം വാഹനം ഒരുക്കിയോ എന്ന് നോക്കുക. ഇപ്പോഴും വീട്ടിലാണെങ്കിലും വിശ്രമത്തിലും ശ്വാസംമുട്ടലുണ്ടെങ്കിൽ സ്വയം ആംബുലൻസ് വിളിക്കുക.',
    },
  },
  {
    id: 't6',
    kind: 'record',
    time: '18:30',
    priority: 'normal',
    done: false,
    title: { en: 'Update register and submit claims', hi: 'रजिस्टर अद्यतन कर दावे जमा करें', ml: 'രജിസ്റ്റർ പുതുക്കി ക്ലെയിം സമർപ്പിക്കുക' },
    who: { en: 'Own records', hi: 'स्वयं के अभिलेख', ml: 'സ്വന്തം രേഖകൾ' },
    where: { en: 'At home', hi: 'घर पर', ml: 'വീട്ടിൽ' },
    detail: {
      en: "Enter today's visits in the ASHA register, then submit the VHSND and NCD screening claims. Last month's claim was rejected for a missing date, so check every entry has one.",
      hi: 'आज के भ्रमण आशा रजिस्टर में दर्ज करें, फिर वीएचएसएनडी और एनसीडी स्क्रीनिंग के दावे जमा करें। पिछले माह का दावा दिनांक न होने से अस्वीकृत हुआ था — हर प्रविष्टि में दिनांक जाँचें।',
      ml: 'ഇന്നത്തെ സന്ദർശനങ്ങൾ ആശ രജിസ്റ്ററിൽ ചേർക്കുക, തുടർന്ന് വിഎച്ച്എസ്എൻഡി, എൻസിഡി ക്ലെയിമുകൾ സമർപ്പിക്കുക. കഴിഞ്ഞ മാസത്തെ ക്ലെയിം തീയതി ഇല്ലാത്തതിനാൽ നിരസിച്ചു — എല്ലാ എൻട്രിയിലും തീയതി ഉണ്ടെന്ന് ഉറപ്പാക്കുക.',
    },
  },
]

export const kindLabel: Record<TaskKind, L> = {
  visit: { en: 'Home visit', hi: 'गृह भ्रमण', ml: 'ഭവന സന്ദർശനം' },
  immunisation: { en: 'Immunisation', hi: 'टीकाकरण', ml: 'പ്രതിരോധ കുത്തിവയ്പ്പ്' },
  anc: { en: 'Antenatal care', hi: 'प्रसव-पूर्व देखभाल', ml: 'പ്രസവപൂർവ പരിചരണം' },
  ncd: { en: 'NCD screening', hi: 'एनसीडी स्क्रीनिंग', ml: 'എൻസിഡി സ്ക്രീനിംഗ്' },
  meeting: { en: 'Meeting', hi: 'बैठक', ml: 'യോഗം' },
  record: { en: 'Records', hi: 'अभिलेख', ml: 'രേഖകൾ' },
}
