interface ClassMember {
  id: number;
  name: string;
  avatar?: string;
  role: 'teacher' | 'student';
}

interface MembersTabProps {
  members: ClassMember[];
}

export function MembersTab({ members }: MembersTabProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4 font-poppins">
        Thành viên ({members.length})
      </h2>
      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-semibold font-poppins">
              {member.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 font-poppins">
                {member.name}
              </h3>
              <p className="text-sm text-gray-600 font-open-sans">
                {member.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}
              </p>
            </div>
            {member.role === 'teacher' && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium font-open-sans">
                Giáo viên
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
