export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-300/90 dark:border-white/20 shadow-[inset_0_1px_0_rgba(99,102,241,0.08)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            EventMate
          </h3>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Making campus events smarter, simpler, and more rewarding for everyone.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">Events</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            {["Sports", "Cultural", "Technical", "Workshops", "Seminars"].map((item) => (
              <li key={item} className="transition-transform duration-200 hover:translate-x-1 hover:text-indigo-600 dark:hover:text-indigo-300">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">Contact</h4>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">eventmate@gmail.com</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Balaji Ward, Chandrapur</p>
        </div>
      </div>

      <div className="border-t border-gray-300/80 dark:border-white/15">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-gray-600 dark:text-gray-400">
          <p>Copyright 2026 EventMate Inc. All rights reserved.</p>
          <div className="flex gap-5">
            <span className="cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-300">Privacy Policy</span>
            <span className="cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-300">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
