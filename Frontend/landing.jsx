// src/pages/Landing.jsx
import { Link } from "react-router-dom"
import ContactUs from "../components/ContactUs"

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/30 via-white to-purple-50/30 dark:from-gray-900 dark:via-purple-900/10 dark:to-indigo-900/10">

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center">
        <span className="inline-block bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-6 py-2 rounded-full text-sm font-semibold mb-8">
          ✦ Simplifying Campus Life
        </span>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight">
          Manage Campus Events <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Seamlessly
          </span>
        </h1>

        <p className="mt-8 max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300">
          The all-in-one platform for students and organizers. Discover events, register instantly, check-in with QR codes, and earn digital certificates.
        </p>

        <Link
          to="/signup"
          className="inline-block mt-12 px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg font-semibold rounded-full shadow-2xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300"
        >
          Get Started →
        </Link>
      </section>

      {/* How EventMate Works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider text-sm">
            How It Works
          </p>
          <h2 className="text-4xl font-extrabold mt-4 text-gray-900 dark:text-white">
            How EventMate Works
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Three simple steps to discover, register, and attend campus events
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg text-center">
            <div className="w-20 h-20 mx-auto bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-4xl mb-6">
              🔍
            </div>
            <h3 className="text-2xl font-bold mb-4">Discover Events</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Browse all upcoming campus events with full details.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg text-center">
            <div className="w-20 h-20 mx-auto bg-purple-100 dark:bg-purple-900/40 rounded-2xl flex items-center justify-center text-4xl mb-6">
              📝
            </div>
            <h3 className="text-2xl font-bold mb-4">Register Securely</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Login → Select Event → Confirm Registration
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg text-center">
            <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/40 rounded-2xl flex items-center justify-center text-4xl mb-6">
              🎓
            </div>
            <h3 className="text-2xl font-bold mb-4">Attend & Get Certified</h3>
            <p className="text-gray-600 dark:text-gray-300">
              QR Scan → Attendance Marked → Feedback Submitted → Certificate Generated
            </p>
          </div>
        </div>

        <p className="text-center mt-12 text-gray-600 dark:text-gray-300">
          Note: Admins create organizers, organizers manage events, students register to participate and attend.
        </p>

        {/* Why EventMate? */}
        <div className="mt-16 bg-indigo-50/80 dark:bg-indigo-900/20 rounded-3xl p-10">
          <h3 className="text-2xl font-bold text-center mb-8">Why EventMate?</h3>
          <ul className="space-y-6 max-w-4xl mx-auto">
            <li className="flex items-start gap-4">
              <span className="text-3xl">⚡</span>
              <div>
                <p className="font-semibold">Faster than manual process</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Eliminate paperwork and long queues. Our automated digital workflow saves hours of administrative work.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-3xl">🔐</span>
              <div>
                <p className="font-semibold">Secure & role-based</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Robust authentication ensures only authorized students and faculty can access sensitive data.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-3xl">🌱</span>
              <div>
                <p className="font-semibold">Paperless & automated</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  100% digital ticketing and certification helps save the environment while reducing costs.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div>
            <h2 className="text-4xl font-extrabold">Upcoming Events</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Don’t miss out on what’s happening on campus.
            </p>
          </div>
          <input
            type="text"
            placeholder="Search events..."
            className="w-full md:w-80 px-6 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-700"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {["All", "Technical", "Cultural", "Sports", "Workshop", "Seminar"].map((cat, i) => (
            <button
              key={cat}
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                i === 0
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Event Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Hackathon Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://media.istockphoto.com/id/1189873851/vector/hackathlon-vector-illustration-tiny-programmers-competition-person-concept.jpg?s=612x612&w=0&k=20&c=9aoMxVsaQSuiUAJB_rU1IsTd5Cxu8DZteerQeuYbabI="
                alt="Hackathon illustration"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                ₹300
              </div>
            </div>
            <div className="p-8">
              <span className="inline-block bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                Technical
              </span>
              <h3 className="text-2xl font-bold mb-3">Hackathon 2025</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Team up, hack smart, and solve real-world problems in our 24-hour innovation marathon.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                <p>📅 Nov 12, 2025 • 9:00 AM</p>
                <p>📍 PHP Lab, Computer Department</p>
              </div>
              <div className="flex gap-4">
                <button className="flex-1 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 py-3 rounded-xl font-semibold hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-900 transition">
                  Register
                </button>
                <Link
                  to="/hackathon"
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold text-center hover:bg-indigo-700 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>

          {/* Quiz Competition Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://www.shutterstock.com/image-vector/trophy-hand-light-bulb-creativity-260nw-2593630875.jpg"
                alt="Quiz competition illustration"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Free
              </div>
            </div>
            <div className="p-8">
              <span className="inline-block bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                Technical
              </span>
              <h3 className="text-2xl font-bold mb-3">Quiz Competition</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Test your technical skills, battle the best, and claim your victory in the ultimate Tech Quiz Competition.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                <p>📅 Dec 11, 2025 • 12:00 PM</p>
                <p>📍 Audio Video Hall</p>
              </div>
              <div className="flex gap-4">
                <button className="flex-1 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 py-3 rounded-xl font-semibold hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-900 transition">
                  Register
                </button>
                <button className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Cultural Fest Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://thumbs.dreamstime.com/b/crowd-enjoying-live-music-outdoor-festival-vibrant-stage-lighting-crowd-enjoying-live-music-outdoor-festival-345115016.jpg"
                alt="Cultural fest concert"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                ₹200
              </div>
            </div>
            <div className="p-8">
              <span className="inline-block bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                Cultural
              </span>
              <h3 className="text-2xl font-bold mb-3">Cultural Fest</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Celebrate creativity and showcase your cultural spirit.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                <p>📅 Feb 21, 2025 • 11:00 AM</p>
                <p>📍 Multi-Purpose Hall</p>
              </div>
              <div className="flex gap-4">
                <button className="flex-1 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 py-3 rounded-xl font-semibold hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-900 transition">
                  Register
                </button>
                <button className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-extrabold mb-12">
          Everything you need to run campus events
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-10 shadow-lg">
            <div className="text-5xl mb-6">📱</div>
            <h3 className="text-2xl font-bold mb-4">QR Check-in</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Fast, contactless attendance marking with real-time sync.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-10 shadow-lg">
            <div className="text-5xl mb-6">🏆</div>
            <h3 className="text-2xl font-bold mb-4">Instant Certificates</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Auto-generated digital certificates after feedback submission.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-10 shadow-lg">
            <div className="text-5xl mb-6">📊</div>
            <h3 className="text-2xl font-bold mb-4">Real-time Analytics</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Track registrations, attendance, and feedback instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gradient-to-b from-transparent to-indigo-50/50 dark:to-indigo-900/20 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-8">Get in Touch</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
            Need to talk to us? Send us a message and we'll get back to you as soon as possible.
          </p>
          <ContactUs />
        </div>
      </section>
    </div>
  )
}
