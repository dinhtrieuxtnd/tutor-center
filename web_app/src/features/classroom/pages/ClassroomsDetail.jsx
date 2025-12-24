import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { getClassroomByIdAsync } from '../../../features/classroom/store/classroomSlice';
import { School, ArrowLeft, Info, Users, MessageCircle } from 'lucide-react';
import { Spinner } from '../../../shared/components/loading/Loading';
import { Button } from '../../../shared/components';
import { ROUTES } from '../../../core/constants';
import { ClassroomInfo } from '../components/ClassroomInfo';
import { ClassroomStudents } from '../components/ClassroomStudents';
import { ClassroomChat } from '../components/ClassroomChat';

const TABS = {
    INFO: 'info',
    STUDENTS: 'students',
    CHAT: 'chat',
};

export const ClassroomsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const profile = useAppSelector((state) => state.profile.profile);
    const { currentClassroom, classroomDetailLoading } = useAppSelector((state) => state.classroom);
    const [activeTab, setActiveTab] = useState(TABS.INFO);

    // Check if tutor route
    const isTutor = location.pathname.startsWith('/tutor');

    useEffect(() => {
        if (id) {
            dispatch(getClassroomByIdAsync(parseInt(id)));
        }
    }, [id, dispatch]);

    const handleBack = () => {
        const backRoute = isTutor ? ROUTES.TUTOR_CLASSROOMS : ROUTES.ADMIN_CLASSROOMS;
        navigate(backRoute);
    };

    const tabs = [
        { id: TABS.INFO, label: 'Thông tin', icon: Info },
        { id: TABS.STUDENTS, label: 'Học sinh', icon: Users },
        { id: TABS.CHAT, label: 'Phòng chat', icon: MessageCircle },
    ];

    /* ================= LOADING ================= */
    if (classroomDetailLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <Spinner size="lg" className="mx-auto mb-2" />
                    <p className="text-sm text-foreground-light">Đang tải thông tin lớp học...</p>
                </div>
            </div>
        );
    }

    /* ================= NOT FOUND ================= */
    if (!currentClassroom) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <School size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-foreground-light mb-4">Không tìm thấy thông tin lớp học</p>
                    <Button onClick={handleBack} variant="outline">
                        <ArrowLeft size={16} />
                        Quay lại
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="">
            {/* Cover Image Header */}
            <div className="relative w-full h-64 mb-6 rounded-sm overflow-hidden">
                {/* Background Image */}
                {currentClassroom.coverImageUrl ? (
                    <img
                        src={currentClassroom.coverImageUrl}
                        alt={currentClassroom.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600" />
                )}

                {/* Gradient Overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                    {/* Back Button */}
                    <div>
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-sm text-white hover:text-white/80 transition-colors bg-black/30 backdrop-blur-sm px-3 py-2 rounded-sm"
                        >
                            <ArrowLeft size={16} />
                            Quay lại danh sách
                        </button>
                    </div>

                    {/* Classroom Info */}
                    <div className="text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold drop-shadow-lg">
                                {currentClassroom.name}
                            </h1>
                            {currentClassroom.isArchived && (
                                <span className="inline-block px-2 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm text-white rounded-sm">
                                    Đã lưu trữ
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <p className="drop-shadow-md">ID: {currentClassroom.id}</p>
                            {currentClassroom.tutor && (
                                <p className="drop-shadow-md">
                                    Giáo viên: {currentClassroom.tutor.fullName}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border mb-6">
                <div className="flex gap-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                    isActive
                                        ? 'border-foreground text-foreground'
                                        : 'border-transparent text-foreground-light hover:text-foreground hover:border-gray-300'
                                }`}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <div className='w-full'>
                {activeTab === TABS.INFO && <ClassroomInfo classroom={currentClassroom} />}
                {activeTab === TABS.STUDENTS && <ClassroomStudents classroomId={currentClassroom.id} />}
                {activeTab === TABS.CHAT && <ClassroomChat classroomId={currentClassroom.id} />}
            </div>
        </div>
    );
}