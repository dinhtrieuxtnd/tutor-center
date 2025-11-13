# Trang Học Bài - Lesson Content Page

## 📋 Tổng quan

Trang học bài cho phép học sinh xem nội dung bài học với hỗ trợ **Markdown**, **LaTeX math**, tài liệu đính kèm và điều hướng giữa các bài.

## ✨ Tính năng chính

### 1. **Hiển thị Nội dung Markdown**
- ✅ Hỗ trợ đầy đủ **Markdown syntax**
- ✅ **LaTeX Math** với KaTeX (inline: `$...$`, block: `$$...$$`)
- ✅ **Tables** với GitHub Flavored Markdown
- ✅ **Code blocks** với syntax highlighting
- ✅ **Blockquotes**, lists, headings, images
- ✅ Custom styling cho các elements

### 2. **Tài Liệu Đính Kèm**
- 📄 Hỗ trợ nhiều loại file: PDF, DOCX, PPTX, Images
- 👁️ Xem trực tiếp (Preview)
- ⬇️ Tải xuống (Download)
- 📊 Hiển thị thông tin file (tên, kích thước, icon)

### 3. **Tiến Độ & Hoàn Thành**
- ✅ Đánh dấu bài học hoàn thành
- 📈 Hiển thị trạng thái (chưa hoàn thành / đã hoàn thành)
- 🎯 Cập nhật tiến độ realtime

### 4. **Điều Hướng**
- ⬅️ Nút "Bài trước" (nếu có)
- ➡️ Nút "Bài tiếp theo" (nếu có)
- 🏠 Breadcrumb: Lớp học → Bài học
- 📚 Quick links: Quay lại lớp, danh sách bài, bài tập

### 5. **Sidebar Tiện Ích**
- 📎 Danh sách tài liệu đính kèm
- 🔗 Liên kết nhanh
- 💡 Mẹo học tập

## 🎨 UI/UX Design

### Layout
```
┌─────────────────────────────────────────┐
│          AppHeader (Shared)              │
├─────────────────────────────────────────┤
│   Breadcrumb + Actions                  │
├────────────────────┬────────────────────┤
│  Main Content      │    Sidebar         │
│  - Lesson Header   │  - Documents       │
│  - Markdown Body   │  - Quick Links     │
│  - Navigation      │  - Tips            │
└────────────────────┴────────────────────┘
```

### Color Scheme
- Primary: `#194DB6` (blue)
- Success: `#10B981` (green) - completed status
- Text: `#1F2937` (gray-900) for headings
- Code bg: `#111827` (gray-900) for code blocks

### Typography
- Headings: `font-poppins` (bold)
- Body: `font-open-sans` (regular)
- Code: `font-mono`

## 📦 Dependencies

```json
{
  "react-markdown": "^9.x",
  "remark-gfm": "^4.x",
  "remark-math": "^6.x",
  "rehype-katex": "^7.x",
  "katex": "^0.16.x"
}
```

## 🔧 Cấu trúc Component

### Props Interface

```typescript
interface LessonData {
  id: number;
  classId: number;
  className: string;
  title: string;
  description: string;
  content: string;        // Markdown content
  documents: LessonDocument[];
  duration: string;
  uploadDate: string;
  completed: boolean;
  previousLesson?: { id: number; title: string };
  nextLesson?: { id: number; title: string };
}

interface LessonDocument {
  id: number;
  name: string;
  type: 'pdf' | 'docx' | 'pptx' | 'image';
  url: string;
  size: string;
}
```

## 📝 Markdown Features

### Headings
```markdown
# H1 - Title
## H2 - Section
### H3 - Subsection
```

### Math (LaTeX)
```markdown
Inline math: $f(x) = x^2 + 1$

Block math:
$$
\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
```

### Tables
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

### Code
```markdown
Inline code: `const x = 10`

Block code:
```javascript
function hello() {
  console.log("Hello World");
}
```
```

### Lists
```markdown
- Unordered list item 1
- Unordered list item 2

1. Ordered list item 1
2. Ordered list item 2
```

### Blockquotes
```markdown
> This is a blockquote
> Multiple lines supported
```

## 🚀 Usage

### Routing
```typescript
// Navigate to lesson
router.push(`/student/lesson/${lessonId}`);

// From class detail page
onClick={() => router.push(`/student/lesson/${lesson.id}`)}
```

### Mark as Completed
```typescript
const handleMarkComplete = () => {
  setIsCompleted(true);
  // TODO: Call API
  // await markLessonComplete(lessonId);
};
```

### Document Actions
```typescript
// Preview
onClick={() => window.open(doc.url, '_blank')}

// Download
onClick={() => {
  const link = document.createElement('a');
  link.href = doc.url;
  link.download = doc.name;
  link.click();
}}
```

## 🎯 Future Enhancements

1. **Video Support**
   - Embed video player
   - Video progress tracking
   - Playback speed control

2. **Interactive Elements**
   - Quiz questions inline
   - Interactive diagrams
   - Code playground

3. **Social Features**
   - Comments/discussion
   - Bookmarks/notes
   - Share highlights

4. **Accessibility**
   - Text-to-speech
   - High contrast mode
   - Keyboard navigation

5. **Offline Support**
   - Download for offline
   - Progressive Web App
   - Cache strategy

## 📱 Responsive Design

- ✅ Mobile: Single column layout
- ✅ Tablet: 2-column with collapsible sidebar
- ✅ Desktop: Full 2-column layout
- ✅ Sticky sidebar on scroll

## 🔗 Related Pages

- `/student/classes` - Classes list page
- `/student/class/[id]` - Class detail page
- `/student/quiz/[id]` - Quiz page (upcoming)
- `/student/lesson/[id]` - Lesson content page (current)

## 📄 Example Content

Xem file `page.tsx` để xem ví dụ đầy đủ về cách viết nội dung Markdown với LaTeX math.
