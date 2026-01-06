import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { getStudentsByClassroomIdAsync, removeStudentFromClassroomAsync } from '../store/clrStudentSlice';
import { Users, Search } from 'lucide-react';
import { Spinner } from '../../../shared/components/loading/Loading';
import { ConfirmModal } from '../../../shared/components';
import { StudentCard } from './StudentCard';
import { JoinRequestList } from './JoinRequestList';

export const ClassroomStudents = ({ classroomId }) => {
    const dispatch = useAppDispatch();
    const { students, loading, removeLoading } = useAppSelector((state) => state.clrStudent);
    const [searchTerm, setSearchTerm] = useState('');
    const [removingStudentId, setRemovingStudentId] = useState(null);
    const [confirmRemove, setConfirmRemove] = useState({ isOpen: false, student: null });
    const [activeTab, setActiveTab] = useState('students');

    useEffect(() => {
        if (classroomId) {
            dispatch(getStudentsByClassroomIdAsync(classroomId));
        }
    }, [classroomId, dispatch]);

    const handleRemoveStudent = (student) => {
        setConfirmRemove({ isOpen: true, student });
    };

    const handleConfirmRemove = async () => {
        const student = confirmRemove.student;
        if (!student) return;

        setRemovingStudentId(student.userId);
        const result = await dispatch(
            removeStudentFromClassroomAsync({
                classroomId,
                studentId: student.userId,
            })
        );
        setRemovingStudentId(null);
        setConfirmRemove({ isOpen: false, student: null });

        if (result.type.endsWith('/fulfilled')) {
            dispatch(getStudentsByClassroomIdAsync(classroomId));
        }
    };

    const handleCancelRemove = () => {
        setConfirmRemove({ isOpen: false, student: null });
    };

    const filteredStudents = students.filter((student) =>
        student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    /* ================= LOADING ================= */
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <Spinner size="lg" className="mx-auto mb-2" />
                    <p className="text-sm text-foreground-light">Đang tải danh sách học sinh...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Tabs */}
            <div className="mb-6 border-b border-border">
                <div className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'students'
                                ? 'border-info text-info'
                                : 'border-transparent text-foreground-light hover:text-foreground'
                        }`}
                    >
                        Học sinh ({students.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'requests'
                                ? 'border-info text-info'
                                : 'border-transparent text-foreground-light hover:text-foreground'
                        }`}
                    >
                        Yêu cầu tham gia
                    </button>
                </div>
            </div>

            {/* Tab content */}
            {activeTab === 'students' ? (
                <div>
                    {/* Header with search */}
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users size={18} className="text-foreground" />
                            <h3 className="text-base font-semibold text-foreground">
                                Danh sách học sinh
                                <span className="ml-2 text-sm font-normal text-foreground-light">
                                    ({students.length} học sinh)
                                </span>
                            </h3>
                        </div>
                        
                        {students.length > 0 && (
                            <div className="relative w-64">
                                <Search size={16} className="absolute left-3 top-2.5 text-foreground-light" />
                                <input
                                    type="text"
                                    placeholder="Tìm học sinh..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-foreground bg-primary"
                                />
                            </div>
                        )}
                    </div>

                    {/* Empty state */}
                    {students.length === 0 ? (
                        <div className="flex items-center justify-center py-12 bg-primary border border-border rounded-sm">
                            <div className="text-center">
                                <Users size={48} className="text-gray-300 mx-auto mb-3" />
                                <p className="text-sm text-foreground-light">Chưa có học sinh nào trong lớp</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Students grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {filteredStudents.map((student) => (
                                    <StudentCard
                                        key={student.userId}
                                        student={student}
                                        onRemove={handleRemoveStudent}
                                        isRemoving={removingStudentId === student.userId}
                                    />
                                ))}
                            </div>

                            {/* No results */}
                            {filteredStudents.length === 0 && searchTerm && (
                                <div className="flex items-center justify-center py-12 bg-primary border border-border rounded-sm">
                                    <div className="text-center">
                                        <Search size={48} className="text-gray-300 mx-auto mb-3" />
                                        <p className="text-sm text-foreground-light">
                                            Không tìm thấy học sinh phù hợp
                                        </p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            ) : (
                <JoinRequestList classroomId={classroomId} />
            )}

            <ConfirmModal
                isOpen={confirmRemove.isOpen}
                onClose={handleCancelRemove}
                onConfirm={handleConfirmRemove}
                title="Xóa học sinh khỏi lớp"
                message={`Bạn có chắc chắn muốn xóa học sinh "${confirmRemove.student?.fullName}" khỏi lớp học này?`}
                confirmText="Xóa"
                cancelText="Hủy"
                variant="danger"
                isLoading={removingStudentId === confirmRemove.student?.userId}
            />
        </div>
    );
};
