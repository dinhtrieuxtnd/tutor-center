'use client';

import { useCallback, useState } from 'react';
import { Upload, X, FileText, File } from 'lucide-react';

interface FileDropZoneProps {
    onFileSelect: (file: File) => void;
    onFileRemove?: () => void;
    selectedFile?: File | null;
    accept?: string;
    maxSize?: number; // in MB
    className?: string;
}

export function FileDropZone({
    onFileSelect,
    onFileRemove,
    selectedFile = null,
    accept = '.pdf,.doc,.docx,.txt,.zip',
    maxSize = 10, // 10MB default
    className = '',
}: FileDropZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateFile = (file: File): boolean => {
        // Check file size
        const maxSizeBytes = maxSize * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            setError(`File quá lớn. Kích thước tối đa: ${maxSize}MB`);
            return false;
        }

        // Check file type
        if (accept) {
            const extensions = accept.split(',').map(ext => ext.trim().toLowerCase());
            const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
            if (!extensions.includes(fileExt)) {
                setError(`Định dạng file không được hỗ trợ. Chỉ chấp nhận: ${accept}`);
                return false;
            }
        }

        setError(null);
        return true;
    };

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);

            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                const file = files[0];
                if (validateFile(file)) {
                    onFileSelect(file);
                }
            }
        },
        [onFileSelect, maxSize, accept]
    );

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (validateFile(file)) {
                onFileSelect(file);
            }
        }
    };

    const handleRemove = () => {
        setError(null);
        onFileRemove?.();
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    const getFileIcon = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') {
            return <FileText className="w-8 h-8 text-red-500" />;
        }
        return <File className="w-8 h-8 text-blue-500" />;
    };

    return (
        <div className={className}>
            {selectedFile ? (
                // File selected view
                <div className="border-2 border-green-300 bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            {getFileIcon(selectedFile.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate font-poppins">
                                {selectedFile.name}
                            </p>
                            <p className="text-sm text-gray-600 font-open-sans">
                                {formatFileSize(selectedFile.size)}
                            </p>
                        </div>
                        <button
                            onClick={handleRemove}
                            className="flex-shrink-0 p-2 rounded-lg hover:bg-red-100 transition-colors"
                            title="Xóa file"
                        >
                            <X className="w-5 h-5 text-red-600" />
                        </button>
                    </div>
                </div>
            ) : (
                // Drop zone view
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                        isDragging
                            ? 'border-orange-500 bg-orange-50'
                            : error
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-300 bg-gray-50 hover:border-orange-400 hover:bg-orange-50'
                    }`}
                >
                    <input
                        type="file"
                        id="file-input"
                        className="hidden"
                        accept={accept}
                        onChange={handleFileInput}
                    />
                    <label htmlFor="file-input" className="cursor-pointer">
                        <div className="flex flex-col items-center gap-3">
                            <div
                                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                                    error ? 'bg-red-100' : 'bg-orange-100'
                                }`}
                            >
                                <Upload className={`w-8 h-8 ${error ? 'text-red-600' : 'text-orange-600'}`} />
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-gray-900 mb-1 font-poppins">
                                    {isDragging ? 'Thả file tại đây' : 'Kéo thả file hoặc click để chọn'}
                                </p>
                                <p className="text-sm text-gray-600 font-open-sans">
                                    Hỗ trợ: {accept.replace(/\./g, '').toUpperCase()} • Tối đa {maxSize}MB
                                </p>
                            </div>
                            {error && (
                                <p className="text-sm text-red-600 font-semibold font-open-sans mt-2">
                                    {error}
                                </p>
                            )}
                        </div>
                    </label>
                </div>
            )}
        </div>
    );
}
