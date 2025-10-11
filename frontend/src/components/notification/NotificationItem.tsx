"use client"

import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import { Notification } from '@/types'
import { removeNotification } from '@/store/features'

interface NotificationItemProps {
    notification: Notification
    index: number
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, index }) => {
    const dispatch = useDispatch()
    const [isVisible, setIsVisible] = useState(false)
    const [isRemoving, setIsRemoving] = useState(false)
    const duration = notification.duration || 4000

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 50 + index * 100)

        if (notification.autoHide) {
            const removeTimer = setTimeout(() => {
                handleRemove()
            }, duration)

            return () => {
                clearTimeout(timer)
                clearTimeout(removeTimer)
            }
        }

        return () => clearTimeout(timer)
    }, [notification.autoHide, duration, index])

    const handleRemove = () => {
        setIsRemoving(true)
        setTimeout(() => {
            dispatch(removeNotification(notification.id))
        }, 300) // Match animation duration
    }

    const getIcon = () => {
        switch (notification.type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-600" />
            case 'error':
                return <XCircle className="h-5 w-5 text-red-600" />
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-yellow-600" />
            case 'info':
            default:
                return <Info className="h-5 w-5 text-blue-600" />
        }
    }

    const getColorClasses = () => {
        switch (notification.type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800'
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800'
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800'
            case 'info':
            default:
                return 'bg-blue-50 border-blue-200 text-blue-800'
        }
    }

    return (
        <div
            className={`transform transition-all duration-300 ease-in-out mb-3 ${isVisible && !isRemoving
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-full opacity-0'
                }`}
            style={{
                transitionDelay: isRemoving ? '0ms' : `${index * 50}ms`,
            }}
        >
            <div
                className={`w-[20rem] bg-white shadow-lg rounded-lg border pointer-events-auto ${getColorClasses()}`}
            >
                <div className="p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">{getIcon()}</div>
                        <div className="ml-3 w-0 flex-1">
                            {notification.title && (
                                <p className="text-sm font-medium">{notification.title}</p>
                            )}
                            <p
                                className={`text-sm ${notification.title ? 'mt-1' : ''}`}
                            >
                                {notification.message.length > 100
                                    ? notification.message.slice(0, 100) + '...'
                                    : notification.message}
                            </p>
                        </div>

                        {/* Nút X với vòng tròn tiến trình */}
                        <div className="ml-4 flex-shrink-0 flex relative">
                            <button
                                className="cursor-pointer relative inline-flex items-center justify-center h-6 w-6 text-gray-400 hover:text-gray-600 focus:outline-none"
                                onClick={handleRemove}
                            >
                                <X className="h-4 w-4 relative z-10" />

                                {/* vòng tròn SVG chạy xung quanh */}
                                {notification.autoHide && (
                                    <svg
                                        className="absolute inset-0 h-6 w-6"
                                        viewBox="0 0 36 36"
                                    >
                                        <circle
                                            className="text-gray-200"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            fill="transparent"
                                            r="16"
                                            cx="18"
                                            cy="18"
                                        />
                                        <circle
                                            className="text-gray-500"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            fill="transparent"
                                            r="16"
                                            cx="18"
                                            cy="18"
                                            strokeDasharray={100}
                                            strokeDashoffset={0}
                                            style={{
                                                animation: `countdown ${duration}ms linear forwards`,
                                            }}
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS animation countdown */}
            <style jsx>{`
        @keyframes countdown {
          from {
            stroke-dasharray: 100;
            stroke-dashoffset: 0;
          }
          to {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
          }
        }
      `}</style>
        </div>
    )
}

export default NotificationItem
