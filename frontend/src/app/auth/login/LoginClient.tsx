'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
    const router = useRouter()
    const { login, isLoading, isAuthenticated } = useAuth()
    const [show, setShow] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // state cho input
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validatePassword(password)) return;
        if (!validateUsername(username)) return;

        // const resultAction = await login({ username, password });

        // if (resultAction.meta.requestStatus === "fulfilled") {
        //     if (rememberMe) {
        //         localStorage.setItem(
        //             LOCAL_KEYS.REMEMBERME_ACCOUNT,
        //             JSON.stringify({
        //                 username,
        //                 rememberMe: true,
        //             })
        //         );
        //     } else {
        //         localStorage.removeItem(LOCAL_KEYS.REMEMBERME_ACCOUNT);
        //     }
        //     router.push("/");
        // }
        router.push("/");

    };

    // useEffect(() => {
    //   if (isAuthenticated) router.push("/");
    // }, [isAuthenticated])

    useEffect(() => {
        const saved = localStorage.getItem(LOCAL_KEYS.REMEMBERME_ACCOUNT);
        if (saved) {
            const parsed = JSON.parse(saved);
            setUsername(parsed.username || "");
            setRememberMe(parsed.rememberMe || false);
        }
    }, []);


    return (
        <div className='flex w-full justify-center items-center flex-col md:gap-6 gap-3'>
            <div className='flex w-full flex-col justify-center items-center 2xl:gap-15 md:gap-12 gap-6'>
                <div className='flex w-full justify-start items-center gap-6 flex-row'>
                    <Logo
                    />
                    <p className="text-primary text-3xl md:text-4xl font-bold font-open-sans">
                        Đăng Nhập
                    </p>
                </div>
            </div>
            <form
                className="space-y-3 md:space-y-6 w-full"
                onSubmit={handleSubmit}
            >
                <AuthInput
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    label="Tên đăng nhập"
                    type="text"
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
                <div className='flex flex-row justify-between items-center'>
                    <AuthCheckbox
                        label="Nhớ tài khoản"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <Link href={'/auth/email/reset-password'} className='hover:underline text-base font-normal font-open-sans text-primary' >
                        Quên mật khẩu
                    </Link>
                </div>
                <AuthButton
                    type='submit'
                    variant='primary'
                    isLoading={isLoading}
                >
                    <div className="text-white">
                        Đăng nhập
                    </div>
                </AuthButton>
                <AuthButton
                    variant='tertiary'
                    type='button'
                    onClick={() => {
                        // Redirect to Google OAuth endpoint
                        const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
                        window.location.href = `${backendUrl}/auth/google/student`;
                    }}
                >
                    <div className='flex flex-row gap-6'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                            <path d="M24.0001 12.5373C24.0001 11.7104 23.9201 10.8569 23.7867 10.0566H12.2368V14.778H18.852C18.5852 16.2984 17.705 17.6321 16.398 18.4856L20.3457 21.5532C22.6664 19.3926 24.0001 16.245 24.0001 12.5373Z" fill="#4280EF" />
                            <path d="M12.2367 24.4873C15.5442 24.4873 18.3184 23.3937 20.3456 21.5265L16.3978 18.4857C15.3042 19.2325 13.8905 19.6593 12.2367 19.6593C9.03577 19.6593 6.34169 17.4987 5.35475 14.6179L1.30029 17.7388C3.38087 21.8733 7.59537 24.4873 12.2367 24.4873Z" fill="#34A353" />
                            <path d="M5.35482 14.5912C4.84801 13.0708 4.84801 11.417 5.35482 9.89656L1.30036 6.74902C-0.433454 10.2167 -0.433454 14.2978 1.30036 17.7387L5.35482 14.5912Z" fill="#F6B704" />
                            <path d="M12.2367 4.85515C13.9705 4.82847 15.6776 5.49533 16.9313 6.69566L20.4256 3.17468C18.2117 1.0941 15.2775 -0.0262085 12.2367 0.00046554C7.59537 0.00046554 3.38087 2.61453 1.30029 6.74901L5.35475 9.89655C6.34169 6.98907 9.03577 4.85515 12.2367 4.85515Z" fill="#E54335" />
                        </svg>
                        <p className='text-black '>
                            Đăng nhập bằng Google
                        </p>
                    </div>
                </AuthButton>
                <div className="w-full flex justify-center items-center">
                    <p>
                        <span className="text-black text-base font-normal font-open-sans">Chưa có tài khoản? </span>
                        <Link href={'/auth/register'} className="hover:underline cursor-pointer text-primary text-base font-semibold font-open-sans">Đăng ký</Link>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default LoginClient;