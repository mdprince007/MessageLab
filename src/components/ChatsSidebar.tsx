import React, { useState } from 'react';
import { Conversation } from '../types/messenger';
import StoryTray from './StoryTray';
import ConversationItem from './ConversationItem';

interface ChatsSidebarProps {
  conversations: Conversation[];
  activeId: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectConversation: (id: string) => void;
}

export default function ChatsSidebar({
  conversations,
  activeId,
  searchQuery,
  onSearchChange,
  onSelectConversation,
}: ChatsSidebarProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const displayedConversations = conversations.filter((c) => {
    if (filter === 'unread') return c.unreadCount > 0;
    return true;
  });

  return (
    <aside className="flex w-full md:w-80 lg:w-96 flex-col border-r border-slate-900 bg-[#121212] text-white">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
        <h1 className="text-xl font-bold tracking-tight text-white">Chats</h1>
        <div className="flex items-center gap-1 text-slate-300">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-800 transition"
            title="Options"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 transition text-white"
            title="New message"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-1.5">
        <div className="relative flex items-center rounded-full bg-[#242424] px-3 py-2 text-sm text-white focus-within:ring-2 focus-within:ring-[#0084FF]/40">
          <svg className="h-4 w-4 text-slate-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search Messenger"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="text-slate-400 hover:text-white ml-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Stories / Active Now Carousel */}
      {!searchQuery && (
        <div className="border-b border-slate-900 pb-1">
          <StoryTray
            conversations={conversations}
            activeId={activeId}
            onSelect={onSelectConversation}
          />
        </div>
      )}

      {/* Quick Filter Tabs */}
      <div className="flex items-center gap-2 px-4 py-2 text-xs">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`rounded-full px-3 py-1 font-semibold transition ${
            filter === 'all'
              ? 'bg-blue-950 text-[#0084FF]'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={`rounded-full px-3 py-1 font-semibold transition ${
            filter === 'unread'
              ? 'bg-blue-950 text-[#0084FF]'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          Unread
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-800">
        {displayedConversations.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No conversations found.
          </div>
        ) : (
          displayedConversations.map((c) => (
            <ConversationItem
              key={c.id}
              conversation={c}
              isActive={c.id === activeId}
              onSelect={() => onSelectConversation(c.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
