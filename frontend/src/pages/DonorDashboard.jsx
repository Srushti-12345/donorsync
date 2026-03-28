import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../layout/DashboardLayout";
import DashboardCard from "../components/DashboardCard";
import LoadingSpinner from "../components/LoadingSpinner";
import FormInput from "../components/FormInput";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const DonorDashboard = () => {
  const { auth, setAuth } = useAuth();
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({
    city: "",
    state: "",
    age: "",
    gender: "Male",
    medicalNotes: "",
    availableForEmergency: true
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [profileRes, requestRes] = await Promise.all([
        api.get("/donors/mine"),
        api.get("/requests")
      ]);

      setProfile(profileRes.data);
      setRequests(requestRes.data);
      setForm({
        city: profileRes.data.city || "",
        state: profileRes.data.state || "",
        age: profileRes.data.age || "",
        gender: profileRes.data.gender || "Male",
        medicalNotes: profileRes.data.medicalNotes || "",
        availableForEmergency: profileRes.data.availableForEmergency
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load donor dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put("/donors/mine", {
        ...form,
        age: Number(form.age)
      });
      setProfile(data.donor);
      setAuth({
        ...auth,
        donorProfile: data.donor
      });
      toast.success("Donor profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <DashboardLayout heading="Donor Dashboard" subheading="Loading your donation activity">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      heading="Donor Dashboard"
      subheading="Track requests, keep your profile current, and stay ready for emergency matches."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Blood Group" value={auth?.user?.bloodGroup} hint="Your registered blood type" />
        <DashboardCard title="Availability" value={auth?.user?.isAvailable ? "Active" : "Offline"} hint="Respond quickly to urgent needs" tone="accent" />
        <DashboardCard title="Open Requests" value={requests.length} hint="Relevant active blood requests" tone="dark" />
        <DashboardCard title="Emergency Ready" value={form.availableForEmergency ? "Yes" : "No"} hint="Emergency matching preference" tone="accent" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.3fr]">
        <form className="card space-y-4" onSubmit={saveProfile}>
          <h3>Update Donor Profile</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="City" name="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <FormInput label="State" name="state" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            <FormInput label="Age" name="age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
            <label className="space-y-2">
              <span className="text-sm font-medium">Gender</span>
              <select className="input" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Medical Notes</span>
            <textarea
              className="input min-h-28 resize-y"
              value={form.medicalNotes}
              onChange={(e) => setForm({ ...form, medicalNotes: e.target.value })}
              placeholder="Optional donor notes"
            />
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <input
              type="checkbox"
              checked={form.availableForEmergency}
              onChange={(e) => setForm({ ...form, availableForEmergency: e.target.checked })}
            />
            <span className="text-sm">Available for emergency donation calls</span>
          </label>

          <button className="btn-primary w-full">Save Changes</button>
        </form>

        <div className="card">
          <h3>Nearby Active Requests</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="px-3 py-3">Patient</th>
                  <th className="px-3 py-3">Group</th>
                  <th className="px-3 py-3">Hospital</th>
                  <th className="px-3 py-3">Urgency</th>
                  <th className="px-3 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request._id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="px-3 py-3">{request.patientName}</td>
                    <td className="px-3 py-3">{request.bloodGroup}</td>
                    <td className="px-3 py-3">{request.hospital}</td>
                    <td className="px-3 py-3">{request.urgency}</td>
                    <td className="px-3 py-3">{request.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DonorDashboard;
