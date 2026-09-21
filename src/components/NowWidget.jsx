export default function NowWidget({ label, icon, title, subtitle }) {
  return (
    <div className="flex w-full flex-col justify-between rounded-3xl border border-gray-200 bg-gray-50 p-6 sm:w-56">
      <p className="font-heading text-xs uppercase tracking-widest text-gray-500">{label}</p>

      <div className="mt-4">
        <p className="text-3xl">{icon}</p>
        <p className="font-heading mt-2 text-base font-semibold">{title}</p>
        {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
      </div>
    </div>
  );
}
