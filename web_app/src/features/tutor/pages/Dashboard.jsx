import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getOverviewStatisticsAsync, 
  getClassroomStatisticsAsync,
  getRevenueTimeSeriesAsync,
  getSubmissionTimeSeriesAsync 
} from '../store/tutorStatisticsSlice';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  FileText, 
  ClipboardList, 
  DollarSign,
  UserCheck,
  UserX,
  Clock,
  CheckCircle
} from 'lucide-react';

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, subValue, iconColor, loading }) => (
  <div className="bg-primary border border-border rounded-sm p-4">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-xs text-foreground-lighter mb-1">{label}</p>
        {loading ? (
          <div className="h-7 w-20 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <p className="text-2xl font-bold text-foreground">{value}</p>
        )}
        {subValue && (
          <p className="text-xs text-foreground-light mt-1">{subValue}</p>
        )}
      </div>
      <div className={`p-2 rounded ${iconColor}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
  </div>
);

// Simple Line Chart Component (without external library)
const SimpleLineChart = ({ data, dataKey, label, color = '#3B82F6', loading }) => {
  if (loading) {
    return (
      <div className="h-48 bg-gray-100 animate-pulse rounded-sm"></div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-foreground-lighter">
        Chưa có dữ liệu
      </div>
    );
  }

  const values = data.map(d => d[dataKey]);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  return (
    <div className="space-y-2">
      <div className="relative h-48 border border-border rounded-sm bg-primary p-3">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-3 bottom-3 flex flex-col justify-between text-xs text-foreground-lighter pr-2">
          <span>{Math.round(max)}</span>
          <span>{Math.round(max / 2)}</span>
          <span>0</span>
        </div>
        
        {/* Chart area */}
        <div className="ml-10 h-full relative">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="2"
              points={data.map((d, i) => {
                const x = (i / (data.length - 1)) * 100;
                const y = 100 - ((d[dataKey] - min) / range) * 100;
                return `${x},${y}`;
              }).join(' ')}
            />
            {/* Points */}
            {data.map((d, i) => {
              const x = (i / (data.length - 1)) * 100;
              const y = 100 - ((d[dataKey] - min) / range) * 100;
              return (
                <circle
                  key={i}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="3"
                  fill={color}
                />
              );
            })}
          </svg>
        </div>
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-foreground-lighter px-2">
        <span>{data[0]?.date}</span>
        {data.length > 2 && <span>{data[Math.floor(data.length / 2)]?.date}</span>}
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const dispatch = useDispatch();
  const [dateRange, setDateRange] = useState(30); // Default 30 days
  
  const {
    overview,
    overviewLoading,
    classroomStats,
    classroomStatsLoading,
    revenueTimeSeries,
    revenueTimeSeriesLoading,
    submissionTimeSeries,
    submissionTimeSeriesLoading,
  } = useSelector((state) => state.tutorStatistics);

  useEffect(() => {
    // Load overview statistics
    dispatch(getOverviewStatisticsAsync());
    
    // Load classroom statistics
    dispatch(getClassroomStatisticsAsync());
    
    // Load time series data (default 30 days)
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - dateRange * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    
    dispatch(getRevenueTimeSeriesAsync({ startDate, endDate }));
    dispatch(getSubmissionTimeSeriesAsync({ startDate, endDate }));
  }, [dispatch, dateRange]);

  const handleDateRangeChange = (days) => {
    setDateRange(days);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Dashboard Gia Sư
        </h1>
        <p className="text-sm text-foreground-light">
          Tổng quan hoạt động giảng dạy và doanh thu
        </p>
      </div>

      {/* Overview Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <StatCard
          icon={BookOpen}
          label="Tổng lớp học"
          value={overview?.totalClassrooms || 0}
          iconColor="bg-info"
          loading={overviewLoading}
        />
        <StatCard
          icon={Users}
          label="Tổng học sinh"
          value={overview?.totalStudents || 0}
          subValue={`${overview?.paidStudents || 0} đã thanh toán`}
          iconColor="bg-success"
          loading={overviewLoading}
        />
        <StatCard
          icon={DollarSign}
          label="Tổng doanh thu"
          value={formatCurrency(overview?.totalRevenue || 0)}
          iconColor="bg-warning"
          loading={overviewLoading}
        />
        <StatCard
          icon={Clock}
          label="Chờ chấm bài"
          value={overview?.pendingSubmissions || 0}
          iconColor="bg-error"
          loading={overviewLoading}
        />
        <StatCard
          icon={UserCheck}
          label="Chờ duyệt"
          value={overview?.pendingJoinRequests || 0}
          iconColor="bg-gray-600"
          loading={overviewLoading}
        />
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={FileText}
          label="Bài giảng"
          value={overview?.totalLectures || 0}
          iconColor="bg-info"
          loading={overviewLoading}
        />
        <StatCard
          icon={ClipboardList}
          label="Bài tập"
          value={overview?.totalExercises || 0}
          iconColor="bg-success"
          loading={overviewLoading}
        />
        <StatCard
          icon={CheckCircle}
          label="Bài kiểm tra"
          value={overview?.totalQuizzes || 0}
          iconColor="bg-warning"
          loading={overviewLoading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Chart */}
        <div className="bg-primary border border-border rounded-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-foreground">Doanh thu</h3>
            <div className="flex gap-1">
              {[7, 14, 30, 90].map((days) => (
                <button
                  key={days}
                  onClick={() => handleDateRangeChange(days)}
                  className={`px-2 py-1 text-xs font-medium rounded-sm transition-colors ${
                    dateRange === days
                      ? 'bg-foreground text-white'
                      : 'text-foreground-light hover:bg-gray-100'
                  }`}
                >
                  {days}d
                </button>
              ))}
            </div>
          </div>
          <SimpleLineChart
            data={revenueTimeSeries}
            dataKey="revenue"
            label="Doanh thu"
            color="#F59E0B"
            loading={revenueTimeSeriesLoading}
          />
        </div>

        {/* Submission Chart */}
        <div className="bg-primary border border-border rounded-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-foreground">Bài nộp</h3>
            <div className="flex gap-1">
              {[7, 14, 30, 90].map((days) => (
                <button
                  key={days}
                  onClick={() => handleDateRangeChange(days)}
                  className={`px-2 py-1 text-xs font-medium rounded-sm transition-colors ${
                    dateRange === days
                      ? 'bg-foreground text-white'
                      : 'text-foreground-light hover:bg-gray-100'
                  }`}
                >
                  {days}d
                </button>
              ))}
            </div>
          </div>
          <SimpleLineChart
            data={submissionTimeSeries}
            dataKey="submissionCount"
            label="Bài nộp"
            color="#10B981"
            loading={submissionTimeSeriesLoading}
          />
        </div>
      </div>

      {/* Classroom Stats Table */}
      <div className="bg-primary border border-border rounded-sm">
        <div className="p-4 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">Thống kê lớp học</h3>
        </div>
        <div className="overflow-x-auto">
          {classroomStatsLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-foreground border-r-transparent"></div>
            </div>
          ) : classroomStats.length === 0 ? (
            <div className="p-8 text-center text-sm text-foreground-lighter">
              Chưa có lớp học nào
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Lớp học</th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">Học sinh</th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">Bài học</th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">Doanh thu</th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">Chờ chấm</th>
                </tr>
              </thead>
              <tbody>
                {classroomStats.map((classroom) => (
                  <tr key={classroom.classroomId} className="border-b border-border hover:bg-gray-50">
                    <td className="px-4 py-3 text-foreground font-medium">
                      {classroom.classroomName}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground-light">
                      {classroom.totalStudents}
                      <span className="text-xs ml-1">
                        ({classroom.paidStudents} đã TT)
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-foreground-light">
                      {classroom.totalLessons}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground font-medium">
                      {formatCurrency(classroom.revenue)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {classroom.pendingSubmissions > 0 ? (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-error-bg text-error-text rounded-sm">
                          {classroom.pendingSubmissions}
                        </span>
                      ) : (
                        <span className="text-foreground-lighter">0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
