import React, { useState } from 'react';
import type { CurrentUser, ContentPost } from '../types';

import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { QrCodeIcon } from './icons/QrCodeIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { ShieldIcon } from './icons/ShieldIcon';
import { WalletIcon } from './icons/WalletIcon';
import { VideoIcon } from './icons/VideoIcon';
import { MedalIcon } from './icons/MedalIcon';
import { UserXIcon } from './icons/UserXIcon';
import { LockIcon } from './icons/LockIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { CopyIcon } from './icons/CopyIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { GridIcon } from './icons/GridIcon';
import { ContentGrid } from './VideoGrid';


interface ProfilePageProps {
  user: CurrentUser;
  onGoBack: () => void;
  onGoToEditProfile: () => void;
  onOpenWallet: () => void;
  onGoToMySocial: (tab: 'fans' | 'following') => void;
  onGoToBlockedList: () => void;
  onGoToPrivateInviteSettings: () => void;
  onOpenVerificationModal: () => void;
  onGoToMyLives: () => void;
  onGoToMedals: () => void;
  userPosts: ContentPost[];
  onSelectPost: (post: ContentPost, allPosts: ContentPost[]) => void;
}

function formatStat(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.', ',') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace('.', ',') + 'K';
    return String(num);
}


const ProfileStat: React.FC<{ value: string; label: string; onClick?: () => void }> = ({ value, label, onClick }) => (
    <button onClick={onClick} disabled={!onClick} className="text-center disabled:cursor-default transition-transform transform hover:scale-105">
        <p className="text-xl font-bold text-white">{value}</p>
        <p className="text-sm text-gray-400">{label}</p>
    </button>
);

const ListItem: React.FC<{ icon: React.ReactNode; label: string; hasDot?: boolean; onClick: () => void; disabled?: boolean; }> = ({ icon, label, hasDot, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled} className="flex items-center w-full p-4 hover:bg-white/5 transition-colors rounded-lg disabled:cursor-not-allowed disabled:opacity-60">
        <div className="w-6 h-6 mr-4 text-gray-300">{icon}</div>
        <span className="flex-grow text-left font-semibold text-gray-100">{label}</span>
        {hasDot && <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>}
        {!disabled && <ChevronRightIcon className="w-5 h-5 text-gray-500" />}
        {disabled && <span className="text-sm text-gray-500">Pendente</span>}
    </button>
);


