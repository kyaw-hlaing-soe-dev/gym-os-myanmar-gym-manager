"use client";

import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useState } from "react";

type InviteState = "idle" | "sending" | "sent";

export default function SendInviteButton({ name }: { name: string }) {
  const [state, setState] = useState<InviteState>("idle");

  function handleSend() {
    if (state !== "idle") return;
    setState("sending");
    window.setTimeout(() => setState("sent"), 2000);
  }

  if (state === "sent") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
        <CheckCircle2 size={14} />
        Link Sent
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleSend}
      disabled={state === "sending"}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 text-xs font-bold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:bg-slate-500"
      aria-label={`Send invite link to ${name}`}
    >
      {state === "sending" ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
      {state === "sending" ? "Sending" : "Send Invite"}
    </button>
  );
}
