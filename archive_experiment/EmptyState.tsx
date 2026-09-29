import React from 'react';

interface EmptyStateProps {
  perspective: 'sender' | 'receiver';
}

export default function EmptyState({ perspective }: EmptyStateProps) {
  if (perspective === 'sender') {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4 shadow-sm border border-indigo-100">
          <svg
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-800">No messages yet</h3>
        <p className="mt-1 max-w-xs text-xs text-slate-500">
          Compose a message using the input below and click Send to test real-time message flow.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 shadow-sm border border-slate-200">
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-indigo-500"></span>
        </span>
        <svg
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.75}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-slate-800">Waiting for a message...</h3>
      <p className="mt-1 max-w-xs text-xs text-slate-500">
        Incoming messages sent from the Sender will immediately appear here.
      </p>
    </div>
  );
}
