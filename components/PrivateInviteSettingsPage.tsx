import React, { useState } from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 ${
                checked ? 'bg-purple-600' : 'bg-gray-700'
            }`}
        >
            <span
                className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${
                    checked ? 'translate-x-7' : 'translate-x-1'
                }`}
            />
        </button>
    );
};


interface PrivateInviteSettingsPageProps {
    onGoBack: () => void;
}

export const PrivateInviteSettingsPage: React.FC<PrivateInviteSettingsPageProps> = ({ onGoBack }) => {
    const [isInviteEnabled, setIsInviteEnabled] = useState(true);
    type FilterType = 'following' | 'fans' | 'friends';
    const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);

    const handleFilterToggle = (filter: FilterType) => {
        // This makes the toggles mutually exclusive.
        setActiveFilter(current => (current === filter ? null : filter));
    };


    return (
        <div className="bg-[#121212] text-white min-h-screen flex flex-col font-sans">
            <header className="sticky top-0 z-10 bg-[#1C1C1E] flex items-center justify-between px-4 h-[65px] border-b border-gray-800">
                <button onClick={onGoBack} className="p-2 text-gray-300 hover:text-white">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-lg font-bold text-white">
                    Convite privado ao vivo
                </h1>
                <div className="w-10"></div> {/* Placeholder to center title */}
            </header>

            <main className="flex-1 p-4">
                <div className="bg-transparent rounded-lg p-4 space-y-8">
                    {/* Main Toggle */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="font-semibold text-white">Convite privado ao vivo</h2>
                            <p className="text-sm text-gray-400 mt-1">Você receberá um convite privado ao vivo quando o ligar</p>
                        </div>
                        <ToggleSwitch checked={isInviteEnabled} onChange={setIsInviteEnabled} />
                    </div>

                    {/* Conditional sub-options */}
                    <div className={`space-y-8 transition-opacity duration-300 ${!isInviteEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                         <div className="flex justify-between items-center">
                             <h2 className="font-semibold text-white">Após a abertura, só aceito usuários que sigo.</h2>
                             <ToggleSwitch checked={activeFilter === 'following'} onChange={() => handleFilterToggle('following')} />
                         </div>
                         <div className="flex justify-between items-center">
                             <h2 className="font-semibold text-white">Após a abertura, apenas meus fãs são aceitos.</h2>
                             <ToggleSwitch checked={activeFilter === 'fans'} onChange={() => handleFilterToggle('fans')} />
                         </div>
                         <div className="flex justify-between items-center">
                             <h2 className="font-semibold text-white">Após a abertura, só aceito meus amigos.</h2>
                             <ToggleSwitch checked={activeFilter === 'friends'} onChange={() => handleFilterToggle('friends')} />
                         </div>
                    </div>
                </div>
            </main>
        </div>
    );
};