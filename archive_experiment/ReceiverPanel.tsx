import React from 'react';
import { Message } from '../types/message';
import ConversationHeader from './ConversationHeader';
import MessageList from './MessageList';

interface ReceiverPanelProps {
  messages: Message[];
  currentTime: Date;
}

export default function ReceiverPanel({ messages, currentTime }: ReceiverPanelProps) {
  return (
    <section className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
      <ConversationHeader
        title="Receiver"
        subtitle="Recipient"
        avatarLetter="R"
        avatarBgColor="bg-violet-600"
        perspectiveLabel="Receiver View"
        isOnline={true}
      />

      <MessageList messages={messages} perspective="receiver" currentTime={currentTime} />

      {/* Receiver Device Status Footer */}
      <div className="border-t border-slate-200 bg-slate-50/80 px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Recipient client active · Listening for inbound messages</span>
        </div>
      </div>
    </section>
  );
}
