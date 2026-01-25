import { cn } from "@/src/utils/cn"
import { cva, type VariantProps } from "class-variance-authority"
import type { HTMLAttributes } from "react"

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors",
  {
    variants: {
      variant: {
        level_0: "bg-level-0 text-level-0-foreground",
        level_1: "bg-level-1 text-level-1-foreground",
        level_2: "bg-level-2 text-level-2-foreground",
        level_3: "bg-level-3 text-level-3-foreground",
        level_4: "bg-level-4 text-level-4-foreground",
        niet_op_niveau: "bg-niet-op-niveau text-niet-op-niveau-foreground",
        op_niveau: "bg-op-niveau text-op-niveau-foreground",
        boven_niveau: "bg-boven-niveau text-boven-niveau-foreground",
        default: "bg-slate-100 text-slate-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}
