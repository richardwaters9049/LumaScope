'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import LumaLogo from '@/public/images/luma-logo-4.png';

type NavView = 'upload' | 'history' | 'datasets' | 'settings';
type NavLink = 
  | { name: string; key: NavView }
  | { name: string; key: 'logout' };

const navLinks: NavLink[] = [
    { name: 'Upload', key: 'upload' },
    { name: 'History', key: 'history' },
    { name: 'Datasets', key: 'datasets' },
    { name: 'Settings', key: 'settings' },
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
            // Call the logout API
            await fetch('/api/auth/logout', {
                method: 'POST',
            });
            
            // Clear local storage
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            
            // Show success message and redirect
            toast.success('Logged out successfully!', { duration: 1500 });
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Failed to log out. Please try again.');
        }
    };

    const handleNavClick = (key: string) => {
        if (key === 'logout') {
            handleLogout();
        } else if (['upload', 'history', 'datasets', 'settings'].includes(key)) {
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
                <div className="flex items-center justify-center gap-6 text-lg text-center px-4 tracking-widest">
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
                            {user.role && (
                                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                    {user.role}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-8 text-lg tracking-widest nav-links">
                    <ul>
                        {navLinks.map((link) => {
                        // Hide settings for non-admin users
                        if (link.key === 'settings' && user?.role !== 'admin') {
                            return null;
                        }
                        
                        const isActive = link.key !== 'logout' && activeView === link.key;
                        const isLogout = link.key === 'logout';
                        
                        return (
                            <li key={link.key}>
                                <button
                                    onClick={() => handleNavClick(link.key)}
                                    className={`${navLinkClass(isActive)} ${
                                        isLogout ? 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300' : ''
                                    }`}
                                >
                                    {link.name}
                                    {isActive && <Underline isActive />}
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
                                // Hide settings for non-admin users
                                if (link.key === 'settings' && user?.role !== 'admin') {
                                    return null;
                                }
                                
                                const isActive = link.key !== 'logout' && activeView === link.key;
                                const isLogout = link.key === 'logout';
                                
                                return (
                                    <motion.div
                                        key={link.key}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * navLinks.indexOf(link), type: 'spring', stiffness: 100, damping: 20 }}
                                    >
                                        <button
                                            onClick={() => {
                                                setIsOpen(false);
                                                handleNavClick(link.key);
                                            }}
                                            className={`${navLinkClass(isActive)} ${
                                                isLogout ? 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300' : ''
                                            }`}
                                        >
                                            {link.name}
                                            {isActive && <Underline isActive />}
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
