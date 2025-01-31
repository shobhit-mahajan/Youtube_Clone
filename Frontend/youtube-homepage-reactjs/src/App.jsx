import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import { HomePage } from './components/HomePage'
import Login from './components/Login'
import { AuthProvider } from './context/AuthContext'
import VideoWatch from './components/VideoWatch'
import ViewChannel from './components/ViewChannel'
import Signup from './components/Signup'

export const App = () => {
  return (
    <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/watch/:videoId" element={<VideoWatch />} />
        <Route path='/channel/:channelId' element={<ViewChannel/>} />
      </Routes>
    </AuthProvider>
    </BrowserRouter>
  )
}
