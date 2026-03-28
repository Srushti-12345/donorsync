import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ children, heading, subheading }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dashboard-watermark">
      <Navbar onToggleSidebar={() => setOpen(true)} />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <main className="min-h-[calc(100vh-80px)] flex-1 p-4 sm:p-6">
          <div className="mb-6">
            <h1>{heading}</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{subheading}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
