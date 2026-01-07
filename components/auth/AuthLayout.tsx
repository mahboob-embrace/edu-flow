import Link from "next/link";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
  illustration: React.ReactNode;
  title: string;
  subtitle: string;
  isSignUp?: boolean;
}

export function AuthLayout({
  children,
  illustration,
  title,
  subtitle,
  isSignUp,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex bg-background overflow-hidden relative">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 lg:px-24 z-10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-left space-y-2">
            <h1 className="text-4xl font-bold text-primary font-heading tracking-tight">
              {title}
            </h1>
            <p className="text-gray-500 font-body">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>

      {/* Right Side - Illustration & Wave */}
      <div className="hidden lg:flex w-1/2 bg-primary relative justify-center items-center">
        {/* Wave Shape */}
        <div
          className="absolute top-0 bottom-0 -left-1 w-24 h-full bg-background z-20"
          style={{
            clipPath:
              "path('M 0 0 C 40 100 0 300 80 500 C 130 650 60 800 100 1000 L 0 1000 Z')",
            transform: "scaleX(-1)", // Mirror to face right
            left: "-1px",
          }}
        />

        {/* An alternative simpler wave using SVG if clip-path is tricky to get perfect */}
        <div className="absolute top-0 bottom-0 left-0 w-full h-full z-10">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute top-0 bottom-0 -left-16 h-full w-48 text-background fill-current"
            style={{ transform: "scaleX(-1)" }}
          >
            <path d="M0 0 C 50 20 20 60 50 100 L 0 100 L 0 0 Z" />
          </svg>
        </div>

        {/* Content */}
        <div className="z-30 relative w-full h-full flex flex-col justify-center items-center p-12 text-white">
          <div className="w-full max-w-lg aspect-square relative flex items-center justify-center">
            {illustration}
          </div>
        </div>
      </div>
    </div>
  );
}
