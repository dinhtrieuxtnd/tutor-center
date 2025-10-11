import imageSrc from "@/assets/banner/auth banner.png";
import Image from "next/image";

const AuthSectionLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-col lg:flex-row min-h-screen">
        {imageSrc && (
            <div className="relative bg-[#FDF8EE] hidden lg:flex justify-center items-center p-6 md:p-12 lg:p-20 xl:p-32 2xl:p-40 lg:w-3/5">
                <Image
                    src={imageSrc}
                    alt="Auth background"
                    priority
                    className="object-cover w-full h-full max-h-96 lg:max-h-full"
                />
            </div>
        )}
        <div className="flex flex-1 items-center justify-center bg-white py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 2xl:py-32">
            <div className="flex w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl justify-center items-center flex-col px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
                {children}
            </div>
        </div>
    </div>
)

export default AuthSectionLayout
