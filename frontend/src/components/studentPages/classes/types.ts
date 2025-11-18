import { ClassroomResponse } from '@/services/classroomApi';

export type ClassStatus = 'all' | 'active' | 'pending' | 'completed';
export type ViewMode = 'grid' | 'list';

// Map ClassroomResponse to ClassItem for UI compatibility
export type ClassItem = ClassroomResponse;

export interface ClassStats {
  total: number;
  active: number;
  pending: number;
  completed: number;
}
