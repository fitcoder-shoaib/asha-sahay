import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth'
import { I18nProvider } from './i18n'
import PhoneFrame from './components/PhoneFrame'
import TabsLayout from './components/TabsLayout'

import Home from './screens/Home'
import Calendar from './screens/Calendar'
import Visits from './screens/Visits'
import VisitForm from './screens/VisitForm'
import VisitDetail from './screens/VisitDetail'
import Quiz from './screens/Quiz'
import QuizPlay from './screens/QuizPlay'
import QuizResult from './screens/QuizResult'
import Profile from './screens/Profile'
import Certificate from './screens/Certificate'
import QrId from './screens/QrId'
import ScanQr from './screens/ScanQr'
import Sos from './screens/Sos'
import Settings from './screens/Settings'
import Redeem from './screens/Redeem'
import Welcome from './screens/Welcome'
import Login from './screens/Login'
import Register from './screens/Register'

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <BrowserRouter>
          <PhoneFrame>
            <Shell />
          </PhoneFrame>
        </BrowserRouter>
      </AuthProvider>
    </I18nProvider>
  )
}

/** Signed-out visitors only ever see welcome / login / register. */
function Shell() {
  const { signedIn } = useAuth()

  if (!signedIn) {
    return (
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
            <Route element={<TabsLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/visits" element={<Visits />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="/visits/new" element={<VisitForm />} />
            <Route path="/visits/:id" element={<VisitDetail />} />
            <Route path="/quiz/play" element={<QuizPlay />} />
            <Route path="/quiz/result" element={<QuizResult />} />
            <Route path="/profile/certificate" element={<Certificate />} />
            <Route path="/profile/qr" element={<QrId />} />
            <Route path="/scan" element={<ScanQr />} />
            <Route path="/sos" element={<Sos />} />
            <Route path="/settings" element={<Settings />} />
      <Route path="/redeem" element={<Redeem />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
