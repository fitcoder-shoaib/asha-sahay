# ASHA Sahay — clickable prototype

A mobile app concept for **ASHA workers** (India's accredited social health activists).
This is a **clickable prototype for a project submission**, not a production app: every screen
navigates and the important interactions respond, but all data is fixed mock data and nothing is
saved to a server.

Runs as a web app rendered inside a phone frame, so it needs no Android SDK or device setup.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Open the printed URL (usually `http://localhost:5173`). On a desktop browser the app appears inside
a phone mockup; open the same URL on a phone over Wi-Fi and it fills the screen instead.

To produce a static build for hosting or submission:

```bash
npm run build
```

## Deploying to Netlify

`netlify.toml` already pins the build command, the publish directory and the Node version, so
Netlify needs no manual configuration. It also adds the SPA redirect — without it every route
except `/` would 404 on refresh or on a shared deep link, because routing happens in the browser.

1. **GitHub Desktop** → *File → Add local repository* → pick this folder (it is already a git
   repository on `main`), then **Publish repository**.
   `node_modules` and `dist` are gitignored, so only source goes up.
2. **Netlify** → *Add new site → Import an existing project → GitHub* → pick the repo.
   The build settings come from `netlify.toml`; just confirm and deploy.
3. Every push to the default branch redeploys automatically.

## The five features

| # | Feature | What actually works |
|---|---------|---------------------|
| 1 | **Payment calendar** | Screen split 50/50 horizontally — month grid on top, written payment list below. Coloured dots per day for upcoming / pending / in-process / received. Tapping a day refilters the list; month arrows; status filter chips; tapping a payment expands its units x rate breakdown. A **monthly salary strip** shows each month as paid (green), pending (orange) or delayed (red); tapping a month jumps the calendar to it. |
| 2 | **Profile & digital ID** | Joining date with live years-of-service, service-history timeline (newest first), a collapsible trainings list, NCD screening totals + 6-month chart, achievement badges. A **real QR code** encodes the ASHA ID; the **Scan** screen resolves it to a verified ID card. Plus a formatted **Digital Service Certificate** with a verification code. |
| 3 | **Daily quiz** | 5 questions, one per screen, four options each. Real scoring with instant right/wrong feedback and a one-line explanation, then a result screen. The Quiz tab shows the **points balance** and its cash value, and links to **Redeem points** — pick an amount, with options you cannot afford greyed out and the shortfall spelled out. |
| 4 | **Home visit checkup** | Patient list with urgent flags, then a 4-step form: patient -> vitals -> symptoms -> referral. **Every field is compulsory** before Next; empty ones are marked in red. Vitals are colour-graded live against clinical thresholds, and the **"Does this patient need urgent checkup?"** answer is pre-selected from those vitals and danger signs — always overridable, with the triggering readings listed. Existing visits can be **edited**, which prefills the whole form. |
| 5 | **SOS** | Red button pinned top-right on every screen. **Press and hold 2 seconds** — a ring fills with a countdown and haptic ticks; releasing early cancels. On completion, a full-screen alert notifies the **police** and the worker's **emergency contact** (set in Settings), with a cancel button. |

## Navigation

Five bottom tabs, plus a **hamburger menu (top left)** that mirrors those tabs and adds the two
destinations with no room on the bar: Redeem points and Settings.

**Settings** covers language, notifications, privacy & security, emergency contact, help & about,
and log out. Toggles are live but not persisted.

## Languages

English, हिन्दी and മലയാളം, switchable from Settings or the Profile screen. Every user-facing string, including
all mock data, exists in all three. The choice is remembered across reloads.

## Tech

React 19 + TypeScript + Vite. Routing via `react-router-dom`, QR generation via `qrcode.react`,
icons via `lucide-react`. No backend, no network calls.

```
src/
  screens/      one file per screen (incl. Settings, Redeem)
  components/   AppHeader, SosButton, TabBar, DrawerMenu, StatusChip, VitalField, PhoneFrame
  data/         mock payments, salary, patients, quiz bank, rewards, profile — all trilingual
  lib/          vitals.ts (triage thresholds), date.ts, template.tsx
  i18n/         en.ts, hi.ts, ml.ts + useT() hook
  theme.ts      design tokens (mirrored as CSS variables in styles.css)
```

Folder and component names deliberately mirror a React Native app, so porting to Expo later is a
rewrite of the rendering layer rather than a redesign.

## What is mocked

- All data is seeded in `src/data/`. Nothing persists — the only thing saved is your language choice.
- The QR **scanner** is simulated (no camera feed). The QR **generator** produces a genuinely
  scannable code.
- SOS sends no real alerts; no SMS, no calls, no location permission.
- Payment schemes, amounts, training names and quiz questions are realistic but invented.
- The worker, patients and phone numbers are fictional. Numbers use a repeated-digit placeholder
  pattern so nothing on the deployed site resolves to a real person.
- "Today" is pinned to 20 September 2026 in `src/lib/date.ts` so the seeded data always lines up.

## Clinical thresholds

`src/lib/vitals.ts` holds the triage rules driving the urgent-referral suggestion — BP ≥ 140/90
raised and ≥ 180/120 urgent, SpO₂ < 94 urgent, temperature ≥ 102°F urgent, and so on. Direction
(low / elevated / high) names the reading; urgency drives the colour, so an urgent reading shows red
whichever way it went. The app only ever *suggests* — the worker makes the call.
