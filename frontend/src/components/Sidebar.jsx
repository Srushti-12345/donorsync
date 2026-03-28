import { LayoutDashboard, HeartPulse, Users, ClipboardList, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ open, onClose }) => {
  const { auth } = useAuth();

  const roleRoutes = {
    donor: [{ to: "/donor", label: "Donor Dashboard", icon: HeartPulse }],
    requester: [{ to: "/requester", label: "Requester Dashboard", icon: ClipboardList }],
    admin: [{ to: "/admin", label: "Admin Dashboard", icon: Users }]
  };

  const links = [
    { to: "/", label: "Overview", icon: LayoutDashboard },
    ...(roleRoutes[auth?.user?.role] || [])
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/40 transition md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 transform border-r border-slate-200 bg-white p-5 transition dark:border-slate-800 dark:bg-slate-950 md:static md:z-0 md:h-auto md:w-72 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between md:hidden">
          <span className="text-lg font-bold">Menu</span>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-brand-primary text-white"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 rounded-2xl bg-brand-accent/10 p-4 text-sm text-slate-700 dark:text-slate-200">
          <p className="font-semibold">Quick tip</p>
          <p className="mt-2">Keep donor availability updated so urgent requests are matched faster.</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
