// ─── GymOS Myanmar — CSV Export Utility ───────────────────────────────────────

import type { PaymentRecord, Member } from '@/lib/types';

function esc(value: string | number): string {
  const s = String(value);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function row(...values: (string | number)[]): string {
  return values.map(esc).join(',');
}

function dateLabel(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function exportReportCsv(
  payments: PaymentRecord[],
  newMembers: Member[],
  fromDate: Date,
  toDate: Date,
): void {
  const lines: string[] = [];

  lines.push('GymOS Myanmar — Period Report');
  lines.push(`Generated,${new Date().toLocaleString()}`);
  lines.push(`Period,${dateLabel(fromDate)} to ${dateLabel(toDate)}`);
  lines.push('');

  // ── Revenue ─────────────────────────────────────────────────────────────────
  lines.push('=== REVENUE TRANSACTIONS ===');
  lines.push(row('Date', 'Member Name', 'Plan', 'Amount (MMK)', 'Payment Method', 'Type'));
  for (const p of payments) {
    lines.push(row(p.date, p.memberName, p.plan, p.amount, p.method, p.type));
  }
  const totalRevenue = payments.reduce((s, p) => s + p.amount, 0);
  lines.push(row('TOTAL', '', '', totalRevenue, '', ''));
  lines.push('');

  // ── Revenue by plan ─────────────────────────────────────────────────────────
  lines.push('=== REVENUE BY PLAN TYPE ===');
  lines.push(row('Plan', 'Total (MMK)', 'Transactions'));
  const byPlan: Record<string, number> = {};
  payments.forEach((p) => { byPlan[p.plan] = (byPlan[p.plan] ?? 0) + p.amount; });
  for (const [plan, amount] of Object.entries(byPlan).sort(([, a], [, b]) => b - a)) {
    const count = payments.filter((p) => p.plan === plan).length;
    lines.push(row(plan, amount, count));
  }
  lines.push('');

  // ── Revenue by method ───────────────────────────────────────────────────────
  lines.push('=== REVENUE BY PAYMENT METHOD ===');
  lines.push(row('Method', 'Total (MMK)', 'Transactions'));
  const byMethod: Record<string, number> = {};
  payments.forEach((p) => { byMethod[p.method] = (byMethod[p.method] ?? 0) + p.amount; });
  for (const [method, amount] of Object.entries(byMethod).sort(([, a], [, b]) => b - a)) {
    const count = payments.filter((p) => p.method === method).length;
    lines.push(row(method, amount, count));
  }
  lines.push('');

  // ── New members ─────────────────────────────────────────────────────────────
  lines.push('=== NEW MEMBERS IN PERIOD ===');
  lines.push(row('Name', 'Plan', 'Join Date', 'Phone', 'Status'));
  for (const m of newMembers) {
    lines.push(row(m.name, m.plan, m.joinDate, m.phone, m.status));
  }
  lines.push('');

  // ── New vs Renewals ─────────────────────────────────────────────────────────
  lines.push('=== NEW MEMBERS vs RENEWALS ===');
  lines.push(row('Type', 'Count', 'Revenue (MMK)'));
  const newCount = payments.filter((p) => p.type === 'New').length;
  const renewCount = payments.filter((p) => p.type === 'Renewal').length;
  const newRev = payments.filter((p) => p.type === 'New').reduce((s, p) => s + p.amount, 0);
  const renewRev = payments.filter((p) => p.type === 'Renewal').reduce((s, p) => s + p.amount, 0);
  lines.push(row('New', newCount, newRev));
  lines.push(row('Renewal', renewCount, renewRev));

  // ── Download ─────────────────────────────────────────────────────────────────
  const csv = lines.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const filename = `gymOS-report-${fromDate.toISOString().slice(0, 10)}-to-${toDate.toISOString().slice(0, 10)}.csv`;
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
