export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-gray-950 border-t border-gray-300/90 dark:border-indigo-300/20 shadow-[inset_0_1px_0_rgba(99,102,241,0.08)]">
      <div className="pointer-events-none absolute -top-24 -left-24 h-56 w-56 rounded-full bg-blue-400/10 blur-3xl dark:bg-cyan-400/15" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-56 w-56 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-500/20" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 dark:from-cyan-300 dark:via-indigo-300 dark:to-fuchsia-300 bg-clip-text text-transparent">
            EventMate
          </h3>
          <p className="mt-3 text-sm text-gray-600 dark:text-slate-300">
            Making campus events smarter, simpler, and more rewarding for everyone.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 dark:text-indigo-100">Events</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-slate-300">
            <li className="transition-transform duration-200 hover:translate-x-1 hover:text-blue-600 dark:hover:text-cyan-300">Sports</li>
            <li className="transition-transform duration-200 hover:translate-x-1 hover:text-pink-600 dark:hover:text-pink-300">Cultural</li>
            <li className="transition-transform duration-200 hover:translate-x-1 hover:text-violet-600 dark:hover:text-violet-300">Technical</li>
            <li className="transition-transform duration-200 hover:translate-x-1 hover:text-emerald-600 dark:hover:text-emerald-300">Workshops</li>
            <li className="transition-transform duration-200 hover:translate-x-1 hover:text-amber-600 dark:hover:text-amber-300">Seminars</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 dark:text-indigo-100">Contact</h4>
          <p className="mt-3 text-sm text-gray-600 dark:text-slate-300">
            <span className="font-medium text-indigo-600 dark:text-cyan-300">Email: </span>
            eventmate@gmail.com
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
            <span className="font-medium text-indigo-600 dark:text-indigo-300">Address: </span>
            Balaji Ward, Chandrapur
          </p>
        </div>
      </div>

      <div className="border-t border-gray-300/80 dark:border-indigo-300/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-gray-600 dark:text-slate-300">
          <p>Copyright 2026 EventMate Inc. All rights reserved.</p>
          <div className="flex gap-5">
            <span className="cursor-pointer hover:text-indigo-600 dark:hover:text-cyan-300">Privacy Policy</span>
            <span className="cursor-pointer hover:text-indigo-600 dark:hover:text-violet-300">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
