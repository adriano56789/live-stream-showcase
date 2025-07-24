
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

// --- SVG Icons ---
const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);
const ShareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
);
const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);
const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0 2l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);
const CopyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
);
const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const VideoOnIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
);
const VideoOffIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
);
const MicOnIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg>
);
const MicOffIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg>
);
const ObsLogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" {...props}><path d="M128 20.89C68.64 20.89 20.89 68.64 20.89 128S68.64 235.11 128 235.11 235.11 187.36 235.11 128 187.36 20.89 128 20.89zm0 198.8S76.12 198.8 76.12 128s51.88-90.69 51.88-90.69 51.88 20.9 51.88 90.69-51.88 90.69-51.88 90.69z" fill="#FFF"/><path d="M128 128a51.88 51.88 0 1 0-51.88-51.88A51.88 51.88 0 0 0 128 128z" fill="#FFF"/></svg>
);
const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3L9.75 8.25 4.5 10.5l5.25 2.25L12 18l2.25-5.25L19.5 10.5l-5.25-2.25L12 3z"></path>
    <path d="M5 3v4"></path>
    <path d="M19 17v4"></path>
    <path d="M3 5h4"></path>
    <path d="M17 19h4"></path>
  </svg>
);

// --- Component ---
type StreamType = 'Regular Stream' | 'OBS Stream';

interface StreamSetupProps {
  onGoBack: () => void;
  onGoLive: (stream: MediaStream | null, title: string) => void;
  onGoToSettings: () => void;
}

