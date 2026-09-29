import React, { useState } from 'react';
import { CURRENT_USER } from '../data/mockData';

interface NavigationRailProps {
  workbenchMode?: 'single' | 'dual';
  onToggleWorkbenchMode?: () => void;
  onResetData: () => void;
}

export default function NavigationRail({
  workbenchMode,
  onToggleWorkbenchMode,
  onResetData,
}: NavigationRailProps) {
  const [activeTab, setActiveTab] = useState<'chats' | 'people' | 'marketplace' | 'requests' | 'archive'>('chats');
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  return (
    <aside className="hidden md:flex w-16 flex-col items-center justify-between border-r border-slate-900 bg-[#121212] py-3 shadow-2xs">
      {/* Top Icons */}
      <div className="flex flex-col items-center gap-3 w-full">
        {/* MessageLab Independent Product Logo */}
        <div
          className="group relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0064E0] via-[#0084FF] to-[#00C6FF] text-white shadow-md shadow-blue-500/25 cursor-pointer hover:scale-105 transition"
          title="MessageLab — Build → Improve → Share"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 2v7.31L4.2 18.5A2 2 0 0 0 5.8 22h12.4a2 2 0 0 0 1.6-3.5L14 9.31V2" />
            <path d="M8.5 2h7" />
            <path d="M14 9.3a6.5 6.5 0 1 1-4 0" />
          </svg>
        </div>

        <div className="w-8 h-[1px] bg-slate-800 my-1" />

        {/* Workbench Split-Screen Switcher Button */}
        {onToggleWorkbenchMode && (
          <button
            type="button"
            onClick={onToggleWorkbenchMode}
            className={`relative flex h-11 w-11 items-center justify-center rounded-xl transition ${
              workbenchMode === 'dual'
                ? 'bg-amber-950 text-amber-400 border border-amber-600/40'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
            title={workbenchMode === 'dual' ? 'Dual Split-Screen Workbench Active' : 'Switch to Dual Split-Screen Workbench'}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            {workbenchMode === 'dual' && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            )}
          </button>
        )}

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
