import type { ReactNode } from "react";

export function WrappedShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">{children}</div>
  );
}

export function WavyTop() {
  return (
    <div
      className="pointer-events-none w-full px-1 pt-1 text-[#0a0a0a]"
      aria-hidden
    >
      <svg className="h-10 w-full" preserveAspectRatio="none" viewBox="0 0 360 40">
        <path d="M0,22 C60,6 120,32 180,12 C240,-8 300,30 360,8 L360,40 L0,40 Z" fill="currentColor" opacity={0.65} />
        <path
          d="M0,28 C80,10 150,40 220,20 C280,0 320,32 360,20 L360,42 L0,42 Z"
          fill="currentColor"
          opacity={0.35}
        />
      </svg>
    </div>
  );
}

export function WavyBottom() {
  return (
    <div
      className="pointer-events-none w-full px-1 pb-1 text-[#0a0a0a]"
      aria-hidden
    >
      <svg className="h-10 w-full" preserveAspectRatio="none" viewBox="0 0 360 40">
        <path d="M0,0 L360,0 L360,8 C300,20 250,-4 180,10 C100,30 50,0 0,16 Z" fill="currentColor" opacity={0.4} />
        <path
          d="M0,0 L360,0 L360,2 C280,20 200,-8 100,8 C60,12 20,0 0,6 Z"
          fill="currentColor"
          opacity={0.55}
        />
      </svg>
    </div>
  );
}

const outlineNumberStyle = {
  fontFamily: "var(--font-wrapped, ui-sans-serif)",
  WebkitTextStroke: "2.5px #0a0a0a" as const,
  paintOrder: "stroke fill" as const,
  color: "#d12c1f",
  textShadow: "3px 3px 0 #0a0a0a",
};

export function YearMosaicFy() {
  return (
    <div
      className="relative -mx-1 mt-2 h-36 overflow-hidden select-none"
      aria-hidden
    >
      <div
        className="absolute inset-0 -translate-y-2 skew-y-1 scale-110"
        style={{
          background: `
            repeating-conic-gradient(
              from 12deg,
              #1e4fd6 0% 25%,
              #e8f0ff 0% 50%
            ) 0% 0% / 20px 20px
          `,
          opacity: 0.92,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#f2f2f0] via-transparent to-[#f2f2f0]/30" />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 360 140"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M0,100 Q120,60 200,80 T360,70 L360,160 L0,160 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          className="text-black/30"
        />
        <path
          d="M-20,30 Q140,0 220,50 T400,20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          className="text-black/35"
        />
      </svg>
      <div className="absolute inset-0 flex items-end justify-center gap-0 pb-2 pl-2 pr-1">
        <span className="self-end pb-5 text-left text-xs font-bold tracking-[0.2em] text-[#0a0a0a]/45">
          FY
        </span>
        <span
          className="text-[2.6rem] font-extrabold leading-none sm:text-6xl"
          style={outlineNumberStyle}
        >
          24
        </span>
        <span
          className="text-6xl font-extrabold leading-[0.85] sm:text-7xl"
          style={outlineNumberStyle}
        >
          25
        </span>
      </div>
    </div>
  );
}
