export function LearnPageSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col animate-pulse">
            {/* Breadcrumb Skeleton */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="w-20 h-4 bg-gray-200 rounded"></div>
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                        <div className="w-32 h-4 bg-gray-200 rounded"></div>
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                        <div className="w-16 h-4 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar Skeleton - Fixed */}
                <div className="w-80 flex-shrink-0 bg-white border-r border-gray-200 fixed left-0 top-[52px] bottom-0 z-20">
                    <div className="p-4 border-b border-gray-200">
                        <div className="w-32 h-6 bg-gray-200 rounded mb-2"></div>
                        <div className="w-20 h-4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="p-4 space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                                    <div className="flex-1">
                                        <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
                                        <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Area Skeleton */}
                <div className="flex-1 flex flex-col ml-80">
                    <div className="flex-1 overflow-y-auto pb-20">
                        <div className="max-w-5xl mx-auto px-6 py-8">
                            {/* Header Skeleton */}
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                    <div className="flex-1">
                                        <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
                                        <div className="w-64 h-8 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-32 h-4 bg-gray-200 rounded"></div>
                                    <div className="w-32 h-4 bg-gray-200 rounded"></div>
                                </div>
                            </div>

                            {/* Content Skeleton */}
                            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
                                <div className="space-y-4">
                                    <div className="w-full h-4 bg-gray-200 rounded"></div>
                                    <div className="w-full h-4 bg-gray-200 rounded"></div>
                                    <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                                    <div className="w-full h-4 bg-gray-200 rounded"></div>
                                    <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
                                </div>
                            </div>

                            {/* Attachment Skeleton */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                                    <div className="w-40 h-6 bg-gray-200 rounded"></div>
                                </div>
                                <div className="space-y-3">
                                    <div className="w-full h-16 bg-gray-50 rounded-lg"></div>
                                    <div className="w-full h-12 bg-gray-50 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
