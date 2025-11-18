export const TabContentSkeleton = () => {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
                                <div className="flex-1">
                                    <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Card 2 */}
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
                </div>
            </div>
        </div>
    );
};
