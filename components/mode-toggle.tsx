'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export function ModeToggle() {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="flex bg-secondary/50 p-1 rounded-xl w-[100px] h-[36px]" />
        );
    }

    return (
        <div className="flex bg-secondary/50 p-1 rounded-xl">
            {[
                { id: 'light', icon: Sun },
                { id: 'dark', icon: Moon },
                { id: 'system', icon: Monitor },
            ].map((t) => (
                <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={cn(
                        "p-1.5 rounded-lg transition-all",
                        theme === t.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                    title={t.id.charAt(0).toUpperCase() + t.id.slice(1)}
                >
                    <t.icon className="w-3.5 h-3.5" />
                </button>
            ))}
        </div>
    );
}
