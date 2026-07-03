import Image from "next/image";

interface LogoProps {
  className?: string;
  priority?: boolean;
  float?: boolean;
}

export default function Logo({
  className = "h-16 w-auto md:h-24",
  priority = false,
  float = true,
}: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="NOG Arena Logo"
      width={200}
      height={300}
      priority={priority}
      className={`object-contain drop-shadow-[0_10px_18px_rgba(10,10,10,0.25)] ${
        float ? "animate-logo-float" : ""
      } ${className}`}
    />
  );
}
