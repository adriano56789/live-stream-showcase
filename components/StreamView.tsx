import React, { useState, useEffect, useRef } from 'react';
import type { Streamer, ChatMessage, Gift, MockUser } from '../types';
import { INITIAL_MESSAGES, CHAT_MOCK_USERS, GIFTS } from '../constants';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { motion, AnimatePresence } from 'framer-motion';

// --- Icons ---
import { CloseIcon } from './icons/CloseIcon';
import { EyeIcon } from './icons/EyeIcon';
import { LockIcon } from './icons/LockIcon';
import { DiamondIcon } from './icons/DiamondIcon';
import { SendIcon } from './icons/SendIcon';
import { HeartIcon } from './icons/HeartIcon';
import { GiftBoxIcon } from './icons/GiftBoxIcon';

const MotionDiv: any = motion.div;

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);


const FloatingHeartIcon: React.FC<React.SVGProps<SVGSVGElement> & {color: string}> = ({ color, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={color} stroke={color} {...props}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
);


interface StreamViewProps {
    streamer: Streamer;
    liveStreamId: string | null;
    onGoBack: () => void;
    onOpenWallet: () => void;
    userBalance: number;
    onSendGift: (cost: number, recipient: Streamer) => void;
    isCurrentUserStreamer: boolean;
    onFollowToggle: (streamerId: number) => void;
    isFollowed: boolean;
    onToggleLock: (streamerId: number) => void;
    onSelectProfile: (user: Streamer | MockUser) => void;
    mediaStream: MediaStream | null;
}

const GiftConfirmationModal: React.FC<{ gift: Gift, onConfirm: () => void, onCancel: () => void }> = ({ gift, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onCancel}>
        <div className="bg-[#1C1C1E] text-white rounded-2xl w-full max-w-xs p-6 space-y-4 transform transition-all" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-center">Confirmar Presente</h3>
            <div className="flex flex-col items-center">
                <img src={gift.image} alt={gift.name} className="w-20 h-20"/>
                <p className="text-lg font-semibold mt-2">{gift.name}</p>
                <div className="flex items-center text-lg text-yellow-300">
                    <DiamondIcon className="w-5 h-5 mr-1"/>
                    <span>{gift.cost}</span>
                </div>
            </div>
            <div className="flex space-x-4 mt-4">
                 <button onClick={onCancel} className="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 font-semibold">Cancelar</button>
                 <button onClick={onConfirm} className="flex-1 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 font-semibold">Enviar</button>
            </div>
        </div>
    </div>
);

interface GiftPanelProps {
    onSelectGift: (gift: Gift) => void;
    onRecharge: () => void;
    userBalance: number;
}

const GiftPanel: React.FC<GiftPanelProps> = ({ onSelectGift, onRecharge, userBalance }) => (
    <div className="p-4 bg-black/80 backdrop-blur-md border-t border-gray-800/60" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-gray-400 font-semibold">Meu Saldo</span>
            <div className="flex items-center">
                <DiamondIcon className="w-5 h-5 text-yellow-300 mr-1"/>
                <span className="text-white font-bold text-lg">{userBalance.toLocaleString()}</span>
                <button onClick={onRecharge} className="ml-2 w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30">
                    <PlusIcon className="w-4 h-4" strokeWidth={3}/>
                </button>
            </div>
        </div>
        <div className="grid grid-cols-4 gap-4 max-h-[25vh] overflow-y-auto pr-2">
            {GIFTS.map(gift => (
                <button key={gift.id} onClick={() => onSelectGift(gift)} className="flex flex-col items-center space-y-1 text-center bg-white/5 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <img src={gift.image} alt={gift.name} className="w-12 h-12 transform transition-transform hover:scale-110"/>
                    <p className="text-xs text-white truncate w-full">{gift.name}</p>
                    <div className="flex items-center text-xs text-yellow-300">
                        <DiamondIcon className="w-3 h-3 mr-1"/>
                        <span>{gift.cost}</span>
                    </div>
                </button>
            ))}
        </div>
    </div>
);


const ChatMessageItem: React.FC<{ message: ChatMessage, onSelectUser: (user: MockUser) => void }> = ({ message, onSelectUser }) => {
    const user = message.user;

    const renderContent = () => {
        switch (message.type) {
            case 'follow':
                return <span className="text-pink-400">{message.content}</span>;
            case 'gift':
                 return (
                    <span className="text-yellow-300">
                        {message.content}
                        {message.gift && <img src={message.gift.image} alt={message.gift.name} className="w-6 h-6 inline-block ml-1" />}
                    </span>
                );
            case 'system':
                return <span className="text-cyan-400 font-semibold">{message.content}</span>;
            default:
                return <span>{message.content}</span>;
        }
    };
    
    if (!user) {
        return (
             <div className="p-2 text-sm">
                {renderContent()}
            </div>
        )
    }

    return (
        <div className="flex items-start p-2 text-sm space-x-2">
            <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={() => onSelectUser(user)}
            />
            <div className="flex-1">
                <p 
                    className="text-gray-400 font-semibold cursor-pointer"
                    onClick={() => onSelectUser(user)}
                >
                    {user.name}
                </p>
                <p className="text-white break-words">{renderContent()}</p>
            </div>
        </div>
    );
};


export const StreamView: React.FC<StreamViewProps> = ({
    streamer, liveStreamId, onGoBack, onOpenWallet, userBalance, onSendGift,
    isCurrentUserStreamer, onFollowToggle, isFollowed, onToggleLock, onSelectProfile, mediaStream
}) => {
    const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
    const [newMessage, setNewMessage] = useState('');
    const [viewers, setViewers] = useState(streamer.viewers);
    const [hearts, setHearts] = useState<{ id: number, color: string }[]>([]);
    const [activeGift, setActiveGift] = useState<Gift | null>(null);
    const [giftToConfirm, setGiftToConfirm] = useState<Gift | null>(null);
    const [isGiftPanelOpen, setIsGiftPanelOpen] = useState(false);

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Simulate viewers count changing
    useEffect(() => {
        const interval = setInterval(() => {
            setViewers(v => v + Math.floor(Math.random() * 5) - 2);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Simulate new messages
    useEffect(() => {
        const interval = setInterval(() => {
            const randomUser = CHAT_MOCK_USERS[Math.floor(Math.random() * CHAT_MOCK_USERS.length)];
            const newMsg: ChatMessage = {
                id: Date.now(),
                user: randomUser,
                type: 'message',
                content: `Mensagem de teste ${Date.now().toString().slice(-4)}`
            };
            setMessages(prev => [...prev, newMsg]);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Auto-scroll chat
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);
    
     useEffect(() => {
        const video = videoRef.current;
        if (video) {
            if (mediaStream) {
                video.src = '';
                video.srcObject = mediaStream;
            } else {
                if (video.srcObject) {
                    (video.srcObject as MediaStream).getTracks().forEach(track => track.stop());
                }
                video.srcObject = null;
                video.src = streamer.streamVideoUrl;
            }
            video.play().catch(error => {
                if (error.name !== 'AbortError') {
                    console.error("Video play failed:", error)
                }
            });
        }
    }, [mediaStream, streamer.streamVideoUrl]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const myMessage: ChatMessage = {
                id: Date.now(),
                user: { id: 999, name: 'Você', avatarUrl: 'https://picsum.photos/seed/current_user/50/50', isFollowed: false, followers: 0, following: 0, points: '0', streamImageUrl: '' },
                type: 'message',
                content: newMessage.trim()
            };
            setMessages(prev => [...prev, myMessage]);
            setNewMessage('');
        }
    };

    const handleSendLike = () => {
        const colors = ['#FF1493', '#1E90FF', '#32CD32', '#FFD700', '#FF4500'];
        const newHeart = {
            id: Date.now() + Math.random(),
            color: colors[Math.floor(Math.random() * colors.length)]
        };
        setHearts(prev => [...prev, newHeart]);
        setTimeout(() => {
            setHearts(prev => prev.filter(h => h.id !== newHeart.id));
        }, 2000);
    };

    const handleSendGiftInternal = (gift: Gift) => {
        if (userBalance >= gift.cost) {
            onSendGift(gift.cost, streamer);
            const giftMessage: ChatMessage = {
                id: Date.now(),
                user: { id: 999, name: 'Você', avatarUrl: 'https://picsum.photos/seed/current_user/50/50', isFollowed: false, followers: 0, following: 0, points: '0', streamImageUrl: '' },
                type: 'gift',
                content: `enviou um(a) ${gift.name}!`,
                gift: gift
            };
            setMessages(prev => [...prev, giftMessage]);
            setActiveGift(gift);
            setTimeout(() => setActiveGift(null), 4000);
        } else {
            alert('Saldo insuficiente! Clique em Recarregar.');
            onOpenWallet();
        }
    };
    
    const handleConfirmGift = () => {
        if (giftToConfirm) {
            handleSendGiftInternal(giftToConfirm);
            setGiftToConfirm(null);
            setIsGiftPanelOpen(false);
        }
    }

    return (
        <div className="relative w-full h-screen bg-black text-white">
             <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                key={mediaStream ? 'local' : 'remote'}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60"></div>
            
            <div className="absolute inset-0 flex flex-col p-4 pt-6">
                <header className="flex-shrink-0 flex justify-between items-start w-full">
                     <div className="flex items-center bg-black/40 p-1.5 pr-4 rounded-full">
                        <img src={streamer.avatarUrl} alt={streamer.name} className="w-10 h-10 rounded-full object-cover cursor-pointer" onClick={() => onSelectProfile(streamer)} />
                        <div className="ml-2">
                             <div className="flex items-center space-x-1.5 cursor-pointer" onClick={() => onSelectProfile(streamer)}>
                                <p className="font-bold text-sm">{streamer.name}</p>
                                {streamer.isVerified && <CheckCircleIcon className="w-4 h-4 text-blue-400" />}
                            </div>
                            <p className="text-xs text-gray-300">Criador ID: {streamer.id}</p>
                        </div>
                        {!isCurrentUserStreamer && (
                            <button
                                onClick={() => onFollowToggle(streamer.id)}
                                className={`ml-3 px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${
                                    isFollowed
                                        ? 'bg-white/20 text-white'
                                        : 'bg-pink-500 text-white'
                                }`}
                            >
                                {isFollowed ? 'Seguindo' : 'Seguir'}
                            </button>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="bg-black/40 px-3 py-1.5 rounded-full flex items-center space-x-1">
                            <EyeIcon className="w-4 h-4" />
                            <span className="text-sm font-semibold">{viewers.toLocaleString('pt-BR')}</span>
                        </div>
                        {liveStreamId && (
                            <div className="bg-black/40 px-3 py-1.5 rounded-full text-xs font-mono">
                                Live ID: {liveStreamId}
                            </div>
                        )}
                        <button onClick={onGoBack} className="p-2 bg-black/40 rounded-full">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>
                </header>

                <main className="flex-1 flex flex-col justify-end overflow-hidden">
                    <div ref={chatContainerRef} className="max-h-[40vh] overflow-y-auto pr-2 pb-2">
                        {messages.map(msg => (
                           <ChatMessageItem key={msg.id} message={msg} onSelectUser={onSelectProfile} />
                        ))}
                    </div>
                </main>

                {activeGift && (
                    <div key={activeGift.id} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="flex flex-col items-center animate-gift">
                            <img src={activeGift.image} alt={activeGift.name} className="w-48 h-48" />
                            <p className="text-2xl font-bold mt-2" style={{textShadow: '0 0 10px black'}}>Obrigado pelo {activeGift.name}!</p>
                        </div>
                    </div>
                )}
                
                <footer className="flex-shrink-0">
                    <div className="flex items-center space-x-3 mt-2">
                        <form onSubmit={handleSendMessage} className="flex-1">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Diga olá..."
                                className="w-full bg-black/40 placeholder-gray-300 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                        </form>
                        
                        {newMessage.trim() ? (
                            <button
                                onClick={handleSendMessage}
                                className="flex-shrink-0 p-3 bg-pink-500 rounded-full hover:bg-pink-600 transition-colors animate-pulse-and-glow"
                                aria-label="Enviar mensagem"
                            >
                                <SendIcon className="w-6 h-6 text-white" />
                            </button>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <button onClick={onOpenWallet} className="p-3 bg-black/40 rounded-full hover:bg-black/60 transition-colors" aria-label="Abrir carteira">
                                    <DiamondIcon className="w-6 h-6 text-yellow-300" />
                                </button>
                                <button
                                    onClick={() => setIsGiftPanelOpen(p => !p)}
                                    className={`p-3 bg-black/40 rounded-full hover:bg-black/60 transition-colors ${isGiftPanelOpen ? 'bg-pink-500/30' : ''}`}
                                    aria-label="Abrir painel de presentes"
                                >
                                    <GiftBoxIcon className="w-6 h-6 text-pink-400" />
                                </button>
                                <button onClick={handleSendLike} className="p-3 bg-black/40 rounded-full hover:bg-black/60 transition-colors" aria-label="Enviar curtida">
                                    <HeartIcon className="w-6 h-6 text-red-500" />
                                </button>
                            </div>
                        )}
                    </div>
                </footer>
            </div>
            
            <div className="absolute bottom-24 right-4 flex flex-col items-center pointer-events-none">
                {hearts.map(heart => (
                    <FloatingHeartIcon
                        key={heart.id}
                        color={heart.color}
                        className="w-8 h-8 opacity-80 animate-float-up"
                        style={{ position: 'absolute', bottom: 0, right: `${Math.random() * 20 - 10}px` }}
                    />
                ))}
            </div>

            <AnimatePresence>
                {isGiftPanelOpen && (
                    <>
                        <MotionDiv
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setIsGiftPanelOpen(false)}
                            className="absolute inset-0 bg-black/50 z-20"
                        />
                        <MotionDiv
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", stiffness: 400, damping: 40 }}
                            className="absolute bottom-0 left-0 right-0 z-30"
                            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                        >
                            <GiftPanel onSelectGift={setGiftToConfirm} onRecharge={onOpenWallet} userBalance={userBalance} />
                        </MotionDiv>
                    </>
                )}
            </AnimatePresence>
            
            {giftToConfirm && (
                <GiftConfirmationModal 
                    gift={giftToConfirm}
                    onConfirm={handleConfirmGift}
                    onCancel={() => setGiftToConfirm(null)}
                />
            )}
        </div>
    );
};