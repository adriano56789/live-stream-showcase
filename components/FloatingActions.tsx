
import React from 'react';
import { VideoIcon } from './icons/VideoIcon';

interface FloatingActionsProps {
  onGoLiveClick: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({ onGoLiveClick }) => {
  return (
    <div className="hidden md:flex fixed bottom-8 right-8 flex-col items-center z-40">
      <button 
        onClick={onGoLiveClick}
        className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/40 hover:scale-105 transform transition-transform duration-300"
        aria-label="Go Live"
      >
        <VideoIcon className="w-8 h-8 text-white" />
      </button>
    </div>
  );
};
