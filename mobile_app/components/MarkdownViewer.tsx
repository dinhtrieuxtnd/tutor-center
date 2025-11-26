import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Markdown from 'react-native-markdown-display';

interface MarkdownViewerProps {
  content: string;
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  if (!content) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không có nội dung để hiển thị</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Markdown style={markdownStyles}>{content}</Markdown>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Remove flex: 1 to not take all space
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

const markdownStyles = StyleSheet.create({
  // Headings
  heading1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 24,
    marginBottom: 16,
  },
  heading2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 20,
    marginBottom: 12,
  },
  heading3: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 10,
  },
  heading4: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
    marginBottom: 8,
  },
  heading5: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 10,
    marginBottom: 6,
  },
  heading6: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 6,
  },
  
  // Body text
  body: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  paragraph: {
    marginBottom: 12,
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  
  // Lists
  bullet_list: {
    marginBottom: 12,
  },
  ordered_list: {
    marginBottom: 12,
  },
  list_item: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 6,
  },
  
  // Code
  code_inline: {
    backgroundColor: '#F3F4F6',
    color: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 14,
    fontFamily: 'Courier',
  },
  code_block: {
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 14,
    fontFamily: 'Courier',
  },
  fence: {
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  
  // Emphasis
  strong: {
    fontWeight: 'bold',
    color: '#111827',
  },
  em: {
    fontStyle: 'italic',
  },
  
  // Blockquote
  blockquote: {
    backgroundColor: '#F9FAFB',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  
  // Links
  link: {
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
  
  // Horizontal rule
  hr: {
    backgroundColor: '#E5E7EB',
    height: 1,
    marginVertical: 16,
  },
  
  // Table
  table: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 12,
  },
  thead: {
    backgroundColor: '#F3F4F6',
  },
  tbody: {},
  th: {
    padding: 8,
    fontWeight: 'bold',
    color: '#111827',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },
  tr: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  td: {
    padding: 8,
    color: '#374151',
  },
});
