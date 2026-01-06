import React from 'react';
import { Icons } from './Icons';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PRICING_TIERS = [
    {
        id: 'STARTER',
        name: 'Starter Pack',
        credits: 250,
        price: 19.90,
        features: ['Ideal para iniciantes', 'Gere ~250 imagens', 'Acesso a todas as ferramentas'],
        highlight: false,
        color: 'border-neutral-700',
        link: 'https://pay.kiwify.com.br/xkMQJfr'
    },
    {
        id: 'PRO',
        name: 'Pro Creator',
        credits: 750,
        price: 49.90,
        features: ['Para uso frequente', 'Melhor Custo-Benefício', 'Suporte Prioritário'],
        highlight: true,
        color: 'border-neon shadow-[0_0_30px_rgba(255,95,0,0.15)]',
        link: 'https://pay.kiwify.com.br/IgcHt7I'
    },
    {
        id: 'ELITE',
        name: 'Elite Studio',
        credits: 1800,
        price: 99.90,
        features: ['Volume Massivo', 'Para Agências/Power Users', 'Acesso Antecipado a Features'],
        highlight: false,
        color: 'border-neutral-700',
        link: 'https://pay.kiwify.com.br/KPOP4Nq'
    }
];

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handlePurchase = (link?: string) => {
        if (link) {
            window.open(link, '_blank');
        } else {
            alert("Link de checkout não configurado.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-base-black border border-neutral-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-base-card/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neon/10 rounded-lg flex items-center justify-center">
                            <Icons.CreditCard className="w-5 h-5 text-neon" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Recarregar Créditos</h2>
                            <p className="text-xs text-neutral-500">Escolha o pacote ideal para sua necessidade criativa.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors">
                        <Icons.X className="w-4 h-4" />
                    </button>
                </div>

                {/* Tiers Grid */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    {/* Background Gradients */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-neon/5 blur-[100px] pointer-events-none rounded-full" />

                    {PRICING_TIERS.map((tier) => (
                        <div
                            key={tier.id}
                            className={`
                                relative bg-base-card rounded-xl p-6 border flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-xl
                                ${tier.highlight ? `${tier.color} bg-neutral-900/80 transform scale-105 z-10` : `${tier.color} bg-neutral-900/40 hover:border-neutral-500`}
                            `}
                        >
                            {tier.highlight && (
                                <div className="absolute -top-3 bg-neon text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                    Recomendado
                                </div>
                            )}

                            <h3 className="text-lg font-bold text-white mb-1">{tier.name}</h3>
                            <div className="text-3xl font-bold text-white mb-1 flex items-baseline justify-center gap-1">
                                <span className="text-sm text-neutral-500 font-normal">R$</span>
                                {tier.price.toFixed(2).replace('.', ',')}
                            </div>
                            <div className="text-neon font-bold text-sm mb-6 flex items-center gap-1 bg-neon/10 px-3 py-1 rounded-full border border-neon/20">
                                <Icons.Zap className="w-3 h-3" /> {tier.credits} Créditos
                            </div>

                            <ul className="space-y-3 mb-8 w-full">
                                {tier.features.map((feat, i) => (
                                    <li key={i} className="text-xs text-neutral-400 flex items-center justify-center gap-2">
                                        <Icons.Check className="w-3 h-3 text-neon" /> {feat}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handlePurchase(tier.link)}
                                className={`
                                    w-full py-3 rounded-lg font-bold text-sm transition-all mt-auto
                                    ${tier.highlight
                                        ? 'bg-neon hover:bg-neon-light text-black shadow-[0_0_15px_rgba(255,95,0,0.3)]'
                                        : 'bg-neutral-800 hover:bg-white hover:text-black text-white'}
                                `}
                            >
                                Comprar Agora
                            </button>
                        </div>
                    ))}
                </div>

                {/* Footer Info */}
                <div className="bg-neutral-900/50 p-4 border-t border-neutral-800 text-center">
                    <p className="text-[10px] text-neutral-600 flex items-center justify-center gap-2">
                        <Icons.Shield className="w-3 h-3" /> Pagamento seguro via Stripe. Os créditos nunca expiram.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default PricingModal;
