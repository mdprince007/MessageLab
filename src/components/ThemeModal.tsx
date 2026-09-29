import React from 'react';
import { ChatTheme } from '../types/messenger';
import { CHAT_THEMES } from '../data/mockData';

interface ThemeModalProps {
  currentTheme: ChatTheme;
  onSelectTheme: (theme: ChatTheme) => void;
  onClose: () => void;
}

export default function ThemeModal({
  currentTheme,
  onSelectTheme,
  onClose,
}: ThemeModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">Themes</h3>
          <button
            type="button"
            onClick={onClose}
            className="h-7 w-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-500 my-3">
          Select a color theme for this conversation:
        </p>

        <div className="grid grid-cols-1 gap-2 my-2">
          {CHAT_THEMES.map((theme) => {
            const isSelected = theme.id === currentTheme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  onSelectTheme(theme);
                  onClose();
                }}
                className={`flex items-center justify-between p-3 rounded-xl border transition ${
                  isSelected
                    ? 'border-[#0084FF] bg-blue-50/50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-7 w-7 rounded-full bg-gradient-to-tr ${theme.bubbleClass} shadow-xs ring-2 ${
                      isSelected ? 'ring-[#0084FF]' : 'ring-transparent'
                    }`}
                  />
                  <span className="text-xs font-semibold text-slate-800">
                    {theme.name}
                  </span>
                </div>
                {isSelected && (
                  <span className="text-[#0084FF] font-bold text-sm">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
