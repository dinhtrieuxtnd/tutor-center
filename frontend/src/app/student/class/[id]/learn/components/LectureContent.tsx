import { useEffect, useState } from 'react';
import {
    BookOpen,
    Calendar,
    User,
    FileText,
    Download,
    ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonResponse } from '@/services/lessonApi';
import { useMedia } from '@/hooks';
import { MarkdownViewer, PDFViewer } from '@/components/view';

interface LectureContentProps {
    lesson: LessonResponse;
    lectureId: number | null;
}

export function LectureContent({ lesson, lectureId }: LectureContentProps) {
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<string | null>(null);
    const [showPDFPreview, setShowPDFPreview] = useState<boolean>(false);
    const { fetchPresignedUrl, downloadMedia } = useMedia();

    const lecture = lectureId
        ? lesson.lecture?.children?.find((child) => child.lectureId === lectureId)
        : lesson.lecture;

    useEffect(() => {
        const fetchMedia = async () => {
            if (lecture?.mediaId) {
                try {
                    const result = await fetchPresignedUrl(lecture.mediaId);
                    if (result.payload && typeof result.payload === 'object' && 'url' in result.payload) {
                        setMediaUrl(result.payload.url as string);

                        // Detect media type from URL or mimeType
                        const url = result.payload.url as string;
                        if ('mimeType' in result.payload) {
                            setMediaType(result.payload.mimeType as string);
                        } else if (url.toLowerCase().includes('.pdf')) {
                            setMediaType('application/pdf');
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch media:', error);
                }
            }
        };

        fetchMedia();
    }, [lecture?.mediaId]);

    if (!lecture) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Không tìm thấy bài giảng</p>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-sm text-gray-500 font-open-sans">Bài giảng</span>
                        <h1 className="text-3xl font-bold text-gray-900 font-poppins">
                            {lecture.title}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600 font-open-sans">
                    <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(lecture.uploadedAt)}
                    </span>
                    <span className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {lecture.uploadedByName}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
                {lecture.content ? (
                    <MarkdownViewer content={lecture.content} />
                ) : (
                    <p className="text-gray-500 text-center py-8">Chưa có nội dung bài giảng</p>
                )}
            </div>

            {/* Media Attachment */}
            {lecture.mediaId && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-lg text-gray-900 font-poppins">
                            Tài liệu đính kèm
                        </h3>
                    </div>

                    {mediaUrl ? (
                        <div className="flex flex-col gap-3">
                            {/* Download Button */}
                            <button
                                onClick={() => lecture.mediaId && downloadMedia(lecture.mediaId)}
                                className="w-full flex items-center gap-3 p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors group cursor-pointer"
                            >
                                <Download className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                                <div className="flex-1 flex justify-between items-center">
                                    <p className="font-medium text-blue-600 font-poppins">Tải xuống tài liệu</p>
                                    <p className="text-sm text-gray-600 font-open-sans">Click để tải xuống</p>
                                </div>
                            </button>

                            {/* Preview Button for PDF */}
                            {mediaType === 'application/pdf' && (
                                <>
                                    <button
                                        onClick={() => setShowPDFPreview(!showPDFPreview)}
                                        className="cursor-pointer w-full flex items-center text-sm justify-center gap-1 p-1 rounded-lg bg-gray-300 hover:bg-gray-400 text-white transition-colors font-poppins font-medium"
                                    >
                                        <span>Xem trước</span>
                                        <motion.div
                                            animate={{ rotate: showPDFPreview ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ChevronDown className="w-4 h-4" />
                                        </motion.div>
                                    </button>

                                    {/* PDF Preview - Dropdown Style with Animation */}
                                    <AnimatePresence>
                                        {showPDFPreview && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 600, opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                className="overflow-hidden flex min-h-[90vh]"
                                            >
                                                <div className="border-t border-gray-200 pt-4 flex-1">
                                                    <div className="bg-gray-50 rounded-lg overflow-hidden h-full flex-1">
                                                        <PDFViewer 
                                                            url={mediaUrl} 
                                                            mediaId={lecture.mediaId}
                                                            fileName={`lecture-${lecture.lectureId}.pdf`} 
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-gray-500">Đang tải tài liệu...</div>
                    )}
                </div>
            )}
        </div>
    );
}
