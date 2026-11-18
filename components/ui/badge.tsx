import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "bg-white/5 text-ink-muted border border-border",
        cyan: "bg-cyan-dim text-cyan border border-cyan/25",
        violet: "bg-violet-dim text-violet border border-violet/25",
        amber: "bg-amber/15 text-amber border border-amber/25",
        crimson: "bg-crimson/15 text-crimson border border-crimson/25",
        emerald: "bg-emerald/15 text-emerald border border-emerald/25",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
