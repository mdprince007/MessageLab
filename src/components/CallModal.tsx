import React, { useState } from 'react';
import { User } from '../types/messenger';

interface CallModalProps {
  type: 'audio' | 'video';
  participant: User;
  onEndCall: () => void;
}

export default function CallModal({ type, participant, onEndCall }: CallModalProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative flex flex-col items-center justify-between w-full max-w-md h-[460px] rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 p-8 text-white shadow-2xl border border-slate-800">
        {/* Top Call Info */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
            Messenger {type === 'video' ? 'Video' : 'Audio'} Call
          </span>
          <h3 className="text-xl font-bold mt-1 text-slate-100">{participant.name}</h3>
          <p className="text-xs text-blue-400 font-medium mt-1 animate-pulse">
            Calling...
          </p>
        </div>

        {/* Pulsing Avatar */}
        <div className="relative flex items-center justify-center">
          {/* Animated concentric pulse rings */}
          <span className="absolute h-36 w-36 rounded-full bg-blue-500/20 animate-ping" />
          <span className="absolute h-28 w-28 rounded-full bg-blue-500/30" />
          <img
            src={participant.avatar}
            alt={participant.name}
            className="relative h-24 w-24 rounded-full object-cover shadow-2xl ring-4 ring-blue-500/50"
          />
        </div>

        {/* Bottom Call Controls */}
        <div className="flex items-center justify-center gap-6 w-full">
          {/* Mute Toggle */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition shadow-lg ${
              isMuted ? 'bg-amber-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 19L5 5m10 5V4a3 3 0 00-6 0v2m2.4 4.8A3 3 0 0015 10m-3 5a5 5 0 01-5-5H5a7 7 0 0011.95 4.95M12 19v3m-4 0h8" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>

          {/* End Call Button */}
          <button
            type="button"
            onClick={onEndCall}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl hover:scale-105 active:scale-95 transition"
            title="End call"
          >
            <svg className="h-7 w-7 transform rotate-[135deg]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
          </button>

          {/* Video Toggle (if video call) */}
          {type === 'video' && (
            <button
              type="button"
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition shadow-lg ${
                isVideoOff ? 'bg-amber-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
              title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
