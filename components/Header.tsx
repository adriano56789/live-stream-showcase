
import React from 'react';
import { SearchIcon } from './icons/SearchIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';

interface HeaderProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    isSearchActive: boolean;
    onSearchToggle: (isActive: boolean) => void;
    onGoToRanking: () => void;
}

const TabItem: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
    <button onClick={onClick} className="relative py-4 px-2 md:px-4">
        <span className={`text-lg font-semibold transition-colors duration-300 ${active ? 'text-white' : 'text-gray-500 hover:text-white'}`}>
            {label}
        </span>
        {active && <div className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500 rounded-full"></div>}
    </button>
);

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, searchQuery, onSearchChange, isSearchActive, onSearchToggle, onGoToRanking }) => {
  if (isSearchActive) {
    return (
        <header className="sticky top-0 z-30 bg-[#121212] flex items-center justify-between px-4 h-[65px] border-b border-gray-800">
            <button onClick={() => onSearchToggle(false)} className="p-2 text-gray-300 hover:text-white">
                <ArrowLeftIcon />
            </button>
            <input
                type="text"
                placeholder="Pesquisar"
                className="w-full bg-transparent text-gray-200 placeholder-gray-400 mx-4 focus:outline-none text-lg"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
            />
        </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 bg-[#121212] flex items-center justify-between px-4 h-[65px] border-b border-gray-800">
        <div className="flex items-center space-x-2 md:space-x-4">
            <TabItem label="Seguindo" active={activeTab === 'Seguindo'} onClick={() => onTabChange('Seguindo')} />
            <TabItem label="Para si" active={activeTab === 'Para si'} onClick={() => onTabChange('Para si')} />
        </div>
        <div className="flex items-center space-x-2">
            <button onClick={onGoToRanking} className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full text-sm font-semibold text-white hover:bg-white/20 transition-colors">
               <TrendingUpIcon className="w-4 h-4"/>
               <span>Ranking</span>
           </button>
            <button onClick={() => onSearchToggle(true)} className="p-2 text-gray-300 hover:text-white transition-colors">
                <SearchIcon className="w-6 h-6"/>
            </button>
        </div>
    </header>
  );
};
