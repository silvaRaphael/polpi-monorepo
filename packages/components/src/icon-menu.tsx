import { cn } from "@comps/lib"
import { ReactNode } from "react"

interface MenuIconProps {
  text: string
  icon?: ReactNode
  suffixIcon?: ReactNode
  className?: string
}

export function IconMenu({ text, icon, suffixIcon, className }: MenuIconProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-start w-full space-x-2 truncate",
        className
      )}
    >
      {icon}
      <p className="truncate text-sm">{text}</p>
      {suffixIcon}
    </div>
  )
}
