import { ClassCard } from "@/components/class/classes";
import { LoadingSpinner } from "@/components/loading";
import { ClassItem } from "./types";

interface MyEnrolledClassesSectionProps {
  classes: ClassItem[];
  isLoading: boolean;
}

export function MyEnrolledClassesSection({
  classes,
  isLoading,
}: MyEnrolledClassesSectionProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 font-poppins">
          Khóa học của tôi
        </h2>
        <p className="text-gray-600 font-open-sans">
          Các khóa học bạn đã tham gia
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" className="text-blue-600" />
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <p className="text-gray-500 font-open-sans text-lg">
              Bạn chưa tham gia khóa học nào
            </p>
            <p className="text-gray-400 font-open-sans text-sm">
              Hãy khám phá và đăng ký các khóa học phía trên
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <ClassCard
              key={classItem.classroomId}
              classItem={classItem}
              viewMode="grid"
              isEnrolled={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
