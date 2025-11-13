'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Flag,
  ChevronLeft,
  ChevronRight,
  List,
  Send
} from 'lucide-react';
import { AppHeader } from '@/components/layout';
import 'katex/dist/katex.min.css';

interface QuizOption {
  id: string;
  label: string;
  content: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  correctAnswer?: string; // Sẽ hiển thị sau khi submit
  explanation?: string; // Giải thích sau khi submit
}

interface QuizData {
  id: number;
  classId: number;
  className: string;
  title: string;
  description: string;
  duration: number; // minutes
  totalQuestions: number;
  maxScore: number;
  dueDate: string;
  questions: QuizQuestion[];
}

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(0); // seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showQuestionList, setShowQuestionList] = useState(false);

  // Mock data
  const quiz: QuizData = {
    id: Number(quizId),
    classId: 1,
    className: 'Toán 12 - Luyện thi THPT QG',
    title: 'Kiểm tra giữa kỳ',
    description: 'Bài kiểm tra trắc nghiệm về hàm số và đạo hàm',
    duration: 30,
    totalQuestions: 15,
    maxScore: 10,
    dueDate: '30/11/2025',
    questions: [
      {
        id: 1,
        question: 'Cho hàm số $f(x) = 2x^2 - 3x + 1$. Đạo hàm của hàm số tại điểm $x = 1$ là:',
        options: [
          { id: 'A', label: 'A', content: '$f\'(1) = 1$' },
          { id: 'B', label: 'B', content: '$f\'(1) = 2$' },
          { id: 'C', label: 'C', content: '$f\'(1) = 3$' },
          { id: 'D', label: 'D', content: '$f\'(1) = 4$' }
        ],
        correctAnswer: 'A',
        explanation: 'Ta có $f\'(x) = 4x - 3$. Vậy $f\'(1) = 4(1) - 3 = 1$.'
      },
      {
        id: 2,
        question: 'Tập xác định của hàm số $y = \\frac{1}{x-2}$ là:',
        options: [
          { id: 'A', label: 'A', content: '$\\mathbb{R}$' },
          { id: 'B', label: 'B', content: '$\\mathbb{R} \\setminus \\{2\\}$' },
          { id: 'C', label: 'C', content: '$\\mathbb{R} \\setminus \\{-2\\}$' },
          { id: 'D', label: 'D', content: '$(2; +\\infty)$' }
        ],
        correctAnswer: 'B',
        explanation: 'Điều kiện xác định: $x - 2 \\neq 0 \\Leftrightarrow x \\neq 2$.'
      },
      {
        id: 3,
        question: 'Hàm số nào sau đây đồng biến trên $\\mathbb{R}$?',
        options: [
          { id: 'A', label: 'A', content: '$y = -x + 1$' },
          { id: 'B', label: 'B', content: '$y = x^2$' },
          { id: 'C', label: 'C', content: '$y = 3x - 2$' },
          { id: 'D', label: 'D', content: '$y = -x^2 + 1$' }
        ],
        correctAnswer: 'C',
        explanation: 'Hàm số bậc nhất $y = ax + b$ đồng biến khi $a > 0$. Trong các đáp án, chỉ có $y = 3x - 2$ có $a = 3 > 0$.'
      },
      {
        id: 4,
        question: 'Đạo hàm của hàm số $y = x^3 - 2x^2 + 3x - 1$ là:',
        options: [
          { id: 'A', label: 'A', content: '$y\' = 3x^2 - 4x + 3$' },
          { id: 'B', label: 'B', content: '$y\' = 3x^2 - 2x + 3$' },
          { id: 'C', label: 'C', content: '$y\' = x^2 - 4x + 3$' },
          { id: 'D', label: 'D', content: '$y\' = 3x^2 - 4x + 1$' }
        ],
        correctAnswer: 'A'
      },
      {
        id: 5,
        question: 'Cho hàm số $f(x) = \\sqrt{x + 1}$. Tập xác định của hàm số là:',
        options: [
          { id: 'A', label: 'A', content: '$[-1; +\\infty)$' },
          { id: 'B', label: 'B', content: '$(-1; +\\infty)$' },
          { id: 'C', label: 'C', content: '$[1; +\\infty)$' },
          { id: 'D', label: 'D', content: '$\\mathbb{R}$' }
        ],
        correctAnswer: 'A'
      },
      {
        id: 6,
        question: 'Hàm số $y = x^2 - 4x + 3$ có bao nhiêu điểm cực trị?',
        options: [
          { id: 'A', label: 'A', content: '0' },
          { id: 'B', label: 'B', content: '1' },
          { id: 'C', label: 'C', content: '2' },
          { id: 'D', label: 'D', content: '3' }
        ],
        correctAnswer: 'B'
      },
      {
        id: 7,
        question: 'Đạo hàm của $y = \\sin(2x)$ là:',
        options: [
          { id: 'A', label: 'A', content: '$y\' = \\cos(2x)$' },
          { id: 'B', label: 'B', content: '$y\' = 2\\cos(2x)$' },
          { id: 'C', label: 'C', content: '$y\' = -\\cos(2x)$' },
          { id: 'D', label: 'D', content: '$y\' = 2\\sin(2x)$' }
        ],
        correctAnswer: 'B'
      },
      {
        id: 8,
        question: 'Giá trị lớn nhất của hàm số $y = -x^2 + 2x + 3$ trên $\\mathbb{R}$ là:',
        options: [
          { id: 'A', label: 'A', content: '3' },
          { id: 'B', label: 'B', content: '4' },
          { id: 'C', label: 'C', content: '5' },
          { id: 'D', label: 'D', content: 'Không tồn tại' }
        ],
        correctAnswer: 'B'
      },
      {
        id: 9,
        question: 'Hàm số nào sau đây là hàm số chẵn?',
        options: [
          { id: 'A', label: 'A', content: '$y = x^3$' },
          { id: 'B', label: 'B', content: '$y = x^2 + 1$' },
          { id: 'C', label: 'C', content: '$y = x + 1$' },
          { id: 'D', label: 'D', content: '$y = x^3 - x$' }
        ],
        correctAnswer: 'B'
      },
      {
        id: 10,
        question: 'Đạo hàm của $y = e^{2x}$ là:',
        options: [
          { id: 'A', label: 'A', content: '$y\' = e^{2x}$' },
          { id: 'B', label: 'B', content: '$y\' = 2e^{2x}$' },
          { id: 'C', label: 'C', content: '$y\' = e^x$' },
          { id: 'D', label: 'D', content: '$y\' = 2e^x$' }
        ],
        correctAnswer: 'B'
      },
      {
        id: 11,
        question: 'Phương trình $x^2 - 4x + 3 = 0$ có nghiệm là:',
        options: [
          { id: 'A', label: 'A', content: '$x = 1$ hoặc $x = 3$' },
          { id: 'B', label: 'B', content: '$x = -1$ hoặc $x = -3$' },
          { id: 'C', label: 'C', content: '$x = 2$' },
          { id: 'D', label: 'D', content: 'Vô nghiệm' }
        ],
        correctAnswer: 'A'
      },
      {
        id: 12,
        question: 'Hàm số $y = \\frac{x+1}{x-1}$ có tiệm cận đứng là:',
        options: [
          { id: 'A', label: 'A', content: '$x = 1$' },
          { id: 'B', label: 'B', content: '$x = -1$' },
          { id: 'C', label: 'C', content: '$y = 1$' },
          { id: 'D', label: 'D', content: 'Không có tiệm cận đứng' }
        ],
        correctAnswer: 'A'
      },
      {
        id: 13,
        question: 'Đạo hàm của $y = \\ln(x)$ là:',
        options: [
          { id: 'A', label: 'A', content: '$y\' = x$' },
          { id: 'B', label: 'B', content: '$y\' = \\frac{1}{x}$' },
          { id: 'C', label: 'C', content: '$y\' = \\ln(x)$' },
          { id: 'D', label: 'D', content: '$y\' = e^x$' }
        ],
        correctAnswer: 'B'
      },
      {
        id: 14,
        question: 'Hàm số $y = x^3 - 3x + 2$ đạt cực tiểu tại:',
        options: [
          { id: 'A', label: 'A', content: '$x = -1$' },
          { id: 'B', label: 'B', content: '$x = 0$' },
          { id: 'C', label: 'C', content: '$x = 1$' },
          { id: 'D', label: 'D', content: '$x = 2$' }
        ],
        correctAnswer: 'C'
      },
      {
        id: 15,
        question: 'Tích phân $\\int_0^1 x dx$ bằng:',
        options: [
          { id: 'A', label: 'A', content: '$\\frac{1}{4}$' },
          { id: 'B', label: 'B', content: '$\\frac{1}{2}$' },
          { id: 'C', label: 'C', content: '$\\frac{1}{3}$' },
          { id: 'D', label: 'D', content: '$1$' }
        ],
        correctAnswer: 'B'
      }
    ]
  };

  // Initialize timer
  useEffect(() => {
    if (!isSubmitted) {
      setTimeRemaining(quiz.duration * 60);
    }
  }, [quiz.duration, isSubmitted]);

  // Countdown timer
  useEffect(() => {
    if (timeRemaining > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (questionIndex: number, optionId: string) => {
    if (!isSubmitted) {
      setAnswers({ ...answers, [questionIndex]: optionId });
    }
  };

  const handleToggleFlag = (questionIndex: number) => {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(questionIndex)) {
      newFlagged.delete(questionIndex);
    } else {
      newFlagged.add(questionIndex);
    }
    setFlaggedQuestions(newFlagged);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowSubmitConfirm(false);
    // TODO: Call API to submit quiz
    console.log('Submitted answers:', answers);
  };

  const handleLogout = () => {
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/auth/login');
  };

  const getQuestionStatus = (index: number) => {
    if (isSubmitted) {
      const answer = answers[index];
      const correct = quiz.questions[index].correctAnswer;
      if (answer === correct) return 'correct';
      if (answer) return 'incorrect';
      return 'unanswered';
    }
    if (answers[index]) return 'answered';
    return 'unanswered';
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return ((correct / quiz.totalQuestions) * quiz.maxScore).toFixed(1);
  };

  const currentQ = quiz.questions[currentQuestion];
  const questionStatus = getQuestionStatus(currentQuestion);

  // Render math formulas using KaTeX
  const renderMath = (text: string) => {
    if (typeof window === 'undefined') return text;
    
    try {
      const katex = require('katex');
      // Replace inline math $...$ with KaTeX rendering
      return text.replace(/\$([^\$]+)\$/g, (_, formula) => {
        try {
          return katex.renderToString(formula, {
            throwOnError: false,
            displayMode: false
          });
        } catch (e) {
          return `$${formula}$`;
        }
      }).replace(/\$\$([^\$]+)\$\$/g, (_, formula) => {
        // Display mode for $$...$$
        try {
          return katex.renderToString(formula, {
            throwOnError: false,
            displayMode: true
          });
        } catch (e) {
          return `$$${formula}$$`;
        }
      });
    } catch (e) {
      return text;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-open-sans">
      {/* Header */}
      <AppHeader
        currentPage="classes"
        userName="Nguyễn Văn A"
        userRole="Học sinh"
        onLogout={handleLogout}
      />

      {/* Quiz Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-poppins">{quiz.title}</h1>
              <p className="text-sm text-gray-600 font-open-sans">{quiz.className}</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Timer */}
              {!isSubmitted && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  timeRemaining < 300 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  <Clock className="w-5 h-5" />
                  <span className="font-bold font-mono text-lg">{formatTime(timeRemaining)}</span>
                </div>
              )}
              {/* Submit Button */}
              {!isSubmitted && (
                <button
                  onClick={() => setShowSubmitConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-open-sans"
                >
                  <Send className="w-4 h-4" />
                  Nộp bài
                </button>
              )}
              {/* Score */}
              {isSubmitted && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-bold">Điểm: {calculateScore()}/{quiz.maxScore}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left - Question Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Question Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium font-open-sans">
                    Câu {currentQuestion + 1}/{quiz.totalQuestions}
                  </span>
                  {flaggedQuestions.has(currentQuestion) && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium font-open-sans flex items-center gap-1">
                      <Flag className="w-4 h-4" />
                      Đã đánh dấu
                    </span>
                  )}
                  {isSubmitted && questionStatus === 'correct' && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium font-open-sans flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Đúng
                    </span>
                  )}
                  {isSubmitted && questionStatus === 'incorrect' && (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium font-open-sans flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Sai
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleToggleFlag(currentQuestion)}
                  className={`p-2 rounded-lg transition-colors ${
                    flaggedQuestions.has(currentQuestion)
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Flag className="w-5 h-5" />
                </button>
              </div>

              {/* Question */}
              <div className="mb-6">
                <div className="text-lg text-gray-900 leading-relaxed font-open-sans"
                  dangerouslySetInnerHTML={{ __html: renderMath(currentQ.question) }}
                />
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((option) => {
                  const isSelected = answers[currentQuestion] === option.id;
                  const isCorrect = isSubmitted && option.id === currentQ.correctAnswer;
                  const isWrong = isSubmitted && isSelected && option.id !== currentQ.correctAnswer;

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectAnswer(currentQuestion, option.id)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        isCorrect
                          ? 'border-green-500 bg-green-50'
                          : isWrong
                          ? 'border-red-500 bg-red-50'
                          : isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                      } ${isSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${
                          isCorrect
                            ? 'bg-green-500 text-white'
                            : isWrong
                            ? 'bg-red-500 text-white'
                            : isSelected
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {option.label}
                        </div>
                        <span className="text-gray-900 font-open-sans"
                          dangerouslySetInnerHTML={{ __html: renderMath(option.content) }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation (After Submit) */}
              {isSubmitted && currentQ.explanation && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 font-poppins flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    Giải thích
                  </h4>
                  <p className="text-gray-700 font-open-sans"
                    dangerouslySetInnerHTML={{ __html: renderMath(currentQ.explanation) }}
                  />
                </div>
              )}

              {/* Navigation */}
              <div className="mt-6 flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-open-sans"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Câu trước
                </button>

                <button
                  onClick={() => setShowQuestionList(!showQuestionList)}
                  className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-open-sans"
                >
                  <List className="w-4 h-4" />
                  Danh sách câu hỏi
                </button>

                <button
                  onClick={() => setCurrentQuestion(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                  disabled={currentQuestion === quiz.questions.length - 1}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-open-sans"
                >
                  Câu sau
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right - Question Navigator */}
          <div className={`lg:col-span-1 ${showQuestionList ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="font-bold text-gray-900 mb-4 font-poppins">
                Danh sách câu hỏi
              </h3>

              {/* Legend */}
              <div className="mb-4 space-y-2 text-xs font-open-sans">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary rounded"></div>
                  <span className="text-gray-600">Đã trả lời</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <span className="text-gray-600">Chưa trả lời</span>
                </div>
                {isSubmitted && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-gray-600">Đúng</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="text-gray-600">Sai</span>
                    </div>
                  </>
                )}
              </div>

              {/* Question Grid */}
              <div className="grid grid-cols-5 gap-2">
                {quiz.questions.map((_, index) => {
                  const status = getQuestionStatus(index);
                  const isFlagged = flaggedQuestions.has(index);
                  const isCurrent = currentQuestion === index;

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentQuestion(index);
                        setShowQuestionList(false);
                      }}
                      className={`aspect-square rounded-lg font-semibold text-sm transition-all relative ${
                        isCurrent
                          ? 'ring-2 ring-primary ring-offset-2'
                          : ''
                      } ${
                        status === 'correct'
                          ? 'bg-green-500 text-white'
                          : status === 'incorrect'
                          ? 'bg-red-500 text-white'
                          : status === 'answered'
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {index + 1}
                      {isFlagged && (
                        <Flag className="w-3 h-3 absolute -top-1 -right-1 text-yellow-500 fill-yellow-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-sm font-open-sans">
                <div className="flex justify-between">
                  <span className="text-gray-600">Đã trả lời:</span>
                  <span className="font-semibold text-gray-900">{Object.keys(answers).length}/{quiz.totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Đánh dấu:</span>
                  <span className="font-semibold text-gray-900">{flaggedQuestions.size}</span>
                </div>
                {isSubmitted && (
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-600">Điểm số:</span>
                    <span className="font-bold text-primary">{calculateScore()}/{quiz.maxScore}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 font-poppins">
              Xác nhận nộp bài
            </h3>
            <p className="text-gray-700 mb-2 font-open-sans">
              Bạn đã trả lời <strong>{Object.keys(answers).length}/{quiz.totalQuestions}</strong> câu hỏi.
            </p>
            {Object.keys(answers).length < quiz.totalQuestions && (
              <p className="text-yellow-700 mb-4 font-open-sans">
                ⚠️ Còn <strong>{quiz.totalQuestions - Object.keys(answers).length}</strong> câu chưa trả lời!
              </p>
            )}
            <p className="text-gray-700 mb-6 font-open-sans">
              Sau khi nộp bài, bạn không thể thay đổi câu trả lời. Bạn có chắc chắn muốn nộp bài?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-open-sans"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-open-sans"
              >
                Nộp bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
