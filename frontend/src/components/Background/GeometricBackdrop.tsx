import { cn } from "@/lib/utils";

type GeometricBackdropVariant = "auth-login" | "auth-register" | "home" | "catalog";

interface GeometricBackdropProps {
  className?: string;
  variant?: GeometricBackdropVariant;
  gridOpacityClassName?: string;
  scanlineOpacityClassName?: string;
}

const variantClasses: Record<GeometricBackdropVariant, string[]> = {
  "auth-login": [
    "left-[8%] top-[16%] h-28 w-28 rotate-45 border border-red-300/18 bg-red-300/[0.04]",
    "right-[12%] top-[18%] h-40 w-40 border border-red-200/12 opacity-55 [clip-path:polygon(50%_0%,100%_38%,82%_100%,18%_100%,0%_38%)]",
    "left-[20%] top-[54%] h-36 w-36 border border-lime-200/12 opacity-40 [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]",
    "right-[18%] bottom-[16%] h-32 w-32 rotate-12 border border-red-100/12 bg-white/[0.02]",
    "left-1/2 top-[12%] h-[24rem] w-[24rem] -translate-x-1/2 rounded-full border border-red-200/10 opacity-35",
  ],
  "auth-register": [
    "left-[10%] top-[18%] h-32 w-32 rotate-12 border border-cyan-300/18 bg-cyan-300/[0.04]",
    "right-[10%] top-[16%] h-44 w-44 border border-fuchsia-300/14 opacity-52 [clip-path:polygon(12%_12%,88%_0%,100%_76%,40%_100%,0%_64%)]",
    "left-[18%] top-[56%] h-40 w-40 border border-cyan-200/12 opacity-38 [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]",
    "right-[16%] bottom-[14%] h-28 w-28 rotate-45 border border-fuchsia-200/14 bg-fuchsia-300/[0.03]",
    "left-1/2 top-[14%] h-[22rem] w-[22rem] -translate-x-1/2 rounded-full border border-fuchsia-300/10 opacity-30",
  ],
  home: [
    "left-[6%] top-[12%] h-32 w-32 rotate-45 border border-red-300/14 bg-red-300/[0.03]",
    "right-[10%] top-[14%] h-48 w-48 border border-cyan-300/10 opacity-40 [clip-path:polygon(12%_12%,88%_0%,100%_76%,40%_100%,0%_64%)]",
    "left-[14%] top-[48%] h-44 w-44 border border-red-200/10 opacity-36 [clip-path:polygon(50%_0%,100%_38%,82%_100%,18%_100%,0%_38%)]",
    "right-[18%] bottom-[12%] h-36 w-36 border border-fuchsia-300/10 opacity-30 [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]",
    "left-1/2 top-[10%] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full border border-white/6 opacity-24",
    "left-[32%] bottom-[18%] h-24 w-[20rem] -rotate-[10deg] bg-[linear-gradient(90deg,transparent,rgba(255,23,68,0.09),transparent)] blur-2xl",
  ],
  catalog: [
    "left-[8%] top-[22%] h-40 w-40 rotate-45 border border-red-200/16 bg-red-200/[0.04]",
    "right-[12%] top-[48%] h-28 w-28 rotate-12 border border-fuchsia-300/14 bg-fuchsia-300/[0.03]",
    "left-[14%] top-[52%] h-52 w-52 border border-red-200/12 opacity-48 [clip-path:polygon(50%_0%,100%_38%,82%_100%,18%_100%,0%_38%)]",
    "right-[18%] top-[18%] h-44 w-44 border border-fuchsia-300/10 opacity-36 [clip-path:polygon(12%_12%,88%_0%,100%_76%,40%_100%,0%_64%)]",
    "left-[38%] top-[18%] h-40 w-40 border border-amber-200/10 opacity-30 [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]",
    "right-[22%] bottom-[14%] h-36 w-36 border border-red-100/8 opacity-26 [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]",
    "left-[18%] bottom-[8%] h-[18rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.1),transparent_64%)] blur-3xl",
  ],
};

export function GeometricBackdrop({
  className,
  variant = "home",
  gridOpacityClassName = "opacity-40",
  scanlineOpacityClassName = "opacity-20",
}: GeometricBackdropProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      {variantClasses[variant].map((shapeClassName, index) => (
        <div
          key={`${variant}-${index}`}
          className={cn(
            "absolute backdrop-blur-[2px]",
            index % 2 === 0
              ? "animate-[geometric-backdrop-float_20s_ease-in-out_infinite]"
              : "animate-[geometric-backdrop-float-alt_26s_ease-in-out_infinite]",
            index === 4 && "animate-[geometric-backdrop-spin_30s_linear_infinite]",
            shapeClassName,
          )}
        />
      ))}
      <div className={cn("cyber-grid absolute inset-0", gridOpacityClassName)} />
      <div className={cn("cyber-scanline absolute inset-0", scanlineOpacityClassName)} />
    </div>
  );
}
