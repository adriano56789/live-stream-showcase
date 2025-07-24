import React, { useState } from 'react';
import type { MockUser } from '../types';

// --- SVG Icons ---
import { CloseIcon } from './icons/CloseIcon';
import { MuteIcon } from './icons/MuteIcon';
import { KickIcon } from './icons/KickIcon';


interface UserProfileModalProps {
    user: MockUser;
    onClose: () => void;
    isCurrentUserStreamer: boolean;
    streamerId: number;
    onMute: (userId: number) => void;
    onKick: (userId: number) => void;
    onViewProfile: (user: MockUser) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose, isCurrentUserStreamer, streamerId, onMute, onKick, onViewProfile }) => {
    const [isFollowed, setIsFollowed] = useState(user.isFollowed);

    const handleFollowClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFollowed(!isFollowed);
        // In a real app, this would trigger an API call.
    };
    
    // The streamer cannot moderate themself.
    const canModerate = isCurrentUserStreamer && user.id !== streamerId;

    const handleViewProfile = () => {
        onViewProfile(user);
        onClose(); // Close the modal after navigating
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#1C1C1E] text-white rounded-2xl w-full max-w-sm p-6 space-y-4 transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="flex justify-end -mb-8 -mr-2">
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white">
                        <CloseIcon className="w-5 h-5"/>
                    </button>
                </div>
                <button onClick={handleViewProfile} className="flex flex-col items-center text-center w-full focus:outline-none group">
                    <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full object-cover border-4 border-pink-500 group-hover:border-pink-400 transition-colors" />
                    <h3 className="text-2xl font-bold mt-4 group-hover:text-pink-400 transition-colors">{user.name}</h3>
                    <p className="text-gray-400 text-sm">ID: {user.id}</p>
                </button>

                {canModerate ? (
                    <div className="flex items-center space-x-3 pt-2">
                        <button
                            onClick={handleFollowClick}
                            className={`flex-1 py-3 rounded-full font-semibold transition-colors text-base ${isFollowed ? 'bg-gray-700 text-gray-300' : 'bg-pink-500 text-white hover:bg-pink-600'}`}
                        >
                            {isFollowed ? 'Seguindo' : 'Seguir'}
                        </button>
                        <button onClick={() => onMute(user.id)} title="Silenciar usuário" className="p-3 bg-gray-700 rounded-full text-yellow-400 hover:bg-gray-600 transition-colors">
                            <MuteIcon className="w-6 h-6"/>
                        </button>
                         <button onClick={() => onKick(user.id)} title="Remover usuário" className="p-3 bg-gray-700 rounded-full text-red-500 hover:bg-gray-600 transition-colors">
                            <KickIcon className="w-6 h-6"/>
                        </button>
                    </div>
                ) : (
                    <div className="pt-2">
                        <button
                            onClick={handleFollowClick}
                            className={`w-full py-3 rounded-full font-semibold transition-colors text-base ${isFollowed ? 'bg-gray-700 text-gray-300' : 'bg-pink-500 text-white hover:bg-pink-600'}`}
                        >
                            {isFollowed ? 'Seguindo' : 'Seguir'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
