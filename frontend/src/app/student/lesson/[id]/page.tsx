'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Download,
  Eye,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  List
} from 'lucide-react';
import { AppHeader } from '@/components/layout';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface LessonDocument {
  id: number;
  name: string;
  type: 'pdf' | 'docx' | 'pptx' | 'image';
  url: string;
  size: string;
}

interface LessonData {
  id: number;
  classId: number;
  className: string;
  title: string;
  description: string;
  content: string; // Markdown content
  documents: LessonDocument[];
  duration: string;
  uploadDate: string;
  completed: boolean;
  previousLesson?: {
    id: number;
    title: string;
  };
  nextLesson?: {
    id: number;
    title: string;
  };
}

export default function LessonContentPage() {
  const router = useRouter();
  const [showDocumentsList, setShowDocumentsList] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Mock data - trong thực tế sẽ fetch từ API
  const lesson: LessonData = {
    id: 1,
    classId: 1,
    className: 'Toán 12 - Luyện thi THPT QG',
    title: 'Giới thiệu về hàm số',
    description: 'Khái niệm cơ bản về hàm số và các tính chất quan trọng',
    duration: '45 phút',
    uploadDate: '01/11/2025',
    completed: false,
    content: `# Giới thiệu về Hàm số

## 1. Khái niệm hàm số

Cho hai tập hợp khác rỗng **D** và **R**. Một hàm số **f** từ **D** vào **R** là một quy tắc đặt tương ứng mỗi phần tử \\( x \\in D \\) với **một và chỉ một** phần tử \\( y \\in R \\).

Kí hiệu: \\( f: D \\to R \\) hoặc \\( y = f(x), x \\in D \\)

### Các thành phần của hàm số:

- **Tập xác định (Domain)**: Tập hợp **D** gồm các giá trị x mà hàm số xác định
- **Tập giá trị (Range)**: Tập hợp các giá trị y = f(x) tương ứng
- **Biến số**: x gọi là biến độc lập, y gọi là biến phụ thuộc

## 2. Cách cho hàm số

### a) Bằng công thức

Ví dụ: 
- \\( f(x) = 2x + 1 \\)
- \\( g(x) = x^2 - 3x + 2 \\)
- \\( h(x) = \\frac{1}{x-1} \\)

### b) Bằng bảng giá trị

| x | -2 | -1 | 0 | 1 | 2 |
|---|----|----|---|---|---|
| y | 4  | 1  | 0 | 1 | 4 |

### c) Bằng đồ thị

Biểu diễn các điểm \\( (x, f(x)) \\) trên mặt phẳng tọa độ Oxy.

## 3. Tính chất của hàm số

### 3.1. Tính đồng biến, nghịch biến

Cho hàm số \\( y = f(x) \\) xác định trên K:

- **Đồng biến** trên K nếu: \\( \\forall x_1, x_2 \\in K: x_1 < x_2 \\Rightarrow f(x_1) < f(x_2) \\)
- **Nghịch biến** trên K nếu: \\( \\forall x_1, x_2 \\in K: x_1 < x_2 \\Rightarrow f(x_1) > f(x_2) \\)

### 3.2. Tính chẵn, lẻ

Cho hàm số \\( y = f(x) \\) có tập xác định D (D phải đối xứng qua 0):

- **Hàm chẵn**: \\( f(-x) = f(x), \\forall x \\in D \\)
  - Đồ thị đối xứng qua trục Oy
- **Hàm lẻ**: \\( f(-x) = -f(x), \\forall x \\in D \\)
  - Đồ thị đối xứng qua gốc tọa độ O

### 3.3. Tính tuần hoàn

Hàm số \\( y = f(x) \\) được gọi là **tuần hoàn** với chu kỳ T (T > 0) nếu:

\\[
f(x + T) = f(x), \\forall x \\in D
\\]

## 4. Ví dụ minh họa

### Ví dụ 1: Tìm tập xác định

Tìm tập xác định của hàm số: \\( y = \\frac{1}{x^2 - 4} \\)

**Giải:**

Điều kiện: \\( x^2 - 4 \\neq 0 \\Leftrightarrow x^2 \\neq 4 \\Leftrightarrow x \\neq \\pm 2 \\)

Vậy tập xác định: \\( D = \\mathbb{R} \\setminus \\{-2; 2\\} \\)

### Ví dụ 2: Xét tính đơn điệu

Xét tính đồng biến, nghịch biến của hàm số \\( f(x) = 2x + 1 \\) trên \\( \\mathbb{R} \\)

**Giải:**

Với mọi \\( x_1, x_2 \\in \\mathbb{R} \\), \\( x_1 < x_2 \\)

Ta có: \\( f(x_1) - f(x_2) = (2x_1 + 1) - (2x_2 + 1) = 2(x_1 - x_2) < 0 \\)

\\( \\Rightarrow f(x_1) < f(x_2) \\)

Vậy hàm số đồng biến trên \\( \\mathbb{R} \\)

## 5. Bài tập tự luyện

1. Tìm tập xác định của các hàm số sau:
   - a) \\( y = \\sqrt{x - 1} \\)
   - b) \\( y = \\frac{1}{\\sqrt{4 - x^2}} \\)
   - c) \\( y = \\frac{x + 1}{x^2 - 5x + 6} \\)

2. Xét tính chẵn, lẻ của các hàm số:
   - a) \\( f(x) = x^2 + 1 \\)
   - b) \\( g(x) = x^3 - x \\)
   - c) \\( h(x) = |x| + x \\)

3. Khảo sát sự đồng biến, nghịch biến:
   - a) \\( y = -3x + 2 \\) trên \\( \\mathbb{R} \\)
   - b) \\( y = x^2 \\) trên \\( [0; +\\infty) \\)

---

> **Lưu ý quan trọng:**
> - Luôn kiểm tra điều kiện xác định trước khi giải bài toán
> - Chú ý đến các trường hợp đặc biệt: mẫu số bằng 0, căn bậc chẵn của số âm
> - Vẽ đồ thị để hiểu rõ hơn về tính chất của hàm số

## Tài liệu tham khảo

Xem thêm các tài liệu đính kèm bên dưới để có thêm ví dụ và bài tập nâng cao.
`,
    documents: [
      {
        id: 1,
        name: 'Bài giảng Hàm số - Lý thuyết đầy đủ.pdf',
        type: 'pdf',
        url: '/documents/ham-so-ly-thuyet.pdf',
        size: '2.4 MB'
      },
      {
        id: 2,
        name: 'Bài tập Hàm số - Có lời giải.pdf',
        type: 'pdf',
        url: '/documents/ham-so-bai-tap.pdf',
        size: '1.8 MB'
      },
      {
        id: 3,
        name: 'Sơ đồ tư duy Hàm số.png',
        type: 'image',
        url: '/documents/ham-so-mind-map.png',
        size: '450 KB'
      },
      {
        id: 4,
        name: 'Công thức tổng hợp.docx',
        type: 'docx',
        url: '/documents/cong-thuc.docx',
        size: '120 KB'
      }
    ],
    previousLesson: undefined,
    nextLesson: {
      id: 2,
      title: 'Đạo hàm và ứng dụng'
    }
  };

  const handleMarkComplete = () => {
    setIsCompleted(true);
    // TODO: Call API to mark lesson as completed
    alert('Đã đánh dấu bài học là hoàn thành!');
  };

  const handleLogout = () => {
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/auth/login');
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'docx':
        return '📝';
      case 'pptx':
        return '📊';
      case 'image':
        return '🖼️';
      default:
        return '📎';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-open-sans">
      {/* Header */}
      <AppHeader
        currentPage="classes"
        userName="Nguyễn Văn A"
        userRole="Học sinh"
        onLogout={handleLogout}
      />

      {/* Breadcrumb & Actions */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm font-open-sans">
              <button
                onClick={() => router.push('/student/classes')}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Lớp học của tôi
              </button>
              <span className="text-gray-400">/</span>
              <button
                onClick={() => router.push(`/student/class/${lesson.classId}`)}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                {lesson.className}
              </button>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{lesson.title}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDocumentsList(!showDocumentsList)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-open-sans"
              >
                <List className="w-4 h-4" />
                Tài liệu ({lesson.documents.length})
              </button>
              {!isCompleted && !lesson.completed && (
                <button
                  onClick={handleMarkComplete}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-open-sans"
                >
                  <CheckCircle className="w-4 h-4" />
                  Đánh dấu hoàn thành
                </button>
              )}
              {(isCompleted || lesson.completed) && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg font-open-sans">
                  <CheckCircle className="w-4 h-4" />
                  Đã hoàn thành
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Lesson Content */}
          <div className="lg:col-span-2">
            {/* Lesson Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2 font-poppins">
                    {lesson.title}
                  </h1>
                  <p className="text-gray-600 font-open-sans">
                    {lesson.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600 font-open-sans pt-4 border-t border-gray-200">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {lesson.duration}
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {lesson.documents.length} tài liệu
                </span>
                <span>📅 Đăng ngày: {lesson.uploadDate}</span>
              </div>
            </div>

            {/* Lesson Content - Markdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
              <article className="prose prose-lg max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    h1: ({ ...props }) => (
                      <h1 className="text-3xl font-bold text-gray-900 mb-4 font-poppins" {...props} />
                    ),
                    h2: ({ ...props }) => (
                      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 font-poppins" {...props} />
                    ),
                    h3: ({ ...props }) => (
                      <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3 font-poppins" {...props} />
                    ),
                    p: ({ ...props }) => (
                      <p className="text-gray-700 leading-relaxed mb-4 font-open-sans" {...props} />
                    ),
                    ul: ({ ...props }) => (
                      <ul className="list-disc list-inside mb-4 space-y-2 font-open-sans" {...props} />
                    ),
                    ol: ({ ...props }) => (
                      <ol className="list-decimal list-inside mb-4 space-y-2 font-open-sans" {...props} />
                    ),
                    li: ({ ...props }) => (
                      <li className="text-gray-700 ml-4" {...props} />
                    ),
                    strong: ({ ...props }) => (
                      <strong className="font-bold text-gray-900" {...props} />
                    ),
                    code: ({ inline, ...props }: any) =>
                      inline ? (
                        <code className="px-2 py-1 bg-gray-100 text-primary rounded text-sm font-mono" {...props} />
                      ) : (
                        <code className="block p-4 bg-gray-900 text-gray-100 rounded-lg text-sm font-mono overflow-x-auto" {...props} />
                      ),
                    blockquote: ({ ...props }) => (
                      <blockquote className="border-l-4 border-primary bg-blue-50 pl-4 py-2 italic text-gray-700 my-4" {...props} />
                    ),
                    table: ({ ...props }) => (
                      <div className="overflow-x-auto mb-4">
                        <table className="min-w-full border border-gray-300" {...props} />
                      </div>
                    ),
                    thead: ({ ...props }) => (
                      <thead className="bg-gray-100" {...props} />
                    ),
                    th: ({ ...props }) => (
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold" {...props} />
                    ),
                    td: ({ ...props }) => (
                      <td className="border border-gray-300 px-4 py-2" {...props} />
                    ),
                    hr: ({ ...props }) => (
                      <hr className="my-8 border-gray-300" {...props} />
                    )
                  }}
                >
                  {lesson.content}
                </ReactMarkdown>
              </article>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              {lesson.previousLesson ? (
                <button
                  onClick={() => router.push(`/student/lesson/${lesson.previousLesson?.id}`)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-open-sans"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Bài trước
                </button>
              ) : (
                <div></div>
              )}

              {lesson.nextLesson && (
                <button
                  onClick={() => router.push(`/student/lesson/${lesson.nextLesson?.id}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-open-sans"
                >
                  Bài tiếp theo
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-8">
              {/* Documents List */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 font-poppins flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Tài liệu đính kèm
                </h3>
                <div className="space-y-3">
                  {lesson.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-gray-50 transition-all"
                    >
                      <span className="text-2xl flex-shrink-0">
                        {getDocumentIcon(doc.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1 font-poppins truncate">
                          {doc.name}
                        </h4>
                        <p className="text-xs text-gray-500 font-open-sans">
                          {doc.size}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => window.open(doc.url, '_blank')}
                          className="p-2 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = doc.url;
                            link.download = doc.name;
                            link.click();
                          }}
                          className="p-2 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                          title="Tải xuống"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 font-poppins">
                  Liên kết nhanh
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push(`/student/class/${lesson.classId}`)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left font-open-sans"
                  >
                    <BookOpen className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Quay lại lớp học</span>
                  </button>
                  <button
                    onClick={() => router.push(`/student/class/${lesson.classId}?tab=lessons`)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left font-open-sans"
                  >
                    <List className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Danh sách bài học</span>
                  </button>
                  <button
                    onClick={() => router.push(`/student/class/${lesson.classId}?tab=assignments`)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left font-open-sans"
                  >
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Bài tập</span>
                  </button>
                </div>
              </div>

              {/* Progress Tip */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 font-poppins">
                      Mẹo học tập
                    </h4>
                    <p className="text-sm text-gray-700 font-open-sans">
                      Hãy ghi chú những điểm quan trọng và làm bài tập tự luyện để nắm vững kiến thức!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
