import { useLayoutEffect, useRef, useState } from "react";

type SkeletonWrapperProps = {
  loading: boolean;
  children: React.ReactNode;
};

export default function SkeletonWrapper({ loading, children }: SkeletonWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const el = ref.current;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {/* Real content (hidden but measurable) */}
      <div
        ref={ref}
        style={{
          visibility: loading ? "hidden" : "visible",
        }}
      >
        {children}
      </div>

      {/* Skeleton */}
      {loading && size && (
        <div
          className="skeleton"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: size.width,
            height: size.height,
            borderRadius: 8,
          }}
        />
      )}
    </div>
  );
}
