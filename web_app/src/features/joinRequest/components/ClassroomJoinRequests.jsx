import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { 
  getJoinRequestsByClassroomAsync, 
  handleJoinRequestStatusAsync 
} from '../store/joinRequestSlice';
import { UserPlus, Check, X, Clock, Search, User, Mail } from 'lucide-react';
import { Spinner } from '../../../shared/components/loading/Loading';
import { Button } from '../../../shared/components';

export const ClassroomJoinRequests = ({ classroomId }) => {
  const dispatch = useAppDispatch();
  const { joinRequests, loading, handleLoading } = useAppSelector((state) => state.joinRequest);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (classroomId) {
      dispatch(getJoinRequestsByClassroomAsync(classroomId));
    }
  }, [classroomId, dispatch]);

  const handleApprove = async (request) => {
    setProcessingId(request.id);
    const result = await dispatch(
      handleJoinRequestStatusAsync({
        joinRequestId: request.id,
        data: { status: 'approved' },
      })
    );
    setProcessingId(null);

    if (result.type.endsWith('/fulfilled')) {
      dispatch(getJoinRequestsByClassroomAsync(classroomId));
    }
  };

  const handleReject = async (request) => {
    setProcessingId(request.id);
    const result = await dispatch(
      handleJoinRequestStatusAsync({
        joinRequestId: request.id,
        data: { status: 'rejected' },
      })
    );
    setProcessingId(null);

    if (result.type.endsWith('/fulfilled')) {
      dispatch(getJoinRequestsByClassroomAsync(classroomId));
    }
  };

  const getStatusBadge = (status) => {
    const normalizedStatus = status?.toLowerCase();
    const statusConfig = {
      pending: { label: 'Chờ duyệt', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      approved: { label: 'Đã chấp nhận', className: 'bg-green-100 text-green-800 border-green-300' },
      rejected: { label: 'Đã từ chối', className: 'bg-red-100 text-red-800 border-red-300' },
    };

    const config = statusConfig[normalizedStatus] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-sm border ${config.className}`}>
        {normalizedStatus === 'pending' && <Clock size={12} />}
        {normalizedStatus === 'approved' && <Check size={12} />}
        {normalizedStatus === 'rejected' && <X size={12} />}
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredRequests = joinRequests.filter((request) => {
    const searchLower = searchTerm.toLowerCase();
    const studentName = request.student?.fullName || '';
    const studentEmail = request.student?.email || '';
    return (
      studentName.toLowerCase().includes(searchLower) ||
      studentEmail.toLowerCase().includes(searchLower)
    );
  });

  const pendingRequests = filteredRequests.filter((req) => req.status?.toLowerCase() === 'pending');
  const processedRequests = filteredRequests.filter((req) => req.status?.toLowerCase() !== 'pending');

  // Debug log
  console.log('Join Requests:', joinRequests);
  console.log('Join Requests with status:', joinRequests.map(r => ({ id: r.id, status: r.status, student: r.student?.fullName })));
  console.log('Pending Requests:', pendingRequests);
  console.log('Processed Requests:', processedRequests);

  /* ================= LOADING ================= */
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
      {/* Header with search */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserPlus size={18} className="text-foreground" />
          <h3 className="text-base font-semibold text-foreground">
            Yêu cầu tham gia
            <span className="ml-2 text-sm font-normal text-foreground-light">
              ({joinRequests.length} yêu cầu)
            </span>
          </h3>
        </div>

        {joinRequests.length > 0 && (
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-2.5 text-foreground-light" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-foreground bg-primary"
            />
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
        <div className="space-y-6">
          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock size={16} className="text-yellow-600" />
                Yêu cầu chờ duyệt ({pendingRequests.length})
              </h4>
              <div className="space-y-3">
                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-primary border border-border rounded-sm p-4 hover:border-foreground-light transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{request.student?.fullName || 'N/A'}</p>
                            <div className="flex items-center gap-1 text-xs text-foreground-light">
                              <Mail size={12} />
                              {request.student?.email || 'N/A'}
                            </div>
                          </div>
                        </div>
                        <div className="ml-13 text-xs text-foreground-light">
                          Yêu cầu lúc: {formatDate(request.requestedAt)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleApprove(request)}
                          disabled={processingId === request.id}
                        >
                          <Check size={16} />
                          Chấp nhận
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleReject(request)}
                          disabled={processingId === request.id}
                        >
                          <X size={16} />
                          Từ chối
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Processed Requests */}
          {processedRequests.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">
                Yêu cầu đã xử lý ({processedRequests.length})
              </h4>
              <div className="space-y-2">
                {processedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-primary border border-border rounded-sm p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <User size={16} className="text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{request.student?.fullName || 'N/A'}</p>
                          <p className="text-xs text-foreground-light">{request.student?.email || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(request.status)}
                        {request.handledAt && (
                          <p className="text-xs text-foreground-light mt-1">
                            {formatDate(request.handledAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
