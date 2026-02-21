import { Link } from "react-router-dom";

export default function Settings() {
  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-xl w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 sm:p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Settings will be available soon. You can update your personal details in the profile page.
        </p>
        <Link
          to="/profile"
          className="inline-flex mt-6 px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
        >
          Go to Profile
        </Link>
      </div>
    </section>
  );
}
