import React from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { CompassIcon } from './icons/CompassIcon';
import { PlusIcon } from './icons/PlusIcon';
import { MessageSquareIcon } from './icons/MessageSquareIcon';
import { UserIcon } from './icons/UserIcon';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, onClick, active }) => (
  <button onClick={onClick} className={`flex-1 flex flex-col items-center justify-center space-y-1 py-2 transition-colors duration-200 ${active ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </button>
);

const CenterButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="w-16 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center -mt-4 shadow-lg shadow-pink-500/40">
        <PlusIcon className="w-8 h-8 text-white" />
    </button>
);

interface SidebarProps {
    currentView: string;
    onGoHome: () => void;
    onOpenCreateModal: () => void;
    onGoToMessages: () => void;
    onGoToProfile: () => void;
    onGoToExplore: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onGoHome, onOpenCreateModal, onGoToMessages, onGoToProfile, onGoToExplore }) => {
    return (
        <aside className="fixed bottom-0 left-0 w-full bg-[#1C1C1E] z-40 border-t border-t-gray-800">
            <nav className="flex flex-row justify-around items-center h-16 w-full max-w-md mx-auto px-2">
                <NavItem 
                    icon={<HomeIcon className="w-6 h-6"/>} 
                    label="Início"
                    onClick={onGoHome}
                    active={currentView === 'showcase'}
                />
                <NavItem 
                    icon={<CompassIcon className="w-6 h-6"/>} 
                    label="Explorar"
                    onClick={onGoToExplore}
                    active={currentView === 'explore'}
                />
                <CenterButton onClick={onOpenCreateModal} />
                <NavItem 
                    icon={<MessageSquareIcon className="w-6 h-6"/>}
                    label="Mensagens"
                    onClick={onGoToMessages}
                    active={currentView === 'messages' || currentView === 'chat'}
                />
                <NavItem 
                    icon={<UserIcon className="w-6 h-6"/>}
                    label="Perfil"
                    onClick={onGoToProfile}
                    active={currentView === 'profile'}
                />
            </nav>
        </aside>
    );
};