
import React, { useState, useEffect } from 'react';
import type { DiamondPackage, CurrentUser, Withdrawal, PaymentMethod, Address } from '../types';
import { DIAMOND_PACKAGES } from '../constants';
import { GooglePayIcon } from './icons/GooglePayIcon';
import { MercadoPagoIcon } from './icons/MercadoPagoIcon';
import { CheckIcon } from './icons/CheckIcon';
import { MastercardIcon } from './icons/MastercardIcon';
import { VisaIcon } from './icons/VisaIcon';
import { ChipIcon } from './icons/ChipIcon';
import { PencilIcon } from './icons/PencilIcon';
import { AliiLogoIcon } from './icons/AliiLogoIcon';


// --- Icons ---
const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);
const ArrowRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400" {...props}><polyline points="9 18 15 12 9 6"></polyline></svg>
);
const DiamondIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2.7 10.3a2.41 2.41 0 0 0-1.6 4.5l8.9 8.9a2.41 2.41 0 0 0 3.4 0l8.9-8.9a2.41 2.41 0 0 0-1.6-4.5Z"></path><path d="m12 22 4.9-4.9"></path><path d="M10.4 3.6a2.41 2.41 0 0 0-3.4 0L1.1 9.5"></path><path d="M12 22 7.1 17.1"></path><path d="m13.6 3.6a2.41 2.41 0 0 1 3.4 0l5.9 5.9"></path></svg>
);

interface WalletProps {
    isOpen: boolean;
    onClose: () => void;
    onPurchaseRequest: (pkg: DiamondPackage) => void;
    onWithdrawRequest: (amount: number) => void;
    user: CurrentUser;
    userBalance: number;
    onUpdatePaymentMethods: (methods: PaymentMethod[], address?: Address) => void;
    onRequestPasswordVerification: (onSuccessCallback: () => void) => void;
    initialTab: 'buy' | 'points';
}

const PaymentMethodIcon: React.FC<{method: PaymentMethod, className?: string}> = ({ method, className }) => {
    if (method.type === 'credit_card') {
        if (method.brand === 'Mastercard') return <MastercardIcon className={className}/>
        if (method.brand === 'Visa') return <VisaIcon className={className}/>
    }
    return null; // Fallback for other card types
};

const PaymentMethodDisplay: React.FC<{methodId: string, methods: PaymentMethod[]}> = ({methodId, methods}) => {
    const method = methods.find(m => m.id === methodId);

    if (method) { // It's a credit card
        return (
            <div className="flex items-center space-x-3">
                <PaymentMethodIcon method={method} className="w-10 h-6 object-contain" />
                <p>{method.brand}-{method.last4}</p>
            </div>
        );
    }
    if (methodId === 'google_pay') {
        return (
            <div className="flex items-center space-x-3">
                <GooglePayIcon className="w-10 h-10 -ml-1" />
                <p>Google Pay</p>
            </div>
        );
    }
    if (methodId === 'mercado_pago') {
         return (
            <div className="flex items-center space-x-3">
                <MercadoPagoIcon className="w-8 h-8" />
                <p>Mercado Pago</p>
            </div>
        );
    }
    return <p>Selecione um método</p>;
};


