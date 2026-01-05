import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { getProfileAsync } from '../../profile/store/profileSlice';
import { ROUTES } from '../../../core/constants';
import { PageLoading } from '../../../shared/components/loading';

export const LoadingRedirect = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { profile, loading } = useAppSelector((state) => state.profile);
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate(ROUTES.LOGIN);
            return;
        }

        // Load profile
        dispatch(getProfileAsync()).unwrap().catch((error) => {
            console.error('Failed to load profile:', error);
            navigate(ROUTES.LOGIN);
        });
    }, [isAuthenticated]);

    useEffect(() => {
        if (profile && !loading) {
            // Get the previous page from location state
            const from = location.state?.from?.pathname;
            console.log('Previous page:', from);
            // Define role-based path prefixes
            const rolePathMap = {
                1: '/admin',  // Admin role
                2: '/tutor',  // Tutor role
            };

            const rolePath = rolePathMap[profile.roleId];

            // Check if the previous page exists and starts with the correct role path
            if (from && rolePath && from.startsWith(rolePath)) {
                // Redirect to previous page if it matches the role
                navigate(from, { replace: true });
            } else {
                // Redirect to default dashboard based on role
                if (profile.roleId === 1) {
                    navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
                } else if (profile.roleId === 2) {
                    navigate(ROUTES.TUTOR_DASHBOARD, { replace: true });
                } else {
                    // Default fallback
                    navigate(ROUTES.HOME, { replace: true });
                }
            }
        }
    }, [profile, loading, location]);

    return <PageLoading message="Đang tải thông tin..." />;
};
