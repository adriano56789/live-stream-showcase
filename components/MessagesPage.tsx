

import React, { useState, useMemo } from 'react';
import type { Conversation, MockUser } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { SearchIcon } from './icons/SearchIcon';
import { MuteIcon } from './icons/MuteIcon';

interface MessagesPageProps {
  conversations: Conversation[];
  onSelectConversation: (user: MockUser) => void;
  onGoBack: () => void;
}

const ConversationRow: React.FC<{ convo: Conversation, onClick: () => void }> = ({ convo, onClick }) => {
    const { user, lastMessage, timestamp, unreadCount, isMuted, isPinned } = convo;

    return (
        <button onClick={onClick} className="w-full flex items-center p-4 hover:bg-white/5 transition-colors text-left">
            <div className="relative">
                <img src={user.avatarUrl} alt={user.name} className="w-14 h-14 rounded-full object-cover" />
                 {user.isLive && <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-[#1C1C1E]" />}
            </div>
            <div className="flex-1 ml-4 overflow-hidden">
                <div className="flex justify-between items-center">
                    <p className="font-bold text-white text-base truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 flex-shrink-0 ml-2">{timestamp}</p>
                </div>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-gray-400 truncate pr-2">{lastMessage}</p>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                       {isMuted && <MuteIcon className="w-4 h-4 text-gray-500" />}
                       {unreadCount > 0 && (
                            <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {unreadCount}
                            </div>
                       )}
                    </div>
                </div>
            </div>
        </button>
    );
};


export const MessagesPage: React.FC<MessagesPageProps> = ({ conversations, onSelectConversation, onGoBack }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredConversations = useMemo(() => {
        if (!searchQuery) return conversations;
        const lowercasedQuery = searchQuery.toLowerCase();
        return conversations.filter(convo => convo.user.name.toLowerCase().includes(lowercasedQuery));
    }, [conversations, searchQuery]);

    const pinnedConversations = filteredConversations.filter(c => c.isPinned);
    const regularConversations = filteredConversations.filter(c => !c.isPinned);

    return (
        <div className="bg-[#121212] text-white min-h-screen flex flex-col">
            <header className="sticky top-0 z-30 bg-[#121212] flex items-center justify-between px-4 h-[65px] border-b border-gray-800">
                <button onClick={onGoBack} className="p-2 -ml-2 text-gray-300 hover:text-white">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-lg font-bold text-white">
                    Mensagens
                </h1>
                <div className="w-8"></div> {/* Placeholder for centering */}
            </header>
            <div className="sticky top-[65px] z-20 bg-[#121212] p-4">
                 <div className="relative">
                    <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"/>
                    <input
                        type="text"
                        placeholder="Pesquisar"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#1C1C1E] rounded-full py-2.5 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                </div>
            </div>
            <main className="flex-1 overflow-y-auto">
                 {pinnedConversations.length > 0 && (
                    <div className="divide-y divide-gray-800 bg-white/5">
                        {pinnedConversations.map(convo => (
                            <ConversationRow key={convo.user.id} convo={convo} onClick={() => onSelectConversation(convo.user)} />
                        ))}
                    </div>
                 )}
                 {regularConversations.length > 0 && (
                     <div className="divide-y divide-gray-800 mt-2">
                        {regularConversations.map(convo => (
                            <ConversationRow key={convo.user.id} convo={convo} onClick={() => onSelectConversation(convo.user)} />
                        ))}
                    </div>
                 )}
            </main>
        </div>
    );
};