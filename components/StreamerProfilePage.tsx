

import React, { useState } from 'react';
import type { Streamer, MockUser, ContentPost } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { MoreHorizontalIcon } from './icons/MoreHorizontalIcon';
import { CopyIcon } from './icons/CopyIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { CoinIcon } from './icons/CoinIcon';
import { DiamondIcon } from './icons/DiamondIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ContentGrid } from './VideoGrid';
import { GridIcon } from './icons/GridIcon';
import { ProfileCardIcon } from './icons/ProfileCardIcon';
import { PlusIcon } from './icons/PlusIcon';
import { MessageSquareIcon } from './icons/MessageSquareIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

const BRAZIL_FLAG_URL = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIQSURBVEhLzZbNaxNRGMZndxMlBVEpCgqi4kURLoJiF3ZtrQqpiJvdKFWHChUungp8FP0FBAURf2BxcVEhCq5dC4qIILoXUbQhSQ+dJJMhSVL3hSGHmcyb733vzZv33t4MhBAgP2iKIdrXotT4+Hh2d3d3tVrtR1I/pDHd3d0f1Go1Ho9XjUYjSUnvD3JyjkeNxuPxSvwz+b2/v++tVusTRhI5Pq/0er12dnZ2dDqd9GqYycnJ2dHR0Qs0Lw0A/p5QKBh4enr6x8fH3dXVVb6+vtI0TZOklARw8vLyO4/HIxKJcMHA9PREb29vtbW1VXR0tIeHh1tCQxEA3w+uL1++LpfLRaFQUFZW9sLCwoyNjU1NTY2cnp4+MjJydnNzk5KkX15e/lGr1dD518PjLp/L5fJ4PAuFQjQaTU1NTcvisk6nM1S8Z3h4+CgSiaSmpqays7OVlZWVubm5WlpaWllZ2d/f33Z2dh4bGysoKODz+SSpQ3BwcBcEAcBw/q+/v/+j3t7e1tZWBwcHo6OjvV6vV6vV1e/300mJkZ+fX7S0tDwxMUEI+fX1lQih1WrFm5ubvV4vtVotjSxcLpfruVzusbExlUol+fn5Ghoa+urqKhqNRiwWwzAM3t/fT3x8PAAODQ0tLS0tLSwsDAwMhIREGGOEEDo6Ooo45xKJRCwWi+28vb09Pj7+12Ty+XyMMecc8z/AB4A/9C7Lz92N2QAAAABJRU5ErkJggg==`;

function formatStat(num: number | undefined): string {
    if (num === undefined) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return String(num);
}

const StatItem: React.FC<{ value: string; label: string; icon: React.ReactElement; onClick?: () => void; }> = ({ value, label, icon, onClick }) => (
    <button onClick={onClick} disabled={!onClick} className="text-center disabled:cursor-default transition-transform transform enabled:hover:scale-105">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-gray-400 flex items-center justify-center space-x-1">
            {icon}
            <span>{label}</span>
        </p>
    </button>
);


interface UserProfilePageProps {
    user: Streamer | MockUser;
    onGoBack: () => void;
    onFollowToggle: (userId: number) => void;
    isFollowed: boolean;
    userPosts: ContentPost[];
    onSelectPost: (post: ContentPost, allPosts: ContentPost[]) => void;
    onGoToUserSocial: (tab: 'fans' | 'following') => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ user, onGoBack, onFollowToggle, isFollowed, userPosts, onSelectPost, onGoToUserSocial }) => {
    const [activeTab, setActiveTab] = useState<'videos' | 'profile'>('videos');
    const [showContextMenu, setShowContextMenu] = useState(false);

    const receivedPoints = parseInt(user.points.replace(/[.,]/g, ''), 10) || 0;
    
    let age = '';
    if (user.birthday) {
        const [day, month, year] = user.birthday.split('/').map(Number);
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
        }
        age = String(calculatedAge);
    }
    
    const handleCopyId = () => {
        navigator.clipboard.writeText(String(user.id));
        alert("ID copiado!");
    }
    
    const handleUnfriend = () => {
        onFollowToggle(user.id);
        setShowContextMenu(false);
    }
    
    const handleBlock = () => {
        alert('Usuário bloqueado (simulação).');
        setShowContextMenu(false);
    }

    const handleReport = () => {
        alert('Relatório enviado (simulação).');
        setShowContextMenu(false);
    }

    return (
        <div className="fixed inset-0 bg-[#121212] text-white z-40 overflow-y-auto" onClick={() => showContextMenu && setShowContextMenu(false)}>
            {/* --- Banner and Header --- */}
            <div className="relative h-64">
                <img src={user.streamImageUrl} alt={user.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent" />
                <header className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
                    <button onClick={onGoBack} className="p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <div className="relative">
                        <button onClick={(e) => { e.stopPropagation(); setShowContextMenu(prev => !prev);}} className="p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors">
                            <MoreHorizontalIcon className="w-6 h-6" />
                        </button>
                        {showContextMenu && (
                            <div 
                                className="absolute top-12 right-0 bg-[#2C2C2E]/95 backdrop-blur-md rounded-xl shadow-lg w-auto text-base p-1.5 z-50"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {isFollowed && (
                                    <button onClick={handleUnfriend} className="text-white px-3 py-2.5 whitespace-nowrap hover:bg-white/10 w-full text-left rounded-lg transition-colors">
                                        Cancelar a amizade
                                    </button>
                                )}
                                <button onClick={handleBlock} className="text-white px-3 py-2.5 whitespace-nowrap hover:bg-white/10 w-full text-left rounded-lg transition-colors">
                                    Adicionar à lista de bloqueio
                                </button>
                                <button onClick={handleReport} className="text-white px-3 py-2.5 whitespace-nowrap hover:bg-white/10 w-full text-left rounded-lg transition-colors">
                                    Relatório
                                </button>
                            </div>
                        )}
                    </div>
                </header>
                 {user.isLive && (
                    <div className="absolute top-16 left-4 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg flex items-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse" />
                        LIVE
                    </div>
                )}
            </div>
            
            {/* --- Profile Summary --- */}
            <div className="relative -mt-16 px-4">
                <div className="flex items-end space-x-4">
                    <img src={user.avatarUrl} alt={user.name} className="w-28 h-28 rounded-full border-4 border-[#121212] object-cover" />
                    <div className="pb-2">
                        <p className="text-sm font-semibold text-green-400">● Online</p>
                    </div>
                </div>
                <img src={BRAZIL_FLAG_URL} alt="Brazil Flag" className="absolute top-11 left-[120px] w-7 h-7 rounded-full border-2 border-[#121212]"/>
                
                <div className="flex items-center space-x-2 mt-3">
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    {user.isVerified && <CheckCircleIcon className="w-7 h-7 text-blue-500" />}
                </div>

                
                <div className="flex items-center space-x-2 text-gray-400 mt-2">
                    <span>ID: {user.id}</span>
                    <button onClick={handleCopyId}><CopyIcon className="w-4 h-4 hover:text-white"/></button>
                </div>
                
                <div className="flex items-center space-x-2 mt-2">
                   {age && user.gender === 'Feminino' && <span className="bg-pink-500/20 text-pink-400 text-xs font-bold px-2 py-1 rounded-full">♀ {age}</span>}
                   <span className="bg-cyan-500/20 text-cyan-400 text-xs font-bold px-2 py-1 rounded-full">Y 4</span>
                </div>
                
                {user.location && user.distance && (
                    <div className="flex items-center text-gray-400 text-sm mt-2">
                        <MapPinIcon className="w-4 h-4 mr-1"/>
                        <span>{user.location} | {user.distance}km</span>
                    </div>
                )}
            </div>

            {/* --- Stats --- */}
            <section className="px-4 mt-6">
                <div className="grid grid-cols-4 gap-4 text-white">
                    <StatItem value={formatStat(user.following)} label="Seguidos" icon={<UsersIcon className="w-4 h-4"/>} onClick={() => onGoToUserSocial('following')} />
                    <StatItem value={formatStat(user.followers)} label="Fãs" icon={<UsersIcon className="w-4 h-4"/>} onClick={() => onGoToUserSocial('fans')} />
                    <StatItem value={formatStat(receivedPoints)} label="Recibir" icon={<CoinIcon className="w-4 h-4 text-yellow-400"/>} />
                    <StatItem value={formatStat(user.sentDiamonds)} label="Enviar" icon={<DiamondIcon className="w-4 h-4 text-cyan-400"/>} />
                </div>
            </section>
            
            {/* --- Content Area --- */}
            <main className="mt-6 bg-[#1C1C1E] rounded-t-2xl min-h-[300px] pb-24">
                <div className="flex items-center justify-center border-b border-gray-700">
                    <TabButton label="Publicações" icon={GridIcon} active={activeTab === 'videos'} onClick={() => setActiveTab('videos')} />
                    <TabButton label="Sobre" icon={ProfileCardIcon} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                </div>
                
                <div className="mt-4">
                   {activeTab === 'profile' && (
                       <div className="space-y-4 text-white p-4">
                           <div className="flex justify-between items-center">
                               <span className="text-gray-400">Nome</span>
                               <span className="font-semibold">{user.name} 😊</span>
                           </div>
                           <div className="flex justify-between items-center">
                               <span className="text-gray-400">Aniversário</span>
                               <span className="font-semibold">{user.birthday}</span>
                           </div>
                           <div className="flex justify-between items-center">
                               <span className="text-gray-400">Gênero</span>
                               <span className="font-semibold">{user.gender}</span>
                           </div>
                           <div className="flex justify-between items-center">
                               <span className="text-gray-400">Residência atual</span>
                               <span className="font-semibold">{user.location}</span>
                           </div>
                       </div>
                   )}
                   {activeTab === 'videos' && (
                       <ContentGrid posts={userPosts} onSelectPost={onSelectPost} />
                   )}
                </div>
            </main>
            
            {/* --- Footer Actions --- */}
            <footer className="fixed bottom-0 left-0 right-0 bg-[#1C1C1E]/80 backdrop-blur-sm p-4 border-t border-white/10">
                 <div className="flex items-center space-x-4 max-w-md mx-auto">
                    <button 
                        onClick={() => onFollowToggle(user.id)}
                        className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-full font-bold transition-colors ${isFollowed ? 'bg-gray-600 text-gray-300' : 'bg-gradient-to-r from-pink-500 to-red-500 text-white'}`}
                    >
                        {!isFollowed && <PlusIcon className="w-5 h-5" />}
                        <span>{isFollowed ? 'Seguindo' : 'Siga'}</span>
                    </button>
                     <button className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-full font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                         <MessageSquareIcon className="w-5 h-5"/>
                         <span>Conversa</span>
                    </button>
                 </div>
            </footer>
        </div>
    );
};

const TabButton: React.FC<{label: string; icon: React.ComponentType<any>; active: boolean; onClick: () => void;}> = ({label, icon: Icon, active, onClick}) => {
    return (
        <button onClick={onClick} className={`flex-1 flex justify-center items-center space-x-2 py-3 border-b-2 font-semibold transition-all duration-300 ${active ? 'text-white border-white' : 'text-gray-500 border-transparent hover:text-white'}`}>
            <Icon className="w-5 h-5"/>
            <span>{label}</span>
        </button>
    )
}
