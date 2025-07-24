
import React, { useState, useRef } from 'react';
import type { CurrentUser } from '../types';
import { ShieldIcon } from './icons/ShieldIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

// Icons
const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);
const CameraIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
);

// Form Input Component
const FormInput = ({ label, value, onChange, placeholder, maxLength, isTextarea = false }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; placeholder?: string; maxLength?: number; isTextarea?: boolean }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-semibold text-gray-300">{label}</label>
            {maxLength && <span className="text-xs text-gray-500">{value.length} / {maxLength}</span>}
        </div>
        {isTextarea ? (
             <textarea 
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
                className="w-full bg-[#2C2C2E] text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition h-28 resize-none"
             />
        ) : (
            <input 
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
                className="w-full bg-[#2C2C2E] text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            />
        )}
    </div>
);

interface EditProfilePageProps {
    user: CurrentUser;
    onGoBack: () => void;
    onSave: (updatedUser: CurrentUser) => void;
    onChangePassword: () => void;
}

export const EditProfilePage: React.FC<EditProfilePageProps> = ({ user, onGoBack, onSave, onChangePassword }) => {
    const [name, setName] = useState(user.name);
    const [bio, setBio] = useState(user.bio);
    const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = () => {
        if (!name.trim()) {
            alert('O nome não pode estar em branco.');
            return;
        }
        onSave({
            ...user,
            name: name.trim(),
            bio: bio.trim(),
            avatarUrl: avatarUrl,
        });
    };

    return (
        <div className="bg-[#121212] text-white min-h-screen font-sans">
            <header className="flex items-center justify-between p-4 bg-[#1C1C1E] sticky top-0 z-10">
                <button onClick={onGoBack} className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-xl font-bold">Editar Perfil</h1>
                <button 
                    onClick={handleSaveChanges} 
                    className="font-semibold text-pink-500 hover:text-pink-400 transition-colors px-3 py-1"
                >
                    Guardar
                </button>
            </header>

            <main className="p-4 md:p-6 max-w-2xl mx-auto space-y-8">
                <section className="flex flex-col items-center">
                    <div className="relative">
                        <img src={avatarUrl} alt="User Avatar" className="w-28 h-28 rounded-full object-cover border-4 border-gray-600" />
                        <button 
                            onClick={handleAvatarClick}
                            className="absolute bottom-0 right-0 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white border-2 border-[#1C1C1E] hover:bg-pink-600"
                            aria-label="Mudar foto"
                        >
                            <CameraIcon className="w-5 h-5" />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                </section>

                <section className="space-y-6">
                    <FormInput 
                        label="Nome de usuário"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Como os outros o verão"
                        maxLength={24}
                    />
                    <FormInput 
                        label="Biografia"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Fale um pouco sobre si"
                        maxLength={80}
                        isTextarea
                    />
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-bold text-gray-200">Segurança</h2>
                    <div className="bg-[#1C1C1E] rounded-lg">
                        <button onClick={onChangePassword} className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 rounded-lg transition-colors">
                            <div className="flex items-center space-x-4">
                                <ShieldIcon className="w-6 h-6 text-sky-400" />
                                <span className="font-semibold">Senha de Pagamento</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-400">{user.paymentPassword ? "Definida" : "Não definida"}</span>
                                <ChevronRightIcon className="w-5 h-5 text-gray-500"/>
                            </div>
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
};