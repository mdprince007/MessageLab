import React, { useEffect, useRef } from 'react';
import { Message } from '../types/message';
import MessageBubble from './MessageBubble';
import EmptyState from './EmptyState';

interface MessageListProps {
  messages: Message[];
  perspective: 'sender' | 'receiver';
  currentTime?: Date;
}

export default function MessageList({ messages, perspective, currentTime }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(messages.length);

  useEffect(() => {
    // Smooth scroll on new message
    if (messages.length > prevCountRef.current || messages.length === 1) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevCountRef.current = messages.length;
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-50/50">
        <EmptyState perspective={perspective} />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
      {/* Session Start Marker */}
      <div className="flex items-center justify-center my-2">
        <span className="rounded-full bg-slate-200/70 px-3 py-1 text-[11px] font-medium text-slate-600">
          Conversation Started
        </span>
      </div>

      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          perspective={perspective}
          currentTime={currentTime}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
