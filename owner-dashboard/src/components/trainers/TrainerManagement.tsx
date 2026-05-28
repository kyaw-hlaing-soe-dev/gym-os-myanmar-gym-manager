"use client";

import { type FormEvent, useMemo, useState } from "react";
import { Award, CalendarDays, Dumbbell, Phone, Plus, Users } from "lucide-react";
import type { Member, TrainerProfile, TrainerStatus } from "@/lib/types";

type Props = {
  members: Member[];
};

const INITIAL_TRAINERS: TrainerProfile[] = [
  {
    id: "t1",
    name: "Ma Thida",
    phone: "+95 9 7788 1200",
    specialty: "Strength Training",
    certifications: ["ACE CPT", "Nutrition Coach"],
    monthlySalary: 800_000,
    status: "Active",
    schedule: "Mon/Wed/Fri · 6 AM - 2 PM",
    sessionsCompleted: 48,
    retentionRate: 94,
    revenueGenerated: 4_800_000,
  },
  {
    id: "t2",
    name: "Ko Naing",
    phone: "+95 9 7788 9911",
    specialty: "HIIT",
    certifications: ["NASM CPT"],
    monthlySalary: 700_000,
    status: "Active",
    schedule: "Tue/Thu/Sat · 12 PM - 8 PM",
    sessionsCompleted: 36,
    retentionRate: 88,
    revenueGenerated: 3_600_000,
  },
  {
    id: "t3",
    name: "Daw Yin Yin",
    phone: "+95 9 5566 7788",
    specialty: "Yoga",
    certifications: ["RYT 200", "Mobility"],
    monthlySalary: 650_000,
    status: "On Leave",
    schedule: "Mon/Thu/Sun · 7 AM - 12 PM",
    sessionsCompleted: 30,
    retentionRate: 80,
    revenueGenerated: 2_700_000,
  },
  {
    id: "t4",
    name: "Ko Pyae Phyo",
    phone: "+95 9 6677 8844",
    specialty: "Boxing",
    certifications: ["Boxing Coach", "First Aid"],
    monthlySalary: 750_000,
    status: "Active",
    schedule: "Wed/Fri/Sat · 3 PM - 9 PM",
    sessionsCompleted: 42,
    retentionRate: 91,
    revenueGenerated: 4_200_000,
  },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const STATUS_OPTIONS: TrainerStatus[] = ["Active", "On Leave", "Inactive"];

function createInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatMMK(amount: number) {
  return `${(amount / 1_000_000).toFixed(1)}M MMK`;
}

function statusTone(status: TrainerStatus) {
  if (status === "Active") return "bg-teal-50 text-teal-700 ring-teal-200";
  if (status === "On Leave") return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-slate-100 text-slate-700 ring-slate-200";
}

export default function TrainerManagement({ members }: Props) {
  const [trainers, setTrainers] = useState<TrainerProfile[]>(INITIAL_TRAINERS);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    specialty: "Strength Training",
    monthlySalary: "",
    schedule: "Mon/Wed/Fri · 6 AM - 2 PM",
  });

  const activeTrainers = trainers.filter((trainer) => trainer.status === "Active").length;
  const totalSessions = trainers.reduce((sum, trainer) => sum + trainer.sessionsCompleted, 0);
  const totalRevenue = trainers.reduce((sum, trainer) => sum + trainer.revenueGenerated, 0);
  const clientsByTrainer = useMemo(() => {
    return trainers.map((trainer) => ({
      trainer,
      clients: members.filter((member) => member.trainerId === trainer.id),
    }));
  }, [members, trainers]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = form.name.trim();
    const salary = Number(form.monthlySalary);
    if (!cleanName || !salary) return;

    setTrainers((current) => [
      {
        id: `t${Date.now()}`,
        name: cleanName,
        phone: form.phone.trim() || "No phone added",
        specialty: form.specialty,
        certifications: ["Internal onboarding"],
        monthlySalary: salary,
        status: "Active",
        schedule: form.schedule,
        sessionsCompleted: 0,
        retentionRate: 0,
        revenueGenerated: 0,
      },
      ...current,
    ]);

    setForm({
      name: "",
      phone: "",
      specialty: "Strength Training",
      monthlySalary: "",
      schedule: "Mon/Wed/Fri · 6 AM - 2 PM",
    });
  }

  function updateStatus(id: string, status: TrainerStatus) {
    setTrainers((current) => current.map((trainer) => (trainer.id === id ? { ...trainer, status } : trainer)));
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="font-semibold text-slate-950">Trainer Management</h2>
            <p className="text-xs text-slate-500">Profiles, schedules, performance, and client assignments · နည်းပြစီမံခန့်ခွဲမှု</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-xl bg-slate-50 px-3 py-2">
              <p className="text-lg font-bold text-slate-950">{activeTrainers}</p>
              <p className="text-slate-500">Active</p>
            </div>
            <div className="rounded-xl bg-blue-50 px-3 py-2">
              <p className="text-lg font-bold text-blue-700">{totalSessions}</p>
              <p className="text-blue-700">Sessions</p>
            </div>
            <div className="rounded-xl bg-teal-50 px-3 py-2">
              <p className="text-lg font-bold text-teal-700">{formatMMK(totalRevenue)}</p>
              <p className="text-teal-700">Revenue</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(300px,0.7fr)_minmax(0,1.3fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Plus size={18} className="text-teal-700" />
            <div>
              <h3 className="font-semibold text-slate-900">Add Trainer</h3>
              <p className="text-xs text-slate-500">Trainer profile and work schedule</p>
            </div>
          </div>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-semibold text-slate-600" htmlFor="trainer-name">
                Name
              </label>
              <input
                id="trainer-name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                placeholder="Trainer full name"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600" htmlFor="trainer-phone">
                Phone
              </label>
              <input
                id="trainer-phone"
                value={form.phone}
                onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                placeholder="+95 9..."
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-600" htmlFor="trainer-specialty">
                  Specialty
                </label>
                <select
                  id="trainer-specialty"
                  value={form.specialty}
                  onChange={(event) => setForm((current) => ({ ...current, specialty: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                >
                  {["Strength Training", "HIIT", "Yoga", "Zumba", "Boxing"].map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600" htmlFor="trainer-salary">
                  Salary MMK
                </label>
                <input
                  id="trainer-salary"
                  type="number"
                  value={form.monthlySalary}
                  onChange={(event) => setForm((current) => ({ ...current, monthlySalary: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  placeholder="800000"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600" htmlFor="trainer-schedule">
                Schedule
              </label>
              <input
                id="trainer-schedule"
                value={form.schedule}
                onChange={(event) => setForm((current) => ({ ...current, schedule: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              />
            </div>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">
              <Dumbbell size={16} />
              Add Trainer
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays size={18} className="text-blue-700" />
            <div>
              <h3 className="font-semibold text-slate-900">Weekly Timetable</h3>
              <p className="text-xs text-slate-500">Compact schedule view for floor coverage</p>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {DAYS.map((day, index) => (
              <div key={day} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-bold text-slate-500">{day}</p>
                <div className="mt-3 space-y-2">
                  {trainers
                    .filter((_, trainerIndex) => (trainerIndex + index) % 2 === 0)
                    .slice(0, 2)
                    .map((trainer) => (
                      <div key={trainer.id} className="rounded-lg bg-white px-2 py-1.5 text-[11px] shadow-sm ring-1 ring-slate-100">
                        <p className="truncate font-semibold text-slate-800">{trainer.name}</p>
                        <p className="truncate text-slate-400">{trainer.specialty}</p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Users size={18} className="text-teal-700" />
          <div>
            <h3 className="font-semibold text-slate-900">Trainer Profiles</h3>
            <p className="text-xs text-slate-500">Performance metrics and client assignments</p>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {clientsByTrainer.map(({ trainer, clients }) => (
            <article key={trainer.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                    {createInitials(trainer.name)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-slate-950">{trainer.name}</h4>
                    <p className="text-xs text-slate-500">{trainer.specialty} · {trainer.schedule}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                      <Phone size={11} />
                      {trainer.phone}
                    </p>
                  </div>
                </div>
                <select
                  value={trainer.status}
                  onChange={(event) => updateStatus(trainer.id, event.target.value as TrainerStatus)}
                  className={`rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-semibold ring-1 ${statusTone(trainer.status)}`}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
                <div className="rounded-xl bg-white p-2">
                  <p className="font-bold text-slate-950">{clients.length}</p>
                  <p className="text-slate-500">Clients</p>
                </div>
                <div className="rounded-xl bg-white p-2">
                  <p className="font-bold text-blue-700">{trainer.sessionsCompleted}</p>
                  <p className="text-slate-500">Sessions</p>
                </div>
                <div className="rounded-xl bg-white p-2">
                  <p className="font-bold text-teal-700">{trainer.retentionRate}%</p>
                  <p className="text-slate-500">Retention</p>
                </div>
                <div className="rounded-xl bg-white p-2">
                  <p className="font-bold text-slate-950">{formatMMK(trainer.revenueGenerated)}</p>
                  <p className="text-slate-500">Revenue</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-slate-500">
                  <Award size={12} />
                  Certifications
                </p>
                <div className="flex flex-wrap gap-2">
                  {trainer.certifications.map((certification) => (
                    <span key={certification} className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200">
                      {certification}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold text-slate-500">Assigned clients</p>
                <div className="flex flex-wrap gap-2">
                  {clients.length ? (
                    clients.slice(0, 6).map((client) => (
                      <span key={client.id} className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">
                        {client.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">No assigned clients yet</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
