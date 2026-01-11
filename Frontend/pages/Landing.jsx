// src/pages/Landing.jsx
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import ContactUs from "../components/ContactUs"
import AOS from "aos"
import "aos/dist/aos.css"

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isDarkMode, setIsDarkMode] = useState(false)

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
      image: "https://media.istockphoto.com/id/1189873851/vector/hackathlon-vector-illustration-tiny-programmers-competition-person-concept.jpg?s=612x612&w=0&k=20&c=9aoMxVsaQSuiUAJB_rU1IsTd5Cxu8DZteerQeuYbabI=",
      link: "/hackathon"
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
      image: "https://www.shutterstock.com/image-vector/trophy-hand-light-bulb-creativity-260nw-2593630875.jpg"
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
      image: "https://thumbs.dreamstime.com/b/crowd-enjoying-live-music-outdoor-festival-vibrant-stage-lighting-crowd-enjoying-live-music-outdoor-festival-345115016.jpg"
    },
  ]

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleRegister = (eventTitle) => {
    alert(`Registration for "${eventTitle}" is open! We'll notify you soon.`)
  }

  const categories = ["All", "Technical", "Cultural", "Sports", "Workshop", "Seminar"]

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-quart",
      once: true,
      offset: 80,
      anchorPlacement: 'top-bottom',
    })

    const handleResize = () => AOS.refresh()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const hash = window.location.hash
      if (hash === "#events" || hash === "#contact") {
        const element = document.querySelector(hash)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
    }
    handleScroll()
    window.addEventListener("popstate", handleScroll)
    return () => window.removeEventListener("popstate", handleScroll)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setIsDarkMode(prefersDark)
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f17] transition-colors duration-700 overflow-hidden relative">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Gradient Orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-white to-purple-50/30 dark:from-[#0f0f17] dark:via-[#1a1a2e] dark:to-[#16213e] opacity-60"></div>

        {/* Floating Particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-indigo-400 dark:bg-purple-400 rounded-full opacity-40 dark:opacity-50"
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: Math.random() * 2 + 's',
            }}
          ></div>
        ))}

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-indigo-100/5 dark:to-indigo-900/10" style={{
          backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(99, 102, 241, 0.05) 25%, rgba(99, 102, 241, 0.05) 26%, transparent 27%, transparent 74%, rgba(99, 102, 241, 0.05) 75%, rgba(99, 102, 241, 0.05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(99, 102, 241, 0.05) 25%, rgba(99, 102, 241, 0.05) 26%, transparent 27%, transparent 74%, rgba(99, 102, 241, 0.05) 75%, rgba(99, 102, 241, 0.05) 76%, transparent 77%, transparent)`,
          backgroundSize: '50px 50px',
        }}></div>
      </div>

      {/* Cursor Follower Gradient */}
      <div 
        className="fixed pointer-events-none w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-full filter blur-3xl z-0 transition-opacity duration-300"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          opacity: 0.3,
        }}
      ></div>

      {/* Content Wrapper */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-24 px-6 text-center">
          <div data-aos="fade-down" data-aos-delay="100">
            <span className="inline-block bg-indigo-100/80 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-6 py-3 rounded-full text-sm font-semibold mb-10 border border-indigo-200 dark:border-indigo-800 hover:shadow-lg hover:shadow-indigo-500/40 transition-all duration-500 backdrop-blur-sm hover:scale-105 cursor-pointer group">
              <span className="inline-block animate-pulse mr-2">✦</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">Simplifying Campus Life</span>
            </span>
          </div>

          <h1 
            data-aos="fade-up" 
            data-aos-delay="300"
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight mb-8 animate-in fade-in duration-1000"
          >
            Manage Campus Events <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 animate-gradient-shift">
              Seamlessly
            </span>
          </h1>

          <p 
            data-aos="fade-up" 
            data-aos-delay="500"
            className="mt-8 max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed"
          >
            The all-in-one platform for students and organizers. Discover events, register instantly, check-in with QR codes, and earn digital certificates.
          </p>

          <div data-aos="zoom-in" data-aos-delay="700" className="group">
            <Link
              to="/signup"
              className="inline-block px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg font-bold rounded-full shadow-2xl shadow-purple-500/40 dark:shadow-purple-400/40 transform hover:scale-110 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started 
                <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
              </span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                boxShadow: `0 0 30px rgba(99, 102, 241, 0.6)`
              }}></div>
            </Link>
          </div>
        </section>

        {/* How EventMate Works */}
        <section className="max-w-7xl mx-auto px-6 py-24 relative">
          <div data-aos="fade-up" className="text-center mb-16">
            <p className="text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-widest text-sm animate-pulse">
              ✨ How It Works
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-4 text-gray-900 dark:text-white">
              How EventMate <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Works</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              Three simple steps to discover, register, and attend campus events
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: "🔍", title: "Discover Events", desc: "Browse all upcoming campus events with full details.", delay: 200 },
              { icon: "📝", title: "Register Securely", desc: "Login → Select Event → Confirm Registration", delay: 400 },
              { icon: "🎓", title: "Attend & Get Certified", desc: "QR Scan → Attendance Marked → Feedback Submitted → Certificate Generated", delay: 600 }
            ].map((item, idx) => (
              <div 
                key={idx}
                data-aos="fade-up" 
                data-aos-delay={item.delay}
                className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl p-10 shadow-xl border border-gray-200/50 dark:border-gray-700/50 text-center hover:shadow-2xl hover:-translate-y-6 transition-all duration-500 relative overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                
                <div className="relative z-10 w-24 h-24 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-3xl flex items-center justify-center text-5xl mb-8 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white relative z-10 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 relative z-10">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <p data-aos="fade-up" data-aos-delay="200" className="text-center mt-16 text-gray-600 dark:text-gray-300 text-lg">
            Note: Admins create organizers, organizers manage events, students register to participate and attend.
          </p>

          <div 
            data-aos="fade-up" 
            data-aos-delay="300"
            className="mt-20 bg-gradient-to-br from-indigo-50/70 to-purple-50/70 dark:from-indigo-900/30 dark:to-purple-900/20 rounded-3xl p-12 border border-indigo-200/50 dark:border-indigo-800/50 hover:shadow-2xl transition-all duration-500 backdrop-blur-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-300/20 dark:bg-indigo-600/20 rounded-full blur-3xl"></div>
            <h3 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white relative z-10">
              Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">EventMate</span>?
            </h3>
            <ul className="space-y-8 max-w-4xl mx-auto relative z-10">
              {[
                { icon: "⚡", title: "Faster than manual process", desc: "Eliminate paperwork and long queues. Our automated digital workflow saves hours of administrative work." },
                { icon: "🔐", title: "Secure & role-based", desc: "Robust authentication ensures only authorized students and faculty can access sensitive data." },
                { icon: "🌱", title: "Paperless & automated", desc: "100% digital ticketing and certification helps save the environment while reducing costs." }
              ].map((item, idx) => (
                <li key={idx} data-aos="fade-right" data-aos-delay={100 + idx * 200} className="flex items-start gap-6 group hover:translate-x-2 transition-transform duration-300">
                  <span className="text-4xl flex-shrink-0 transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-300">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section id="events" className="max-w-7xl mx-auto px-6 py-24">
          <div data-aos="fade-up" className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
                Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Events</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-3">
                Don't miss out on what's happening on campus.
              </p>
            </div>
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full lg:w-96 px-8 py-4 rounded-full bg-white/90 dark:bg-gray-800/90 border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/40 dark:focus:ring-indigo-400/60 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
            />
          </div>

          {/* Category Filters */}
          <div data-aos="fade-up" data-aos-delay="200" className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map((cat, index) => (
              <button
                key={cat}
                data-aos="zoom-in"
                data-aos-delay={100 + index * 80}
                onClick={() => setSelectedCategory(cat)}
                className={`px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:shadow-lg relative overflow-hidden group ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/30"
                    : "bg-white/90 dark:bg-gray-800/90 border-2 border-gray-300 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-400"
                }`}
              >
                <span className="relative z-10">{cat}</span>
                {selectedCategory === cat && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                    boxShadow: `inset 0 0 20px rgba(255, 255, 255, 0.2)`
                  }}></div>
                )}
              </button>
            ))}
          </div>

          {/* Event Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredEvents.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 dark:text-gray-400 py-20 text-2xl animate-pulse">
                No events found matching your search.
              </p>
            ) : (
              filteredEvents.map((event, index) => (
                <div 
                  key={event.id} 
                  data-aos="zoom-in-up"
                  data-aos-delay={index * 150}
                  className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 transform hover:-translate-y-8 hover:shadow-3xl transition-all duration-500 backdrop-blur-sm cursor-pointer relative"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transform group-hover:scale-125 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className={`absolute top-6 right-6 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg transform group-hover:scale-110 transition-all duration-300 ${
                      event.price === "Free" ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gradient-to-r from-indigo-600 to-purple-600"
                    }`}>
                      {event.price}
                    </div>
                  </div>
                  <div className="p-10">
                    <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold mb-4 transition-all duration-300 transform group-hover:scale-110 ${
                      event.category === "Technical" 
                        ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                        : "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                    }`}>
                      {event.category}
                    </span>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                      {event.description}
                    </p>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-8 space-y-2">
                      <p className="transform group-hover:translate-x-2 transition-transform duration-300">📅 {event.date} • {event.time}</p>
                      <p className="transform group-hover:translate-x-2 transition-transform duration-300">📍 {event.location}</p>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleRegister(event.title)}
                        className="flex-1 border-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 py-4 rounded-xl font-bold hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-900 transform hover:scale-105 transition-all duration-300 relative overflow-hidden group/btn"
                      >
                        <span className="relative z-10">Register</span>
                        <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 -z-10"></div>
                      </button>
                      {event.link ? (
                        <Link
                          to={event.link}
                          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-center hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl shadow-indigo-500/30 relative overflow-hidden group/link"
                        >
                          <span className="relative z-10">View Details</span>
                          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/link:translate-x-[100%] transition-transform duration-700"></div>
                        </Link>
                      ) : (
                        <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl shadow-indigo-500/30">
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center relative">
          <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-extrabold mb-16 text-gray-900 dark:text-white">
            Everything you need to run <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">campus events</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { emoji: "📱", title: "QR Check-in", desc: "Fast, contactless attendance marking with real-time sync." },
              { emoji: "🏆", title: "Instant Certificates", desc: "Auto-generated digital certificates after feedback submission." },
              { emoji: "📊", title: "Real-time Analytics", desc: "Track registrations, attendance, and feedback instantly." }
            ].map((feature, idx) => (
              <div 
                key={idx}
                data-aos="flip-left" 
                data-aos-delay={100 + idx * 200}
                className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl p-12 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl hover:-translate-y-6 transition-all duration-500 relative overflow-hidden"
              >
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/0 to-purple-400/0 group-hover:from-indigo-400/10 group-hover:to-purple-400/10 transition-all duration-500"></div>
                
                <div className="text-6xl mb-8 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 relative z-10">
                  {feature.emoji}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white relative z-10 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 relative z-10">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="bg-gradient-to-b from-transparent via-indigo-50/60 to-indigo-100/60 dark:via-indigo-900/30 dark:to-indigo-900/20 py-28 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300/20 dark:bg-purple-600/20 rounded-full blur-3xl -mr-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-300/20 dark:bg-indigo-600/20 rounded-full blur-3xl -ml-32"></div>
          
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-extrabold mb-10 text-gray-900 dark:text-white">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Touch</span>
            </h2>
            <p data-aos="fade-up" data-aos-delay="200" className="text-xl text-gray-600 dark:text-gray-300 mb-16">
              Need to talk to us? Send us a message and we'll get back to you as soon as possible.
            </p>
            <div data-aos="fade-up" data-aos-delay="400">
              <ContactUs />
            </div>
          </div>
        </section>
      </div>

      {/* Global Styles */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 6s ease infinite;
        }

        /* Smooth animations on scroll */
        .animate-in {
          animation: fadeInUp 0.8s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 12px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #4f46e5, #9333ea);
          border-radius: 10px;
          transition: background 0.3s;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #4338ca, #7e22ce);
        }
      `}</style>
    </div>
  )
}
