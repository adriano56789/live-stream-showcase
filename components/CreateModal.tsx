import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoIcon } from './icons/VideoIcon';
import { FilmIcon } from './icons/FilmIcon';
import { ImageIcon } from './icons/ImageIcon';

interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGoLive: () => void;
    onGoToUpload: () => void;
}

const CreateButton: React.FC<{icon: React.ReactNode, label: string, onClick: () => void}> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center space-y-2 p-4 rounded-2xl hover:bg-white/10 transition-colors duration-200">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white">
            {icon}
        </div>
        <span className="font-semibold">{label}</span>
    </button>
);


export const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose, onGoLive, onGoToUpload }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                 <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center"
                 >
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 400, damping: 40 }}
                        className="bg-[#1C1C1E] text-white w-full rounded-t-2xl p-6"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <CreateButton icon={<VideoIcon className="w-8 h-8 text-pink-400"/>} label="Ao Vivo" onClick={onGoLive} />
                            <CreateButton icon={<FilmIcon className="w-8 h-8 text-sky-400"/>} label="Vídeo" onClick={onGoToUpload} />
                            <CreateButton icon={<ImageIcon className="w-8 h-8 text-green-400"/>} label="Foto" onClick={onGoToUpload} />
                        </div>
                        <button 
                            onClick={onClose}
                            className="w-full mt-6 py-3 bg-[#2C2C2E] rounded-full font-bold hover:bg-gray-700 transition-colors"
                        >
                            Cancelar
                        </button>
                    </motion.div>
                 </motion.div>
            )}
        </AnimatePresence>
    );
};
