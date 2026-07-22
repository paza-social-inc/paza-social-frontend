import Image, { ImageProps } from "next/image";
import Link from "next/link";
import Footer from "../Home/Footer";
import { AuthRehydrate } from "@/components/Auth/AuthRehydrate";

interface AuthlayoutProps {
    children: React.ReactNode;
    title: string;
    authImage: ImageProps["src"];
    imageSide?: "left" | "right" | "none";
}

export default function Authlayout({
    children,
    title,
    authImage,
    imageSide = "right",
}: AuthlayoutProps) {
    const isLeft = imageSide === "left";
    const isNone = imageSide === "none";

    return (
        <>
            <AuthRehydrate />
            <div
                className={`grid min-h-svh ${isNone ? "grid-cols-1" : "lg:grid-cols-2"
                    }`}
            >
                {!isNone && isLeft && (
                    <div className="bg-muted relative hidden lg:block">
                        <Image
                            width={500}
                            height={500}
                            src={authImage}
                            alt={title}
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.7]"
                        />
                    </div>
                )}

                <div className="flex flex-col gap-4 p-6 md:p-10 relative">
                    <div className="absolute top-6 left-6 md:top-10 md:left-10 z-20">
                        <Link
                            href="/"
                            className="text-2xl font-extrabold tracking-tight hover:text-primary transition-colors"
                        >
                            PAZA
                        </Link>
                    </div>
                    <div className="flex flex-1 items-center justify-center">
                        <div className={`w-full ${isNone ? "max-w-2xl" : "max-w-md"}`}>{children}</div>
                    </div>
                </div>

                {!isNone && !isLeft && (
                    <div className="bg-muted relative hidden lg:block">
                        <Image
                            width={500}
                            height={500}
                            src={authImage}
                            alt={title}
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.7]"
                        />
                    </div>
                )}

            </div>

            <Footer showMain={false} />
        </>
    );
}
