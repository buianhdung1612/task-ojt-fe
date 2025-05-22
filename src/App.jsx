import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { LayoutDefault } from './layouts/LayoutDefault'
import { UpComingPage } from './pages/Upcoming/Upcoming'
import { TodayPage } from './pages/Today/Today'
import { FiltersPage } from './pages/Filters/Filters'
import { ResultPage } from './pages/Result/Result'
import { LoginPage } from './pages/Login/Login'
import { RegisterPage } from './pages/Register/Register'
import { ProtectedRoute } from './components/Route/ProtectedRoute'
import { ToastContainer, toast } from 'react-toastify';

import Dashboard from './components/Admin/Dashboard'
import Layout from './components/AdminLayout/Layout'
import UserManagement from './components/Admin/UserManagement'
import ContentManagement from './components/Admin/ContentManagement'
import { createContext } from 'react'
import { FilterDetail } from './pages/Filters/FilterDetail'

export const ToastContext = createContext();

function App() {
  return (
    <>
      <ToastContext.Provider value={{
        toast
      }}>
        <BrowserRouter>
          <Routes>
            <Route element={<LayoutDefault />}>
              <Route path="/upcoming" element={<ProtectedRoute><UpComingPage /></ProtectedRoute>} />
              <Route path="/today" element={<ProtectedRoute><TodayPage /></ProtectedRoute>} />
              <Route path="/filters" element={<ProtectedRoute><FiltersPage /></ProtectedRoute>} />
              <Route path="/filters/detail" element={<ProtectedRoute><FilterDetail /></ProtectedRoute>} />
              <Route path="/search/result" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
            </Route>

            <Route element={<Layout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/content" element={<ContentManagement />} />
            </Route>

            <Route path='/users/login' element={<LoginPage />} />
            <Route path='/users/register' element={<RegisterPage />} />
          </Routes>
        </BrowserRouter >
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </ToastContext.Provider>
    </>
  )
}
export default App