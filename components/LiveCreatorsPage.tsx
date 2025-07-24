import React, { useState, useMemo } from 'react';
import type { Streamer } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { SearchIcon } from './icons/SearchIcon';
import { CreatorCard } from './CreatorCard';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv: any = motion.div;

// --- Filter Chips ---
const FilterChip: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-colors duration-300 whitespace-nowrap ${
            active
                ? 'bg-pink-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
        }`}
    >
        {label}
    </button>
);

// --- Main Component ---
type FilterType = 'all' | 'live' | 'new' | 'verified' | 'most_followers';

interface LiveCreatorsPageProps {
    creators: Streamer[];
    onGoBack: () => void;
    onSelectStream: (streamer: Streamer) => void;
    onSelectProfile: (streamer: Streamer) => void;
    onFollowToggle: (creatorId: number) => void;
}

export const LiveCreatorsPage: React.FC<LiveCreatorsPageProps> = ({ creators, onGoBack, onSelectStream, onSelectProfile, onFollowToggle }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    const filteredCreators = useMemo(() => {
        let sorted = [...creators];

        // Apply filter
        switch (activeFilter) {
            case 'live':
                sorted = sorted.filter(c => c.isLive);
                break;
            case 'new':
                sorted = sorted.filter(c => c.isNew);
                break;
            case 'verified':
                sorted = sorted.filter(c => c.isVerified);
                break;
            case 'most_followers':
                sorted.sort((a, b) => b.followers - a.followers);
                break;
            default: // 'all'
                 // Default sort might be by viewers or random
                break;
        }

        // Apply search query
        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            return sorted.filter(c =>
                c.name.toLowerCase().includes(lowercasedQuery) ||
                String(c.id).includes(lowercasedQuery)
            );
        }

        return sorted;
    }, [creators, searchQuery, activeFilter]);

    return (
        <div className="bg-[#121212] text-white min-h-screen flex flex-col font-sans">
            <header className="sticky top-0 z-10 bg-[#1C1C1E] flex items-center justify-between px-4 h-[65px] border-b border-gray-800">
                <button onClick={onGoBack} className="p-2 text-gray-300 hover:text-white">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-lg font-bold text-white">
                    Criadores de lives
                </h1>
                <div className="w-10"></div> {/* Placeholder to center title */}
            </header>

            {/* Search and Filter Bar */}
            <div className="sticky top-[65px] z-10 bg-[#121212] p-4 space-y-4">
                 <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"/>
                    <input
                        type="text"
                        placeholder="Pesquisar por nome ou ID"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#1C1C1E] rounded-full py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                </div>
                 <div className="flex space-x-2 overflow-x-auto pb-2 -mb-2">
                    <FilterChip label="Todos" active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
                    <FilterChip label="Ao Vivo" active={activeFilter === 'live'} onClick={() => setActiveFilter('live')} />
                    <FilterChip label="Mais Seguidos" active={activeFilter === 'most_followers'} onClick={() => setActiveFilter('most_followers')} />
                    <FilterChip label="Novatos" active={activeFilter === 'new'} onClick={() => setActiveFilter('new')} />
                    <FilterChip label="Verificados" active={activeFilter === 'verified'} onClick={() => setActiveFilter('verified')} />
                 </div>
            </div>

            <main className="flex-1 overflow-y-auto p-4">
                <MotionDiv layout className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <AnimatePresence>
                        {filteredCreators.map((creator) => (
                            <CreatorCard
                                key={creator.id}
                                creator={creator}
                                onFollowToggle={onFollowToggle}
                                onCardClick={() => {
                                    if (creator.isLive) {
                                        onSelectStream(creator);
                                    } else {
                                        onSelectProfile(creator);
                                    }
                                }}
                            />
                        ))}
                    </AnimatePresence>
                </MotionDiv>
                {filteredCreators.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-lg font-semibold">Nenhum criador encontrado</p>
                        <p className="mt-1">Tente ajustar seus filtros ou busca.</p>
                    </div>
                )}
            </main>
        </div>
    );
};
