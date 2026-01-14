import React from "react";

interface IllustrationProps {
  mode: "LOGIN" | "SIGNUP";
}

export const Illustration: React.FC<IllustrationProps> = ({ mode }) => {
  return (
    <div className="relative w-full aspect-square flex items-center justify-center">
      {/* Background Yellow Circle */}
      <div className="absolute w-[80%] h-[80%] bg-[#FFD15B] rounded-full animate-pulse-slow"></div>

      {/* Main Illustration Wrapper */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-8 transition-all duration-700 ease-in-out">
        {mode === "LOGIN" ? (
          <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
            {/* Table */}
            <rect
              x="50"
              y="280"
              width="300"
              height="10"
              rx="5"
              fill="#E2E8F5"
            />
            {/* Person at Computer */}
            <circle
              cx="200"
              cy="150"
              r="40"
              fill="#FFE0B2"
              stroke="#050A30"
              strokeWidth="2"
            />{" "}
            {/* Head */}
            <path
              d="M160 280 L240 280 L240 200 Q200 170 160 200 Z"
              fill="#FFD15B"
              stroke="#050A30"
              strokeWidth="2"
            />{" "}
            {/* Body */}
            {/* Laptop */}
            <path d="M140 230 L260 230 L270 270 L130 270 Z" fill="#050A30" />
            <rect
              x="155"
              y="240"
              width="90"
              height="40"
              rx="2"
              fill="#2E3A59"
            />
            {/* Decorative icons around */}
            <g className="animate-bounce-slow">
              <circle
                cx="100"
                cy="100"
                r="25"
                fill="white"
                stroke="#050A30"
                strokeWidth="2"
              />
              <path d="M90 100 Q100 90 110 100" stroke="#050A30" fill="none" />
              <circle cx="100" cy="98" r="4" fill="#050A30" />
            </g>
            <g transform="translate(300, 100)">
              <circle
                cx="0"
                cy="0"
                r="30"
                fill="white"
                stroke="#050A30"
                strokeWidth="2"
              />
              <path
                d="M-15 0 L15 0 M0 -15 L0 15"
                stroke="#FFD15B"
                strokeWidth="4"
              />
            </g>
            <g transform="translate(250, 60)">
              <path
                d="M0 0 L20 -10 L40 0 L20 10 Z"
                fill="#FFD15B"
                stroke="#050A30"
              />
              <path d="M20 10 L20 30" stroke="#050A30" />
            </g>
          </svg>
        ) : (
          <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
            {/* Standing Student */}
            <circle
              cx="200"
              cy="120"
              r="35"
              fill="#FFE0B2"
              stroke="#050A30"
              strokeWidth="2"
            />
            <path
              d="M170 155 Q200 145 230 155 L245 280 L155 280 Z"
              fill="#FFD15B"
              stroke="#050A30"
              strokeWidth="2"
            />

            {/* Holding a Book */}
            <rect
              x="180"
              y="180"
              width="80"
              height="100"
              rx="4"
              fill="white"
              stroke="#050A30"
              strokeWidth="3"
              transform="rotate(-10, 220, 230)"
            />
            <line
              x1="190"
              y1="200"
              x2="250"
              y2="190"
              stroke="#FFD15B"
              strokeWidth="6"
              transform="rotate(-10, 220, 230)"
            />

            {/* Backpack */}
            <path
              d="M245 180 Q270 180 270 220 L270 270 L245 270 Z"
              fill="#050A30"
            />

            {/* Floating Icons */}
            <circle
              cx="320"
              cy="150"
              r="15"
              fill="white"
              stroke="#050A30"
              strokeWidth="1.5"
            />
            <circle
              cx="320"
              cy="150"
              r="10"
              fill="none"
              stroke="#FFD15B"
              strokeWidth="1"
            />

            <rect
              x="80"
              y="200"
              width="20"
              height="40"
              rx="2"
              fill="#FFD15B"
              stroke="#050A30"
              transform="rotate(45)"
            />
            <circle cx="100" cy="100" r="5" fill="#FFD15B" />
            <circle cx="300" cy="250" r="4" fill="#FFD15B" />
          </svg>
        )}
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 0.6; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s infinite ease-in-out;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
