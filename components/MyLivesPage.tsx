import React from 'react';
import type { PastLive } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { PastLiveDiamondIcon } from './icons/PastLiveDiamondIcon';
import { EyeIcon } from './icons/EyeIcon';
import { motion } from 'framer-motion';

const MotionDiv: any = motion.div;

interface MyLivesPageProps {
  onGoBack: () => void;
  pastLives: PastLive[];
}

const PastLiveCard: React.FC<{ live: PastLive }> = ({ live }) => (
    <MotionDiv
        whileHover={{ y: -5, scale: 1.02, boxShadow: '0 8px 25px rgba(236, 72, 153, 0.1)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-[#1C1C1E] rounded-2xl overflow-hidden flex shadow-lg cursor-pointer"
    >
        <img src={live.thumbnailUrl} alt={live.title} className="w-28 h-36 object-cover flex-shrink-0" />
        <div className="p-4 flex flex-col justify-between flex-1">
            <div>
                <p className="text-sm text-gray-400">{live.date} &middot; {live.duration}</p>
                <h3 className="font-bold text-white mt-1 line-clamp-2">{live.title}</h3>
            </div>
            <div className="flex space-x-4 text-sm mt-2">
                <div className="flex items-center text-yellow-400">
                    <PastLiveDiamondIcon className="w-4 h-4 mr-1.5" />
                    <span className="font-semibold">{live.diamondsEarned.toLocaleString('pt-BR')}</span>
                </div>
                 <div className="flex items-center text-gray-400">
                    <EyeIcon className="w-4 h-4 mr-1.5" />
                    <span className="font-semibold">{live.peakViewers.toLocaleString('pt-BR')}</span>
                </div>
            </div>
        </div>
    </MotionDiv>
);


export const MyLivesPage: React.FC<MyLivesPageProps> = ({ onGoBack, pastLives }) => {
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { ease: 'easeOut', duration: 0.4 }
    },
  };

  return (
    <div className="bg-[#121212] text-white min-h-screen flex flex-col font-sans">
      <header className="sticky top-0 z-10 bg-[#1C1C1E] flex items-center justify-between px-4 h-[65px] border-b border-gray-800">
        <button onClick={onGoBack} className="p-2 text-gray-300 hover:text-white">
          <ArrowLeftIcon />
        </button>
        <h1 className="text-lg font-bold text-white">
          Meus Vivos
        </h1>
        <div className="w-10"></div>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        {pastLives.length > 0 ? (
          <MotionDiv
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {pastLives.map((live) => (
              <MotionDiv key={live.id} variants={itemVariants}>
                  <PastLiveCard live={live} />
              </MotionDiv>
            ))}
          </MotionDiv>
        ) : (
          <div className="flex items-center justify-center h-full text-center p-4">
            <p className="text-gray-500">Você ainda não fez nenhuma transmissão.</p>
          </div>
        )}
      </main>
    </div>
  );
};
