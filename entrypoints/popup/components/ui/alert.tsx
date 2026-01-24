import { cn } from "@/src/utils/cn"
import { cva, type VariantProps } from "class-variance-authority"
import type { HTMLAttributes } from "react"

const alertVariants = cva("relative w-full rounded-lg border p-4", {
  variants: {
    variant: {
      default: "bg-white border-slate-200 text-slate-900",
      warning: "bg-amber-50 border-amber-200 text-amber-900",
      error: "bg-red-50 border-red-200 text-red-900",
      success: "bg-emerald-50 border-emerald-200 text-emerald-900",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {}

export function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

export interface AlertTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export function AlertTitle({ className, ...props }: AlertTitleProps) {
  return (
    <h5
      data-slot="alert-title"
      className={cn("mb-1 leading-none font-medium tracking-tight", className)}
      {...props}
    />
  )
}

export interface AlertDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export function AlertDescription({ className, ...props }: AlertDescriptionProps) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  )
}
