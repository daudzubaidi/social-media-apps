import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/config/routes";

interface AuthBrandProps {
  className?: string;
}

export function AuthBrand({ className }: AuthBrandProps) {
  return (
    <Link
      href={ROUTES.HOME}
      className={`flex items-center justify-center gap-[11px] ${className ?? ""}`}
      aria-label="Go to homepage"
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
    </Link>
  );
}
