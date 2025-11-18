interface ClassesHeaderProps {
  title?: string;
  description?: string;
}

export function ClassesHeader({
  title = "Lớp học của tôi",
  description = "Quản lý và theo dõi tiến độ học tập của bạn",
}: ClassesHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">
        {title}
      </h1>
      <p className="text-gray-600 font-open-sans">{description}</p>
    </div>
  );
}
