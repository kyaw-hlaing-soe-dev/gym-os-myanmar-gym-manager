"use client";

import { Lightbulb, Megaphone, Send, Sparkles, TrendingUp } from "lucide-react";
import { type FormEvent, useState } from "react";

const releases = [
  { version: "v1.8", date: "May 2026", title: "Owner command center", notes: "Reports rebuild, revenue overview, and app account onboarding." },
  { version: "v1.7", date: "Apr 2026", title: "Operations upgrade", notes: "QR check-in, expense tracking, and member risk notifications." },
  { version: "v1.6", date: "Mar 2026", title: "Payments foundation", notes: "Payment records, CSV export, and collection status workflows." },
];

const roadmap = [
  { name: "Trainer mobile schedule", progress: 72, labelMM: "နည်းပြအချိန်ဇယား" },
  { name: "Automated payment reminders", progress: 64, labelMM: "ငွေတောင်းခံသတိပေးချက်" },
  { name: "Member progress photos", progress: 48, labelMM: "အဖွဲ့ဝင်တိုးတက်မှုမှတ်တမ်း" },
  { name: "Branch comparison dashboard", progress: 35, labelMM: "ဆိုင်ခွဲနှိုင်းယှဉ်မှု" },
];

const capabilities = [
  "Member lifecycle management",
  "Trainer performance tracking",
  "Revenue and expense visibility",
  "Churn risk monitoring",
  "Mobile app onboarding",
  "CSV reporting workflows",
];

const ownerTips = [
  "Review overdue payments before evening peak hours.",
  "Assign high-risk members to trainers before renewal week.",
  "Compare revenue and expenses weekly, not only month-end.",
];

export default function FeaturesShowcase() {
  const [request, setRequest] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!request.trim()) return;
    setSent(true);
    setRequest("");
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="font-semibold text-slate-950">Features & What&apos;s New</h2>
            <p className="text-xs text-slate-500">Product updates, roadmap, and owner playbook · လုပ်ဆောင်ချက်အသစ်များ</p>
          </div>
          <div className="rounded-xl bg-slate-950 px-4 py-3 text-white">
            <p className="text-xs text-slate-300">Current version</p>
            <p className="text-xl font-bold">GymOS v1.8</p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Megaphone size={18} className="text-teal-700" />
            <div>
              <h3 className="font-semibold text-slate-900">Release Notes</h3>
              <p className="text-xs text-slate-500">Recent platform improvements</p>
            </div>
          </div>
          <div className="space-y-3">
            {releases.map((release) => (
              <article key={release.version} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-950 px-2 py-1 text-xs font-bold text-white">{release.version}</span>
                  <span className="text-xs font-semibold text-slate-400">{release.date}</span>
                </div>
                <h4 className="mt-3 font-semibold text-slate-900">{release.title}</h4>
                <p className="mt-1 text-sm text-slate-500">{release.notes}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb size={18} className="text-amber-600" />
            <div>
              <h3 className="font-semibold text-slate-900">Owner Tips</h3>
              <p className="text-xs text-slate-500">Best practices for daily operations</p>
            </div>
          </div>
          <div className="space-y-3">
            {ownerTips.map((tip, index) => (
              <div key={tip} className="rounded-xl bg-amber-50 px-3 py-3 text-sm text-amber-900">
                <span className="mr-2 font-bold">{index + 1}.</span>
                {tip}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-700" />
            <div>
              <h3 className="font-semibold text-slate-900">Roadmap</h3>
              <p className="text-xs text-slate-500">Upcoming feature progress</p>
            </div>
          </div>
          <div className="space-y-4">
            {roadmap.map((item) => (
              <div key={item.name}>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.labelMM}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-500">{item.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-teal-600" style={{ width: `${item.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-teal-700" />
            <div>
              <h3 className="font-semibold text-slate-900">Platform Capabilities</h3>
              <p className="text-xs text-slate-500">What GymOS can help manage</p>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {capabilities.map((capability) => (
              <div key={capability} className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
                {capability}
              </div>
            ))}
          </div>

          <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
            <label className="text-xs font-semibold text-slate-600" htmlFor="feature-request">
              Feature request
            </label>
            <textarea
              id="feature-request"
              value={request}
              onChange={(event) => {
                setRequest(event.target.value);
                setSent(false);
              }}
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              placeholder="What would help your gym team move faster?"
            />
            {sent ? <p className="rounded-xl bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700">Request saved for review.</p> : null}
            <button className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">
              <Send size={16} />
              Submit Request
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
