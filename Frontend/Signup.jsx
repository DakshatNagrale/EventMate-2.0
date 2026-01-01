import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  })

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
  }

  const parallaxX = (mousePosition.x - window.innerWidth / 2) / 50
  const parallaxY = (mousePosition.y - window.innerHeight / 2) / 50

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 relative overflow-hidden">

      {/* Interactive Animated Gradient Blobs Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] top-[-200px] left-[-200px] rounded-full opacity-50 blur-3xl animate-blob-slow"
          style={{
            background: "linear-gradient(135deg, #a78bfa, #818cf8, #c084fc)",
            transform: `translate(${parallaxX * 1.5}px, ${parallaxY * 1.5}px)`,
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] bottom-[-100px] right-[-100px] rounded-full opacity-40 blur-3xl animate-blob-medium"
          style={{
            background: "linear-gradient(120deg, #f472b6, #ec4899, #d946ef)",
            transform: `translate(${parallaxX * -1.2}px, ${parallaxY * -1.2}px)`,
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] top-[20%] left-[30%] rounded-full opacity-30 blur-3xl animate-blob-fast"
          style={{
            background: "linear-gradient(90deg, #60a5fa, #3b82f6, #818cf8)",
            transform: `translate(${parallaxX}px, ${parallaxY}px)`,
          }}
        />
        <div
          className="absolute w-[700px] h-[700px] top-[50%] right-[10%] rounded-full opacity-20 blur-3xl animate-blob-slow-reverse"
          style={{
            background: "linear-gradient(45deg, #c084fc, #a855f7, #e879f9)",
            transform: `translate(${parallaxX * -0.8}px, ${parallaxY * -0.8}px)`,
          }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-white/20 pointer-events-none" />

      {/* Content */}
      <section className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 px-6 py-10 items-center min-h-screen">

        {/* ================= LEFT CONTENT ================= */}
        <div className="space-y-8"> {/* Increased spacing for better rhythm */}

          {/* Back Link + Badge aligned in a flex row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-700 transition"
            >
              <ArrowLeft size={16} /> Back
            </Link>

            {/* Fixed: Properly aligned badge */}
            <span className="inline-block px-5 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
              Join the Community
            </span>
          </div>

          <div>
            <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight text-gray-900">
              Manage Campus <br />
              Events Like a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Pro.
              </span>
            </h1>

            <p className="mt-6 text-gray-700 max-w-md leading-relaxed text-lg">
              EventMate connects students and organizers. Discover, plan, and
              attend the best events happening on your campus today.
            </p>
          </div>
        </div>

        {/* ================= RIGHT CARD ================= */}
        <div className="flex justify-center lg:justify-end animate-slideUp">
          <div className="w-full max-w-[420px] bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-3xl transition duration-500 border border-white/20">

            <div className="h-1 rounded-t-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Student Registration
              </h2>

              <p className="text-sm text-gray-600 mt-2">
                Only students can self-register. Organizers are registered by Admin.
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Join EventMate to start your journey.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="xyz@gmail.com"
                    required
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    name="agree"
                    checked={formData.agree}
                    onChange={handleChange}
                    className="w-4 h-4 rounded accent-indigo-600"
                  />
                  <span>
                    I agree to the{" "}
                    <span className="text-indigo-600 font-medium hover:underline cursor-pointer">
                      Terms
                    </span>{" "}
                    and{" "}
                    <span className="text-indigo-600 font-medium hover:underline cursor-pointer">
                      Privacy Policy
                    </span>
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3.5 rounded-xl font-semibold transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Sign Up
                </button>
              </form>

              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="px-4 text-xs text-gray-500 font-medium">
                  Already have an account?
                </span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>

              <p className="text-center">
                <Link
                  to="/login"
                  className="text-indigo-600 font-semibold hover:underline text-base"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

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
        @keyframes blob-slow-reverse {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          50% { transform: translate(-100px, 80px) rotate(-8deg); }
        }

        .animate-blob-slow { animation: blob-slow 20s infinite ease-in-out; }
        .animate-blob-medium { animation: blob-medium 18s infinite ease-in-out; }
        .animate-blob-fast { animation: blob-fast 15s infinite ease-in-out; }
        .animate-blob-slow-reverse { animation: blob-slow-reverse 25s infinite ease-in-out; }

        .animate-fadeIn { animation: fadeIn 1s ease-out; }
        .animate-slideUp { animation: slideUp 0.8s ease-out; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  )
}