'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, increment } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Package, Search, ShoppingCart, Trash2, Check, Minus, ScanBarcode, CreditCard, ShoppingBag } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import type { Company, Product } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

interface CreateSaleDialogProps {
    company: Company;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateSaleDialog({ company, onClose, onSuccess }: CreateSaleDialogProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState('');
    const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Load products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const q = query(
                    collection(db, `companies/${company.companyRefId}/inventory`),
                    where('isActive', '==', true)
                );
                const snapshot = await getDocs(q);
                setProducts(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Product)));
            } catch (err) {
                console.error("Error fetching products", err);
            } finally {
                setProductsLoading(false);
            }
        };
        fetchProducts();
    }, [company.companyRefId]);

    // Focus search on mount
    useEffect(() => {
        setTimeout(() => searchInputRef.current?.focus(), 100);
    }, []);

    const filteredProducts = useMemo(() => {
        if (!search) return [];
        const lower = search.toLowerCase();
        return products.filter(p =>
            p.name.toLowerCase().includes(lower) ||
            p.sku?.toLowerCase().includes(lower) ||
            p.brand?.toLowerCase().includes(lower)
        ).slice(0, 5); // Limit results for cleaner UI
    }, [products, search]);

    // Handle "Scan" - if exact SKU match, add to cart immediately
    useEffect(() => {
        if (!search) return;
        const exactMatch = products.find(p => p.sku?.toLowerCase() === search.toLowerCase());
        if (exactMatch) {
            addToCart(exactMatch);
            setSearch('');
        }
    }, [search, products]);

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.product.id === productId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setLoading(true);

        try {
            const batch = [];

            // Process each item
            for (const item of cart) {
                // 1. Create Sale Record
                const saleData = {
                    productId: item.product.id,
                    workerId: user?.uid || 'admin', // Use current user ID or fallback
                    companyRefId: company.companyRefId,
                    quantitySold: item.quantity,
                    priceAtSale: item.product.price,
                    purchaseCostAtSale: item.product.purchaseCost || 0,
                    status: 'approved', // Admin sales are auto-approved
                    createdAt: Date.now(),
                    approvedAt: Date.now(),
                    approvedBy: user?.uid,
                    soldFor: item.product.price,
                    branchId: 'main' // Default to main for now
                };

                await addDoc(collection(db, `companies/${company.companyRefId}/sales_log`), saleData);

                // 2. Update Inventory
                const productRef = doc(db, `companies/${company.companyRefId}/inventory`, item.product.id);
                await updateDoc(productRef, {
                    quantity: increment(-item.quantity),
                    updatedAt: Date.now()
                });
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error("Checkout failed:", err);
            alert("Failed to process transaction. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />

            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-4xl bg-card border border-border shadow-2xl rounded-[32px] overflow-hidden flex flex-col md:flex-row h-[80vh] md:h-[600px]"
            >
                {/* Left Side: Product Search & Selection */}
                <div className="flex-1 p-8 flex flex-col border-b md:border-b-0 md:border-r border-border bg-muted/30">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <ScanBarcode className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">New Transaction</h3>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">Scan or search items</p>
                        </div>
                    </div>

                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            ref={searchInputRef}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/40 uppercase tracking-widest text-foreground shadow-sm"
                            placeholder="Type Name or Scan SKU..."
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar -mr-4 pr-4 space-y-3">
                        {productsLoading ? (
                            <div className="text-center py-20 opacity-50">Loading inventory...</div>
                        ) : search && filteredProducts.length === 0 ? (
                            <div className="text-center py-20 opacity-50 text-xs font-bold uppercase tracking-widest">No products found</div>
                        ) : (
                            (search ? filteredProducts : []).map(product => (
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className="w-full text-left p-4 bg-background border border-border rounded-2xl hover:border-primary/50 hover:shadow-md transition-all group flex items-center gap-4"
                                >
                                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground/60 group-hover:text-primary transition-colors">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-black uppercase tracking-wider text-foreground">{product.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[8px] font-bold bg-muted text-muted-foreground px-1.5 py-0.5 rounded uppercase">{product.sku || 'No SKU'}</span>
                                            {product.quantity <= 0 && <span className="text-[8px] font-bold text-destructive uppercase">Out of Stock</span>}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-foreground font-mono">{formatCurrency(product.price, company.currency)}</p>
                                        <p className="text-[8px] font-bold text-muted-foreground mt-0.5">{product.quantity} in stock</p>
                                    </div>
                                    <Plus className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                                </motion.button>
                            ))
                        )}
                        {!search && (
                            <div className="flex flex-col items-center justify-center h-40 opacity-40">
                                <Search className="w-12 h-12 mb-4 text-slate-400" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Start typing to search</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Cart / Checkout */}
                <div className="w-full md:w-[400px] bg-card p-8 flex flex-col relative">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-muted rounded-xl transition-colors">
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>

                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-6 flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Current Sale
                    </h3>

                    <div className="flex-1 overflow-y-auto custom-scrollbar -mr-4 pr-4 space-y-4">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full opacity-40 text-center">
                                <ShoppingBag className="w-16 h-16 mb-4 text-slate-300" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cart is empty</p>
                                <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mt-2">Add items from the left</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.product.id} className="flex gap-4 items-start group">
                                    <div className="flex-1">
                                        <p className="text-xs font-black uppercase tracking-wider text-foreground line-clamp-1">{item.product.name}</p>
                                        <p className="text-[10px] font-black text-muted-foreground font-mono mt-0.5">{formatCurrency(item.product.price, company.currency)}</p>
                                    </div>

                                    <div className="flex items-center gap-3 bg-muted rounded-lg p-1">
                                        <button onClick={() => updateQuantity(item.product.id, -1)} className="w-6 h-6 flex items-center justify-center hover:bg-background rounded shadow-sm transition-all text-foreground disabled:opacity-50">
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.product.id, 1)} className="w-6 h-6 flex items-center justify-center hover:bg-background rounded shadow-sm transition-all text-foreground">
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>

                                    <button onClick={() => removeFromCart(item.product.id)} className="p-1.5 hover:bg-destructive/10 text-muted-foreground/40 hover:text-destructive rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-border space-y-4">
                        <div className="flex justify-between items-end">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Amount</p>
                            <p className="text-2xl font-black text-foreground tracking-tighter font-mono">{formatCurrency(cartTotal, company.currency)}</p>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={cart.length === 0 || loading}
                            className="w-full bg-primary text-primary-foreground py-5 rounded-[20px] text-xs font-black uppercase tracking-[0.3em] hover:opacity-90 transition-all disabled:opacity-50 shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                'Processing...'
                            ) : (
                                <>
                                    <CreditCard className="w-4 h-4" />
                                    Complete Sale
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
