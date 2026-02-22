import {
  CalendarCheck2,
  Clock3,
  LogOut,
  MessageSquareMore,
  ShieldCheck,
  Sparkles,
  Users2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getStoredUser } from "../../lib/auth";
import { logoutUser } from "../../lib/logout";

const stats = [
  { label: "Events Assigned", value: "04", icon: CalendarCheck2, accent: "text-indigo-600" },
  { label: "Students Checked In", value: "132", icon: Users2, accent: "text-emerald-600" },
  { label: "Pending Checkpoints", value: "03", icon: Clock3, accent: "text-amber-600" },
  { label: "Compliance", value: "98%", icon: ShieldCheck, accent: "text-cyan-600" },
];

const tasks = [
  { title: "Verify registrations for Tech Fest", status: "High Priority", due: "Today, 4:00 PM" },
  { title: "Share hall setup checklist with organizers", status: "In Progress", due: "Tomorrow, 10:30 AM" },
  { title: "Collect attendance corrections", status: "Pending", due: "Feb 24, 2026" },
];

export default function CoordinatorDashboard() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login", { replace: true });
  };

  return (
    <div className="eventmate-page min-h-screen bg-gray-50 px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <section className="eventmate-panel rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900/70 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                <Sparkles size={13} />
                Coordinator Workspace
              </span>
              <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Coordinator Dashboard</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                Track event readiness, student participation, and coordination tasks from one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigate("/coordinator-dashboard/contact-admin")}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <MessageSquareMore size={15} />
                Contact Admin
              </button>
              <button
                type="button"
                onClick={() => navigate("/coordinator-dashboard/profile")}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Profile
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-400/30 dark:text-red-300 dark:hover:bg-red-500/15"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            Signed in as <span className="font-semibold text-slate-900 dark:text-white">{user?.fullName || "Coordinator"}</span>
            {" "}({user?.email || "coordinator@eventmate.com"})
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.label} className="eventmate-kpi rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900/70 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500 dark:text-slate-300">{item.label}</p>
                  <Icon size={16} className={item.accent} />
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{item.value}</p>
              </article>
            );
          })}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
          <section className="eventmate-panel rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900/70 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Priority Task Queue</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
              Keep these tasks updated so organizers and students stay aligned.
            </p>
            <div className="mt-4 space-y-3">
              {tasks.map((task) => (
                <article
                  key={task.title}
                  className="eventmate-kpi rounded-xl border border-slate-200 dark:border-white/10 p-4 bg-slate-50/80 dark:bg-white/5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-900 dark:text-white">{task.title}</p>
                    <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                      {task.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Due: {task.due}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="eventmate-panel rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900/70 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Coordination Insights</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="eventmate-kpi rounded-xl border border-slate-200 dark:border-white/10 p-4 bg-slate-50/80 dark:bg-white/5">
                <p className="font-semibold text-slate-900 dark:text-white">Most active event</p>
                <p className="text-slate-500 dark:text-slate-300 mt-1">TECH-2026-FEST</p>
              </div>
              <div className="eventmate-kpi rounded-xl border border-slate-200 dark:border-white/10 p-4 bg-slate-50/80 dark:bg-white/5">
                <p className="font-semibold text-slate-900 dark:text-white">Next operational sync</p>
                <p className="text-slate-500 dark:text-slate-300 mt-1">Feb 23, 2026 at 9:30 AM</p>
              </div>
              <div className="eventmate-kpi rounded-xl border border-slate-200 dark:border-white/10 p-4 bg-slate-50/80 dark:bg-white/5">
                <p className="font-semibold text-slate-900 dark:text-white">Escalation channel</p>
                <p className="text-slate-500 dark:text-slate-300 mt-1">Use Contact Admin for approvals and blockers.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
