import { cn } from "@comps/lib"
import { ReactNode } from "react"

export function MaxWidthWrapper({
  className,
  children
}: {
  className?: string
  children?: ReactNode
}) {
  return (
    <div className="w-full px-5 lg:px-8">
      <div className={cn("max-w-screen-xl w-full mx-auto", className)}>
        {children}
      </div>
    </div>
  )
}
