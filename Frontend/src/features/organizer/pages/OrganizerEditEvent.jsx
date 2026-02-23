import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowLeft, Loader2, Plus, Trash2, UploadCloud } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../shared/lib/api";
import SummaryApi from "../../../shared/api/SummaryApi";

const initialForm = {
  title: "",
  description: "",
  category: "",
  maxParticipants: "",
  participationMode: "INDIVIDUAL",
  maxTeamMembers: "4",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  venueLocation: "",
  registrationOpen: true,
  sendNotification: true,
  registrationFee: "",
  status: "Draft",
  poster: null,
};

const toDateInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

export default function OrganizerEditEvent() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [form, setForm] = useState(initialForm);
  const [eventData, setEventData] = useState(null);
  const [coordinators, setCoordinators] = useState([]);
  const [selectedCoordinators, setSelectedCoordinators] = useState([]);
  const [nextCoordinatorId, setNextCoordinatorId] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setMessage(null);
      try {
        const [eventsResponse, coordinatorsResponse] = await Promise.all([
          api({ ...SummaryApi.get_my_events }),
          api({ ...SummaryApi.get_event_coordinators }),
        ]);

        const events = eventsResponse.data?.events || [];
        const event = events.find((item) => String(item._id) === String(eventId));
        if (!event) {
          setMessage({ type: "error", text: "Event not found or access denied." });
          setLoading(false);
          return;
        }

        const coordinatorList = coordinatorsResponse.data?.coordinators || [];
        setCoordinators(coordinatorList);

        const existingSelected = (event.studentCoordinators || []).map((item) => ({
          _id: item.coordinatorId || `email:${item.email || item.name || Math.random()}`,
          fullName: item.name || "Coordinator",
          email: item.email || "",
        }));

        setEventData(event);
        setSelectedCoordinators(existingSelected);
        setPreviewUrl(event.posterUrl || "");
        setForm({
          title: event.title || "",
          description: event.description || "",
          category: event.category || "",
          maxParticipants: event.registration?.maxParticipants ? String(event.registration.maxParticipants) : "",
          participationMode: event.registration?.participationMode || "INDIVIDUAL",
          maxTeamMembers: event.registration?.maxTeamMembers ? String(event.registration.maxTeamMembers) : "4",
          startDate: toDateInput(event.schedule?.startDate),
          startTime: event.schedule?.startTime || "",
          endDate: toDateInput(event.schedule?.endDate),
          endTime: event.schedule?.endTime || "",
          venueLocation: event.venue?.location || "",
          registrationOpen: event.registration?.isOpen !== false,
          sendNotification: event.notifications?.sendToStudents !== false,
          registrationFee: typeof event.registration?.fee === "number" ? String(event.registration.fee) : "",
          status: event.status || "Draft",
          poster: null,
        });
      } catch (error) {
        setMessage({
          type: "error",
          text: error.response?.data?.message || "Unable to load event details.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [eventId]);

  useEffect(() => {
    if (!form.poster) return;
    const url = URL.createObjectURL(form.poster);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [form.poster]);

  const selectableCoordinators = useMemo(() => {
    const selectedIds = new Set(selectedCoordinators.map((item) => String(item._id)));
    return coordinators.filter((item) => !selectedIds.has(String(item._id)));
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
    const found = coordinators.find((item) => String(item._id) === String(nextCoordinatorId));
    if (!found) return;
    setSelectedCoordinators((prev) => [...prev, found]);
    setNextCoordinatorId("");
  };

  const removeCoordinator = (id) => {
    setSelectedCoordinators((prev) => prev.filter((item) => String(item._id) !== String(id)));
  };

  const buildPayload = () => {
    const payload = new FormData();
    payload.append("title", form.title.trim());
    payload.append("description", form.description.trim());
    payload.append("category", form.category);
    payload.append("status", form.status);
    payload.append("sendNotification", String(form.sendNotification));

    if (form.poster) {
      payload.append("poster", form.poster);
    }

    const schedule = {};
    if (form.startDate) schedule.startDate = form.startDate;
    if (form.endDate) schedule.endDate = form.endDate;
    if (form.startTime) schedule.startTime = form.startTime;
    if (form.endTime) schedule.endTime = form.endTime;
    payload.append("schedule", JSON.stringify(schedule));

    const venue = {
      mode: "OFFLINE",
      location: form.venueLocation.trim(),
    };
    payload.append("venue", JSON.stringify(venue));

    const registration = {
      isOpen: !!form.registrationOpen,
      fee: form.registrationFee ? Number(form.registrationFee) : 0,
      maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : undefined,
      participationMode: form.participationMode,
      maxTeamMembers:
        form.participationMode === "INDIVIDUAL"
          ? undefined
          : form.maxTeamMembers
            ? Number(form.maxTeamMembers)
            : 4,
    };
    payload.append("registration", JSON.stringify(registration));

    payload.append("certificate", JSON.stringify({ isEnabled: true }));
    payload.append("feedback", JSON.stringify({ enabled: true }));

    payload.append(
      "studentCoordinators",
      JSON.stringify(
        selectedCoordinators.map((item) => ({
          coordinatorId: String(item._id).startsWith("email:") ? null : item._id,
          name: item.fullName || item.name || "",
          email: item.email || "",
        }))
      )
    );

    return payload;
  };

  const handleSubmit = async () => {
    setMessage(null);
    if (!form.title.trim() || !form.category) {
      setMessage({ type: "error", text: "Event title and category are required." });
      return;
    }
    if (form.status === "Published" && !form.poster && !eventData?.posterUrl) {
      setMessage({ type: "error", text: "Event banner is required to publish." });
      return;
    }

    setIsSaving(true);
    try {
      const response = await api({
        ...SummaryApi.update_event,
        url: SummaryApi.update_event.url.replace(":eventId", eventId),
        data: buildPayload(),
      });

      setMessage({
        type: "success",
        text: response.data?.message || "Event updated successfully.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Unable to update event.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="eventmate-page min-h-screen bg-slate-100/80 dark:bg-gray-900 px-4 sm:px-6 py-8">
        <div className="max-w-5xl mx-auto text-sm text-slate-600 dark:text-slate-300 inline-flex items-center gap-2">
          <Loader2 size={14} className="animate-spin" />
          Loading event...
        </div>
      </div>
    );
  }

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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Edit Event</h1>
              <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">
                Update your event details dynamically.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-70"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : null}
              Save Changes
            </button>
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
                      className="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Status</label>
                      <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
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
                      <option value="">Select coordinator</option>
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
                      Add
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
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{coordinator.fullName || coordinator.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{coordinator.email || "No email"}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCoordinator(coordinator._id)}
                        className="rounded-md p-1 text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/15"
                        aria-label="Remove coordinator"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  {selectedCoordinators.length === 0 && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">No coordinator selected.</p>
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
                    Upload new banner if you want to replace existing one
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
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Participation Mode</label>
                  <select
                    name="participationMode"
                    value={form.participationMode}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    <option value="INDIVIDUAL">Single Participant</option>
                    <option value="TEAM">Team Only</option>
                    <option value="BOTH">Both (Single + Team)</option>
                  </select>
                </div>
                {form.participationMode !== "INDIVIDUAL" && (
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Max Team Members</label>
                    <input
                      type="number"
                      min="2"
                      max="20"
                      name="maxTeamMembers"
                      value={form.maxTeamMembers}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      Includes team leader. Example: 5 means 1 leader + 4 members.
                    </p>
                  </div>
                )}
              </section>

              {!previewUrl && form.status === "Published" && (
                <p className="text-xs text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-500/15 rounded-lg px-3 py-2 inline-flex items-center gap-2">
                  <AlertCircle size={13} />
                  Banner is required for published events.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
