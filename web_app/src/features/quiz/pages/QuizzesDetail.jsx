import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { getQuizDetailAsync, clearCurrentQuiz } from '../store/quizSlice';
import { getQuizAttemptsByLessonAsync } from '../store/quizAttemptSlice';
import { FileQuestion, ArrowLeft, Info, HelpCircle, Users } from 'lucide-react';
import { Spinner } from '../../../shared/components/loading/Loading';
import { Button } from '../../../shared/components';
import { ROUTES } from '../../../core/constants';
import { QuizInfo } from '../components/QuizInfo';
import QuizQuestions from '../components/QuizQuestions';
import { QuizAttemptsTable } from '../components/QuizAttemptsTable';
import { ViewAttemptPanel } from '../components/ViewAttemptPanel';

const TABS = {
    INFO: 'info',
    QUESTIONS: 'questions',
    ATTEMPTS: 'attempts',
};

export const QuizzesDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentQuizDetail, quizDetailLoading } = useAppSelector((state) => state.quiz);
    const { attempts, loading: attemptsLoading } = useAppSelector((state) => state.quizAttempt);
    const [activeTab, setActiveTab] = useState(TABS.INFO);
    const [showAttemptDetail, setShowAttemptDetail] = useState(false);
    const [selectedAttempt, setSelectedAttempt] = useState(null);

    useEffect(() => {
        if (id) {
            dispatch(getQuizDetailAsync(parseInt(id)));
        }

        return () => {
            dispatch(clearCurrentQuiz());
        };
    }, [id, dispatch]);

    useEffect(() => {
        if (activeTab === TABS.ATTEMPTS && currentQuizDetail?.lessonId) {
            dispatch(getQuizAttemptsByLessonAsync(currentQuizDetail.lessonId));
        }
    }, [activeTab, currentQuizDetail?.lessonId, dispatch]);

    const handleBack = () => {
        navigate(ROUTES.TUTOR_QUIZZES);
    };

    const handleQuizUpdate = () => {
        // Refresh quiz data after update
        if (id) {
            dispatch(getQuizDetailAsync(parseInt(id)));
        }
    };

    const handleViewAttemptDetail = (attempt) => {
        setSelectedAttempt(attempt);
        setShowAttemptDetail(true);
    };

    const tabs = [
        { id: TABS.INFO, label: 'Thông tin', icon: Info },
        { id: TABS.QUESTIONS, label: 'Câu hỏi', icon: HelpCircle },
        { id: TABS.ATTEMPTS, label: 'Lượt làm bài', icon: Users },
    ];

    /* ================= LOADING ================= */
    if (quizDetailLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <Spinner size="lg" className="mx-auto mb-2" />
                    <p className="text-sm text-foreground-light">Đang tải thông tin bài kiểm tra...</p>
                </div>
            </div>
        );
    }

    /* ================= NOT FOUND ================= */
    if (!currentQuizDetail) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <FileQuestion size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-foreground-light mb-4">Không tìm thấy thông tin bài kiểm tra</p>
                    <Button onClick={handleBack} variant="outline">
                        <ArrowLeft size={16} />
                        Quay lại
                    </Button>
                </div>
            </div>
        );
    }

    const quiz = currentQuizDetail;

    return (
        <div>
            {/* Cover Header */}
            <div className="relative w-full h-48 mb-6 rounded-sm">
                {/* Background Gradient */}
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600" />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                    {/* Back Button */}
                    <div>
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-sm text-white hover:text-white/80 transition-colors bg-black/30 backdrop-blur-sm px-3 py-2 rounded-sm"
                        >
                            <ArrowLeft size={16} />
                            Quay lại danh sách
                        </button>
                    </div>

                    {/* Quiz Info */}
                    <div className="text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <FileQuestion size={32} className="drop-shadow-lg" />
                            <h1 className="text-2xl font-bold drop-shadow-lg">
                                {quiz.title}
                            </h1>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <p className="drop-shadow-md">ID: {quiz.id}</p>
                            <p className="drop-shadow-md">
                                {quiz.questions?.length || 0} câu hỏi
                            </p>
                            <p className="drop-shadow-md">
                                {Math.floor(quiz.timeLimitSec / 60)} phút
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border mb-6">
                <div className="flex gap-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${isActive
                                    ? 'border-foreground text-foreground'
                                    : 'border-transparent text-foreground-light hover:text-foreground hover:border-gray-300'
                                    }`}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <div className="w-full">
                {activeTab === TABS.INFO && <QuizInfo quiz={quiz} onUpdate={handleQuizUpdate} />}
                {activeTab === TABS.QUESTIONS && <QuizQuestions quiz={quiz} onUpdate={handleQuizUpdate} />}
                {activeTab === TABS.ATTEMPTS && (
                    <div className="bg-primary border border-border rounded-sm overflow-hidden">
                        <QuizAttemptsTable
                            attempts={attempts}
                            loading={attemptsLoading}
                            onViewDetail={handleViewAttemptDetail}
                        />
                    </div>
                )}
            </div>

            {/* View Attempt Detail Panel */}
            <ViewAttemptPanel
                isOpen={showAttemptDetail}
                onClose={() => {
                    setShowAttemptDetail(false);
                    setSelectedAttempt(null);
                }}
                attempt={selectedAttempt}
            />
        </div>
    );
};
