'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Package, Tag, Hash, BadgeDollarSign, AlertTriangle, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Company, Product } from '@/lib/types';

interface AddProductDialogProps {
    company: Company;
    onClose: () => void;
    onSuccess: () => void;
    editProduct?: Product;
}

export function AddProductDialog({ company, onClose, onSuccess, editProduct }: AddProductDialogProps) {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [brands, setBrands] = useState<string[]>([]);
    const [newCategory, setNewCategory] = useState('');
    const [newBrand, setNewBrand] = useState('');
    const formatNumber = (value: string | number) => {
        if (!value && value !== 0) return '';
        const clean = value.toString().replace(/,/g, '');
        if (isNaN(Number(clean))) return value.toString();
        const parts = clean.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    };

    const [formData, setFormData] = useState({
        name: editProduct?.name || '',
        brand: editProduct?.brand || '',
        categoryId: editProduct?.categoryId || '',
        price: formatNumber(editProduct?.price || ''),
        purchaseCost: formatNumber(editProduct?.purchaseCost || ''),
        sku: editProduct?.sku || '',
        quantity: editProduct?.quantity.toString() || '',
        lowStockAlert: editProduct?.lowStockAlert.toString() || '5',
        note: editProduct?.note || ''
    });

    useEffect(() => {
        const fetchMetadata = async () => {
            // Fetch Categories
            const catSnap = await getDocs(query(collection(db, `companies/${company.companyRefId}/categories`)));
            setCategories(catSnap.docs.map(d => ({ id: d.id, name: d.data().name })).sort((a, b) => a.name.localeCompare(b.name)) // A → Z
            );

            // Fetch Brands from dedicated collection
            const brandSnap = await getDocs(query(collection(db, `companies/${company.companyRefId}/brands`)));
            // if (!brandSnap.empty) {
            //     setBrands(brandSnap.docs
            //         .map(d => d.data().name)
            //         .sort((a, b) => a.name.localeCompare(b.name)));
            // }
            if (!brandSnap.empty) {
                const brands = brandSnap.docs
                    .map(d => d.data().name)   // now it's ["Nike", "Apple", ...]
                    .sort((a, b) => a.localeCompare(b)); // compare strings directly

                setBrands(brands);
            }
            else {
                // Initial fallback: scan inventory once if brands collection is empty
                const invSnap = await getDocs(query(collection(db, `companies/${company.companyRefId}/inventory`)));
                const uniqueBrands = Array.from(new Set(invSnap.docs.map(d => d.data().brand).filter(Boolean)));
                setBrands(uniqueBrands as string[]);
            }
        };
        fetchMetadata();
    }, [company.companyRefId]);

    const handleFormattedChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const value = e.target.value;
        // Allow digits and max one dot
        const clean = value.replace(/,/g, '');
        if (/^\d*\.?\d*$/.test(clean)) {
            setFormData(p => ({ ...p, [field]: formatNumber(clean) }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let categoryId = formData.categoryId;
            let brandName = formData.brand;

            // Handle New Category Creation
            if (newCategory) {
                const catRef = await addDoc(collection(db, `companies/${company.companyRefId}/categories`), {
                    name: newCategory,
                    createdAt: Date.now()
                });
                categoryId = catRef.id;
            }

            // Handle New Brand Creation
            if (newBrand) {
                brandName = newBrand;
                // Check if brand already exists to avoid duplicates
                if (!brands.includes(newBrand)) {
                    await addDoc(collection(db, `companies/${company.companyRefId}/brands`), {
                        name: newBrand,
                        createdAt: Date.now()
                    });
                }
            }

            const productData: any = {
                name: formData.name,
                brand: brandName,
                categoryId: categoryId,
                price: parseFloat(formData.price.replace(/,/g, '')) || 0,
                purchaseCost: parseFloat(formData.purchaseCost.replace(/,/g, '')) || 0,
                sku: formData.sku,
                quantity: parseInt(formData.quantity.replace(/,/g, '')) || 0, // Handle quantity too just in case, though it's number type input usually
                lowStockAlert: parseInt(formData.lowStockAlert),
                note: formData.note,
                updatedAt: Date.now(),
                searchTags: [
                    ...formData.name.toLowerCase().split(' '),
                    ...(brandName ? brandName.toLowerCase().split(' ') : [])
                ].filter(Boolean)
            };

            if (editProduct) {
                await updateDoc(doc(db, `companies/${company.companyRefId}/inventory`, editProduct.id), productData);
            } else {
                productData.createdAt = Date.now();
                productData.companyRefId = company.companyRefId;
                productData.createdBy = company.ownerUID;
                productData.isActive = true;
                await addDoc(collection(db, `companies/${company.companyRefId}/inventory`), productData);
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alert('Failed to save product. Please try again.');
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
                className="relative w-full max-w-xl bg-card border border-border shadow-2xl rounded-[32px] overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="p-8 border-b border-border flex items-center justify-between bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            {editProduct ? <Tag className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">Inventory Management</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors">
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6 col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Product Name</label>
                                <div className="relative group">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                                    <input
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                        className="w-full bg-muted/50 hover:bg-muted focus:bg-background border border-border rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/40 uppercase tracking-widest text-foreground"
                                        placeholder="e.g. iPhone 15 Pro"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Brand</label>
                                <div className="relative group space-y-2">
                                    <div className="relative">
                                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                                        <select
                                            value={formData.brand}
                                            onChange={e => setFormData(p => ({ ...p, brand: e.target.value }))}
                                            className="w-full bg-muted/50 hover:bg-muted focus:bg-background border border-border rounded-2xl py-4 pl-12 pr-10 text-xs font-bold focus:outline-none focus:border-primary transition-all appearance-none uppercase tracking-widest text-foreground"
                                        >
                                            <option value="">Existing Brand</option>
                                            {brands.map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                    </div>
                                    <input
                                        value={newBrand}
                                        onChange={e => setNewBrand(e.target.value)}
                                        className="w-full bg-muted/50 hover:bg-muted focus:bg-background border border-border rounded-2xl py-4 px-4 text-xs font-bold focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/40 uppercase tracking-widest text-foreground"
                                        placeholder="Or type new brand..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Category</label>
                            <div className="relative group space-y-2">
                                <div className="relative">
                                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                                    <select
                                        value={formData.categoryId}
                                        onChange={e => setFormData(p => ({ ...p, categoryId: e.target.value }))}
                                        className="w-full bg-muted/50 hover:bg-muted focus:bg-background border border-border rounded-2xl py-4 pl-12 pr-10 text-xs font-bold focus:outline-none focus:border-primary transition-all appearance-none uppercase tracking-widest text-foreground"
                                    >
                                        <option value="">Existing Category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <input
                                    value={newCategory}
                                    onChange={e => setNewCategory(e.target.value)}
                                    className="w-full bg-muted/50 hover:bg-muted focus:bg-background border border-border rounded-2xl py-4 px-4 text-xs font-bold focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/40 uppercase tracking-widest text-foreground"
                                    placeholder="Or type new category..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">SKU / Code</label>
                            <div className="relative group">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                                <input
                                    value={formData.sku}
                                    onChange={e => setFormData(p => ({ ...p, sku: e.target.value }))}
                                    className="w-full bg-muted/50 hover:bg-muted focus:bg-background border border-border rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/40 uppercase tracking-widest font-mono text-foreground"
                                    placeholder="REV-001"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Selling Price ({company.currency})</label>
                            <div className="relative group">
                                <BadgeDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                                <input
                                    required
                                    type="text"
                                    inputMode="decimal"
                                    value={formData.price}
                                    onChange={e => handleFormattedChange(e, 'price')}
                                    className="w-full bg-muted/50 hover:bg-muted focus:bg-background border border-border rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/40 uppercase tracking-widest text-foreground"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Purchase Cost ({company.currency})</label>
                            <div className="relative group">
                                <BadgeDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={formData.purchaseCost}
                                    onChange={e => handleFormattedChange(e, 'purchaseCost')}
                                    className="w-full bg-muted/50 hover:bg-muted focus:bg-background border border-border rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/40 uppercase tracking-widest text-foreground"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Current Stock</label>
                            <div className="relative group">
                                <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                                <input
                                    required
                                    type="number"
                                    value={formData.quantity}
                                    onChange={e => setFormData(p => ({ ...p, quantity: e.target.value }))}
                                    className="w-full bg-muted/50 hover:bg-muted focus:bg-background border border-border rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/40 uppercase tracking-widest text-foreground"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Low Stock Alert</label>
                            <div className="relative group">
                                <AlertTriangle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                                <input
                                    required
                                    type="number"
                                    value={formData.lowStockAlert}
                                    onChange={e => setFormData(p => ({ ...p, lowStockAlert: e.target.value }))}
                                    className="w-full bg-muted/50 hover:bg-muted focus:bg-background border border-border rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/40 uppercase tracking-widest text-foreground"
                                    placeholder="5"
                                />
                            </div>
                        </div>

                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-primary-foreground py-5 rounded-[20px] text-xs font-black uppercase tracking-[0.3em] hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                        >
                            {loading ? 'Saving Changes...' : editProduct ? 'Update Product' : 'Add to Inventory'}
                        </button>
                    </div>

                </form>
            </motion.div>
        </div>
    );
}
