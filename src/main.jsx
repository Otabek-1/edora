import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Topics from './Topics.jsx'
import Topic from './Topic.jsx'
import Theme from './Theme.jsx'
import AdminLogin from './AdminLogin.jsx'
import AdminDashboard from './AdminDashboard.jsx'
import EditTheme from './editTheme.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/topics' element={<Topics />} />
      <Route path='/topics/:subjectId' element={<Topic />} />
      <Route path='/topics/:subjectId/:themeId' element={<Theme />} />
      <Route path='/admin' element={<AdminLogin />} />
      <Route path='/dashboard' element={<AdminDashboard />} />
      <Route path='/theme-edit/:themeId' element={<EditTheme />} />
    </Routes>
  </BrowserRouter>
)
