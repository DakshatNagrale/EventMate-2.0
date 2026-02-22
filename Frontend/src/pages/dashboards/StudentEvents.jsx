import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";
import SummaryApi from "../../common/SummaryApi";

const EventCard = ({ title, date, time, dept, type, price, imageUrl, isFree = false }) => (
  <div className="eventmate-panel bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100 dark:border-gray-700 group">
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

const fallbackImages = {
  Technical: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format",
  Cultural: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format",
  Sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format",
  Workshop: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format",
};

const formatDate = (value) => {
  if (!value) return "Date TBD";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date TBD";
  return date.toLocaleDateString([], { year: "numeric", month: "short", day: "2-digit" });
};

const getEventStatus = (event) => {
  const startDate = event?.schedule?.startDate ? new Date(event.schedule.startDate) : null;
  const endDate = event?.schedule?.endDate ? new Date(event.schedule.endDate) : startDate;
  const now = new Date();

  if (!startDate || Number.isNaN(startDate.getTime())) {
    return "upcoming";
  }
  if (!endDate || Number.isNaN(endDate.getTime())) {
    return now.toDateString() === startDate.toDateString() ? "current" : "upcoming";
  }

  return now >= startDate && now <= endDate ? "current" : "upcoming";
};

const mapEventToCard = (event) => {
  const fee = Number(event?.registration?.fee || 0);
  const category = event?.category || "Workshop";

  return {
    id: event?._id,
    title: event?.title || "Untitled Event",
    date: formatDate(event?.schedule?.startDate),
    time: event?.schedule?.startTime || "Time TBD",
    dept: event?.organizer?.department || event?.organizer?.name || "Campus Event",
    type: category,
    price: fee,
    isFree: fee <= 0,
    imageUrl: event?.posterUrl || fallbackImages[category] || fallbackImages.Workshop,
    status: getEventStatus(event),
  };
};

export default function StudentEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api({
          ...SummaryApi.get_public_events,
          skipAuth: true,
        });
        if (isMounted) {
          setEvents(response.data?.events || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || "Unable to load events right now.");
          setEvents([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEvents();
    return () => {
      isMounted = false;
    };
  }, []);

  const mappedEvents = useMemo(() => events.map(mapEventToCard), [events]);
  const currentEvents = useMemo(
    () => mappedEvents.filter((event) => event.status === "current"),
    [mappedEvents]
  );
  const upcomingEvents = useMemo(
    () => mappedEvents.filter((event) => event.status === "upcoming"),
    [mappedEvents]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-gray-900 dark:text-gray-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">All Events</h1>
        <p className="text-gray-600 dark:text-gray-300">Explore current and upcoming campus activities.</p>
      </div>

      {loading && (
        <div className="eventmate-kpi rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-10 text-center text-gray-500 dark:text-gray-300">
          Loading events...
        </div>
      )}

      {!loading && error && (
        <div className="eventmate-kpi rounded-xl border border-red-200 bg-red-50 dark:border-red-400/40 dark:bg-red-500/15 p-6 text-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      {!loading && !error && mappedEvents.length === 0 && (
        <div className="eventmate-kpi rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-10 text-center text-gray-500 dark:text-gray-300">
          No published events available yet.
        </div>
      )}

      {!loading && !error && mappedEvents.length > 0 && (
        <>
          {currentEvents.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-8 bg-green-500 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Current Events</h2>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-bold rounded-full">LIVE</span>
              </div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentEvents.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-8 bg-purple-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentEvents.length > 0 ? "Upcoming Events" : "Published Events"}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {(currentEvents.length > 0 ? upcomingEvents : mappedEvents).map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
