import Link from "next/link";
import Image from "next/image";
import LogoUrl from "@/assets/logo/logo.svg";

interface LogoProps {
    href?: string | null;
    className?: string;
}

export const Logo = ({
    href,
    className = "",
}: LogoProps) => {
    const logoImage = (
        <Image
            src={LogoUrl}
            alt="Logo"
            priority
            className=""
        />
    );

    if (!href) {
        return (
            <div className={`inline-flex items-center ${className}`}>
                {logoImage}
            </div>
        );
    }

    return (
        <Link href={href} className={`inline-flex items-center ${className}`}>
            {logoImage}
        </Link>
    );
};
