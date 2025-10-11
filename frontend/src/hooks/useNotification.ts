"use client";

import { useDispatch } from "react-redux";
import {
    addNotification,
    removeNotification,
    clearAllNotifications,
    addSuccessNotification,
    addErrorNotification,
    addWarningNotification,
    addInfoNotification,
} from "@/store/features/notification/notificationSlice"; // chỉnh lại path cho đúng
import { Notification } from "@/types"; // chỗ bạn định nghĩa interface Notification

export const useNotification = () => {
    const dispatch = useDispatch();

    return {
        // thêm notification tùy chỉnh
        notify: (payload: Omit<Notification, "id">) => {
            dispatch(addNotification(payload));
        },

        // helper ngắn gọn
        success: (message: string, title?: string, duration?: number) => {
            dispatch(addSuccessNotification({ message, title, duration }));
        },

        error: (message: string, title?: string, duration?: number) => {
            dispatch(addErrorNotification({ message, title, duration }));
        },

        warning: (message: string, title?: string, duration?: number) => {
            dispatch(addWarningNotification({ message, title, duration }));
        },

        info: (message: string, title?: string, duration?: number) => {
            dispatch(addInfoNotification({ message, title, duration }));
        },

        // remove theo id
        remove: (id: string) => {
            dispatch(removeNotification(id));
        },

        // clear hết
        clearAll: () => {
            dispatch(clearAllNotifications());
        },
    };
};
