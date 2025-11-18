"use client";

import { useRouter } from "next/navigation";
import {
  BookOpen,
  Users,
  Clock,
  CheckCircle,
  Hourglass,
  UserPlus,
  XCircle,
} from "lucide-react";
import { ClassroomResponse } from "@/services/classroomApi";

interface ClassCardProps {
  classItem: ClassroomResponse;
  viewMode: "grid" | "list";
  isEnrolled?: boolean;
  joinRequestStatus?: 'pending' | 'accepted' | 'rejected';
  isLoadingEnrollments?: boolean;
  onEnroll?: (classroomId: number) => void;
}

export function ClassCard({
  classItem,
  viewMode,
  isEnrolled = false,
  joinRequestStatus,
  isLoadingEnrollments = false,
  onEnroll,
}: ClassCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    if (isEnrolled) {
      router.push(`/student/class/${classItem.classroomId}`);
    }
  };

  const handleEnrollClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEnroll && !isEnrolled && joinRequestStatus !== 'pending') {
      onEnroll(classItem.classroomId);
    }
  };

  const getEnrollButtonContent = () => {
    if (isLoadingEnrollments) {
      return <div className="w-full h-9 bg-gray-200 rounded-lg animate-pulse"></div>;
    }

    if (isEnrolled) {
      return (
        <button
          disabled
          className="cursor-not-allowed w-full py-2 px-4 bg-green-50 text-green-700 border border-green-200 rounded-lg font-medium text-sm font-open-sans flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Đã đăng ký
        </button>
      );
    }
    // console.log('joinRequestStatus:', joinRequestStatus);
    if (joinRequestStatus === 'pending') {
      return (
        <button
          disabled
          className="cursor-not-allowed w-full py-2 px-4 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg font-medium text-sm font-open-sans flex items-center justify-center gap-2"
        >
          <Hourglass className="w-4 h-4" />
          Đang chờ duyệt
        </button>
      );
    }

    if (joinRequestStatus === 'rejected') {
      return (
        <button
          onClick={handleEnrollClick}
          className="cursor-pointer w-full py-2 px-4 bg-red-50 text-red-700 border border-red-200 rounded-lg font-medium text-sm font-open-sans hover:bg-red-100 transition-all flex items-center justify-center gap-2"
        >
          <XCircle className="w-4 h-4" />
          Gửi lại yêu cầu
        </button>
      );
    }

    return (
      <button
        onClick={handleEnrollClick}
        className="cursor-pointer w-full py-2 px-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-medium text-sm font-open-sans hover:shadow-lg transition-all flex items-center justify-center gap-2"
      >
        <UserPlus className="w-4 h-4" />
        Đăng ký ngay
      </button>
    );
  };

  const getEnrollButtonContentList = () => {
    if (isLoadingEnrollments) {
      return <div className="w-32 h-9 bg-gray-200 rounded-lg animate-pulse"></div>;
    }

    if (isEnrolled) {
      return (
        <button
          disabled
          className="cursor-not-allowed py-2 px-4 bg-green-50 text-green-700 border border-green-200 rounded-lg font-medium text-sm font-open-sans flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Đã đăng ký
        </button>
      );
    }

    if (joinRequestStatus === 'pending') {
      return (
        <button
          disabled
          className="cursor-not-allowed py-2 px-4 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg font-medium text-sm font-open-sans flex items-center gap-2"
        >
          <Hourglass className="w-4 h-4" />
          Đang chờ
        </button>
      );
    }

    if (joinRequestStatus === 'rejected') {
      return (
        <button
          onClick={handleEnrollClick}
          className="cursor-pointer py-2 px-4 bg-red-50 text-red-700 border border-red-200 rounded-lg font-medium text-sm font-open-sans hover:bg-red-100 transition-all flex items-center gap-2"
        >
          <XCircle className="w-4 h-4" />
          Gửi lại
        </button>
      );
    }

    return (
      <button
        onClick={handleEnrollClick}
        className="cursor-pointer py-2 px-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-medium text-sm font-open-sans hover:shadow-lg transition-all flex items-center gap-2"
      >
        <UserPlus className="w-4 h-4" />
        Đăng ký ngay
      </button>
    );
  };

  const getStatusInfo = () => {
    // Determine status based on isArchived
    if (classItem.isArchived) {
      return {
        label: "Đã lưu trữ",
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: CheckCircle,
        dotColor: "bg-gray-500",
      };
    }
    return {
      label: "Đang hoạt động",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
      dotColor: "bg-green-500",
    };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  if (viewMode === "list") {
    return (
      <div 
        onClick={handleCardClick}
        className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-primary/50 transition-all ${
          isEnrolled ? 'cursor-pointer' : ''
        }`}
      >
        <div className="flex items-start gap-6">
          {/* Cover Image */}
          <div className="w-32 h-24 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex-shrink-0 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1 font-poppins">
                  {classItem.name}
                </h3>
                <p className="text-sm text-gray-600 font-open-sans">
                  {classItem.tutorName}
                </p>
              </div>
              <div className="flex flex-row gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color} flex items-center gap-1`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`}
                  ></span>
                  {statusInfo.label}
                </span>
                {/* Enrollment Button */}
                {onEnroll && (
                  <div className="flex-shrink-0">
                    {getEnrollButtonContentList()}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 font-open-sans">
                <Users className="w-4 h-4" />
                {classItem.studentCount} học sinh
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 font-open-sans">
                <span className="font-medium text-primary">
                  {classItem.price.toLocaleString("vi-VN")}₫
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 font-open-sans">
                {new Date(classItem.createdAt).toLocaleDateString("vi-VN")}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {classItem.description && (
                <p className="text-sm text-gray-600 line-clamp-2 font-open-sans flex-1">
                  {classItem.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div 
      onClick={handleCardClick}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-primary/50 transition-all ${
        isEnrolled ? 'cursor-pointer' : ''
      }`}
    >
      {/* Cover */}
      <div className="h-40 bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center relative">
        <BookOpen className="w-16 h-16 text-white" />
        <span
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${statusInfo.color} flex items-center gap-1`}
        >
          <span
            className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`}
          ></span>
          {statusInfo.label}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-bold text-gray-900 mb-2 font-poppins line-clamp-2">
          {classItem.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 font-open-sans">
          {classItem.tutorName}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 font-open-sans">
            <Users className="w-4 h-4" />
            {classItem.studentCount} học sinh
          </div>
          <div className="flex items-center justify-between text-sm font-open-sans">
            <span className="text-gray-600">Học phí:</span>
            <span className="font-medium text-primary">
              {classItem.price.toLocaleString("vi-VN")}₫
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-open-sans">
            <Clock className="w-4 h-4" />
            {new Date(classItem.createdAt).toLocaleDateString("vi-VN")}
          </div>
        </div>

        {classItem.description && (
          <p className="text-xs text-gray-600 line-clamp-2 font-open-sans border-t pt-3 mb-3">
            {classItem.description}
          </p>
        )}

        {/* Enrollment Button */}
        {onEnroll && (
          <div className={classItem.description ? "mt-3" : "border-t pt-3"}>
            {getEnrollButtonContent()}
          </div>
        )}
      </div>
    </div>
  );
}
