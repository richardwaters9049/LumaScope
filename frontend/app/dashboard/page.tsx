'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Navbar } from '@/components/Navbar';
import UploadForm from '@/components/UploadForm';
import History from '@/components/History';

type ActiveViewType = 'upload' | 'history';

interface User {
    id: string;
    fullName: string;
    email: string;
    role?: string;
}

export default function Dashboard() {
    const [activeView, setActiveView] = useState<ActiveViewType>('upload');

    // Dummy authenticated user
    const user: User = {
        id: '1',
        fullName: 'Test User',
        email: 'test@example.com',
        role: 'admin',
    };

    // Welcome toast
    useEffect(() => {
        toast.success(`Welcome back, ${user.fullName}!`, { duration: 2000 });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pt-24">
            {/* Navbar */}
            <Navbar activeView={activeView} setActiveView={setActiveView} user={user} />

            {/* Main content */}
            <main className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {activeView === 'upload' && 'Upload New Analysis'}
                        {activeView === 'history' && 'Analysis History'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {activeView === 'upload' && 'Upload and analyze blood smear images'}
                        {activeView === 'history' && 'View your previous analyses and results'}
                    </p>
                </div>

                {activeView === 'upload' && (
                    <div className="bg-white rounded-lg shadow p-6 h-1/2">
                        <UploadForm />
                    </div>
                )}

                {activeView === 'history' && (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <History />
                    </div>
                )}
            </main>
        </div>
    );
}
