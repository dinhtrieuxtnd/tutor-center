export const LessonCardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-primary/50 transition-all animate-pulse">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
                <div className="flex-1 min-w-0">
                    <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded mb-3"></div>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const LessonListSkeleton = () => {
    return (
        <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
                <LessonCardSkeleton key={i} />
            ))}
        </div>
    );
};
