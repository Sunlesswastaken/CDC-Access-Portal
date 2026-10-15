import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import RoleRoute from './components/RoleRoute.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import FacultyDashboard from './pages/FacultyDashboard.jsx'
import LoginPage from './pages/LoginPage.jsx'
import StudentDashboard from './pages/StudentDashboard.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <RoleRoute allow={['admin']}>
                <AdminDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/faculty"
            element={
              <RoleRoute allow={['faculty']}>
                <FacultyDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/student"
            element={
              <RoleRoute allow={['student']}>
                <StudentDashboard />
              </RoleRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
