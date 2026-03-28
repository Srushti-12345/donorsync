import { Droplets, MapPin } from "lucide-react";

const LogoMark = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-soft">
        <Droplets size={18} />
        <MapPin size={12} className="absolute -bottom-1 -right-1 rounded-full bg-brand-accent p-0.5 text-white" />
      </div>
      <div>
        <p className="text-lg font-bold leading-none">DonorSync</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Donate. Locate. Save.</p>
      </div>
    </div>
  );
};

export default LogoMark;
