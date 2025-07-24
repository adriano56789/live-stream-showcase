
import React, { useState, useEffect } from 'react';

const BackspaceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>
);

interface PaymentPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (pin: string) => void;
    onForgotPassword: () => void;
    verifyPin: (pin: string) => Promise<boolean>;
    mode: 'set' | 'enter' | 'change';
    lockoutUntil: number | null;
    title: string;
    description: string;
}

type Stage = 'create' | 'confirm' | 'enter_old' | 'enter_new' | 'confirm_new';

export const PaymentPasswordModal: React.FC<PaymentPasswordModalProps> = ({
    isOpen, onClose, onSuccess, onForgotPassword, verifyPin, mode, lockoutUntil, title, description
}) => {
    const [pin, setPin] = useState('');
    const [tempPin, setTempPin] = useState('');
    const [stage, setStage] = useState<Stage>('create');
    const [error, setError] = useState('');
    const [isShaking, setIsShaking] = useState(false);

    const getInitialStage = (): Stage => {
        if (mode === 'set') return 'create';
        if (mode === 'change') return 'enter_old';
        return 'enter_old'; // 'enter' mode
    };

    useEffect(() => {
        if (isOpen) {
            setPin('');
            setTempPin('');
            setError('');
            setStage(getInitialStage());
        }
    }, [isOpen, mode]);

    const triggerShake = () => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
    };

    const handleKeyPress = (key: string) => {
        if (lockoutUntil && Date.now() < lockoutUntil) {
            const timeLeft = Math.ceil((lockoutUntil - Date.now()) / 1000);
            setError(`Muitas tentativas. Tente em ${timeLeft}s.`);
            triggerShake();
            return;
        }
        setError('');
        if (pin.length < 4) {
            setPin(p => p + key);
        }
    };

    const handleBackspace = () => {
        setPin(p => p.slice(0, -1));
        setError('');
    };

    const handlePinComplete = async (completedPin: string) => {
        switch (stage) {
            case 'create':
                setTempPin(completedPin);
                setStage('confirm');
                setPin('');
                break;
            case 'confirm':
                if (completedPin === tempPin) {
                    onSuccess(completedPin);
                } else {
                    setError('As senhas não correspondem. Tente novamente.');
                    triggerShake();
                    setPin('');
                    setTempPin('');
                    setStage('create');
                }
                break;
            case 'enter_old':
                const isCorrect = await verifyPin(completedPin);
                if (isCorrect) {
                    if (mode === 'change') {
                        setStage('create');
                        setPin('');
                    } else { // 'enter' mode
                        onSuccess(completedPin);
                    }
                } else {
                    setError('Senha incorreta.');
                    triggerShake();
                    setPin('');
                }
                break;
        }
    };
    
    useEffect(() => {
        if (pin.length === 4) {
            handlePinComplete(pin);
        }
    }, [pin]);

    if (!isOpen) return null;
    
    const getModalContent = () => {
        switch(stage) {
            case 'create': return { title: mode === 'change' ? 'Crie sua nova senha' : title, description: mode === 'change' ? 'Digite uma nova senha de 4 dígitos.' : description };
            case 'confirm': return { title: 'Confirme sua Senha', description: 'Digite a senha novamente para confirmar.' };
            case 'enter_old': return { title, description };
            default: return { title, description };
        }
    };

    const currentContent = getModalContent();

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#1C1C1E] text-white rounded-2xl w-full max-w-xs p-6 flex flex-col items-center" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-center">{currentContent.title}</h2>
                <p className="text-sm text-gray-400 mt-2 text-center">{currentContent.description}</p>

                <div className={`flex space-x-4 my-6 ${isShaking ? 'animate-shake' : ''}`}>
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} className={`w-4 h-4 rounded-full transition-colors ${pin.length > i ? 'bg-pink-500' : 'bg-gray-600'}`}></div>
                    ))}
                </div>

                {error && <p className="text-red-500 text-xs text-center h-4 mb-2">{error}</p>}
                {!error && <div className="h-4 mb-2"></div>}
                
                <div className="grid grid-cols-3 gap-4 w-full">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <button key={num} onClick={() => handleKeyPress(String(num))} className="text-2xl font-semibold h-16 rounded-full bg-gray-700/50 hover:bg-gray-700 transition-colors">
                            {num}
                        </button>
                    ))}
                    <div />
                    <button onClick={() => handleKeyPress('0')} className="text-2xl font-semibold h-16 rounded-full bg-gray-700/50 hover:bg-gray-700 transition-colors">
                        0
                    </button>
                    <button onClick={handleBackspace} className="flex items-center justify-center h-16 rounded-full bg-gray-700/50 hover:bg-gray-700 transition-colors">
                        <BackspaceIcon className="w-6 h-6"/>
                    </button>
                </div>
                
                <button onClick={onForgotPassword} className="mt-6 text-sm text-sky-400 hover:underline">
                    Esqueceu a senha?
                </button>
            </div>
             <style>{`.animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; } @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }`}</style>
        </div>
    );
};
