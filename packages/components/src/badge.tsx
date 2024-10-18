import { cn } from "@comps/lib"
import { cva, type VariantProps } from "class-variance-authority"

const badgeVariants = cva(
  "max-w-fit rounded-sm border px-1.5 py-0.5 text-xs font-medium capitalize whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-gray-400 text-gray-500",
        success: "border-[#a8f170] bg-[#d1fab3] text-[#217005]",
        error: "border-red-300 bg-red-100 text-red-700",
        pending: "border-yellow-300 bg-yellow-100 text-yellow-700",
        canceled: "border-gray-300 bg-gray-100 text-gray-700",
        color: "border-color-600 bg-color-600 text-white",
        blue: "border-blue-500 bg-blue-500 text-white",
        black: "border-black bg-black text-white",
        gray: "border-gray-300 bg-gray-200/75 text-gray-500",
        neutral: "border-gray-400 text-gray-500",
        rainbow:
          "bg-gradient-to-r from-color-600 to-pink-600 text-white border-transparent"
      }
    },
    defaultVariants: {
      variant: "neutral"
    }
  }
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
