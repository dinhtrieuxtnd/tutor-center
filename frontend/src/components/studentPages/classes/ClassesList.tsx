import { useState } from "react";
import { ClassCard, EmptyClassState } from "@/components/class/classes";
import {
  useAuth,
  useClassroom,
  useJoinRequest,
  useNotification,
} from "@/hooks";
import { ViewMode } from "./types";

interface ClassesListProps {
  viewMode: ViewMode;
  searchQuery: string;
}

export function ClassesList({ viewMode, searchQuery }: ClassesListProps) {
  const [enrollingClassroomId, setEnrollingClassroomId] = useState<
    number | null
  >(null);

  const { user } = useAuth();
  const { classrooms, myEnrollments, isLoadingEnrollments } = useClassroom();

  const { myRequests, createJoinRequest, fetchMyJoinRequests } =
    useJoinRequest();

  const { success, error, info } = useNotification();

  const handleEnroll = async (classroomId: number) => {
    if (!user) {
      error("Vui lòng đăng nhập để đăng ký lớp học");
      return;
    }

    // Kiểm tra xem đã đăng ký lớp học chưa
    if (enrolledClassroomIds.includes(classroomId)) {
      info("Bạn đã là thành viên của lớp học này");
      return;
    }

    // Kiểm tra xem đã gửi yêu cầu chưa
    const existingRequest = myRequests?.find(
      (r) => r.classroomId === classroomId
    );
    if (existingRequest?.status === "pending") {
      info("Yêu cầu tham gia của bạn đang chờ duyệt");
      return;
    }

    setEnrollingClassroomId(classroomId);

    try {
      await createJoinRequest({
        classroomId,
        studentId: user.userId,
      });

      success("Đã gửi yêu cầu tham gia lớp học. Vui lòng chờ giáo viên duyệt.");
      fetchMyJoinRequests();
    } catch (err: any) {
      error(err?.message || "Không thể gửi yêu cầu tham gia lớp học");
    } finally {
      setEnrollingClassroomId(null);
    }
  };

  const enrolledClassroomIds = myEnrollments?.map((c) => c.classroomId) || [];
  if (classrooms.length === 0) {
    return <EmptyClassState searchQuery={searchQuery} onJoinClass={() => {}} />;
  }

  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
      }
    >
      {classrooms.map((classItem) => {
        const joinRequest = myRequests?.find(
          (r) => r.classroomId === classItem.classroomId
        );
        const isThisClassEnrolling =
          enrollingClassroomId === classItem.classroomId;
        return (
          <ClassCard
            key={classItem.classroomId}
            classItem={classItem}
            viewMode={viewMode}
            isEnrolled={enrolledClassroomIds.includes(classItem.classroomId)}
            joinRequestStatus={joinRequest?.status}
            isLoadingEnrollments={isLoadingEnrollments || isThisClassEnrolling}
            onEnroll={handleEnroll}
          />
        );
      })}
    </div>
  );
}
