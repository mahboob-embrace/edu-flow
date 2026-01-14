"use client";

import { usePathname } from "next/navigation";
import { Illustration } from "@/components/auth/Illustration";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const mode = pathname === "/sign-up" ? "SIGNUP" : "LOGIN";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#DDE2F5] p-4">
      {/* SVG ClipPath for the wavy divider */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <clipPath id="wavyPath" clipPathUnits="objectBoundingBox">
            <path d="M1,0 L1,1 L0.15,1 C0.15,1,0.25,0.85,0.1,0.75 C-0.05,0.65,0.25,0.5,0.1,0.4 C-0.05,0.3,0.25,0.15,0.1,0 L1,0" />
          </clipPath>
        </defs>
      </svg>

      <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row min-h-[600px]">
        {/* Left Pane - Forms */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          {children}
        </div>

        {/* Right Pane - Illustration & Navy Background */}
        <div className="hidden md:flex w-1/2 bg-[#050A30] relative overflow-hidden items-center justify-center wavy-edge">
          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-24 h-24 bg-[#FFD15B] opacity-20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-[#FFD15B] opacity-10 rounded-full blur-3xl"></div>

          <div className="relative z-10 w-4/5">
            <Illustration mode={mode} />
          </div>
        </div>
      </div>
    </div>
  );
}
