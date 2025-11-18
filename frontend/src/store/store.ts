import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Import your slice reducers here
import counterReducer from './features/counter/counterSlice';
import notificationReducer from './features/notification/notificationSlice'
import authReducer from './features/auth/authSlice'
import classroomReducer from './features/classroom/classroomSlice'
import joinRequestReducer from './features/joinRequest/joinRequestSlice'

export const store = configureStore({
    reducer: {
        // Add your reducers here
        counter: counterReducer,
        notification: notificationReducer,
        auth: authReducer,
        classroom: classroomReducer,
        joinRequest: joinRequestReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