export const Wallet: React.FC<WalletProps> = ({ isOpen, onClose, onPurchaseRequest, onWithdrawRequest, user, userBalance, onUpdatePaymentMethods, onRequestPasswordVerification, initialTab }) => {
    const [activeTab, setActiveTab] = useState<'buy' | 'points'>(initialTab);
    const [selectedPackage, setSelectedPackage] = useState<DiamondPackage | null>(null);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPointsTabUnlocked, setIsPointsTabUnlocked] = useState(false);
    
    const [purchaseView, setPurchaseView] = useState<'main' | 'select_payment' | 'add_card'>('main');
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>('card-1');

    const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '', name: user.name, brand: 'Mastercard' as 'Mastercard' | 'Visa' });
    const [addressForm, setAddressForm] = useState<Address>(user.address);

    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => {
                setSelectedPackage(null);
                setWithdrawAmount('');
                setIsProcessing(false);
                setPurchaseView('main');
                setIsPointsTabUnlocked(false); // Reset password verification on close
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setActiveTab(initialTab);
            setSelectedPaymentMethodId(user.paymentMethods[0]?.id || 'google_pay');
            setAddressForm(user.address);
        }
    }, [isOpen, initialTab, user.address, user.paymentMethods]);

    const handleSelectPackage = (pkg: DiamondPackage) => {
        setSelectedPackage(pkg);
    };

    const handleClosePurchaseModal = () => {
        setSelectedPackage(null);
        setIsProcessing(false);
        setTimeout(() => setPurchaseView('main'), 200);
    }

    const handleConfirmPurchase = () => {
        if (selectedPackage && !isProcessing) {
            setIsProcessing(true);
            setTimeout(() => {
                onPurchaseRequest(selectedPackage);
                setIsProcessing(false);
                handleClosePurchaseModal();
            }, 2000);
        }
    };
    
    const handleConfirmWithdraw = () => {
        const amount = parseInt(withdrawAmount, 10);
        if(isNaN(amount) || amount <= 0) {
            alert("Por favor, insira um valor válido.");
            return;
        }
        if(amount > user.receivedDiamonds) {
            alert("Saldo insuficiente para este saque.");
            return;
        }
        onWithdrawRequest(amount);
        setWithdrawAmount('');
    };

    const handleAddCard = (e: React.FormEvent) => {
        e.preventDefault();
        const numberIsValid = cardForm.number.replace(/\s/g, '').length === 16;
        const expiryIsValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(cardForm.expiry);
        const cvvIsValid = cardForm.cvv.length === 3;

        if (!numberIsValid || !expiryIsValid || !cvvIsValid || !cardForm.name.trim() || !addressForm.street.trim()) {
            alert("Por favor, preencha todos os campos obrigatórios corretamente.");
            return;
        }
        const newCard: PaymentMethod = {
            id: `card-${Date.now()}`,
            type: 'credit_card',
            brand: cardForm.brand,
            last4: cardForm.number.replace(/\s/g, '').slice(-4),
            cardholderName: cardForm.name,
            expiryDate: cardForm.expiry,
        };
        const updatedMethods = [...user.paymentMethods, newCard];
        onUpdatePaymentMethods(updatedMethods, addressForm);
        setSelectedPaymentMethodId(newCard.id);
        setCardForm({ number: '', expiry: '', cvv: '', name: user.name, brand: 'Mastercard' });
        setPurchaseView('main');
    };

    const handleCardFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;
        if (name === 'number') {
            formattedValue = value.replace(/\D/g, '').substring(0, 16).replace(/(.{4})/g, '$1 ').trim();
        } else if (name === 'expiry') {
            const numbers = value.replace(/\D/g, '').substring(0, 4);
            if (numbers.length > 2) {
              formattedValue = `${numbers.substring(0,2)}/${numbers.substring(2,4)}`;
            } else {
              formattedValue = numbers;
            }
        } else if (name === 'cvv') {
            formattedValue = value.replace(/\D/g, '').substring(0, 3);
        }
        setCardForm(prev => ({ ...prev, [name]: formattedValue }));
    };

    const handleTabClick = (tab: 'buy' | 'points') => {
        if (tab === 'buy') {
            setActiveTab('buy');
        } else { // 'points'
            if (isPointsTabUnlocked) {
                setActiveTab('points');
            } else {
                onRequestPasswordVerification(() => {
                    setIsPointsTabUnlocked(true);
                    setActiveTab('points');
                });
            }
        }
    };
    
    const earningsInBRL = user.receivedDiamonds / 100;
    const withdrawAmountNum = parseInt(withdrawAmount, 10) || 0;
    const withdrawValueBRL = withdrawAmountNum / 100;
    const feeBRL = withdrawValueBRL * 0.20;
    const finalValueBRL = withdrawValueBRL - feeBRL;

    if (!isOpen) return null;

    const renderBuyTab = () => (
      <>
        <div className="bg-[#1C2A28] rounded-lg p-4 mx-4 mt-4">
            <div className="flex justify-between items-center text-gray-400 text-sm">
                <span>Diamantes</span>
                <button className="text-sm text-sky-400 flex items-center">
                    Detalhamento <ArrowRightIcon />
                </button>
            </div>
            <div className="flex items-center font-bold text-white text-3xl mt-2">
                <DiamondIcon className="w-7 h-7 text-yellow-300 mr-2"/>
                {userBalance.toLocaleString('pt-BR')}
            </div>
        </div>
        <div className="flex-1 p-4 grid grid-cols-2 gap-4">
            {DIAMOND_PACKAGES.map((pkg, index) => (
                <button 
                    key={index} 
                    onClick={() => handleSelectPackage(pkg)} 
                    className="bg-[#1F1F1F] p-3 rounded-lg text-center border-2 transition-all duration-300 transform hover:scale-105 active:scale-100 border-transparent"
                >
                    <div className="flex items-center justify-center font-bold">
                        <DiamondIcon className="w-5 h-5 text-yellow-300 mr-1"/>
                        <span>{pkg.diamonds.toLocaleString('pt-BR')}</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">R$ {pkg.price.toFixed(2).replace('.', ',')}</p>
                    {pkg.isMostSold && (
                        <div className="mt-2 text-xs font-semibold bg-blue-500 text-white rounded-full px-2 py-0.5 inline-block">Mais vendido</div>
                    )}
                </button>
            ))}
        </div>
      </>
    );
    
    const renderPointsTab = () => (
        <div className="p-4 flex flex-col h-full text-white">
            <div className="bg-[#1f1f1f] p-4 rounded-lg">
                <p className="text-sm text-gray-400">Saldo disponível para saque</p>
                <p className="text-3xl font-bold mt-1">R$ {earningsInBRL.toFixed(2).replace('.', ',')}</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center">
                    <DiamondIcon className="w-3 h-3 mr-1"/> {user.receivedDiamonds.toLocaleString('pt-BR')}
                </p>
            </div>
            <div className="mt-6">
                <label className="text-sm font-semibold">Valor do Saque (em diamantes)</label>
                <div className="relative mt-2">
                    <DiamondIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                    <input 
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder={`Máx ${user.receivedDiamonds.toLocaleString('pt-BR')}`}
                        className="w-full bg-[#1f1f1f] rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                </div>
                 <div className="mt-2 text-xs text-gray-400 p-2 bg-[#1f1f1f]/50 rounded-md">
                    <p>Valor a receber: <span className="font-bold text-white">R$ {finalValueBRL > 0 ? finalValueBRL.toFixed(2).replace('.', ',') : '0,00'}</span></p>
                    <p>Taxa da plataforma (20%): <span className="font-bold text-white">R$ {feeBRL > 0 ? feeBRL.toFixed(2).replace('.', ',') : '0,00'}</span></p>
                </div>
                <button onClick={handleConfirmWithdraw} className="w-full mt-4 bg-sky-500 text-white font-bold py-3 rounded-lg hover:bg-sky-600 transition-colors">
                    Sacar agora
                </button>
            </div>
            <div className="mt-6 flex-1 flex flex-col">
                <h3 className="font-semibold mb-2">Histórico de saques</h3>
                <div className="flex-1 overflow-y-auto pr-2">
                    {user.withdrawalHistory.length > 0 ? user.withdrawalHistory.map(item => (
                        <div key={item.id} className="bg-[#1f1f1f] p-3 rounded-lg mb-2 flex justify-between items-center">
                            <div>
                                <p className="font-semibold">Saque de R$ {item.finalAmountBRL.toFixed(2).replace('.', ',')}</p>
                                <p className="text-xs text-gray-400 mt-1">Bruto R$ {item.amountBRL.toFixed(2).replace('.',',')} | Taxa R$ {item.feeBRL.toFixed(2).replace('.',',')}</p>
                                <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                            </div>
                            <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full">{item.status}</span>
                        </div>
                    )) : (
                        <p className="text-sm text-gray-500 text-center py-8">Nenhum saque realizado ainda.</p>
                    )}
                </div>
            </div>
        </div>
    );
    
    const renderPurchaseConfirmation = () => {
        if (!selectedPackage) return null;
        return (
            <div className="p-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-600">
                    <div className="flex items-center space-x-3">
                        <AliiLogoIcon />
                        <div>
                            <p className="font-semibold">{selectedPackage.diamonds.toLocaleString('pt-BR')} Diamantes</p>
                            <p className="text-xs text-gray-400">Alii-Streamers Legais, Vibe!</p>
                        </div>
                    </div>
                    <p className="font-bold text-lg">R$ {selectedPackage.price.toFixed(2).replace('.', ',')}</p>
                </div>
                <div className="py-3 border-b border-gray-600 space-y-3">
                    <button onClick={() => setPurchaseView('select_payment')} className="w-full flex justify-between items-center text-left p-2 rounded-lg hover:bg-white/5">
                        <PaymentMethodDisplay methodId={selectedPaymentMethodId} methods={user.paymentMethods} />
                        <ArrowRightIcon />
                    </button>
                </div>
                <div className="pt-4">
                    <p className="text-xs text-gray-400">Toque em "Comprar" para concluir a compra. <span className="text-sky-400 cursor-pointer">Mais</span></p>
                    <button onClick={handleConfirmPurchase} disabled={isProcessing} className="w-full mt-3 bg-blue-600 text-white font-bold py-3 rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                        {isProcessing ? `Processando...` : 'Comprar'}
                    </button>
                </div>
            </div>
        )
    };
    
    const renderPaymentSelection = () => (
        <div className="flex flex-col h-full">
            <header className="flex items-center p-4 border-b border-gray-600 flex-shrink-0">
                <button type="button" onClick={() => setPurchaseView('main')}><ArrowLeftIcon/></button>
                <h3 className="text-lg font-bold mx-auto">Forma de Pagamento</h3>
                <div className="w-6"></div>
            </header>
            <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                <p className="text-xs font-bold text-gray-400 uppercase">Cartões salvos</p>
                {user.paymentMethods.map(method => (
                    method.type === 'credit_card' &&
                    <button key={method.id} onClick={() => { setSelectedPaymentMethodId(method.id); setPurchaseView('main'); }} className="w-full flex justify-between items-center text-left p-2 rounded-lg hover:bg-white/5">
                        <div className="flex items-center space-x-3">
                            <PaymentMethodIcon method={method} className="w-10 h-6 object-contain"/>
                            <p>{method.brand} •••• {method.last4}</p>
                        </div>
                        {selectedPaymentMethodId === method.id && <CheckIcon className="w-5 h-5 text-green-500"/>}
                    </button>
                ))}
                <div className="pt-2 border-t border-gray-700">
                    <p className="text-xs font-bold text-gray-400 uppercase pt-2">Outros</p>
                    <button onClick={() => { setSelectedPaymentMethodId('google_pay'); setPurchaseView('main'); }} className="w-full flex justify-between items-center text-left p-2 rounded-lg hover:bg-white/5">
                        <PaymentMethodDisplay methodId="google_pay" methods={[]} />
                        {selectedPaymentMethodId === 'google_pay' && <CheckIcon className="w-5 h-5 text-green-500"/>}
                    </button>
                     <button onClick={() => { setSelectedPaymentMethodId('mercado_pago'); setPurchaseView('main'); }} className="w-full flex justify-between items-center text-left p-2 rounded-lg hover:bg-white/5">
                        <PaymentMethodDisplay methodId="mercado_pago" methods={[]} />
                        {selectedPaymentMethodId === 'mercado_pago' && <CheckIcon className="w-5 h-5 text-green-500"/>}
                    </button>
                </div>
                 <div className="pt-2 border-t border-gray-700">
                    <button onClick={() => setPurchaseView('add_card')} className="w-full text-left p-2 rounded-lg text-sky-400 font-semibold hover:bg-white/5 mt-2">
                        Adicionar forma de pagamento
                    </button>
                </div>
            </div>
        </div>
    );

    const renderAddCardForm = () => (
        <form onSubmit={handleAddCard} className="flex flex-col h-full">
             <header className="flex items-center p-4 border-b border-gray-600 flex-shrink-0">
                <button type="button" onClick={() => setPurchaseView('select_payment')}><ArrowLeftIcon/></button>
                <h3 className="text-lg font-bold mx-auto">Adicionar Cartão</h3>
                <button type="submit" className="text-sky-400 font-bold px-2">Salvar</button>
            </header>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <div className="bg-[#1f1f1f] p-3 rounded-lg space-y-2">
                    <div className="relative border-b border-gray-500">
                        <div className="absolute left-2 top-1/2 -translate-y-1/2"><ChipIcon/></div>
                        <input type="text" name="number" placeholder="Número do cartão" required value={cardForm.number} onChange={handleCardFormChange} className="w-full bg-transparent p-2 pl-12 focus:outline-none"/>
                         <select name="brand" value={cardForm.brand} onChange={handleCardFormChange} className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent text-white focus:outline-none appearance-none pr-6" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em'}}>
                            <option value="Mastercard" className="bg-[#1f1f1f]">Mastercard</option>
                            <option value="Visa" className="bg-[#1f1f1f]">Visa</option>
                        </select>
                    </div>
                    <div className="flex space-x-2">
                         <input type="text" name="expiry" placeholder="MM/AA" required value={cardForm.expiry} onChange={handleCardFormChange} className="w-1/2 bg-transparent p-2 focus:outline-none border-r border-gray-500"/>
                         <input type="text" name="cvv" placeholder="CVV" required value={cardForm.cvv} onChange={handleCardFormChange} className="w-1/2 bg-transparent p-2 focus:outline-none"/>
                    </div>
                </div>
                 <input type="text" name="name" placeholder="Nome do titular do cartão" required value={cardForm.name} onChange={e => setCardForm({...cardForm, name: e.target.value})} className="w-full bg-[#1f1f1f] p-3 rounded-lg focus:outline-none"/>
                
                <div>
                     <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">Endereço de Faturamento</h4>
                        <button type="button" className="p-1"><PencilIcon className="w-4 h-4 text-gray-400"/></button>
                    </div>
                    <div className="bg-[#1f1f1f] rounded-lg divide-y divide-gray-700">
                        <input type="text" value={addressForm.name} onChange={e => setAddressForm({...addressForm, name: e.target.value})} placeholder="Nome" className="w-full bg-transparent p-3 focus:outline-none"/>
                        <input type="text" value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} placeholder="Rua" className="w-full bg-transparent p-3 focus:outline-none"/>
                        <div className="flex divide-x divide-gray-700">
                            <input type="text" value={addressForm.number} onChange={e => setAddressForm({...addressForm, number: e.target.value})} placeholder="Nº" className="w-1/3 bg-transparent p-3 focus:outline-none"/>
                            <input type="text" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} placeholder="Cidade" className="w-2/3 bg-transparent p-3 focus:outline-none"/>
                        </div>
                         <div className="flex divide-x divide-gray-700">
                            <input type="text" value={addressForm.cep} onChange={e => setAddressForm({...addressForm, cep: e.target.value})} placeholder="CEP" className="w-1/2 bg-transparent p-3 focus:outline-none"/>
                            <input type="text" value={addressForm.country} readOnly className="w-1/2 bg-transparent p-3 focus:outline-none text-gray-400"/>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );

    const PurchaseFlowModal = () => (
      <div className={`absolute bottom-0 left-0 right-0 bg-[#222222] text-white rounded-t-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.5)] transform transition-transform duration-300 ${selectedPackage ? 'translate-y-0' : 'translate-y-full'}`} onClick={e => e.stopPropagation()}>
          <div className="w-full h-2 flex justify-center items-center pt-5">
              <button onClick={handleClosePurchaseModal} className="w-12 h-1.5 bg-gray-500 rounded-full"></button>
          </div>
          <div className="max-h-[85vh] overflow-y-auto">
            {purchaseView === 'main' && renderPurchaseConfirmation()}
            {purchaseView === 'select_payment' && renderPaymentSelection()}
            {purchaseView === 'add_card' && renderAddCardForm()}
          </div>
      </div>
    );

    return (
        <div 
            className={`fixed inset-0 bg-black/60 z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
            onClick={onClose}
        >
            <div className="w-full h-full bg-[#111111] text-white flex flex-col transform transition-transform duration-300 md:max-w-md md:max-h-[90vh] md:rounded-2xl" onClick={(e) => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 flex-shrink-0">
                    <button onClick={onClose} className="p-2 text-gray-300"><ArrowLeftIcon/></button>
                    <div className="flex items-center space-x-8">
                       <button onClick={() => handleTabClick('buy')} className={`relative text-lg font-semibold pb-1 ${activeTab === 'buy' ? 'text-white' : 'text-gray-500'}`}>
                            Diamante
                            {activeTab === 'buy' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-white rounded-full"></div>}
                        </button>
                        <button onClick={() => handleTabClick('points')} className={`relative text-lg font-semibold pb-1 ${activeTab === 'points' ? 'text-white' : 'text-gray-500'}`}>
                            Pontos
                            {activeTab === 'points' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-white rounded-full"></div>}
                        </button>
                    </div>
                    <div className="w-10"></div>
                </header>
                <div className="flex-1 overflow-y-auto">
                    {activeTab === 'buy' ? renderBuyTab() : renderPointsTab()}
                </div>
            </div>

            <PurchaseFlowModal />
        </div>
    );
};

export { Wallet as CoinShop };
