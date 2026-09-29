import React, { useState } from 'react';
import { CURRENT_USER } from '../data/mockData';

interface NavigationRailProps {
  onResetData: () => void;
}

export default function NavigationRail({ onResetData }: NavigationRailProps) {
  const [activeTab, setActiveTab] = useState<'chats' | 'people' | 'marketplace' | 'requests' | 'archive'>('chats');
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  return (
    <aside className="hidden md:flex w-16 flex-col items-center justify-between border-r border-slate-900 bg-[#121212] py-3 shadow-2xs">
      {/* Top Icons */}
      <div className="flex flex-col items-center gap-3 w-full">
        {/* Messenger Logo with Iconic Gradient */}
        <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0064E0] via-[#0084FF] to-[#00C6FF] text-white shadow-md shadow-blue-500/25 cursor-pointer hover:scale-105 transition"
          title="Messenger"
        >
          <svg className="h-6 w-6" viewBox="0 0 28 28" fill="currentColor">
            <path d="M14 2C7.373 2 2 6.96 2 13.08c0 3.48 1.74 6.58 4.46 8.58-.2 1.34-1.04 3.76-1.12 3.98-.1.26.06.56.32.6.14.02.26-.02.38-.1.98-.68 3.52-2.42 4.14-2.86.58.14 1.18.22 1.82.22 6.627 0 12-4.96 12-11.08C24 6.96 18.627 2 14 2zm1.24 14.86l-2.92-3.12-5.7 3.12 6.28-6.66 2.98 3.12 5.64-3.12-6.28 6.66z" />
          </svg>
        </div>

        <div className="w-8 h-[1px] bg-slate-800 my-1" />

        {/* Chats Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('chats')}
          className={`relative flex h-11 w-11 items-center justify-center rounded-xl transition ${
            activeTab === 'chats'
              ? 'bg-blue-950 text-[#0084FF]'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
          title="Chats"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {activeTab === 'chats' && (
            <span className="absolute left-0 h-6 w-1 rounded-r-full bg-[#0084FF]" />
          )}
        </button>

        {/* People / Stories Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('people')}
          className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
            activeTab === 'people'
              ? 'bg-blue-950 text-[#0084FF]'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
          title="People & Stories"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>

        {/* Marketplace Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('marketplace')}
          className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
            activeTab === 'marketplace'
              ? 'bg-blue-950 text-[#0084FF]'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
          title="Marketplace"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>

        {/* Archive Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('archive')}
          className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
            activeTab === 'archive'
              ? 'bg-blue-950 text-[#0084FF]'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
          title="Archive"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </button>
      </div>

      {/* Bottom Profile & Settings */}
      <div className="relative flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => setShowSettingsMenu(!showSettingsMenu)}
          className="relative group rounded-full focus:outline-none"
          title="Account settings"
        >
          <img
            src={CURRENT_USER.avatar}
            alt={CURRENT_USER.name}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-[#0084FF] transition"
          />
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#121212] bg-emerald-500" />
        </button>

        {/* Dropdown Menu */}
        {showSettingsMenu && (
          <div
            className="absolute bottom-12 left-14 z-50 w-56 rounded-2xl border border-slate-800 bg-[#1E1E1E] p-2 text-white shadow-2xl animate-in fade-in zoom-in-95"
            onClick={() => setShowSettingsMenu(false)}
          >
            <div className="px-3 py-2 border-b border-slate-800">
              <p className="font-semibold text-xs text-white">{CURRENT_USER.name}</p>
              <p className="text-[11px] text-slate-400">@{CURRENT_USER.username}</p>
            </div>
            <div className="py-1 text-xs text-slate-300">
              <button
                type="button"
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-2"
              >
                <span>⚙️</span> Preferences
              </button>
              <button
                type="button"
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-2"
              >
                <span>🔔</span> Notifications
              </button>
              <button
                type="button"
                onClick={onResetData}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-950/50 text-red-400 flex items-center gap-2"
              >
                <span>↺</span> Reset Mock Data
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
