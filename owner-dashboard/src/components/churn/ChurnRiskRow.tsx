type Props = {
  name: string;
  plan: string;
  riskScore: number;
};

function riskConfig(riskScore: number) {
  if (riskScore > 75) {
    return {
      label: "High Risk",
      bar: "bg-red-600",
      badge: "bg-red-50 text-red-700 ring-red-200",
    };
  }

  if (riskScore >= 40) {
    return {
      label: "Medium Risk",
      bar: "bg-yellow-500",
      badge: "bg-yellow-50 text-yellow-700 ring-yellow-200",
    };
  }

  return {
    label: "Low Risk",
    bar: "bg-emerald-600",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  };
}

export default function ChurnRiskRow({ name, plan, riskScore }: Props) {
  const config = riskConfig(riskScore);
  const safeScore = Math.max(1, Math.min(100, riskScore));

  return (
    <tr className="border-b border-slate-100 last:border-b-0">
      <td className="px-4 py-3">
        <p className="font-semibold text-slate-900">{name}</p>
        <p className="text-xs text-slate-500">{plan}</p>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-2 min-w-32 flex-1 rounded-full bg-slate-100">
            <div className={`h-full rounded-full ${config.bar}`} style={{ width: `${safeScore}%` }} />
          </div>
          <span className="w-9 text-right text-xs font-bold text-slate-700">{safeScore}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${config.badge}`}>
          {config.label}
        </span>
      </td>
    </tr>
  );
}
