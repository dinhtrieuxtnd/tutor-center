import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { LessonResponse } from '../services/lessonService';
import LessonCard from './LessonCard';
import LectureCard from './LectureCard';

interface LessonsTabProps {
  lessons: LessonResponse[];
  classroomId: number;
  isLoading?: boolean;
}

export default function LessonsTab({ lessons, classroomId, isLoading }: LessonsTabProps) {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Đang tải bài học...</Text>
      </View>
    );
  }

  if (lessons.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Chưa có bài học nào</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tất cả bài học</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{lessons.length}</Text>
        </View>
      </View>

      <View style={styles.lessonsList}>
        {lessons.map((lesson) => (
          lesson.lessonType === 'lecture' ? (
            <LectureCard key={lesson.lessonId || (lesson as any).id} lesson={lesson} classroomId={classroomId} />
          ) : (
            <LessonCard key={lesson.lessonId || (lesson as any).id} lesson={lesson} classroomId={classroomId} />
          )
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  countBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  lessonsList: {
    gap: 0,
  },
});
