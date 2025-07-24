

import React, { useState, useEffect, useRef } from 'react';
import type { MockUser, ChatMessage } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { VideoCameraIcon } from './icons/VideoCameraIcon';
import { PaperclipIcon } from './icons/PaperclipIcon';
import { SmileIcon } from './icons/SmileIcon';
import { SendIcon } from './icons/SendIcon';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatPageProps {
  user: MockUser;
  history: ChatMessage[];
  onGoBack: () => void;
  onSendMessage: (text: string) => void;
  onSendFile: (file: File) => void;
  onSelectProfile: (user: MockUser) => void;
}

const MessageBubble: React.FC<{ message: ChatMessage, isSent: boolean }> = ({ message, isSent }) => {
    const bubbleClasses = isSent
        ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white self-end rounded-br-none'
        : 'bg-[#2C2C2E] text-white self-start rounded-bl-none';
    
    if (message.type === 'image' && message.imageUrl) {
        return (
             <div className={`flex items-end gap-2 max-w-[60%] ${isSent ? 'self-end' : 'self-start'}`}>
                {!isSent && (
                    <img src={message.user?.avatarUrl} alt={message.user?.name} className="w-7 h-7 rounded-full mb-1" />
                )}
                <div className={`p-1 rounded-2xl ${isSent ? 'bg-gradient-to-br from-pink-500 to-purple-600' : 'bg-[#2C2C2E]'}`}>
                    <img src={message.imageUrl} alt={message.content} className="max-w-full h-auto rounded-lg" style={{ maxHeight: '200px' }}/>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex items-end gap-2 max-w-[80%] ${isSent ? 'self-end' : 'self-start'}`}>
            {!isSent && (
                <img src={message.user?.avatarUrl} alt={message.user?.name} className="w-7 h-7 rounded-full mb-1" />
            )}
            <div className={`p-3 rounded-2xl ${bubbleClasses}`}>
                <p className="text-base">{message.content}</p>
            </div>
        </div>
    );
};


export const ChatPage: React.FC<ChatPageProps> = ({ user, history, onGoBack, onSendMessage, onSendFile, onSelectProfile }) => {
    const [message, setMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };
    
    const handleAttachmentClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            onSendFile(file);
        } else if (file) {
            alert("Apenas arquivos de imagem são suportados nesta simulação.");
        }
        // Reset the input value to allow selecting the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="bg-[#121212] text-white min-h-screen flex flex-col font-sans">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-[#1C1C1E]/80 backdrop-blur-md flex items-center justify-between px-4 h-20 border-b border-gray-800">
                <button onClick={onGoBack} className="p-2 -ml-2 text-gray-300 hover:text-white">
                    <ArrowLeftIcon />
                </button>
                <button onClick={() => onSelectProfile(user)} className="flex items-center gap-3 text-left">
                     <img src={user.avatarUrl} alt={user.name} className="w-11 h-11 rounded-full object-cover" />
                     <div>
                        <h1 className="font-bold text-lg leading-tight">{user.name}</h1>
                        <p className="text-xs text-green-400">Online</p>
                     </div>
                </button>
                <div className="w-8"></div> {/* Placeholder to keep user info centered */}
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-y-auto p-4">
                <div className="flex flex-col gap-4">
                    {history.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} isSent={msg.user?.id === 987654321} />
                    ))}
                    <div ref={chatEndRef} />
                </div>
            </main>

            {/* Input Footer */}
            <footer className="sticky bottom-0 bg-[#1C1C1E] p-3 border-t border-gray-800">
                <form onSubmit={handleSend} className="flex items-center gap-3">
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
                    <button type="button" onClick={handleAttachmentClick} className="p-2 text-gray-400 hover:text-white"><PaperclipIcon className="w-6 h-6"/></button>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Digite uma mensagem..."
                        className="flex-1 bg-[#2C2C2E] rounded-full px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <AnimatePresence>
                    {!message.trim() ? (
                        <motion.button 
                            key="smile"
                            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                            type="button" onClick={() => alert('Open emoji picker')} className="p-2 text-gray-400 hover:text-white">
                            <SmileIcon className="w-6 h-6"/>
                        </motion.button>
                    ) : (
                        <motion.button 
                            key="send"
                            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                            type="submit" className="p-2.5 bg-pink-500 text-white rounded-full">
                            <SendIcon className="w-5 h-5"/>
                        </motion.button>
                    )}
                    </AnimatePresence>
                </form>
            </footer>
        </div>
    );
};
