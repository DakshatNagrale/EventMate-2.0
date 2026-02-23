import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CalendarDays, Loader2, Pencil, Search, Users, X } from "lucide-react";
import api from "../../../shared/lib/api";
import SummaryApi from "../../../shared/api/SummaryApi";

const STATUS_STYLES = {
  ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  ON_HOLD: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  SUSPENDED: "bg-slate-200 text-slate-700 dark:bg-slate-600/40 dark:text-slate-200",
  UNKNOWN: "bg-slate-100 text-slate-700 dark:bg-slate-700/50 dark:text-slate-200",
};

const formatDateTime = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString([], { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
};

const EMPTY_FORM = {
  coordinatorId: "",
  fullName: "",
  scope: "",
  assignedEventId: "",
  status: "ACTIVE",
};

export default function OrganizerCoordinatorManagement() {
  const [summary, setSummary] = useState({
    totalCoordinators: 0,
    activeCoordinators: 0,
    totalAssignments: 0,
    publishedAssignments: 0,
  });
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingId, setPendingId] = useState(null);
  const [formState, setFormState] = useState(EMPTY_FORM);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCoordinatorActivity = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api({ ...SummaryApi.get_organizer_coordinator_activity });
      setSummary(response.data?.summary || summary);
      setCoordinators(response.data?.coordinators || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load coordinator activity.");
      setCoordinators([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoordinatorActivity();
  }, []);

  const filteredCoordinators = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return coordinators;

    return coordinators.filter((item) => {
      const recentTitles = (item.recentAssignments || []).map((assignment) => assignment.title).join(" ").toLowerCase();
      return (
        String(item.fullName || "").toLowerCase().includes(term) ||
        String(item.email || "").toLowerCase().includes(term) ||
        String(item.scope || "").toLowerCase().includes(term) ||
        String(item.assignedEventId || "").toLowerCase().includes(term) ||
        recentTitles.includes(term)
      );
    });
  }, [coordinators, searchTerm]);

  const openManageModal = (coordinator) => {
    if (!coordinator?.coordinatorId) return;
    setFormState({
      coordinatorId: coordinator.coordinatorId,
      fullName: coordinator.fullName || "",
      scope: coordinator.scope || "",
      assignedEventId: coordinator.assignedEventId || "",
      status: coordinator.status || "ACTIVE",
    });
    setIsModalOpen(true);
  };

  const closeManageModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setFormState(EMPTY_FORM);
  };

  const updateCoordinator = async (payload, coordinatorId) => {
    setPendingId(coordinatorId);
    setMessage(null);
    try {
      const response = await api({
        ...SummaryApi.update_event_coordinator,
        url: SummaryApi.update_event_coordinator.url.replace(":id", coordinatorId),
        data: payload,
      });

      const updated = response.data?.coordinator;
      if (updated?._id) {
        setCoordinators((prev) =>
          prev.map((item) =>
            item.coordinatorId === updated._id
              ? {
                  ...item,
                  fullName: updated.fullName,
                  email: updated.email,
                  mobileNumber: updated.mobileNumber,
                  scope: updated.scope,
                  assignedEventId: updated.assignedEventId,
                  status: updated.status,
                  isActive: updated.isActive,
                }
              : item
          )
        );
      } else {
        await fetchCoordinatorActivity();
      }

      setMessage({ type: "success", text: response.data?.message || "Coordinator updated successfully." });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Unable to update coordinator." });
    } finally {
      setPendingId(null);
    }
  };

  const handleQuickStatus = async (coordinator) => {
    if (!coordinator?.coordinatorId) return;
    const nextStatus = coordinator.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
    await updateCoordinator({ status: nextStatus }, coordinator.coordinatorId);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!formState.coordinatorId) return;

    setIsSaving(true);
    try {
      await updateCoordinator(
        {
          scope: formState.scope.trim(),
          assignedEventId: formState.assignedEventId.trim(),
          status: formState.status,
        },
        formState.coordinatorId
      );
      setIsModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="eventmate-page min-h-screen bg-slate-100/80 dark:bg-gray-900 px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <section className="eventmate-panel rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900/70 p-5 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Coordinator Management</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Monitor coordinator activity and manage assignment status for your events.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-5">
            <article className="eventmate-kpi rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900/50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Total Coordinators</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{summary.totalCoordinators}</p>
            </article>
            <article className="eventmate-kpi rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900/50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Active</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{summary.activeCoordinators}</p>
            </article>
            <article className="eventmate-kpi rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900/50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Assignments</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{summary.totalAssignments}</p>
            </article>
            <article className="eventmate-kpi rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900/50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Published Events</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{summary.publishedAssignments}</p>
            </article>
          </div>

          <div className="mt-4">
            <label className="relative block">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search coordinator, scope, or assigned event..."
                className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 py-2.5 pl-9 pr-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </label>
          </div>

          {message && (
            <p
              className={`mt-4 text-sm rounded-lg py-2 px-3 ${
                message.type === "success"
                  ? "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-500/15"
                  : "text-red-600 bg-red-50 dark:text-red-300 dark:bg-red-500/15"
              }`}
            >
              {message.text}
            </p>
          )}

          {loading && (
            <p className="mt-6 text-sm text-slate-500 dark:text-slate-300 inline-flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              Loading coordinator activity...
            </p>
          )}

          {error && !loading && <p className="mt-6 text-sm text-red-600 dark:text-red-300">{error}</p>}

          {!loading && !error && (
            <div className="mt-5 space-y-4">
              {filteredCoordinators.map((coordinator) => {
                const statusClass = STATUS_STYLES[coordinator.status] || STATUS_STYLES.UNKNOWN;
                const isPending = pendingId === coordinator.coordinatorId;

                return (
                  <article
                    key={`${coordinator.coordinatorId || coordinator.email}-${coordinator.lastActivityAt || ""}`}
                    className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900/40 p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{coordinator.fullName || "Coordinator"}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-300">{coordinator.email || "No email"}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Scope: {coordinator.scope || "Not set"} | Assigned Event ID: {coordinator.assignedEventId || "Not set"}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass}`}>
                          {coordinator.status || "UNKNOWN"}
                        </span>
                        <button
                          type="button"
                          disabled={isPending || !coordinator.coordinatorId}
                          onClick={() => handleQuickStatus(coordinator)}
                          className="rounded-lg border border-slate-200 dark:border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-60"
                        >
                          {coordinator.status === "SUSPENDED" ? "Activate" : "Suspend"}
                        </button>
                        <button
                          type="button"
                          disabled={!coordinator.coordinatorId}
                          onClick={() => openManageModal(coordinator)}
                          className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                        >
                          <Pencil size={12} />
                          Manage
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
                      <div className="rounded-lg border border-slate-200 dark:border-white/10 p-3">
                        <p className="text-slate-500 dark:text-slate-400">Assigned</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{coordinator.assignedEventsCount}</p>
                      </div>
                      <div className="rounded-lg border border-slate-200 dark:border-white/10 p-3">
                        <p className="text-slate-500 dark:text-slate-400">Published</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{coordinator.publishedCount}</p>
                      </div>
                      <div className="rounded-lg border border-slate-200 dark:border-white/10 p-3">
                        <p className="text-slate-500 dark:text-slate-400">Completed</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{coordinator.completedCount}</p>
                      </div>
                      <div className="rounded-lg border border-slate-200 dark:border-white/10 p-3">
                        <p className="text-slate-500 dark:text-slate-400">Last Activity</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{formatDateTime(coordinator.lastActivityAt)}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white inline-flex items-center gap-2">
                        <CalendarDays size={14} />
                        Recent Assignments
                      </p>
                      <ul className="mt-2 space-y-2">
                        {(coordinator.recentAssignments || []).length > 0 ? (
                          coordinator.recentAssignments.map((assignment) => (
                            <li
                              key={`${coordinator.coordinatorId || coordinator.email}-${assignment.eventId}`}
                              className="rounded-lg border border-slate-200 dark:border-white/10 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between gap-3"
                            >
                              <span className="font-medium text-slate-800 dark:text-slate-100">{assignment.title}</span>
                              <span className="text-slate-500 dark:text-slate-400">{assignment.status}</span>
                            </li>
                          ))
                        ) : (
                          <li className="rounded-lg border border-dashed border-slate-200 dark:border-white/10 px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
                            No recent assignments.
                          </li>
                        )}
                      </ul>
                    </div>
                  </article>
                );
              })}

              {filteredCoordinators.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 dark:border-white/15 p-8 text-center text-slate-500 dark:text-slate-300">
                  <Users size={24} className="mx-auto mb-2 opacity-70" />
                  No coordinator activity found for your events.
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/55 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Manage Coordinator</h2>
                <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">{formState.fullName}</p>
              </div>
              <button
                type="button"
                onClick={closeManageModal}
                disabled={isSaving}
                className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 disabled:opacity-60"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <form className="mt-4 space-y-3" onSubmit={handleFormSubmit}>
              <label className="block">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Scope / Department</span>
                <input
                  type="text"
                  value={formState.scope}
                  onChange={(event) => setFormState((prev) => ({ ...prev, scope: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 py-2.5 px-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="Technical Ops"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Assigned Event ID</span>
                <input
                  type="text"
                  value={formState.assignedEventId}
                  onChange={(event) => setFormState((prev) => ({ ...prev, assignedEventId: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 py-2.5 px-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="EVENT-2026-001"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Status</span>
                <select
                  value={formState.status}
                  onChange={(event) => setFormState((prev) => ({ ...prev, status: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 py-2.5 px-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="ON_HOLD">On Hold</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </label>

              <p className="text-xs text-slate-500 dark:text-slate-400 inline-flex items-start gap-2">
                <AlertCircle size={14} className="mt-0.5" />
                Status and scope updates affect coordinator assignment visibility across organizer events.
              </p>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={closeManageModal}
                  disabled={isSaving}
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-70"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : null}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
