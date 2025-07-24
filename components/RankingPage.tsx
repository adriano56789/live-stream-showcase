
import React, { useState, useEffect } from 'react';
import type { MockUser, Streamer } from '../types';
import { STREAMERS_DATA, CHAT_MOCK_USERS } from '../constants';

// --- Icons ---
const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);
const CrownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm0 0L5 2h14l3 2"></path>
  </svg>
);
const DiamondIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2.7 10.3a2.41 2.41 0 0 0-1.6 4.5l8.9 8.9a2.41 2.41 0 0 0 3.4 0l8.9-8.9a2.41 2.41 0 0 0-1.6-4.5Z"></path><path d="m12 22 4.9-4.9"></path><path d="M10.4 3.6a2.41 2.41 0 0 0-3.4 0L1.1 9.5"></path><path d="M12 22 7.1 17.1"></path><path d="m13.6 3.6a2.41 2.41 0 0 1 3.4 0l5.9 5.9"></path></svg>
);

type CombinedUser = MockUser | Streamer;

const PodiumItem: React.FC<{ user: CombinedUser, rank: number, onClick: () => void }> = ({ user, rank, onClick }) => {
    const isTop1 = rank === 1;
    const rankColor = isTop1 ? 'border-yellow-400' : rank === 2 ? 'border-gray-400' : 'border-yellow-600';
    const podiumOrder = isTop1 ? 'order-2' : rank === 2 ? 'order-1' : 'order-3';
    const positionStyle = isTop1 ? '-translate-y-6' : 'translate-y-0';

    return (
        <button onClick={onClick} className={`flex flex-col items-center ${podiumOrder} ${positionStyle} transition-transform duration-500 text-center focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-lg p-2`}>
            {isTop1 && <CrownIcon className="w-8 h-8 text-yellow-400 mb-2"/>}
            <img src={user.avatarUrl} alt={user.name} className={`w-20 h-20 rounded-full object-cover border-4 ${rankColor}`}/>
            <p className="font-bold text-white mt-2 truncate max-w-[100px]">{user.name}</p>
            <div className="flex items-center text-sm text-yellow-300 font-semibold">
                <DiamondIcon className="w-4 h-4 mr-1"/>
                {Number(user.points).toLocaleString('pt-BR')}
            </div>
        </button>
    );
};

const RankRow: React.FC<{ user: CombinedUser, rank: number, onClick: () => void }> = ({ user, rank, onClick }) => {
    return (
        <button onClick={onClick} className="w-full flex items-center p-3 bg-white/5 rounded-lg mb-2 hover:bg-white/10 transition-colors">
            <div className="w-8 text-center text-lg font-bold text-gray-300">{rank}</div>
            <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full object-cover ml-2" />
            <div className="flex-1 ml-3 overflow-hidden">
                <p className="font-bold text-white text-base truncate">{user.name}</p>
                <div className="flex items-center text-xs text-gray-400">
                    ID: {user.id}
                </div>
            </div>
            <div className="flex items-center text-base text-yellow-300 font-semibold">
                <DiamondIcon className="w-4 h-4 mr-1"/>
                {Number(user.points).toLocaleString('pt-BR')}
            </div>
        </button>
    );
};


interface RankingPageProps {
  onGoBack: () => void;
  onSelectProfile: (user: CombinedUser) => void;
}

export const RankingPage: React.FC<RankingPageProps> = ({ onGoBack, onSelectProfile }) => {
    const [mainTab, setMainTab] = useState<'hourly' | 'users'>('hourly');
    const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'total'>('daily');
    const [rankedUsers, setRankedUsers] = useState<CombinedUser[]>([]);

    useEffect(() => {
        // Combine and shuffle users for variety
        const allUsers = [...STREAMERS_DATA, ...CHAT_MOCK_USERS].sort(() => 0.5 - Math.random());
        
        let pointMultiplier = 1;
        if(timeFilter === 'weekly') pointMultiplier = 10;
        if(timeFilter === 'total') pointMultiplier = 100;

        const simulatedData = allUsers.map(u => ({
            ...u,
            // Simulate different scores for each filter
            points: String(Math.floor(Math.random() * 5000 * pointMultiplier))
        }));

        simulatedData.sort((a, b) => Number(b.points) - Number(a.points));
        setRankedUsers(simulatedData);

    }, [timeFilter, mainTab]);

    const top3 = rankedUsers.slice(0, 3);
    const others = rankedUsers.slice(3, 20); // Limit to top 20 for performance

    const renderUserList = () => (
        <>
            <div className="px-4 mt-4">
                <div className="flex space-x-2 bg-black/20 p-1 rounded-full">
                    <button onClick={() => setTimeFilter('daily')} className={`flex-1 py-2 text-sm font-semibold rounded-full ${timeFilter === 'daily' ? 'bg-white/10 text-white' : 'text-gray-400'}`}>Diário</button>
                    <button onClick={() => setTimeFilter('weekly')} className={`flex-1 py-2 text-sm font-semibold rounded-full ${timeFilter === 'weekly' ? 'bg-white/10 text-white' : 'text-gray-400'}`}>Semanal</button>
                    <button onClick={() => setTimeFilter('total')} className={`flex-1 py-2 text-sm font-semibold rounded-full ${timeFilter === 'total' ? 'bg-white/10 text-white' : 'text-gray-400'}`}>Classificação Total</button>
                </div>
            </div>
            
             {/* Podium */}
            <div className="mt-8 px-4 flex justify-around items-end min-h-[180px]">
                {top3.length >= 2 && <PodiumItem user={top3[1]} rank={2} onClick={() => onSelectProfile(top3[1])} />}
                {top3.length >= 1 && <PodiumItem user={top3[0]} rank={1} onClick={() => onSelectProfile(top3[0])} />}
                {top3.length >= 3 && <PodiumItem user={top3[2]} rank={3} onClick={() => onSelectProfile(top3[2])} />}
            </div>

            {/* List */}
            <div className="mt-8 px-4">
                 {others.map((user, index) => (
                    <RankRow key={user.id} user={user} rank={index + 4} onClick={() => onSelectProfile(user)} />
                ))}
            </div>
        </>
    )

    return (
        <div className="bg-gradient-to-b from-purple-800 via-indigo-900 to-[#121212] text-white min-h-screen flex flex-col font-sans">
             <header className="sticky top-0 z-10 bg-purple-800/50 backdrop-blur-md flex items-center justify-between px-4 h-[65px]">
                <button onClick={onGoBack} className="p-2 text-gray-200 hover:text-white">
                    <ArrowLeftIcon />
                </button>
                <div className="flex items-center space-x-2 bg-black/20 p-1 rounded-full">
                    <button onClick={() => setMainTab('hourly')} className={`px-4 py-1.5 text-sm font-semibold rounded-full ${mainTab === 'hourly' ? 'bg-white text-black' : 'text-gray-300'}`}>Classificação Horária</button>
                    <button onClick={() => setMainTab('users')} className={`px-4 py-1.5 text-sm font-semibold rounded-full ${mainTab === 'users' ? 'bg-white text-black' : 'text-gray-300'}`}>Lista de usuários</button>
                </div>
                <div className="w-10"></div>
            </header>
            <main className="flex-1 overflow-y-auto pb-8">
                {mainTab === 'hourly' ? (
                     <div className="text-center text-gray-400 pt-20">Funcionalidade de ranking horário em breve.</div>
                ) : renderUserList()}
            </main>
        </div>
    )
}
