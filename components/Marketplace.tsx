
import React, { useState } from 'react';
import { LanguageCode, MarketplaceItem, UserProfile } from '../types';
import { getTranslation } from '../utils/translations';
import { ShoppingBag, Star, Download, ShieldCheck, TrendingUp, Cpu, Server, BookOpen, BarChart2, FileText, Plus, Upload, X, CheckCircle, Loader2 } from 'lucide-react';

interface Props {
    lang: LanguageCode;
    items: MarketplaceItem[];
    user: UserProfile | null;
    onUpload: (item: Omit<MarketplaceItem, 'id' | 'sales' | 'rating' | 'status'>) => void;
    onPurchase: (itemId: string, price: number) => void;
}

export const Marketplace: React.FC<Props> = ({ lang, items, user, onUpload, onPurchase }) => {
    const t = (key: string) => getTranslation(lang, key);
    const [filter, setFilter] = useState('All');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'browse' | 'my_products'>('browse');
    const [purchasingId, setPurchasingId] = useState<string | null>(null);

    // Upload Form State
    const [uploadForm, setUploadForm] = useState({
        title: '',
        category: 'Indicator' as MarketplaceItem['category'],
        price: '',
        description: '',
        fileType: 'zip' as MarketplaceItem['fileType'],
    });

    const getIcon = (cat: string) => {
        switch(cat) {
            case 'Indicator': return TrendingUp;
            case 'Strategy': return Cpu;
            case 'VPS': return Server;
            case 'Course': return BookOpen;
            case 'Book': return FileText;
            case 'Analytics': return BarChart2;
            default: return Star;
        }
    };

    const handleUploadSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpload({
            title: uploadForm.title,
            category: uploadForm.category,
            price: parseFloat(uploadForm.price) || 0,
            description: uploadForm.description,
            author: user?.name || 'Anonymous',
            sellerId: user?.id,
            fileType: uploadForm.fileType,
            uploadDate: new Date().toISOString().split('T')[0],
        });
        setIsUploadModalOpen(false);
        // Reset form
        setUploadForm({ title: '', category: 'Indicator', price: '', description: '', fileType: 'zip' });
    };

    const handlePurchase = (item: MarketplaceItem) => {
        setPurchasingId(item.id);
        setTimeout(() => {
            onPurchase(item.id, item.price);
            setPurchasingId(null);
            alert(`Successfully purchased ${item.title}! Download enabled.`);
        }, 1500);
    };

    // Filter logic
    const visibleItems = items.filter(item => {
        if (viewMode === 'my_products') {
            return item.sellerId === user?.id;
        }
        return item.status === 'APPROVED' && (filter === 'All' || item.category === filter);
    });

    return (
        <div className="flex flex-col h-full space-y-4 relative">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-terminal-panel to-terminal-bg border border-terminal-border rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-terminal-text tracking-tight mb-2">BAYANAT <span className="text-terminal-accent">MARKET</span></h2>
                    <p className="text-sm text-terminal-muted max-w-lg">
                        The world's first dedicated marketplace for professional traders. Indicators, Algorithms, VPS, Education, Books & Analytics in one secure ecosystem.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {user?.isSeller ? (
                        <button 
                            onClick={() => setIsUploadModalOpen(true)}
                            className="bg-terminal-accent text-black px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-amber-400 transition-colors shadow-lg shadow-terminal-accent/20"
                        >
                            <Upload size={16} /> Upload Product
                        </button>
                    ) : (
                        <div className="px-4 py-2 bg-terminal-bg border border-dashed border-terminal-border rounded-lg text-xs text-terminal-muted">
                            Become a seller? Contact Admin.
                        </div>
                    )}
                    
                    <div className="hidden md:flex items-center gap-4 border-l border-terminal-border pl-4">
                        <div className="text-center">
                            <div className="text-xl font-bold text-terminal-text">{items.filter(i => i.status === 'APPROVED').length}</div>
                            <div className="text-[10px] text-terminal-muted uppercase">Products</div>
                        </div>
                        <div className="w-[1px] h-8 bg-terminal-border"></div>
                        <div className="text-center">
                            <div className="text-xl font-bold text-terminal-text">$1.2M</div>
                            <div className="text-[10px] text-terminal-muted uppercase">Volume</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center">
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar flex-1">
                    {['All', 'Indicator', 'Strategy', 'Analytics', 'Book', 'VPS', 'Course'].map(cat => (
                        <button 
                            key={cat}
                            onClick={() => { setFilter(cat); setViewMode('browse'); }}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                filter === cat && viewMode === 'browse'
                                ? 'bg-terminal-text text-terminal-bg' 
                                : 'bg-terminal-panel text-terminal-muted border border-terminal-border hover:border-terminal-text'
                            }`}
                        >
                            {cat === 'Book' ? t('books') : cat === 'Analytics' ? t('analytics') : cat}
                        </button>
                    ))}
                </div>
                {user?.isSeller && (
                    <button 
                        onClick={() => setViewMode('my_products')}
                        className={`ml-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                            viewMode === 'my_products'
                            ? 'bg-blue-600 text-white' 
                            : 'bg-terminal-panel text-terminal-muted border border-terminal-border'
                        }`}
                    >
                        <Server size={14} /> My Products
                    </button>
                )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto custom-scrollbar pb-4">
                {visibleItems.map(item => {
                    const Icon = getIcon(item.category);
                    return (
                        <div key={item.id} className="bg-terminal-panel border border-terminal-border rounded-xl p-4 flex flex-col hover:shadow-xl transition-all group hover:-translate-y-1 relative overflow-hidden">
                            {viewMode === 'my_products' && (
                                <div className={`absolute top-0 right-0 px-3 py-1 text-[9px] font-bold rounded-bl-lg ${
                                    item.status === 'APPROVED' ? 'bg-green-500/20 text-green-500' :
                                    item.status === 'REJECTED' ? 'bg-red-500/20 text-red-500' :
                                    'bg-yellow-500/20 text-yellow-500'
                                }`}>
                                    {item.status}
                                </div>
                            )}
                            
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 bg-terminal-bg rounded-lg flex items-center justify-center text-terminal-accent shadow-sm group-hover:bg-terminal-accent group-hover:text-black transition-colors">
                                    <Icon size={20} />
                                </div>
                                {item.price === 0 ? (
                                    <span className="bg-green-500/20 text-green-500 text-[10px] font-bold px-2 py-1 rounded">FREE</span>
                                ) : (
                                    <span className="bg-terminal-bg text-terminal-text text-xs font-bold px-2 py-1 rounded border border-terminal-border">${item.price}</span>
                                )}
                            </div>
                            
                            <h3 className="font-bold text-sm text-terminal-text mb-1 line-clamp-1">{item.title}</h3>
                            <div className="text-[10px] text-terminal-muted flex items-center gap-1 mb-3">
                                <span>by {item.author}</span>
                                {item.author.includes('Bayanat') && <ShieldCheck size={10} className="text-blue-500" />}
                            </div>
                            
                            <p className="text-[10px] text-terminal-muted line-clamp-2 mb-3 h-8">
                                {item.description || 'Professional trading tool for enhanced market analysis.'}
                            </p>

                            <div className="mt-auto pt-3 border-t border-terminal-border flex items-center justify-between">
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <Star size={10} fill="currentColor" />
                                    <span className="text-xs font-bold text-terminal-text">{item.rating}</span>
                                    <span className="text-[10px] text-terminal-muted">({item.sales})</span>
                                </div>
                                
                                {viewMode === 'browse' && (
                                    <button 
                                        onClick={() => handlePurchase(item)}
                                        disabled={purchasingId === item.id}
                                        className="text-[10px] font-bold bg-terminal-bg border border-terminal-border hover:bg-terminal-accent hover:text-black hover:border-terminal-accent px-3 py-1.5 rounded transition-all flex items-center gap-1"
                                    >
                                        {purchasingId === item.id ? <Loader2 size={12} className="animate-spin" /> : <ShoppingBag size={12} />}
                                        {item.price === 0 ? 'Download' : 'Buy'}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
                {visibleItems.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-terminal-muted">
                        <ShoppingBag size={48} className="opacity-20 mb-2" />
                        <p>No items found in this category.</p>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
                    <div className="bg-terminal-panel border border-terminal-border w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="p-4 border-b border-terminal-border flex justify-between items-center bg-terminal-bg">
                            <h3 className="font-bold text-lg text-terminal-text flex items-center gap-2">
                                <Upload size={20} className="text-terminal-accent" /> Upload Product
                            </h3>
                            <button onClick={() => setIsUploadModalOpen(false)} className="text-terminal-muted hover:text-white"><X size={20} /></button>
                        </div>
                        
                        <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-terminal-muted uppercase block mb-1">Product Title</label>
                                <input 
                                    required
                                    value={uploadForm.title}
                                    onChange={e => setUploadForm({...uploadForm, title: e.target.value})}
                                    className="w-full bg-terminal-bg border border-terminal-border rounded p-2 text-sm text-white outline-none focus:border-terminal-accent"
                                    placeholder="e.g. Super Trend Indicator V2"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-terminal-muted uppercase block mb-1">Category</label>
                                    <select 
                                        value={uploadForm.category}
                                        onChange={e => setUploadForm({...uploadForm, category: e.target.value as any})}
                                        className="w-full bg-terminal-bg border border-terminal-border rounded p-2 text-sm text-white outline-none focus:border-terminal-accent"
                                    >
                                        {['Indicator', 'Strategy', 'Analytics', 'Book', 'VPS', 'Course'].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-terminal-muted uppercase block mb-1">Price (USD)</label>
                                    <input 
                                        type="number"
                                        min="0"
                                        value={uploadForm.price}
                                        onChange={e => setUploadForm({...uploadForm, price: e.target.value})}
                                        className="w-full bg-terminal-bg border border-terminal-border rounded p-2 text-sm text-white outline-none focus:border-terminal-accent"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-terminal-muted uppercase block mb-1">Description</label>
                                <textarea 
                                    required
                                    value={uploadForm.description}
                                    onChange={e => setUploadForm({...uploadForm, description: e.target.value})}
                                    className="w-full bg-terminal-bg border border-terminal-border rounded p-2 text-sm text-white outline-none focus:border-terminal-accent h-24 resize-none"
                                    placeholder="Describe your product features..."
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-terminal-muted uppercase block mb-1">File Upload</label>
                                <div className="border-2 border-dashed border-terminal-border rounded-lg p-6 flex flex-col items-center justify-center text-terminal-muted hover:border-terminal-accent hover:text-terminal-accent transition-colors cursor-pointer">
                                    <FileText size={32} className="mb-2" />
                                    <span className="text-xs font-bold">Click to select file (ZIP, EX4, PDF)</span>
                                    <span className="text-[10px] opacity-70 mt-1">Max size 50MB</span>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button type="submit" className="w-full bg-terminal-accent text-black font-bold py-3 rounded-lg hover:bg-amber-400 transition-colors">
                                    Submit for Approval
                                </button>
                                <p className="text-center text-[10px] text-terminal-muted mt-2">
                                    Your product will be reviewed by admins before listing.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
