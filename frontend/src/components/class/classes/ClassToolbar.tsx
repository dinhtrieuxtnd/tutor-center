'use client';

import { Search, Grid3x3, List, Plus, Filter } from 'lucide-react';

type ClassStatus = 'all' | 'active' | 'pending' | 'completed';
type ViewMode = 'grid' | 'list';

interface ClassToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: ClassStatus;
  onStatusFilterChange: (status: ClassStatus) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onJoinClass: () => void;
}

export function ClassToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  onJoinClass
}: ClassToolbarProps) {
  const statusOptions = [
    { value: 'all' as ClassStatus, label: 'Tất cả' },
    { value: 'active' as ClassStatus, label: 'Đang học' },
    { value: 'pending' as ClassStatus, label: 'Chờ duyệt' },
    { value: 'completed' as ClassStatus, label: 'Hoàn thành' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm lớp học..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-open-sans"
            />
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
            {statusOptions.map((status) => (
              <button
                key={status.value}
                onClick={() => onStatusFilterChange(status.value)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors font-open-sans ${
                  statusFilter === status.value
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Join Class Button */}
          <button
            onClick={onJoinClass}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-open-sans"
          >
            <Plus className="w-5 h-5" />
            Tìm lớp học
          </button>
        </div>
      </div>
    </div>
  );
}
