// components/ResultCard.tsx

import React from "react";

export default function ResultCard({ result }: { result: any }) {
    return (
        <div className="mt-6 p-4 border rounded-lg bg-white shadow">
            <p className="font-semibold">Analysis ID: {result.analysis_id}</p>
            <p>Total Cells: {result.total_cells}</p>
            <p>Abnormal Cells: {result.abnormal_cells}</p>

            <h4 className="mt-4 font-medium">SHAP Plots:</h4>
            <div className="grid grid-cols-2 gap-2 mt-2">
                {result?.plots?.length > 0 && (
                    <div className="space-y-4 mt-6">
                        <h3 className="text-xl font-semibold">SHAP Plots:</h3>
                        {result.plots.map((plotPath: string, idx: number) => (
                            <div key={idx}>
                                <p className="text-sm text-gray-500 mb-2">SHAP Plot {idx + 1}</p>
                                <img
                                    src={`http://localhost:8000${plotPath}`}
                                    alt={`SHAP Plot ${idx + 1}`}
                                    className="border rounded-lg shadow-md w-full max-w-md"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}