export const StreamSetup: React.FC<StreamSetupProps> = ({ onGoBack, onGoLive, onGoToSettings }) => {
  const [streamType, setStreamType] = useState<StreamType>('Regular Stream');
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [serverUrl, setServerUrl] = useState('');
  const [streamKey, setStreamKey] = useState('');
  const [serverUrlCopied, setServerUrlCopied] = useState(false);
  const [streamKeyCopied, setStreamKeyCopied] = useState(false);

  const [title, setTitle] = useState("Estou ao vivo, venha ver!");
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);

  useEffect(() => {
    // Generate mock OBS credentials on component mount
    setServerUrl('rtmps://live-api-s.edgestreams.io/push');
    setStreamKey(`live_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`);
  }, []);

  const copyToClipboard = (text: string, setCopiedState: (isCopied: boolean) => void) => {
    navigator.clipboard.writeText(text).then(() => {
        setCopiedState(true);
        setTimeout(() => setCopiedState(false), 2000);
    }, (err) => {
        console.error('Could not copy text: ', err);
        alert('Falha ao copiar.');
    });
  };

  const handleGenerateTitle = async () => {
    setIsGeneratingTitle(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Gere um título curto, empolgante e engajador para uma transmissão ao vivo. O título deve ser em português do Brasil e atrair espectadores. Mantenha-o com menos de 40 caracteres.',
        });
        // Clean up response, remove quotes and trim.
        const generatedTitle = response.text.trim().replace(/^"|"$/g, '');
        setTitle(generatedTitle);
    } catch (error) {
        console.error("Error generating title with Gemini:", error);
        alert("Não foi possível gerar um título. Por favor, tente novamente.");
    } finally {
        setIsGeneratingTitle(false);
    }
  };

  const toggleMedia = async (type: 'camera' | 'mic') => {
    let newStream = stream;
    if (type === 'camera') {
        setIsCameraOn(prev => !prev);
    }
    if (type === 'mic') {
        setIsMicOn(prev => !prev);
    }

    const videoEnabled = type === 'camera' ? !isCameraOn : isCameraOn;
    const audioEnabled = type === 'mic' ? !isMicOn : isMicOn;

    if (!videoEnabled && !audioEnabled) {
        stream?.getTracks().forEach(track => track.stop());
        setStream(null);
        return;
    }

    try {
        newStream = await navigator.mediaDevices.getUserMedia({ video: videoEnabled, audio: audioEnabled });
        setStream(newStream);
    } catch (err) {
        console.error(`Error accessing media:`, err);
        alert(`Could not access media. Please check permissions.`);
        // Revert state if permission denied
        if (type === 'camera') setIsCameraOn(false);
        if (type === 'mic') setIsMicOn(false);
    }
  };
  
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    } else if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);
  
  const handleStreamTypeChange = (type: StreamType) => {
      setStreamType(type);
      if (type === 'OBS Stream' && stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
          setIsCameraOn(false);
          setIsMicOn(false);
      }
  };

  const LeftPanel = () => (
    <div className={`w-full md:w-[280px] flex-shrink-0 bg-[#1C1C1E] rounded-lg p-4 space-y-4 flex flex-col`}>
      <div className="flex items-center">
        <ObsLogoIcon className="w-10 h-10 text-white mr-3" />
        <h3 className="text-lg font-bold text-white">Configuração do OBS</h3>
      </div>
      <p className="text-sm text-gray-400">
        Use os detalhes abaixo no seu software de transmissão para se conectar.
      </p>

      <div className="space-y-4 text-sm">
        <div>
          <label className="text-xs font-bold text-gray-400">URL DO SERVIDOR</label>
          <div className="flex items-center mt-1 bg-[#2C2C2E] rounded-lg">
            <input type="text" readOnly value={serverUrl} className="flex-1 bg-transparent p-2 text-gray-300 outline-none" />
            <button onClick={() => copyToClipboard(serverUrl, setServerUrlCopied)} className="p-2 text-gray-300 hover:text-white">
              {serverUrlCopied ? <CheckIcon className="w-4 h-4 text-green-500" /> : <CopyIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400">CHAVE DE TRANSMISSÃO</label>
          <div className="flex items-center mt-1 bg-[#2C2C2E] rounded-lg">
            <input type="password" readOnly value={streamKey} className="flex-1 bg-transparent p-2 text-gray-300 outline-none" />
            <button onClick={() => copyToClipboard(streamKey, setStreamKeyCopied)} className="p-2 text-gray-300 hover:text-white">
              {streamKeyCopied ? <CheckIcon className="w-4 h-4 text-green-500" /> : <CopyIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#2C2C2E] p-3 rounded-lg mt-auto">
        <div className="flex items-start">
          <div className="bg-gray-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-1 flex-shrink-0">1</div>
          <div>
            <h5 className="font-bold text-sm">Configure o OBS</h5>
            <p className="text-xs text-gray-400">Copie a URL e a Chave para o seu software.</p>
          </div>
        </div>
        <div className="flex items-start mt-3">
          <div className="bg-gray-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-1 flex-shrink-0">2</div>
          <div>
            <h5 className="font-bold text-sm">Inicie a Transmissão</h5>
            <p className="text-xs text-gray-400">Clique em "Iniciar transmissão" no OBS.</p>
          </div>
        </div>
        <div className="flex items-start mt-3">
          <div className="bg-gray-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-1 flex-shrink-0">3</div>
          <div>
            <h5 className="font-bold text-sm">Entre Ao Vivo</h5>
            <p className="text-xs text-gray-400">Volte e clique em "Ir para Live".</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#121212] text-white min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-800">
        <button onClick={onGoBack} className="p-2 rounded-full hover:bg-gray-800 transition-colors"><ArrowLeftIcon /></button>
        <div className="flex items-center bg-[#2C2C2E] p-1 rounded-full">
          <button onClick={() => handleStreamTypeChange('Regular Stream')} className={`px-4 py-1.5 text-sm font-semibold rounded-full ${streamType === 'Regular Stream' ? 'bg-white text-black' : 'text-gray-300'}`}>Regular Stream</button>
          <button onClick={() => handleStreamTypeChange('OBS Stream')} className={`px-4 py-1.5 text-sm font-semibold rounded-full ${streamType === 'OBS Stream' ? 'bg-white text-black' : 'text-gray-300'}`}>OBS Stream</button>
        </div>
        <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden"><img src="https://picsum.photos/seed/user/100/100" alt="User"/></div>
            <button onClick={() => alert('Sharing!')} className="p-2 rounded-full hover:bg-gray-800 transition-colors hidden md:block"><ShareIcon /></button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-y-auto">
        {streamType === 'OBS Stream' && <div className="hidden md:block"><LeftPanel /></div>}

        {/* Center */}
        <main className="flex-1 flex flex-col items-center justify-center bg-[#1C1C1E] rounded-lg relative min-h-[50vh] md:min-h-0">
            <div className="w-full h-full flex items-center justify-center">
                {streamType === 'OBS Stream' ? (
                   <div className="text-center text-gray-400 px-4">
                        <ObsLogoIcon className="w-24 h-24 mx-auto opacity-20" />
                        <p className="mt-2 font-semibold">Aguardando sinal do OBS</p>
                        <p className="text-sm text-gray-500 mt-1">Siga as instruções para conectar.</p>
                  </div>
                ) : isCameraOn && stream ? (
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-contain rounded-lg"></video>
                ) : (
                    <div className="text-center text-gray-400">
                        <VideoOnIcon className="w-24 h-24 mx-auto opacity-20"/>
                        <p className="mt-2 font-semibold">Ligue a câmera para iniciar a pré-visualização</p>
                    </div>
                )}
            </div>
            <div className="absolute bottom-6 flex space-x-4">
                {streamType === 'Regular Stream' && (
                    <>
                        <button onClick={() => toggleMedia('mic')} className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isMicOn ? 'bg-white text-black' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}>
                            {isMicOn ? <MicOnIcon/> : <MicOffIcon/>}
                        </button>
                        <button onClick={() => toggleMedia('camera')} className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isCameraOn ? 'bg-white text-black' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}>
                            {isCameraOn ? <VideoOnIcon/> : <VideoOffIcon/>}
                        </button>
                    </>
                )}
            </div>
        </main>

        {/* Right */}
        <aside className="w-full md:w-[280px] flex-shrink-0 bg-[#1C1C1E] rounded-lg p-4 flex flex-col">
            {streamType === 'OBS Stream' && <div className="md:hidden mb-4"><LeftPanel /></div>}
            <div className="relative w-32 h-32 mx-auto">
                 <img src="https://picsum.photos/seed/avatar2/200/200" alt="Profile" className="rounded-2xl w-full h-full object-cover"/>
                 <button onClick={() => alert('Edit Profile clicked')} className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-black text-sm font-semibold px-4 py-1.5 rounded-full flex items-center shadow-md hover:scale-105 transition-transform"><PencilIcon className="mr-1.5"/>Editar</button>
            </div>
            <div className="mt-8">
                <label htmlFor="notification" className="text-sm font-semibold text-gray-300">Notificação para seguidores</label>
                 <div className="relative mt-2">
                    <input id="notification" type="text" value={title} onChange={e => setTitle(e.target.value)} maxLength={50} className="w-full bg-[#2C2C2E] text-gray-200 placeholder-gray-400 rounded-lg py-2.5 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"/>
                    <button 
                        onClick={handleGenerateTitle} 
                        disabled={isGeneratingTitle}
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full text-yellow-400 hover:bg-white/10 disabled:text-gray-500 disabled:cursor-wait"
                        aria-label="Gerar título com IA"
                    >
                         {isGeneratingTitle ? (
                            <SparklesIcon className="w-5 h-5 animate-pulse" />
                        ) : (
                            <SparklesIcon className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>
            <div className="flex-grow"></div>
            <button onClick={() => onGoLive(stream, title)} className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold py-3 rounded-full shadow-lg shadow-pink-500/30 hover:scale-105 transform transition-all duration-300">Ir para Live</button>
             <button onClick={onGoToSettings} className="mt-4 text-sm text-gray-400 font-semibold hover:text-white transition-colors flex items-center justify-center space-x-2">
                <SettingsIcon/>
                <span>Definições da transmissão</span>
            </button>
        </aside>
      </div>
    </div>
  );
};
