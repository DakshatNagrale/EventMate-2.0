import { useState } from "react";
import { useNavigate } from "react-router-dom";

const StatCard = ({ label, value, color = "bg-purple-100 text-purple-700" }) => (
  <div className={`flex flex-col items-center p-6 rounded-2xl ${color} dark:bg-gray-800 dark:border dark:border-gray-700 shadow-sm`}>
    <div className="text-sm text-gray-600 dark:text-gray-300">{label}</div>
    <div className="text-2xl font-bold mt-1">{value}</div>
  </div>
);

const EventCard = ({ title, date, time, dept, type, price, imageUrl, isFree = false }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100 dark:border-gray-700 group">
    <div className="relative h-48 overflow-hidden">
      <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium bg-white/90 dark:bg-gray-900/80 dark:text-gray-100 shadow-sm backdrop-blur-sm z-10">
        {isFree ? "Free" : `Rs ${price}`}
      </div>
    </div>
    <div className="p-5 flex-grow flex flex-col">
      <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">{title}</h3>
      <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">{date} | {time}</div>
      <div className="text-xs text-gray-400 dark:text-gray-500 mb-4 mt-1">{dept}</div>
      <div className="mt-auto">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            type === "Technical"
              ? "bg-blue-100 text-blue-700"
              : type === "Cultural"
                ? "bg-pink-100 text-pink-700"
                : type === "Sports"
                  ? "bg-green-100 text-green-700"
                  : "bg-purple-100 text-purple-700"
          }`}
        >
          {type}
        </span>
      </div>
    </div>
  </div>
);

const eventImages = {
  hackathon: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format",
  quiz: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format",
  cultural: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format",
  workshop: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format",
  ai: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format",
  sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format",
};

const allEvents = [
  {
    title: "Hackathon 2025",
    date: "Today",
    time: "8:00 AM",
    dept: "Computer Department",
    type: "Technical",
    price: "800",
    imageUrl: eventImages.hackathon,
    status: "current",
  },
  {
    title: "Quiz Competition",
    date: "Dec 11, 2025",
    time: "12:00 PM",
    dept: "Various Departments",
    type: "Technical",
    price: "0",
    imageUrl: eventImages.quiz,
    status: "upcoming",
    isFree: true,
  },
  {
    title: "Cultural Fest",
    date: "Feb 20, 2026",
    time: "9:00 AM",
    dept: "Cultural Committee",
    type: "Cultural",
    price: "200",
    imageUrl: eventImages.cultural,
    status: "upcoming",
  },
  {
    title: "Web Dev Workshop",
    date: "Nov 25, 2025",
    time: "10:00 AM",
    dept: "Training Department",
    type: "Workshop",
    price: "500",
    imageUrl: eventImages.workshop,
    status: "upcoming",
  },
  {
    title: "Future of AI Seminar",
    date: "Dec 05, 2025",
    time: "2:00 PM",
    dept: "Science Club",
    type: "Technical",
    price: "0",
    imageUrl: eventImages.ai,
    status: "upcoming",
    isFree: true,
  },
  {
    title: "Annual Sports Meet",
    date: "Jan 15, 2026",
    time: "8:00 AM",
    dept: "Sports Authority",
    type: "Sports",
    price: "100",
    imageUrl: eventImages.sports,
    status: "upcoming",
  },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [showAllRecommended, setShowAllRecommended] = useState(false);
  const displayedEvents = showAllRecommended ? allEvents : allEvents.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-gray-900 dark:text-gray-100">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Browse Events" value="New activities" color="bg-blue-50 text-blue-700" />
        <StatCard label="My Events" value="3 registered" />
        <StatCard label="My Certificates" value="1 issued" />
        <StatCard label="Feedback" value="2 pending" color="bg-orange-50 text-orange-700" />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recommended For You</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Based on your interests</p>
              </div>
              <div className="mt-3 sm:mt-0 flex gap-2">
                <button
                  onClick={() => setShowAllRecommended((prev) => !prev)}
                  className="px-5 py-2 bg-purple-100 dark:bg-indigo-500/20 text-purple-700 dark:text-indigo-200 rounded-lg hover:bg-purple-200 dark:hover:bg-indigo-500/30 transition font-medium"
                >
                  {showAllRecommended ? "Show Less" : "Show More"}
                </button>
                <button
                  onClick={() => navigate("/student-dashboard/events")}
                  className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                >
                  View All Events
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {displayedEvents.map((event, index) => (
                <EventCard key={`${event.title}-${index}`} {...event} />
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold mb-5 text-gray-900 dark:text-white">Recent Activity</h2>
            <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
              <p>Registered for AI Workshop</p>
              <p>Certificate earned for Web Development Workshop</p>
              <p>Viewed Music Concert details</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 dark:from-indigo-700 dark:to-slate-800 text-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-3">Complete your profile</h2>
            <p className="mb-6 text-purple-100 dark:text-indigo-100 text-sm">
              Add your skills and interests to get better event recommendations.
            </p>
            <button
              onClick={() => navigate("/profile")}
              className="w-full bg-white text-purple-700 dark:text-indigo-700 font-medium py-3 rounded-xl hover:bg-gray-100 transition"
            >
              Continue Setup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
