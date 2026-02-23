import { useMemo, useState } from "react";
import { ArrowLeft, Award, CalendarDays, CheckCircle2, Clock3, Download, Eye, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const certificates = [
  {
    id: 1,
    eventName: "Inter-College Quiz Competition",
    eventType: "Seminar",
    date: "2025-01-15",
    time: "2:00 PM - 5:00 PM",
    location: "Multi-Purpose Hall",
    status: "Attended",
    certificateColor: "from-teal-500 to-cyan-500",
    description: "Test your technical skills, battle the best, and claim your victory.",
    attendanceDate: "Jan 15, 2025",
  },
  {
    id: 2,
    eventName: "Web Development Bootcamp",
    eventType: "Workshop",
    date: "2024-10-20",
    time: "10:00 AM - 4:00 PM",
    location: "Computer Lab A",
    status: "Completed",
    certificateColor: "from-indigo-500 to-blue-500",
    description: "Learn modern web development with HTML, CSS, JavaScript, and React.",
    attendanceDate: "Oct 20, 2024",
  },
  {
    id: 3,
    eventName: "UI/UX Design Workshop",
    eventType: "Workshop",
    date: "2024-09-10",
    time: "1:00 PM - 5:00 PM",
    location: "Design Studio",
    status: "Completed",
    certificateColor: "from-purple-500 to-fuchsia-500",
    description: "Master the principles of user experience and interface design.",
    attendanceDate: "Sep 10, 2024",
  },
  {
    id: 4,
    eventName: "Digital Marketing Seminar",
    eventType: "Seminar",
    date: "2024-08-05",
    time: "2:00 PM - 4:00 PM",
    location: "Auditorium",
    status: "Completed",
    certificateColor: "from-emerald-500 to-green-500",
    description: "Learn the latest strategies in digital marketing and social media.",
    attendanceDate: "Aug 5, 2024",
  },
];

export default function MyCertificates() {
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const stats = useMemo(() => {
    const total = certificates.length;
    const workshops = certificates.filter((item) => item.eventType === "Workshop").length;
    const seminars = certificates.filter((item) => item.eventType === "Seminar").length;
    const latest = certificates[0]?.attendanceDate || "N/A";
    return { total, workshops, seminars, latest };
  }, []);

  const handleDownload = (certificateName) => {
    alert(`Downloading: ${certificateName}`);
  };

  return (
    <div className="eventmate-page min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-6 space-y-6">
        <section className="eventmate-panel rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Link
                to="/student-dashboard"
                className="mt-1 rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10 transition"
              >
                <ArrowLeft size={18} />
              </Link>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">My Certificates</h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Review participation records and download your event certificates.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
              <Award size={13} />
              Certificate Vault
            </span>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <article className="eventmate-kpi rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-300">Total Certificates</p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </article>
          <article className="eventmate-kpi rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-300">Workshops</p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{stats.workshops}</p>
          </article>
          <article className="eventmate-kpi rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-300">Seminars</p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{stats.seminars}</p>
          </article>
          <article className="eventmate-kpi rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-300">Latest Attendance</p>
            <p className="mt-2 text-base font-bold text-gray-900 dark:text-white">{stats.latest}</p>
          </article>
        </section>

        <section className="grid gap-5">
          {certificates.map((cert) => (
            <article
              key={cert.id}
              className="eventmate-panel rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition p-5"
            >
              <div className="grid md:grid-cols-[220px_1fr] gap-5">
                <div className={`rounded-2xl bg-gradient-to-br ${cert.certificateColor} p-5 text-white flex flex-col justify-between min-h-[190px]`}>
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                    <Award size={20} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] opacity-80">Certificate</p>
                    <p className="mt-2 text-lg font-semibold leading-tight">{cert.eventType}</p>
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{cert.eventName}</h2>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                        <CheckCircle2 size={12} />
                        {cert.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{cert.description}</p>

                    <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
                      <div className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-200">
                        <CalendarDays size={14} className="text-indigo-500" />
                        {new Date(cert.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </div>
                      <div className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-200">
                        <Clock3 size={14} className="text-indigo-500" />
                        {cert.time}
                      </div>
                      <div className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-200">
                        <MapPin size={14} className="text-indigo-500" />
                        {cert.location}
                      </div>
                      <div className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-200">
                        <CheckCircle2 size={14} className="text-indigo-500" />
                        Attended: {cert.attendanceDate}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleDownload(cert.eventName)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 dark:border-indigo-400/40 dark:text-indigo-300 dark:hover:bg-indigo-500/15 transition"
                    >
                      <Download size={15} />
                      Download Certificate
                    </button>
                    <button
                      onClick={() => setSelectedCertificate(cert)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
                    >
                      <Eye size={15} />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>

      {selectedCertificate && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="w-full max-w-xl eventmate-panel rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedCertificate.eventName}</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{selectedCertificate.description}</p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-200">
              <p><span className="font-semibold">Type:</span> {selectedCertificate.eventType}</p>
              <p><span className="font-semibold">Status:</span> {selectedCertificate.status}</p>
              <p><span className="font-semibold">Date:</span> {selectedCertificate.date}</p>
              <p><span className="font-semibold">Time:</span> {selectedCertificate.time}</p>
              <p><span className="font-semibold">Location:</span> {selectedCertificate.location}</p>
              <p><span className="font-semibold">Attendance:</span> {selectedCertificate.attendanceDate}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCertificate(null)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
