
import React, { useRef, useEffect, useState } from 'react';
import type { VideoPost, MockUser, Streamer, ContentPost } from '../types';
import { MOCK_COMMENTS } from '../constants';
import { HeartIcon } from './icons/HeartIcon';
import { CommentBubbleIcon } from './icons/CommentBubbleIcon';
import { ShareIcon } from './icons/ShareIcon';
import { MusicNoteIcon } from './icons/MusicNoteIcon';
import { PlusIcon } from './icons/PlusIcon';
import { CommentsPanel } from './CommentsPanel';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface ExplorePageProps {
    initialPlaylist: VideoPost[];
    initialIndex: number;
    onGoBack: () => void;
    onSelectProfile: (user: Streamer | MockUser) => void;
    onFollowToggle: (userId: number) => void;
}

const formatCount = (count: number) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
};

const VideoPostSingle: React.FC<{
    post: VideoPost;
    isIntersecting: boolean;
    onSelectProfile: (user: Streamer | MockUser) => void;
    onFollowToggle: (userId: number) => void;
}> = ({ post, isIntersecting, onSelectProfile, onFollowToggle }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    
    useEffect(() => {
        const video = videoRef.current;
        // The only effect needed is to explicitly pause and reset the video
        // when it scrolls out of view. `autoPlay` handles starting it.
        if (video && !isIntersecting) {
            video.pause();
            video.currentTime = 0;
        }
    }, [isIntersecting]);
    
    const handleFollowClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFollowToggle(post.user.id);
    };

    const handleShare = async () => {
        const shareData = {
            title: `Confira este vídeo de ${post.user.name}!`,
            text: post.description,
            // In a real app, this would be a direct link to the post
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(shareData.url).then(() => {
                alert('Link copiado para a área de transferência!');
            }).catch(err => {
                console.error('Failed to copy link: ', err);
                alert('Não foi possível copiar o link.');
            });
        }
    };

    return (
        <section className="relative h-full w-full bg-black snap-start">
            <video
                ref={videoRef}
                src={post.videoUrl}
                loop
                muted
                playsInline
                // Declaratively control autoplay based on visibility.
                // This is safer as the browser will only attempt to play when ready.
                autoPlay={isIntersecting}
                className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 flex flex-col justify-between p-4 text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                {/* Header/Empty Top Space */}
                <div></div>

                {/* Bottom UI */}
                <div className="flex items-end">
                    {/* Left Info Panel */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                             <button onClick={() => onSelectProfile(post.user)} className="font-bold text-lg">@{post.user.name}</button>
                             {post.user.isVerified && <CheckCircleIcon className="w-5 h-5 text-blue-400 flex-shrink-0" />}
                        </div>
                        <p className="mt-1 text-sm">{post.description}</p>
                        <div className="flex items-center mt-2 text-sm">
                            <MusicNoteIcon className="w-4 h-4 mr-2" />
                            <span>{post.song}</span>
                        </div>
                    </div>

                    {/* Right Actions Panel */}
                    <div className="flex flex-col items-center space-y-5">
                        <button onClick={() => onSelectProfile(post.user)} className="relative">
                            <img src={post.user.avatarUrl} alt={post.user.name} className="w-12 h-12 rounded-full object-cover border-2 border-white"/>
                             {!post.user.followedByCurrentUser && (
                                <div
                                    onClick={handleFollowClick}
                                    className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center border-2 border-black"
                                >
                                    <PlusIcon strokeWidth={3} className="w-3 h-3 text-white" />
                                </div>
                            )}
                        </button>
                        
                        <button onClick={() => setIsLiked(!isLiked)} className="flex flex-col items-center">
                            <HeartIcon className={`w-9 h-9 transition-colors ${isLiked ? 'text-pink-500 fill-current' : 'text-white'}`} />
                            <span className="text-sm font-semibold">{formatCount(post.likes + (isLiked ? 1 : 0))}</span>
                        </button>

                        <button onClick={() => setIsCommentsOpen(true)} className="flex flex-col items-center">
                            <CommentBubbleIcon className="w-9 h-9" />
                            <span className="text-sm font-semibold">{formatCount(post.comments)}</span>
                        </button>
                        
                        <button onClick={handleShare} className="flex flex-col items-center">
                            <ShareIcon className="w-9 h-9" />
                            <span className="text-sm font-semibold">{formatCount(post.shares)}</span>
                        </button>

                        <div className="w-12 h-12 bg-black/40 rounded-full border-2 border-gray-600 animate-spin-slow">
                            <img src={post.user.avatarUrl} alt="" className="w-full h-full rounded-full object-cover p-1.5"/>
                        </div>
                    </div>
                </div>
            </div>
            
             <CommentsPanel
                isOpen={isCommentsOpen}
                onClose={() => setIsCommentsOpen(false)}
                comments={MOCK_COMMENTS}
                commentCount={post.comments}
            />
        </section>
    );
};


export const ExplorePage: React.FC<ExplorePageProps> = ({ initialPlaylist, initialIndex, onGoBack, onSelectProfile, onFollowToggle }) => {
    const [visibleVideoId, setVisibleVideoId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const postRefs = useRef<{ [key: string]: HTMLElement }>({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setVisibleVideoId(entry.target.getAttribute('data-videoid'));
                    }
                });
            },
            { threshold: 0.5 } // 50% of the video must be visible
        );

        const currentRefs = postRefs.current;
        Object.values(currentRefs).forEach(ref => {
            if (ref) observer.observe(ref);
        });

        // Scroll to initial video
        if (initialPlaylist[initialIndex]) {
            const initialVideoId = initialPlaylist[initialIndex].id;
            const element = currentRefs[initialVideoId];
            if (element) {
                element.scrollIntoView();
                setVisibleVideoId(initialVideoId);
            }
        }

        return () => {
            Object.values(currentRefs).forEach(ref => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [initialPlaylist, initialIndex]);

    return (
        <div ref={containerRef} className="h-screen w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory bg-black">
            <button
                onClick={onGoBack}
                className="absolute top-6 left-4 z-20 p-2 bg-black/40 rounded-full text-white hover:bg-black/60 transition-colors backdrop-blur-sm"
                aria-label="Voltar"
            >
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            {initialPlaylist.map((post) => (
                <div
                    key={post.id}
                    ref={el => { if(el) postRefs.current[post.id] = el }}
                    data-videoid={post.id}
                    className="h-full w-full"
                >
                    <VideoPostSingle
                        post={post}
                        isIntersecting={visibleVideoId === post.id}
                        onSelectProfile={onSelectProfile}
                        onFollowToggle={onFollowToggle}
                    />
                </div>
            ))}
        </div>
    );
};
