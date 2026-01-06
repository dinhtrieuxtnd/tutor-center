import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getOverviewStatisticsAsync,
  getTopTutorsAsync,
  getGrowthTimeSeriesAsync,
  getRevenueTimeSeriesAsync,
} from '../store/adminStatisticsSlice';
import {
  TrendingUp,
  Users,
  BookOpen,
  DollarSign,
  UserCheck,
  UserX,
  Award,
  Mail,
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
        {subValue && <p className="text-xs text-foreground-light mt-1">{subValue}</p>}
      </div>
      <div className={`p-2 rounded ${iconColor}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
  </div>
);

// Simple Line Chart Component
const SimpleLineChart = ({ data, dataKeys, labels, colors, loading }) => {
  if (loading) {
    return <div className="h-48 bg-gray-100 animate-pulse rounded-sm"></div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-foreground-lighter">
        Chưa có dữ liệu
      </div>
    );
  }

  // Get all values for Y-axis scaling
  const allValues = dataKeys.flatMap((key) => data.map((d) => d[key]));
  const max = Math.max(...allValues, 1);
  const min = Math.min(...allValues, 0);
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
            {dataKeys.map((key, index) => (
              <g key={key}>
                <polyline
                  fill="none"
                  stroke={colors[index]}
                  strokeWidth="2"
                  points={data
                    .map((d, i) => {
                      const x = (i / (data.length - 1)) * 100;
                      const y = 100 - ((d[key] - min) / range) * 100;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />
                {/* Points */}
                {data.map((d, i) => {
                  const x = (i / (data.length - 1)) * 100;
                  const y = 100 - ((d[key] - min) / range) * 100;
                  return <circle key={i} cx={`${x}%`} cy={`${y}%`} r="3" fill={colors[index]} />;
                })}
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 justify-center text-xs">
        {labels.map((label, index) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors[index] }}></div>
            <span className="text-foreground-light">{label}</span>
          </div>
        ))}
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

// Simple single-line chart
const SimpleSingleLineChart = ({ data, dataKey, label, color = '#3B82F6', loading }) => {
  if (loading) {
    return <div className="h-48 bg-gray-100 animate-pulse rounded-sm"></div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-foreground-lighter">
        Chưa có dữ liệu
      </div>
    );
  }

  const values = data.map((d) => d[dataKey]);
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
              points={data
                .map((d, i) => {
                  const x = (i / (data.length - 1)) * 100;
                  const y = 100 - ((d[dataKey] - min) / range) * 100;
                  return `${x},${y}`;
                })
                .join(' ')}
            />
            {/* Points */}
            {data.map((d, i) => {
              const x = (i / (data.length - 1)) * 100;
              const y = 100 - ((d[dataKey] - min) / range) * 100;
              return <circle key={i} cx={`${x}%`} cy={`${y}%`} r="3" fill={color} />;
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
    topTutors,
    topTutorsLoading,
    growthTimeSeries,
    growthTimeSeriesLoading,
    revenueTimeSeries,
    revenueTimeSeriesLoading,
  } = useSelector((state) => state.adminStatistics);

  useEffect(() => {
    // Load overview statistics
    dispatch(getOverviewStatisticsAsync());

    // Load top tutors
    dispatch(getTopTutorsAsync(10));

    // Load time series data (default 30 days)
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - dateRange * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    dispatch(getGrowthTimeSeriesAsync({ startDate, endDate }));
    dispatch(getRevenueTimeSeriesAsync({ startDate, endDate }));
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
        <h1 className="text-2xl font-bold text-foreground mb-1">Dashboard Quản Trị</h1>
        <p className="text-sm text-foreground-light">Tổng quan hệ thống và quản lý</p>
      </div>

      {/* Overview Stats - Tutors */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Quản lý Gia Sư</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard
            icon={Users}
            label="Tổng gia sư"
            value={overview?.totalTutors || 0}
            iconColor="bg-info"
            loading={overviewLoading}
          />
          <StatCard
            icon={UserCheck}
            label="Đang hoạt động"
            value={overview?.activeTutors || 0}
            iconColor="bg-success"
            loading={overviewLoading}
          />
          <StatCard
            icon={UserX}
            label="Bị khóa"
            value={overview?.inactiveTutors || 0}
            iconColor="bg-error"
            loading={overviewLoading}
          />
        </div>
      </div>

      {/* Overview Stats - Students */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Quản lý Học Sinh</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard
            icon={Users}
            label="Tổng học sinh"
            value={overview?.totalStudents || 0}
            iconColor="bg-info"
            loading={overviewLoading}
          />
          <StatCard
            icon={UserCheck}
            label="Đang hoạt động"
            value={overview?.activeStudents || 0}
            iconColor="bg-success"
            loading={overviewLoading}
          />
          <StatCard
            icon={UserX}
            label="Bị khóa"
            value={overview?.inactiveStudents || 0}
            iconColor="bg-error"
            loading={overviewLoading}
          />
        </div>
      </div>

      {/* Overview Stats - Classrooms */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Quản lý Lớp Học</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard
            icon={BookOpen}
            label="Tổng lớp học"
            value={overview?.totalClassrooms || 0}
            iconColor="bg-info"
            loading={overviewLoading}
          />
          <StatCard
            icon={BookOpen}
            label="Đang hoạt động"
            value={overview?.activeClassrooms || 0}
            iconColor="bg-success"
            loading={overviewLoading}
          />
          <StatCard
            icon={BookOpen}
            label="Đã lưu trữ"
            value={overview?.archivedClassrooms || 0}
            iconColor="bg-gray-600"
            loading={overviewLoading}
          />
        </div>
      </div>

      {/* Revenue Stats */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Doanh Thu Hệ Thống</h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={DollarSign}
            label="Tổng doanh thu"
            value={formatCurrency(overview?.totalRevenue || 0)}
            iconColor="bg-warning"
            loading={overviewLoading}
          />
          <StatCard
            icon={TrendingUp}
            label="Tổng giao dịch"
            value={overview?.totalTransactions || 0}
            subValue={
              overview?.totalTransactions > 0
                ? `TB: ${formatCurrency(overview.totalRevenue / overview.totalTransactions)}`
                : ''
            }
            iconColor="bg-success"
            loading={overviewLoading}
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Growth Chart */}
        <div className="bg-primary border border-border rounded-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-foreground">Tăng Trưởng Hệ Thống</h3>
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
            data={growthTimeSeries}
            dataKeys={['newTutors', 'newStudents', 'newClassrooms']}
            labels={['Gia sư mới', 'Học sinh mới', 'Lớp học mới']}
            colors={['#3B82F6', '#10B981', '#F59E0B']}
            loading={growthTimeSeriesLoading}
          />
        </div>

        {/* Revenue Chart */}
        <div className="bg-primary border border-border rounded-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-foreground">Doanh Thu Hệ Thống</h3>
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
          <SimpleSingleLineChart
            data={revenueTimeSeries}
            dataKey="revenue"
            label="Doanh thu"
            color="#F59E0B"
            loading={revenueTimeSeriesLoading}
          />
        </div>
      </div>

      {/* Top Tutors Table */}
      <div className="bg-primary border border-border rounded-sm">
        <div className="p-4 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">Top Gia Sư Theo Doanh Thu</h3>
        </div>
        <div className="overflow-x-auto">
          {topTutorsLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-foreground border-r-transparent"></div>
            </div>
          ) : topTutors.length === 0 ? (
            <div className="p-8 text-center text-sm text-foreground-lighter">Chưa có dữ liệu</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Xếp hạng</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Gia sư</th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">Lớp học</th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">Học sinh</th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {topTutors.map((tutor, index) => (
                  <tr key={tutor.tutorId} className="border-b border-border hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {index === 0 ? (
                        <Award className="text-yellow-500" size={18} />
                      ) : index === 1 ? (
                        <Award className="text-gray-400" size={18} />
                      ) : index === 2 ? (
                        <Award className="text-amber-600" size={18} />
                      ) : (
                        <span className="text-foreground-lighter ml-1">#{index + 1}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-foreground font-medium">{tutor.tutorName}</div>
                        <div className="text-xs text-foreground-lighter flex items-center gap-1">
                          <Mail size={12} />
                          {tutor.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-foreground-light">
                      {tutor.classroomCount}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground-light">
                      {tutor.studentCount}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground font-medium">
                      {formatCurrency(tutor.totalRevenue)}
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
