import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LessonResponse } from '../services/lessonService';

interface LessonCardProps {
  lesson: LessonResponse;
  classroomId: number;
  onPress?: () => void;
}

export default function LessonCard({ lesson, classroomId, onPress }: LessonCardProps) {
  const router = useRouter();

  const getLessonTypeIcon = (lessonType: string): keyof typeof Ionicons.glyphMap => {
    switch (lessonType) {
      case 'lecture':
        return 'book-outline';
      case 'exercise':
        return 'pencil-outline';
      case 'quiz':
        return 'list-outline';
      default:
        return 'book-outline';
    }
  };

  const getLessonTypeLabel = (lessonType: string): string => {
    switch (lessonType) {
      case 'lecture':
        return 'Bài giảng';
      case 'exercise':
        return 'Bài tập';
      case 'quiz':
        return 'Bài kiểm tra';
      default:
        return 'Khác';
    }
  };

  const getLessonTypeColor = (lessonType: string): string => {
    switch (lessonType) {
      case 'lecture':
        return '#3B82F6'; // blue
      case 'exercise':
        return '#F97316'; // orange
      case 'quiz':
        return '#A855F7'; // purple
      default:
        return '#6B7280'; // gray
    }
  };

  const getLessonTitle = (): string => {
    if (lesson.lecture) return lesson.lecture.title || 'Bài giảng không tiêu đề';
    if (lesson.exercise) return lesson.exercise.title || 'Bài tập không tiêu đề';
    if (lesson.quiz) return lesson.quiz.title || 'Bài kiểm tra không tiêu đề';
    return 'Không có tiêu đề';
  };

  const getLessonDescription = (): string | null => {
    if (lesson.lecture) return lesson.lecture.content || null;
    if (lesson.exercise) return lesson.exercise.description || null;
    if (lesson.quiz) return lesson.quiz.description || null;
    return null;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const color = getLessonTypeColor(lesson.lessonType);

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    const lessonId = lesson.lessonId;

    console.log('🔍 Lesson clicked:', {
      lessonId: lesson.lessonId,
      lessonType: lesson.lessonType,
      classroomId,
    });

    if (!lessonId) {
      console.error('❌ Lesson missing lessonId:', lesson);
      return;
    }

    // Normalize lessonType to lowercase
    const lessonType = lesson.lessonType?.toLowerCase();

    // Navigate based on lesson type
    if (lessonType === 'exercise') {
      router.push({
        pathname: '/exercise-submit',
        params: {
          classroomId: classroomId.toString(),
          lessonId: lessonId.toString(),
        },
      });
    } else if (lessonType === 'quiz') {
      router.push({
        pathname: '/lecture-detail',
        params: {
          classroomId: classroomId.toString(),
          lessonId: lessonId.toString(),
        },
      });
    } else {
      // For lecture type, navigate to lecture detail
      router.push({
        pathname: '/lecture-detail',
        params: {
          classroomId: classroomId.toString(),
          lessonId: lessonId.toString(),
        },
      });
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <Ionicons
          name={getLessonTypeIcon(lesson.lessonType)}
          size={24}
          color={color}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title and Badge */}
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={2}>
            {getLessonTitle()}
          </Text>
          <View style={[styles.badge, { backgroundColor: `${color}20` }]}>
            <Text style={[styles.badgeText, { color }]}>
              {getLessonTypeLabel(lesson.lessonType)}
            </Text>
          </View>
        </View>

        {/* Description */}
        {getLessonDescription() && (
          <Text style={styles.description} numberOfLines={2}>
            {getLessonDescription()}
          </Text>
        )}

        {/* Meta info */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <Text style={styles.metaText}>{formatDate(lesson.createdAt)}</Text>
          </View>

          {lesson.exerciseDueAt && (
            <View style={styles.metaItem}>
              <Ionicons name="alarm-outline" size={14} color="#F97316" />
              <Text style={[styles.metaText, { color: '#F97316' }]}>
                Hạn: {formatDate(lesson.exerciseDueAt)}
              </Text>
            </View>
          )}

          {lesson.quizEndAt && (
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color="#A855F7" />
              <Text style={[styles.metaText, { color: '#A855F7' }]}>
                Kết thúc: {formatDate(lesson.quizEndAt)}
              </Text>
            </View>
          )}
        </View>

        {/* Child indicator for lectures */}
        {lesson.lecture && lesson.lecture.children && lesson.lecture.children.length > 0 && (
          <View style={styles.childIndicator}>
            <Ionicons name="folder-outline" size={14} color="#6B7280" />
            <Text style={styles.metaText}>
              {lesson.lecture.children.length} bài học con
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  childIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
});
