import Login from './components/Login'
import PrivacyPolicy from './pages/PrivacyPolicy'
import { Routes, Route, Navigate } from "react-router";

function App() {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Routes>
        <Route path="/" element={<Navigate to="/privacy" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
      
    </div>
  )
}

export default App
