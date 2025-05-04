'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Navbar } from '@/components/Navbar';
import History from '@/components/History';
import UploadForm from '@/components/UploadForm';
// import Datasets from '@/components/Datasets';
// import Settings from '@/components/Settings';
import { AnimatePresence, motion } from 'framer-motion';

export default function DashboardPage() {
    const router = useRouter();
    const [activeView, setActiveView] = useState<'upload' | 'history' | 'datasets' | 'settings'>('upload');

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const justLoggedIn = localStorage.getItem('justLoggedIn') === 'true';

        if (isAuthenticated) {
            if (justLoggedIn) {
                toast.success('Logged in successfully!!! ✅', { duration: 1500 });
                localStorage.removeItem('justLoggedIn');
            }
        } else {
            router.replace('/');
        }
    }, [router]);

    return (
        <>
            <Navbar activeView={activeView} setActiveView={setActiveView} />
            <main className="p-4">
                <AnimatePresence mode="wait">
                    {activeView === 'upload' && (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.3 }}
                        >
                            <UploadForm />
                        </motion.div>
                    )}
                    {activeView === 'history' && (
                        <motion.div
                            key="history"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.3 }}
                        >
                            <History />
                        </motion.div>
                    )}
                    {activeView === 'datasets' && (
                        <motion.div
                            key="datasets"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* <Datasets /> */}
                            Datasets
                        </motion.div>
                    )}
                    {activeView === 'settings' && (
                        <motion.div
                            key="settings"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.3 }}
                        >
                            Settings
                            {/* <Settings /> */}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </>
    );
}
