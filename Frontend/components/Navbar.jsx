// src/components/Navbar.jsx
import { useState } from "react"
import { Link } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import { Sun, Moon, Menu, X } from "lucide-react"

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { to: "/", label: "Home" },
    { href: "#events", label: "Events" },
    { href: "#contact", label: "Contact us" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out">
      {/* Background with smooth blur & color transition */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-md dark:bg-gray-900/90 border-b border-gray-200/50 dark:border-gray-800 transition-all duration-700" />

      <nav className="relative max-w-7xl mx-auto px-6">
        <div className="flex h-20 items-center justify-between">

          {/* Left: Logo with scale & gradient animation */}
          <Link
            to="/"
            className="flex items-center group"
          >
            <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent 
              group-hover:from-indigo-700 group-hover:to-purple-700 
              transform group-hover:scale-105 transition-all duration-500 ease-out">
              EventMate
            </span>
          </Link>

          {/* Desktop Navigation - Animated underline on hover */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center gap-12">
              {navLinks.map((link) => {
                const isAnchor = link.href
                const Content = () =>
                  isAnchor ? (
                    <a
                      href={link.href}
                      className="relative text-gray-700 dark:text-gray-300 font-medium text-lg 
                        after:absolute after:bottom-[-8px] after:left-0 after:w-0 after:h-1 
                        after:bg-gradient-to-r after:from-indigo-600 after:to-purple-600 
                        after:rounded-full after:transition-all after:duration-500 
                        hover:after:w-full hover:text-indigo-600 dark:hover:text-indigo-400 
                        transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.to}
                      className="relative text-gray-700 dark:text-gray-300 font-medium text-lg 
                        after:absolute after:bottom-[-8px] after:left-0 after:w-0 after:h-1 
                        after:bg-gradient-to-r after:from-indigo-600 after:to-purple-600 
                        after:rounded-full after:transition-all after:duration-500 
                        hover:after:w-full hover:text-indigo-600 dark:hover:text-indigo-400 
                        transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  )

                return <Content key={link.label} />
              })}
            </div>
          </div>

          {/* Right: Actions with hover animations */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/login"
              className="text-gray-700 dark:text-gray-300 font-medium text-lg 
                hover:text-indigo-600 dark:hover:text-indigo-400 
                transform hover:scale-105 transition-all duration-300"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 
                hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-full 
                shadow-lg hover:shadow-2xl hover:shadow-purple-500/30 
                transform hover:-translate-y-1 hover:scale-105 
                transition-all duration-500 ease-out"
            >
              Sign Up
            </Link>

            {/* Theme Toggle with rotation animation */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 
                hover:bg-gray-200 dark:hover:bg-gray-700 
                transition-all duration-500 group"
              aria-label="Toggle theme"
            >
              <div className="transform group-hover:rotate-180 transition-transform duration-700">
                {theme === "light" ? (
                  <Moon size={22} className="text-gray-800" />
                ) : (
                  <Sun size={22} className="text-yellow-400" />
                )}
              </div>
            </button>
          </div>

          {/* Mobile: Theme + Hamburger */}
          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 group"
            >
              <div className="transform group-hover:rotate-180 transition-transform duration-700">
                {theme === "light" ? <Moon size={20} /> : <Sun size={20} className="text-yellow-400" />}
              </div>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              <div className="transform transition-transform duration-500">
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu - Slide down animation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800 shadow-2xl py-6 px-6 space-y-6">
            {navLinks.map((link) =>
              link.to ? (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-xl font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transform hover:translate-x-4 transition-all duration-300"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-xl font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transform hover:translate-x-4 transition-all duration-300"
                >
                  {link.label}
                </a>
              )
            )}

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-xl font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transform hover:translate-x-4 transition-all duration-300"
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
