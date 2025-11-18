'use client';

import { useState, useEffect } from 'react';
import {
    Download,
    FileText,
    Loader2,
    ExternalLink,
} from 'lucide-react';

interface PDFViewerProps {
    url: string;
    fileName?: string;
    className?: string;
}

export function PDFViewer({ url, fileName = 'document.pdf', className = '' }: PDFViewerProps) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [iframeUrl, setIframeUrl] = useState<string>('');

    useEffect(() => {
        // Validate and load PDF URL
        const loadPDF = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Test if URL is accessible
                const response = await fetch(url, { method: 'HEAD' });
                
                if (!response.ok) {
                    throw new Error(`Failed to load PDF: ${response.status}`);
                }

                // Check if it's actually a PDF
                const contentType = response.headers.get('content-type');
                if (contentType && !contentType.includes('pdf')) {
                    throw new Error('File is not a PDF');
                }

                setIframeUrl(url);
                setIsLoading(false);
            } catch (err) {
                console.error('PDF Load Error:', err);
                setError('Không thể tải file PDF. URL có thể đã hết hạn hoặc file không tồn tại.');
                setIsLoading(false);
            }
        };

        if (url) {
            loadPDF();
        }
    }, [url]);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
    };

    const handleOpenNewTab = () => {
        window.open(url, '_blank');
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mb-3 text-red-400" />
                <p className="text-sm text-red-600 mb-4">{error}</p>
                <div className="flex gap-3">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Tải lại
                    </button>
                    <button
                        onClick={handleDownload}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Tải xuống
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`pdf-viewer flex flex-col h-full ${className}`}>
            {/* Toolbar */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-sm font-open-sans font-semibold text-gray-700">
                        {fileName}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Open in new tab */}
                    <button
                        onClick={handleOpenNewTab}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1"
                        title="Mở tab mới"
                    >
                        <ExternalLink className="w-5 h-5" />
                        <span className="text-sm font-open-sans hidden md:inline">Mở tab mới</span>
                    </button>

                    {/* Divider */}
                    <div className="w-px h-6 bg-gray-300 mx-2"></div>

                    {/* Download */}
                    <button
                        onClick={handleDownload}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1"
                        title="Tải xuống"
                    >
                        <Download className="w-5 h-5" />
                        <span className="text-sm font-open-sans hidden md:inline">Tải xuống</span>
                    </button>
                </div>
            </div>

            {/* PDF Content with iframe */}
            <div className="flex-1 overflow-hidden bg-gray-100">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mb-3" />
                        <p className="text-sm text-gray-600 font-open-sans">Đang tải tài liệu PDF...</p>
                    </div>
                ) : (
                    <iframe
                        src={iframeUrl}
                        className="w-full h-full border-0"
                        title={fileName}
                        onError={() => {
                            setError('Không thể hiển thị PDF. Vui lòng tải xuống để xem.');
                            setIsLoading(false);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
