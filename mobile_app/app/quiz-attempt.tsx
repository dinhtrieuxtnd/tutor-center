import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { quizService, QuizAttemptResponse, QuizAttemptDetailResponse, QuizQuestionResponse, QuizDetailResponse } from '../services/quizService';
import { lessonService, LessonResponse } from '../services/lessonService';

export default function QuizAttemptScreen() {
  const { lessonId, attemptId } = useLocalSearchParams<{
    lessonId: string;
    attemptId?: string;
  }>();
  const router = useRouter();

  const [lesson, setLesson] = useState<LessonResponse | null>(null);
  const [attempt, setAttempt] = useState<QuizAttemptResponse | null>(null);
  const [attemptDetail, setAttemptDetail] = useState<QuizAttemptDetailResponse | null>(null);
  const [quizDetail, setQuizDetail] = useState<QuizDetailResponse | null>(null);
  const [questions, setQuestions] = useState<QuizQuestionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: number]: number }>({});
  const [isSaving, setIsSaving] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch lesson and create/load attempt
  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        setIsLoading(true);

        let currentAttempt: QuizAttemptResponse;
        
        if (attemptId) {
          // Load existing attempt
          const detail = await quizService.getAttemptDetail(Number(attemptId));
          currentAttempt = {
            quizAttemptId: detail.quizAttemptId,
            lessonId: detail.lessonId,
            quizId: detail.quizId,
            studentId: detail.studentId,
            startedAt: detail.startedAt,
            submittedAt: detail.submittedAt,
            status: detail.status as any,
            scoreRaw: detail.scoreRaw,
            scoreScaled10: detail.scoreScaled10,
          };
          setAttemptDetail(detail);
          
          // Load saved answers
          const answers: { [key: number]: number } = {};
          detail.answers.forEach(ans => {
            answers[ans.questionId] = ans.optionId;
          });
          setSelectedAnswers(answers);
        } else {
          // Create new attempt
          currentAttempt = await quizService.createAttempt(Number(lessonId));
        }
        
        setAttempt(currentAttempt);

        // Load quiz detail to get questions
        console.log('Fetching quiz detail for quizId:', currentAttempt.quizId);
        const quizDetailData = await quizService.getQuizDetail(currentAttempt.quizId);
        console.log('Quiz detail received:', JSON.stringify(quizDetailData, null, 2));
        
        setQuizDetail(quizDetailData);
        
        if (quizDetailData && quizDetailData.questions && quizDetailData.questions.length > 0) {
          console.log('Setting questions, count:', quizDetailData.questions.length);
          setQuestions(quizDetailData.questions);
        } else {
          console.error('No questions found in quiz detail');
          throw new Error('Bài kiểm tra chưa có câu hỏi nào');
        }

        // Calculate time remaining
        if (currentAttempt.startedAt && quizDetailData.timeLimitSec) {
          const startTime = new Date(currentAttempt.startedAt).getTime();
          const now = Date.now();
          const elapsed = Math.floor((now - startTime) / 1000);
          const remaining = Math.max(0, quizDetailData.timeLimitSec - elapsed);
          setTimeRemaining(remaining);
        }
      } catch (error: any) {
        console.error('Error initializing quiz:', error);
        Alert.alert('Lỗi', error.message || 'Không thể tải bài kiểm tra', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeQuiz();

    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [lessonId, attemptId]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && attempt?.status === 'in_progress') {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [timeRemaining, attempt?.status]);

  const handleAutoSubmit = async () => {
    Alert.alert(
      'Hết giờ',
      'Thời gian làm bài đã hết. Bài làm của bạn sẽ được tự động nộp.',
      [{ text: 'OK', onPress: () => handleSubmit() }]
    );
  };

  const handleSelectAnswer = async (questionId: number, optionId: number) => {
    if (attempt?.status !== 'in_progress') {
      return;
    }

    // Update local state
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId,
    }));

    // Save to server
    try {
      setIsSaving(true);
      
      // Check if answer already exists
      const existingAnswer = attemptDetail?.answers.find(a => a.questionId === questionId);
      
      if (existingAnswer) {
        await quizService.updateAnswer(attempt!.quizAttemptId, questionId, optionId);
      } else {
        await quizService.submitAnswer(attempt!.quizAttemptId, questionId, optionId);
      }
      
      console.log('Answer saved:', questionId, optionId);
    } catch (error: any) {
      console.error('Error saving answer:', error);
      // Don't show error to user, they can continue
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!attempt) return;

    Alert.alert(
      'Nộp bài',
      'Bạn có chắc chắn muốn nộp bài? Bạn sẽ không thể thay đổi câu trả lời sau khi nộp.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Nộp bài',
          style: 'destructive',
          onPress: async () => {
            try {
              // Submit is handled by backend when all questions are answered
              // For now, just navigate to result
              router.replace({
                pathname: '/quiz-result',
                params: { attemptId: attempt.quizAttemptId.toString() },
              });
            } catch (error: any) {
              Alert.alert('Lỗi', error.message || 'Không thể nộp bài');
            }
          },
        },
      ]
    );
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải bài kiểm tra...</Text>
      </View>
    );
  }

  if (!attempt || questions.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#EF4444" />
        <Text style={styles.errorText}>Không thể tải bài kiểm tra</Text>
        <TouchableOpacity style={styles.errorButton} onPress={() => router.back()}>
          <Text style={styles.errorButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{quizDetail?.title || 'Bài kiểm tra'}</Text>
          <Text style={styles.headerSubtitle}>
            Câu {currentQuestionIndex + 1}/{questions.length}
          </Text>
        </View>
        {timeRemaining > 0 && (
          <View style={[styles.timer, timeRemaining < 300 && styles.timerWarning]}>
            <Ionicons name="time" size={20} color="white" />
            <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
          </View>
        )}
      </View>

      {/* Question Navigation */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.questionNav}
        contentContainerStyle={styles.questionNavContent}
      >
        {questions.map((q, index) => (
          <TouchableOpacity
            key={q.questionId}
            style={[
              styles.questionNavItem,
              currentQuestionIndex === index && styles.questionNavItemActive,
              !!selectedAnswers[q.questionId] && styles.questionNavItemAnswered,
            ]}
            onPress={() => setCurrentQuestionIndex(index)}
          >
            <Text
              style={[
                styles.questionNavText,
                currentQuestionIndex === index && styles.questionNavTextActive,
              ]}
            >
              {index + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Question Content */}
      <ScrollView style={styles.content}>
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionNumber}>Câu hỏi {currentQuestionIndex + 1}</Text>
            <Text style={styles.questionPoints}>{currentQuestion?.points || 1} điểm</Text>
          </View>
          <Text style={styles.questionText}>{currentQuestion?.content || ''}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          <Text style={styles.optionsNote}>
            Chọn một đáp án đúng nhất:
          </Text>
          {currentQuestion?.options.map((option) => (
            <TouchableOpacity
              key={option.questionOptionId}
              style={[
                styles.optionCard,
                selectedAnswers[currentQuestion.questionId] === option.questionOptionId &&
                  styles.optionSelected,
              ]}
              onPress={() => handleSelectAnswer(currentQuestion.questionId, option.questionOptionId)}
              disabled={attempt?.status !== 'in_progress'}
            >
              <View
                style={[
                  styles.optionRadio,
                  selectedAnswers[currentQuestion.questionId] === option.questionOptionId &&
                    styles.optionRadioSelected,
                ]}
              >
                {selectedAnswers[currentQuestion.questionId] === option.questionOptionId && (
                  <View style={styles.optionRadioInner} />
                )}
              </View>
              <Text
                style={[
                  styles.optionText,
                  selectedAnswers[currentQuestion.questionId] === option.questionOptionId &&
                    styles.optionTextSelected,
                ]}
              >
                {option.content}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerBtn, styles.prevBtn]}
          onPress={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
        >
          <Ionicons name="chevron-back" size={24} color={currentQuestionIndex === 0 ? '#9CA3AF' : '#007AFF'} />
          <Text style={[styles.footerBtnText, currentQuestionIndex === 0 && styles.footerBtnTextDisabled]}>
            Trước
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerBtn, styles.submitBtn]}
          onPress={handleSubmit}
        >
          <Ionicons name="checkmark-circle" size={24} color="white" />
          <Text style={styles.submitBtnText}>Nộp bài</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerBtn, styles.nextBtn]}
          onPress={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          <Text style={[
            styles.footerBtnText,
            currentQuestionIndex === questions.length - 1 && styles.footerBtnTextDisabled
          ]}>
            Sau
          </Text>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={currentQuestionIndex === questions.length - 1 ? '#9CA3AF' : '#007AFF'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 24,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  errorButton: {
    marginTop: 24,
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginTop: 2,
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  timerWarning: {
    backgroundColor: '#EF4444',
  },
  timerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  questionNav: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  questionNavContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  questionNavItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  questionNavItemActive: {
    backgroundColor: '#007AFF',
  },
  questionNavItemAnswered: {
    backgroundColor: '#10B981',
  },
  questionNavText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  questionNavTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  questionPoints: {
    fontSize: 14,
    color: '#6B7280',
  },
  questionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1F2937',
  },
  optionsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  optionsNote: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  optionSelected: {
    backgroundColor: '#EBF5FF',
    borderColor: '#007AFF',
  },
  optionRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionRadioSelected: {
    borderColor: '#007AFF',
  },
  optionRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
  },
  optionTextSelected: {
    color: '#007AFF',
    fontWeight: '500',
  },
  placeholder: {
    alignItems: 'center',
    padding: 32,
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 16,
    gap: 12,
  },
  footerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  prevBtn: {
    backgroundColor: '#F3F4F6',
  },
  nextBtn: {
    backgroundColor: '#F3F4F6',
  },
  submitBtn: {
    backgroundColor: '#10B981',
    flex: 1.5,
  },
  footerBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  footerBtnTextDisabled: {
    color: '#9CA3AF',
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
