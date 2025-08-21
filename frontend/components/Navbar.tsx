'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import LumaLogo from '@/public/images/luma-logo-4.png';

type NavView = 'upload' | 'history';
type NavLink = { name: string; key: NavView } | { name: 'Logout'; key: 'logout' };

const navLinks: NavLink[] = [
    { name: 'Upload', key: 'upload' },
    { name: 'History', key: 'history' },
    { name: 'Logout', key: 'logout' },
];

interface User {
    id: string;
    email: string;
    fullName: string;
    role?: string;
}

interface NavbarProps {
    activeView: NavView;
    setActiveView: (view: NavView) => void;
    user: User | null;
}

export function Navbar({ activeView, setActiveView, user }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            toast.success('Logged out successfully!', { duration: 1500 });
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Failed to log out. Please try again.');
        }
    };

    const handleNavClick = (key: string) => {
        if (key === 'logout') {
            handleLogout();
        } else if (['upload', 'history'].includes(key)) {
            setActiveView(key as NavView);
        }
        setIsOpen(false);
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
                <div className="flex items-center gap-6 text-lg px-4 tracking-widest">
                    <Image
                        src={LumaLogo}
                        alt="LumaScope Logo"
                        className="h-12 w-auto cursor-pointer"
                        priority
                        onClick={() => setActiveView('upload')}
                    />
                    {user?.fullName && (
                        <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="hidden lg:inline">Welcome back,</span>
                            <span className="font-medium text-gray-800 dark:text-white truncate max-w-[150px]">
                                {user.fullName}
                            </span>
                        </div>
                    )}
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-8 text-lg tracking-widest">
                    <ul className="flex gap-6">
                        {navLinks.map((link) => {
                            const isActive = link.key !== 'logout' && activeView === link.key;
                            const isLogout = link.key === 'logout';
                            return (
                                <li key={link.key}>
                                    <button
                                        onClick={() => handleNavClick(link.key)}
                                        className={`${navLinkClass(isActive)} ${isLogout
                                            ? 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                                            : ''
                                            }`}
                                    >
                                        {link.name}
                                        {isActive && <Underline />}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
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
                            {navLinks.map((link) => {
                                const isActive = link.key !== 'logout' && activeView === link.key;
                                const isLogout = link.key === 'logout';
                                return (
                                    <motion.div
                                        key={link.key}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: 0.1 * navLinks.indexOf(link),
                                            type: 'spring',
                                            stiffness: 100,
                                            damping: 20,
                                        }}
                                    >
                                        <button
                                            onClick={() => handleNavClick(link.key)}
                                            className={`${navLinkClass(isActive)} ${isLogout
                                                ? 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                                                : ''
                                                }`}
                                        >
                                            {link.name}
                                            {isActive && <Underline />}
                                        </button>
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

// Helpers
function navLinkClass(isActive: boolean) {
    return `relative group font-semibold transition-all duration-300 ${isActive
        ? 'text-blue-600 dark:text-blue-400 drop-shadow-md'
        : 'text-gray-700 dark:text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:to-pink-400'
        }`;
}

function Underline() {
    return (
        <span className="absolute left-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-400 to-pink-400 w-full transition-all group-hover:w-full"></span>
    );
}
