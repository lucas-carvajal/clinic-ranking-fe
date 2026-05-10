import { cn } from "@/lib/utils";

type SpinnerSize = "sm" | "md" | "lg";

type SpinnerProps = {
  size?: SpinnerSize;
  className?: string;
  /** Accessible label, rendered visually hidden for screen readers. */
  label?: string;
};

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "size-4 border-2",
  md: "size-6 border-2",
  lg: "size-10 border-[3px]",
};

export function Spinner({ size = "md", className, label }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "border-muted-foreground/30 border-t-foreground inline-block animate-spin rounded-full border-solid",
        sizeClasses[size],
        className,
      )}
    >
      {label ? <span className="sr-only">{label}</span> : null}
    </div>
  );
}

/**
 * Convenience wrapper: a vertically padded, horizontally centered spinner
 * suitable for replacing a content block while data is loading.
 */
export function CenteredSpinner({
  size = "lg",
  label,
  className,
}: SpinnerProps) {
  return (
    <div
      className={cn("flex items-center justify-center py-16", className)}
    >
      <Spinner size={size} label={label} />
    </div>
  );
}
