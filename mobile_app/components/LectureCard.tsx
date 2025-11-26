import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LessonResponse, LectureResponse } from '../services/lessonService';

interface LectureCardProps {
  lesson: LessonResponse;
  classroomId: number;
  onPress?: () => void;
}

export default function LectureCard({ lesson, classroomId, onPress }: LectureCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  if (!lesson.lecture) return null;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const hasChildren = lesson.lecture.children && lesson.lecture.children.length > 0;

  const handleParentPress = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    } else {
      // Navigate to lecture detail
      router.push({
        pathname: '/lecture-detail',
        params: { 
          classroomId: classroomId.toString(),
          lessonId: lesson.lessonId.toString(),
        },
      });
    }
  };

  const handleChildPress = (child: LectureResponse) => {
    // Navigate to child lecture detail
    router.push({
      pathname: '/lecture-detail',
      params: {
        classroomId: classroomId.toString(),
        lessonId: lesson.lessonId.toString(),
        lectureId: child.lectureId.toString(),
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Parent Lecture */}
      <TouchableOpacity
        style={[
          styles.parentCard,
          isExpanded && styles.parentCardExpanded,
        ]}
        onPress={handleParentPress}
        activeOpacity={0.7}
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="book-outline" size={24} color="#3B82F6" />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={2}>
                {lesson.lecture.title}
              </Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Bài giảng</Text>
              </View>
              {hasChildren && (
                <View style={styles.childCountBadge}>
                  <Text style={styles.childCountText}>
                    {lesson.lecture.children!.length} bài học
                  </Text>
                </View>
              )}
            </View>

            {hasChildren && (
              <Ionicons
                name={isExpanded ? 'chevron-down' : 'chevron-forward'}
                size={20}
                color="#9CA3AF"
              />
            )}
          </View>

          {/* Description */}
          {lesson.lecture.content && (
            <Text style={styles.description} numberOfLines={2}>
              {lesson.lecture.content}
            </Text>
          )}

          {/* Meta info */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color="#6B7280" />
              <Text style={styles.metaText}>{formatDate(lesson.createdAt)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={14} color="#6B7280" />
              <Text style={styles.metaText}>{lesson.lecture.uploadedByName}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Children Lectures */}
      {isExpanded && hasChildren && (
        <View style={styles.childrenContainer}>
          {lesson.lecture!.children!.map((child, index) => (
            <TouchableOpacity
              key={child.lectureId}
              style={[
                styles.childCard,
                index === lesson.lecture!.children!.length - 1 && styles.lastChildCard,
              ]}
              onPress={() => handleChildPress(child)}
              activeOpacity={0.7}
            >
              {/* Chevron Indicator */}
              <View style={styles.childIndicator}>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
              </View>

              {/* Child Icon */}
              <View style={styles.childIconContainer}>
                <Ionicons name="document-text-outline" size={20} color="#3B82F6" />
              </View>

              {/* Child Content */}
              <View style={styles.childContent}>
                <Text style={styles.childTitle} numberOfLines={2}>
                  {child.title}
                </Text>

                {child.content && (
                  <Text style={styles.childDescription} numberOfLines={2}>
                    {child.content}
                  </Text>
                )}

                {/* Child Meta */}
                <View style={styles.childMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={12} color="#9CA3AF" />
                    <Text style={styles.childMetaText}>{formatDate(child.createdAt)}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="person-outline" size={12} color="#9CA3AF" />
                    <Text style={styles.childMetaText}>{child.uploadedByName}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  parentCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  parentCardExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
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
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flexShrink: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#DBEAFE',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3B82F6',
  },
  childCountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  childCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
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
  childrenContainer: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  childCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    paddingLeft: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  lastChildCard: {
    borderBottomWidth: 0,
  },
  childIndicator: {
    marginRight: 8,
    marginTop: 2,
  },
  childIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  childContent: {
    flex: 1,
  },
  childTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  childDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
    lineHeight: 18,
  },
  childMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  childMetaText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
});
