import React from 'react';
import type { ContentPost } from '../types';
import { PlayIcon } from './icons/PlayIcon';
import { ImageIcon } from './icons/ImageIcon';

interface ContentGridProps {
    posts: ContentPost[];
    onSelectPost: (post: ContentPost, allPosts: ContentPost[]) => void;
}

const formatCount = (count: number) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
};

export const ContentGrid: React.FC<ContentGridProps> = ({ posts, onSelectPost }) => {
    if (posts.length === 0) {
        return (
            <div className="text-center py-16 text-gray-500">
                <p className="font-semibold">Nenhuma publicação</p>
                <p className="text-sm mt-1">As publicações deste usuário aparecerão aqui.</p>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-3 gap-1 p-1">
            {posts.map((post) => (
                <button
                    key={post.id}
                    onClick={() => onSelectPost(post, posts)}
                    className="relative aspect-[3/4] bg-gray-800 rounded-md overflow-hidden group"
                >
                    {post.type === 'video' ? (
                        <video
                            src={post.videoUrl}
                            className="w-full h-full object-cover"
                            preload="metadata"
                            muted
                        />
                    ) : (
                        <img
                            src={post.imageUrl}
                            alt={post.description}
                            className="w-full h-full object-cover"
                        />
                    )}

                    <div className="absolute inset-0 bg-black/20 transition-opacity opacity-0 group-hover:opacity-100" />
                    
                    {/* Like Count */}
                    <div className="absolute bottom-1 left-1 flex items-center space-x-1 text-white text-xs font-bold" style={{textShadow: '0 1px 2px rgba(0,0,0,0.8)'}}>
                        <PlayIcon className="w-3 h-3 fill-white" />
                        <span>{formatCount(post.likes)}</span>
                    </div>

                    {/* Content Type Icon */}
                    <div className="absolute top-1.5 right-1.5 text-white" style={{filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.7))'}}>
                       {post.type === 'video' ? <PlayIcon className="w-4 h-4 fill-white opacity-90"/> : <ImageIcon className="w-4 h-4 opacity-90"/>}
                    </div>
                </button>
            ))}
        </div>
    );
};