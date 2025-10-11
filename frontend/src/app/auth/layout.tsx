import imageSrc from "@/assets/banner/auth banner.png";
import Image from "next/image";

const AuthSectionLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex max-h-screen">
        {imageSrc && (
            <div className="relative bg-[#FDF8EE] hidden lg:flex justify-center items-center p-40 w-3/5">
                <Image
                    src={imageSrc}
                    alt="Auth background"
                    priority
                    className="object-cover w-full h-full"
                />

            </div>
        )}
        <div className="flex flex-1 items-center  md:pt-[60px] xl:pt-[80px] 2xl:pt-[100px] justify-center bg-white">
            <div className="flex w-full justify-center items-center flex-col px-4 md:px-[60px] xl:px-[80px] 2xl:px-[102px] md:max-w-[702px]">
                {children}
            </div>
        </div>
    </div>
)

export default AuthSectionLayout
