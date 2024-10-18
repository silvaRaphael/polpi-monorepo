import { cn } from "@comps/lib"
import { cva, type VariantProps } from "class-variance-authority"
import { CircleCheck, Info, ClockAlert, ShieldAlert } from "lucide-react"
import { Icon } from "./icons"

const statusBadgeVariants = cva(
  "flex gap-1 items-center max-w-fit rounded-md px-1.5 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "bg-gray-500/[.15] text-gray-600",
        success: "bg-green-500/[.15] text-green-600",
        pending: "bg-color-500/[.15] text-color-600",
        error: "bg-red-500/[.15] text-red-600"
      }
    },
    defaultVariants: {
      variant: "neutral"
    }
  }
)

export type StatusBadgeVariants = VariantProps<
  typeof statusBadgeVariants
>["variant"]

export const generateStatusBadgeContent = <T extends string>(
  types: Record<
    T,
    {
      label: string
      variant?: StatusBadgeVariants
    }
  >,
  type: T
) => types[type]

const defaultIcons = {
  neutral: Info,
  success: CircleCheck,
  pending: ClockAlert,
  error: ShieldAlert
}

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  icon?: Icon
}

function StatusBadge({
  className,
  variant,
  icon,
  children,
  ...props
}: BadgeProps) {
  const Icon = icon !== null ? icon ?? defaultIcons[variant ?? "neutral"] : null
  return (
    <span
      className={cn(statusBadgeVariants({ variant }), className)}
      {...props}
    >
      {Icon && <Icon className="size-3 shrink-0" />}
      {children}
    </span>
  )
}

export { StatusBadge, statusBadgeVariants }
