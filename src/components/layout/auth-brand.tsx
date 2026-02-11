import Image from "next/image";

interface AuthBrandProps {
  className?: string;
}

export function AuthBrand({ className }: AuthBrandProps) {
  return (
    <div className={`flex items-center justify-center gap-[11px] ${className ?? ""}`}>
      <Image
        src="/assets/auth/logo-icon.svg"
        alt=""
        width={30}
        height={30}
        className="size-[30px]"
        aria-hidden="true"
        priority
      />
      <p className="text-display-xs font-bold text-neutral-25">Sociality</p>
    </div>
  );
}
