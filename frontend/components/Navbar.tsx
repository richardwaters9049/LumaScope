'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const navLinks = [
    { name: 'History', href: '/history' },
    { name: 'Datasets', href: '/datasets' },
    { name: 'Upload', href: '/upload' },
    { name: 'Settings', href: '/settings' },
    { name: 'Logout', href: '/logout' },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [fullName, setFullName] = useState<string | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const name = localStorage.getItem("full_name");
        setFullName(name);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('token');
        localStorage.removeItem('full_name');
        toast.success('Goodbye! 👋', {
            duration: 1500,
        });
        router.push('/');
    };

    return (
        <motion.header
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                type: "spring",
                stiffness: 100,
                damping: 14,
            }}
            className="w-full fixed top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-950/70 shadow-md"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                    >
                        LumaScope
                    </Link>
                    {fullName && (
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Welcome, {fullName}
                        </span>
                    )}
                </div>

                {/* Desktop links */}
                <nav className="hidden md:flex space-x-8">
                    {navLinks.map((link, index) => {
                        const isActive = pathname === link.href;
                        return (
                            <motion.div
                                key={link.name}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.1 * index,
                                    type: 'spring',
                                    stiffness: 100,
                                    damping: 20,
                                }}
                                whileHover={{ scale: 1.05 }}
                            >
                                {link.name === 'Logout' ? (
                                    <button
                                        onClick={handleLogout}
                                        className="cursor-pointer relative group font-semibold transition-all duration-300 text-gray-700 dark:text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:to-pink-400"
                                    >
                                        {link.name}
                                        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-pink-400 transition-all group-hover:w-full"></span>
                                    </button>
                                ) : (
                                    <Link
                                        href={link.href}
                                        className={`relative group font-semibold transition-all duration-300 ${isActive
                                            ? 'text-blue-600 dark:text-blue-400 drop-shadow-md'
                                            : 'text-gray-700 dark:text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:to-pink-400'
                                            }`}
                                    >
                                        {link.name}
                                        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-pink-400 transition-all group-hover:w-full"></span>
                                    </Link>
                                )}
                            </motion.div>
                        );
                    })}
                </nav>

                {/* Mobile menu button */}
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

            {/* Mobile menu */}
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
                                const isActive = pathname === link.href;
                                return (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: 0.1 * index,
                                            type: 'spring',
                                            stiffness: 100,
                                            damping: 20,
                                        }}
                                    >
                                        {link.name === 'Logout' ? (
                                            <button
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    handleLogout();
                                                }}
                                                className="relative group font-semibold transition-all duration-300 text-gray-700 dark:text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:to-pink-400"
                                            >
                                                {link.name}
                                                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-pink-400 transition-all group-hover:w-full"></span>
                                            </button>
                                        ) : (
                                            <Link
                                                href={link.href}
                                                onClick={() => setIsOpen(false)}
                                                className={`relative group font-semibold transition-all ${isActive
                                                    ? 'text-blue-600 dark:text-blue-400 drop-shadow-md'
                                                    : 'text-gray-700 dark:text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:to-pink-400'
                                                    }`}
                                            >
                                                {link.name}
                                                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-pink-400 transition-all group-hover:w-full"></span>
                                            </Link>
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
