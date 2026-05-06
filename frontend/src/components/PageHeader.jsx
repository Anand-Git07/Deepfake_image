export default function PageHeader({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <h2 className="flex items-center gap-3 text-3xl font-black tracking-tight text-white">
          {Icon && <Icon className="text-guard-purple" size={28} />}
          {title}
        </h2>
        {subtitle && <p className="mt-2 text-sm font-medium text-white/70">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
