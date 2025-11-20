'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  QuizHeader,
  QuizQuestion,
  QuizNavigation,
  QuizSidebar,
  SubmitConfirmModal,
} from './components';
import 'katex/dist/katex.min.css';

interface QuizOption {
  id: string;
  label: string;
  content: string;
  image?: string; // URL hình ảnh cho option
}

interface QuizQuestion {
  id: number;
  question: string;
  image?: string; // URL hình ảnh cho câu hỏi
  options: QuizOption[];
  correctAnswer?: string;
  explanation?: string;
}

interface QuestionGroup {
  id: number;
  context: string; // Đề bài chung cho nhóm câu hỏi
  contextImage?: string; // URL hình ảnh cho context
  questions: QuizQuestion[];
}

interface QuizSection {
  id: number;
  title: string;
  description?: string;
  questionGroups: QuestionGroup[];
  questions: QuizQuestion[]; // Câu hỏi đơn lẻ không thuộc group
}

interface QuizData {
  id: number;
  classId: number;
  className: string;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  maxScore: number;
  dueDate: string;
  sections: QuizSection[];
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
  const [fontSize, setFontSize] = useState(16); // Font size for questions
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [imageSize, setImageSize] = useState(100); // Image size percentage

  // Mock data
  const quiz: QuizData = {
    id: Number(quizId),
    classId: 1,
    className: 'Toán 12 - Luyện thi THPT QG',
    title: 'Kiểm tra giữa kỳ',
    description: 'Bài kiểm tra trắc nghiệm về hàm số và đạo hàm',
    duration: 45,
    totalQuestions: 25,
    maxScore: 10,
    dueDate: '30/11/2025',
    sections: [
      {
        id: 1,
        title: 'Phần I: Trắc nghiệm đơn',
        description: 'Chọn đáp án đúng nhất cho mỗi câu hỏi',
        questionGroups: [],
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
          },
          {
            id: 16,
            question: 'Quan sát đồ thị hàm số $y = f(x)$ trong hình vẽ. Hàm số đồng biến trên khoảng nào?',
            image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop',
            options: [
              { id: 'A', label: 'A', content: '$(-\\infty; -1)$' },
              { id: 'B', label: 'B', content: '$(-1; 1)$' },
              { id: 'C', label: 'C', content: '$(1; +\\infty)$' },
              { id: 'D', label: 'D', content: '$(-\\infty; -1)$ và $(1; +\\infty)$' }
            ],
            correctAnswer: 'B',
            explanation: 'Quan sát đồ thị, hàm số đồng biến trên khoảng $(-1; 1)$ vì đồ thị đi lên từ trái sang phải trong khoảng này.'
          },
          {
            id: 17,
            question: 'Cho hình chóp $S.ABCD$ có đáy là hình vuông cạnh $a$, cạnh bên $SA$ vuông góc với đáy và $SA = a$. Thể tích khối chóp là:',
            image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&h=400&fit=crop',
            options: [
              { id: 'A', label: 'A', content: '$\\frac{a^3}{3}$' },
              { id: 'B', label: 'B', content: '$\\frac{a^3}{6}$' },
              { id: 'C', label: 'C', content: '$a^3$' },
              { id: 'D', label: 'D', content: '$\\frac{2a^3}{3}$' }
            ],
            correctAnswer: 'A',
            explanation: 'Thể tích khối chóp: $V = \\frac{1}{3} \\cdot S_{\\text{đáy}} \\cdot h = \\frac{1}{3} \\cdot a^2 \\cdot a = \\frac{a^3}{3}$.'
          },
          {
            id: 18,
            question: 'Biểu đồ dưới đây biểu diễn doanh thu của một công ty qua các tháng. Tháng nào có doanh thu cao nhất?',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
            options: [
              { id: 'A', label: 'A', content: 'Tháng 3' },
              { id: 'B', label: 'B', content: 'Tháng 6' },
              { id: 'C', label: 'C', content: 'Tháng 9' },
              { id: 'D', label: 'D', content: 'Tháng 12' }
            ],
            correctAnswer: 'D'
          }
        ]
      },
      {
        id: 2,
        title: 'Phần II: Câu hỏi theo nhóm',
        description: 'Đọc đề bài chung và trả lời các câu hỏi',
        questionGroups: [
          {
            id: 1,
            context: 'Cho hàm số $y = f(x) = x^3 - 3x^2 + 2$ có đồ thị $(C)$ như hình vẽ:',
            contextImage: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=600&h=400&fit=crop',
            questions: [
              {
                id: 20,
                question: 'Tập xác định của hàm số là:',
                options: [
                  { id: 'A', label: 'A', content: '$\\mathbb{R}$' },
                  { id: 'B', label: 'B', content: '$\\mathbb{R} \\setminus \\{0\\}$' },
                  { id: 'C', label: 'C', content: '$[0; +\\infty)$' },
                  { id: 'D', label: 'D', content: '$(-\\infty; 0]$' }
                ],
                correctAnswer: 'A',
                explanation: 'Hàm đa thức xác định trên toàn bộ $\\mathbb{R}$.'
              },
              {
                id: 21,
                question: 'Đạo hàm của hàm số là:',
                options: [
                  { id: 'A', label: 'A', content: '$f\'(x) = 3x^2 - 6x$' },
                  { id: 'B', label: 'B', content: '$f\'(x) = 3x^2 - 3x$' },
                  { id: 'C', label: 'C', content: '$f\'(x) = x^2 - 6x$' },
                  { id: 'D', label: 'D', content: '$f\'(x) = 3x^2 + 6x$' }
                ],
                correctAnswer: 'A'
              },
              {
                id: 22,
                question: 'Hàm số đạt cực đại tại điểm nào?',
                options: [
                  { id: 'A', label: 'A', content: '$x = 0$' },
                  { id: 'B', label: 'B', content: '$x = 1$' },
                  { id: 'C', label: 'C', content: '$x = 2$' },
                  { id: 'D', label: 'D', content: '$x = -1$' }
                ],
                correctAnswer: 'A',
                explanation: '$f\'(x) = 0 \\Leftrightarrow x = 0$ hoặc $x = 2$. Với $x = 0$ là điểm cực đại.'
              },
              {
                id: 23,
                question: 'Giá trị cực đại của hàm số là:',
                options: [
                  { id: 'A', label: 'A', content: '$0$' },
                  { id: 'B', label: 'B', content: '$2$' },
                  { id: 'C', label: 'C', content: '$-2$' },
                  { id: 'D', label: 'D', content: '$1$' }
                ],
                correctAnswer: 'B',
                explanation: '$f(0) = 0^3 - 3(0)^2 + 2 = 2$.'
              }
            ]
          },
          {
            id: 2,
            context: 'Trong không gian $Oxyz$, cho ba điểm $A(1; 0; 0)$, $B(0; 2; 0)$, $C(0; 0; 3)$ như hình vẽ:',
            contextImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop',
            questions: [
              {
                id: 24,
                question: 'Tọa độ véc tơ $\\overrightarrow{AB}$ là:',
                options: [
                  { id: 'A', label: 'A', content: '$(1; 2; 0)$' },
                  { id: 'B', label: 'B', content: '$(-1; 2; 0)$' },
                  { id: 'C', label: 'C', content: '$(1; -2; 0)$' },
                  { id: 'D', label: 'D', content: '$(-1; -2; 0)$' }
                ],
                correctAnswer: 'B',
                explanation: '$\\overrightarrow{AB} = (0-1; 2-0; 0-0) = (-1; 2; 0)$.'
              },
              {
                id: 25,
                question: 'Độ dài đoạn thẳng $AB$ là:',
                options: [
                  { id: 'A', label: 'A', content: '$\\sqrt{3}$' },
                  { id: 'B', label: 'B', content: '$\\sqrt{5}$' },
                  { id: 'C', label: 'C', content: '$3$' },
                  { id: 'D', label: 'D', content: '$5$' }
                ],
                correctAnswer: 'B',
                explanation: '$AB = \\sqrt{(-1)^2 + 2^2 + 0^2} = \\sqrt{5}$.'
              },
              {
                id: 26,
                question: 'Phương trình mặt phẳng $(ABC)$ là:',
                options: [
                  { id: 'A', label: 'A', content: '$6x + 3y + 2z - 6 = 0$' },
                  { id: 'B', label: 'B', content: '$x + y + z - 1 = 0$' },
                  { id: 'C', label: 'C', content: '$2x + 3y + 6z - 6 = 0$' },
                  { id: 'D', label: 'D', content: '$6x + 3y + 2z + 6 = 0$' }
                ],
                correctAnswer: 'A'
              }
            ]
          }
        ],
        questions: []
      },
      {
        id: 3,
        title: 'Phần III: Tổ hợp mệnh đề',
        description: 'Xét tính đúng sai của các mệnh đề',
        questionGroups: [
          {
            id: 3,
            context: 'Cho hình vẽ biểu diễn đồ thị hàm số $y = \\frac{2x - 1}{x + 1}$. Xét các mệnh đề sau:',
            contextImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
            questions: [
              {
                id: 27,
                question: 'Mệnh đề a) Tập xác định: $D = \\mathbb{R} \\setminus \\{-1\\}$',
                options: [
                  { id: 'A', label: 'Đúng', content: 'Đúng' },
                  { id: 'B', label: 'Sai', content: 'Sai' }
                ],
                correctAnswer: 'A'
              },
              {
                id: 28,
                question: 'Mệnh đề b) Hàm số có tiệm cận đứng $x = 1$',
                options: [
                  { id: 'A', label: 'Đúng', content: 'Đúng' },
                  { id: 'B', label: 'Sai', content: 'Sai' }
                ],
                correctAnswer: 'B',
                explanation: 'Tiệm cận đứng là $x = -1$ chứ không phải $x = 1$.'
              },
              {
                id: 29,
                question: 'Mệnh đề c) Hàm số có tiệm cận ngang $y = 2$',
                options: [
                  { id: 'A', label: 'Đúng', content: 'Đúng' },
                  { id: 'B', label: 'Sai', content: 'Sai' }
                ],
                correctAnswer: 'A',
                explanation: '$\\lim_{x \\to \\infty} \\frac{2x - 1}{x + 1} = 2$.'
              }
            ]
          }
        ],
        questions: []
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

  // Helper: Flatten all questions from sections
  const getAllQuestions = (): QuizQuestion[] => {
    const allQuestions: QuizQuestion[] = [];
    quiz.sections.forEach(section => {
      // Add standalone questions
      allQuestions.push(...section.questions);
      // Add questions from groups
      section.questionGroups.forEach(group => {
        allQuestions.push(...group.questions);
      });
    });
    return allQuestions;
  };

  // Helper: Get question group context if exists
  const getQuestionContext = (questionId: number): string | null => {
    for (const section of quiz.sections) {
      for (const group of section.questionGroups) {
        if (group.questions.some(q => q.id === questionId)) {
          return group.context;
        }
      }
    }
    return null;
  };

  // Helper: Get section for a question
  const getQuestionSection = (questionIndex: number): QuizSection | null => {
    const allQuestions = getAllQuestions();
    const questionId = allQuestions[questionIndex]?.id;

    for (const section of quiz.sections) {
      if (section.questions.some(q => q.id === questionId)) return section;
      for (const group of section.questionGroups) {
        if (group.questions.some(q => q.id === questionId)) return section;
      }
    }
    return null;
  };

  // Helper: Get question range for a group (e.g., "Câu 16-19")
  const getQuestionRange = (questionId: number): string | null => {
    const allQuestions = getAllQuestions();

    for (const section of quiz.sections) {
      for (const group of section.questionGroups) {
        const questionIds = group.questions.map(q => q.id);
        if (questionIds.includes(questionId)) {
          // Find start and end index in flattened array
          const startIdx = allQuestions.findIndex(q => q.id === questionIds[0]);
          const endIdx = allQuestions.findIndex(q => q.id === questionIds[questionIds.length - 1]);

          if (startIdx !== -1 && endIdx !== -1) {
            return `Câu ${startIdx + 1}-${endIdx + 1}`;
          }
        }
      }
    }
    return null;
  };

  const allQuestions = getAllQuestions();

  const calculateScore = () => {
    let correct = 0;
    allQuestions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return ((correct / quiz.totalQuestions) * quiz.maxScore).toFixed(1);
  };

  const currentQ = allQuestions[currentQuestion];
  const currentContext = currentQ ? getQuestionContext(currentQ.id) : null;
  const currentSection = getQuestionSection(currentQuestion);

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
    <div className={`min-h-screen font-open-sans ${isDarkMode
      ? 'bg-gradient-to-br from-gray-900 to-gray-800'
      : 'bg-gradient-to-br from-gray-50 to-gray-100'
      }`}>
      {/* Quiz Header */}
      <QuizHeader
        title={quiz.title}
        className={quiz.className}
        timeRemaining={timeRemaining}
        isSubmitted={isSubmitted}
        score={isSubmitted ? calculateScore() : undefined}
        maxScore={quiz.maxScore}
        onSubmit={() => setShowSubmitConfirm(true)}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        isDarkMode={isDarkMode}
        onDarkModeToggle={() => setIsDarkMode(!isDarkMode)}
        imageSize={imageSize}
        onImageSizeChange={setImageSize}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left - Question Content */}
          <div className="lg:col-span-3 space-y-4">
            {/* Section Header */}
            {currentSection && (
              <div className={`rounded-xl p-4 border ${isDarkMode
                ? 'bg-gradient-to-r from-primary/20 to-blue-900/30 border-primary/30'
                : 'bg-gradient-to-r from-primary/10 to-blue-100 border-primary/20'
                }`}>
                <h3 className={`font-bold font-poppins text-lg ${isDarkMode ? 'text-blue-300' : 'text-primary'
                  }`}>
                  {currentSection.title}
                </h3>
                {currentSection.description && (
                  <p className={`text-sm font-open-sans mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                    {currentSection.description}
                  </p>
                )}
              </div>
            )}

            {/* Question Group Context */}
            {currentContext && (
              <div className={`rounded-xl p-5 border ${isDarkMode
                ? 'bg-amber-900/20 border-amber-700/30'
                : 'bg-amber-50 border-amber-200'
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-semibold font-poppins flex items-center gap-2 ${isDarkMode ? 'text-amber-300' : 'text-amber-900'
                    }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Đề bài chung:
                  </h4>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${isDarkMode
                    ? 'text-amber-300 bg-amber-900/40'
                    : 'text-amber-800 bg-amber-100'
                    }`}>
                    {getQuestionRange(currentQ.id)}
                  </span>
                </div>
                <div
                  className={`font-open-sans leading-relaxed mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}
                  style={{ fontSize: `${fontSize}px` }}
                  dangerouslySetInnerHTML={{ __html: renderMath(currentContext) }}
                />
                {(() => {
                  // Find context image for current question
                  for (const section of quiz.sections) {
                    for (const group of section.questionGroups) {
                      if (group.questions.some(q => q.id === currentQ.id) && group.contextImage) {
                        return (
                          <div className="mt-3 rounded-lg overflow-hidden border-2 border-amber-300">
                            <img 
                              src={group.contextImage} 
                              alt="Hình minh họa đề bài chung"
                              className="w-full h-auto object-contain bg-white"
                              style={{ maxHeight: `${384 * (imageSize / 100)}px` }}
                            />
                          </div>
                        );
                      }
                    }
                  }
                  return null;
                })()}
              </div>
            )}

            <QuizQuestion
              questionNumber={currentQuestion + 1}
              totalQuestions={quiz.totalQuestions}
              question={currentQ.question}
              image={currentQ.image}
              options={currentQ.options}
              selectedAnswer={answers[currentQuestion]}
              correctAnswer={currentQ.correctAnswer}
              explanation={currentQ.explanation}
              isSubmitted={isSubmitted}
              isFlagged={flaggedQuestions.has(currentQuestion)}
              onSelectAnswer={(optionId) => handleSelectAnswer(currentQuestion, optionId)}
              onToggleFlag={() => handleToggleFlag(currentQuestion)}
              renderMath={renderMath}
              fontSize={fontSize}
              isDarkMode={isDarkMode}
              imageSize={imageSize}
            />

            <QuizNavigation
              currentQuestion={currentQuestion}
              totalQuestions={quiz.totalQuestions}
              onPrevious={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              onNext={() =>
                setCurrentQuestion((prev) => Math.min(allQuestions.length - 1, prev + 1))
              }
              onToggleList={() => setShowQuestionList(!showQuestionList)}
              isDarkMode={isDarkMode}
            />
          </div>



          {/* Question Grid */}
          <QuizSidebar
            sections={quiz.sections}
            currentQuestion={currentQuestion}
            answers={answers}
            flaggedQuestions={flaggedQuestions}
            isSubmitted={isSubmitted}
            correctAnswers={allQuestions.map(q => q.correctAnswer || '')}
            score={isSubmitted ? calculateScore() : undefined}
            maxScore={quiz.maxScore}
            showOnMobile={showQuestionList}
            onSelectQuestion={(index) => {
              setCurrentQuestion(index);
              setShowQuestionList(false);
            }}
            isDarkMode={isDarkMode}
          />

        </div>
      </main>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <SubmitConfirmModal
          show={showSubmitConfirm}
          onCancel={() => setShowSubmitConfirm(false)}
          onConfirm={handleSubmit}
          answeredCount={Object.keys(answers).length}
          totalQuestions={quiz.totalQuestions}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}
