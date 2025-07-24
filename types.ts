export type SpecialIcon = 'snowflake' | 'flower' | 'moon' | 'star' | null;

export interface MockUser {
  id: number;
  name: string;
  avatarUrl: string;
  isFollowed: boolean;
  followers: number;
  following: number;
  points: string;
  streamImageUrl: string;
  bio?: string;
  // New fields
  gender?: 'Feminino' | 'Masculino';
  birthday?: string; // 'DD/MM/YYYY'
  location?: string;
  distance?: number;
  sentDiamonds?: number;
  isLive?: boolean;
  isVerified?: boolean;
  lastLive?: string;
}

export interface Conversation {
    user: MockUser;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
    isMuted: boolean;
    isPinned?: boolean;
}

export interface Withdrawal {
    id: number;
    date: string;
    diamonds: number;
    amountBRL: number; // before fee
    feeBRL: number;
    finalAmountBRL: number;
    status: 'Completed' | 'Pending';
}

export interface Address {
  name: string;
  street: string;
  number: string;
  city: string;
  cep: string;
  country: string;
}

export interface PaymentMethod {
  id: string;
  type: 'google_pay' | 'mercado_pago' | 'credit_card';
  brand?: 'Mastercard' | 'Visa';
  last4?: string;
  cardholderName?: string;
  expiryDate?: string;
}

export interface PastLive {
  id: string;
  title: string;
  date: string;
  duration: string;
  diamondsEarned: number;
  peakViewers: number;
  thumbnailUrl: string;
}

export interface Medal {
  id: string;
  name: string;
  description: string;
  icon: string;
  achieved: boolean;
  achievedDate?: string;
  isNew?: boolean;
}

export interface VideoPost {
  type: 'video';
  id: string;
  user: Streamer;
  videoUrl: string;
  description: string;
  song: string;
  likes: number;
  comments: number;
  shares: number;
}

export interface PhotoPost {
  type: 'photo';
  id: string;
  user: Streamer;
  imageUrl: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
}

export type ContentPost = VideoPost | PhotoPost;


export interface VideoComment {
    id: string;
    user: MockUser;
    text: string;
    likes: number;
    timestamp: string;
}

export interface CurrentUser {
  id: number;
  name: string;
  avatarUrl: string;
  bannerUrl: string;
  bio: string;
  followers: number;
  following: number;
  likes: number;
  visitors: number;
  receivedDiamonds: number;
  withdrawalHistory: Withdrawal[];
  paymentPassword?: string | null;
  paymentMethods: PaymentMethod[];
  address: Address;
  isVerified?: boolean;
  verificationStatus?: 'none' | 'pending' | 'verified' | 'rejected';
  pastLives?: PastLive[];
  medals?: Medal[];
}

export interface Streamer {
  id: number;
  name:string;
  title: string;
  avatarUrl: string;
  streamImageUrl: string;
  streamVideoUrl: string;
  viewers: number;
  points: string;
  isVs: boolean;
  isNew: boolean;
  specialIcon: SpecialIcon;
  specialIconColor: string;
  isLocked: boolean;
  lockPrice: number;
  followedByCurrentUser: boolean;
  followers: number;
  following: number;
  bio?: string;
  // New fields
  gender?: 'Feminino' | 'Masculino';
  birthday?: string; // 'DD/MM/YYYY'
  location?: string;
  distance?: number;
  sentDiamonds?: number;
  isLive?: boolean;
  isVerified?: boolean;
  lastLive?: string;
}

export interface DiamondPackage {
    diamonds: number;
    price: number; // in BRL
    isMostSold?: boolean;
}

export interface ChatMessage {
    id: number;
    user?: MockUser;
    type: 'message' | 'follow' | 'gift' | 'system' | 'image';
    content: string;
    gift?: Gift;
    imageUrl?: string;
}

export interface Gift {
    id: number;
    name: string;
    image: string;
    cost: number;
}