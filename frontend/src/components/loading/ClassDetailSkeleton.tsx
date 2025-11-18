export const ClassDetailSkeleton = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-open-sans animate-pulse">
            {/* Back Button Bar */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
            </div>

            {/* Cover Image & Class Info */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto">
                    <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-end px-4 sm:px-6 lg:px-8 pb-6">
                            <div className="w-full">
                                <div className="h-8 w-2/3 bg-white/30 rounded mb-2"></div>
                                <div className="flex items-center gap-4">
                                    <div className="h-4 w-32 bg-white/30 rounded"></div>
                                    <div className="h-4 w-40 bg-white/30 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex gap-8 border-b border-gray-200">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="px-4 py-3">
                                    <div className="h-5 w-24 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Today's Lesson Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
                            <div className="space-y-3">
                                {[1, 2].map((i) => (
                                    <div key={i} className="p-4 border border-gray-200 rounded-lg">
                                        <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* About Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-gray-200 rounded"></div>
                                <div className="h-4 w-full bg-gray-200 rounded"></div>
                                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="h-4 w-48 bg-gray-200 rounded"></div>
                                <div className="h-4 w-40 bg-gray-200 rounded"></div>
                                <div className="h-4 w-36 bg-gray-200 rounded"></div>
                            </div>
                        </div>

                        {/* Recent Lessons Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="p-4 border border-gray-200 rounded-lg">
                                        <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Progress Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="h-5 w-32 bg-gray-200 rounded mb-4"></div>
                            <div className="mb-4">
                                <div className="flex justify-between mb-2">
                                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                    <div className="h-4 w-12 bg-gray-200 rounded"></div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3"></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="h-8 w-12 bg-gray-200 rounded mb-1 mx-auto"></div>
                                    <div className="h-3 w-16 bg-gray-200 rounded mx-auto"></div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="h-8 w-12 bg-gray-200 rounded mb-1 mx-auto"></div>
                                    <div className="h-3 w-16 bg-gray-200 rounded mx-auto"></div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="h-5 w-32 bg-gray-200 rounded mb-4"></div>
                            <div className="space-y-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-10 bg-gray-200 rounded-lg"></div>
                                ))}
                            </div>
                        </div>

                        {/* Teacher Info Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="h-5 w-24 bg-gray-200 rounded mb-4"></div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                <div className="flex-1">
                                    <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
