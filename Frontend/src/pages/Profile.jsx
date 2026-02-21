import { useEffect, useState } from "react";
import api from "../lib/api";
import SummaryApi from "../common/SummaryApi";
import { storeAuth } from "../lib/auth";

const yearOptions = ["1st", "2nd", "3rd", "4th"];

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    collegeName: "",
    academicBranch: "",
    academicYear: "",
    professionalDepartment: "",
    professionalOccupation: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState({ profile: true, save: false, avatar: false });
  const [message, setMessage] = useState(null);

  const userToForm = (user) => ({
    fullName: user?.fullName || "",
    mobileNumber: user?.mobileNumber || "",
    collegeName: user?.collegeName || "",
    academicBranch: user?.academicProfile?.branch || "",
    academicYear: user?.academicProfile?.year || "",
    professionalDepartment: user?.professionalProfile?.department || "",
    professionalOccupation: user?.professionalProfile?.occupation || "",
  });

  const loadProfile = async () => {
    setLoading((prev) => ({ ...prev, profile: true }));
    setMessage(null);
    try {
      const response = await api({ ...SummaryApi.get_profile });
      const user = response.data?.user || null;
      setProfile(user);
      setFormData(userToForm(user));
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Unable to load profile.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, save: true }));
    setMessage(null);
    try {
      const payload = {
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber || undefined,
        collegeName: formData.collegeName || undefined,
        academicProfile: {
          branch: formData.academicBranch || undefined,
          year: formData.academicYear || undefined,
        },
        professionalProfile: {
          department: formData.professionalDepartment || undefined,
          occupation: formData.professionalOccupation || undefined,
        },
      };

      const response = await api({ ...SummaryApi.update_profile, data: payload });
      const updated = response.data?.user;
      if (updated) {
        setProfile(updated);
        setFormData(userToForm(updated));
        storeAuth({ user: updated });
      }
      setMessage({ type: "success", text: response.data?.message || "Profile updated." });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Unable to update profile.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, save: false }));
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      setMessage({ type: "error", text: "Please select an image first." });
      return;
    }
    setLoading((prev) => ({ ...prev, avatar: true }));
    setMessage(null);
    try {
      const form = new FormData();
      form.append("avatar", avatarFile);
      const response = await api({
        ...SummaryApi.upload_avatar,
        data: form,
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newAvatar = response.data?.avatar;
      if (newAvatar) {
        const nextProfile = { ...profile, avatar: newAvatar };
        setProfile(nextProfile);
        storeAuth({ user: nextProfile });
      }
      setAvatarFile(null);
      setMessage({ type: "success", text: response.data?.message || "Avatar updated." });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Unable to upload avatar.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, avatar: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Update your profile details and avatar.</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {message && (
          <p
            className={`mb-6 text-sm text-center rounded-lg py-2 ${
              message.type === "success"
                ? "text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20"
                : "text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/20"
            }`}
          >
            {message.text}
          </p>
        )}

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Avatar</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Upload a profile photo.</p>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="h-20 w-20 rounded-full border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-lg font-semibold text-gray-500 dark:text-gray-300">
                    {profile?.fullName?.[0] || "U"}
                  </span>
                )}
              </div>
              <div className="w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-600 dark:text-gray-300"
                />
                <button
                  type="button"
                  onClick={handleAvatarUpload}
                  disabled={loading.avatar}
                  className="mt-3 w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-900 dark:bg-indigo-600 text-white text-sm font-semibold hover:bg-gray-800 dark:hover:bg-indigo-700 disabled:opacity-70"
                >
                  {loading.avatar ? "Uploading..." : "Upload Avatar"}
                </button>
              </div>
            </div>
          </section>

          <section className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Personal Details</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Keep your information up to date.</p>

            {loading.profile ? (
              <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">Loading profile...</p>
            ) : (
              <form onSubmit={handleSave} className="mt-6 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900/60 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/30"
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mobile Number</label>
                    <input
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900/60 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/30"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">College Name</label>
                    <input
                      name="collegeName"
                      value={formData.collegeName}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900/60 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/30"
                      autoComplete="organization"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Academic Branch</label>
                    <input
                      name="academicBranch"
                      value={formData.academicBranch}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900/60 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/30"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Academic Year</label>
                    <select
                      name="academicYear"
                      value={formData.academicYear}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900/60 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/30"
                    >
                      <option value="">Select year</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                    <input
                      name="professionalDepartment"
                      value={formData.professionalDepartment}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900/60 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Occupation</label>
                  <input
                    name="professionalOccupation"
                    value={formData.professionalOccupation}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900/60 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/30"
                    autoComplete="organization-title"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading.save}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-70"
                >
                  {loading.save ? "Saving..." : "Save Changes"}
                </button>
              </form>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
