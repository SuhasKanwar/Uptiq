import Image from "next/image";

type LogoSize = "sm" | "md" | "lg";
type LogoVariant = "icon" | "lockup";

type LogoProps = {
    size?: LogoSize;
    variant?: LogoVariant;
    className?: string;
    imageClassName?: string;
    textClassName?: string;
    priority?: boolean;
};

const sizeMap: Record<LogoSize, { box: string; pixels: number; text: string }> = {
    sm: { box: "h-7 w-7", pixels: 28, text: "text-base font-bold" },
    md: { box: "h-8 w-8", pixels: 32, text: "text-lg font-bold" },
    lg: { box: "h-9 w-9", pixels: 36, text: "text-[1.4rem] font-bold tracking-[-0.02em]" },
};

export default function Logo({
    size = "md",
    variant = "lockup",
    className = "",
    imageClassName = "",
    textClassName = "",
    priority = false,
}: LogoProps) {
    const sizing = sizeMap[size];
    const image = (
        <span className={`inline-flex ${sizing.box} items-center justify-center ${className}`}>
            <Image
                src="/logo.png"
                alt="Uptiq logo"
                width={sizing.pixels}
                height={sizing.pixels}
                className={`rounded-[10px] ${imageClassName}`}
                priority={priority}
            />
        </span>
    );

    if (variant === "icon") {
        return image;
    }

    return (
        <span className={`inline-flex items-center gap-2.5 ${className}`}>
            {image}
            <span className={`${sizing.text} text-(--white-color) ${textClassName}`}>Uptiq</span>
        </span>
    );
}