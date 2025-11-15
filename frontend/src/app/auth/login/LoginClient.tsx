'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
    useAuth
} from '@/hooks'
import {
    Logo,
    AuthInput,
    AuthCheckbox,
    AuthButton
} from '@/components'
import {
    Eye,
    EyeOff
} from "lucide-react"; // icon lib
import {
    validatePassword,
    validateUsername
} from '@/utils/validate'
import { LOCAL_KEYS } from '@/constants'

export const LoginClient = () => {
    const { login, isLoading } = useAuth()
    const [show, setShow] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // state cho input
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validatePassword(password)) return;
        if (!validateUsername(username)) return;

        const resultAction = await login({ 
            email: username, // Backend expects email field
            password 
        });

        if (resultAction.meta.requestStatus === "fulfilled") {
            if (rememberMe) {
                localStorage.setItem(
                    LOCAL_KEYS.REMEMBERME_ACCOUNT,
                    JSON.stringify({
                        username,
                        rememberMe: true,
                    })
                );
            } else {
                localStorage.removeItem(LOCAL_KEYS.REMEMBERME_ACCOUNT);
            }
            
            // Get user role from the login response
            const user = (resultAction.payload as any)?.user;
            const userRole = user?.role || 'student';
            
            // Force a small delay to ensure cookies are set by authSlice
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Redirect based on user role using window.location for hard navigation
            if (userRole === "admin") {
                window.location.href = "/admin/dashboard";
            } else if (userRole === "tutor") {
                window.location.href = "/tutor/dashboard";
            } else {
                window.location.href = "/student/dashboard";
            }
        }

    };

    // useEffect(() => {
    //   if (isAuthenticated) router.push("/");
    // }, [isAuthenticated, router])

    useEffect(() => {
        const saved = localStorage.getItem(LOCAL_KEYS.REMEMBERME_ACCOUNT);
        if (saved) {
            const parsed = JSON.parse(saved);
            setUsername(parsed.username || "");
            setRememberMe(parsed.rememberMe || false);
        }
    }, []);


    return (
        <div className='flex w-full justify-center items-center flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-10'>
            <div className='flex w-full flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-15'>
                <div className='flex w-full justify-center sm:justify-start items-center gap-3 sm:gap-4 md:gap-6 flex-col sm:flex-row'>
                    <Logo />
                    <p className="text-primary text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-open-sans text-center sm:text-left">
                        Đăng Nhập
                    </p>
                </div>
            </div>
            <form
                className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 w-full"
                onSubmit={handleSubmit}
            >
                <AuthInput
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    label="Email"
                    type="email"
                    required
                />

                <AuthInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    label="Mật khẩu"
                    type={show ? "text" : "password"}
                    required={true}
                    rightIcon={
                        <button type="button" className='cursor-pointer' onClick={() => setShow(!show)}>
                            {show ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    }
                />
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0'>
                    <AuthCheckbox
                        label="Nhớ tài khoản"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <Link href={'/auth/email/reset-password'} className='hover:underline text-base sm:text-lg font-normal font-open-sans text-primary' >
                        Quên mật khẩu
                    </Link>
                </div>
                <AuthButton
                    type='submit'
                    variant='primary'
                    isLoading={isLoading}
                >
                    <div className="text-white text-sm sm:text-base md:text-lg">
                        Đăng nhập
                    </div>
                </AuthButton>
                <AuthButton
                    variant='tertiary'
                    type='button'
                    onClick={() => {
                        // Redirect to Google OAuth endpoint
                        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5293/api';
                        window.location.href = `${backendUrl}/auth/google/student`;
                    }}
                >
                    <div className='flex flex-row gap-3 sm:gap-4 md:gap-6 items-center justify-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 24 25" fill="none" className="sm:w-6 sm:h-6">
                            <path d="M24.0001 12.5373C24.0001 11.7104 23.9201 10.8569 23.7867 10.0566H12.2368V14.778H18.852C18.5852 16.2984 17.705 17.6321 16.398 18.4856L20.3457 21.5532C22.6664 19.3926 24.0001 16.245 24.0001 12.5373Z" fill="#4280EF" />
                            <path d="M12.2367 24.4873C15.5442 24.4873 18.3184 23.3937 20.3456 21.5265L16.3978 18.4857C15.3042 19.2325 13.8905 19.6593 12.2367 19.6593C9.03577 19.6593 6.34169 17.4987 5.35475 14.6179L1.30029 17.7388C3.38087 21.8733 7.59537 24.4873 12.2367 24.4873Z" fill="#34A353" />
                            <path d="M5.35482 14.5912C4.84801 13.0708 4.84801 11.417 5.35482 9.89656L1.30036 6.74902C-0.433454 10.2167 -0.433454 14.2978 1.30036 17.7387L5.35482 14.5912Z" fill="#F6B704" />
                            <path d="M12.2367 4.85515C13.9705 4.82847 15.6776 5.49533 16.9313 6.69566L20.4256 3.17468C18.2117 1.0941 15.2775 -0.0262085 12.2367 0.00046554C7.59537 0.00046554 3.38087 2.61453 1.30029 6.74901L5.35475 9.89655C6.34169 6.98907 9.03577 4.85515 12.2367 4.85515Z" fill="#E54335" />
                        </svg>
                        <p className='text-black text-sm sm:text-base md:text-lg font-medium'>
                            Đăng nhập bằng Google
                        </p>
                    </div>
                </AuthButton>
                <div className="w-full flex justify-center items-center">
                    <p className="text-center">
                        <span className="text-black text-sm sm:text-base md:text-lg font-normal font-open-sans">Chưa có tài khoản? </span>
                        <Link href={'/auth/register'} className="hover:underline cursor-pointer text-primary text-sm sm:text-base md:text-lg font-semibold font-open-sans">Đăng ký</Link>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default LoginClient;