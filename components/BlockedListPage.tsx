
import React, { useState } from 'react';
import type { MockUser } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

const UserRow: React.FC<{ user: MockUser; onUnblock: (id: number) => void }> = ({ user, onUnblock }) => {
    const getAvatar = () => {
        // Special avatar for "Daniel..." based on mock user ID
        if (user.id === 4002) { 
            return (
                <div className="w-12 h-12 rounded-full bg-[#5856d6] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    M
                </div>
            );
        }
        // Special avatar for "nubank" based on mock user ID
        if (user.id === 4012) { 
             return (
                <div className="w-12 h-12 rounded-full bg-[#820AD1] flex items-center justify-center flex-shrink-0">
                   <svg width="24" height="24" viewBox="0 0 53 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M25.0455 16.5332V35.4665H27.9922V22.2852L41.3322 35.4665H44.2788V16.5332H41.3322V29.7145L27.9922 16.5332H25.0455Z" fill="white"/>
                    </svg>
                </div>
            );
        }
        // Default image avatar
        return <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />;
    };

    return (
        <div className="flex items-center p-4">
            {getAvatar()}
            <div className="flex-1 ml-4 overflow-hidden">
                <p className="font-semibold text-white text-base truncate">{user.name}</p>
            </div>
            <button
                onClick={() => onUnblock(user.id)}
                className="flex-shrink-0 px-5 py-2 rounded-full text-white font-semibold text-sm bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 transition-opacity"
            >
                Desbloquear
            </button>
        </div>
    );
};

interface BlockedListPageProps {
    onGoBack: () => void;
    initialBlockedUsers: MockUser[];
}

export const BlockedListPage: React.FC<BlockedListPageProps> = ({ onGoBack, initialBlockedUsers }) => {
    const [blockedUsers, setBlockedUsers] = useState(initialBlockedUsers);

    const handleUnblock = (userId: number) => {
        setBlockedUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
    };

    return (
        <div className="bg-[#121212] text-white min-h-screen flex flex-col">
            <header className="sticky top-0 z-30 bg-[#121212] flex items-center justify-between px-4 h-[65px] border-b border-gray-800">
                <button onClick={onGoBack} className="p-2 text-gray-300 hover:text-white">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-lg font-bold text-white">
                    Lista de bloqueio
                </h1>
                <div className="w-10"></div> {/* Placeholder to center title */}
            </header>
            <main className="flex-1 overflow-y-auto">
                {blockedUsers.length > 0 ? (
                    <div className="divide-y divide-gray-800">
                        {blockedUsers.map(user => (
                            <UserRow key={user.id} user={user} onUnblock={handleUnblock} />
                        ))}
                    </div>
                ) : (
                     <div className="flex items-center justify-center h-full text-center p-4">
                        <p className="text-gray-500">Nenhum usuário bloqueado.</p>
                    </div>
                )}
            </main>
        </div>
    );
};