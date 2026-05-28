'use client';

import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Expense, ExpenseCategory } from '@/lib/types';
import { MONTHLY_REVENUE } from '@/lib/data';

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: ExpenseCategory[] = [
  'Rent',
  'Utilities',
  'Equipment',
  'Salaries',
  'Maintenance',
  'Other',
];

const CAT_COLOR: Record<ExpenseCategory, string> = {
  Rent: '#6366f1',
  Utilities: '#f59e0b',
  Equipment: '#3b82f6',
  Salaries: '#0f9b8e',
  Maintenance: '#ef4444',
  Other: '#8b5cf6',
};

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function monthKey(dateStr: string): string {
  return dateStr.slice(0, 7); // 'YYYY-MM'
}

function monthLabel(key: string): string {
  const month = parseInt(key.split('-')[1], 10);
  return MONTH_NAMES[month - 1];
}

function formatMMK(n: number): string {
  return `${n.toLocaleString()} MMK`;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  expenses: Expense[];
  onAddExpense: (expense: Expense) => void;
}

export default function ExpenseTracker({ expenses, onAddExpense }: Props) {
  const [form, setForm] = useState({
    category: 'Rent' as ExpenseCategory,
    amount: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });
  const [success, setSuccess] = useState(false);

  // Default selected month = current month key
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  // All months that have data (union of expenses + revenue keys)
  const allMonths = useMemo(() => {
    const keys = new Set<string>([...Object.keys(MONTHLY_REVENUE)]);
    expenses.forEach((e) => keys.add(monthKey(e.date)));
    return [...keys].sort();
  }, [expenses]);

  // Expenses for selected month
  const monthExpenses = useMemo(
    () => expenses.filter((e) => monthKey(e.date) === selectedMonth),
    [expenses, selectedMonth],
  );

  // Category totals for selected month
  const catTotals = useMemo(() => {
    const m: Partial<Record<ExpenseCategory, number>> = {};
    for (const e of monthExpenses) {
      m[e.category] = (m[e.category] ?? 0) + e.amount;
    }
    return m;
  }, [monthExpenses]);

  const totalExpenses = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const revenue = MONTHLY_REVENUE[selectedMonth] ?? 0;
  const profit = revenue - totalExpenses;

  // Chart data: all months side-by-side
  const chartData = allMonths.map((m) => ({
    month: monthLabel(m),
    Revenue: ((MONTHLY_REVENUE[m] ?? 0) / 1_000_000).toFixed(2),
    Expenses: (
      expenses
        .filter((e) => monthKey(e.date) === m)
        .reduce((s, e) => s + e.amount, 0) / 1_000_000
    ).toFixed(2),
  }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const raw = form.amount.replace(/,/g, '').trim();
    const amount = parseInt(raw, 10);
    if (!amount || amount <= 0) return;

    onAddExpense({
      id: `exp-${Date.now()}`,
      category: form.category,
      amount,
      date: form.date,
      note: form.note.trim(),
    });

    setForm((f) => ({ ...f, amount: '', note: '' }));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  }

  return (
    <div className="space-y-5">
      {/* ── Net Profit Card ──────────────────────────────────────────────── */}
      <section
        className="rounded-2xl border bg-white p-5 shadow-sm"
        style={{
          borderColor: profit >= 0 ? '#10b98140' : '#ef444440',
          background:
            profit >= 0
              ? 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 60%)'
              : 'linear-gradient(135deg, #fef2f2 0%, #ffffff 60%)',
        }}
      >
        <p className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-400">
          Net Profit Summary — {monthLabel(selectedMonth)}
          <span className="ml-1 font-normal text-slate-400">အမြတ်အစွန်းအကျဉ်းချုပ်</span>
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-[11px] text-slate-500">Revenue</p>
            <p className="text-[9px] text-slate-400">ဝင်ငွေ</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {(revenue / 1_000_000).toFixed(1)}M
            </p>
            <p className="text-xs text-slate-500">MMK</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500">Expenses</p>
            <p className="text-[9px] text-slate-400">ကုန်ကျစရိတ်</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {(totalExpenses / 1_000_000).toFixed(2)}M
            </p>
            <p className="text-xs text-slate-500">MMK</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500">Net Profit</p>
            <p className="text-[9px] text-slate-400">အမြတ်</p>
            <p
              className="mt-1 text-xl font-bold"
              style={{ color: profit >= 0 ? '#10b981' : '#ef4444' }}
            >
              {profit >= 0 ? '+' : ''}
              {(profit / 1_000_000).toFixed(2)}M
            </p>
            <p
              className="text-xs font-semibold"
              style={{ color: profit >= 0 ? '#10b981' : '#ef4444' }}
            >
              MMK {profit >= 0 ? '▲' : '▼'}
            </p>
          </div>
        </div>
      </section>

      {/* ── Revenue vs Expenses Chart ─────────────────────────────────────── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-1 font-semibold text-slate-900">Revenue vs Expenses</h3>
        <p className="mb-4 text-xs text-slate-500">ဝင်ငွေနှင့် ကုန်ကျစရိတ် နှိုင်းယှဉ်မှု</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 4, left: -12, bottom: 0 }}
            >
              <CartesianGrid stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickFormatter={(v) => `${v}M`}
              />
              <Tooltip
                formatter={(v: string | number) => [`${v}M MMK`, '']}
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
              />
              <Legend />
              <Bar dataKey="Revenue" fill="#0f9b8e" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Expenses" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ── Form + Table grid ────────────────────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        {/* Add Expense form */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900">Add Expense</h3>
          <p className="mb-4 text-xs text-slate-500">ကုန်ကျစရိတ်ထည့်သွင်းရန်</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-600" htmlFor="exp-cat">
                Category <span className="text-slate-400">အမျိုးအစား</span>
              </label>
              <select
                id="exp-cat"
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value as ExpenseCategory }))
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#0f9b8e] focus:ring-2 focus:ring-[#0f9b8e30]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600" htmlFor="exp-amount">
                Amount (MMK) <span className="text-slate-400">ပမာဏ</span>
              </label>
              <input
                id="exp-amount"
                type="number"
                min={1}
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                placeholder="e.g. 1500000"
                required
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#0f9b8e] focus:ring-2 focus:ring-[#0f9b8e30]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600" htmlFor="exp-date">
                Date <span className="text-slate-400">ရက်စွဲ</span>
              </label>
              <input
                id="exp-date"
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#0f9b8e] focus:ring-2 focus:ring-[#0f9b8e30]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600" htmlFor="exp-note">
                Note (optional)
              </label>
              <input
                id="exp-note"
                type="text"
                value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                placeholder="e.g. Monthly rent payment"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#0f9b8e] focus:ring-2 focus:ring-[#0f9b8e30]"
              />
            </div>

            {success && (
              <p className="rounded-xl bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
                ✓ Expense added
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              style={{ background: '#0f9b8e' }}
            >
              Add Expense
            </button>
          </form>
        </section>

        {/* Monthly breakdown table */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-900">Monthly Breakdown</h3>
              <p className="text-xs text-slate-500">လစဉ်ကုန်ကျစရိတ်ခွဲခြမ်းစိတ်ဖြာမှု</p>
            </div>
            {/* Month picker */}
            <div className="flex flex-wrap gap-1">
              {allMonths.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className="rounded-lg px-2.5 py-1 text-xs font-semibold transition"
                  style={{
                    background: selectedMonth === m ? '#0f9b8e' : '#f1f5f9',
                    color: selectedMonth === m ? '#ffffff' : '#64748b',
                  }}
                >
                  {monthLabel(m)}
                </button>
              ))}
            </div>
          </div>

          {/* Category bars */}
          <div className="space-y-3">
            {CATEGORIES.map((cat) => {
              const total = catTotals[cat] ?? 0;
              const pct = totalExpenses > 0 ? (total / totalExpenses) * 100 : 0;
              return (
                <div key={cat}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ background: CAT_COLOR[cat] }}
                      />
                      <span className="text-slate-700">{cat}</span>
                    </span>
                    <span className="font-semibold text-slate-900">
                      {formatMMK(total)}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: CAT_COLOR[cat] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total row */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
            <span className="font-semibold text-slate-500">Total Expenses</span>
            <span className="font-bold text-slate-900">{formatMMK(totalExpenses)}</span>
          </div>

          {/* Itemised list */}
          {monthExpenses.length > 0 && (
            <div className="mt-3 max-h-40 space-y-1 overflow-y-auto">
              {monthExpenses.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5 text-xs"
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: CAT_COLOR[e.category] }}
                  />
                  <span className="flex-1 truncate text-slate-600">
                    {e.category}
                    {e.note ? ` · ${e.note}` : ''}
                  </span>
                  <span className="shrink-0 text-slate-400">{e.date}</span>
                  <span className="shrink-0 font-semibold text-slate-800">
                    {(e.amount / 1_000).toFixed(0)}K
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
