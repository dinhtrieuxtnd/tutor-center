// Export all from notification and counter (no conflicts)
export * from './notification/notificationSlice'
export * from './counter/counterSlice'
export * from './auth/authSlice'
// For slices with conflicting names, import them in components directly from their slice files
// Example: import { clearError } from '@/store/features/auth/authSlice'
// Or use the hook: const { clearError } = useAuth()

// Re-export reducers only for store configuration
export { default as classroomReducer } from './classroom/classroomSlice'
export { default as joinRequestReducer } from './joinRequest/joinRequestSlice'
export { default as lectureReducer } from './lecture/lectureSlice'
export { default as lessonReducer } from './lesson/lessonSlice'
export { default as mediaReducer } from './media/mediaSlice'