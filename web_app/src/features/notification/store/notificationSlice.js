import { createSlice } from '@reduxjs/toolkit';

let notificationId = 0;

const initialState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const notification = {
        id: ++notificationId,
        type: action.payload.type || 'info', // success, error, warning, info
        title: action.payload.title || '',
        message: action.payload.message,
        autoHide: action.payload.autoHide !== undefined ? action.payload.autoHide : true,
        duration: action.payload.duration || 4000,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { addNotification, removeNotification, clearAllNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
