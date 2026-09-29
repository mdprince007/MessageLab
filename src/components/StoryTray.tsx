import React from 'react';
import { Conversation } from '../types/messenger';

interface StoryTrayProps {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
}

export default function StoryTray({ conversations, activeId, onSelect }: StoryTrayProps) {
  // Only display users who are online
  const onlineContacts = conversations.filter((c) => c.participant.isOnline);

  return (
    <div className="flex items-center gap-3 overflow-x-auto px-4 py-2 scrollbar-none">
      {onlineContacts.map((c) => {
        const isCurrent = c.id === activeId;
        const firstName = c.participant.name.split(' ')[0];

        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c.id)}
            className="flex flex-col items-center gap-1 flex-shrink-0 group focus:outline-none"
            title={`${c.participant.name} (Active now)`}
          >
            <div className="relative">
              <div
                className={`rounded-full p-0.5 transition ${
                  isCurrent
                    ? 'ring-2 ring-[#0084FF]'
                    : 'ring-2 ring-emerald-500/80 group-hover:ring-[#0084FF]'
                }`}
              >
                <img
                  src={c.participant.avatar}
                  alt={c.participant.name}
                  className="h-11 w-11 rounded-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            <span className="text-[11px] font-medium text-slate-700 max-w-[54px] truncate">
              {firstName}
            </span>
          </button>
        );
      })}
    </div>
  );
}
