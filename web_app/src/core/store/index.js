import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../features/users/store/userSlice';
import authReducer from '../../features/auth/store/authSlice';
import notificationReducer from '../../features/notification/store/notificationSlice';
import profileReducer from '../../features/profile/store/profileSlice';
import mediaReducer from '../../features/media/store/mediaSlice';
import roleReducer from '../../features/role/store/roleSlice';
import permissionReducer from '../../features/permission/store/permissionSlice';
import classroomReducer from '../../features/classroom/store/classroomSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    notification: notificationReducer,
    profile: profileReducer,
    media: mediaReducer,
    role: roleReducer,
    permission: permissionReducer,
    classroom: classroomReducer,
  },
});
