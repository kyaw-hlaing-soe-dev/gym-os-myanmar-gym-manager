"use client";

import { CheckCircle2, QrCode, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Html5QrCodeLike = {
  start: (
    cameraIdOrConfig: { facingMode: string },
    configuration: { fps: number; qrbox: { width: number; height: number } },
    onSuccess: (decodedText: string) => void,
    onError?: () => void,
  ) => Promise<unknown>;
  pause: (shouldPauseVideo?: boolean) => void;
  stop: () => Promise<void>;
  clear: () => void;
};

export default function QrCheckInScanner() {
  const scannerRef = useRef<Html5QrCodeLike | null>(null);
  const resetTimerRef = useRef<number | null>(null);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let disposed = false;

    async function startScanner() {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (disposed) return;

        const scanner = new Html5Qrcode("front-desk-qr-reader") as Html5QrCodeLike;
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decodedText) => {
            scanner.pause(true);
            setResult(decodedText);
            resetTimerRef.current = window.setTimeout(() => {
              setResult("");
              void scanner.stop().then(() => scanner.clear()).finally(() => {
                scannerRef.current = null;
                startScanner();
              });
            }, 3000);
          },
          () => undefined,
        );
      } catch {
        setError("Camera scanner could not start. Check browser permissions.");
      }
    }

    startScanner();

    return () => {
      disposed = true;
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
      const scanner = scannerRef.current;
      scannerRef.current = null;
      if (scanner) {
        void scanner.stop().catch(() => undefined).finally(() => {
          scanner.clear();
        });
      }
    };
  }, []);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <QrCode size={18} className="text-blue-600" />
        <div>
          <h2 className="font-semibold text-slate-950">QR Check-In Scanner</h2>
          <p className="text-xs text-slate-500">Uses the browser camera on the front desk device</p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
        <div id="front-desk-qr-reader" className="min-h-[320px] w-full" />
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 p-6 text-center text-sm font-semibold text-white">
            {error}
          </div>
        ) : null}
      </div>

      {result ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-950">Check-in Successful</h3>
                  <p className="mt-1 break-all text-xs text-slate-500">{result}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setResult("")}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close check-in confirmation"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
