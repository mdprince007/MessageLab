import React, { useState, useRef, useEffect } from 'react';
import { ChatTheme, MessageEffect } from '../types/messenger';
import { evaluateTextCompletion, AvatarSticker, SEND_EFFECTS } from '../utils/smartStickers';

interface MessageComposerProps {
  customEmoji: string;
  theme: ChatTheme;
  onSendMessage: (
    text: string,
    options?: {
      isThumbsUp?: boolean;
      isSticker?: boolean;
      stickerImage?: string;
      effect?: MessageEffect;
      isLocked?: boolean;
      unlockAt?: string;
      showTimerToReceiver?: boolean;
    }
  ) => void;
}

// Helper to format Date into datetime-local value (YYYY-MM-DDTHH:mm)
function formatLocalDateTime(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function MessageComposer({
  customEmoji,
  theme,
  onSendMessage,
}: MessageComposerProps) {
  const [text, setText] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  const [showLockSettingsModal, setShowLockSettingsModal] = useState(false);

  // Time-lock configuration states
  const [lockDurationType, setLockDurationType] = useState<string>('1d');
  const [unlockDateTime, setUnlockDateTime] = useState<string>(() => {
    // Default 1 day in future
    const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return formatLocalDateTime(d);
  });
  const [showTimerToReceiver, setShowTimerToReceiver] = useState(true);

  const [isActionsCollapsed, setIsActionsCollapsed] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'favorites' | 'emoji' | 'avatar' | 'stickers' | 'gif'>('favorites');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Evaluate text completion state
  const suggestion = evaluateTextCompletion(text);
  const hasText = text.trim().length > 0;
  const isCompleteMatch = suggestion?.isComplete ?? false;

  // Auto-collapse left action icons when typing longer text
  useEffect(() => {
    if (text.length > 8) {
      setIsActionsCollapsed(true);
    } else {
      setIsActionsCollapsed(false);
    }
  }, [text]);

  const applyDurationPreset = (presetKey: string, secondsOffset: number) => {
    setLockDurationType(presetKey);
    const target = new Date(Date.now() + secondsOffset * 1000);
    setUnlockDateTime(formatLocalDateTime(target));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleSendNormal = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    onSendMessage(text);
    setText('');
    setShowDrawer(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  const handleSendWithEffect = (effect: MessageEffect) => {
    if (!text.trim()) return;

    if (effect === 'lock') {
      // Open lock settings modal to configure duration & timer visibility
      setShowLockSettingsModal(true);
      return;
    }

    onSendMessage(text, { effect });
    setText('');
    setShowDrawer(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  const handleConfirmSendLock = () => {
    if (!text.trim()) return;

    const selectedDate = new Date(unlockDateTime);
    const isoUnlock = isNaN(selectedDate.getTime())
      ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      : selectedDate.toISOString();

    onSendMessage(text, {
      effect: 'lock',
      isLocked: true,
      unlockAt: isoUnlock,
      showTimerToReceiver,
    });

    setText('');
    setShowLockSettingsModal(false);
    setShowDrawer(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendNormal();
    }
  };

  const handleSendThumbsUp = () => {
    onSendMessage(customEmoji || '👍', { isThumbsUp: true });
  };

  const handleSendSticker = (sticker: AvatarSticker) => {
    onSendMessage(sticker.label, {
      isSticker: true,
      stickerImage: sticker.image,
    });
    setText('');
    setShowDrawer(false);
  };

  const previewText = text.trim() || 'I am good';

  return (
    <footer className="relative border-t border-slate-900 bg-[#000000] text-white">
      {/* Main Composer Bar */}
      <div className="flex items-center gap-2 px-3 py-2 sm:px-4">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-1.5 text-[#0084FF] flex-shrink-0">
          {isActionsCollapsed ? (
            <button
              type="button"
              onClick={() => setIsActionsCollapsed(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-900 transition text-[#0084FF]"
              title="Expand actions"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <>
              {/* + More Button */}
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-900 transition text-[#0084FF]"
                title="More actions"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 6a1 1 0 10-2 0v3H8a1 1 0 100 2h3v3a1 1 0 102 0v-3h3a1 1 0 100-2h-3V8z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Camera Button */}
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-900 transition text-[#0084FF]"
                title="Camera"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              {/* Gallery Button */}
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-900 transition text-[#0084FF]"
                title="Photo gallery"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>

              {/* Mic Button */}
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-900 transition text-[#0084FF]"
                title="Voice clip"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Input Pill Container */}
        <div className="relative flex flex-1 items-center rounded-full bg-[#262626] px-4 py-2 min-h-[42px] focus-within:ring-2 focus-within:ring-[#0084FF]/40 transition">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Message"
            className="w-full resize-none bg-transparent text-sm text-slate-100 placeholder-[#8A8D91] focus:outline-none max-h-24 pr-8"
          />

          {/* DYNAMIC RIGHT ICON INSIDE PILL */}
          <div className="absolute right-2 flex items-center justify-center">
            {/* SITUATION 1: Empty text -> Blue Smiley Face */}
            {!hasText && (
              <button
                type="button"
                onClick={() => setShowDrawer(!showDrawer)}
                className="flex h-7 w-7 items-center justify-center text-[#0084FF] hover:scale-110 active:scale-95 transition"
                title="Stickers and emojis"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-3.5-9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm7 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-7.447 3.528a1 1 0 011.394.279 4.004 4.004 0 006.106 0 1 1 0 111.624 1.168 6.004 6.004 0 01-9.15.025 1 1 0 01.026-1.472z" clipRule="evenodd" />
                </svg>
              </button>
            )}

            {/* SITUATION 2: Typed text but incomplete / non-meaningful -> Blue Search Circle (🔍) */}
            {hasText && !isCompleteMatch && (
              <button
                type="button"
                onClick={() => setShowDrawer(!showDrawer)}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0084FF] text-white shadow-xs hover:scale-105 active:scale-95 transition animate-in zoom-in-75 duration-150"
                title="Send effects & stickers"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}

            {/* SITUATION 3: Complete / meaningful sentence -> Avatar Sticker Icon */}
            {hasText && isCompleteMatch && suggestion?.avatarIcon && (
              <button
                type="button"
                onClick={() => setShowDrawer(!showDrawer)}
                className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0084FF] overflow-hidden hover:scale-110 active:scale-95 transition animate-in zoom-in-95 duration-150 shadow-md shadow-blue-500/20"
                title="Send effects & avatar stickers"
              >
                <img
                  src={suggestion.avatarIcon}
                  alt="Avatar suggestion"
                  className="h-full w-full object-cover"
                />
              </button>
            )}
          </div>
        </div>

        {/* Right Outside Button: Thumbs Up when empty, Blue Send Arrow (✈️) when text is typed */}
        <div className="flex items-center flex-shrink-0">
          {hasText ? (
            <button
              type="button"
              onClick={handleSendNormal}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#0084FF] hover:bg-slate-900 active:scale-95 transition"
              title="Send message"
            >
              <svg className="h-6 w-6 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSendThumbsUp}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#0084FF] hover:scale-115 active:scale-90 transition transform"
              title="Send like"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 10h4v12H2zm20 2c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13.17 3 7.59 8.59C7.22 8.95 7 9.45 7 10v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* AUTHENTIC MESSENGER DRAWER (Matches Image 2 Exactly!) */}
      {showDrawer && (
        <div className="border-t border-slate-900 bg-[#000000] p-4 animate-in slide-in-from-bottom-6 duration-200">
          {/* Top Drag Handle (Clickable to dismiss drawer) */}
          <div
            onClick={() => setShowDrawer(false)}
            className="flex justify-center mb-3 cursor-pointer py-1 group"
            title="Click to close drawer"
          >
            <div className="h-1.5 w-12 rounded-full bg-slate-700 group-hover:bg-slate-500 transition" />
          </div>

          {/* Navigation Category Bar (Matches Image 2) */}
          <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-3 text-slate-400">
            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-900 transition" title="Search">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Featured / Star Pill (Active in Messenger) */}
            <button
              type="button"
              onClick={() => setDrawerTab('favorites')}
              className={`flex h-9 w-12 items-center justify-center rounded-full transition ${
                drawerTab === 'favorites' ? 'bg-[#242424] text-white shadow-xs' : 'text-slate-500 hover:bg-slate-900'
              }`}
              title="Featured"
            >
              ★
            </button>

            <button
              type="button"
              onClick={() => setDrawerTab('emoji')}
              className={`flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-900 transition text-lg ${
                drawerTab === 'emoji' ? 'text-white' : ''
              }`}
              title="Emojis"
            >
              😊
            </button>

            <button
              type="button"
              onClick={() => setDrawerTab('avatar')}
              className={`flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-900 transition text-lg ${
                drawerTab === 'avatar' ? 'text-[#0084FF] font-bold' : ''
              }`}
              title="Avatar"
            >
              👤
            </button>

            <button
              type="button"
              onClick={() => setDrawerTab('stickers')}
              className={`flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-900 transition text-lg ${
                drawerTab === 'stickers' ? 'text-white' : ''
              }`}
              title="Stickers"
            >
              👾
            </button>

            <button
              type="button"
              onClick={() => setDrawerTab('gif')}
              className={`flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-900 transition text-xs font-bold font-mono ${
                drawerTab === 'gif' ? 'text-white' : ''
              }`}
              title="GIF"
            >
              GIF
            </button>

            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-900 transition text-lg"
              title="Store"
            >
              🏬
            </button>
          </div>

          {/* SECTION 1: "Send effects" (Matches Image 2 exactly with the typed text!) */}
          <div className="mb-4">
            <h4 className="text-xs font-bold text-slate-400 mb-2">Send effects</h4>
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {/* 1. Hearts Effect Pill */}
              <button
                type="button"
                onClick={() => handleSendWithEffect('hearts')}
                className="relative flex items-center justify-center rounded-full bg-[#0084FF] px-5 py-2 text-white font-medium text-xs shadow-md hover:scale-105 active:scale-95 transition flex-shrink-0"
                title="Send with floating hearts"
              >
                <span className="absolute -top-1.5 -left-1 text-base">💖</span>
                <span className="absolute -bottom-1 -right-1 text-sm">💕</span>
                <span className="truncate max-w-[110px]">{previewText}</span>
              </button>

              {/* 2. Gift Box Effect Pill (Wrapped in pink gift paper with ribbon!) */}
              <button
                type="button"
                onClick={() => handleSendWithEffect('gift')}
                className="relative flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 px-6 py-2 text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition flex-shrink-0 overflow-hidden ring-1 ring-pink-400"
                title="Send as wrapped gift box (Tapped to unwrap)"
              >
                {/* Ribbon overlay */}
                <span className="absolute inset-y-0 w-2.5 bg-white/70 transform -skew-x-12 left-1/2 -translate-x-1/2" />
                <span className="absolute text-base left-1/2 -translate-x-1/2 z-10">🎀</span>
                <span className="opacity-0">{previewText}</span>
              </button>

              {/* 3. TIME-LOCK EFFECT PILL (🔒 New Feature wrapped in padlock vault!) */}
              <button
                type="button"
                onClick={() => handleSendWithEffect('lock')}
                className="group relative flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 px-4 py-2 text-amber-100 font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition flex-shrink-0 ring-1 ring-amber-400/50"
                title="Send as Time-Locked Message (Click to configure duration and timer)"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-black text-[10px] font-bold">
                  🔒
                </span>
                <span className="truncate max-w-[90px]">{previewText}</span>
                <span className="ml-1 text-[10px] bg-black/40 px-1.5 py-0.5 rounded-full text-amber-200 group-hover:bg-amber-400 group-hover:text-black transition">
                  ⚙️ Setup
                </span>
              </button>

              {/* 4. Fire Effect Pill */}
              <button
                type="button"
                onClick={() => handleSendWithEffect('fire')}
                className="relative flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-amber-500 px-5 py-2 text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition flex-shrink-0 ring-1 ring-orange-400"
                title="Send with flames"
              >
                <span className="absolute -top-1.5 -left-1 text-sm">🔥</span>
                <span className="truncate max-w-[110px]">{previewText}</span>
              </button>

              {/* 5. Celebration Confetti Effect Pill */}
              <button
                type="button"
                onClick={() => handleSendWithEffect('confetti')}
                className="relative flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition flex-shrink-0 ring-1 ring-purple-400"
                title="Send with celebration confetti"
              >
                <span className="absolute -top-1 -right-1 text-sm">🎉</span>
                <span className="truncate max-w-[110px]">{previewText}</span>
              </button>
            </div>
          </div>

          {/* SECTION 2: "Suggested" (Matches Image 2 exactly with avatar stickers!) */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 mb-2">Suggested</h4>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {(suggestion?.stickers || []).map((sticker) => (
                <button
                  key={sticker.id}
                  type="button"
                  onClick={() => handleSendSticker(sticker)}
                  className="group relative flex flex-col items-center rounded-2xl bg-slate-900/60 p-2 hover:bg-slate-800 transition active:scale-95"
                  title={`Send "${sticker.label}" sticker`}
                >
                  <div className="relative h-18 w-18 overflow-hidden rounded-full my-1">
                    <img
                      src={sticker.image}
                      alt={sticker.label}
                      className="h-full w-full object-cover group-hover:scale-110 transition duration-200"
                    />
                  </div>
                  <div className={`w-full text-center py-1 px-1 rounded-full text-[10px] font-bold shadow-xs truncate ${sticker.bannerBg}`}>
                    {sticker.bannerText}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LOCK SETTINGS MODAL (Opens when clicking Time-Lock in Send effects) */}
      {showLockSettingsModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowLockSettingsModal(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-amber-500/30 bg-[#121212] p-6 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                  <span className="text-base">🔒</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Time-Lock Message Settings</h3>
                  <p className="text-[11px] text-slate-400">Choose lock duration and receiver timer visibility</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLockSettingsModal(false)}
                className="h-8 w-8 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Message Preview */}
            <div className="my-4 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
              <p className="text-[11px] text-slate-400 font-semibold mb-1">Message to lock:</p>
              <p className="text-sm text-slate-100 font-medium italic truncate">"{text}"</p>
            </div>

            {/* 1. Duration Presets */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Lock Duration (when should it unlock?):
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyDurationPreset('30s', 30)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    lockDurationType === '30s'
                      ? 'border-amber-400 bg-amber-950 text-amber-300'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  ⚡ 30s (Quick Demo)
                </button>
                <button
                  type="button"
                  onClick={() => applyDurationPreset('5m', 300)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    lockDurationType === '5m'
                      ? 'border-amber-400 bg-amber-950 text-amber-300'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  ⏱️ 5 Minutes
                </button>
                <button
                  type="button"
                  onClick={() => applyDurationPreset('1h', 3600)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    lockDurationType === '1h'
                      ? 'border-amber-400 bg-amber-950 text-amber-300'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  🕒 1 Hour
                </button>
                <button
                  type="button"
                  onClick={() => applyDurationPreset('1d', 86400)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    lockDurationType === '1d'
                      ? 'border-amber-400 bg-amber-950 text-amber-300'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  📅 1 Day
                </button>
                <button
                  type="button"
                  onClick={() => applyDurationPreset('3d', 3 * 86400)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    lockDurationType === '3d'
                      ? 'border-amber-400 bg-amber-950 text-amber-300'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  🗓️ 3 Days
                </button>
                <button
                  type="button"
                  onClick={() => applyDurationPreset('7d', 7 * 86400)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    lockDurationType === '7d'
                      ? 'border-amber-400 bg-amber-950 text-amber-300'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  🗓️ 7 Days
                </button>
                <button
                  type="button"
                  onClick={() => applyDurationPreset('30d', 30 * 86400)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    lockDurationType === '30d'
                      ? 'border-amber-400 bg-amber-950 text-amber-300'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  🗓️ 30 Days
                </button>
              </div>

              {/* Custom Date Input */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Custom time:</span>
                <input
                  type="datetime-local"
                  value={unlockDateTime}
                  onChange={(e) => {
                    setUnlockDateTime(e.target.value);
                    setLockDurationType('custom');
                  }}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* 2. Receiver Timer Visibility Toggle */}
            <div className="border-t border-slate-800 pt-3 mb-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-200">
                    Show Countdown Timer to Receiver?
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {showTimerToReceiver
                      ? '🟢 ON: Receiver sees live remaining countdown timer until unlock.'
                      : '🙈 OFF: Timer is hidden. Receiver cannot see countdown.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowTimerToReceiver(!showTimerToReceiver)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    showTimerToReceiver ? 'bg-emerald-600' : 'bg-slate-700'
                  }`}
                  title="Toggle receiver timer visibility"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      showTimerToReceiver ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
              <button
                type="button"
                onClick={() => setShowLockSettingsModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSendLock}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/25 active:scale-95 transition"
              >
                <span>🔒</span>
                <span>Send Locked Message</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
