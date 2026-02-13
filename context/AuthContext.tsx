'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { Company } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    company: Company | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    company: null,
    loading: true,
    signOut: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // Fetch company data
                const q = query(collection(db, 'companies'), where('ownerUID', '==', firebaseUser.uid));

                // Listen for company data changes (live sync)
                const unsubCompany = onSnapshot(q, (snapshot) => {
                    if (!snapshot.empty) {
                        setCompany(snapshot.docs[0].data() as Company);
                    } else {
                        setCompany(null);
                        // If they are on a protected route but have no company, send to login
                        if (pathname.startsWith('/dashboard')) {
                            router.push('/auth/login');
                        }
                    }
                    setLoading(false);
                });

                return () => unsubCompany();
            } else {
                setCompany(null);
                setLoading(false);
                // If they are on a protected route, send to login
                if (pathname.startsWith('/dashboard')) {
                    router.push('/auth/login');
                }
            }
        });

        return () => unsubscribe();
    }, [pathname, router]);

    const signOutUser = async () => {
        await auth.signOut();
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, company, loading, signOut: signOutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
