import { useEffect, useState } from 'react';
import {
    BookOpen,
    Calendar,
    User,
    FileText,
    Download,
    Eye,
    X,
} from 'lucide-react';
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
    const { fetchPresignedUrl } = useMedia();

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
                        <>
                            <div className="flex items-center gap-3">
                                {/* Download Button */}
                                <a
                                    href={mediaUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center gap-3 p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors group"
                                >
                                    <Download className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                                    <div className="flex-1">
                                        <p className="font-medium text-blue-600 font-poppins">Tải xuống tài liệu</p>
                                        <p className="text-sm text-gray-600 font-open-sans">Click để tải xuống</p>
                                    </div>
                                </a>

                                {/* Preview Button for PDF */}
                                {mediaType === 'application/pdf' && (
                                    <button
                                        onClick={() => setShowPDFPreview(true)}
                                        className="flex items-center gap-2 px-4 py-4 rounded-lg bg-primary hover:bg-blue-700 text-white transition-colors font-poppins font-medium"
                                    >
                                        <Eye className="w-5 h-5" />
                                        <span>Xem trước</span>
                                    </button>
                                )}
                            </div>

                            {/* PDF Preview Modal */}
                            {showPDFPreview && mediaType === 'application/pdf' && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                                    <div className="bg-white rounded-xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
                                        {/* Modal Header */}
                                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                            <h3 className="font-bold text-lg text-gray-900 font-poppins">
                                                Xem trước PDF
                                            </h3>
                                            <button
                                                onClick={() => setShowPDFPreview(false)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* PDF Viewer */}
                                        <div className="flex-1 overflow-hidden">
                                            <PDFViewer url={mediaUrl} fileName={`lecture-${lecture.lectureId}.pdf`} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-4 text-gray-500">Đang tải tài liệu...</div>
                    )}
                </div>
            )}
        </div>
    );
}
