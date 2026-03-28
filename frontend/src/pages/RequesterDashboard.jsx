import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../layout/DashboardLayout";
import DashboardCard from "../components/DashboardCard";
import LoadingSpinner from "../components/LoadingSpinner";
import FormInput from "../components/FormInput";
import ConfirmModal from "../components/ConfirmModal";
import api from "../services/api";

const emptyRequest = {
  patientName: "",
  bloodGroup: "A+",
  unitsRequired: 1,
  hospital: "",
  city: "",
  neededDate: "",
  urgency: "Medium",
  notes: ""
};

const RequesterDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [donors, setDonors] = useState([]);
  const [form, setForm] = useState(emptyRequest);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = async () => {
    try {
      const [requestsRes, donorsRes] = await Promise.all([
        api.get("/requests"),
        api.get("/donors")
      ]);
      setRequests(requestsRes.data);
      setDonors(donorsRes.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load requester dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createRequest = async (e) => {
    e.preventDefault();
    try {
      await api.post("/requests", form);
      toast.success("Blood request created");
      setForm(emptyRequest);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create request");
    }
  };

  const deleteRequest = async () => {
    try {
      await api.delete(`/requests/${deleteId}`);
      toast.success("Request deleted");
      setDeleteId(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <DashboardLayout heading="Requester Dashboard" subheading="Loading your requests and donor matches">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      heading="Requester Dashboard"
      subheading="Create blood requests, review donor availability, and monitor urgent cases."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="My Requests" value={requests.length} hint="Submitted requests" />
        <DashboardCard title="Available Donors" value={donors.length} hint="Currently searchable donor profiles" tone="accent" />
        <DashboardCard title="Critical Requests" value={requests.filter((item) => item.urgency === "Critical").length} hint="Requires immediate action" tone="dark" />
        <DashboardCard title="Completed" value={requests.filter((item) => item.status === "Completed").length} hint="Successfully fulfilled cases" tone="accent" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <form className="card space-y-4" onSubmit={createRequest}>
          <h3>Create Blood Request</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Patient Name" name="patientName" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} />
            <FormInput label="Hospital" name="hospital" value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })} />
            <FormInput label="City" name="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <FormInput label="Needed Date" name="neededDate" type="date" value={form.neededDate} onChange={(e) => setForm({ ...form, neededDate: e.target.value })} />
            <label className="space-y-2">
              <span className="text-sm font-medium">Blood Group</span>
              <select className="input" value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                  <option key={group}>{group}</option>
                ))}
              </select>
            </label>
            <FormInput label="Units Required" name="unitsRequired" type="number" value={form.unitsRequired} onChange={(e) => setForm({ ...form, unitsRequired: e.target.value })} />
            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-medium">Urgency</span>
              <select className="input" value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Notes</span>
            <textarea
              className="input min-h-28 resize-y"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Extra instructions or case details"
            />
          </label>

          <button className="btn-primary w-full">Submit Request</button>
        </form>

        <div className="space-y-6">
          <div className="card">
            <h3>My Requests</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="px-3 py-3">Patient</th>
                    <th className="px-3 py-3">Group</th>
                    <th className="px-3 py-3">Urgency</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request._id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="px-3 py-3">{request.patientName}</td>
                      <td className="px-3 py-3">{request.bloodGroup}</td>
                      <td className="px-3 py-3">{request.urgency}</td>
                      <td className="px-3 py-3">{request.status}</td>
                      <td className="px-3 py-3">
                        <button className="text-sm font-semibold text-brand-primary" onClick={() => setDeleteId(request._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h3>Available Donors</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {donors.slice(0, 6).map((donor) => (
                <div key={donor._id} className="rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-1 dark:border-slate-700">
                  <p className="font-semibold">{donor.user?.name}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{donor.city}, {donor.state}</p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="rounded-full bg-red-100 px-3 py-1 text-brand-primary dark:bg-red-500/10">
                      {donor.user?.bloodGroup}
                    </span>
                    <span className="text-brand-accent">{donor.availableForEmergency ? "Emergency Ready" : "Standard"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete Request"
        message="This will permanently remove the request from your dashboard."
        onClose={() => setDeleteId(null)}
        onConfirm={deleteRequest}
      />
    </DashboardLayout>
  );
};

export default RequesterDashboard;
