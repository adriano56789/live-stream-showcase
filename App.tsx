


import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StreamCard } from './components/StreamCard';
import { MOCK_FANS, MOCK_FOLLOWING, STREAMERS_DATA, MOCK_BLOCKED_USERS, MOCK_PAST_LIVES, MOCK_MEDALS, MOCK_CONTENT_POSTS, MOCK_CONVERSATIONS, MOCK_CHAT_HISTORY } from './constants';
import { Wallet } from './components/CoinShop';
import { StreamView } from './components/StreamView';
import { ProfilePage } from './components/ProfilePage';
import { UserProfilePage } from './components/StreamerProfilePage';
import { StreamSetup } from './components/StreamSetup';
import { EditProfilePage } from './components/EditProfilePage';
import { PaymentPasswordModal } from './components/PaymentPasswordModal';
import type { Streamer, MockUser, CurrentUser, Withdrawal, DiamondPackage, PaymentMethod, VideoPost, ContentPost, Conversation, ChatMessage } from './types';
import { PromoBanner } from './components/PromoBanner';
import { SocialListPage } from './components/SocialListPage';
import { BlockedListPage } from './components/BlockedListPage';
import { PrivateInviteSettingsPage } from './components/PrivateInviteSettingsPage';
import { LiveCreatorsPage } from './components/LiveCreatorsPage';
import { RankingPage } from './components/RankingPage';
import { VerificationRequestModal } from './components/VerificationRequestModal';
import { MyLivesPage } from './components/MyLivesPage';
import { MedalsPage } from './components/MedalsPage';
import { ExplorePage } from './components/ExplorePage';
import { UploadFlowPage } from './components/UploadFlowPage';
import { CreateModal } from './components/CreateModal';
import { MessagesPage } from './components/MessagesPage';
import { ChatPage } from './components/ChatPage';

type View = 'showcase' | 'stream' | 'profile' | 'user-profile' | 'setup' | 'edit-profile' | 'social-list' | 'blocked-list' | 'private-invite-settings' | 'live-creators' | 'ranking' | 'my-lives' | 'medals' | 'explore' | 'upload' | 'messages' | 'chat';

interface NavState {
  view: View;
  data?: any;
}

