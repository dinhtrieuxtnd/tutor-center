import Link from "next/link";
import Image from "next/image";
import LogoUrl from "@/assets/logo/logobee12.png";

interface LogoProps {
    href?: string | null;
    className?: string;
}

export const Logo1 = ({
    href,
    className = "",
}: LogoProps) => {
    const logoImage = (
        <Image
            src={LogoUrl}
            alt="Logo"
            priority
            className="h-[76px] w-auto"
        />
    );

    if (!href) {
        return (
            <div className={`inline-flex h-full items-center ${className}`}>
                {logoImage}
            </div>
        );
    }

    return (
        <Link href={href} className={`inline-flex h-full items-center ${className}`}>
            {logoImage}
        </Link>
    );
};
