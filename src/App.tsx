import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Contact from './pages/Contact'
import JoinLayout from './pages/Join/JoinLayout'
import Join from './pages/Join/Join'
import Signup from './pages/Join/Signup'
import Welcome from './pages/Join/Welcome'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      <Route element={<JoinLayout />}>
        <Route path="/join" element={<Join />} />
        <Route path="/join/signup" element={<Signup />} />
        <Route path="/join/welcome" element={<Welcome />} />
      </Route>
    </Routes>
  )
}

export default App
