import { useEffect, useMemo, useState } from "react";
import { Calendar, Circle, Loader2, LogOut, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import SummaryApi from "../../common/SummaryApi";
import { getStoredUser } from "../../lib/auth";
import { logoutUser } from "../../lib/logout";

const STATUS_STYLES = {
  Draft: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  Published: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  Completed: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  Cancelled: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
};

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString([], { year: "numeric", month: "short", day: "2-digit" });
};

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api({ ...SummaryApi.get_my_events });
      setEvents(response.data?.events || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login", { replace: true });
  };

  const metrics = useMemo(() => {
    return {
      total: events.length,
      draft: events.filter((event) => event.status === "Draft").length,
      published: events.filter((event) => event.status === "Published").length,
      completed: events.filter((event) => event.status === "Completed").length,
    };
  }, [events]);

  return (
    <div className="eventmate-page min-h-screen bg-slate-100/80 dark:bg-gray-900 px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <section className="eventmate-panel rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900/70 p-5 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Organizer Dashboard</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                Welcome back, {user?.fullName || "Organizer"}. Manage and publish your events.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={fetchMyEvents}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <Calendar size={15} />
                Refresh
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-400/30 dark:text-red-300 dark:hover:bg-red-500/15"
              >
                <LogOut size={15} />
                Logout
              </button>
              <button
                type="button"
                onClick={() => navigate("/organizer-dashboard/create-event")}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <Plus size={15} />
                Create Event
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <article className="eventmate-kpi rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900/70 p-4">
            <p className="text-sm text-slate-500 dark:text-slate-300">Total Events</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{metrics.total}</p>
          </article>
          <article className="eventmate-kpi rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900/70 p-4">
            <p className="text-sm text-slate-500 dark:text-slate-300">Draft</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{metrics.draft}</p>
          </article>
          <article className="eventmate-kpi rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900/70 p-4">
            <p className="text-sm text-slate-500 dark:text-slate-300">Published</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{metrics.published}</p>
          </article>
          <article className="eventmate-kpi rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900/70 p-4">
            <p className="text-sm text-slate-500 dark:text-slate-300">Completed</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{metrics.completed}</p>
          </article>
        </section>

        <section id="my-events" className="eventmate-panel rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900/70 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">My Events</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">{events.length} total</span>
          </div>

          {loading && (
            <p className="mt-6 text-sm text-slate-500 dark:text-slate-300 inline-flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              Loading events...
            </p>
          )}
          {error && !loading && <p className="mt-6 text-sm text-red-600 dark:text-red-300">{error}</p>}

          {!loading && !error && (
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    <th className="pb-3 pr-3">Event</th>
                    <th className="pb-3 pr-3">Category</th>
                    <th className="pb-3 pr-3">Status</th>
                    <th className="pb-3 pr-3">Venue</th>
                    <th className="pb-3">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                  {events.map((event) => (
                    <tr key={event._id}>
                      <td className="py-3 pr-3">
                        <p className="font-semibold text-slate-900 dark:text-white">{event.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{event.organizer?.contactEmail || "N/A"}</p>
                      </td>
                      <td className="py-3 pr-3 text-slate-700 dark:text-slate-200">{event.category || "N/A"}</td>
                      <td className="py-3 pr-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            STATUS_STYLES[event.status] || STATUS_STYLES.Draft
                          }`}
                        >
                          <Circle size={8} className="fill-current" />
                          {event.status || "Draft"}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-slate-700 dark:text-slate-200">{event.venue?.location || "Not set"}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">{formatDate(event.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {events.length === 0 && (
                <p className="mt-6 text-sm text-slate-500 dark:text-slate-300">
                  No events yet. Click `Create Event` to add your first event.
                </p>
              )}
            </div>
          )}
        </section>

        <section id="contact-admin" className="eventmate-panel rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900/70 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Contact Admin</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Send approvals, policy issues, and operational requests directly to the admin notification queue.
          </p>
          <button
            type="button"
            onClick={() => navigate("/organizer-dashboard/contact-admin")}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Open Contact Admin Page
          </button>
        </section>
      </div>
    </div>
  );
}




