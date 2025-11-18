interface TeacherInfoProps {
  teacherName: string;
}

export function TeacherInfo({ teacherName }: TeacherInfoProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-base font-bold text-gray-900 mb-4 font-poppins">
        Giáo viên
      </h3>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-semibold font-poppins">
          {teacherName.charAt(0)}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 font-poppins">
            {teacherName}
          </h4>
          <p className="text-sm text-gray-600 font-open-sans">
            Giáo viên môn Toán
          </p>
        </div>
      </div>
      <button className="mt-4 w-full px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-open-sans">
        Liên hệ giáo viên
      </button>
    </div>
  );
}
