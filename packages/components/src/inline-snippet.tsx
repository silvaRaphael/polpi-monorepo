import { cn } from "@polpi/lib"

export const InlineSnippet = ({
  children,
  variant,
  className
}: {
  children: string | JSX.Element
  variant?: "muted"
  className?: string
}) => {
  return (
    <span
      className={cn(
        "inline-block rounded-sm bg-gray-200/75 px-1.5 py-1 font-mono text-gray-900 text-xs leading-[12px]",
        variant === "muted" && "bg-gray-100 text-gray-400",
        className
      )}
    >
      {children}
    </span>
  )
}
