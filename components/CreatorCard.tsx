import React from 'react';
import type { Streamer } from '../types';
import { UsersIcon } from './icons/UsersIcon';
import { PlusIcon } from './icons/PlusIcon';
import { CheckIcon } from './icons/CheckIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { motion } from 'framer-motion';

const MotionDiv: any = motion.div;

interface CreatorCardProps {
    creator: Streamer;
    onCardClick: () => void;
    onFollowToggle: (creatorId: number) => void;
}

function formatFollowers(count: number): string {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return String(count);
}

export const CreatorCard: React.FC<CreatorCardProps> = ({ creator, onCardClick, onFollowToggle }) => {
    
    const handleFollowClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFollowToggle(creator.id);
    };

    return (
        <MotionDiv
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            whileHover={{ y: -6, scale: 1.05 }}
            onClick={onCardClick}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer bg-[#1C1C1E]"
        >
            <img src={creator.streamImageUrl} alt={creator.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Live Status Badge */}
            <div className="absolute top-3 left-3">
                {creator.isLive ? (
                    <div className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg flex items-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse" />
                        AO VIVO
                    </div>
                ) : (
                     <div className="bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-md backdrop-blur-sm">
                        Última live: {creator.lastLive}
                    </div>
                )}
            </div>
            
            {/* Main Info */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-center space-x-2">
                    <img src={creator.avatarUrl} alt={creator.name} className="w-10 h-10 rounded-full object-cover border-2 border-white/50" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                            <p className="font-bold text-white truncate">{creator.name}</p>
                            {creator.isVerified && <CheckCircleIcon className="w-4 h-4 ml-1 text-sky-400 flex-shrink-0" />}
                        </div>
                        <div className="flex items-center text-xs text-gray-300">
                            <UsersIcon className="w-3 h-3 mr-1" />
                            <span>{formatFollowers(creator.followers)} seguidores</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleFollowClick}
                    className={`w-full mt-3 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center space-x-1 ${
                        creator.followedByCurrentUser
                            ? 'bg-white/20 text-white hover:bg-white/30'
                            : 'bg-pink-500 text-white hover:bg-pink-600'
                    }`}
                >
                    {creator.followedByCurrentUser ? <CheckIcon className="w-4 h-4"/> : <PlusIcon strokeWidth={3} className="w-4 h-4" />}
                    <span>{creator.followedByCurrentUser ? 'Seguindo' : 'Seguir'}</span>
                </button>
            </div>
        </MotionDiv>
    );
};
