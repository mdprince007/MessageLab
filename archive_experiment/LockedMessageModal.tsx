import React from 'react';
import { formatRemainingTime, formatUnlockDateTime } from '../types/message';

interface LockedMessageModalProps {
  unlockAt: string;
  currentTime: Date;
  onClose: () => void;
}

export default function LockedMessageModal({
  unlockAt,
  currentTime,
  onClose,
}: LockedMessageModalProps) {
  const remaining = formatRemainingTime(unlockAt, currentTime);
  const formattedUnlock = formatUnlockDateTime(unlockAt);
  const isPast = new Date(unlockAt).getTime() <= currentTime.getTime();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="locked-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Lock Icon Emblem */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-8 ring-amber-50/50 shadow-inner">
          <svg
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        {/* Modal Header */}
        <div className="mt-4 text-center">
          <h3 id="locked-modal-title" className="text-base font-semibold text-slate-900">
            This message is locked
          </h3>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Content will be revealed when the unlock time arrives.
          </p>
        </div>

        {/* Schedule & Countdown Info Card */}
        <div className="mt-5 space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Unlock Time</span>
            <span className="font-semibold text-slate-800">{formattedUnlock}</span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200/60 pt-2.5">
            <span className="text-slate-500 font-medium">Remaining Time</span>
            <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md">
              {isPast ? 'Ready to unlock' : remaining}
            </span>
          </div>
        </div>

        {/* Notice */}
        <p className="mt-3 text-center text-[11px] text-slate-400">
          The sender scheduled this message with a future unlock timestamp.
        </p>

        {/* Action Button */}
        <div className="mt-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
