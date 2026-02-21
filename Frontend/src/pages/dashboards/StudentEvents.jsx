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
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
              : type === "Cultural"
                ? "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300"
                : type === "Sports"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                  : "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
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

export default function StudentEvents() {
  const currentEvents = allEvents.filter((event) => event.status === "current");
  const upcomingEvents = allEvents.filter((event) => event.status === "upcoming");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-gray-900 dark:text-gray-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">All Events</h1>
        <p className="text-gray-600 dark:text-gray-300">Explore current and upcoming campus activities.</p>
      </div>

      {currentEvents.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-8 bg-green-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Current Events</h2>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-bold rounded-full">LIVE</span>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentEvents.map((event, index) => (
              <EventCard key={`current-${index}`} {...event} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-3 h-8 bg-purple-500 rounded-full"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upcoming Events</h2>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {upcomingEvents.map((event, index) => (
            <EventCard key={`upcoming-${index}`} {...event} />
          ))}
        </div>
      </section>
    </div>
  );
}
