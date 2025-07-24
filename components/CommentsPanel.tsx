import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VideoComment, MockUser } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { HeartIcon } from './icons/HeartIcon';
import { SendIcon } from './icons/SendIcon';

const MotionDiv: any = motion.div;

interface CommentsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    comments: VideoComment[];
    commentCount: number;
}

const CommentRow: React.FC<{ comment: VideoComment }> = ({ comment }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(comment.likes);

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    return (
        <div className="flex items-start space-x-3 py-3">
            <img src={comment.user.avatarUrl} alt={comment.user.name} className="w-9 h-9 rounded-full object-cover"/>
            <div className="flex-1">
                <p className="text-xs text-gray-400">{comment.user.name}</p>
                <p className="text-sm text-white break-words">{comment.text}</p>
                <p className="text-xs text-gray-500 mt-1">{comment.timestamp}</p>
            </div>
            <button onClick={handleLike} className="flex flex-col items-center space-y-0.5 text-gray-400">
                <HeartIcon className={`w-5 h-5 transition-colors ${isLiked ? 'text-pink-500 fill-current' : ''}`}/>
                <span className="text-xs">{likeCount > 0 ? likeCount : ''}</span>
            </button>
        </div>
    );
};

export const CommentsPanel: React.FC<CommentsPanelProps> = ({ isOpen, onClose, comments, commentCount }) => {
    const [myComment, setMyComment] = useState('');

    const handleSendComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (myComment.trim()) {
            console.log("Sending comment:", myComment);
            // Here you would add the comment to the list and send to a server
            alert("Comentário enviado (simulação)!");
            setMyComment('');
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <MotionDiv
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", stiffness: 400, damping: 40 }}
                    className="absolute bottom-0 left-0 right-0 h-[55vh] bg-[#181818] rounded-t-2xl flex flex-col z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
                    onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                >
                    <header className="flex-shrink-0 p-4 border-b border-gray-700 flex items-center justify-center relative">
                        <h3 className="font-bold text-base text-white">{commentCount.toLocaleString('pt-BR')} comentários</h3>
                        <button onClick={onClose} className="absolute right-4 p-1 text-gray-400 hover:text-white">
                            <CloseIcon className="w-5 h-5"/>
                        </button>
                    </header>

                    <main className="flex-1 overflow-y-auto px-4">
                        {comments.map(comment => (
                            <CommentRow key={comment.id} comment={comment} />
                        ))}
                    </main>

                    <footer className="flex-shrink-0 p-4 bg-[#202020]">
                        <form onSubmit={handleSendComment} className="flex items-center space-x-3">
                            <img src="https://picsum.photos/seed/current_user/50/50" alt="Sua foto" className="w-9 h-9 rounded-full"/>
                            <input
                                type="text"
                                value={myComment}
                                onChange={e => setMyComment(e.target.value)}
                                placeholder="Adicionar comentário..."
                                className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                            <button type="submit" className="p-2 text-white disabled:text-gray-600" disabled={!myComment.trim()}>
                                <SendIcon className="w-6 h-6"/>
                            </button>
                        </form>
                    </footer>
                </MotionDiv>
            )}
        </AnimatePresence>
    );
};