export const ProfilePage: React.FC<ProfilePageProps> = ({ 
    user, onGoBack, onGoToEditProfile, onOpenWallet, onGoToMySocial, 
    onGoToBlockedList, onGoToPrivateInviteSettings, onOpenVerificationModal, 
    onGoToMyLives, onGoToMedals, userPosts, onSelectPost 
}) => {
    const [activeTab, setActiveTab] = useState<'videos' | 'settings'>('videos');
    const BRAZIL_FLAG_URL = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIQSURBVEhLzZbNaxNRGMZndxMlBVEpCgqi4kURLoJiF3ZtrQqpiJvdKFWHChUungp8FP0FBAURf2BxcVEhCq5dC4qIILoXUbQhSQ+dJJMhSVL3hSGHmcyb733vzZv33t4MhBAgP2iKIdrXotT4+Hh2d3d3tVrtR1I/pDHd3d0f1Go1Ho9XjUYjSUnvD3JyjkeNxuPxSvwz+b2/v++tVusTRhI5Pq/0er12dnZ2dDqd9GqYycnJ2dHR0Qs0Lw0A/p5QKBh4enr6x8fH3dXVVb6+vtI0TZOklARw8vLyO4/HIxKJcMHA9PREb29vtbW1VXR0tIeHh1tCQxEA3w+uL1++LpfLRaFQUFZW9sLCwoyNjU1NTY2cnp4+MjJydnNzk5KkX15e/lGr1dD518PjLp/L5fJ4PAuFQjQaTU1NTcvisk6nM1S8Z3h4+CgSiaSmpqays7OVlZWVubm5WlpaWllZ2d/f33Z2dh4bGysoKODz+SSpQ3BwcBcEAcBw/q+/v/+j3t7e1tZWBwcHo6OjvV6vV6vV1e/300mJkZ+fX7S0tDwxMUEI+fX1lQih1WrFm5ubvV4vtVotjSxcLpfruVzusbExlUol+fn5Ghoa+urqKhqNRiwWwzAM3t/fT3x8PAAODQ0tLS0tLSwsDAwMhIREGGOEEDo6Ooo45xKJRCwWi+28vb09Pj7+12Ty+XyMMecc8z/AB4A/9C7Lz92N2QAAAABJRU5ErkJggg==`;

    const handleCopyId = () => {
        navigator.clipboard.writeText(String(user.id));
        alert("ID copiado!");
    }
    
    const hasNewMedal = user.medals?.some(m => m.isNew);
    
    return (
        <div className="min-h-screen font-sans bg-[#121212]">
            {/* Banner Image */}
            <div className="absolute top-0 left-0 right-0 h-[220px]">
                 <img src={user.bannerUrl} alt="User Banner" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/70 to-transparent" />
            </div>
            
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between p-4 text-white">
                <button onClick={onGoBack} className="p-2 rounded-full bg-black/30 hover:bg-black/40 transition-colors">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center space-x-2">
                     <button onClick={() => alert('QR Code Clicked')} className="p-2 rounded-full bg-black/30 hover:bg-black/40 transition-colors">
                        <QrCodeIcon className="w-6 h-6" />
                    </button>
                     <button onClick={onGoToEditProfile} className="p-2 rounded-full bg-black/30 hover:bg-black/40 transition-colors">
                        <SettingsIcon className="w-6 h-6" />
                    </button>
                </div>
            </header>

            <main className="relative z-10 p-4 pt-32 pb-24">
                {/* Profile Info */}
                <section className="flex items-end space-x-4">
                    <div className="relative flex-shrink-0 -mt-16">
                        <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-[#121212] shadow-lg" />
                        <img src={BRAZIL_FLAG_URL} alt="Brazil Flag" className="absolute bottom-0 -right-2 w-7 h-7 rounded-full border-2 border-[#121212]"/>
                    </div>
                    <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2">
                           <h1 className="text-2xl font-bold text-white truncate">{user.name}</h1>
                           {user.isVerified && <CheckCircleIcon className="w-6 h-6 text-blue-500 flex-shrink-0" />}
                        </div>
                        <div className="flex items-center text-sm text-gray-400 font-medium">
                           <span>ID: {user.id}</span>
                           <button onClick={handleCopyId} className="ml-2 p-1 text-gray-500 hover:text-white">
                               <CopyIcon className="w-4 h-4"/>
                           </button>
                        </div>
                    </div>
                </section>
                
                <section className="mt-2">
                    <p className="text-gray-300">{user.bio}</p>
                </section>

                {/* Stats */}
                <section className="mt-6 flex justify-around items-center bg-[#1C1C1E] p-4 rounded-xl shadow-lg">
                    <ProfileStat value={formatStat(user.following)} label="Seguindo" onClick={() => onGoToMySocial('following')} />
                    <div className="h-8 w-px bg-gray-700" />
                    <ProfileStat value={formatStat(user.followers)} label="Fãs" onClick={() => onGoToMySocial('fans')} />
                    <div className="h-8 w-px bg-gray-700" />
                    <ProfileStat value={formatStat(user.likes)} label="Gostar" />
                     <div className="h-8 w-px bg-gray-700" />
                    <ProfileStat value={formatStat(user.visitors)} label="Visitantes" />
                </section>
                
                {/* Tabs */}
                <section className="mt-6">
                    <div className="flex items-center justify-center border-b border-gray-800">
                        <TabButton label="Publicações" icon={GridIcon} active={activeTab === 'videos'} onClick={() => setActiveTab('videos')} />
                        <TabButton label="Configurações" icon={SettingsIcon} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                    </div>
                </section>

                {activeTab === 'videos' && (
                    <ContentGrid posts={userPosts} onSelectPost={onSelectPost} />
                )}

                {activeTab === 'settings' && (
                    <div className="mt-6 space-y-4">
                         {/* Wallet Action */}
                        <section className="bg-[#1C1C1E] p-4 rounded-xl shadow-lg">
                            <button onClick={onOpenWallet} className="flex items-center w-full text-left group">
                                <WalletIcon className="w-10 h-10 text-orange-500" />
                                <div className="ml-4 flex-1">
                                     <h3 className="font-bold text-lg text-white group-hover:text-orange-400 transition-colors">Carteira</h3>
                                     <p className="text-sm text-gray-400">Ver saldo e histórico de saques</p>
                                </div>
                                <ChevronRightIcon className="w-6 h-6 text-gray-500" />
                            </button>
                        </section>
                        
                        {/* Links List */}
                        <section className="bg-[#1C1C1E] p-2 rounded-xl shadow-lg">
                            <div className="divide-y divide-gray-800">
                                <ListItem icon={<VideoIcon className="text-red-500" />} label="Meus vivos" onClick={onGoToMyLives} />
                                <ListItem icon={<MedalIcon className="text-yellow-500"/>} label="Medalha" hasDot={hasNewMedal} onClick={onGoToMedals} />
                                <ListItem icon={<ShieldIcon className="text-blue-500"/>} label="Segurança da Conta" onClick={onGoToEditProfile} />
                                {!user.isVerified && user.verificationStatus !== 'pending' && (
                                    <ListItem icon={<ShieldCheckIcon className="text-green-500" />} label="Solicitar Selo de Verificação" onClick={onOpenVerificationModal} />
                                )}
                                {user.verificationStatus === 'pending' && (
                                    <ListItem icon={<ShieldIcon className="text-gray-500" />} label="Verificação Pendente" onClick={() => {}} disabled={true} />
                                )}
                                <ListItem icon={<UserXIcon className="text-gray-500"/>} label="Lista de bloqueio" onClick={onGoToBlockedList} />
                                <ListItem icon={<LockIcon className="text-purple-500"/>} label="Convite privado ao vivo" onClick={onGoToPrivateInviteSettings} />
                            </div>
                        </section>
                    </div>
                )}

            </main>
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