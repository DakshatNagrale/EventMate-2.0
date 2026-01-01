// src/pages/Login.jsx
import { useState } from "react"
import { Link } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"

export default function Login() {
  const { theme } = useTheme()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.password) newErrors.password = "Password is required"
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)
    try {
      // 🔗 BACKEND INTEGRATION POINT
      // Example: await axios.post("/api/login", formData)
      console.log("Login attempt:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // On success: redirect or set auth context
      // navigate("/dashboard")
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || "Login failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/30 flex items-center justify-center px-4">
      {/* Interactive Gradient Blobs Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full blur-3xl opacity-40 animate-blob-slow"
          style={{
            background: "radial-gradient(circle, #818cf8, #a78bfa, transparent)",
          }}
        />
        <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full blur-3xl opacity-30 animate-blob-medium"
          style={{
            background: "radial-gradient(circle, #c084fc, #e879f9, transparent)",
          }}
        />
        <div className="absolute top-[20%] left-[30%] w-[400px] h-[400px] rounded-full blur-3xl opacity-35 animate-blob-fast"
          style={{
            background: "radial-gradient(circle, #60a5fa, #818cf8, transparent)",
          }}
        />
      </div>

      {/* Subtle overlay for readability */}
      <div className="fixed inset-0 bg-gradient-to-t from-white/40 via-transparent to-white/20 dark:from-black/30 pointer-events-none -z-10" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Please enter your details to login
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="xyz@gmail.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Note: Admins, Organizers, Coordinators & Students login here. Access is provided by role after authentication.
          </p>

          {errors.submit && (
            <p className="text-sm text-red-600 text-center bg-red-50 dark:bg-red-900/30 py-2 rounded-lg">
              {errors.submit}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/90 dark:bg-gray-800/90 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <span className="text-lg">G</span>
              <span className="font-medium">Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <span className="text-lg">M</span>
              <span className="font-medium">Microsoft</span>
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Not a member yet?{" "}
          <Link
            to="/signup"
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes blob-slow {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          50% { transform: translate(80px, -80px) rotate(10deg); }
        }
        @keyframes blob-medium {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          50% { transform: translate(-60px, 100px) rotate(-15deg); }
        }
        @keyframes blob-fast {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(50px, -50px) scale(1.1); }
          66% { transform: translate(-40px, 60px) scale(0.9); }
        }

        .animate-blob-slow { animation: blob-slow 22s infinite ease-in-out; }
        .animate-blob-medium { animation: blob-medium 18s infinite ease-in-out; }
        .animate-blob-fast { animation: blob-fast 16s infinite ease-in-out; }
      `}</style>
    </div>
  )
}
