import Image from "next/image";

interface AuthBrandProps {
  className?: string;
}

export function AuthBrand({ className }: AuthBrandProps) {
  return (
    <div
      className={`flex items-center justify-center gap-[11px] ${className ?? ""}`}
    >
      <Image
        src="/assets/auth/logo-icon.svg"
        alt=""
        width={30}
        height={30}
        className="size-[30px] shrink-0"
        aria-hidden="true"
        priority
        unoptimized
      />
      <p className="text-display-xs font-bold leading-[36px] text-[#fdfdfd]">
        Sociality
      </p>
    </div>
  );
}
