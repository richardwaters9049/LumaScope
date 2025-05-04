'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import LumaLogo from '@/public/images/luma-logo-4.png';

const navLinks = [
    { name: 'Upload', key: 'upload' },
    { name: 'History', key: 'history' },
    { name: 'Datasets', key: 'datasets' },
    { name: 'Settings', key: 'settings' },
    { name: 'Logout', key: 'logout' },
] as const;

interface NavbarProps {
    activeView: 'upload' | 'history' | 'datasets' | 'settings';
    setActiveView: (view: 'upload' | 'history' | 'datasets' | 'settings') => void;
}

export function Navbar({ activeView, setActiveView }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [fullName, setFullName] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const name = localStorage.getItem('full_name');
        setFullName(name);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        toast.success('Goodbye! 👋', { duration: 1500 });
        router.push('/');
    };

    return (
        <motion.header
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 14 }}
            className="w-full fixed top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-950/70 shadow-md"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                {/* Logo & Welcome */}
                <div className="flex items-center justify-center gap-6 text-lg text-center px-4 tracking-widest">
                    <Image src={LumaLogo} alt="LumaScope Logo" width={60} height={60} priority />
                    <span className="text-2xl font-semibold text-blue-950 dark:text-white">LumaScope</span>
                    {fullName && (
                        <span className="font-semibold text-gray-700 dark:text-gray-300 hidden lg:inline">
                            Welcome, {fullName}
                        </span>
                    )}
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-8 text-lg tracking-widest nav-links">
                    {navLinks.map((link, index) => {
                        const isActive = activeView === link.key;
                        return (
                            <motion.div
                                key={link.key}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index, type: 'spring', stiffness: 100, damping: 20 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                {link.key === 'logout' ? (
                                    <button onClick={handleLogout} className={navLinkClass(false)}>
                                        {link.name}
                                        <Underline />
                                    </button>
                                ) : (
                                    <button onClick={() => setActiveView(link.key)} className={navLinkClass(isActive)}>
                                        {link.name}
                                        <Underline isActive={isActive} />
                                    </button>
                                )}
                            </motion.div>
                        );
                    })}
                </nav>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.nav
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                        className="overflow-hidden md:hidden bg-white/90 dark:bg-gray-950/90 backdrop-blur-md"
                    >
                        <div className="flex flex-col space-y-4 px-6 py-4">
                            {navLinks.map((link, index) => {
                                const isActive = activeView === link.key;
                                return (
                                    <motion.div
                                        key={link.key}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * index, type: 'spring', stiffness: 100, damping: 20 }}
                                    >
                                        {link.key === 'logout' ? (
                                            <button onClick={() => { setIsOpen(false); handleLogout(); }} className={navLinkClass(false)}>
                                                {link.name}
                                                <Underline />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    setActiveView(link.key);
                                                }}
                                                className={navLinkClass(isActive)}
                                            >
                                                {link.name}
                                                <Underline isActive={isActive} />
                                            </button>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </motion.header>
    );
}

// Styling helpers
function navLinkClass(isActive: boolean) {
    return `relative group font-semibold transition-all duration-300 ${isActive
        ? 'text-blue-600 dark:text-blue-400 drop-shadow-md'
        : 'text-gray-700 dark:text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:to-pink-400'
        }`;
}

function Underline({ isActive = false }: { isActive?: boolean }) {
    return (
        <span
            className={`absolute left-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-400 to-pink-400 transition-all ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
        ></span>
    );
}
