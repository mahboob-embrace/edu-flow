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
    <div
      className="min-h-screen w-full flex overflow-hidden relative"
      style={{ backgroundColor: "#FBFBFF" }}
    >
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 lg:px-24 py-12 z-10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-left space-y-2">
            <h1
              className="text-4xl font-bold tracking-tight"
              style={{ color: "#030047", fontFamily: "'Roboto', sans-serif" }}
            >
              {title}
            </h1>
            <p
              className="text-gray-500"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {subtitle}
            </p>
          </div>

          {children}
        </div>
      </div>

      {/* Right Side - Illustration with Navy Blue Background */}
      <div
        className="hidden lg:flex w-1/2 relative justify-center items-center"
        style={{ backgroundColor: "#030047" }}
      >
        {/* Wave Shape - SVG overlay for curved edge */}
        <svg
          className="absolute top-0 left-0 h-full w-32"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ transform: "translateX(-50%)" }}
        >
          <path
            d="M100 0 C 60 20 80 40 50 50 C 20 60 60 80 100 100 L 100 0 Z"
            fill="#FBFBFF"
          />
        </svg>

        {/* Content */}
        <div className="z-30 relative w-full h-full flex flex-col justify-center items-center p-12 text-white">
          <div className="w-full max-w-md flex flex-col items-center justify-center">
            {illustration}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-8 right-8 opacity-20">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="30" r="4" fill="#FFCC3E" />
            <circle cx="50" cy="10" r="2" fill="#FFCC3E" />
            <circle cx="10" cy="50" r="3" fill="#FFCC3E" />
          </svg>
        </div>
        <div className="absolute bottom-8 left-32 opacity-30">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
              d="M10 30 Q20 10 30 30"
              stroke="#FFCC3E"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
