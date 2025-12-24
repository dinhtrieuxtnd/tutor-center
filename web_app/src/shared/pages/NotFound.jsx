import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { ROUTES } from '../../core/constants';

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-primary-dark flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-error-bg rounded-sm mb-6">
                    <AlertCircle className="w-8 h-8 text-error" />
                </div>

                {/* 404 */}
                <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>

                {/* Message */}
                <h2 className="text-xl font-semibold text-foreground mb-2">
                    Không tìm thấy trang
                </h2>
                <p className="text-sm text-foreground-light mb-6">
                    Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 text-sm font-medium text-foreground border border-border rounded-sm hover:bg-gray-100 transition-colors"
                    >
                        Quay lại
                    </button>
                    <button
                        onClick={() => navigate(ROUTES.HOME)}
                        className="px-4 py-2 bg-foreground text-white text-sm font-medium rounded-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                        <Home size={16} />
                        Về trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
};