const App: React.FC = () => {
  const [history, setHistory] = useState<NavState[]>([{ view: 'showcase' }]);
  const [activeTab, setActiveTab] = useState('Para si');
  const [streamers, setStreamers] = useState<Streamer[]>(STREAMERS_DATA);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [walletInitialTab, setWalletInitialTab] = useState<'buy' | 'points'>('buy');
  const [userBalance, setUserBalance] = useState(3);
  const [diamondsSent, setDiamondsSent] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCurrentUserStreaming, setIsCurrentUserStreaming] = useState(false);
  const [currentUserStream, setCurrentUserStream] = useState<MediaStream | null>(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [contentPosts, setContentPosts] = useState<ContentPost[]>(MOCK_CONTENT_POSTS);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [chatHistory, setChatHistory] = useState<{[key: number]: ChatMessage[]}>(MOCK_CHAT_HISTORY);

  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    id: 987654321,
    name: 'Usuário Teste',
    avatarUrl: 'https://picsum.photos/seed/user/200/200',
    bannerUrl: 'https://images.pexels.com/photos/956981/pexels-photo-956981.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    bio: 'Bem-vindo ao meu perfil! Gosto de transmitir jogos e conversar com a galera.',
    followers: 167,
    following: 862,
    likes: 12500,
    visitors: 440,
    receivedDiamonds: 0,
    isVerified: false,
    verificationStatus: 'none',
    withdrawalHistory: [
        { id: 2, date: '21/07/2025', diamonds: 20000, amountBRL: 200, feeBRL: 40, finalAmountBRL: 160, status: 'Completed' },
        { id: 1, date: '20/07/2024', diamonds: 10000, amountBRL: 100, feeBRL: 20, finalAmountBRL: 80, status: 'Completed' }
    ],
    paymentPassword: null,
    address: {
        name: 'Usuário Teste',
        street: 'autoducuzeiro',
        number: '123',
        city: 'Juazeiro',
        cep: '12345-678',
        country: 'Brasil'
    },
    paymentMethods: [
        { id: 'card-1', type: 'credit_card', brand: 'Mastercard', last4: '8713', cardholderName: 'Usuário Teste' },
        { id: 'card-2', type: 'credit_card', brand: 'Visa', last4: '1234', cardholderName: 'Usuário Teste' },
        { id: 'card-3', type: 'credit_card', brand: 'Mastercard', last4: '5678', cardholderName: 'Usuário Teste' },
    ],
    pastLives: MOCK_PAST_LIVES,
    medals: MOCK_MEDALS,
  });

  const [passwordModalState, setPasswordModalState] = useState<{
    isOpen: boolean;
    mode: 'set' | 'enter' | 'change';
    onSuccess: (pin: string) => void;
    title: string;
    description: string;
  }>({ isOpen: false, mode: 'enter', onSuccess: () => {}, title: '', description: '' });
  const [passwordAttempts, setPasswordAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  const currentNav = history[history.length - 1];
  const { view, data } = currentNav;

  const push = (view: View, data: any = {}) => {
      setHistory(prev => [...prev, { view, data }]);
  };

  const pop = () => {
      if (history.length > 1) {
          setHistory(prev => prev.slice(0, -1));
      }
  };

  const goHome = () => {
      setHistory([{ view: 'showcase' }]);
      setSearchQuery('');
  }

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (isWalletOpen) {
        setIsWalletOpen(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isWalletOpen]);


  const handleSelectStream = (streamer: Streamer) => {
    if (streamer.isLocked) {
      if (userBalance >= streamer.lockPrice) {
        if (window.confirm(`Entrar na sala privada por ${streamer.lockPrice} diamantes?`)) {
          setUserBalance(prev => prev - streamer.lockPrice);
          push('stream', { streamer, liveStreamId: `live_${Math.floor(1000000 + Math.random() * 9000000)}` });
        }
      } else {
        alert(`Você precisa de ${streamer.lockPrice} diamantes para entrar. Saldo insuficiente. Entre em uma transmissão para recarregar.`);
      }
    } else {
      push('stream', { streamer, liveStreamId: `live_${Math.floor(1000000 + Math.random() * 9000000)}` });
    }
  };
  
    const handlePurchaseRequest = (pkg: DiamondPackage) => {
      setUserBalance(prev => prev + pkg.diamonds);
      alert(`${pkg.diamonds.toLocaleString()} diamantes adicionados ao seu saldo!`);
      setIsWalletOpen(false);
    };
  
    const handleSendGift = (cost: number, recipient: Streamer) => {
        setUserBalance(prev => prev - cost);
        setDiamondsSent(prev => prev + cost);

        if (isCurrentUserStreaming && recipient.id === 999) {
             setCurrentUser(prev => ({
                ...prev,
                receivedDiamonds: prev.receivedDiamonds + cost
            }));
        }

        setStreamers(prev => prev.map(s => s.id === recipient.id ? { ...s, points: String(Number(s.points) + cost) } : s));
        if (view === 'stream' && data.streamer && data.streamer.id === recipient.id) {
            const updatedStreamer = { ...data.streamer, points: String(Number(data.streamer.points) + cost) };
            setHistory(prev => [...prev.slice(0, -1), { view: 'stream', data: { ...data, streamer: updatedStreamer } }]);
        }
    };
    
    const handleWithdrawRequest = (amount: number) => {
        if (currentUser.receivedDiamonds < amount) {
            alert("Saldo de diamantes insuficiente para este saque.");
            return;
        }
        const amountBRL = amount / 100; // Corrected conversion: 100 diamonds = R$1
        const feeBRL = amountBRL * 0.20;
        const finalAmountBRL = amountBRL - feeBRL;

        const newWithdrawal: Withdrawal = {
            id: Date.now(),
            date: new Date().toLocaleDateString('pt-BR'),
            diamonds: amount,
            amountBRL: amountBRL,
            feeBRL: feeBRL,
            finalAmountBRL: finalAmountBRL,
            status: 'Completed',
        };

        setCurrentUser(prev => ({
            ...prev,
            receivedDiamonds: prev.receivedDiamonds - amount,
            withdrawalHistory: [newWithdrawal, ...prev.withdrawalHistory],
        }));

        alert(`Saque de R$${finalAmountBRL.toFixed(2)} solicitado com sucesso!`);
    };

    const handleOpenWallet = (tab: 'buy' | 'points' = 'buy') => {
        window.history.pushState({ modal: 'wallet' }, '');
        setIsWalletOpen(true);
        setWalletInitialTab(tab);
    };

    const handleCloseWallet = () => {
      if (window.history.state && window.history.state.modal === 'wallet') {
        window.history.back();
      } else {
        setIsWalletOpen(false);
      }
    };

    const requestPasswordVerification = (onSuccessCallback: () => void) => {
        if (!currentUser.paymentPassword) {
            setPasswordModalState({
                isOpen: true,
                mode: 'set',
                title: 'Crie sua Senha de Pagamento',
                description: 'Para sua segurança, crie uma senha para acessar seus pontos e saques.',
                onSuccess: (newPin) => {
                    handleSetPassword(newPin);
                    onSuccessCallback();
                }
            });
        } else {
            setPasswordModalState({
                isOpen: true,
                mode: 'enter',
                title: 'Digite sua Senha de Pagamento',
                description: 'Para acessar seus pontos e saques.',
                onSuccess: (pin) => {
                    onSuccessCallback();
                }
            });
        }
    };

    const handleChangePasswordRequest = () => {
         setPasswordModalState({
            isOpen: true,
            mode: 'change',
            title: 'Alterar Senha de Pagamento',
            description: 'Digite sua senha atual para continuar.',
            onSuccess: (newPin) => {
                handleSetPassword(newPin);
                alert("Senha de pagamento alterada com sucesso!");
            }
        });
    };

    const handleVerifyPassword = async (pin: string): Promise<boolean> => {
        if (lockoutUntil && Date.now() < lockoutUntil) {
            const timeLeft = Math.ceil((lockoutUntil - Date.now()) / 1000);
            alert(`Muitas tentativas. Tente novamente em ${timeLeft} segundos.`);
            return false;
        }

        if (pin === currentUser.paymentPassword) {
            setPasswordAttempts(0);
            return true;
        } else {
            const newAttempts = passwordAttempts + 1;
            setPasswordAttempts(newAttempts);
            if (newAttempts >= 3) {
                setLockoutUntil(Date.now() + 5 * 60 * 1000); // 5 minute lockout
                alert('Senha incorreta. Por segurança, sua conta foi bloqueada por 5 minutos.');
            } else {
                alert(`Senha incorreta. Tentativas restantes: ${3 - newAttempts}`);
            }
            return false;
        }
    };

    const handleSetPassword = (newPin: string) => {
        setCurrentUser(prev => ({...prev, paymentPassword: newPin}));
        setPasswordModalState(prev => ({...prev, isOpen: false}));
    };
    
    const handleForgotPassword = () => {
        alert("Uma simulação de redefinição de senha foi sentiada. Para este demo, sua senha será resetada.");
        setCurrentUser(prev => ({...prev, paymentPassword: null}));
        setPasswordModalState({ ...passwordModalState, isOpen: false });
    };

    const handleUpdatePaymentMethods = (newMethods: PaymentMethod[], newAddress?: typeof currentUser.address) => {
        setCurrentUser(prev => ({
            ...prev,
            paymentMethods: newMethods,
            address: newAddress || prev.address
        }));
    };


  const handleFollowToggle = (userId: number) => {
    // This function needs to update the user data wherever it might be.
    // 1. The main streamers list
    setStreamers(prevStreamers =>
      prevStreamers.map(s =>
        s.id === userId ? { ...s, followedByCurrentUser: !s.followedByCurrentUser } : s
      )
    );
    // 2. The content posts list
    setContentPosts(prevPosts => prevPosts.map(p => 
        p.user.id === userId ? {...p, user: {...p.user, followedByCurrentUser: !p.user.followedByCurrentUser}} : p
    ));
    
    // 3. The current history item's data if it contains the user
    const currentNav = history[history.length - 1];
    if (currentNav.data) {
      const updateUserInNav = (userObject: Streamer | MockUser) => {
        if (userObject && userObject.id === userId) {
          if ('followedByCurrentUser' in userObject) {
            userObject.followedByCurrentUser = !userObject.followedByCurrentUser;
          } else if ('isFollowed' in userObject) {
            userObject.isFollowed = !userObject.isFollowed;
          }
        }
        return userObject;
      };

      let needsUpdate = false;
      const newData = { ...currentNav.data };
      if (newData.streamer && newData.streamer.id === userId) {
        newData.streamer = updateUserInNav(newData.streamer);
        needsUpdate = true;
      }
      if (newData.user && newData.user.id === userId) {
        newData.user = updateUserInNav(newData.user);
        needsUpdate = true;
      }
      if (needsUpdate) {
        setHistory(prev => [...prev.slice(0, -1), { ...currentNav, data: newData }]);
      }
    }
  };

  const handleToggleLock = (streamerId: number) => {
    const updatedStreamers = streamers.map(s =>
      s.id === streamerId ? { ...s, isLocked: !s.isLocked } : s
    );
    setStreamers(updatedStreamers);
    
    const currentNav = history[history.length - 1];
    if (view === 'stream' && currentNav.data.streamer && currentNav.data.streamer.id === streamerId) {
        const updatedStreamer = { ...currentNav.data.streamer, isLocked: !currentNav.data.streamer.isLocked };
        setHistory(prev => [...prev.slice(0, -1), { view: 'stream', data: { ...currentNav.data, streamer: updatedStreamer } }]);
    }
  };
  
  const handleSelectPost = (post: ContentPost, allPosts: ContentPost[]) => {
      if (post.type === 'photo') {
          alert("A visualização de fotos em tela cheia ainda não foi implementada.");
          return;
      }

      const allVideos = allPosts.filter(p => p.type === 'video') as VideoPost[];
      const startIndex = allVideos.findIndex(v => v.id === post.id);

      if (startIndex > -1) {
          push('explore', { videos: allVideos, startIndex });
      }
  };
  
  const handleUpdateProfile = (updatedUser: CurrentUser) => {
    setCurrentUser(updatedUser);
    pop();
  };
  
  const handleOpenVerificationModal = () => setIsVerificationModalOpen(true);
  const handleCloseVerificationModal = () => setIsVerificationModalOpen(false);

  const handleVerificationRequest = (data: { realName: string; documentFile: File | null; justification: string }) => {
    console.log('Verification request submitted:', data);
    setCurrentUser(prev => ({
        ...prev,
        verificationStatus: 'pending'
    }));
    setIsVerificationModalOpen(false);
    alert('Sua solicitação de verificação foi enviada! A equipe irá analisá-la em breve.');
  };
  
   const handleGoToExplore = () => {
    const allVideos = contentPosts.filter(p => p.type === 'video') as VideoPost[];
    push('explore', { videos: allVideos, startIndex: 0 });
  };

  const handleGoToUpload = () => {
    push('upload');
    setIsCreateModalOpen(false);
  };

  const handleGoLiveFromModal = () => {
    if (isCurrentUserStreaming) {
        // Find the user's stream in history and go there? Or just create a new one.
        // For now, let's just go to setup.
        push('setup');
    } else {
        push('setup');
    }
    setIsCreateModalOpen(false);
  };
  
  const handlePublishPost = (file: File, description: string, type: 'video' | 'photo') => {
    const currentUserAsPoster = {
        id: currentUser.id,
        name: currentUser.name,
        avatarUrl: currentUser.avatarUrl,
        followedByCurrentUser: false,
        isVerified: currentUser.isVerified || false,
        title: '', streamImageUrl: '', streamVideoUrl: '', viewers: 0, points: '0', isVs: false, isNew: true, specialIcon: null, specialIconColor: '', isLocked: false, lockPrice: 0, followers: currentUser.followers, following: currentUser.following,
    };
    
    let newPost: ContentPost;

    if (type === 'video') {
        newPost = {
            type: 'video',
            id: `vid_${Date.now()}`,
            user: currentUserAsPoster,
            videoUrl: URL.createObjectURL(file),
            description: description,
            song: `Som Original - @${currentUser.name.replace(/\s/g, '')}`,
            likes: 0,
            comments: 0,
            shares: 0,
        };
    } else {
        newPost = {
            type: 'photo',
            id: `photo_${Date.now()}`,
            user: currentUserAsPoster,
            imageUrl: URL.createObjectURL(file),
            description: description,
            likes: 0,
            comments: 0,
            shares: 0,
        };
    }

    setContentPosts(prev => [newPost, ...prev]);
    alert(`${type === 'video' ? 'Vídeo' : 'Foto'} publicado com sucesso!`);
    goHome(); // Or go to profile
    push('profile');
  };


  const handleGoLive = (stream: MediaStream | null, title: string) => {
    const currentUserStreamer: Streamer = {
        id: 999, // Special ID for current user's stream
        name: currentUser.name,
        title: title,
        avatarUrl: currentUser.avatarUrl,
        streamImageUrl: 'https://picsum.photos/seed/user_stream/400/600',
        streamVideoUrl: stream ? '' : 'https://videos.pexels.com/video-files/4434250/4434250-hd_1080_1920_25fps.mp4',
        viewers: 0,
        points: String(currentUser.receivedDiamonds), // User's points are their received diamonds
        isVs: false,
        isNew: true,
        specialIcon: null,
        specialIconColor: '',
        isLocked: false,
        lockPrice: 0,
        followedByCurrentUser: false,
        bio: currentUser.bio,
        followers: currentUser.followers, 
        following: currentUser.following,
        isVerified: true,
    };

    setIsCurrentUserStreaming(true);
    setCurrentUserStream(stream);
    push('stream', { streamer: currentUserStreamer, liveStreamId: `live_${Math.floor(1000000 + Math.random() * 9000000)}`, mediaStream: stream });
  };

  const handleGoBackFromStream = () => {
    goHome();
    if (isCurrentUserStreaming) {
      currentUserStream?.getTracks().forEach(track => track.stop());
      setCurrentUserStream(null);
      setIsCurrentUserStreaming(false); // Reset streaming state
    }
  };

    const handleSendMessageInChat = (userId: number, text: string) => {
        const newMessage: ChatMessage = {
            id: Date.now(),
            user: { ...currentUser, id: currentUser.id, isFollowed: true, points: '0', streamImageUrl: '' }, // Sender is me
            type: 'message',
            content: text,
        };

        setChatHistory(prev => {
            const userHistory = prev[userId] ? [...prev[userId], newMessage] : [newMessage];
            return { ...prev, [userId]: userHistory };
        });

        // Update the conversation list to show the new last message and bring to top
        setConversations(prev => {
            const now = new Date();
            const timestamp = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
            const targetConvo = prev.find(c => c.user.id === userId);
            
            if (!targetConvo) return prev; // Avoids crash if conversation not found

            const updatedConvo = {
                ...targetConvo,
                lastMessage: `Você: ${text}`,
                timestamp: timestamp,
                unreadCount: 0,
            };
            return [updatedConvo, ...prev.filter(c => c.user.id !== userId)];
        });
    };

    const handleSendFileInChat = (userId: number, file: File) => {
        // Note: In a real app, you'd upload the file to a server and get a URL.
        // Here, we use a blob URL for local simulation. It will be revoked on page reload.
        const imageUrl = URL.createObjectURL(file);
        const newMessage: ChatMessage = {
            id: Date.now(),
            user: { ...currentUser, id: currentUser.id, isFollowed: true, points: '0', streamImageUrl: '' },
            type: 'image',
            content: file.name, // Use file name as content for alt text or reference
            imageUrl,
        };

        setChatHistory(prev => {
            const userHistory = prev[userId] ? [...prev[userId], newMessage] : [newMessage];
            return { ...prev, [userId]: userHistory };
        });

        // Update the conversation list to show the new last message and bring to top
        setConversations(prev => {
            const now = new Date();
            const timestamp = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
            const targetConvo = prev.find(c => c.user.id === userId);
            
            if (!targetConvo) return prev;

            const updatedConvo = {
                ...targetConvo,
                lastMessage: `Você: [Imagem]`,
                timestamp: timestamp,
                unreadCount: 0,
            };
            return [updatedConvo, ...prev.filter(c => c.user.id !== userId)];
        });
    };

  const filteredStreamers = streamers.filter(streamer => 
    streamer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const followedStreamers = streamers.filter(s => s.followedByCurrentUser);
  
  let content;
  switch (view) {
    case 'messages':
        content = <MessagesPage 
            conversations={conversations}
            onSelectConversation={(user) => push('chat', { user })}
            onGoBack={pop} // This should take them home
        />;
        break;
    case 'chat':
        content = <ChatPage
            user={data.user}
            onGoBack={pop}
            history={chatHistory[data.user.id] || []}
            onSendMessage={(text) => handleSendMessageInChat(data.user.id, text)}
            onSendFile={(file) => handleSendFileInChat(data.user.id, file)}
            onSelectProfile={(user) => push('user-profile', { user })}
        />;
        break;
    case 'explore':
        content = <ExplorePage
            initialPlaylist={data.videos}
            initialIndex={data.startIndex}
            onGoBack={pop}
            onSelectProfile={(user) => push('user-profile', { user })}
            onFollowToggle={handleFollowToggle}
        />;
        break;
    case 'upload':
        content = <UploadFlowPage 
            onClose={pop} 
            onPublish={handlePublishPost}
        />
        break;
    case 'stream':
      content = (
        <StreamView
          streamer={data.streamer}
          liveStreamId={data.liveStreamId}
          onGoBack={handleGoBackFromStream}
          onOpenWallet={() => handleOpenWallet('buy')}
          userBalance={userBalance}
          onSendGift={handleSendGift}
          isCurrentUserStreamer={data.streamer.id === 999}
          onFollowToggle={handleFollowToggle}
          isFollowed={data.streamer.followedByCurrentUser}
          onToggleLock={handleToggleLock}
          onSelectProfile={(user) => push('user-profile', { user })}
          mediaStream={data.mediaStream || null}
        />
      );
      break;
    case 'profile':
        content = <ProfilePage 
            user={currentUser}
            onGoBack={pop}
            onGoToEditProfile={() => push('edit-profile')}
            onOpenWallet={() => handleOpenWallet('points')}
            onGoToMySocial={(tab) => push('social-list', { tab, isMySocial: true })}
            onGoToBlockedList={() => push('blocked-list')}
            onGoToPrivateInviteSettings={() => push('private-invite-settings')}
            onOpenVerificationModal={handleOpenVerificationModal}
            onGoToMyLives={() => push('my-lives')}
            onGoToMedals={() => {
                setCurrentUser(prev => ({ ...prev, medals: prev.medals?.map(m => ({ ...m, isNew: false })) }));
                push('medals');
            }}
            userPosts={contentPosts.filter(p => p.user.id === currentUser.id)}
            onSelectPost={handleSelectPost}
        />;
        break;
    case 'user-profile':
        content = (
            <UserProfilePage
                key={data.user.id}
                user={data.user}
                onGoBack={pop}
                onFollowToggle={handleFollowToggle}
                isFollowed={'followedByCurrentUser' in data.user ? data.user.followedByCurrentUser : ('isFollowed' in data.user ? data.user.isFollowed : false)}
                userPosts={contentPosts.filter(p => p.user.id === data.user.id)}
                onSelectPost={handleSelectPost}
                onGoToUserSocial={(tab) => push('social-list', { tab, user: data.user })}
            />
        );
        break;
    case 'edit-profile':
        content = <EditProfilePage 
            user={currentUser}
            onGoBack={pop}
            onSave={handleUpdateProfile}
            onChangePassword={handleChangePasswordRequest}
        />;
        break;
    case 'social-list':
        const listData = data.isMySocial ? { fans: MOCK_FANS, following: MOCK_FOLLOWING } : { fans: MOCK_FOLLOWING, following: MOCK_FANS }; // Simulate different lists
        content = <SocialListPage
            initialTab={data.tab}
            onGoBack={pop}
            fans={listData.fans}
            following={listData.following}
            onSelectProfile={(user) => push('user-profile', { user })}
        />;
        break;
    case 'blocked-list':
        content = <BlockedListPage
            onGoBack={pop}
            initialBlockedUsers={MOCK_BLOCKED_USERS}
        />;
        break;
    case 'private-invite-settings':
        content = <PrivateInviteSettingsPage onGoBack={pop} />;
        break;
    case 'setup':
        content = <StreamSetup onGoBack={pop} onGoLive={handleGoLive} onGoToSettings={() => push('private-invite-settings')} />;
        break;
    case 'live-creators':
        content = <LiveCreatorsPage 
            creators={streamers}
            onGoBack={pop}
            onSelectProfile={(user) => push('user-profile', { user })}
            onSelectStream={handleSelectStream}
            onFollowToggle={handleFollowToggle}
        />;
        break;
    case 'ranking':
        content = <RankingPage onGoBack={pop} onSelectProfile={(user) => push('user-profile', { user })} />;
        break;
    case 'my-lives':
        content = <MyLivesPage onGoBack={pop} pastLives={currentUser.pastLives || []} />;
        break;
    case 'medals':
        content = <MedalsPage onGoBack={pop} medals={currentUser.medals || []} />;
        break;
    case 'showcase':
    default:
      content = (
        <div className="flex flex-col h-screen">
          <Header 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isSearchActive={isSearchActive}
            onSearchToggle={setIsSearchActive}
            onGoToRanking={() => push('ranking')}
          />
          <main className="flex-1 overflow-y-auto pb-20 px-2 md:px-4">
            <div className="space-y-4 pt-4">
              {!searchQuery && <PromoBanner onViewCreators={() => push('live-creators')} />}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                 {(searchQuery ? filteredStreamers : (activeTab === 'Para si' ? streamers : followedStreamers)).map((streamer, index) => (
                   <StreamCard 
                        key={streamer.id} 
                        streamer={streamer} 
                        onClick={() => handleSelectStream(streamer)}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 30}ms` }}
                    />
                 ))}
              </div>
            </div>
          </main>
           <Sidebar 
                currentView={view}
                onGoHome={() => {
                    goHome();
                    setActiveTab('Para si');
                }}
                onOpenCreateModal={() => setIsCreateModalOpen(true)}
                onGoToMessages={() => push('messages')}
                onGoToProfile={() => push('profile')}
                onGoToExplore={handleGoToExplore}
            />
        </div>
      );
  }

  return (
    <div className="antialiased">
      {content}
      
      <CreateModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onGoLive={handleGoLiveFromModal}
        onGoToUpload={handleGoToUpload}
      />

      <Wallet 
        isOpen={isWalletOpen}
        onClose={handleCloseWallet}
        onPurchaseRequest={handlePurchaseRequest}
        onWithdrawRequest={handleWithdrawRequest}
        user={currentUser}
        userBalance={userBalance}
        onUpdatePaymentMethods={handleUpdatePaymentMethods}
        onRequestPasswordVerification={requestPasswordVerification}
        initialTab={walletInitialTab}
      />
      <PaymentPasswordModal 
        isOpen={passwordModalState.isOpen}
        onClose={() => setPasswordModalState(p => ({...p, isOpen: false}))}
        onSuccess={passwordModalState.onSuccess}
        onForgotPassword={handleForgotPassword}
        verifyPin={handleVerifyPassword}
        mode={passwordModalState.mode}
        lockoutUntil={lockoutUntil}
        title={passwordModalState.title}
        description={passwordModalState.description}
      />
      <VerificationRequestModal
        isOpen={isVerificationModalOpen}
        onClose={handleCloseVerificationModal}
        onSubmit={handleVerificationRequest}
      />
    </div>
  );
};

export default App;
