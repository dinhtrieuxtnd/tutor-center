import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { lessonService, LessonResponse } from '../services/lessonService';
import { mediaService } from '../services/mediaService';
import MarkdownViewer from '../components/MarkdownViewer';
import PDFViewer from '../components/PDFViewer';

export default function LectureDetailScreen() {
  const { classroomId, lessonId, lectureId } = useLocalSearchParams<{ 
    classroomId: string; 
    lessonId: string; 
    lectureId?: string;
  }>();
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null);
  const [showPDF, setShowPDF] = useState(false);

  const lecture = lectureId && lesson?.lecture?.children
    ? lesson.lecture.children.find((child) => child.lectureId === Number(lectureId))
    : lesson?.lecture;

  // Debug logging
  console.log('Lesson type:', lesson?.lessonType);
  console.log('Lesson data:', lesson);
  console.log('Lecture:', lecture);
  console.log('Exercise:', lesson?.exercise);
  console.log('Render - lecture.mediaId:', lecture?.mediaId);
  console.log('Render - mediaUrl:', mediaUrl);
  console.log('Render - mediaType:', mediaType);

  const fetchLessonDetail = async (showLoader = true) => {
    try {
      if (showLoader) {
        setIsLoading(true);
      }
      
      // Get all lessons from classroom and find the specific lesson
      const lessons = await lessonService.getByClassroom(Number(classroomId));
      const lessonData = lessons.find(l => l.lessonId === Number(lessonId));
      
      if (!lessonData) {
        throw new Error('Không tìm thấy bài học');
      }
      
      setLesson(lessonData);
      
      // Fetch media if exists
      const currentLecture = lectureId && lessonData.lecture?.children
        ? lessonData.lecture.children.find((child) => child.lectureId === Number(lectureId))
        : lessonData.lecture;
      
      console.log('Current lecture:', currentLecture);
      console.log('MediaId:', currentLecture?.mediaId);
      
      if (currentLecture?.mediaId) {
        try {
          console.log('📄 Fetching media for mediaId:', currentLecture.mediaId);
          
          // Use backend /view endpoint (works better with external viewers)
          const viewUrl = await mediaService.getViewUrl(currentLecture.mediaId);
          console.log('✅ Backend view URL:', viewUrl);
          setMediaUrl(viewUrl);
          
          // Try to detect media type
          try {
            const result = await mediaService.getPresignedUrl(currentLecture.mediaId);
            const detectedType = result.mimeType || 
              (result.url.toLowerCase().endsWith('.pdf') ? 'application/pdf' : null);
            setMediaType(detectedType);
            console.log('✅ Media type:', detectedType);
          } catch (err) {
            console.log('⚠️ Could not detect media type, defaulting to PDF');
            setMediaType('application/pdf');
          }
        } catch (error: any) {
          console.error('❌ Error fetching media:', error);
          // Don't throw, just log - missing media shouldn't break the page
        }
      } else {
        console.log('No mediaId found for lecture');
      }
    } catch (error: any) {
      console.error('Error fetching lesson detail:', error);
      Alert.alert('Lỗi', error.message || 'Không thể tải thông tin bài giảng', [
        {
          text: 'Quay lại',
          onPress: () => router.back(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (classroomId && lessonId) {
      fetchLessonDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroomId, lessonId, lectureId]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchLessonDetail(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Không rõ';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải bài giảng...</Text>
      </View>
    );
  }

  // Check if we have valid lecture to display
  if (!lesson) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={80} color="#FF3B30" />
        <Text style={styles.errorText}>Không tìm thấy bài học</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Handle Quiz lesson
  if (lesson.lessonType === 'quiz' && lesson.quiz) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Bài kiểm tra
          </Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#007AFF']}
              tintColor="#007AFF"
            />
          }
        >
          {/* Quiz Header */}
          <View style={styles.lectureHeader}>
            <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="document-text" size={32} color="#F59E0B" />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.lectureTitle}>{lesson.quiz.title}</Text>
              <View style={styles.metaRow}>
                <Ionicons name="time-outline" size={14} color="#6B7280" />
                <Text style={styles.metaText}>
                  {lesson.quiz.timeLimit ? `${lesson.quiz.timeLimit} phút` : 'Không giới hạn thời gian'}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="person-outline" size={14} color="#6B7280" />
                <Text style={styles.metaText}>{lesson.quiz.uploadedByName}</Text>
              </View>
            </View>
          </View>

          {/* Quiz Description */}
          {lesson.quiz.description && (
            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>Mô tả</Text>
              <View style={styles.contentCard}>
                <Text style={styles.descriptionText}>{lesson.quiz.description}</Text>
              </View>
            </View>
          )}

          {/* Quiz Info */}
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Thông tin</Text>
            <View style={styles.contentCard}>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={20} color="#007AFF" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Thời gian bắt đầu</Text>
                  <Text style={styles.infoValue}>
                    {lesson.quizStartAt ? formatDate(lesson.quizStartAt) : 'Chưa xác định'}
                  </Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={20} color="#EF4444" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Thời gian kết thúc</Text>
                  <Text style={styles.infoValue}>
                    {lesson.quizEndAt ? formatDate(lesson.quizEndAt) : 'Chưa xác định'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Start Quiz Button */}
          <TouchableOpacity
            style={styles.startQuizButton}
            onPress={() => {
              router.push({
                pathname: '/quiz-attempt',
                params: { lessonId: lessonId },
              });
            }}
          >
            <Ionicons name="play-circle" size={24} color="white" />
            <Text style={styles.startQuizButtonText}>Bắt đầu làm bài</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Handle Lecture lesson
  if (!lecture) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={80} color="#FF3B30" />
        <Text style={styles.errorText}>Không tìm thấy bài giảng</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Bài giảng
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
      >
        {/* Lecture Header */}
        <View style={styles.lectureHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name="book" size={32} color="#007AFF" />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.lectureTitle}>{lecture.title}</Text>
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={14} color="#6B7280" />
              <Text style={styles.metaText}>{formatDate(lecture.uploadedAt || lecture.createdAt)}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="person-outline" size={14} color="#6B7280" />
              <Text style={styles.metaText}>{lecture.uploadedByName}</Text>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Nội dung bài giảng</Text>
          {lecture?.content ? (
            <View style={styles.contentCard}>
              <MarkdownViewer content={lecture.content} />
            </View>
          ) : (
            <View style={styles.emptyContent}>
              <Text style={styles.emptyText}>Chưa có nội dung bài giảng</Text>
            </View>
          )}
        </View>

        {/* Media Attachment Section */}
        {lecture?.mediaId && (
          <View style={styles.mediaSection}>
            <Text style={styles.sectionTitle}>Tài liệu đính kèm</Text>
            
            {mediaUrl ? (
              <View style={styles.mediaCard}>
                {/* PDF Viewer - Always show directly without toggle */}
                {mediaType === 'application/pdf' ? (
                  <View style={styles.pdfContainer}>
                    <PDFViewer
                      url={mediaUrl!}
                      fileName={`lecture-${lecture?.lectureId}.pdf`}
                    />
                  </View>
                ) : (
                  <View style={styles.mediaInfo}>
                    <Ionicons name="document-attach" size={24} color="#007AFF" />
                    <Text style={styles.mediaText}>Tài liệu đính kèm</Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.loadingMedia}>
                <ActivityIndicator size="small" color="#007AFF" />
                <Text style={styles.loadingMediaText}>Đang tải tài liệu...</Text>
              </View>
            )}
          </View>
        )}

        {/* Child Lectures */}
        {lecture?.children && lecture.children.length > 0 && (
          <View style={styles.childrenSection}>
            <Text style={styles.sectionTitle}>
              Bài học con ({lecture.children.length})
            </Text>
            {lecture.children.map((child) => (
              <TouchableOpacity
                key={child.lectureId}
                style={styles.childCard}
                onPress={() => {
                  router.push({
                    pathname: '/lecture-detail',
                    params: { 
                      classroomId,
                      lessonId, 
                      lectureId: child.lectureId.toString(),
                    },
                  });
                }}
              >
                <Ionicons name="document-text" size={24} color="#007AFF" />
                <View style={styles.childInfo}>
                  <Text style={styles.childTitle}>{child.title}</Text>
                  <Text style={styles.childMeta}>
                    {formatDate(child.uploadedAt || child.createdAt)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  lectureHeader: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  lectureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 6,
  },
  contentSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  contentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  mediaSection: {
    marginBottom: 16,
  },
  mediaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  mediaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mediaText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginLeft: 12,
  },
  pdfContainer: {
    minHeight: 300,
    borderRadius: 8,
    overflow: 'hidden',
  },
  loadingMedia: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  loadingMediaText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 12,
  },
  childrenSection: {
    marginBottom: 16,
  },
  childCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  childInfo: {
    flex: 1,
    marginLeft: 12,
  },
  childTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  childMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F9FAFB',
  },
  errorText: {
    fontSize: 18,
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#374151',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  startQuizButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 24,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startQuizButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
