import Image from "next/image";
import Link from "next/link";
import { BrandIcon, BrandLogo } from "@/components/shared/brand/BrandLogo";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-(--riso-paper)">
      <div className="grid min-h-screen lg:grid-cols-2">
        <main className="flex min-h-screen flex-col bg-(--riso-paper) px-6 py-8 sm:px-10 lg:px-12">
          <Link
            href="/"
            className="focus-visible:ring-brand-primary inline-flex w-fit items-center rounded-md focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
            aria-label="IndexFlow home"
          >
            <BrandLogo
              tone="light"
              width={154}
              height={30}
              priority
              className="h-5 w-auto md:h-6"
            />
          </Link>

          <div className="flex flex-1 items-center justify-center py-10">
            <div className="w-auto p-5 sm:p-6">{children}</div>
          </div>
        </main>

        <section className="template-noise relative hidden min-h-screen overflow-hidden bg-(--brand-eggplant) lg:block">
          <Image
            src="/indexflow-auth-hero2.webp"
            alt="IndexFlow auth hero image"
            fill
            priority
            sizes="50vw"
            className="object-cover select-none [-webkit-user-drag:none] [user-drag:none]"
          />
          <div className="pointer-events-none absolute inset-0 ring-2 ring-black/12 ring-inset" />
          <div className="absolute right-8 bottom-8 flex items-center justify-center gap-1 rounded-lg border-2 border-white bg-white/86 px-4 py-4 text-sm font-black text-(--brand-eggplant) uppercase shadow-brand-neon-xl">
            <div>Build every click into momentum</div>
            <BrandIcon
              tone="light"
              width={20}
              height={20}
              className="size-6"
              priority
            />
          </div>
        </section>
      </div>
    </div>
  );
}
