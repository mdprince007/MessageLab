import React from 'react';
import { Conversation, isMessageCurrentlyLocked } from '../types/messenger';

interface ChatHeaderProps {
  conversation: Conversation;
  perspective: 'sender' | 'receiver';
  currentTime: Date;
  onTogglePerspective: () => void;
  onUnlockNow?: () => void;
  onBack?: () => void;
  onStartCall: (type: 'audio' | 'video') => void;
  onToggleDetails: () => void;
  isDetailsOpen: boolean;
}

export default function ChatHeader({
  conversation,
  perspective,
  currentTime,
  onTogglePerspective,
  onUnlockNow,
  onBack,
  onStartCall,
  onToggleDetails,
  isDetailsOpen,
}: ChatHeaderProps) {
  const { participant, messages } = conversation;
  const hasLockedMessages = messages.some((m) => isMessageCurrentlyLocked(m, currentTime));

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-900 bg-[#000000] px-4 text-white">
      <div className="flex items-center gap-3">
        {/* Mobile Back Button */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-900 text-[#0084FF]"
            title="Back to chats"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Profile Avatar */}
        <div className="relative">
          <img
            src={participant.avatar}
            alt={participant.name}
            className="h-10 w-10 rounded-full object-cover"
          />
          {participant.isOnline && (
            <span
              className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-black bg-emerald-500"
              title="Online"
            />
          )}
        </div>

        {/* Name & Active Status */}
        <div>
          <h2 className="text-sm font-bold text-white leading-tight">
            {participant.name}
          </h2>
          <p className="text-xs text-slate-400">
            {participant.isOnline ? 'Active now' : participant.lastActive || 'Offline'}
          </p>
        </div>
      </div>

      {/* Center Controls: Perspective Switcher & Demo Unlock */}
      <div className="hidden sm:flex items-center gap-2">
        {/* Perspective Toggle (Sender vs Receiver simulation) */}
        <button
          type="button"
          onClick={onTogglePerspective}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition ${
            perspective === 'receiver'
              ? 'bg-amber-950/90 text-amber-300 border-amber-600 shadow-sm'
              : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
          }`}
          title="Switch view to test how the receiver sees locked messages and countdowns"
        >
          <span>{perspective === 'receiver' ? '👤 Viewing as Recipient' : '👁️ Viewing as Sender'}</span>
          <span className="text-[10px] text-slate-400">(Switch ⇄)</span>
        </button>

        {/* Fast Unlock Demo Button */}
        {hasLockedMessages && onUnlockNow && (
          <button
            type="button"
            onClick={onUnlockNow}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-black hover:bg-amber-400 active:scale-95 transition shadow-xs"
            title="Immediately unlock all locked messages for testing"
          >
            <span>⚡ Unlock Now</span>
          </button>
        )}
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-1.5 text-[#0084FF]">
        {/* Audio Call */}
        <button
          type="button"
          onClick={() => onStartCall('audio')}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-900 transition"
          title="Start voice call"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>

        {/* Video Call */}
        <button
          type="button"
          onClick={() => onStartCall('video')}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-900 transition"
          title="Start video call"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>

        {/* Info Toggle */}
        <button
          type="button"
          onClick={onToggleDetails}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
            isDetailsOpen
              ? 'bg-blue-950 text-[#0084FF]'
              : 'hover:bg-slate-900 text-[#0084FF]'
          }`}
          title="Conversation information"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </header>
  );
}
