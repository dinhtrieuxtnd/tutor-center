import { useState, useEffect } from "react";
import { Grid3x3, List } from "lucide-react";
import { ClassToolbar } from "@/components/class/classes";
import { LoadingSpinner } from "@/components/loading";
import { SelectDropdown } from "@/components/dropdown";
import { useAuth, useClassroom, useDebounce, useJoinRequest, useNotification } from "@/hooks";
import { ClassesList } from "./ClassesList";
import { Pagination } from "./Pagination";
import { ViewMode } from "./types";

interface AllClassesSectionProps {}

export function AllClassesSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tutorId, setTutorId] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [enrollingClassroomId, setEnrollingClassroomId] = useState<number | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const debouncedTutorId = useDebounce(tutorId, 300);

  const { user } = useAuth();
  const {
    classrooms,
    myEnrollments,
    total,
    isLoading,
    isLoadingEnrollments,
    fetchClassrooms,
    fetchMyEnrollments,
  } = useClassroom();

  const {
    myRequests,
    createJoinRequest,
    fetchMyJoinRequests,
  } = useJoinRequest();

  const { success, error, info } = useNotification();

  // Fetch all classrooms with filters
  useEffect(() => {
    if (!user) return;
    const params: any = {
      page: currentPage,
      pageSize: pageSize,
    };

    if (debouncedSearchQuery) {
      params.q = debouncedSearchQuery;
    }

    if (debouncedTutorId) {
      params.tutorId = Number(debouncedTutorId);
    }

    fetchClassrooms(params);
  }, [user, currentPage, pageSize, debouncedSearchQuery, debouncedTutorId, fetchClassrooms]);

  // Fetch my enrollments
  useEffect(() => {
    if (!user) return;
    fetchMyEnrollments();
  }, [user, fetchMyEnrollments]);

  // Fetch my join requests
  useEffect(() => {
    if (!user) return;
    fetchMyJoinRequests();
  }, [user, fetchMyJoinRequests]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleTutorIdChange = (id: string) => {
    setTutorId(id);
    setCurrentPage(1);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleEnroll = async (classroomId: number) => {
    if (!user) {
      error('Vui lòng đăng nhập để đăng ký lớp học');
      return;
    }

    // Kiểm tra xem đã đăng ký lớp học chưa
    if (enrolledClassroomIds.includes(classroomId)) {
      info('Bạn đã là thành viên của lớp học này');
      return;
    }

    // Kiểm tra xem đã gửi yêu cầu chưa
    const existingRequest = myRequests?.find(r => r.classroomId === classroomId);
    if (existingRequest?.status === 'pending') {
      info('Yêu cầu tham gia của bạn đang chờ duyệt');
      return;
    }

    setEnrollingClassroomId(classroomId);

    try {
      await createJoinRequest({
        classroomId,
        studentId: user.userId,
      });

      success('Đã gửi yêu cầu tham gia lớp học. Vui lòng chờ giáo viên duyệt.');
      fetchMyJoinRequests();
    } catch (err: any) {
      error(err?.message || 'Không thể gửi yêu cầu tham gia lớp học');
    } finally {
      setEnrollingClassroomId(null);
    }
  };

  const enrolledClassroomIds = myEnrollments?.map(c => c.classroomId) || [];
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 font-poppins">
          Danh sách khóa học
        </h2>
        <p className="text-gray-600 font-open-sans">
          Khám phá và tham gia các khóa học phù hợp với bạn
        </p>
      </div>

      {/* Custom Toolbar for All Classes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-open-sans"
              />
            </div>
          </div>

          {/* Tutor ID Filter & View Mode */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="ID giáo viên..."
              value={tutorId}
              onChange={(e) => handleTutorIdChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-open-sans w-40"
            />

            {/* View Mode */}
            <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
              <button
                onClick={() => handleViewModeChange("grid")}
                className={`cursor-pointer p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleViewModeChange("list")}
                className={`cursor-pointer p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Page Size */}
            <SelectDropdown
              value={pageSize}
              options={[
                { label: "10/trang", value: 10 },
                { label: "20/trang", value: 20 },
                { label: "50/trang", value: 50 },
              ]}
              onChange={handlePageSizeChange}
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" className="text-blue-600" />
          </div>
        ) : (
          <>
            <ClassesList
              viewMode={viewMode}
              searchQuery={searchQuery}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}
