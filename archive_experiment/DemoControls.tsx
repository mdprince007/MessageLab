import React from 'react';
import { Message, isMessageLocked } from '../types/message';

interface DemoControlsProps {
  messages: Message[];
  currentTime: Date;
  onUnlockNow: () => void;
  onAdvanceTime: (seconds: number) => void;
  onResetDemo: () => void;
}

export default function DemoControls({
  messages,
  currentTime,
  onUnlockNow,
  onAdvanceTime,
  onResetDemo,
}: DemoControlsProps) {
  const lockedCount = messages.filter((m) => isMessageLocked(m, currentTime)).length;

  return (
    <div className="mb-4 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 p-3 sm:px-4 sm:py-2.5 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Label & Active Count */}
        <div className="flex items-center gap-2">
          <span className="flex h-6 items-center gap-1 rounded-md bg-indigo-600 px-2 text-[11px] font-bold text-white shadow-2xs">
            🧪 Demo Controls
          </span>
          <span className="text-xs text-slate-600">
            {lockedCount > 0 ? (
              <span className="font-medium text-amber-700">
                🔒 {lockedCount} locked {lockedCount === 1 ? 'message' : 'messages'} active
              </span>
            ) : (
              <span className="text-slate-500">No active locked messages</span>
            )}
          </span>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Unlock Now */}
          <button
            type="button"
            onClick={onUnlockNow}
            disabled={lockedCount === 0}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold shadow-2xs transition ${
              lockedCount > 0
                ? 'bg-amber-500 text-white hover:bg-amber-600 active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            title="Immediately unlock all currently locked messages"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            Unlock Now
          </button>

          {/* Advance +1m */}
          <button
            type="button"
            onClick={() => onAdvanceTime(60)}
            disabled={lockedCount === 0}
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium shadow-2xs transition ${
              lockedCount > 0
                ? 'border-indigo-300 bg-white text-indigo-700 hover:bg-indigo-50 active:scale-95'
                : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
            title="Fast-forward unlock time by 1 minute"
          >
            <span>⏩</span>
            <span>Advance +1m</span>
          </button>

          {/* Advance +5m */}
          <button
            type="button"
            onClick={() => onAdvanceTime(300)}
            disabled={lockedCount === 0}
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium shadow-2xs transition ${
              lockedCount > 0
                ? 'border-indigo-300 bg-white text-indigo-700 hover:bg-indigo-50 active:scale-95'
                : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
            title="Fast-forward unlock time by 5 minutes"
          >
            <span>⏩</span>
            <span>Advance +5m</span>
          </button>

          {/* Reset Demo */}
          <button
            type="button"
            onClick={onResetDemo}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 active:scale-95 transition"
            title="Clear all messages and reset conversation"
          >
            <svg className="h-3 w-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset Demo
          </button>
        </div>
      </div>
    </div>
  );
}
