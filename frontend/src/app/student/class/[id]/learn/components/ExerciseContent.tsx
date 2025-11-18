import { useEffect, useState } from 'react';
import {
    Pencil,
    Calendar,
    AlarmClock,
    FileText,
    Download,
    Send,
    CheckCircle,
} from 'lucide-react';
import { LessonResponse } from '@/services/lessonApi';
import { useMedia } from '@/hooks';

interface ExerciseContentProps {
    lesson: LessonResponse;
}

export function ExerciseContent({ lesson }: ExerciseContentProps) {
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);
    const [answer, setAnswer] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { fetchPresignedUrl } = useMedia();

    const exercise = lesson.exercise;

    useEffect(() => {
        const fetchMedia = async () => {
            if (exercise?.attachMediaId) {
                try {
                    const result = await fetchPresignedUrl(exercise.attachMediaId);
                    if (result.payload && typeof result.payload === 'object' && 'url' in result.payload) {
                        setMediaUrl(result.payload.url as string);
                    }
                } catch (error) {
                    console.error('Failed to fetch media:', error);
                }
            }
        };

        fetchMedia();
    }, [exercise?.attachMediaId]);

    if (!exercise) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Không tìm thấy bài tập</p>
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

    const handleSubmit = () => {
        // TODO: Implement submit logic
        setIsSubmitted(true);
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                        <Pencil className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-sm text-gray-500 font-open-sans">Bài tập</span>
                        <h1 className="text-3xl font-bold text-gray-900 font-poppins">
                            {exercise.title}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-sm font-open-sans">
                    <span className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(exercise.createdAt)}
                    </span>
                    {lesson.exerciseDueAt && (
                        <span className="flex items-center gap-2 text-orange-600 font-medium">
                            <AlarmClock className="w-4 h-4" />
                            Hạn nộp: {formatDate(lesson.exerciseDueAt)}
                        </span>
                    )}
                </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4 font-poppins">
                    Yêu cầu bài tập
                </h3>
                {exercise.description ? (
                    <div className="prose prose-lg max-w-none">
                        <div
                            className="text-gray-700 font-open-sans leading-relaxed whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ __html: exercise.description.replace(/\n/g, '<br />') }}
                        />
                    </div>
                ) : (
                    <p className="text-gray-500">Chưa có mô tả</p>
                )}
            </div>

            {/* Attachment */}
            {exercise.attachMediaId && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-5 h-5 text-orange-600" />
                        <h3 className="font-bold text-lg text-gray-900 font-poppins">
                            Tài liệu đính kèm
                        </h3>
                    </div>

                    {mediaUrl ? (
                        <a
                            href={mediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors group"
                        >
                            <Download className="w-5 h-5 text-orange-600 group-hover:scale-110 transition-transform" />
                            <div className="flex-1">
                                <p className="font-medium text-orange-600 font-poppins">Tải xuống tài liệu</p>
                                <p className="text-sm text-gray-600 font-open-sans">Click để tải xuống hoặc xem</p>
                            </div>
                        </a>
                    ) : (
                        <div className="text-center py-4 text-gray-500">Đang tải tài liệu...</div>
                    )}
                </div>
            )}

            {/* Submission Area */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4 font-poppins">
                    Nộp bài làm
                </h3>

                {isSubmitted ? (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2 font-poppins">
                            Đã nộp bài thành công!
                        </h4>
                        <p className="text-gray-600 font-open-sans">
                            Giáo viên sẽ chấm bài và phản hồi sớm nhất có thể
                        </p>
                    </div>
                ) : (
                    <>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Nhập câu trả lời của bạn tại đây..."
                            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none font-open-sans"
                        />

                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-gray-500 font-open-sans">
                                Bạn có thể đính kèm file hoặc nhập văn bản
                            </p>
                            <button
                                onClick={handleSubmit}
                                disabled={!answer.trim()}
                                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2 font-poppins"
                            >
                                <Send className="w-5 h-5" />
                                Nộp bài
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
