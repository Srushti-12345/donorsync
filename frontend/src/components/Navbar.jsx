import { Menu, Moon, Sun, LogOut } from "lucide-react";
import LogoMark from "./LogoMark";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ onToggleSidebar }) => {
  const { dark, setDark } = useTheme();
  const { auth, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            className="rounded-xl border border-slate-200 p-2 md:hidden dark:border-slate-700"
            onClick={onToggleSidebar}
          >
            <Menu size={20} />
          </button>
          <LogoMark />
        </div>

        <div className="flex items-center gap-3">
          <button
            className="rounded-xl border border-slate-200 p-2 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            onClick={() => setDark(!dark)}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold">{auth?.user?.name}</p>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {auth?.user?.role}
            </p>
          </div>

          <button className="btn-outline px-3 py-2" onClick={logout}>
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
