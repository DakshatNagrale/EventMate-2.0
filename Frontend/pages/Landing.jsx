// src/pages/Landing.jsx
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import ContactUs from "../components/ContactUs"
import { motion, useReducedMotion } from "framer-motion"

const fadeUp = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const reduceMotion = useReducedMotion()

  // Sample event data
  const events = [
    {
      id: 1,
      title: "Hackathon 2025",
      description: "Team up, hack smart, and solve real-world problems in our 24-hour innovation marathon.",
      date: "Nov 12, 2025",
      time: "9:00 AM",
      location: "PHP Lab, Computer Department",
      price: "₹300",
      category: "Technical",
      image:
        "https://media.istockphoto.com/id/1189873851/vector/hackathlon-vector-illustration-tiny-programmers-competition-person-concept.jpg?s=612x612&w=0&k=20&c=9aoMxVsaQSuiUAJB_rU1IsTd5Cxu8DZteerQeuYbabI=",
      link: "/hackathon",
    },
    {
      id: 2,
      title: "Quiz Competition",
      description: "Test your technical skills, battle the best, and claim your victory in the ultimate Tech Quiz Competition.",
      date: "Dec 11, 2025",
      time: "12:00 PM",
      location: "Audio Video Hall",
      price: "Free",
      category: "Technical",
      image: "https://www.shutterstock.com/image-vector/trophy-hand-light-bulb-creativity-260nw-2593630875.jpg",
    },
    {
      id: 3,
      title: "Cultural Fest",
      description: "Celebrate creativity and showcase your cultural spirit.",
      date: "Feb 21, 2025",
      time: "11:00 AM",
      location: "Multi-Purpose Hall",
      price: "₹200",
      category: "Cultural",
      image: "https://thumbs.dreamstime.com/b/crowd-enjoying-live-music-outdoor-festival-vibrant-stage-lighting-crowd-enjoying-live-music-outdoor-festival-345115016.jpg",
    },
  ]

  const categories = ["All", "Technical", "Cultural", "Sports", "Workshop", "Seminar"]

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || event.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [events, searchQuery, selectedCategory])

  const handleRegister = (eventTitle) => {
    alert(`Registration for "${eventTitle}" is open! We'll notify you soon.`)
  }

  // Smooth scrolling for navbar anchor links
  useEffect(() => {
    const handleScroll = () => {
      const hash = window.location.hash
      if (hash === "#events" || hash === "#contact") {
        const element = document.querySelector(hash)
        if (element) element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }

    handleScroll()
    window.addEventListener("popstate", handleScroll)
    return () => window.removeEventListener("popstate", handleScroll)
  }, [])

  const viewportOnce = { once: true, amount: 0.25 }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50/30 via-white to-purple-50/30 dark:from-[#0f0f17] dark:via-[#1a1a2e] dark:to-[#16213e] transition-colors duration-700">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full bg-indigo-400/20 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute -bottom-40 -right-40 h-[560px] w-[560px] rounded-full bg-purple-400/20 blur-3xl animate-[pulse_7s_ease-in-out_infinite]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[420px] w-[420px] rounded-full bg-fuchsia-300/10 blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 text-center">
        <motion.div
          initial={reduceMotion ? "show" : "hidden"}
          animate="show"
          variants={stagger}
          className="max-w-5xl mx-auto"
        >
          <motion.span
            variants={fadeUp}
            className="inline-block bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-6 py-2 rounded-full text-sm font-semibold mb-8 border border-indigo-200 dark:border-indigo-800 shadow-sm"
          >
            ✦ Simplifying Campus Life
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight"
          >
            Manage Campus Events <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Seamlessly
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-8 max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            The all-in-one platform for students and organizers. Discover events, register instantly, check-in with QR codes, and earn digital certificates.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-12 flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/signup"
              className="inline-block px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg font-semibold rounded-full shadow-2xl shadow-purple-500/30 dark:shadow-purple-400/30 hover:scale-[1.03] active:scale-[0.99] transition-all duration-300"
            >
              Get Started →
            </Link>

          
          </motion.div>
        </motion.div>
      </section>

      {/* How EventMate Works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.p variants={fadeUp} className="text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider text-sm">
            How It Works
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl font-extrabold mt-4 text-gray-900 dark:text-white">
            How EventMate Works
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-gray-600 dark:text-gray-300">
            Three simple steps to discover, register, and attend campus events
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={stagger}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            { icon: "🔍", title: "Discover Events", desc: "Browse all upcoming campus events with full details.", glow: "from-indigo-500/10" },
            { icon: "📝", title: "Register Securely", desc: "Login → Select Event → Confirm Registration", glow: "from-purple-500/10" },
            { icon: "🎓", title: "Attend & Get Certified", desc: "QR Scan → Attendance Marked → Feedback Submitted → Certificate Generated", glow: "from-emerald-500/10" },
          ].map((card) => (
            <motion.div
              key={card.title}
              variants={fadeUp}
              whileHover={reduceMotion ? {} : { y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 text-center overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-b ${card.glow} to-transparent opacity-70`} />
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-4xl mb-6">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{card.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="text-center mt-12 text-gray-600 dark:text-gray-300"
        >
          Note: Admins create organizers, organizers manage events, students register to participate and attend.
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mt-16 bg-indigo-50/70 dark:bg-indigo-900/30 rounded-3xl p-10 border border-indigo-200/50 dark:border-indigo-800/50"
        >
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">Why EventMate?</h3>
          <ul className="space-y-6 max-w-4xl mx-auto">
            <li className="flex items-start gap-4">
              <span className="text-3xl">⚡</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Faster than manual process</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Eliminate paperwork and long queues. Automated workflow saves hours of admin work.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-3xl">🔐</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Secure & role-based</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Role-based access helps protect sensitive event and student data.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-3xl">🌱</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Paperless & automated</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Digital ticketing and certification reduces cost and effort.</p>
              </div>
            </li>
          </ul>
        </motion.div>
      </section>

      {/* Upcoming Events */}
      <section id="events" className="max-w-7xl mx-auto px-6 py-20">
        <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={stagger} className="mb-8">
          <motion.div variants={fadeUp} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">Upcoming Events</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Don’t miss out on what’s happening on campus.</p>
            </div>

            <div className="w-full md:w-80">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">⌕</span>
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-6 py-3 rounded-full bg-white/90 dark:bg-gray-800/90 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 dark:focus:ring-indigo-400/50 transition"
                />
              </div>
            </div>
          </motion.div>

          {/* Category Filters */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "bg-white/90 dark:bg-gray-800/90 border border-gray-300 dark:border-gray-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Event Cards */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          variants={stagger}
          className="grid md:grid-cols-3 gap-8"
        >
          {filteredEvents.length === 0 ? (
            <p className="col-span-3 text-center text-gray-500 dark:text-gray-400 py-12 text-xl">No events found matching your search.</p>
          ) : (
            filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                variants={fadeUp}
                whileHover={reduceMotion ? {} : { y: -10 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-[1.08]"
                    loading="lazy"
                  />
                  <div
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold text-white shadow-md ${
                      event.price === "Free" ? "bg-green-600" : "bg-indigo-600"
                    }`}
                  >
                    {event.price}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                </div>

                <div className="p-8">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                      event.category === "Technical"
                        ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                        : "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                    }`}
                  >
                    {event.category}
                  </span>

                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{event.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{event.description}</p>

                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <p>📅 {event.date} • {event.time}</p>
                    <p>📍 {event.location}</p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleRegister(event.title)}
                      className="flex-1 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 py-3 rounded-xl font-semibold hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-900 transition"
                    >
                      Register
                    </button>

                    {event.link ? (
                      <Link
                        to={event.link}
                        className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold text-center hover:bg-indigo-700 transition"
                      >
                        View Details
                      </Link>
                    ) : (
                      <button className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <motion.h2 initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp} className="text-4xl font-extrabold mb-12 text-gray-900 dark:text-white">
          Everything you need to run campus events
        </motion.h2>

        <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={stagger} className="grid md:grid-cols-3 gap-10">
          {[
            { icon: "📱", title: "QR Check-in", desc: "Fast, contactless attendance marking with real-time sync." },
            { icon: "🏆", title: "Instant Certificates", desc: "Auto-generated digital certificates after feedback submission." },
            { icon: "📊", title: "Real-time Analytics", desc: "Track registrations, attendance, and feedback instantly." },
          ].map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              whileHover={reduceMotion ? {} : { y: -6 }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl p-10 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="text-5xl mb-6">{f.icon}</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-gradient-to-b from-transparent to-indigo-50/50 dark:to-indigo-900/20 py-20">
        <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={stagger} className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2 variants={fadeUp} className="text-4xl font-extrabold mb-8 text-gray-900 dark:text-white">
            Get in Touch
          </motion.h2>
          <motion.p variants={fadeUp} className="text-xl text-gray-600 dark:text-gray-300 mb-12">
            Need to talk to us? Send us a message and we'll get back to you as soon as possible.
          </motion.p>
          <motion.div variants={fadeUp}>
            <ContactUs />
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}
