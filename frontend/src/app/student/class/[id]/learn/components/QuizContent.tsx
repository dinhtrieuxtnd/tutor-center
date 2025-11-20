import { useState } from 'react';
import {
  ListChecks,
  Calendar,
  Clock4,
  Timer,
  PlayCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { LessonResponse } from '@/services/lessonApi';
import { useRouter } from 'next/navigation';
interface QuizContentProps {
  lesson: LessonResponse;
}

export function QuizContent({ lesson }: QuizContentProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const router = useRouter();

  const quiz = lesson.quiz;

  if (!quiz) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Không tìm thấy bài kiểm tra</p>
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

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} giờ ${minutes} phút`;
    }
    return `${minutes} phút`;
  };

  const handleStart = () => {
    // setIsStarted(true);
    router.push(`/student/quiz/${lesson.lessonId}`);
    // TODO: Implement quiz start logic
  };

  const handleSubmit = () => {
    setIsCompleted(true);
    setScore(85); // Mock score
    // TODO: Implement quiz submit logic
  };

  if (isCompleted) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-poppins">
            Hoàn thành bài kiểm tra!
          </h1>
          <p className="text-lg text-gray-600 font-open-sans mb-8">
            Bạn đã hoàn thành bài kiểm tra
          </p>

          <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
            <div className="text-6xl font-bold text-primary mb-2 font-poppins">
              {score}%
            </div>
            <p className="text-gray-600 font-open-sans">Điểm số của bạn</p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors font-poppins"
          >
            Làm lại
          </button>
        </div>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <ListChecks className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm text-gray-500 font-open-sans">Bài kiểm tra</span>
              <h1 className="text-3xl font-bold text-gray-900 font-poppins">
                {quiz.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm font-open-sans">
            <span className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              {formatDate(quiz.createdAt)}
            </span>
            {lesson.quizEndAt && (
              <span className="flex items-center gap-2 text-purple-600 font-medium">
                <Clock4 className="w-4 h-4" />
                Kết thúc: {formatDate(lesson.quizEndAt)}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {quiz.description && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4 font-poppins">
              Mô tả
            </h3>
            <div
              className="text-gray-700 font-open-sans leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: quiz.description.replace(/\n/g, '<br />') }}
            />
          </div>
        )}

        {/* Quiz Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {quiz.timeLimitSec && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <Timer className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-open-sans mb-1">Thời gian</p>
              <p className="text-xl font-bold text-gray-900 font-poppins">
                {formatTime(quiz.timeLimitSec)}
              </p>
            </div>
          )}

          {quiz.maxAttempts && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <ListChecks className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-open-sans mb-1">Số lần làm</p>
              <p className="text-xl font-bold text-gray-900 font-poppins">
                {quiz.maxAttempts} lần
              </p>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 font-open-sans mb-1">Hiển thị đáp án</p>
            <p className="text-xl font-bold text-gray-900 font-poppins">
              {quiz.showAnswers ? 'Có' : 'Không'}
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-100 mb-8">
          <h3 className="font-bold text-xl text-gray-900 mb-4 font-poppins">
            Hướng dẫn làm bài
          </h3>
          <ul className="space-y-2 text-gray-700 font-open-sans">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <span>Đọc kỹ câu hỏi trước khi trả lời</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <span>Kiểm tra lại câu trả lời trước khi nộp bài</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <span>Thời gian làm bài sẽ bắt đầu ngay khi bạn nhấn "Bắt đầu"</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span>Không được thoát ra ngoài trong quá trình làm bài</span>
            </li>
          </ul>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <button
            onClick={handleStart}
            className="cursor-pointer px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-lg rounded-xl transition-colors flex items-center gap-3 mx-auto font-poppins shadow-lg"
          >
            <PlayCircle className="w-6 h-6" />
            Bắt đầu làm bài
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Quiz Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl text-gray-900 font-poppins">
            {quiz.title}
          </h2>
          {quiz.timeLimitSec && (
            <div className="flex items-center gap-2 text-purple-600 font-poppins">
              <Timer className="w-5 h-5" />
              <span className="text-lg font-bold">45:00</span>
            </div>
          )}
        </div>
      </div>

      {/* Questions Area */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
        <p className="text-center text-gray-500 py-12">
          Nội dung câu hỏi sẽ được hiển thị ở đây
        </p>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg rounded-xl transition-colors font-poppins"
        >
          Nộp bài
        </button>
      </div>
    </div>
  );
}
