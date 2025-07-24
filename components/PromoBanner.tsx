
import React from 'react';

interface PromoBannerProps {
  onViewCreators: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ onViewCreators }) => {
  return (
    <div className="bg-gradient-to-r from-[#2a0a25] to-[#121212] rounded-2xl overflow-hidden flex flex-col md:flex-row">
      <div className="flex-1 z-10 p-6 text-center md:text-left">
        <h3 className="text-3xl font-bold text-white">Conheça os Criadores!</h3>
        <p className="text-white/80 mt-1">Veja quem está em alta e comece a seguir.</p>
        <button
          onClick={onViewCreators}
          className="mt-4 px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold rounded-full shadow-lg shadow-pink-500/30 hover:scale-105 transform transition-all duration-300">
          Ver Criadores
        </button>
      </div>
      <div className="w-full md:w-2/5 h-48 md:h-auto flex-shrink-0">
         <img src="https://picsum.photos/seed/banner/600/300" alt="Top Creators Banner" className="w-full h-full object-cover md:object-left md:[clip-path:polygon(25%_0,_100%_0,_100%_100%,_0%_100%)]"/>
      </div>
    </div>
  );
};
