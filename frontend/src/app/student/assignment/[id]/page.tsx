'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Download,
  Eye,
  File,
  Image as ImageIcon,
  Video,
  FileArchive,
  Paperclip
} from 'lucide-react';
import { AppHeader } from '@/components/layout';

interface AttachmentFile {
  id: number;
  name: string;
  size: string;
  type: string;
  url: string;
  uploadDate: string;
}

interface Submission {
  id: number;
  submittedAt: string;
  files: AttachmentFile[];
  note?: string;
  status: 'submitted' | 'graded';
  score?: number;
  feedback?: string;
}

interface AssignmentData {
  id: number;
  classId: number;
  className: string;
  title: string;
  description: string;
  instructions: string;
  dueDate: string;
  dueTime: string;
  maxScore: number;
  attachments: AttachmentFile[];
  allowedFileTypes: string[];
  maxFileSize: string;
  maxFiles: number;
  submission?: Submission;
}

export default function AssignmentPage() {
  const router = useRouter();
  const params = useParams();
  const assignmentId = params.id;

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [note, setNote] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Mock data
  const assignment: AssignmentData = {
    id: Number(assignmentId),
    classId: 1,
    className: 'Toán 12 - Luyện thi THPT QG',
    title: 'Bài tập về hàm số bậc nhất',
    description: 'Hoàn thành các bài tập từ 1 đến 10 trong sách giáo khoa trang 45-47',
    instructions: `
## Yêu cầu bài tập

Học sinh hoàn thành các bài tập sau:

### Phần 1: Lý thuyết (3 điểm)
- Câu 1: Định nghĩa hàm số bậc nhất
- Câu 2: Nêu tính chất của hàm số bậc nhất
- Câu 3: Vẽ đồ thị hàm số $y = 2x + 1$

### Phần 2: Bài tập áp dụng (5 điểm)
Làm các bài tập từ câu 4 đến câu 8 trong sách giáo khoa.

### Phần 3: Bài tập nâng cao (2 điểm)
- Câu 9: Tìm $m$ để hàm số $y = (m-1)x + 2$ đồng biến
- Câu 10: Vẽ đồ thị và tìm giao điểm của hai hàm số

## Lưu ý
- Làm bài vào giấy A4
- Viết rõ ràng, trình bày sạch sẽ
- Chụp ảnh hoặc scan bài làm để nộp
- Nộp đúng hạn để được chấm điểm
    `,
    dueDate: '20/11/2025',
    dueTime: '23:59',
    maxScore: 10,
    attachments: [
      {
        id: 1,
        name: 'Đề bài chi tiết.pdf',
        size: '2.5 MB',
        type: 'application/pdf',
        url: '#',
        uploadDate: '10/11/2025'
      },
      {
        id: 2,
        name: 'Hướng dẫn làm bài.docx',
        size: '1.2 MB',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        url: '#',
        uploadDate: '10/11/2025'
      }
    ],
    allowedFileTypes: ['PDF', 'DOC', 'DOCX', 'JPG', 'PNG', 'ZIP'],
    maxFileSize: '10 MB',
    maxFiles: 5,
    // Uncomment to test with existing submission
    // submission: {
    //   id: 1,
    //   submittedAt: '15/11/2025 14:30',
    //   files: [
    //     {
    //       id: 1,
    //       name: 'Bai_lam_cua_toi.pdf',
    //       size: '3.2 MB',
    //       type: 'application/pdf',
    //       url: '#',
    //       uploadDate: '15/11/2025'
    //     }
    //   ],
    //   note: 'Em đã hoàn thành đầy đủ các bài tập theo yêu cầu.',
    //   status: 'graded',
    //   score: 8.5,
    //   feedback: 'Bài làm tốt, trình bày rõ ràng. Tuy nhiên cần chú ý thêm ở bài 9 về cách tìm điều kiện của m.'
    // }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const addFiles = (files: File[]) => {
    const newFiles = files.slice(0, assignment.maxFiles - uploadedFiles.length);
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (uploadedFiles.length === 0) {
      alert('Vui lòng chọn ít nhất 1 file để nộp bài!');
      return;
    }
    // TODO: Call API to submit assignment
    console.log('Submitting:', { files: uploadedFiles, note });
    setShowSubmitConfirm(false);
    alert('Nộp bài thành công!');
    router.back();
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <ImageIcon className="w-5 h-5 text-green-500" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <Video className="w-5 h-5 text-purple-500" />;
      case 'zip':
      case 'rar':
        return <FileArchive className="w-5 h-5 text-yellow-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const isOverdue = () => {
    const [day, month, year] = assignment.dueDate.split('/');
    const dueDateTime = new Date(`${year}-${month}-${day}T${assignment.dueTime}`);
    return new Date() > dueDateTime;
  };

  const handleLogout = () => {
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/auth/login');
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

      {/* Assignment Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors font-open-sans"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">
                {assignment.title}
              </h1>
              <p className="text-gray-600 font-open-sans">{assignment.className}</p>
            </div>
            
            {assignment.submission?.status === 'graded' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-bold">Điểm: {assignment.submission.score}/{assignment.maxScore}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 mt-4 text-sm font-open-sans">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">
                Hạn nộp: <strong>{assignment.dueDate}</strong> lúc <strong>{assignment.dueTime}</strong>
              </span>
            </div>
            {isOverdue() && !assignment.submission && (
              <span className="flex items-center gap-1 text-red-600">
                <AlertCircle className="w-4 h-4" />
                Đã quá hạn
              </span>
            )}
            {assignment.submission && (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                Đã nộp: {assignment.submission.submittedAt}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Assignment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 font-poppins">
                Mô tả bài tập
              </h2>
              <p className="text-gray-700 leading-relaxed font-open-sans">
                {assignment.description}
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 font-poppins">
                Hướng dẫn chi tiết
              </h2>
              <div className="prose prose-sm max-w-none">
                <div className="text-gray-700 font-open-sans whitespace-pre-line">
                  {assignment.instructions}
                </div>
              </div>
            </div>

            {/* Teacher's Attachments */}
            {assignment.attachments.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 font-poppins">
                  Tài liệu đính kèm ({assignment.attachments.length})
                </h2>
                <div className="space-y-2">
                  {assignment.attachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {getFileIcon(file.name)}
                        <div>
                          <p className="font-medium text-gray-900 font-open-sans">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500 font-open-sans">
                            {file.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-600 hover:text-primary hover:bg-white rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-primary hover:bg-white rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback (if graded) */}
            {assignment.submission?.status === 'graded' && assignment.submission.feedback && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 font-poppins flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  Nhận xét của giáo viên
                </h2>
                <p className="text-gray-700 leading-relaxed font-open-sans">
                  {assignment.submission.feedback}
                </p>
              </div>
            )}

            {/* Submission Form */}
            {!assignment.submission && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 font-poppins">
                  Nộp bài làm
                </h2>

                {/* Upload Area */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-300 hover:border-primary/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium mb-2 font-open-sans">
                        Kéo thả file vào đây hoặc
                      </p>
                      <label className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors font-open-sans">
                        Chọn file từ máy
                        <input
                          type="file"
                          multiple
                          onChange={handleFileSelect}
                          className="hidden"
                          accept={assignment.allowedFileTypes.map(t => `.${t.toLowerCase()}`).join(',')}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 font-open-sans">
                      Cho phép: {assignment.allowedFileTypes.join(', ')} • 
                      Tối đa {assignment.maxFiles} file • 
                      Dung lượng tối đa {assignment.maxFileSize}/file
                    </p>
                  </div>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h3 className="font-semibold text-gray-900 mb-2 font-poppins">
                      File đã chọn ({uploadedFiles.length}/{assignment.maxFiles})
                    </h3>
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.name)}
                          <div>
                            <p className="font-medium text-gray-900 font-open-sans">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500 font-open-sans">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Note */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-900 mb-2 font-poppins">
                    Ghi chú (không bắt buộc)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Thêm ghi chú cho giáo viên..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-open-sans"
                  />
                </div>

                {/* Submit Button */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => router.back()}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-open-sans"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => setShowSubmitConfirm(true)}
                    disabled={uploadedFiles.length === 0}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-open-sans"
                  >
                    Nộp bài
                  </button>
                </div>
              </div>
            )}

            {/* Submitted Work */}
            {assignment.submission && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 font-poppins">
                  Bài làm đã nộp
                </h2>
                
                <div className="space-y-3">
                  {assignment.submission.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.name)}
                        <div>
                          <p className="font-medium text-gray-900 font-open-sans">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500 font-open-sans">
                            {file.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-600 hover:text-primary hover:bg-white rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-primary hover:bg-white rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {assignment.submission.note && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 mb-1 font-poppins">
                      Ghi chú:
                    </p>
                    <p className="text-gray-700 font-open-sans">
                      {assignment.submission.note}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right - Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-base font-bold text-gray-900 mb-4 font-poppins">
                Thông tin bài tập
              </h3>

              <div className="space-y-4 text-sm font-open-sans">
                <div>
                  <p className="text-gray-600 mb-1">Điểm tối đa</p>
                  <p className="font-bold text-gray-900 text-lg">{assignment.maxScore} điểm</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-gray-600 mb-1">Hạn nộp</p>
                  <p className="font-semibold text-gray-900">
                    {assignment.dueDate} • {assignment.dueTime}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-gray-600 mb-1">Trạng thái</p>
                  {assignment.submission ? (
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium ${
                      assignment.submission.status === 'graded'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      <CheckCircle2 className="w-4 h-4" />
                      {assignment.submission.status === 'graded' ? 'Đã chấm điểm' : 'Đã nộp'}
                    </span>
                  ) : isOverdue() ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full font-medium">
                      <AlertCircle className="w-4 h-4" />
                      Quá hạn
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">
                      <Clock className="w-4 h-4" />
                      Chưa nộp
                    </span>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-gray-600 mb-2">Yêu cầu file</p>
                  <div className="space-y-1 text-xs text-gray-700">
                    <p>• Định dạng: {assignment.allowedFileTypes.join(', ')}</p>
                    <p>• Số lượng: Tối đa {assignment.maxFiles} file</p>
                    <p>• Dung lượng: {assignment.maxFileSize}/file</p>
                  </div>
                </div>

                {assignment.submission?.score !== undefined && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-gray-600 mb-1">Điểm số</p>
                    <p className="font-bold text-primary text-2xl">
                      {assignment.submission.score}/{assignment.maxScore}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 font-poppins">
              Xác nhận nộp bài
            </h3>
            <p className="text-gray-700 mb-4 font-open-sans">
              Bạn đã chọn <strong>{uploadedFiles.length}</strong> file để nộp.
            </p>
            <p className="text-gray-700 mb-6 font-open-sans">
              Sau khi nộp bài, bạn không thể chỉnh sửa. Bạn có chắc chắn muốn nộp bài?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-open-sans"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-open-sans"
              >
                Nộp bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
