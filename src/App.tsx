import { useEffect } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import './i18n'
import { RouteTracker } from './components/RouteTracker'
import { DEFAULT_LOCALE, getPreferredLocale } from './config/routes'
import { LandingPage } from './pages/LandingPage'
import { NotFoundPage } from './pages/NotFoundPage'

function RootRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    const preferredLocale = getPreferredLocale(window.navigator.language)
    navigate(`/${preferredLocale}`, { replace: true })
  }, [navigate])

  return null
}

export default function App() {
  return (
    <>
      <RouteTracker />
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/es" element={<LandingPage locale="es" />} />
        <Route path="/en" element={<LandingPage locale="en" />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to={`/${DEFAULT_LOCALE}`} replace />} />
      </Routes>
    </>
  )
}
