import React from 'react';
import { Message, MessageType } from '../types/message';
import ConversationHeader from './ConversationHeader';
import MessageList from './MessageList';
import MessageComposer from './MessageComposer';

interface SenderPanelProps {
  messages: Message[];
  currentTime: Date;
  onSendMessage: (text: string, options?: { type?: MessageType; unlockAt?: string }) => void;
}

export default function SenderPanel({ messages, currentTime, onSendMessage }: SenderPanelProps) {
  return (
    <section className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
      <ConversationHeader
        title="Sender"
        subtitle="You"
        avatarLetter="Y"
        avatarBgColor="bg-indigo-600"
        perspectiveLabel="Sender View"
        isOnline={true}
      />

      <MessageList messages={messages} perspective="sender" currentTime={currentTime} />

      <MessageComposer onSendMessage={onSendMessage} />
    </section>
  );
}
