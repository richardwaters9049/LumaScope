"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Loader2 } from "lucide-react";
import clsx from "clsx";

export default function UploadForm() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [result, setResult] = useState<any | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);

        const token = localStorage.getItem("token"); // ✅ FIXED: Correct token key

        const res = await fetch("http://localhost:8000/upload/", {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();
        setResult(data);
        setIsUploading(false);
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <motion.div
                className="w-full max-w-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
            >
                <Card className="bg-white/60 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl">
                    <CardContent className="p-8 flex flex-col gap-6">
                        <div
                            className={clsx(
                                "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all duration-300",
                                selectedFile
                                    ? "border-green-500 bg-green-50"
                                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                            )}
                        >
                            <UploadCloud className="w-12 h-12 text-gray-500 mb-2" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer text-lg font-medium text-blue-600 hover:underline tracking-widest"
                            >
                                {selectedFile ? selectedFile.name : "Upload Smear Image"}
                            </label>
                        </div>
                        <div className="button-container w-full flex justify-center items-center">
                            <Button
                                onClick={handleUpload}
                                disabled={!selectedFile || isUploading}
                                className={clsx(
                                    "transition-all text-lg font-semibold analyze-button mt-4 p-8 rounded-xl tracking-widest",
                                    isUploading && "cursor-wait opacity-80"
                                )}
                            >
                                {isUploading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="animate-spin h-4 w-4" />
                                        Uploading...
                                    </span>
                                ) : (
                                    "Analyse Smear"
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <AnimatePresence>
                {result && (
                    <motion.div
                        className="mt-10 w-full max-w-4xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-3xl p-6"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">📊 Analysis Results</h2>
                        <div className="text-sm text-gray-600 mb-4">
                            <p className="mb-1">
                                <strong>Analysis ID:</strong>{" "}
                                <span className="font-mono text-indigo-600">{result.analysis_id}</span>
                            </p>
                            <p>
                                <strong>Total Cells:</strong> {result.total_cells} |{" "}
                                <strong>Abnormal:</strong> {result.abnormal_cells}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {Array.isArray(result?.shap_plots) && result.shap_plots.length > 0 ? (
                                result.shap_plots.map((plot: string, idx: number) => (
                                    <motion.div
                                        key={idx}
                                        className="rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <img
                                            src={plot}
                                            alt={`SHAP Plot ${idx}`}
                                            className="w-full h-auto object-cover rounded-md"
                                        />
                                    </motion.div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic col-span-2 text-center">
                                    No SHAP plots available for this upload.
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
