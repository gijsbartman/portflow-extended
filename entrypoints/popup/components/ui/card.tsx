import { cn } from "@/src/utils/cn"
import type { HTMLAttributes } from "react"

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return <div data-slot="card" className={cn("py-3", className)} {...props} />
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col space-y-1.5 px-4", className)}
      {...props}
    />
  )
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3
      data-slot="card-title"
      className={cn("text-lg leading-none font-semibold tracking-tight", className)}
      {...props}
    />
  )
}

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-slate-500", className)}
      {...props}
    />
  )
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, ...props }: CardContentProps) {
  return <div data-slot="card-content" className={cn("px-4", className)} {...props} />
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div data-slot="card-footer" className={cn("flex items-center px-4", className)} {...props} />
  )
}
