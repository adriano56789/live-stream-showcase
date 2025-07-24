
import React from 'react';
import type { Streamer } from '../types';
import { ViewersIcon } from './icons/ViewersIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';


export const StreamCard: React.FC<{ streamer: Streamer, onClick: () => void, className?: string, style?: React.CSSProperties }> = ({ streamer, onClick, className, style }) => {
  function formatViewers(viewers: number) {
    if (viewers >= 1000) {
      return (viewers / 1000).toFixed(1).replace('.', ',') + 'K';
    }
    return viewers;
  }

  return (
    <div 
      onClick={onClick}
      className={`relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 hover:-translate-y-2 ${className || ''}`}
      style={style}
    >
      <img src={streamer.streamImageUrl} alt={streamer.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      
      {/* Bottom Info */}
      <div className="absolute bottom-2 left-3 right-3 text-white flex justify-between items-end">
        {/* Left Info */}
        <div className="flex-1 overflow-hidden pr-2">
            <div className="flex items-center">
                <p className="font-semibold text-sm truncate">{streamer.name}</p>
                {streamer.isVerified && <CheckCircleIcon className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 ml-1" />}
            </div>
            <p className="text-xs text-gray-300 truncate mt-0.5">{streamer.title}</p>
        </div>

        {/* Right Info (Viewers) */}
        <div className="flex-shrink-0 flex items-center space-x-1.5 text-xs font-semibold">
          <ViewersIcon />
          <span>{formatViewers(streamer.viewers)}</span>
        </div>
      </div>
    </div>
  );
};