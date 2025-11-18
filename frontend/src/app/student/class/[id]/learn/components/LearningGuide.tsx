import {
    BookOpen,
    Target,
    CheckCircle2,
    LightbulbIcon,
    PlayCircle,
    ArrowRight,
} from 'lucide-react';

export function LearningGuide() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-600 mb-6">
                    <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4 font-poppins">
                    Chào mừng đến với lớp học!
                </h1>
                <p className="text-lg text-gray-600 font-open-sans max-w-2xl mx-auto">
                    Hãy bắt đầu hành trình học tập của bạn bằng cách chọn một bài học từ danh sách bên trái
                </p>
            </div>

            {/* Guide Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 font-poppins">
                        Bài giảng
                    </h3>
                    <p className="text-sm text-gray-600 font-open-sans">
                        Học lý thuyết với các bài giảng chi tiết và tài liệu đính kèm
                    </p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                        <Target className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 font-poppins">
                        Bài tập
                    </h3>
                    <p className="text-sm text-gray-600 font-open-sans">
                        Thực hành với các bài tập để củng cố kiến thức đã học
                    </p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 font-poppins">
                        Bài kiểm tra
                    </h3>
                    <p className="text-sm text-gray-600 font-open-sans">
                        Kiểm tra kiến thức với các bài quiz và đề thi
                    </p>
                </div>
            </div>

            {/* Tips Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                        <LightbulbIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-900 mb-3 font-poppins">
                            Mẹo học tập hiệu quả
                        </h3>
                        <ul className="space-y-3 text-gray-700 font-open-sans">
                            <li className="flex items-start gap-3">
                                <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span>Học theo thứ tự từ trên xuống dưới để nắm vững kiến thức nền tảng</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span>Hoàn thành bài tập sau mỗi bài giảng để kiểm tra mức độ hiểu bài</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span>Chú ý đến deadline của bài tập và bài kiểm tra</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span>Đặt câu hỏi với giáo viên nếu có bất kỳ thắc mắc nào</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-open-sans">
                    <PlayCircle className="w-5 h-5" />
                    <span>Chọn một bài học bên trái để bắt đầu</span>
                </div>
            </div>
        </div>
    );
}
