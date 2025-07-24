import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { FilmIcon } from './icons/FilmIcon';
import { ImageIcon } from './icons/ImageIcon';

type Stage = 'select' | 'edit' | 'publish';
type UploadType = 'video' | 'photo';

interface UploadFlowPageProps {
    onClose: () => void;
    onPublish: (file: File, description: string, type: UploadType) => void;
}

export const UploadFlowPage: React.FC<UploadFlowPageProps> = ({ onClose, onPublish }) => {
    const [stage, setStage] = useState<Stage>('select');
    const [uploadType, setUploadType] = useState<UploadType>('video');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [canWatch, setCanWatch] = useState<'public' | 'friends' | 'private'>('public');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Cleanup object URL
        return () => {
            if (mediaUrl) {
                URL.revokeObjectURL(mediaUrl);
            }
        };
    }, [mediaUrl]);

    const handleFileSelectClick = (type: UploadType) => {
        setUploadType(type);
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if ((uploadType === 'video' && file.type.startsWith('video/')) || (uploadType === 'photo' && file.type.startsWith('image/'))) {
                setMediaFile(file);
                const url = URL.createObjectURL(file);
                setMediaUrl(url);
                setStage('edit');
            } else {
                alert(`Por favor, selecione um arquivo de ${uploadType === 'video' ? 'vídeo' : 'imagem'} válido.`);
            }
        }
    };

    const handlePublish = () => {
        if (mediaFile) {
            onPublish(mediaFile, description, uploadType);
        } else {
            alert("Nenhum arquivo de mídia selecionado.");
        }
    };
    
    const goBack = () => {
        if (stage === 'edit') setStage('select');
        else if (stage === 'publish') setStage('edit');
        else onClose();
    };

    const SelectStage = () => (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h2 className="text-2xl font-bold">Carregar Conteúdo</h2>
            <p className="text-gray-400 mt-2 mb-10">Escolha o que você quer publicar.</p>
            <div className="w-full max-w-xs space-y-4">
                 <button
                    onClick={() => handleFileSelectClick('video')}
                    className="w-full bg-pink-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-pink-500/30 flex items-center justify-center space-x-3 text-lg hover:scale-105 transform transition-all duration-300"
                >
                    <FilmIcon className="w-7 h-7" />
                    <span>Carregar Vídeo</span>
                </button>
                 <button
                    onClick={() => handleFileSelectClick('photo')}
                    className="w-full bg-sky-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-sky-500/30 flex items-center justify-center space-x-3 text-lg hover:scale-105 transform transition-all duration-300"
                >
                    <ImageIcon className="w-7 h-7" />
                    <span>Carregar Foto</span>
                </button>
            </div>
            <input 
                type="file" 
                accept={uploadType === 'video' ? "video/*" : "image/*"} 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
            />
        </div>
    );

    const EditStage = () => (
        <div className="flex flex-col h-full">
            <div className="flex-1 flex items-center justify-center p-4 bg-black">
                {mediaUrl && (
                    uploadType === 'video' ? 
                    <video ref={videoRef} src={mediaUrl} controls className="max-h-full max-w-full rounded-lg" /> :
                    <img src={mediaUrl} alt="Preview" className="max-h-full max-w-full rounded-lg" />
                )}
            </div>
            <div className="p-4 bg-[#1C1C1E] border-t border-gray-700">
                {uploadType === 'video' && (
                    <>
                        <h3 className="font-semibold mb-2">Aparar (Simulação)</h3>
                        <div className="h-12 bg-gray-700 rounded-lg flex items-center px-2">
                            <div className="w-full h-1 bg-gray-500 rounded-full relative">
                                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-4 h-4 bg-white rounded-full cursor-pointer" />
                                <div className="absolute top-1/2 -translate-y-1/2 right-0 w-4 h-4 bg-white rounded-full cursor-pointer" />
                            </div>
                        </div>
                    </>
                )}
                 <button
                    onClick={() => setStage('publish')}
                    className="mt-4 w-full bg-pink-500 text-white font-bold py-3 rounded-full hover:bg-pink-600 transition-colors"
                >
                    Avançar
                </button>
            </div>
        </div>
    );

    const PublishStage = () => (
        <div className="p-4 space-y-6">
            <div>
                <label className="text-sm font-semibold text-gray-300">Descrição</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva sua publicação..."
                    maxLength={150}
                    className="w-full mt-2 bg-[#2C2C2E] text-white p-3 rounded-lg h-28 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
            </div>
            <div className="flex items-center space-x-4">
                <div className="w-20 h-28 bg-gray-700 rounded-lg flex-shrink-0">
                   {mediaUrl && (
                       uploadType === 'video' ?
                       <video src={mediaUrl} className="w-full h-full object-cover rounded-lg" /> :
                       <img src={mediaUrl} alt="Thumbnail" className="w-full h-full object-cover rounded-lg" />
                    )}
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold">Capa</h3>
                    <p className="text-sm text-gray-400">Esta será a miniatura da sua publicação.</p>
                </div>
            </div>
            
            <SettingItem
                label="Quem pode ver esta publicação"
                value={canWatch === 'public' ? 'Público' : canWatch === 'friends' ? 'Amigos' : 'Privado'}
                onClick={() => alert("Mudar privacidade (simulação)")}
            />

             <button
                onClick={handlePublish}
                className="w-full bg-pink-500 text-white font-bold py-3 rounded-full shadow-lg shadow-pink-500/30 hover:scale-105 transform transition-all duration-300"
            >
                Publicar
            </button>
        </div>
    );
    
    const SettingItem: React.FC<{label: string, value: string, onClick: () => void}> = ({label, value, onClick}) => (
        <button onClick={onClick} className="w-full flex justify-between items-center p-3 bg-[#2C2C2E] rounded-lg hover:bg-gray-700 transition-colors">
            <span className="font-semibold">{label}</span>
            <div className="flex items-center space-x-2 text-gray-400">
                <span>{value}</span>
                <ChevronRightIcon className="w-5 h-5"/>
            </div>
        </button>
    );

    return (
        <div className="fixed inset-0 bg-[#121212] text-white z-50 flex flex-col">
            <header className="flex-shrink-0 flex items-center justify-between p-4 bg-[#1C1C1E] sticky top-0 z-10">
                <button onClick={goBack} className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-xl font-bold">
                    {stage === 'select' && 'Carregar'}
                    {stage === 'edit' && `Editar ${uploadType === 'video' ? 'Vídeo' : 'Foto'}`}
                    {stage === 'publish' && 'Publicar'}
                </h1>
                <div className="w-10"></div>
            </header>
            <main className="flex-1 overflow-y-auto">
                {stage === 'select' && <SelectStage />}
                {stage === 'edit' && <EditStage />}
                {stage === 'publish' && <PublishStage />}
            </main>
        </div>
    );
};