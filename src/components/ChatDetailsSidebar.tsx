import React, { useState } from 'react';
import { Conversation, ChatTheme } from '../types/messenger';

interface ChatDetailsSidebarProps {
  conversation: Conversation;
  onClose: () => void;
  onOpenThemeModal: () => void;
  onChangeEmoji: (emoji: string) => void;
}

export default function ChatDetailsSidebar({
  conversation,
  onClose,
  onOpenThemeModal,
  onChangeEmoji,
}: ChatDetailsSidebarProps) {
  const { participant, theme, customEmoji } = conversation;
  const [openSection, setOpenSection] = useState<'info' | 'media' | 'privacy' | null>('info');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const toggleSection = (section: 'info' | 'media' | 'privacy') => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const EMOJI_OPTIONS = ['👍', '❤️', '🔥', '✨', '💙', '🎉', '☕', '💯'];

  return (
    <aside className="w-full lg:w-80 border-l border-slate-200 bg-white flex flex-col h-full overflow-y-auto animate-in slide-in-from-right-4 duration-200">
      {/* Header with Close */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <h3 className="font-bold text-sm text-slate-800">Details</h3>
        <button
          type="button"
          onClick={onClose}
          className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
          title="Close details"
        >
          ✕
        </button>
      </div>

      {/* Profile Overview */}
      <div className="flex flex-col items-center p-6 border-b border-slate-100 text-center">
        <div className="relative mb-3">
          <img
            src={participant.avatar}
            alt={participant.name}
            className="h-20 w-20 rounded-full object-cover ring-4 ring-slate-100 shadow-sm"
          />
          {participant.isOnline && (
            <span
              className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500"
              title="Online"
            />
          )}
        </div>
        <h4 className="font-bold text-slate-900 text-base">{participant.name}</h4>
        <p className="text-xs text-slate-500 mt-0.5">
          {participant.isOnline ? 'Active now' : participant.lastActive || 'Offline'}
        </p>

        {/* Quick Action Icons */}
        <div className="flex items-center gap-6 mt-4">
          <button
            type="button"
            className="flex flex-col items-center gap-1 group focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 group-hover:bg-slate-200 transition text-slate-700">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-[11px] text-slate-600 font-medium">Profile</span>
          </button>

          <button
            type="button"
            className="flex flex-col items-center gap-1 group focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 group-hover:bg-slate-200 transition text-slate-700">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <span className="text-[11px] text-slate-600 font-medium">Mute</span>
          </button>

          <button
            type="button"
            className="flex flex-col items-center gap-1 group focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 group-hover:bg-slate-200 transition text-slate-700">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="text-[11px] text-slate-600 font-medium">Search</span>
          </button>
        </div>
      </div>

      {/* Accordions */}
      <div className="flex-1 divide-y divide-slate-100 text-xs">
        {/* Customize Chat */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection('info')}
            className="w-full flex items-center justify-between p-4 font-semibold text-slate-800 hover:bg-slate-50 transition"
          >
            <span>Customize Chat</span>
            <span className="text-slate-400">{openSection === 'info' ? '▲' : '▼'}</span>
          </button>

          {openSection === 'info' && (
            <div className="px-4 pb-3 space-y-2 text-slate-700">
              {/* Change Theme */}
              <button
                type="button"
                onClick={onOpenThemeModal}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-5 w-5 rounded-full shadow-xs"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                  <span>Change Theme</span>
                </div>
                <span className="text-slate-400 font-normal">{theme.name} →</span>
              </button>

              {/* Change Emoji */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{customEmoji}</span>
                    <span>Change Emoji</span>
                  </div>
                  <span className="text-slate-400 font-normal">Edit →</span>
                </button>

                {showEmojiPicker && (
                  <div className="mt-1 p-2 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap gap-2">
                    {EMOJI_OPTIONS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => {
                          onChangeEmoji(e);
                          setShowEmojiPicker(false);
                        }}
                        className="text-xl p-1 hover:scale-120 transition"
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Media & Files */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection('media')}
            className="w-full flex items-center justify-between p-4 font-semibold text-slate-800 hover:bg-slate-50 transition"
          >
            <span>Media, files and links</span>
            <span className="text-slate-400">{openSection === 'media' ? '▲' : '▼'}</span>
          </button>

          {openSection === 'media' && (
            <div className="p-4 space-y-3">
              <p className="text-[11px] text-slate-500 font-medium">Shared Media</p>
              <div className="grid grid-cols-3 gap-1.5 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80"
                  alt="Shared media"
                  className="aspect-square object-cover hover:opacity-90 cursor-pointer"
                />
                <img
                  src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&auto=format&fit=crop&q=80"
                  alt="Shared media"
                  className="aspect-square object-cover hover:opacity-90 cursor-pointer"
                />
                <img
                  src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80"
                  alt="Shared media"
                  className="aspect-square object-cover hover:opacity-90 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Privacy & Support */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection('privacy')}
            className="w-full flex items-center justify-between p-4 font-semibold text-slate-800 hover:bg-slate-50 transition"
          >
            <span>Privacy and support</span>
            <span className="text-slate-400">{openSection === 'privacy' ? '▲' : '▼'}</span>
          </button>

          {openSection === 'privacy' && (
            <div className="px-4 pb-4 space-y-2 text-slate-700">
              <button
                type="button"
                className="w-full text-left p-2 rounded-lg hover:bg-slate-100 flex items-center gap-2"
              >
                <span>🚫</span> Block {participant.name.split(' ')[0]}
              </button>
              <button
                type="button"
                className="w-full text-left p-2 rounded-lg hover:bg-red-50 text-red-600 flex items-center gap-2"
              >
                <span>⚠️</span> Report conversation
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
