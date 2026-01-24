import { cn } from "@/src/utils/cn"
import { cva, type VariantProps } from "class-variance-authority"
import type { HTMLAttributes } from "react"

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors",
  {
    variants: {
      variant: {
        level_1: "bg-[#33A3FF] text-[#e6f4ff]",
        level_2: "bg-[#0A91FF] text-[#e6f4ff]",
        level_3: "bg-[#007BE0] text-[#e6f4ff]",
        level_4: "bg-[#0065B8] text-[#e6f4ff]",
        niet_op_niveau: "bg-[#B8001F] text-[#FFEBEE]",
        op_niveau: "bg-[#007A33] text-[#E6F9EE]",
        boven_niveau: "bg-[#0065B8] text-[#e6f4ff]",
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
