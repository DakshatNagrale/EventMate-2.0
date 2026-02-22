import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowLeft, Loader2, Plus, Trash2, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import SummaryApi from "../../common/SummaryApi";

const initialForm = {
  title: "",
  description: "",
  category: "",
  maxParticipants: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  venueLocation: "",
  registrationOpen: true,
  sendNotification: true,
  registrationFee: "",
  poster: null,
};

export default function OrganizerCreateEvent() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [coordinators, setCoordinators] = useState([]);
  const [selectedCoordinators, setSelectedCoordinators] = useState([]);
  const [nextCoordinatorId, setNextCoordinatorId] = useState("");
  const [message, setMessage] = useState(null);
  const [loadingCoordinators, setLoadingCoordinators] = useState(true);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const fetchCoordinators = async () => {
      setLoadingCoordinators(true);
      try {
        const response = await api({ ...SummaryApi.get_event_coordinators });
        setCoordinators(response.data?.coordinators || []);
      } catch {
        setCoordinators([]);
      } finally {
        setLoadingCoordinators(false);
      }
    };
    fetchCoordinators();
  }, []);

  useEffect(() => {
    if (!form.poster) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(form.poster);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [form.poster]);

  const selectableCoordinators = useMemo(() => {
    const selectedIds = new Set(selectedCoordinators.map((item) => item._id));
    return coordinators.filter((item) => !selectedIds.has(item._id));
  }, [coordinators, selectedCoordinators]);

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
      return;
    }
    if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files?.[0] || null }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addCoordinator = () => {
    if (!nextCoordinatorId) return;
    const found = coordinators.find((item) => item._id === nextCoordinatorId);
    if (!found) return;
    setSelectedCoordinators((prev) => [...prev, found]);
    setNextCoordinatorId("");
  };

  const removeCoordinator = (id) => {
    setSelectedCoordinators((prev) => prev.filter((item) => item._id !== id));
  };

  const buildPayload = (status) => {
    const payload = new FormData();
    payload.append("title", form.title.trim());
    payload.append("description", form.description.trim());
    payload.append("category", form.category);
    payload.append("status", status);
    payload.append("sendNotification", String(form.sendNotification));

    if (form.poster) {
      payload.append("poster", form.poster);
    }

    const schedule = {};
    if (form.startDate) schedule.startDate = form.startDate;
    if (form.endDate) schedule.endDate = form.endDate;
    if (form.startTime) schedule.startTime = form.startTime;
    if (form.endTime) schedule.endTime = form.endTime;
    if (Object.keys(schedule).length) payload.append("schedule", JSON.stringify(schedule));

    const venue = {};
    if (form.venueLocation.trim()) {
      venue.mode = "OFFLINE";
      venue.location = form.venueLocation.trim();
    }
    if (Object.keys(venue).length) payload.append("venue", JSON.stringify(venue));

    const registration = {
      isOpen: !!form.registrationOpen,
      fee: form.registrationFee ? Number(form.registrationFee) : 0,
      maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : undefined,
    };
    payload.append("registration", JSON.stringify(registration));

    payload.append("certificate", JSON.stringify({ isEnabled: true }));
    payload.append("feedback", JSON.stringify({ enabled: true }));

    payload.append(
      "studentCoordinators",
      JSON.stringify(
        selectedCoordinators.map((item) => ({
          coordinatorId: item._id,
          name: item.fullName,
          email: item.email,
        }))
      )
    );

    return payload;
  };

  const submitEvent = async (status) => {
    setMessage(null);
    const isPublish = status === "Published";
    if (!form.title.trim() || !form.category) {
      setMessage({ type: "error", text: "Event title and category are required." });
      return;
    }
    if (isPublish && !form.poster) {
      setMessage({ type: "error", text: "Please upload an event banner before publishing." });
      return;
    }

    if (isPublish) {
      setIsPublishing(true);
    } else {
      setIsSavingDraft(true);
    }

    try {
      const payload = buildPayload(status);
      const response = await api({
        ...SummaryApi.create_event,
        data: payload,
      });

      setMessage({
        type: "success",
        text: response.data?.message || (isPublish ? "Event published." : "Draft saved."),
      });

      setForm(initialForm);
      setSelectedCoordinators([]);
      setNextCoordinatorId("");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Unable to create event.",
      });
    } finally {
      setIsPublishing(false);
      setIsSavingDraft(false);
    }
  };

  return (
    <div className="eventmate-page min-h-screen bg-slate-100/80 dark:bg-gray-900 px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <button
          type="button"
          onClick={() => navigate("/organizer-dashboard")}
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <section className="mt-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900/70 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Create New Event</h1>
              <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">
                Fill in details below to publish a new event for students.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate("/organizer-dashboard")}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => submitEvent("Draft")}
                disabled={isSavingDraft || isPublishing}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-70"
              >
                {isSavingDraft ? <Loader2 size={14} className="animate-spin" /> : null}
                Save as Draft
              </button>
            </div>
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

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-4">
            <div className="space-y-4">
              <section className="eventmate-panel rounded-xl border border-slate-200 dark:border-white/10 p-4">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Basic Information</h2>
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Event Title</label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g. Annual Tech Hackathon 2026"
                      className="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-300">About the Event</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Brief description for event card and detailed view."
                      className="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Category</label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      >
                        <option value="">Select category</option>
                        <option value="Technical">Technical</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Sports">Sports</option>
                        <option value="Workshop">Workshop</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Max Participants</label>
                      <input
                        type="number"
                        min="0"
                        name="maxParticipants"
                        value={form.maxParticipants}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="eventmate-panel rounded-xl border border-slate-200 dark:border-white/10 p-4">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Date, Time & Venue</h2>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={form.startDate}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Start Time</label>
                    <input
                      type="time"
                      name="startTime"
                      value={form.startTime}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-300">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={form.endDate}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-300">End Time</label>
                    <input
                      type="time"
                      name="endTime"
                      value={form.endTime}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Venue / Location</label>
                    <input
                      name="venueLocation"
                      value={form.venueLocation}
                      onChange={handleChange}
                      placeholder="e.g. Auditorium Hall B, Main Campus"
                      className="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                </div>
              </section>

              <section className="eventmate-panel rounded-xl border border-slate-200 dark:border-white/10 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Student Coordinators</h2>
                  <div className="flex gap-2">
                    <select
                      value={nextCoordinatorId}
                      onChange={(event) => setNextCoordinatorId(event.target.value)}
                      className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-2 py-1.5 text-xs text-slate-800 dark:text-slate-100"
                    >
                      <option value="">
                        {loadingCoordinators ? "Loading coordinators..." : "Select coordinator"}
                      </option>
                      {selectableCoordinators.map((coordinator) => (
                        <option key={coordinator._id} value={coordinator._id}>
                          {coordinator.fullName} ({coordinator.email})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={addCoordinator}
                      disabled={!nextCoordinatorId}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-white/10 px-2 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-60"
                    >
                      <Plus size={12} />
                      Add Coordinator
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  {selectedCoordinators.map((coordinator) => (
                    <div
                      key={coordinator._id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-white/10 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{coordinator.fullName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{coordinator.email}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCoordinator(coordinator._id)}
                        className="rounded-md p-1 text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/15"
                        aria-label={`Remove ${coordinator.fullName}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  {selectedCoordinators.length === 0 && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">No coordinator selected yet.</p>
                  )}
                </div>
              </section>
            </div>

            <div className="space-y-4">
              <section className="eventmate-panel rounded-xl border border-slate-200 dark:border-white/10 p-4">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Event Banner</h2>
                <label className="mt-3 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 dark:border-white/20 p-5 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5">
                  <UploadCloud size={18} className="text-indigo-500" />
                  <span className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                    Upload .PNG, .JPG up to 10MB
                  </span>
                  <input
                    type="file"
                    name="poster"
                    onChange={handleChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Event banner preview"
                    className="mt-3 h-36 w-full rounded-lg object-cover border border-slate-200 dark:border-white/10"
                  />
                )}
              </section>

              <section className="eventmate-panel rounded-xl border border-slate-200 dark:border-white/10 p-4 space-y-3">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Visibility & Registration</h2>
                <label className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    name="registrationOpen"
                    checked={form.registrationOpen}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4"
                  />
                  <span>Open Registration</span>
                </label>
                <label className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    name="sendNotification"
                    checked={form.sendNotification}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4"
                  />
                  <span>Send Notification</span>
                </label>
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Registration Fee</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="registrationFee"
                    value={form.registrationFee}
                    onChange={handleChange}
                    placeholder="0 for free"
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </section>

              <button
                type="button"
                onClick={() => submitEvent("Published")}
                disabled={isPublishing || isSavingDraft}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-70"
              >
                {isPublishing ? <Loader2 size={15} className="animate-spin" /> : null}
                Publish Event
              </button>

              <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                By publishing, you agree to the Event Policy.
              </p>
            </div>
          </div>

          {!form.poster && (
            <p className="mt-4 text-xs text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-500/15 rounded-lg px-3 py-2 inline-flex items-center gap-2">
              <AlertCircle size={13} />
              Banner is optional for draft but required for publish.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}



