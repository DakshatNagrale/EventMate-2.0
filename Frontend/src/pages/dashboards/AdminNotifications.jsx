import { useEffect, useMemo, useState } from "react";
import { Bell, CheckCheck, Loader2, Mail, RefreshCcw } from "lucide-react";
import api from "../../lib/api";
import SummaryApi from "../../common/SummaryApi";

const ROLE_LABELS = {
  ORGANIZER: "Organizer",
  STUDENT_COORDINATOR: "Coordinator",
};

const STATUS_STYLE = {
  UNREAD: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",
  READ: "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
};

const formatDateTime = (value) => {
  if (!value) return "N/A";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "N/A";
  return parsed.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getInitials = (value) =>
  String(value || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const buildReadUrl = (id) => SummaryApi.mark_admin_contact_message_read.url.replace(":id", id);

export default function AdminNotifications() {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState("");
  const [markingAll, setMarkingAll] = useState(false);
  const [error, setError] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api({
        ...SummaryApi.get_admin_contact_messages,
        params: { limit: 100 },
      });
      setMessages(response.data?.messages || []);
      const nextUnread = response.data?.unreadCount || 0;
      setUnreadCount(nextUnread);
      window.dispatchEvent(new CustomEvent("eventmate:admin-unread-count", { detail: nextUnread }));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id) => {
    setMarkingId(id);
    setError(null);
    try {
      await api({
        ...SummaryApi.mark_admin_contact_message_read,
        url: buildReadUrl(id),
      });
      await fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to mark notification as read.");
    } finally {
      setMarkingId("");
    }
  };

  const markAllAsRead = async () => {
    setMarkingAll(true);
    setError(null);
    try {
      await api({ ...SummaryApi.mark_all_admin_contact_messages_read });
      await fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to mark all notifications as read.");
    } finally {
      setMarkingAll(false);
    }
  };

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [messages]
  );

  return (
    <div className="eventmate-page min-h-screen bg-slate-50 dark:bg-gray-900 px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <section className="eventmate-panel rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900/70 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Admin Notifications</h1>
              <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">
                Contact messages from organizers and coordinators.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={fetchMessages}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <RefreshCcw size={15} />
                Refresh
              </button>
              <button
                type="button"
                onClick={markAllAsRead}
                disabled={!unreadCount || markingAll}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
              >
                {markingAll ? <Loader2 size={15} className="animate-spin" /> : <CheckCheck size={15} />}
                Mark All Read
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <article className="eventmate-kpi rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900/70 p-4">
            <p className="text-sm text-slate-500 dark:text-slate-300">Unread</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{unreadCount}</p>
          </article>
          <article className="eventmate-kpi rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900/70 p-4">
            <p className="text-sm text-slate-500 dark:text-slate-300">Total</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{messages.length}</p>
          </article>
          <article className="eventmate-kpi rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900/70 p-4">
            <p className="text-sm text-slate-500 dark:text-slate-300">Sources</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Organizer + Coordinator</p>
          </article>
        </section>

        <section className="eventmate-panel rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900/70 p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={17} className="text-indigo-500" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Latest Messages</h2>
          </div>

          {loading && (
            <p className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
              <Loader2 size={14} className="animate-spin" />
              Loading notifications...
            </p>
          )}

          {error && !loading && (
            <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
          )}

          {!loading && !error && sortedMessages.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-300">No contact notifications available.</p>
          )}

          {!loading && !error && sortedMessages.length > 0 && (
            <div className="space-y-3">
              {sortedMessages.map((item) => (
                <article
                  key={item._id}
                  className="eventmate-kpi rounded-xl border border-slate-200 dark:border-white/10 p-4 bg-slate-50/70 dark:bg-white/5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-200 dark:border-white/10 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-200 text-xs font-semibold flex items-center justify-center">
                        {item.sender?.avatar ? (
                          <img src={item.sender.avatar} alt={item.sender?.name || "User"} className="h-full w-full object-cover" />
                        ) : (
                          getInitials(item.sender?.name || "U")
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.subject}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-300">
                          {item.sender?.name || "Unknown"} ({ROLE_LABELS[item.sender?.role] || item.sender?.role || "User"}) • {item.sender?.email || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          STATUS_STYLE[item.status] || STATUS_STYLE.UNREAD
                        }`}
                      >
                        {item.status === "READ" ? "Read" : "Unread"}
                      </span>
                      {item.status !== "READ" && (
                        <button
                          type="button"
                          onClick={() => markAsRead(item._id)}
                          disabled={markingId === item._id}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-white/10 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-70"
                        >
                          {markingId === item._id ? <Loader2 size={12} className="animate-spin" /> : <Mail size={12} />}
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{item.message}</p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Received: {formatDateTime(item.createdAt)}
                    {item.readAt ? ` | Read: ${formatDateTime(item.readAt)}` : ""}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}




