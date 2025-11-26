import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { exerciseSubmissionService, ExerciseSubmissionResponse } from '../services/exerciseSubmissionService';
import { lessonService, LessonResponse } from '../services/lessonService';
import { mediaService } from '../services/mediaService';

export default function ExerciseSubmitScreen() {
  const { classroomId, lessonId } = useLocalSearchParams<{
    classroomId: string;
    lessonId: string;
  }>();
  const router = useRouter();

  const [lesson, setLesson] = useState<LessonResponse | null>(null);
  const [submission, setSubmission] = useState<ExerciseSubmissionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: number;
    uri: string;
    mimeType: string;
  } | null>(null);
  const [submittedFileUrl, setSubmittedFileUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch lesson details
      const lessons = await lessonService.getByClassroom(Number(classroomId));
      const lessonData = lessons.find((l) => l.lessonId === Number(lessonId));

      if (!lessonData) {
        throw new Error('Không tìm thấy bài tập');
      }

      if (lessonData.lessonType !== 'exercise') {
        throw new Error('Bài học này không phải là bài tập');
      }

      setLesson(lessonData);

      // Try to fetch existing submission
      try {
        const submissionData = await exerciseSubmissionService.getSubmissionByLesson(Number(lessonId));
        if (submissionData) {
          setSubmission(submissionData);
          
          // Fetch submitted file URL if exists
          if (submissionData.mediaId) {
            try {
              const mediaResult = await mediaService.getPresignedUrl(submissionData.mediaId);
              setSubmittedFileUrl(mediaResult.url);
            } catch (error) {
              console.error('Error fetching media:', error);
            }
          }
        }
      } catch (error: any) {
        // No submission yet - this is fine
        console.log('No existing submission:', error.message);
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể tải thông tin bài tập');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      setSelectedFile({
        name: file.name,
        size: file.size || 0,
        uri: file.uri,
        mimeType: file.mimeType || 'application/octet-stream',
      });
    } catch (error: any) {
      Alert.alert('Lỗi', 'Không thể chọn file: ' + error.message);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      Alert.alert('Thông báo', 'Vui lòng chọn file để nộp bài');
      return;
    }

    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn nộp bài tập này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Nộp bài',
          onPress: async () => {
            try {
              setIsSubmitting(true);

              // Upload file first to get mediaId
              const mediaId = await exerciseSubmissionService.uploadFile(
                selectedFile.uri,
                selectedFile.name,
                selectedFile.mimeType
              );

              // Submit exercise
              const result = await exerciseSubmissionService.submitExercise(Number(lessonId), {
                mediaId,
              });

              setSubmission(result);
              setSelectedFile(null);

              Alert.alert('Thành công', 'Đã nộp bài tập thành công', [
                {
                  text: 'OK',
                  onPress: () => fetchData(),
                },
              ]);
            } catch (error: any) {
              Alert.alert('Lỗi', error.message || 'Không thể nộp bài tập');
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  };

  const handleDeleteSubmission = async () => {
    if (!submission) return;

    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn xóa bài nộp này? Hành động này không thể hoàn tác.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsSubmitting(true);
              
              // Delete media file first if exists
              if (submission.mediaId) {
                try {
                  await mediaService.deleteMedia(submission.mediaId);
                } catch (error) {
                  console.error('Error deleting media:', error);
                  // Continue even if media deletion fails
                }
              }
              
              // Then delete submission
              await exerciseSubmissionService.deleteSubmission(submission.exerciseSubmissionId);
              
              // Reset states immediately
              setSubmission(null);
              setSubmittedFileUrl(null);
              setIsSubmitting(false);
              
              Alert.alert('Thành công', 'Đã xóa bài nộp');
            } catch (error: any) {
              Alert.alert('Lỗi', error.message || 'Không thể xóa bài nộp');
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={80} color="#FF3B30" />
        <Text style={styles.errorText}>Không tìm thấy bài tập</Text>
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
          Nộp bài tập
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Exercise Info */}
        <View style={styles.infoSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="document-text" size={32} color="#007AFF" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.exerciseTitle}>{lesson.exercise?.title}</Text>
            {lesson.exercise?.description && (
              <Text style={styles.exerciseDescription}>{lesson.exercise.description}</Text>
            )}
            {lesson.exerciseDueAt && (
              <View style={styles.metaRow}>
                <Ionicons name="time-outline" size={16} color="#FF9500" />
                <Text style={styles.dueDate}>
                  Hạn nộp: {formatDate(lesson.exerciseDueAt)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Submission Status */}
        {submission ? (
          <View style={styles.submissionSection}>
            <View style={styles.submittedHeader}>
              <Ionicons name="checkmark-circle" size={24} color="#34C759" />
              <Text style={styles.submittedTitle}>Đã nộp bài</Text>
            </View>

            <View style={styles.submissionInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Thời gian nộp:</Text>
                <Text style={styles.infoValue}>{formatDate(submission.submittedAt)}</Text>
              </View>

              {submission.score !== undefined && submission.score !== null && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Điểm:</Text>
                  <Text style={[styles.infoValue, styles.scoreText]}>{submission.score}/10</Text>
                </View>
              )}

              {submission.comment && (
                <View style={styles.commentSection}>
                  <Text style={styles.infoLabel}>Nhận xét của giáo viên:</Text>
                  <Text style={styles.commentText}>{submission.comment}</Text>
                </View>
              )}

              {submittedFileUrl && (
                <TouchableOpacity
                  style={styles.viewFileButton}
                  onPress={() => {
                    // Open file in browser or download
                    Alert.alert('File đã nộp', 'File: ' + submittedFileUrl);
                  }}
                >
                  <Ionicons name="document" size={20} color="#007AFF" />
                  <Text style={styles.viewFileText}>Xem file đã nộp</Text>
                </TouchableOpacity>
              )}
            </View>

            {!submission.gradedAt && !submission.score && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeleteSubmission}
                disabled={isSubmitting}
              >
                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                <Text style={styles.deleteButtonText}>Xóa bài nộp</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.submitSection}>
            <Text style={styles.sectionTitle}>Chọn file để nộp bài</Text>

            {selectedFile ? (
              <View style={styles.selectedFileCard}>
                <View style={styles.fileInfo}>
                  <Ionicons name="document" size={32} color="#007AFF" />
                  <View style={styles.fileDetails}>
                    <Text style={styles.fileName}>{selectedFile.name}</Text>
                    <Text style={styles.fileSize}>{formatFileSize(selectedFile.size)}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.removeFileButton}
                  onPress={() => setSelectedFile(null)}
                >
                  <Ionicons name="close-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.pickFileButton} onPress={handlePickDocument}>
                <Ionicons name="cloud-upload-outline" size={40} color="#007AFF" />
                <Text style={styles.pickFileText}>Chọn file</Text>
                <Text style={styles.pickFileHint}>Nhấn để chọn file từ thiết bị</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.submitButton, !selectedFile && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!selectedFile || isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="send" size={20} color="#fff" />
                  <Text style={styles.submitButtonText}>Nộp bài</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
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
    backgroundColor: '#F2F2F7',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 20,
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#007AFF',
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 16,
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
  infoSection: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E6F4FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dueDate: {
    fontSize: 14,
    color: '#FF9500',
    marginLeft: 4,
    fontWeight: '500',
  },
  submissionSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submittedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  submittedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34C759',
    marginLeft: 8,
  },
  submissionInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  scoreText: {
    color: '#34C759',
    fontSize: 16,
  },
  commentSection: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  commentText: {
    fontSize: 14,
    color: '#1F2937',
    marginTop: 4,
    lineHeight: 20,
  },
  viewFileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    padding: 12,
    backgroundColor: '#E6F4FE',
    borderRadius: 8,
  },
  viewFileText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  deleteButtonText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '600',
    marginLeft: 8,
  },
  submitSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  pickFileButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    marginBottom: 16,
  },
  pickFileText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginTop: 12,
  },
  pickFileHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  selectedFileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileDetails: {
    marginLeft: 12,
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 12,
    color: '#6B7280',
  },
  removeFileButton: {
    padding: 4,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
