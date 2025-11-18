import { PlayCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface StartLearningButtonProps {
    classroomId: number;
}

export function StartLearningButton({ classroomId }: StartLearningButtonProps) {
    const router = useRouter();

    const handleStartLearning = () => {
        // Navigate to first lesson or learning page
        router.push(`/student/class/${classroomId}/learn`);
    };

    return (
        <button
            onClick={handleStartLearning}
            className="cursor-pointer w-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 font-poppins group"
        >
            <PlayCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-lg">Vào học ngay</span>
        </button>
    );
}
