// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

import Landing from "./pages/Landing"
import Hackathon from "./pages/Hackathon"
import Login from "./pages/Login"
import Signup from "./pages/Signup"

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-white dark:from-gray-900 dark:via-purple-900/20 dark:to-black transition-colors duration-500">
      <Navbar />
      
      <main className="flex-1">
        <Outlet /> {/* This renders the current page */}
      </main>
      
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* All pages that use Navbar + Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/hackathon" element={<Hackathon />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Add future pages without layout here if needed */}
        {/* <Route path="/admin/*" element={<AdminLayout />} /> */}
      </Routes>
    </Router>
  )
}