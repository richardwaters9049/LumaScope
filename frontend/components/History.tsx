'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface UploadResult {
    id: number;
    filename: string;
    file_path: string;
    upload_time: string;
    total_cells: number;
    abnormal_cells: number;
    analysis_id: string;
    preview_url: string;
}

const mockUploads: UploadResult[] = [
    {
        id: 1,
        filename: 'sample_001.jpg',
        file_path: '/images/test1.png',
        upload_time: '2025-04-29T10:32:00Z',
        total_cells: 128,
        abnormal_cells: 17,
        analysis_id: 'AID-8391X',
        preview_url: '/images/test1.png',
    },
    {
        id: 2,
        filename: 'sample_002.jpg',
        file_path: '/images/test1.png',
        upload_time: '2025-04-30T14:10:00Z',
        total_cells: 142,
        abnormal_cells: 9,
        analysis_id: 'AID-8392Y',
        preview_url: '/images/test1.png',
    },
    {
        id: 3,
        filename: 'sample_003.jpg',
        file_path: '/images/test1.png',
        upload_time: '2025-05-01T08:25:00Z',
        total_cells: 134,
        abnormal_cells: 12,
        analysis_id: 'AID-8393Z',
        preview_url: '/images/test1.png',
    },
    {
        id: 4,
        filename: 'sample_004.jpg',
        file_path: '/images/test1.png',
        upload_time: '2025-05-01T09:10:00Z',
        total_cells: 120,
        abnormal_cells: 8,
        analysis_id: 'AID-8394W',
        preview_url: '/images/test1.png',
    },
    {
        id: 5,
        filename: 'sample_005.jpg',
        file_path: '/images/test1.png',
        upload_time: '2025-05-01T11:02:00Z',
        total_cells: 150,
        abnormal_cells: 10,
        analysis_id: 'AID-8395Q',
        preview_url: '/images/test1.png',
    },
    {
        id: 6,
        filename: 'sample_006.jpg',
        file_path: '/images/test1.png',
        upload_time: '2025-05-01T12:48:00Z',
        total_cells: 160,
        abnormal_cells: 14,
        analysis_id: 'AID-8396R',
        preview_url: '/images/test1.png',
    },
];

const useNextImage = true; // Toggle this to false to use <img>

export default function History() {
    return (
        <div className="px-6 py-6 max-w-7xl mx-auto mt-30">
            <h2 className="text-6xl font-bold mb-14 text-center text-blue-950 dark:text-gray-100 tracking-widest">
                Upload History
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {mockUploads.map((upload, index) => (
                    <motion.div
                        key={upload.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="shadow-xl rounded-2xl overflow-hidden bg-white/70 backdrop-blur-md border border-gray-200 dark:bg-gray-900/70 h-full flex flex-col">
                            <CardContent className="p-4 flex flex-col gap-4 h-full">
                                {/* Preview */}
                                <div className="w-full h-40 rounded-lg overflow-hidden">
                                    {useNextImage ? (
                                        <Image
                                            src={upload.preview_url}
                                            alt={`Preview ${upload.filename}`}
                                            width={300}
                                            height={200}
                                            className="w-full h-full object-cover border-blue-950 border-2 border-solid rounded-2xl"
                                        />
                                    ) : (
                                        <img
                                            src={upload.preview_url}
                                            alt={`Preview ${upload.filename}`}
                                            className="w-full h-full object-cover border-blue-950 border-2 border-solid rounded-2xl"
                                        />
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-grow space-y-2 text-sm text-gray-800 dark:text-gray-100">
                                    <h3 className="text-lg font-semibold truncate">{upload.filename}</h3>
                                    <p>
                                        <strong>Uploaded:</strong>{' '}
                                        {new Date(upload.upload_time).toLocaleString()}
                                    </p>
                                    <p>
                                        <strong>Total Cells:</strong> {upload.total_cells}
                                    </p>
                                    <p>
                                        <strong>Abnormal:</strong> {upload.abnormal_cells}
                                    </p>
                                    <p>
                                        <strong>ID:</strong>{' '}
                                        <span className="font-mono text-indigo-600 dark:text-indigo-300">
                                            {upload.analysis_id}
                                        </span>
                                    </p>
                                </div>

                                {/* Download */}
                                <div className="pt-2">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-center gap-2 text-sm"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
