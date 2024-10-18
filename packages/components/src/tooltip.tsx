import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import Linkify from "linkify-react"
import { HelpCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { ReactNode, useState } from "react"

import { Badge } from "./badge"
import { Button, ButtonProps, buttonVariants } from "./button"
import { cn, nFormatter, timeAgo } from "@comps/lib"

export function TooltipProvider({ children }: { children: ReactNode }) {
  return (
    <TooltipPrimitive.Provider delayDuration={100}>
      {children}
    </TooltipPrimitive.Provider>
  )
}

export interface TooltipProps
  extends Omit<TooltipPrimitive.TooltipContentProps, "content"> {
  content:
    | ReactNode
    | string
    | ((props: { setOpen: (open: boolean) => void }) => ReactNode)
}

export function Tooltip({
  children,
  content,
  side = "top",
  className,
  sideOffset = 8
}: TooltipProps) {
  const [open, setOpen] = useState(false)

  return (
    <TooltipPrimitive.Root open={open} onOpenChange={setOpen} delayDuration={0}>
      <TooltipPrimitive.Trigger
        asChild
        onClick={() => {
          setOpen(true)
        }}
        onBlur={() => {
          setOpen(false)
        }}
      >
        {children}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          sideOffset={sideOffset}
          side={side}
          className={cn(
            "animate-slide-up-fade z-[99] items-center overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg cursor-pointer",
            typeof content === "string" &&
              "bg-gray-700 text-gray-100 px-2 py-1 rounded-md border-gray-600 text-sm leading-none",
            className
          )}
          collisionPadding={0}
        >
          {typeof content === "string"
            ? content
            : typeof content === "function"
            ? content({ setOpen })
            : content}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}

export function TooltipContent({
  title,
  cta,
  href,
  target,
  onClick
}: {
  title: string
  cta?: string
  href?: string
  target?: string
  onClick?: () => void
}) {
  return (
    <div className="flex max-w-xs flex-col items-center space-y-3 p-4 text-center">
      <p className="text-sm text-gray-700">{title}</p>
      {cta &&
        (href ? (
          <Link
            to={href}
            {...(target ? { target } : {})}
            className={cn(
              buttonVariants({ variant: "primary" }),
              "flex h-9 w-full items-center justify-center whitespace-nowrap rounded-lg border px-4 text-sm"
            )}
          >
            {cta}
          </Link>
        ) : onClick ? (
          <Button onClick={onClick} text={cta} variant="primary" />
        ) : null)}
    </div>
  )
}

export function SimpleTooltipContent({
  title,
  cta,
  href,
  target
}: {
  title: string
  cta?: string
  href?: string
  target?: React.HTMLAttributeAnchorTarget
}) {
  return (
    <div className="max-w-[240px] px-4 py-2 text-start text-sm text-gray-700">
      {title}{" "}
      {cta && href && (
        <Link
          to={href}
          {...(target ? { target } : {})}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex font-semibold text-color-600 hover:text-color-700"
        >
          {cta}
        </Link>
      )}
    </div>
  )
}

export function LinkifyTooltipContent({ children }: { children: ReactNode }) {
  return (
    <div className="block max-w-md whitespace-pre-wrap px-4 py-2 text-center text-sm text-gray-700">
      <Linkify
        as="p"
        options={{
          target: "_blank",
          rel: "noopener noreferrer nofollow",
          className:
            "underline underline-offset-4 text-gray-400 hover:text-gray-700"
        }}
      >
        {children}
      </Linkify>
    </div>
  )
}

export function InfoTooltip(props: Omit<TooltipProps, "children">) {
  return (
    <Tooltip {...props}>
      <HelpCircle className="h-4 w-4 text-color-600" />
    </Tooltip>
  )
}

export function NumberTooltip({
  value,
  unit = "cliques",
  prefix,
  children,
  lastClicked
}: {
  value?: number | null
  unit?: string
  prefix?: string
  children: ReactNode
  lastClicked?: Date | null
}) {
  if ((!value || value < 1000) && !lastClicked) {
    return children
  }
  return (
    <Tooltip
      content={
        <div className="block max-w-xs px-4 py-2 text-center text-sm text-gray-700">
          <p className="text-sm font-semibold text-gray-700">
            {prefix}
            {nFormatter(value || 0, { full: true })} {unit}
          </p>
          {lastClicked && (
            <p className="mt-1 text-xs text-gray-500" suppressHydrationWarning>
              Último Clique {timeAgo(lastClicked, { withAgo: true })}
            </p>
          )}
        </div>
      }
    >
      {children}
    </Tooltip>
  )
}

export function BadgeTooltip({ children, content, ...props }: TooltipProps) {
  return (
    <Tooltip content={content} {...props}>
      <div className="flex cursor-pointer items-center">
        <Badge
          variant="gray"
          className="border-gray-300 transition-all hover:bg-gray-200"
        >
          {children}
        </Badge>
      </div>
    </Tooltip>
  )
}

export function ButtonTooltip({
  tooltipContent,
  children,
  ...props
}: {
  tooltipContent: ReactNode | string
  children: ReactNode
} & ButtonProps) {
  return (
    <Tooltip content={tooltipContent}>
      <div className="flex cursor-pointer items-center">
        <button type="button" {...props}>
          {children}
        </button>
      </div>
    </Tooltip>
  )
}
