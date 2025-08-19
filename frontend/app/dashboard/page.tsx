'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import History from '@/components/History';
import UploadForm from '@/components/UploadForm';
// import Datasets from '@/components/Datasets';
// import Settings from '@/components/Settings';

type ActiveViewType = 'upload' | 'history' | 'datasets' | 'settings';

function DashboardContent() {
    const router = useRouter();
    const { user, isAuthenticated, loading } = useAuth();
    const [activeView, setActiveView] = useState<ActiveViewType>('upload');
    
    // Handle view changes with type safety
    const handleViewChange = (view: string) => {
        if (['upload', 'history', 'datasets', 'settings'].includes(view)) {
            setActiveView(view as ActiveViewType);
        }
    };

    // Show loading state while checking auth status
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    // If not authenticated, the ProtectedRoute will handle redirection
    if (!isAuthenticated) {
        return null;
    }

    // Show welcome message on first render
    useEffect(() => {
        toast.success(`Welcome back, ${user?.fullName || 'User'}!`, { duration: 2000 });
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar 
                activeView={activeView} 
                setActiveView={handleViewChange} 
                user={user} 
            />
            <main className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {activeView === 'upload' && 'Upload New Analysis'}
                        {activeView === 'history' && 'Analysis History'}
                        {activeView === 'datasets' && 'Datasets'}
                        {activeView === 'settings' && 'Settings'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {activeView === 'upload' && 'Upload and analyze blood smear images'}
                        {activeView === 'history' && 'View your previous analyses and results'}
                        {activeView === 'datasets' && 'Manage your datasets and samples'}
                        {activeView === 'settings' && 'Configure your account and preferences'}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {activeView === 'upload' && (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-lg shadow p-6"
                        >
                            <UploadForm />
                        </motion.div>
                    )}

                    {activeView === 'history' && (
                        <motion.div
                            key="history"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-lg shadow overflow-hidden"
                        >
                            <History />
                        </motion.div>
                    )}

                    {activeView === 'datasets' && (
                        <motion.div
                            key="datasets"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-lg shadow p-6"
                        >
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
