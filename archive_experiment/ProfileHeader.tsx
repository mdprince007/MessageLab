import React from 'react';

interface ProfileHeaderProps {
  name: string;
  isOnline: boolean;
}

export default function ProfileHeader({ name, isOnline }: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-200 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white">
        {name.charAt(0)}
      </div>
      <div>
        <h3 className="font-semibold text-slate-900">{name}</h3>
        <span className={`text-xs ${isOnline ? 'text-green-500' : 'text-slate-400'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
    </div>
  );
}