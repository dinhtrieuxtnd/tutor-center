import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { 
    getJoinRequestsByClassroomAsync, 
    handleJoinRequestStatusAsync 
} from '../../joinRequest/store/joinRequestSlice';
import { getStudentsByClassroomIdAsync } from '../store/clrStudentSlice';
import { UserPlus, Search } from 'lucide-react';
import { Spinner } from '../../../shared/components/loading/Loading';
import { JoinRequestCard } from './JoinRequestCard';

export const JoinRequestList = ({ classroomId }) => {
    const dispatch = useAppDispatch();
    const { joinRequests, loading, handleLoading } = useAppSelector((state) => state.joinRequest);
    const [searchTerm, setSearchTerm] = useState('');
    const [handlingRequestId, setHandlingRequestId] = useState(null);
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        if (classroomId) {
            dispatch(getJoinRequestsByClassroomAsync(classroomId));
        }
    }, [classroomId, dispatch]);

    const handleApprove = async (request) => {
        setHandlingRequestId(request.id);
        const result = await dispatch(
            handleJoinRequestStatusAsync({
                joinRequestId: request.id,
                data: { status: 1 }, // APPROVED
            })
        );
        setHandlingRequestId(null);

        if (result.type.endsWith('/fulfilled')) {
            // Reload both join requests and students list
            dispatch(getJoinRequestsByClassroomAsync(classroomId));
            dispatch(getStudentsByClassroomIdAsync(classroomId));
        }
    };

    const handleReject = async (request) => {
        setHandlingRequestId(request.id);
        const result = await dispatch(
            handleJoinRequestStatusAsync({
                joinRequestId: request.id,
                data: { status: 2 }, // REJECTED
            })
        );
        setHandlingRequestId(null);

        if (result.type.endsWith('/fulfilled')) {
            dispatch(getJoinRequestsByClassroomAsync(classroomId));
        }
    };

    const filteredRequests = joinRequests
        .filter((request) => {
            const matchesSearch = 
                request.student?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.student?.email?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === 'ALL' || request.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });

    const pendingCount = joinRequests.filter(r => r.status === 'PENDING').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <Spinner size="lg" className="mx-auto mb-2" />
                    <p className="text-sm text-foreground-light">Đang tải danh sách yêu cầu...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <UserPlus size={18} className="text-foreground" />
                    <h3 className="text-base font-semibold text-foreground">
                        Yêu cầu tham gia
                        <span className="ml-2 text-sm font-normal text-foreground-light">
                            ({joinRequests.length} yêu cầu
                            {pendingCount > 0 && (
                                <span className="text-warning"> - {pendingCount} đang chờ</span>
                            )}
                            )
                        </span>
                    </h3>
                </div>
                
                {joinRequests.length > 0 && (
                    <div className="flex items-center gap-2">
                        {/* Status filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-foreground bg-primary"
                        >
                            <option value="ALL">Tất cả</option>
                            <option value="PENDING">Đang chờ</option>
                            <option value="APPROVED">Đã chấp nhận</option>
                            <option value="REJECTED">Đã từ chối</option>
                        </select>

                        {/* Search */}
                        <div className="relative w-64">
                            <Search size={16} className="absolute left-3 top-2.5 text-foreground-light" />
                            <input
                                type="text"
                                placeholder="Tìm yêu cầu..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-foreground bg-primary"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Empty state */}
            {joinRequests.length === 0 ? (
                <div className="flex items-center justify-center py-12 bg-primary border border-border rounded-sm">
                    <div className="text-center">
                        <UserPlus size={48} className="text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-foreground-light">Chưa có yêu cầu tham gia nào</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Requests list */}
                    <div className="space-y-3">
                        {filteredRequests.map((request) => (
                            <JoinRequestCard
                                key={request.id}
                                request={request}
                                onApprove={handleApprove}
                                onReject={handleReject}
                                isHandling={handlingRequestId === request.id}
                            />
                        ))}
                    </div>

                    {/* No results */}
                    {filteredRequests.length === 0 && (searchTerm || statusFilter !== 'ALL') && (
                        <div className="flex items-center justify-center py-12 bg-primary border border-border rounded-sm">
                            <div className="text-center">
                                <Search size={48} className="text-gray-300 mx-auto mb-3" />
                                <p className="text-sm text-foreground-light">
                                    Không tìm thấy yêu cầu phù hợp
                                </p>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
