import { cn } from "@/src/utils/cn"
import type { HTMLAttributes, SelectHTMLAttributes } from "react"

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({ className, ...props }: SelectProps) {
  return (
    <select
      data-slot="select"
      className={cn(
        "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-colors",
        "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export interface SelectLabelProps extends HTMLAttributes<HTMLLabelElement> {
  htmlFor?: string
}

export function SelectLabel({ className, ...props }: SelectLabelProps) {
  return (
    <label
      data-slot="select-label"
      className={cn(
        "mb-1 block text-xs font-semibold tracking-wider text-slate-500 uppercase",
        className
      )}
      {...props}
    />
  )
}

export interface SelectGroupProps extends HTMLAttributes<HTMLDivElement> {}
