import React from 'react';
import { Conversation } from '../types/messenger';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
}

export default function ConversationItem({
  conversation,
  isActive,
  onSelect,
}: ConversationItemProps) {
  const { participant, messages, unreadCount } = conversation;
  const lastMsg = messages[messages.length - 1];

  let previewText = 'No messages yet';
  let isFromMe = false;

  if (lastMsg) {
    isFromMe = lastMsg.senderId === 'me';
    previewText = isFromMe ? `You: ${lastMsg.text}` : lastMsg.text;
  }

  const isUnread = unreadCount > 0;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition duration-150 ${
        isActive
          ? 'bg-[#242424] text-white'
          : 'hover:bg-[#1A1A1A] text-slate-300'
      }`}
    >
      {/* Avatar with Online Dot */}
      <div className="relative flex-shrink-0">
        <img
          src={participant.avatar}
          alt={participant.name}
          className="h-12 w-12 rounded-full object-cover"
        />
        {participant.isOnline && (
          <span
            className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#121212] bg-emerald-500"
            title="Active now"
          />
        )}
      </div>

      {/* Info & Snippet */}
      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span
            className={`truncate text-sm ${
              isUnread ? 'font-bold text-white' : 'font-semibold text-slate-200'
            }`}
          >
            {participant.name}
          </span>
          {lastMsg && (
            <span
              className={`text-[11px] flex-shrink-0 ${
                isUnread ? 'font-bold text-[#0084FF]' : 'text-slate-400'
              }`}
            >
              {lastMsg.timestamp}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p
            className={`truncate text-xs ${
              isUnread
                ? 'font-bold text-slate-100'
                : 'text-slate-400 font-normal'
            }`}
          >
            {previewText}
          </p>

          {/* Seen receipt avatar or Unread Badge */}
          {isUnread ? (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0084FF] px-1 text-[10px] font-bold text-white flex-shrink-0">
              {unreadCount}
            </span>
          ) : isFromMe && lastMsg?.status === 'seen' ? (
            <img
              src={participant.avatar}
              alt="Seen"
              className="h-3.5 w-3.5 rounded-full object-cover flex-shrink-0"
              title={`Seen at ${lastMsg.timestamp}`}
            />
          ) : isFromMe && lastMsg?.status === 'delivered' ? (
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-700 text-[9px] text-slate-300">
              ✓
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}
