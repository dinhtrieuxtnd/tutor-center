import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit'
import {
    addSuccessNotification,
    addErrorNotification
} from '../store/features'

/**
 * Utility function để lọc bỏ các field có giá trị empty/null/undefined
 */
export const filterEmptyFields = <T extends Record<string, any>>(data: T): Partial<T> => {
    if (!data || typeof data !== 'object') {
        return data
    }

    const filtered: Partial<T> = {}

    Object.keys(data).forEach((key) => {
        const value = data[key]

        if (
            value !== null &&
            value !== undefined &&
            value !== '' &&
            !(Array.isArray(value) && value.length === 0) &&
            !(typeof value === 'object' && Object.keys(value).length === 0)
        ) {
            if (typeof value === 'object' && !Array.isArray(value)) {
                const nestedFiltered = filterEmptyFields(value)
                if (Object.keys(nestedFiltered).length > 0) {
                    filtered[key as keyof T] = nestedFiltered as T[keyof T]
                }
            } else {
                filtered[key as keyof T] = value
            }
        }
    })

    return filtered
}

/**
 * Wrapper function để xử lý try-catch cho async thunks
 */
export const createAsyncThunkHandler = <T, P = void>(
    asyncFunction: (arg: P) => Promise<T>,
    defaultErrorMessage = 'Operation failed',
    shouldFilterEmptyFields = true
): AsyncThunkPayloadCreator<T, P> => {
    return async (arg: P, { rejectWithValue, dispatch }) => {
        try {
            const filteredArg =
                shouldFilterEmptyFields &&
                    arg &&
                    typeof arg === 'object' &&
                    !Array.isArray(arg)
                    ? (filterEmptyFields(arg as Record<string, any>) as P)
                    : arg

            const response: any = await asyncFunction(filteredArg)

            // Nếu API trả về có success = true thì show success notification
            if (response?.success) {
                dispatch(
                    addSuccessNotification({
                        message: response.message || 'Operation completed successfully'
                    })
                )
                return response.data ?? response
            }

            // Nếu API trả về success = false
            const errorMessage = response?.message || defaultErrorMessage
            dispatch(addErrorNotification({ message: errorMessage }))
            return rejectWithValue(errorMessage)
        } catch (error: any) {
            let errorMessage = defaultErrorMessage
            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message
            } else if (error?.message) {
                errorMessage = error.message
            } else if (typeof error === 'string') {
                errorMessage = error
            }

            dispatch(addErrorNotification({ message: errorMessage }))
            return rejectWithValue(errorMessage)
        }
    }
}

export interface AuthThunkOptions<T> {
    showSuccessNotification?: boolean
    showErrorNotification?: boolean
    successMessage?: string
    successTitle?: string
    onSuccess?: (response: any) => T
    onError?: () => void
    shouldFilterEmptyFields?: boolean
}

/**
 * Wrapper đặc biệt cho auth operations với localStorage handling và tự động hiển thị thông báo
 */
export const createAuthThunkHandler = <T, P = void>(
    asyncFunction: (arg: P) => Promise<any>,
    defaultErrorMessage = 'Authentication failed',
    options: AuthThunkOptions<T> = {}
): AsyncThunkPayloadCreator<T, P> => {
    const {
        showSuccessNotification = true,
        showErrorNotification = true,
        successMessage = 'Operation completed successfully',
        successTitle,
        onSuccess,
        onError,
        shouldFilterEmptyFields = true,
    } = options

    return async (arg: P, { rejectWithValue, dispatch }) => {
        try {
            const filteredArg =
                shouldFilterEmptyFields &&
                    arg &&
                    typeof arg === 'object' &&
                    !Array.isArray(arg)
                    ? (filterEmptyFields(arg as Record<string, any>) as P)
                    : arg

            const response = await asyncFunction(filteredArg)

            if (response.success) {
                if (showSuccessNotification) {
                    dispatch(
                        addSuccessNotification({
                            message: response.message || successMessage,
                            title: successTitle,
                        })
                    )
                }

                return onSuccess ? onSuccess(response) : response.data
            } else {
                const errorMessage = response.message || defaultErrorMessage

                if (showErrorNotification) {
                    dispatch(addErrorNotification({ message: errorMessage }))
                }

                return rejectWithValue(errorMessage)
            }
        } catch (error: any) {
            onError?.()

            let errorMessage = defaultErrorMessage
            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message
            } else if (error?.message) {
                errorMessage = error.message
            }

            if (showErrorNotification) {
                dispatch(addErrorNotification({ message: errorMessage }))
            }

            return rejectWithValue(errorMessage)
        }
    }
}
