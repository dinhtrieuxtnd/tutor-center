import React, { useEffect, useState } from 'react';
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
import { quizService, QuizAttemptDetailResponse } from '../services/quizService';
import LatexMarkdownViewer from '../components/LatexMarkdownViewer';

export default function QuizResultScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();

  const [attemptDetail, setAttemptDetail] = useState<QuizAttemptDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setIsLoading(true);
        const detail = await quizService.getAttemptByLesson(Number(lessonId));
        console.log('📊 Quiz Result from Backend:', JSON.stringify(detail, null, 2));
        setAttemptDetail(detail);
      } catch (error: any) {
        console.error('Error fetching quiz result:', error);
        Alert.alert('Lỗi', error.message || 'Không thể tải kết quả bài kiểm tra', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [lessonId]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateStats = () => {
    if (!attemptDetail) return { correct: 0, incorrect: 0, total: 0 };
    
    const correct = attemptDetail.answers.filter(a => a.isCorrect).length;
    const total = attemptDetail.answers.length;
    const incorrect = total - correct;
    
    return { correct, incorrect, total };
  };

  const calculateScore = (): number | undefined => {
    if (!attemptDetail || !attemptDetail.answers.length) return undefined;
    
    // Nếu đã có điểm từ backend (submitted)
    if (attemptDetail.scoreScaled10 && attemptDetail.scoreScaled10 > 0) {
      return attemptDetail.scoreScaled10;
    }
    
    // Tự tính điểm dựa trên số câu đúng (khi chưa submit)
    const stats = calculateStats();
    return (stats.correct / stats.total) * 10;
  };

  const getScoreColor = (score?: number): string => {
    if (!score) return '#9CA3AF';
    if (score >= 8) return '#10B981';
    if (score >= 5) return '#F59E0B';
    return '#EF4444';
  };

  const getScoreLabel = (score?: number): string => {
    if (!score) return 'Chưa chấm';
    if (score >= 8) return 'Xuất sắc';
    if (score >= 6.5) return 'Khá';
    if (score >= 5) return 'Trung bình';
    return 'Yếu';
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải kết quả...</Text>
      </View>
    );
  }

  if (!attemptDetail) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#EF4444" />
        <Text style={styles.errorText}>Không thể tải kết quả</Text>
        <TouchableOpacity style={styles.errorButton} onPress={() => router.back()}>
          <Text style={styles.errorButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const stats = calculateStats();
  const scoreValue = calculateScore();
  const scoreColor = getScoreColor(scoreValue);

  // Check display permissions
  const showScore = attemptDetail.showQuizScore;
  const showAnswers = attemptDetail.showQuizAnswers;
  const showNothing = !showScore && !showAnswers;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Kết quả bài kiểm tra</Text>
          <Text style={styles.headerSubtitle}>{attemptDetail.quizTitle}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Show completion message only if nothing is allowed */}
        {showNothing && (
          <View style={styles.completionCard}>
            <Ionicons name="checkmark-circle" size={64} color="#10B981" />
            <Text style={styles.completionTitle}>Bạn đã hoàn thành bài thi</Text>
            <Text style={styles.completionText}>
              Giáo viên sẽ công bố kết quả sau
            </Text>
          </View>
        )}

        {/* Score Card - only show if showScore is true */}
        {showScore && (
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <Ionicons name="trophy" size={32} color={scoreColor} />
            <Text style={styles.scoreTitle}>Điểm của bạn</Text>
          </View>
          
          <View style={styles.scoreContent}>
            <Text style={[styles.scoreValue, { color: scoreColor }]}>
              {scoreValue?.toFixed(1) || '--'}
            </Text>
            <Text style={styles.scoreScale}>/10</Text>
          </View>
          
          <Text style={[styles.scoreLabel, { color: scoreColor }]}>
            {getScoreLabel(scoreValue)}
          </Text>

          <View style={styles.scoreStats}>
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              <Text style={styles.statValue}>{stats.correct}</Text>
              <Text style={styles.statLabel}>Đúng</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Ionicons name="close-circle" size={24} color="#EF4444" />
              <Text style={styles.statValue}>{stats.incorrect}</Text>
              <Text style={styles.statLabel}>Sai</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Ionicons name="document-text" size={24} color="#007AFF" />
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Tổng</Text>
            </View>
          </View>
        </View>
        )}

        {/* Attempt Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            {/* <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Trạng thái</Text>
              <View style={[
                styles.statusBadge,
                attemptDetail.status === 'submitted' && styles.statusSubmitted,
                attemptDetail.status === 'graded' && styles.statusGraded,
              ]}>
                <Text style={styles.statusText}>
                  {attemptDetail.status === 'submitted' ? 'Đã nộp' : 
                   attemptDetail.status === 'graded' ? 'Đã chấm' : 
                   'Đang làm'}
                </Text>
              </View>
            </View> */}
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Bắt đầu</Text>
              <Text style={styles.infoValue}>{formatDate(attemptDetail.startedAt)}</Text>
            </View>
          </View>

          {attemptDetail.submittedAt && (
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Nộp bài</Text>
                <Text style={styles.infoValue}>{formatDate(attemptDetail.submittedAt)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Answer Details - only show if showAnswers is true */}
        {showAnswers && (
        <View style={styles.answersSection}>
          <Text style={styles.sectionTitle}>Chi tiết câu trả lời</Text>
          
          {attemptDetail.answers.map((answer, index) => (
            <View
              key={answer.questionId}
              style={[
                styles.answerCard,
                answer.isCorrect ? styles.answerCorrect : styles.answerIncorrect,
              ]}
            >
              <View style={styles.answerHeader}>
                <Text style={styles.answerNumber}>Câu {index + 1}</Text>
                <View style={styles.answerStatus}>
                  <Ionicons
                    name={answer.isCorrect ? 'checkmark-circle' : 'close-circle'}
                    size={20}
                    color={answer.isCorrect ? '#10B981' : '#EF4444'}
                  />
                  <Text style={[
                    styles.answerPoints,
                    { color: answer.isCorrect ? '#10B981' : '#EF4444' }
                  ]}>
                    {answer.isCorrect ? `+${answer.questionPoints}` : '0'} điểm
                  </Text>
                </View>
              </View>

              <View style={styles.questionTextContainer}>
                <LatexMarkdownViewer content={answer.questionContent} />
              </View>

              <View style={styles.answerContent}>
                <Text style={styles.answerLabel}>Câu trả lời của bạn:</Text>
                <View style={[
                  styles.answerTextContainer,
                  answer.isCorrect ? styles.answerTextCorrect : styles.answerTextIncorrect
                ]}>
                  <LatexMarkdownViewer content={answer.selectedOptionContent} />
                </View>
              </View>

              {!answer.isCorrect && answer.correctOptionContent && (
                <View style={styles.answerContent}>
                  <Text style={styles.answerLabel}>Đáp án đúng:</Text>
                  <View style={[styles.answerTextContainer, styles.answerTextCorrect]}>
                    <LatexMarkdownViewer content={answer.correctOptionContent} />
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
        )}

        {/* Bottom spacing */}
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => router.back()}
        >
          <Ionicons name="checkmark-done" size={24} color="white" />
          <Text style={styles.doneButtonText}>Hoàn thành</Text>
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
  content: {
    flex: 1,
    padding: 16,
  },
  scoreCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  scoreContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: '700',
  },
  scoreScale: {
    fontSize: 32,
    fontWeight: '600',
    color: '#9CA3AF',
    marginLeft: 4,
  },
  scoreLabel: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
  },
  scoreStats: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  infoCard: {
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
  infoRow: {
    marginBottom: 12,
  },
  infoItem: {
    gap: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  statusSubmitted: {
    backgroundColor: '#DBEAFE',
  },
  statusGraded: {
    backgroundColor: '#D1FAE5',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  answersSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  answerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
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
  answerCorrect: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  answerIncorrect: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  answerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  answerNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  answerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  answerPoints: {
    fontSize: 14,
    fontWeight: '600',
  },
  questionTextContainer: {
    marginBottom: 12,
  },
  questionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1F2937',
    marginBottom: 12,
  },
  answerContent: {
    gap: 4,
  },
  answerLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  answerTextContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  answerText: {
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  answerTextCorrect: {
    backgroundColor: '#D1FAE5',
  },
  answerTextIncorrect: {
    backgroundColor: '#FEE2E2',
  },
  completionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    marginBottom: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  completionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
    marginTop: 16,
    marginBottom: 8,
  },
  completionText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
  },
  footer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 16,
  },
  doneButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
