import React from 'react';
import { formatLockCountdown, formatUnlockDate } from '../types/messenger';

interface LockedDetailModalProps {
  unlockAt: string;
  showTimerToReceiver?: boolean;
  currentTime: Date;
  onClose: () => void;
}

export default function LockedDetailModal({
  unlockAt,
  showTimerToReceiver,
  currentTime,
  onClose,
}: LockedDetailModalProps) {
  const remaining = formatLockCountdown(unlockAt, currentTime);
  const formattedUnlock = formatUnlockDate(unlockAt);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl border border-slate-800 bg-[#141414] p-6 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Lock Icon Emblem */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 ring-8 ring-amber-500/5 shadow-inner">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        {/* Modal Header */}
        <div className="mt-4 text-center">
          <h3 className="text-base font-bold text-white">This message is locked</h3>
          <p className="mt-1 text-xs text-slate-400 leading-relaxed">
            The sender time-locked this message. Content will automatically reveal when the unlock time arrives.
          </p>
        </div>

        {/* Schedule & Countdown Details */}
        <div className="mt-5 space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Unlock Schedule</span>
            <span className="font-semibold text-slate-200">{formattedUnlock}</span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 pt-2.5">
            <span className="text-slate-400 font-medium">Countdown Timer</span>
            {showTimerToReceiver ? (
              <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-800/60">
                {remaining}
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 italic">
                🙈 Hidden by sender
              </span>
            )}
          </div>
        </div>

        <p className="mt-3 text-center text-[11px] text-slate-500">
          {showTimerToReceiver
            ? 'The sender enabled live countdown timer for this message.'
            : 'The sender chose to hide the countdown timer from you.'}
        </p>

        {/* Close Button */}
        <div className="mt-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-slate-800 py-2.5 text-xs font-semibold text-white hover:bg-slate-700 transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
