import Login from './components/Login'
import PrivacyPolicy from './pages/PrivacyPolicy'
import { Routes, Route } from "react-router";

function App() {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
      
    </div>
  )
}

export default App
