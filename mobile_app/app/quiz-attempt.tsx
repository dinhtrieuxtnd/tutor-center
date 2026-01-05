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
import {
  quizService,
  QuizAttemptResponse,
  QuizAttemptDetailResponse,
  QuizForStudentResponse,
  QuizQuestionForStudentResponse
} from '../services/quizService';

export default function QuizAttemptScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();

  const [attempt, setAttempt] = useState<QuizAttemptResponse | null>(null);
  const [quiz, setQuiz] = useState<QuizForStudentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: number]: number[] }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasExistingAttempt, setHasExistingAttempt] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch quiz and create/load attempt
  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        setIsLoading(true);

        // First, try to get existing attempt
        let existingAttempt: QuizAttemptDetailResponse | null = null;
        try {
          existingAttempt = await quizService.getAttemptByLesson(Number(lessonId));
          setHasExistingAttempt(true);
        } catch (error) {
          // No existing attempt, will create new one
          console.log('No existing attempt found');
        }

        // Load quiz questions
        const quizData = await quizService.getQuizForStudent(Number(lessonId));
        console.log('🔍 Quiz Data from Backend:', JSON.stringify(quizData, null, 2));
        console.log('⏰ Quiz timeLimitSec:', quizData.timeLimitSec);
        setQuiz(quizData);

        if (!quizData || !quizData.questions || quizData.questions.length === 0) {
          throw new Error('Bài kiểm tra chưa có câu hỏi nào');
        }

        let currentAttempt: QuizAttemptResponse;

        if (existingAttempt) {
          // Load existing attempt
          currentAttempt = {
            quizAttemptId: existingAttempt.quizAttemptId,
            lessonId: existingAttempt.lessonId,
            quizId: existingAttempt.quizId,
            studentId: existingAttempt.studentId,
            startedAt: existingAttempt.startedAt,
            submittedAt: existingAttempt.submittedAt,
            status: existingAttempt.status as any,
            scoreRaw: existingAttempt.scoreRaw,
            scoreScaled10: existingAttempt.scoreScaled10,
          };

          // Load saved answers
          const answers: { [key: number]: number[] } = {};
          existingAttempt.answers.forEach(ans => {
            if (ans.selectedOptionId) {
              answers[ans.questionId] = [ans.selectedOptionId];
            }
          });
          setSelectedAnswers(answers);
        } else {
          // Create new attempt
          currentAttempt = await quizService.createAttempt(Number(lessonId));
        }

        setAttempt(currentAttempt);

        // Calculate time remaining
        if (currentAttempt.startedAt && quizData.timeLimitSec) {
          const startTime = new Date(currentAttempt.startedAt).getTime();
          const now = Date.now();
          const elapsed = Math.floor((now - startTime) / 1000);
          const remaining = Math.max(0, quizData.timeLimitSec - elapsed);
          console.log('⏰ Start time:', currentAttempt.startedAt);
          console.log('⏰ Elapsed seconds:', elapsed);
          console.log('⏰ Time remaining:', remaining);
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
  }, [lessonId]);

  // Timer countdown
  useEffect(() => {
    if (attempt?.status === 'in_progress' && timeRemaining > 0) {
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
          timerRef.current = null;
        }
      };
    }
  }, [attempt?.status]);

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

    console.log('=== SELECT ANSWER ===');
    console.log('Question ID:', questionId);
    console.log('Option ID:', optionId);
    console.log('Before - selectedAnswers:', JSON.stringify(selectedAnswers));

    // Update local state
    const newAnswers = {
      ...selectedAnswers,
      [questionId]: [optionId], // Single choice for now
    };
    
    console.log('After - newAnswers:', JSON.stringify(newAnswers));
    setSelectedAnswers(newAnswers);

    // Save to server
    try {
      setIsSaving(true);

      // Check if answer already exists
      const existingAnswer = selectedAnswers[questionId];

      if (existingAnswer && existingAnswer.length > 0) {
        await quizService.updateAnswer(attempt!.quizAttemptId, questionId, [optionId]);
      } else {
        await quizService.createAnswer(attempt!.quizAttemptId, questionId, [optionId]);
      }

      console.log('Answer saved successfully');
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
              // Submit the quiz attempt
              await quizService.submitAttempt(Number(lessonId));
              
              // Navigate to result with lessonId
              router.replace({
                pathname: '/quiz-result',
                params: { lessonId: lessonId },
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

  if (!attempt || !quiz || quiz.questions.length === 0) {
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

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{quiz.title || 'Bài kiểm tra'}</Text>
          <Text style={styles.headerSubtitle}>
            Câu {currentQuestionIndex + 1}/{quiz.questions.length}
          </Text>
        </View>
        {quiz.timeLimitSec && quiz.timeLimitSec > 0 && (
          <View style={[styles.timer, timeRemaining === 0 ? styles.timerExpired : timeRemaining < 300 && styles.timerWarning]}>
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
        {quiz.questions.map((q, index) => (
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
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionNumber}>Câu hỏi {currentQuestionIndex + 1}</Text>
            <Text style={styles.questionPoints}>{currentQuestion?.points || 1} điểm</Text>
          </View>
          <Text style={styles.questionText}>{currentQuestion?.content || ''}</Text>

          {/* Options */}
          <Text style={styles.optionsNote}>
            Chọn một đáp án đúng nhất:
          </Text>
          {currentQuestion?.options.map((option) => {
            const currentQuestionAnswers = selectedAnswers[currentQuestion.questionId];
            const isSelected = currentQuestionAnswers?.includes(option.questionOptionId);
            
            console.log(`\nRendering Option:`);
            console.log(`  - Option ID: ${option.questionOptionId}`);
            console.log(`  - Content: ${option.content}`);
            console.log(`  - Question ID: ${currentQuestion.questionId}`);
            console.log(`  - Current answers for this Q:`, currentQuestionAnswers);
            console.log(`  - Is Selected: ${isSelected}`);
            
            return (
              <TouchableOpacity
                key={option.questionOptionId}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionSelected,
                ]}
                onPress={() => handleSelectAnswer(currentQuestion.questionId, option.questionOptionId)}
                disabled={attempt?.status !== 'in_progress'}
              >
                <View
                  style={[
                    styles.optionRadio,
                    isSelected && styles.optionRadioSelected,
                  ]}
                >
                  {isSelected && (
                    <View style={styles.optionRadioInner} />
                  )}
                </View>
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {option.content}
                </Text>
              </TouchableOpacity>
            );
          })}
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
          onPress={() => setCurrentQuestionIndex(prev => Math.min(quiz.questions.length - 1, prev + 1))}
          disabled={currentQuestionIndex === quiz.questions.length - 1}
        >
          <Text style={[
            styles.footerBtnText,
            currentQuestionIndex === quiz.questions.length - 1 && styles.footerBtnTextDisabled
          ]}>
            Sau
          </Text>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={currentQuestionIndex === quiz.questions.length - 1 ? '#9CA3AF' : '#007AFF'}
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
  timerExpired: {
    backgroundColor: '#7C3AED',
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
    maxHeight: 70,
  },
  questionNavContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    padding: 16,
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 0,
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
    marginBottom: 6,
  },
  questionNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: '#007AFF',
  },
  questionPoints: {
    fontSize: 13,
    color: '#6B7280',
  },
  questionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1F2937',
    marginBottom: 12,
  },
  optionsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
  },
  optionsNote: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
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
