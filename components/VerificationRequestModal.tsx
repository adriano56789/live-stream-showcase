
import React, { useState } from 'react';

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
);


interface VerificationRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { realName: string; documentFile: File | null; justification: string }) => void;
}

export const VerificationRequestModal: React.FC<VerificationRequestModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [realName, setRealName] = useState('');
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [justification, setJustification] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!realName.trim() || !documentFile || !justification.trim()) {
            alert('Por favor, preencha todos os campos e anexe um documento.');
            return;
        }
        onSubmit({ realName, documentFile, justification });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setDocumentFile(e.target.files[0]);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#1C1C1E] text-white rounded-2xl w-full max-w-md p-6 flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Solicitar Selo de Verificação</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white">
                        <CloseIcon className="w-5 h-5"/>
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="realName" className="text-sm font-semibold text-gray-300 block mb-2">Nome Completo</label>
                        <input id="realName" type="text" value={realName} onChange={e => setRealName(e.target.value)} required
                               className="w-full bg-[#2C2C2E] text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition"/>
                    </div>
                    <div>
                         <label htmlFor="document" className="text-sm font-semibold text-gray-300 block mb-2">Documento de Identificação</label>
                         <label htmlFor="document-upload" className="w-full bg-[#2C2C2E] p-4 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-600 hover:border-pink-500 cursor-pointer transition">
                             <UploadIcon className="w-8 h-8 text-gray-400 mb-2"/>
                             <span className="text-sm font-semibold text-gray-300">{documentFile ? documentFile.name : 'Clique para enviar uma foto'}</span>
                             <span className="text-xs text-gray-500">PNG, JPG, PDF (MAX. 5MB)</span>
                         </label>
                         <input id="document-upload" type="file" accept="image/png, image/jpeg, application/pdf" onChange={handleFileChange} className="hidden" required/>
                    </div>
                     <div>
                        <label htmlFor="justification" className="text-sm font-semibold text-gray-300 block mb-2">Justificativa</label>
                        <textarea id="justification" value={justification} onChange={e => setJustification(e.target.value)} required
                                  className="w-full bg-[#2C2C2E] text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition h-28 resize-none"
                                  placeholder="Explique por que sua conta deve ser verificada (ex: figura pública, marca, etc.)" />
                    </div>
                     <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold py-3 rounded-full shadow-lg shadow-pink-500/30 hover:scale-105 transform transition-all duration-300">
                        Enviar Solicitação
                    </button>
                </form>
            </div>
        </div>
    );
};
