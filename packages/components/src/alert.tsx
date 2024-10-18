import { cn } from "@polpi/lib"
import { tv, type VariantProps } from "tailwind-variants"
import { Lightbulb, X } from "lucide-react"
import * as React from "react"
import Cookies from "js-cookie"
import { Link } from "react-router-dom"
import { Icon } from "./icons"

const alertVariants = tv({
  slots: {
    content: "flex items-center p-2 rounded-md",
    button: "group",
    separator: ""
  },

  variants: {
    variant: {
      default: {
        content: "bg-gray-100 text-gray-700",
        button: "hover:bg-gray-200 text-gray-950",
        separator: "bg-gray-200 group-hover:bg-transparent"
      },
      error: {
        content: "bg-red-100 text-red-700",
        button: "hover:bg-red-200 text-red-700",
        separator: "bg-red-200 group-hover:bg-transparent"
      },
      success: {
        content: "bg-[#d1fab3] text-green-800",
        button: "hover:bg-[#217005]/10 text-green-800",
        separator: "bg-[#217005]/10 group-hover:bg-transparent"
      }
    }
  },
  defaultVariants: {
    variant: "default"
  }
})

export interface AlertProps extends VariantProps<typeof alertVariants> {
  id: string
  title: string
  className?: string
  icon?: Icon
  label?: React.ReactNode | string
  text?: React.ReactNode | string
  link?: string
  linkText?: string
  linkTarget?: React.HTMLAttributeAnchorTarget
  closeButton?: boolean
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      id,
      variant = "default",
      className,
      icon: Icon = Lightbulb,
      title,
      text,
      link,
      linkText,
      linkTarget,
      closeButton = true
    }: AlertProps,
    forwardedRef
  ) => {
    const {
      content: contentClassName,
      button: buttonClassName,
      separator: separatorClassName
    } = alertVariants({ variant })

    const alreadyClosed = Cookies.get(`alert:${id}`) === "1"

    const [isVisible, setIsVisible] = React.useState<boolean>(!alreadyClosed)

    function onClose() {
      setIsVisible(false)
      Cookies.set(`alert:${id}`, "1")
    }

    if (!isVisible) return null

    return (
      <div
        ref={forwardedRef}
        role="alert"
        className={cn(
          contentClassName(),
          "relative cursor-default",
          closeButton && "!pr-10",
          className
        )}
      >
        <div className="flex items-center gap-x-1 me-4">
          <Icon className="size-3" />
          {typeof title === "string" ? (
            <p className="text-xs font-semibold">{title}</p>
          ) : (
            title
          )}
        </div>

        <div className="me-4">
          {typeof text === "string" ? <p className="text-xs">{text}</p> : text}
        </div>

        {link && (
          <Link
            to={link}
            {...(linkTarget ? { linkTarget } : {})}
            rel={linkTarget === "_blank" ? "noopener noreferrer" : undefined}
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-nowrap font-semibold text-color-600 hover:text-color-700 me-1 ms-auto"
          >
            {linkText}
          </Link>
        )}

        {closeButton && (
          <div
            className={cn(
              "flex justify-center items-center rounded-r-md py-1.5 h-full absolute end-0 cursor-pointer",
              buttonClassName()
            )}
            onClick={onClose}
          >
            <div className={cn("h-full w-[1px]", separatorClassName())} />
            <div className="px-2">
              <X className="size-4" />
            </div>
          </div>
        )}
      </div>
    )
  }
)

Alert.displayName = "Alert"

export { Alert }
