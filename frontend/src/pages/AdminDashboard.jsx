import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../layout/DashboardLayout";
import DashboardCard from "../components/DashboardCard";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../services/api";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [usersRes, donorsRes, requestsRes] = await Promise.all([
        api.get("/users"),
        api.get("/donors"),
        api.get("/requests")
      ]);
      setUsers(usersRes.data);
      setDonors(donorsRes.data);
      setRequests(requestsRes.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const markCompleted = async (id) => {
    try {
      await api.patch(`/requests/${id}/status`, { status: "Completed" });
      toast.success("Request marked as completed");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const matchFirstDonor = async (request) => {
    const match = donors.find((donor) => donor.user?.bloodGroup === request.bloodGroup);
    if (!match) {
      toast.error("No matching donor found");
      return;
    }

    try {
      await api.patch(`/requests/${request._id}/match`, { donorId: match._id });
      toast.success("Donor matched");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Match failed");
    }
  };

  if (loading) {
    return (
      <DashboardLayout heading="Admin Dashboard" subheading="Loading system-wide donor and request data">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      heading="Admin Dashboard"
      subheading="Monitor platform activity, manage donation flow, and coordinate urgent blood requests."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Total Users" value={users.length} hint="All registered platform users" />
        <DashboardCard title="Donor Profiles" value={donors.length} hint="Active donor records" tone="accent" />
        <DashboardCard title="Open Requests" value={requests.filter((item) => item.status === "Open").length} hint="Still awaiting action" tone="dark" />
        <DashboardCard title="Completed Cases" value={requests.filter((item) => item.status === "Completed").length} hint="Successfully fulfilled requests" tone="accent" />
      </div>

      <div className="mt-6 grid gap-6">
        <div className="card">
          <h3>Recent Users</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3">Email</th>
                  <th className="px-3 py-3">Role</th>
                  <th className="px-3 py-3">Blood Group</th>
                  <th className="px-3 py-3">Location</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="px-3 py-3">{user.name}</td>
                    <td className="px-3 py-3">{user.email}</td>
                    <td className="px-3 py-3 capitalize">{user.role}</td>
                    <td className="px-3 py-3">{user.bloodGroup}</td>
                    <td className="px-3 py-3">{user.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3>Request Operations</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="px-3 py-3">Patient</th>
                  <th className="px-3 py-3">Group</th>
                  <th className="px-3 py-3">Urgency</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Actions</th>
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
                      <div className="flex flex-wrap gap-2">
                        <button className="rounded-lg bg-brand-accent px-3 py-2 text-xs font-semibold text-white" onClick={() => matchFirstDonor(request)}>
                          Match Donor
                        </button>
                        <button className="rounded-lg bg-brand-primary px-3 py-2 text-xs font-semibold text-white" onClick={() => markCompleted(request._id)}>
                          Complete
                        </button>
                      </div>
                    </td>
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

export default AdminDashboard;
