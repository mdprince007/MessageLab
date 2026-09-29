import React, { useEffect, useRef } from 'react';
import { Conversation } from '../types/messenger';
import MessageBubble from './MessageBubble';

interface MessageAreaProps {
  conversation: Conversation;
  isTyping: boolean;
  perspective?: 'sender' | 'receiver';
  currentTime?: Date;
  onReact: (messageId: string, emoji: string) => void;
  onDelete: (messageId: string) => void;
  onToggleGift?: (messageId: string) => void;
  onToggleTimerVisibility?: (messageId: string) => void;
}

export default function MessageArea({
  conversation,
  isTyping,
  perspective = 'sender',
  currentTime = new Date(),
  onReact,
  onDelete,
  onToggleGift,
  onToggleTimerVisibility,
}: MessageAreaProps) {
  const { participant, messages, theme } = conversation;
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 bg-[#000000] text-slate-100 scrollbar-thin scrollbar-thumb-slate-800">
      {/* Intro Profile Card at Top of Thread */}
      <div className="flex flex-col items-center justify-center pt-6 pb-8 text-center border-b border-slate-900 mb-6">
        <div className="relative mb-3">
          <img
            src={participant.avatar}
            alt={participant.name}
            className="h-20 w-20 rounded-full object-cover shadow-sm ring-4 ring-slate-800"
          />
          {participant.isOnline && (
            <span
              className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-3 border-black bg-emerald-500"
              title="Active now"
            />
          )}
        </div>
        <h3 className="text-lg font-bold text-white">{participant.name}</h3>
        <p className="text-xs text-slate-400 mt-0.5">Messenger • @{participant.username}</p>
        {participant.bio && (
          <p className="text-xs text-slate-300 max-w-xs mt-2 italic bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
            {participant.bio}
          </p>
        )}
        <p className="text-[11px] text-slate-500 mt-2">
          You're connected on Messenger
        </p>
      </div>

      {/* Media Video Share Preview Card (Inspired by user's screenshot) */}
      <div className="my-4 flex flex-col items-center">
        <span className="text-[11px] font-semibold text-slate-500 mb-2 uppercase tracking-wider">
          SUN AT 9:23 AM
        </span>
        <div className="relative max-w-xs rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl group cursor-pointer hover:border-slate-700 transition">
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-[11px] text-white">
            <img src={participant.avatar} alt="Profile" className="h-4 w-4 rounded-full" />
            <span className="font-medium truncate max-w-[120px]">{participant.name}</span>
          </div>
          <img
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80"
            alt="Shared video"
            className="w-full h-52 object-cover opacity-90 group-hover:opacity-100 transition"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-black/70 flex items-center justify-center text-white text-lg shadow-lg group-hover:scale-110 transition">
              ▶
            </div>
          </div>
        </div>
      </div>

      {/* Message Timeline */}
      <div className="space-y-1">
        {messages.map((message, index) => {
          const nextMessage = messages[index + 1];
          const isLastInGroup =
            !nextMessage || nextMessage.senderId !== message.senderId;

          return (
            <MessageBubble
              key={message.id}
              message={message}
              participant={participant}
              theme={theme}
              isLastInGroup={isLastInGroup}
              perspective={perspective}
              currentTime={currentTime}
              onReact={onReact}
              onDelete={onDelete}
              onToggleGift={onToggleGift}
              onToggleTimerVisibility={onToggleTimerVisibility}
            />
          );
        })}
      </div>

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex items-center gap-2 mt-2">
          <img
            src={participant.avatar}
            alt={participant.name}
            className="h-7 w-7 rounded-full object-cover"
          />
          <div className="flex items-center gap-1 rounded-2xl bg-[#262626] px-3.5 py-2.5 shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
