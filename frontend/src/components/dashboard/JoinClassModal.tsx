import { useState } from 'react';
import { X, Search, School } from 'lucide-react';

interface JoinClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (classCode: string) => void;
}

export function JoinClassModal({ isOpen, onClose, onSubmit }: JoinClassModalProps) {
  const [classCode, setClassCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!classCode.trim()) {
      setError('Vui lòng nhập mã lớp học');
      return;
    }

    if (classCode.length < 6) {
      setError('Mã lớp học phải có ít nhất 6 ký tự');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Call API or parent handler
      await onSubmit(classCode.trim().toUpperCase());
      
      // Reset form on success
      setClassCode('');
      onClose();
    } catch (err) {
      setError('Không tìm thấy lớp học với mã này');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setClassCode('');
    setError('');
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-blue-600 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <School className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-poppins">
                Tham gia lớp học
              </h2>
              <p className="text-sm text-blue-100 font-open-sans">
                Nhập mã lớp để tham gia
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-6">
          <div className="mb-6">
            <label 
              htmlFor="classCode" 
              className="block text-sm font-medium text-gray-700 mb-2 font-open-sans"
            >
              Mã lớp học
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="classCode"
                value={classCode}
                onChange={(e) => {
                  setClassCode(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="Ví dụ: MATH12A"
                className={`
                  block w-full pl-10 pr-3 py-3 border rounded-lg 
                  font-open-sans text-base
                  focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                  transition-all
                  ${error 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
                disabled={isLoading}
                maxLength={20}
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600 font-open-sans flex items-center gap-1">
                <span className="inline-block w-4 h-4 text-red-500">⚠</span>
                {error}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500 font-open-sans">
              Mã lớp học do giáo viên cung cấp, gồm 6-20 ký tự
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-2 font-poppins">
              💡 Lưu ý
            </h3>
            <ul className="text-xs text-blue-800 space-y-1 font-open-sans">
              <li>• Mã lớp không phân biệt chữ hoa/thường</li>
              <li>• Yêu cầu tham gia sẽ được gửi đến giáo viên</li>
              <li>• Bạn có thể tham gia nhiều lớp cùng lúc</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors font-open-sans"
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading || !classCode.trim()}
              className={`
                flex-1 px-4 py-3 font-medium rounded-lg transition-all font-open-sans
                ${isLoading || !classCode.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-lg hover:scale-[1.02]'
                }
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                      fill="none"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang tìm...
                </span>
              ) : (
                'Tham gia'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
