import { Clock, CheckCircle, Send, Settings, Maximize, Minimize, Sun, Moon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface QuizHeaderProps {
  title: string;
  className: string;
  timeRemaining: number;
  isSubmitted: boolean;
  score?: string;
  maxScore: number;
  onSubmit: () => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
  imageSize: number;
  onImageSizeChange: (size: number) => void;
}export function QuizHeader({
    title,
    className,
    timeRemaining,
    isSubmitted,
    score,
    maxScore,
    onSubmit,
    fontSize,
    onFontSizeChange,
    isDarkMode,
    onDarkModeToggle,
    imageSize,
    onImageSizeChange,
}: QuizHeaderProps) {
    const [showSettings, setShowSettings] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setShowSettings(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle fullscreen toggle
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                setIsFullscreen(true);
            }).catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen().then(() => {
                setIsFullscreen(false);
            });
        }
    };

    // Listen for fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    return (
        <div className={`border-b ${isDarkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className={`text-2xl font-bold font-poppins ${isDarkMode ? 'text-gray-100' : 'text-gray-900'
                            }`}>{title}</h1>
                        <p className={`text-sm font-open-sans ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>{className}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Settings Dropdown */}
                        <div className="relative" ref={settingsRef}>
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                title="Cài đặt"
                            >
                                <Settings className="w-5 h-5 text-gray-600" />
                            </button>

                            {showSettings && (
                                <div className={`absolute right-0 top-full mt-2 w-80 rounded-xl shadow-lg border p-4 z-50 ${isDarkMode
                                        ? 'bg-gray-800 border-gray-700'
                                        : 'bg-white border-gray-200'
                                    }`}>
                                    <h3 className={`font-semibold mb-4 font-poppins ${isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                        }`}>
                                        Cài đặt
                                    </h3>

                                    {/* Fullscreen Toggle */}
                                    <div className={`mb-4 pb-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
                                        }`}>
                                        <button
                                            onClick={toggleFullscreen}
                                            className={`cursor-pointer w-full flex items-center justify-between p-3 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {isFullscreen ? (
                                                    <Minimize className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                                        }`} />
                                                ) : (
                                                    <Maximize className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                                        }`} />
                                                )}
                                                <span className={`text-sm font-medium font-open-sans ${isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                                    }`}>
                                                    Toàn màn hình
                                                </span>
                                            </div>
                                            <div
                                                className={`w-11 h-6 rounded-full transition-colors ${isFullscreen ? 'bg-primary' : 'bg-gray-300'
                                                    }`}
                                            >
                                                <div
                                                    className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform m-0.5 ${isFullscreen ? 'translate-x-5' : 'translate-x-0'
                                                        }`}
                                                />
                                            </div>
                                        </button>
                                    </div>

                                    {/* Dark Mode Toggle */}
                                    <div className={`mb-4 pb-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
                                        }`}>
                                        <button
                                            onClick={onDarkModeToggle}
                                            className={`cursor-pointer w-full flex items-center justify-between p-3 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {isDarkMode ? (
                                                    <Moon className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                                        }`} />
                                                ) : (
                                                    <Sun className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                                        }`} />
                                                )}
                                                <span className={`text-sm font-medium font-open-sans ${isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                                    }`}>
                                                    Chế độ tối
                                                </span>
                                            </div>
                                            <div
                                                className={`w-11 h-6 rounded-full transition-colors ${isDarkMode ? 'bg-primary' : 'bg-gray-300'
                                                    }`}
                                            >
                                                <div
                                                    className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform m-0.5 ${isDarkMode ? 'translate-x-5' : 'translate-x-0'
                                                        }`}
                                                />
                                            </div>
                                        </button>
                                    </div>

                                    {/* Font Size Slider */}
                                    <div className={`space-y-3 pb-4 mb-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
                                        }`}>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm font-medium font-open-sans ${isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                                }`}>
                                                Cỡ chữ đề bài
                                            </span>
                                            <span className={`text-sm font-semibold ${isDarkMode ? "text-gray-200" : "text-primary"}`}>
                                                {fontSize}px
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <input
                                                type="range"
                                                min="14"
                                                max="24"
                                                value={fontSize}
                                                onChange={(e) => onFontSizeChange(Number(e.target.value))}
                                                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                                                style={{
                                                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((fontSize - 14) / 10) * 100}%, ${isDarkMode ? '#4b5563' : '#e5e7eb'} ${((fontSize - 14) / 10) * 100}%, ${isDarkMode ? '#4b5563' : '#e5e7eb'} 100%)`
                                                }}
                                            />
                                            <div className={`flex justify-between text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                }`}>
                                                <span>Nhỏ</span>
                                                <span>Vừa</span>
                                                <span>Lớn</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Image Size Slider */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm font-medium font-open-sans ${isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                                }`}>
                                                Kích thước hình ảnh
                                            </span>
                                            <span className={`text-sm font-semibold ${isDarkMode ? "text-gray-200" : "text-primary"}`}>
                                                {imageSize}%
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <input
                                                type="range"
                                                min="50"
                                                max="150"
                                                value={imageSize}
                                                onChange={(e) => onImageSizeChange(Number(e.target.value))}
                                                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                                                style={{
                                                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((imageSize - 50) / 100) * 100}%, ${isDarkMode ? '#4b5563' : '#e5e7eb'} ${((imageSize - 50) / 100) * 100}%, ${isDarkMode ? '#4b5563' : '#e5e7eb'} 100%)`
                                                }}
                                            />
                                            <div className={`flex justify-between text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                }`}>
                                                <span>50%</span>
                                                <span>100%</span>
                                                <span>150%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Timer */}
                        {!isSubmitted && (
                            <div
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeRemaining < 300
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-blue-100 text-blue-800'
                                    }`}
                            >
                                <Clock className="w-5 h-5" />
                                <span className="font-bold font-mono text-lg">
                                    {formatTime(timeRemaining)}
                                </span>
                            </div>
                        )}



                        {/* Submit Button */}
                        {!isSubmitted && (
                            <button
                                onClick={onSubmit}
                                className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-open-sans"
                            >
                                <Send className="w-4 h-4" />
                                Nộp bài
                            </button>
                        )}
                        {/* Score */}
                        {isSubmitted && score && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-bold">
                                    Điểm: {score}/{maxScore}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
