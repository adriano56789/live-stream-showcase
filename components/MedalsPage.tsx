
import React from 'react';
import type { Medal } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { VideoIcon } from './icons/VideoIcon';
import { GiftIcon } from './icons/GiftIcon';
import { UsersIcon } from './icons/UsersIcon';
import { CrownIcon } from './icons/CrownIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);


const iconMap: { [key: string]: React.ComponentType<any> } = {
    VideoIcon,
    GiftIcon,
    UsersIcon,
    CrownIcon,
    ClockIcon,
    ShieldCheckIcon
};

interface MedalsPageProps {
  onGoBack: () => void;
  medals: Medal[];
}

const MedalCard: React.FC<{ medal: Medal; className?: string; style?: React.CSSProperties; }> = ({ medal, className, style }) => {
    const IconComponent = iconMap[medal.icon];
    const cardClasses = medal.achieved 
        ? "bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/50"
        : "bg-gray-800/50 border-gray-700 opacity-60";
    const iconClasses = medal.achieved ? "text-yellow-400" : "text-gray-500";
    
    return (
        <div className={`relative rounded-2xl p-4 flex flex-col items-center justify-center text-center border ${cardClasses} transition-all duration-300 ${className || ''}`} style={style}>
            {medal.isNew && (
                <div className="absolute top-2 right-2 bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                    NOVA
                </div>
            )}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 bg-black/20 ${!medal.achieved && 'grayscale'}`}>
                {IconComponent && <IconComponent className={`w-8 h-8 ${iconClasses}`} />}
            </div>
            <h3 className={`font-bold ${medal.achieved ? 'text-white' : 'text-gray-400'}`}>{medal.name}</h3>
            <p className="text-xs text-gray-400 mt-1">{medal.description}</p>
            {medal.achieved && medal.achievedDate && (
                 <p className="text-xs text-yellow-400/60 mt-2 font-semibold">{medal.achievedDate}</p>
            )}
        </div>
    );
};


export const MedalsPage: React.FC<MedalsPageProps> = ({ onGoBack, medals }) => {
  return (
    <div className="bg-[#121212] text-white min-h-screen flex flex-col font-sans">
      <header className="sticky top-0 z-10 bg-[#1C1C1E] flex items-center justify-between px-4 h-[65px] border-b border-gray-800">
        <button onClick={onGoBack} className="p-2 text-gray-300 hover:text-white">
          <ArrowLeftIcon />
        </button>
        <h1 className="text-lg font-bold text-white">
          Minhas Medalhas
        </h1>
        <div className="w-10"></div>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {medals.map((medal, index) => (
                <MedalCard 
                    key={medal.id} 
                    medal={medal}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                />
            ))}
        </div>
      </main>
    </div>
  );
};