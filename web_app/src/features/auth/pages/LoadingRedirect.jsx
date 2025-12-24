import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { getProfileAsync } from '../../profile/store/profileSlice';
import { ROUTES } from '../../../core/constants';
import { PageLoading } from '../../../shared/components/loading';

export const LoadingRedirect = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { profile, loading } = useAppSelector((state) => state.profile);
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate(ROUTES.LOGIN);
            return;
        }

        // Load profile
        dispatch(getProfileAsync());
    }, [isAuthenticated]);

    useEffect(() => {
        if (profile && !loading) {
            // Redirect based on roleId
            if (profile.roleId === 1) {
                navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
            } else if (profile.roleId === 2) {
                navigate(ROUTES.TUTOR_DASHBOARD, { replace: true });
            } else {
                // Default fallback
                navigate(ROUTES.HOME, { replace: true });
            }
        }
    }, [profile, loading]);

    return <PageLoading message="Đang tải thông tin..." />;
};
