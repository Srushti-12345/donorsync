const DashboardCard = ({ title, value, hint, tone = "primary" }) => {
  const tones = {
    primary: "from-red-500/15 to-red-100 dark:from-red-500/20 dark:to-slate-900",
    accent: "from-teal-500/15 to-teal-100 dark:from-teal-500/20 dark:to-slate-900",
    dark: "from-slate-800/15 to-slate-100 dark:from-slate-700/30 dark:to-slate-900"
  };

  return (
    <div className={`card bg-gradient-to-br ${tones[tone]} transition hover:-translate-y-1`}>
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <h3 className="mt-3 text-3xl font-bold">{value}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{hint}</p>
    </div>
  );
};

export default DashboardCard;
