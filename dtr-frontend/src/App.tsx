import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ProtectedRoute from './routes/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import AttendancePage from './pages/AttendancePage'
import HistoryPage from './pages/HistoryPage'
import AdminAttendancePage from './pages/AdminAttendancePage'

function App() {
  return(
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>

              <Route
                path="/dashboard"
                element={<DashboardPage />}
              />

              <Route
                path="/attendance"
                element={<AttendancePage />}
              />

              <Route
                path="/history"
                element={<HistoryPage />}
              />

              <Route
                path="/admin/attendance"
                element={<AdminAttendancePage />} 
              />

            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App