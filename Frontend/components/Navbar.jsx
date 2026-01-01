// src/components/ContactUs.jsx
import { useState } from "react"

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [status, setStatus] = useState({ type: "", message: "" })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (status.message) setStatus({ type: "", message: "" })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: "error", message: "Please fill in all fields." })
      return
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setStatus({ type: "error", message: "Please enter a valid email address." })
      return
    }

    setIsLoading(true)
    setStatus({ type: "", message: "" })

    try {
      // 🔗 BACKEND INTEGRATION POINT
      // await axios.post("/api/contact", formData)

      await new Promise(resolve => setTimeout(resolve, 1500))

      setStatus({
        type: "success",
        message: "Thank you! Your message has been sent successfully. We'll get back to you soon."
      })
      setFormData({ name: "", email: "", message: "" })
    } catch (error) {
      setStatus({
        type: "error",
        message: "Oops! Something went wrong. Please try again later."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left: Contact Info (No extra paragraphs) */}
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              Let's Connect
            </h3>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-2xl">
                  📧
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Email</p>
                  <p className="text-gray-600 dark:text-gray-400">support@eventmate.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center text-2xl">
                  📱
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Phone</p>
                  <p className="text-gray-600 dark:text-gray-400">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center text-2xl">
                  📍
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Location</p>
                  <p className="text-gray-600 dark:text-gray-400">Campus Main Building, Room 101</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-200/50 dark:border-gray-700/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  rows="5"
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none resize-none transition"
                />
              </div>

              {status.message && (
                <div className={`p-4 rounded-xl text-center font-medium ${
                  status.type === "success"
                    ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                    : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                }`}>
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending Message..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
