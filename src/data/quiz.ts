import type { L } from './types'

export type Question = {
  id: string
  topic: L
  q: L
  options: L[]
  answer: number
  why: L
}

export const STREAK = 12
export const POINTS_PER_CORRECT = 10

export const todaysQuestions: Question[] = [
  {
    id: 'q1',
    topic: { en: 'Maternal health', hi: 'मातृ स्वास्थ्य', ml: 'മാതൃ ആരോഗ്യം' },
    q: {
      en: 'How many antenatal check-ups are recommended during a normal pregnancy?',
      hi: 'सामान्य गर्भावस्था में कितनी प्रसव-पूर्व जाँच की सलाह दी जाती है?',
      ml: 'സാധാരണ ഗർഭകാലത്ത് എത്ര പ്രസവപൂർവ പരിശോധനകൾ ശുപാർശ ചെയ്യുന്നു?',
    },
    options: [
      { en: 'At least 2', hi: 'कम से कम 2', ml: 'കുറഞ്ഞത് 2' },
      { en: 'At least 4', hi: 'कम से कम 4', ml: 'കുറഞ്ഞത് 4' },
      { en: 'At least 6', hi: 'कम से कम 6', ml: 'കുറഞ്ഞത് 6' },
      { en: 'Only 1', hi: 'केवल 1', ml: 'ഒന്ന് മാത്രം' },
    ],
    answer: 1,
    why: {
      en: 'A minimum of 4 ANC visits is the national standard, with the first in the first trimester.',
      hi: 'न्यूनतम 4 एएनसी जाँच राष्ट्रीय मानक है, पहली जाँच पहली तिमाही में।',
      ml: 'കുറഞ്ഞത് 4 എഎൻസി പരിശോധനകൾ ദേശീയ മാനദണ്ഡമാണ്, ആദ്യത്തേത് ആദ്യ ത്രൈമാസത്തിൽ.',
    },
  },
  {
    id: 'q2',
    topic: { en: 'NCD screening', hi: 'एनसीडी स्क्रीनिंग', ml: 'എൻസിഡി സ്ക്രീനിംഗ്' },
    q: {
      en: 'A blood pressure reading of 150/95 mmHg falls into which category?',
      hi: '150/95 mmHg का रक्तचाप किस श्रेणी में आता है?',
      ml: '150/95 mmHg രക്തസമ്മർദ്ദം ഏത് വിഭാഗത്തിൽ വരും?',
    },
    options: [
      { en: 'Normal', hi: 'सामान्य', ml: 'സാധാരണം' },
      { en: 'Slightly raised, no action', hi: 'थोड़ा बढ़ा, कोई कार्रवाई नहीं', ml: 'ചെറുതായി ഉയർന്നത്, നടപടി വേണ്ട' },
      { en: 'High — refer for confirmation', hi: 'उच्च — पुष्टि हेतु रेफर करें', ml: 'ഉയർന്നത് — സ്ഥിരീകരണത്തിനായി റഫർ ചെയ്യുക' },
      { en: 'Low blood pressure', hi: 'निम्न रक्तचाप', ml: 'കുറഞ്ഞ രക്തസമ്മർദ്ദം' },
    ],
    answer: 2,
    why: {
      en: 'Anything at or above 140/90 is raised. Repeat the reading and refer for confirmation.',
      hi: '140/90 या उससे अधिक बढ़ा हुआ माना जाता है। दोबारा जाँचें और पुष्टि हेतु रेफर करें।',
      ml: '140/90 ഓ അതിനു മുകളിലോ ഉള്ളത് ഉയർന്നതാണ്. വീണ്ടും പരിശോധിച്ച് സ്ഥിരീകരണത്തിനായി റഫർ ചെയ്യുക.',
    },
  },
  {
    id: 'q3',
    topic: { en: 'Immunisation', hi: 'टीकाकरण', ml: 'പ്രതിരോധ കുത്തിവയ്പ്പ്' },
    q: {
      en: 'At what age is the measles-rubella (MR) first dose given?',
      hi: 'खसरा-रूबेला (एमआर) की पहली खुराक किस आयु में दी जाती है?',
      ml: 'മീസിൽസ്-റുബെല്ല (എംആർ) ആദ്യ ഡോസ് ഏത് പ്രായത്തിലാണ് നൽകുന്നത്?',
    },
    options: [
      { en: 'At birth', hi: 'जन्म के समय', ml: 'ജനന സമയത്ത്' },
      { en: '6 weeks', hi: '6 सप्ताह', ml: '6 ആഴ്ച' },
      { en: '9–12 months', hi: '9–12 माह', ml: '9–12 മാസം' },
      { en: '5 years', hi: '5 वर्ष', ml: '5 വയസ്സ്' },
    ],
    answer: 2,
    why: {
      en: 'MR-1 is given at 9–12 months; the second dose follows at 16–24 months.',
      hi: 'एमआर-1 9–12 माह पर दी जाती है; दूसरी खुराक 16–24 माह पर।',
      ml: 'എംആർ-1 9–12 മാസത്തിൽ നൽകുന്നു; രണ്ടാം ഡോസ് 16–24 മാസത്തിൽ.',
    },
  },
  {
    id: 'q4',
    topic: { en: 'Newborn danger signs', hi: 'नवजात खतरे के संकेत', ml: 'നവജാത അപകട സൂചനകൾ' },
    q: {
      en: 'Which of these is a danger sign in a newborn needing immediate referral?',
      hi: 'इनमें से कौन नवजात में तुरंत रेफरल का खतरे का संकेत है?',
      ml: 'ഇവയിൽ ഉടൻ റഫറൽ വേണ്ട നവജാത ശിശുവിലെ അപകട സൂചന ഏതാണ്?',
    },
    options: [
      { en: 'Sneezing occasionally', hi: 'कभी-कभी छींकना', ml: 'ഇടയ്ക്ക് തുമ്മൽ' },
      { en: 'Not feeding at all', hi: 'बिल्कुल दूध न पीना', ml: 'ഒട്ടും മുലകുടിക്കാതിരിക്കൽ' },
      { en: 'Passing urine 6 times a day', hi: 'दिन में 6 बार पेशाब', ml: 'ദിവസം 6 തവണ മൂത്രമൊഴിക്കൽ' },
      { en: 'Sleeping 16 hours a day', hi: 'दिन में 16 घंटे सोना', ml: 'ദിവസം 16 മണിക്കൂർ ഉറക്കം' },
    ],
    answer: 1,
    why: {
      en: 'Refusal to feed is a key danger sign, along with fever, fast breathing and convulsions.',
      hi: 'दूध न पीना मुख्य खतरे का संकेत है, साथ ही बुखार, तेज़ साँस और दौरे।',
      ml: 'മുലകുടിക്കാൻ വിസമ്മതിക്കുന്നത് പ്രധാന അപകട സൂചനയാണ്, പനി, വേഗത്തിലുള്ള ശ്വാസം, അപസ്മാരം എന്നിവയോടൊപ്പം.',
    },
  },
  {
    id: 'q5',
    topic: { en: 'Nutrition', hi: 'पोषण', ml: 'പോഷണം' },
    q: {
      en: 'Exclusive breastfeeding is recommended for how long after birth?',
      hi: 'जन्म के बाद कितने समय तक केवल स्तनपान की सलाह दी जाती है?',
      ml: 'ജനനശേഷം എത്ര കാലം മുലപ്പാൽ മാത്രം നൽകാൻ ശുപാർശ ചെയ്യുന്നു?',
    },
    options: [
      { en: '3 months', hi: '3 माह', ml: '3 മാസം' },
      { en: '6 months', hi: '6 माह', ml: '6 മാസം' },
      { en: '9 months', hi: '9 माह', ml: '9 മാസം' },
      { en: '12 months', hi: '12 माह', ml: '12 മാസം' },
    ],
    answer: 1,
    why: {
      en: 'Only breast milk for the first 6 months — no water. Complementary feeding starts at 6 months.',
      hi: 'पहले 6 माह केवल स्तनपान — पानी भी नहीं। ऊपरी आहार 6 माह से शुरू।',
      ml: 'ആദ്യ 6 മാസം മുലപ്പാൽ മാത്രം — വെള്ളം പോലും വേണ്ട. അനുബന്ധ ഭക്ഷണം 6 മാസത്തിൽ തുടങ്ങുന്നു.',
    },
  },
]
