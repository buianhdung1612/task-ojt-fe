import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Admin/Dashboard'
import Layout from './components/layout'
import UserManagement from './components/Admin/UserManagement'
import ContentManagement from './components/Admin/ContentManagement'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/content" element={<ContentManagement />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
