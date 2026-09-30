import React, { useState } from 'react';
import {
  Message,
  ChatTheme,
  User,
  isMessageCurrentlyLocked,
  formatLockCountdown,
  formatUnlockDate,
} from '../types/messenger';
import { CURRENT_USER } from '../data/mockData';
import LockedDetailModal from './LockedDetailModal';

interface MessageBubbleProps {
  message: Message;
  participant: User;
  theme: ChatTheme;
  isLastInGroup: boolean;
  perspective?: 'sender' | 'receiver';
  currentTime?: Date;
  onReact: (messageId: string, emoji: string) => void;
  onDelete: (messageId: string) => void;
  onToggleGift?: (messageId: string) => void;
  onToggleTimerVisibility?: (messageId: string) => void;
}

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

export default function MessageBubble({
  message,
  participant,
  theme,
  isLastInGroup,
  perspective = 'sender',
  currentTime = new Date(),
  onReact,
  onDelete,
  onToggleGift,
  onToggleTimerVisibility,
}: MessageBubbleProps) {
  const [showToolbar, setShowToolbar] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [localGiftOpened, setLocalGiftOpened] = useState(false);
  const [showLockedModal, setShowLockedModal] = useState(false);

  // Determine if the current viewer sent this message
  const isOutgoing = perspective === 'sender'
    ? message.senderId === 'me'
    : message.senderId !== 'me';

  // Determine if the current viewer is the author of a time-locked message
  const viewerIsAuthorOfLockedMsg = isOutgoing;

  // The partner's avatar and name to display when an incoming message is received
  const incomingAvatar = perspective === 'sender' ? participant.avatar : CURRENT_USER.avatar;
  const incomingName = perspective === 'sender' ? participant.name : CURRENT_USER.name;

  const isGiftOpened = message.isGiftOpened || localGiftOpened;

  // Check if message is currently time-locked
  const isLocked = isMessageCurrentlyLocked(message, currentTime);
  const remaining = message.unlockAt ? formatLockCountdown(message.unlockAt, currentTime) : '';
  const formattedUnlock = message.unlockAt ? formatUnlockDate(message.unlockAt) : '';

  // Group reactions by emoji
  const reactionCounts = message.reactions.reduce<Record<string, number>>((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] || 0) + 1;
    return acc;
  }, {});

  const hasReactions = message.reactions.length > 0;

  // 1. LOCKED MESSAGE IN RECEIVER VIEW (Strict Privacy: Content is never rendered!)
  if (message.isLocked && isLocked && !viewerIsAuthorOfLockedMsg) {
    return (
      <>
        <div className="flex w-full items-end gap-2 my-2 justify-start group">
          {isLastInGroup ? (
            <img
              src={incomingAvatar}
              alt={incomingName}
              className="h-7 w-7 rounded-full object-cover mb-1 flex-shrink-0"
            />
          ) : (
            <div className="w-7 flex-shrink-0" />
          )}

          <div
            onClick={() => setShowLockedModal(true)}
            className="cursor-pointer max-w-[85%] sm:max-w-[70%] rounded-2xl rounded-bl-xs border border-amber-500/40 bg-gradient-to-br from-amber-950/80 via-slate-900 to-black p-3.5 shadow-lg hover:border-amber-400 transition active:scale-[0.99]"
            role="button"
            tabIndex={0}
            title="Click to view lock details"
          >
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-xs">
                🔒
              </span>
              <span>Message Locked</span>
            </div>

            <p className="mt-1 text-xs text-slate-300">
              This message will be available on{' '}
              <strong className="text-amber-200">{formattedUnlock}</strong>
            </p>

            {/* Countdown Display: Controlled by showTimerToReceiver */}
            <div className="mt-2.5 pt-2 border-t border-amber-900/40 flex items-center justify-between text-[11px]">
              {message.showTimerToReceiver ? (
                <>
                  <span className="text-slate-400">Unlocks in</span>
                  <span className="font-mono font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800/60">
                    {remaining}
                  </span>
                </>
              ) : (
                <span className="text-[11px] text-slate-400 italic">
                  🔒 Countdown timer hidden by sender
                </span>
              )}
            </div>

            <div className="mt-1 flex justify-end text-[10px] text-amber-400/80 hover:underline">
              Tap for info →
            </div>
          </div>
        </div>

        {showLockedModal && message.unlockAt && (
          <LockedDetailModal
            unlockAt={message.unlockAt}
            showTimerToReceiver={message.showTimerToReceiver}
            currentTime={currentTime}
            onClose={() => setShowLockedModal(false)}
          />
        )}
      </>
    );
  }

  // 2. AVATAR STICKER RENDERING
  if (message.isSticker && message.stickerImage) {
    return (
      <div
        className={`flex w-full items-end gap-2 group my-2 ${
          isOutgoing ? 'justify-end' : 'justify-start'
        }`}
        onMouseEnter={() => setShowToolbar(true)}
        onMouseLeave={() => {
          setShowToolbar(false);
          setShowReactionPicker(false);
        }}
      >
        {!isOutgoing && isLastInGroup ? (
          <img
            src={incomingAvatar}
            alt={incomingName}
            className="h-7 w-7 rounded-full object-cover mb-1 flex-shrink-0"
          />
        ) : (
          !isOutgoing && <div className="w-7 flex-shrink-0" />
        )}

        <div className="relative flex flex-col items-center max-w-[180px] group-hover:scale-105 transition duration-200">
          <div className="relative h-28 w-28 overflow-hidden rounded-full ring-4 ring-pink-500/30 shadow-lg">
            <img
              src={message.stickerImage}
              alt={message.text}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-1 w-full text-center py-1.5 px-3 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md shadow-pink-500/30">
            {message.text}
          </div>

          {showToolbar && (
            <div
              className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1 z-20 ${
                isOutgoing ? '-left-20' : '-right-20'
              }`}
            >
              <button
                type="button"
                onClick={() => setShowReactionPicker(!showReactionPicker)}
                className="h-7 w-7 rounded-full bg-slate-800 shadow-md border border-slate-700 text-sm flex items-center justify-center hover:scale-110 transition text-white"
                title="React"
              >
                😊
              </button>
              {isOutgoing && (
                <button
                  type="button"
                  onClick={() => onDelete(message.id)}
                  className="h-7 w-7 rounded-full bg-slate-800 shadow-md border border-slate-700 text-xs text-red-400 flex items-center justify-center hover:scale-110 transition"
                  title="Remove"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. LARGE THUMBS UP / SINGLE EMOJI RENDERING
  if (message.isThumbsUp) {
    return (
      <div
        className={`flex w-full items-end gap-2 group my-1 ${
          isOutgoing ? 'justify-end' : 'justify-start'
        }`}
        onMouseEnter={() => setShowToolbar(true)}
        onMouseLeave={() => {
          setShowToolbar(false);
          setShowReactionPicker(false);
        }}
      >
        {!isOutgoing && isLastInGroup ? (
          <img
            src={incomingAvatar}
            alt={incomingName}
            className="h-7 w-7 rounded-full object-cover mb-1 flex-shrink-0"
          />
        ) : (
          !isOutgoing && <div className="w-7 flex-shrink-0" />
        )}

        <div className="relative">
          <span className="text-4xl select-none inline-block animate-in zoom-in-75 duration-150">
            {message.text}
          </span>

          {showToolbar && (
            <div
              className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1 z-20 ${
                isOutgoing ? '-left-20' : '-right-20'
              }`}
            >
              <button
                type="button"
                onClick={() => setShowReactionPicker(!showReactionPicker)}
                className="h-7 w-7 rounded-full bg-slate-800 shadow-md border border-slate-700 text-sm flex items-center justify-center hover:scale-110 transition text-white"
                title="React"
              >
                😊
              </button>
              {isOutgoing && (
                <button
                  type="button"
                  onClick={() => onDelete(message.id)}
                  className="h-7 w-7 rounded-full bg-slate-800 shadow-md border border-slate-700 text-xs text-red-400 flex items-center justify-center hover:scale-110 transition"
                  title="Remove"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 4. GIFT BOX EFFECT
  if (message.effect === 'gift' && !isGiftOpened) {
    return (
      <div className={`flex w-full items-end gap-2 my-1 ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
        {!isOutgoing && isLastInGroup ? (
          <img
            src={incomingAvatar}
            alt={incomingName}
            className="h-7 w-7 rounded-full object-cover mb-1 flex-shrink-0"
          />
        ) : (
          !isOutgoing && <div className="w-7 flex-shrink-0" />
        )}
        <button
          type="button"
          onClick={() => {
            setLocalGiftOpened(true);
            onToggleGift?.(message.id);
          }}
          className="relative flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 px-4 py-2.5 text-white shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer ring-2 ring-amber-300 animate-pulse"
          title="Tap to unwrap gift message!"
        >
          <span className="text-2xl animate-bounce">🎁</span>
          <div className="text-left">
            <p className="text-xs font-bold leading-tight">Gift Message</p>
            <p className="text-[10px] text-amber-200">Tap to unwrap</p>
          </div>
        </button>
      </div>
    );
  }

  // 5. REGULAR BUBBLE (WITH SPECIAL SENDER TIME-LOCK BADGE IF AUTHOR)
  return (
    <div
      className={`flex flex-col ${isOutgoing ? 'items-end' : 'items-start'} my-0.5 group`}
      onMouseEnter={() => setShowToolbar(true)}
      onMouseLeave={() => {
        setShowToolbar(false);
        setShowReactionPicker(false);
      }}
    >
      <div className={`flex w-full items-end gap-2 ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
        {!isOutgoing && isLastInGroup ? (
          <img
            src={incomingAvatar}
            alt={incomingName}
            className="h-7 w-7 rounded-full object-cover mb-1 flex-shrink-0"
          />
        ) : (
          !isOutgoing && <div className="w-7 flex-shrink-0" />
        )}

        <div className="relative max-w-[75%] sm:max-w-[65%]">
          {/* Floating Hearts Effect */}
          {message.effect === 'hearts' && (
            <div className="pointer-events-none absolute -top-4 -left-2 -right-2 flex justify-between z-10 text-sm animate-bounce">
              <span className="animate-ping">💖</span>
              <span>💕</span>
              <span className="animate-ping">💗</span>
            </div>
          )}

          {/* Celebration Confetti Effect */}
          {message.effect === 'confetti' && (
            <div className="pointer-events-none absolute -top-3 -left-2 -right-2 flex justify-between z-10 text-xs">
              <span>✨</span>
              <span>🎉</span>
              <span>🎊</span>
            </div>
          )}

          {/* Hover Toolbar */}
          {showToolbar && (
            <div
              className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1 z-30 ${
                isOutgoing ? '-left-24' : '-right-24'
              }`}
            >
              <button
                type="button"
                onClick={() => setShowReactionPicker(!showReactionPicker)}
                className="h-7 w-7 rounded-full bg-slate-800 shadow-md border border-slate-700 text-sm flex items-center justify-center hover:scale-110 transition text-white"
                title="React"
              >
                😊
              </button>
              <button
                type="button"
                className="h-7 w-7 rounded-full bg-slate-800 shadow-md border border-slate-700 text-xs text-slate-300 flex items-center justify-center hover:scale-110 transition"
                title="Reply"
              >
                ↩
              </button>
              {isOutgoing && (
                <button
                  type="button"
                  onClick={() => onDelete(message.id)}
                  className="h-7 w-7 rounded-full bg-slate-800 shadow-md border border-slate-700 text-xs text-red-400 flex items-center justify-center hover:scale-110 transition"
                  title="Remove"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* Reaction Picker Bar */}
          {showReactionPicker && (
            <div
              className={`absolute -top-10 z-40 flex items-center gap-1.5 rounded-full bg-slate-900 px-2.5 py-1 shadow-xl border border-slate-700 animate-in zoom-in-95 duration-100 ${
                isOutgoing ? 'right-0' : 'left-0'
              }`}
            >
              {QUICK_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    onReact(message.id, emoji);
                    setShowReactionPicker(false);
                  }}
                  className="text-lg hover:scale-130 transition duration-150 transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Message Bubble Content */}
          <div
            className={`relative rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words ${
              message.isLocked && isLocked
                ? 'bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white ring-1 ring-amber-400/40 shadow-md'
                : message.effect === 'fire'
                ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white ring-2 ring-orange-400 shadow-lg shadow-orange-500/30'
                : message.effect === 'hearts'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-pink-500/20'
                : message.effect === 'gift'
                ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white ring-2 ring-amber-300'
                : isOutgoing
                ? `${theme.outgoingClass} rounded-br-xs shadow-xs`
                : 'bg-[#262626] text-slate-100 rounded-bl-xs'
            }`}
          >
            {message.text}

            <span
              className={`opacity-0 group-hover:opacity-100 transition text-[10px] ml-2 select-none ${
                isOutgoing ? 'text-white/70' : 'text-slate-400'
              }`}
            >
              {message.timestamp}
            </span>
          </div>

          {/* Reactions Pill */}
          {hasReactions && (
            <div
              className={`absolute -bottom-2 flex items-center gap-0.5 rounded-full bg-slate-900 px-1.5 py-0.5 shadow-md border border-slate-700 text-xs cursor-pointer hover:scale-105 transition z-10 ${
                isOutgoing ? 'right-2' : 'left-2'
              }`}
              onClick={() => onReact(message.id, '❤️')}
              title="Reactions"
            >
              {Object.entries(reactionCounts).map(([emoji, count]) => (
                <span key={emoji} className="flex items-center text-xs">
                  <span>{emoji}</span>
                  {count > 1 && (
                    <span className="text-[10px] text-slate-400 font-semibold ml-0.5">
                      {count}
                    </span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        {isOutgoing && isLastInGroup && message.status === 'seen' && (
          <img
            src={incomingAvatar}
            alt="Seen"
            className="h-3.5 w-3.5 rounded-full object-cover mb-1 flex-shrink-0"
            title={`Seen at ${message.timestamp}`}
          />
        )}
      </div>

      {/* SENDER'S TIME-LOCK BADGE (Visible to Sender) */}
      {message.isLocked && viewerIsAuthorOfLockedMsg && (
        <div className="mt-1 flex items-center gap-2 rounded-lg bg-amber-950/80 px-2.5 py-1 text-[11px] border border-amber-800/60 max-w-sm">
          {isLocked ? (
            <>
              <span className="text-amber-400 font-bold">🔒 Locked for recipient</span>
              <span className="text-amber-500">•</span>
              <span className="text-amber-200">Unlocks {formattedUnlock}</span>
              <span className="text-amber-500">•</span>
              {/* Toggleable button to turn receiver timer on/off anytime */}
              <button
                type="button"
                onClick={() => onToggleTimerVisibility?.(message.id)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition ${
                  message.showTimerToReceiver
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
                }`}
                title="Click to toggle whether receiver can see countdown timer"
              >
                {message.showTimerToReceiver ? '⏱️ Timer Visible' : '🙈 Timer Hidden'}
              </button>
            </>
          ) : (
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span>🔓</span>
              <span>Now Unlocked for recipient</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}