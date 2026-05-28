"use client";

import { type FormEvent, useMemo, useState } from "react";
import { KeyRound, QrCode, Search, Send, Smartphone, UserRoundCheck, Users } from "lucide-react";
import type { AccountRole, GymAccount } from "@/lib/types";
import SendInviteButton from "@/components/accounts/SendInviteButton";

type Props = {
  accounts: GymAccount[];
  onCreateAccount: (account: GymAccount) => void;
};

const ROLE_OPTIONS: AccountRole[] = ["member", "trainer"];
const MEMBER_PLANS = ["Basic", "Premium", "Premium Plus", "Student"];
const TRAINER_SPECIALTIES = ["Strength Training", "HIIT", "Yoga", "Zumba", "Boxing"];

function createInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function createUsername(name: string, role: AccountRole, accounts: GymAccount[]) {
  const base =
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, ".")
      .replace(/^\.+|\.+$/g, "") || role;

  const existing = new Set(accounts.map((account) => account.username.toLowerCase()));
  let username = base;
  let suffix = 2;

  while (existing.has(username.toLowerCase())) {
    username = `${base}${suffix}`;
    suffix += 1;
  }

  return username;
}

function createPassword(role: AccountRole) {
  const prefix = role === "trainer" ? "Trainer" : "Member";
  return `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;
}

function activationLabel(account: GymAccount) {
  if (account.status === "Pending") return "Pending";
  return account.id.endsWith("1") || account.id.endsWith("3") ? "Downloaded" : "Active";
}

export default function MemberAppAccounts({ accounts, onCreateAccount }: Props) {
  const [role, setRole] = useState<AccountRole>("member");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [planOrSpecialty, setPlanOrSpecialty] = useState(MEMBER_PLANS[0]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(createPassword("member"));
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | AccountRole>("all");
  const [message, setMessage] = useState("");

  const accountOptions = role === "trainer" ? TRAINER_SPECIALTIES : MEMBER_PLANS;
  const memberAccounts = accounts.filter((account) => account.role === "member");
  const trainerAccounts = accounts.filter((account) => account.role === "trainer");

  const filteredAccounts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return accounts.filter((account) => {
      const roleMatches = filter === "all" || account.role === filter;
      const queryMatches =
        !normalized ||
        account.name.toLowerCase().includes(normalized) ||
        account.username.toLowerCase().includes(normalized) ||
        account.phone.toLowerCase().includes(normalized);
      return roleMatches && queryMatches;
    });
  }, [accounts, filter, query]);

  function handleRoleChange(nextRole: AccountRole) {
    setRole(nextRole);
    setPlanOrSpecialty(nextRole === "trainer" ? TRAINER_SPECIALTIES[0] : MEMBER_PLANS[0]);
    setPassword(createPassword(nextRole));
    setMessage("");
  }

  function handleNameChange(nextName: string) {
    setName(nextName);
    if (!username || username === createUsername(name, role, accounts)) {
      setUsername(createUsername(nextName, role, accounts));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanName || cleanUsername.length < 4 || cleanPassword.length < 6) {
      setMessage("Add a name, a 4+ character username, and a 6+ character password.");
      return;
    }

    if (accounts.some((account) => account.username.toLowerCase() === cleanUsername.toLowerCase())) {
      setMessage("This username is already used.");
      return;
    }

    onCreateAccount({
      id: `acc-${Date.now()}`,
      role,
      name: cleanName,
      username: cleanUsername,
      password: cleanPassword,
      phone: phone.trim() || "No phone added",
      planOrSpecialty,
      status: "Active",
      createdAt: "Just now",
    });

    setMessage(`Created ${role} app account for ${cleanName}.`);
    setName("");
    setPhone("");
    setUsername("");
    setPassword(createPassword(role));
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="font-semibold text-slate-950">App Accounts</h2>
            <p className="text-xs text-slate-500">Create member and trainer login credentials · အကောင့်ဖွင့်ရန်</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-xl bg-slate-50 px-3 py-2">
              <p className="text-lg font-bold text-slate-950">{accounts.length}</p>
              <p className="text-slate-500">Accounts</p>
            </div>
            <div className="rounded-xl bg-teal-50 px-3 py-2">
              <p className="text-lg font-bold text-teal-700">{memberAccounts.length}</p>
              <p className="text-teal-700">Members</p>
            </div>
            <div className="rounded-xl bg-blue-50 px-3 py-2">
              <p className="text-lg font-bold text-blue-700">{trainerAccounts.length}</p>
              <p className="text-blue-700">Trainers</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <KeyRound size={18} className="text-teal-700" />
            <div>
              <h3 className="font-semibold text-slate-900">Quick Create</h3>
              <p className="text-xs text-slate-500">Auto-generate secure app access</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-1 text-sm font-semibold ring-1 ring-slate-200">
              {ROLE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleRoleChange(option)}
                  className={`rounded-lg px-3 py-2 transition ${
                    role === option ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-white"
                  }`}
                >
                  {option === "member" ? "Member" : "Trainer"}
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600" htmlFor="app-account-name">
                {role === "member" ? "Member" : "Trainer"} name
              </label>
              <input
                id="app-account-name"
                value={name}
                onChange={(event) => handleNameChange(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                placeholder={role === "member" ? "Member full name" : "Trainer full name"}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-600" htmlFor="app-account-phone">
                  Phone
                </label>
                <input
                  id="app-account-phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  placeholder="+95 9..."
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600" htmlFor="app-account-plan">
                  {role === "member" ? "Plan" : "Specialty"}
                </label>
                <select
                  id="app-account-plan"
                  value={planOrSpecialty}
                  onChange={(event) => setPlanOrSpecialty(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                >
                  {accountOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-600" htmlFor="app-account-username">
                  Username
                </label>
                <input
                  id="app-account-username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600" htmlFor="app-account-password">
                  Temporary password
                </label>
                <div className="mt-1 flex rounded-xl border border-slate-200 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100">
                  <input
                    id="app-account-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="min-w-0 flex-1 rounded-l-xl px-3 py-2.5 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setPassword(createPassword(role))}
                    className="px-3 text-xs font-semibold text-teal-700"
                  >
                    New
                  </button>
                </div>
              </div>
            </div>

            {message ? (
              <p className="rounded-xl bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700">{message}</p>
            ) : null}

            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">
              <UserRoundCheck size={16} />
              Create App Account
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">Onboarding Center</h3>
              <p className="text-xs text-slate-500">Invite links, app download, and activation status</p>
            </div>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-teal-200 px-3 py-2 text-xs font-semibold text-teal-700">
              <Send size={14} />
              Bulk SMS/Viber
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-[150px_minmax(0,1fr)]">
            <div className="rounded-2xl bg-slate-50 p-4 text-center">
              <QrCode className="mx-auto text-slate-900" size={34} />
              <div className="mx-auto mt-3 grid h-24 w-24 grid-cols-5 gap-1 rounded-lg bg-white p-2 ring-1 ring-slate-200">
                {Array.from({ length: 25 }, (_, index) => (
                  <span
                    key={index}
                    className={`rounded-sm ${index % 2 === 0 || index % 7 === 0 ? "bg-slate-950" : "bg-slate-100"}`}
                  />
                ))}
              </div>
              <p className="mt-3 text-xs font-semibold text-slate-700">GymOS App</p>
              <p className="text-[10px] text-slate-500">Scan to install</p>
            </div>

            <div className="min-w-0 space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
                  <Search size={15} className="text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                    placeholder="Search accounts..."
                  />
                </label>
                <select
                  value={filter}
                  onChange={(event) => setFilter(event.target.value as "all" | AccountRole)}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700"
                >
                  <option value="all">All roles</option>
                  <option value="member">Members</option>
                  <option value="trainer">Trainers</option>
                </select>
              </div>

              <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                {filteredAccounts.map((account) => (
                  <article key={account.id} className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
                          {createInitials(account.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-sm font-semibold text-slate-900">{account.name}</p>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                              {account.role}
                            </span>
                          </div>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            @{account.username} · {account.planOrSpecialty}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                        {activationLabel(account)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2">
                      <span className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
                        <Smartphone size={13} />
                        <span className="truncate">{account.phone}</span>
                      </span>
                      <SendInviteButton name={account.name} />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
