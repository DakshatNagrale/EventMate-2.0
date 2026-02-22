import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Mail, RefreshCcw, SendHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import SummaryApi from "../common/SummaryApi";

const STATUS_LABEL = {
  UNREAD: "Pending",
  READ: "Seen by Admin",
};

const STATUS_STYLE = {
  UNREAD: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  READ: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
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

export default function ContactAdminWorkspace({ title, subtitle, dashboardPath }) {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchMessages = async () => {
    setLoadingMessages(true);
    setError(null);
    try {
      const response = await api({ ...SummaryApi.get_my_contact_messages });
      setMessages(response.data?.messages || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load previous messages.");
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (subject.trim().length < 3) {
      setError("Subject must be at least 3 characters.");
      return;
    }

    if (message.trim().length < 10) {
      setError("Message must be at least 10 characters.");
      return;
    }

    setSending(true);
    try {
      const response = await api({
        ...SummaryApi.send_contact_admin,
        data: {
          subject: subject.trim(),
          message: message.trim(),
        },
      });
      setSuccess(response.data?.message || "Message sent to admin.");
      setSubject("");
      setMessage("");
      await fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="eventmate-page min-h-screen bg-slate-100/80 dark:bg-gray-900 px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <button
          type="button"
          onClick={() => navigate(dashboardPath)}
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <section className="eventmate-panel rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900/70 p-5 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{subtitle}</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6">
          <section className="eventmate-panel rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900/70 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail size={16} className="text-indigo-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Send a Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Subject</label>
                <input
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="Approval required for upcoming event"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Message</label>
                <textarea
                  rows={6}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Share your request, issue, or approval details for the admin team."
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/15 dark:text-red-300">{error}</p>
              )}
              {success && (
                <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-70"
              >
                {sending ? <Loader2 size={15} className="animate-spin" /> : <SendHorizontal size={15} />}
                {sending ? "Sending..." : "Send to Admin"}
              </button>
            </form>
          </section>

          <section className="eventmate-panel rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900/70 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Messages</h2>
              <button
                type="button"
                onClick={fetchMessages}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-white/10 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <RefreshCcw size={13} />
                Refresh
              </button>
            </div>

            {loadingMessages ? (
              <p className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
                <Loader2 size={14} className="animate-spin" />
                Loading messages...
              </p>
            ) : messages.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-300">
                No messages sent yet.
              </p>
            ) : (
              <div className="space-y-3">
                {messages.map((item) => (
                  <article
                    key={item._id}
                    className="rounded-xl border border-slate-200 dark:border-white/10 p-3 bg-slate-50/70 dark:bg-white/5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.subject}</p>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          STATUS_STYLE[item.status] || STATUS_STYLE.UNREAD
                        }`}
                      >
                        {STATUS_LABEL[item.status] || STATUS_LABEL.UNREAD}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{item.message}</p>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Sent: {formatDateTime(item.createdAt)}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}


