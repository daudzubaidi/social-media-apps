import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-0 py-10 md:px-4">
      <div className="pointer-events-none absolute inset-0 bg-black" />

      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="absolute left-1/2 top-1/2 h-[1080px] w-[1920px] -translate-x-[58.54%] -translate-y-[33.52%] overflow-hidden rounded-[120px] border-2 border-black/60 bg-black shadow-[0px_32px_40px_-12px_rgba(0,0,0,0.25)]">
          <div className="absolute bottom-[-947.03px] left-[-265.96px] right-[-666.29px] h-[2460.526px]">
            <Image
              src="/assets/auth/bg-layer-a.svg"
              alt=""
              fill
              sizes="1920px"
              className="object-fill"
              aria-hidden="true"
              priority
            />
          </div>
          <div className="absolute bottom-[-1419.89px] left-[-446.6px] right-[-690.01px] flex h-[3050.567px] items-center justify-center">
            <div className="relative h-[2285.58px] w-[2030.089px] rotate-[45.32deg]">
              <Image
                src="/assets/auth/bg-layer-b.svg"
                alt=""
                fill
                sizes="2030px"
                className="object-fill"
                aria-hidden="true"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 md:hidden">
        <div className="absolute inset-x-0 bottom-0 h-[233.188px] overflow-hidden border-[0.432px] border-black/60 bg-black shadow-[0px_6.909px_8.637px_-2.591px_rgba(0,0,0,0.25)]">
          <div className="absolute bottom-[-242.81px] left-[-87.32px] right-[-113.97px] h-[531.263px]">
            <Image
              src="/assets/auth/bg-mobile-layer-a.svg"
              alt=""
              fill
              sizes="414px"
              className="object-fill"
              aria-hidden="true"
              priority
            />
          </div>
          <div className="absolute bottom-[-306.58px] left-[-96.43px] right-[-148.98px] flex h-[658.661px] items-center justify-center">
            <div className="relative h-[493.49px] w-[438.325px] rotate-[45.32deg]">
              <Image
                src="/assets/auth/bg-mobile-layer-b.svg"
                alt=""
                fill
                sizes="438px"
                className="object-fill"
                aria-hidden="true"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[345px] md:max-w-[446px]">
        <div className="rounded-2xl border border-neutral-900 bg-black/20 px-4 py-8 backdrop-blur-[50px] md:px-6 md:py-10 md:backdrop-blur-[20px]">
          {children}
        </div>
      </div>
    </div>
  );
}
