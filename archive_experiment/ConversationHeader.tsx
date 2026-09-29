import React from 'react';

interface ConversationHeaderProps {
  title: string;
  subtitle: string;
  avatarLetter: string;
  avatarBgColor?: string;
  perspectiveLabel: string;
  isOnline?: boolean;
}

export default function ConversationHeader({
  title,
  subtitle,
  avatarLetter,
  avatarBgColor = 'bg-indigo-600',
  perspectiveLabel,
  isOnline = true,
}: ConversationHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${avatarBgColor} font-semibold text-white shadow-sm`}
          >
            {avatarLetter}
          </div>
          {isOnline && (
            <span
              className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500"
              title="Online"
            />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">
              {subtitle}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {isOnline ? 'Active now' : 'Offline'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
          {perspectiveLabel}
        </span>
      </div>
    </div>
  );
}
