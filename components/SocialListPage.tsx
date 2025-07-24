
import React, { useState } from 'react';
import type { MockUser } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { UserPlusIcon } from './icons/UserPlusIcon';
import { UserIcon } from './icons/UserIcon';
import { HeartIcon } from './icons/HeartIcon';


const UserRow: React.FC<{ user: MockUser; onSelectProfile: (user: MockUser) => void }> = ({ user, onSelectProfile }) => {
    const [isFollowed, setIsFollowed] = useState(user.isFollowed);

    const handleFollowClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering onSelectProfile
        // In a real app, this would trigger an API call.
        // For this simulation, we just toggle the local state for immediate UI feedback.
        setIsFollowed(!isFollowed);
    };

    return (
        <button onClick={() => onSelectProfile(user)} className="w-full flex items-center p-4 hover:bg-white/5 transition-colors text-left">
            <img src={user.avatarUrl} alt={user.name} className="w-14 h-14 rounded-full object-cover" />
            <div className="flex-1 ml-4 overflow-hidden">
                <p className="font-bold text-white text-base truncate">{user.name}</p>
                <p className="text-sm text-gray-400 truncate">ID: {user.id}</p> 
                <div className="flex items-center space-x-2 mt-1">
                    <span className="bg-pink-500/20 text-pink-400 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center">
                       <HeartIcon className="w-3 h-3 mr-1 text-pink-400" strokeWidth="3"/>
                        {Math.floor(user.id % 20) + 5}
                    </span>
                    <span className="bg-cyan-500/20 text-cyan-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                        Lv. {Math.floor((parseInt(user.points) || 0) / 1000)}
                    </span>
                </div>
            </div>
            <button
                onClick={handleFollowClick}
                className={`flex-shrink-0 p-2 rounded-full transition-colors ${
                    isFollowed
                        ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                        : 'bg-pink-500 text-white hover:bg-pink-600'
                }`}
                 aria-label={isFollowed ? 'Deixar de seguir' : 'Seguir'}
            >
                {isFollowed ? <UserIcon className="w-6 h-6" /> : <UserPlusIcon className="w-6 h-6" />}
            </button>
        </button>
    );
};

interface SocialListPageProps {
    initialTab: 'fans' | 'following';
    onGoBack: () => void;
    fans: MockUser[];
    following: MockUser[];
    onSelectProfile: (user: MockUser) => void;
}

export const SocialListPage: React.FC<SocialListPageProps> = ({ initialTab, onGoBack, fans, following, onSelectProfile }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const usersToList = activeTab === 'fans' ? fans : following;

    const TabItem: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
        <button onClick={onClick} className="relative py-4 px-2 md:px-4">
            <span className={`text-lg font-semibold transition-colors duration-300 ${active ? 'text-white' : 'text-gray-500 hover:text-white'}`}>
                {label}
            </span>
            {active && <div className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500 rounded-full"></div>}
        </button>
    );

    return (
        <div className="bg-[#121212] text-white min-h-screen flex flex-col">
            <header className="sticky top-0 z-30 bg-[#121212] flex items-center justify-between px-4 h-[65px] border-b border-gray-800">
                <button onClick={onGoBack} className="p-2 text-gray-300 hover:text-white">
                    <ArrowLeftIcon />
                </button>
                <div className="flex items-center space-x-2 md:space-x-4">
                    <TabItem label={`Fãs (${fans.length})`} active={activeTab === 'fans'} onClick={() => setActiveTab('fans')} />
                    <TabItem label={`Seguindo (${following.length})`} active={activeTab === 'following'} onClick={() => setActiveTab('following')} />
                </div>
                <div className="w-10"></div> {/* Placeholder for right icons */}
            </header>
            <main className="flex-1 overflow-y-auto">
                <div className="divide-y divide-gray-800">
                    {usersToList.map(user => (
                        <UserRow key={user.id} user={user} onSelectProfile={onSelectProfile} />
                    ))}
                </div>
            </main>
        </div>
    );
};
