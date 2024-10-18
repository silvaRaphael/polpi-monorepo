import { cn } from "@comps/lib"
import { VariantProps, cva } from "class-variance-authority"
import React, { ReactNode, forwardRef } from "react"
import { Icon, LoadingSpinner } from "./icons"
import { Tooltip } from "./tooltip"
import { Link } from "react-router-dom"

export const buttonVariants = cva("transition-all disabled:hover:ring-0", {
  variants: {
    variant: {
      primary:
        "border-black bg-black text-white hover:bg-gray-800 hover:ring-4 mx-1 hover:ring-gray-200",
      accent:
        "border-color-400 border-b-color-600 bg-color-500 text-white hover:ring-4 mx-1 hover:ring-color-100 font-semibold",
      "accent-flat":
        "border-color-500 bg-color-500 text-white hover:bg-color-600 hover:ring-4 mx-1 hover:ring-color-100",
      secondary: cn(
        "border-gray-200 bg-white text-gray-900 hover:bg-gray-100 focus:border-gray-500 outline-none",
        "data-[state=open]:border-gray-500 data-[state=open]:ring-4 mx-1 data-[state=open]:ring-gray-200"
      ),
      shadow:
        "border-gray-200 bg-white text-gray-600 hover:shadow disabled:hover:shadow-none disabled:bg-white disabled:opacity-65 outline-none data-[state=open]:ring-4 mx-1 ring-gray-200",
      flip: "border border-black bg-black text-sm text-white hover:bg-white hover:text-black focus:outline-none",
      outline:
        "border-gray-300 text-gray-900 duration-75 hover:border-gray-500",
      ghost: "border-transparent hover:bg-gray-100 text-gray-900 duration-75",
      white:
        "border-transparent bg-white hover:bg-white text-gray-500 duration-75 hover:border-gray-400 group-hover/row:shadow group-hover/row:shadow-gray-300 focus:ring-4 mx-1 focus:ring-color-200",
      danger:
        "border-red-500 bg-red-500 text-white hover:bg-red-600 hover:ring-4 mx-1 hover:ring-red-100",
      "danger-outline":
        "border-red-200 bg-white text-red-500 hover:bg-red-600 hover:text-white",
      "text-gradient": cn(
        "border-gray-200 bg-white text-gray-900 hover:bg-gray-50 focus:border-gray-500 outline-none",
        "data-[state=open]:border-gray-500 data-[state=open]:ring-4 mx-1 data-[state=open]:ring-gray-200",
        "flex items-center justify-center gap-2 border px-4 text-sm"
      )
    },
    width: {
      default: "",
      auto: "w-auto px-2 gap-1",
      icon: "w-min h-8 whitespace-nowrap px-2",
      table: "w-min h-7 whitespace-nowrap px-1.5 focus:outline-none"
    },
    radius: {
      lg: "rounded-lg",
      full: "rounded-full"
    }
  },
  defaultVariants: {
    variant: "primary",
    radius: "lg"
  }
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  text?: ReactNode | string
  textWrapperClassName?: string
  loading?: boolean
  icon?: Icon | ReactNode
  suffixIcon?: Icon | ReactNode
  shortcut?: string
  disabledTooltip?: string | ReactNode
  href?: string
  target?: React.HTMLAttributeAnchorTarget
}

const Comp = React.forwardRef<any, any>((compProps, ref) =>
  compProps.to ? (
    <Link ref={ref} {...(compProps as any)} />
  ) : (
    <button ref={ref} {...compProps} />
  )
)

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      text,
      variant = "primary",
      width = "default",
      radius = "lg",
      className,
      textWrapperClassName,
      loading,
      icon,
      suffixIcon,
      shortcut,
      disabledTooltip,
      href,
      target,
      ...props
    }: ButtonProps,
    forwardedRef
  ) => {
    let CustomIcon
    let Icon

    let CustomSuffixIcon
    let SuffixIcon

    const onlyIcon = icon && !!(icon as any).displayName
    const onlySuffixIcon = suffixIcon && !!(suffixIcon as any).displayName

    if (onlyIcon) {
      Icon = icon as Icon
    } else {
      CustomIcon = icon as JSX.Element
    }

    if (onlySuffixIcon) {
      SuffixIcon = suffixIcon as Icon
    } else {
      CustomSuffixIcon = suffixIcon as JSX.Element
    }

    if (disabledTooltip) {
      return (
        <Tooltip content={disabledTooltip}>
          <div
            className={cn(
              "flex h-8 w-full cursor-not-allowed items-center justify-center gap-x-2 border border-gray-200 bg-gray-100 px-4 text-sm text-gray-400 transition-all focus:outline-none",
              `rounded-${radius}`,
              className
            )}
          >
            {icon ? (
              Icon && onlyIcon ? (
                <Icon
                  strokeWidth={width === "icon" ? 2 : 3}
                  className="size-4"
                />
              ) : (
                CustomIcon
              )
            ) : null}
            {text && (
              <div
                className={cn(
                  "min-w-0 truncate",
                  shortcut && "flex-1 text-left",
                  textWrapperClassName
                )}
              >
                {text}
              </div>
            )}
            {shortcut && (
              <kbd
                className={cn(
                  "hidden rounded bg-gray-200 px-2 py-0.5 text-xs font-light text-gray-400 md:inline-block",
                  {
                    "bg-gray-100": variant?.endsWith("outline")
                  }
                )}
              >
                {shortcut}
              </kbd>
            )}
          </div>
        </Tooltip>
      )
    }

    return (
      <Comp
        ref={forwardedRef}
        // if onClick is passed, it's a "button" type, otherwise it's being used in a form, hence "submit"
        type={href ? undefined : props.onClick ? "button" : "submit"}
        className={cn(
          "group flex h-8 w-full items-center justify-center gap-2 whitespace-nowrap border px-4 text-sm cursor-pointer",
          buttonVariants({ variant, width, radius }),
          (props.disabled || loading) &&
            "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 hover:bg-gray-100 hover:ring-gray-200",
          className
        )}
        disabled={props.disabled || loading}
        to={href ? href : undefined}
        target={href ? target : undefined}
        {...props}
      >
        {loading ? (
          <LoadingSpinner />
        ) : icon ? (
          Icon && onlyIcon ? (
            <Icon
              strokeWidth={width === "icon" || variant === "ghost" ? 2 : 3}
              className="size-4"
            />
          ) : (
            CustomIcon
          )
        ) : null}
        {text && (
          <div
            className={cn(
              "min-w-0 truncate",
              variant === "text-gradient" &&
                "bg-gradient-to-r from-color-600 to-pink-600 bg-clip-text text-transparent",
              shortcut && "flex-1 text-left",
              textWrapperClassName
            )}
          >
            {text}
          </div>
        )}
        {suffixIcon ? (
          SuffixIcon && onlySuffixIcon ? (
            <SuffixIcon
              strokeWidth={width === "icon" || variant === "ghost" ? 2 : 3}
              className="size-4"
            />
          ) : (
            CustomSuffixIcon
          )
        ) : null}
        {shortcut && (
          <kbd
            className={cn(
              "bg-white/25 ms-1 hidden rounded px-1 text-xs font-light transition-all duration-75 md:inline-block",
              {
                "bg-gray-700 text-gray-400 group-hover:bg-gray-600 group-hover:text-gray-300":
                  variant === "primary",
                "bg-gray-200 text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-500":
                  variant === "secondary" || variant === "ghost",
                "bg-gray-100 text-gray-500 group-hover:bg-gray-200":
                  variant === "outline",
                "bg-red-100 text-red-600 group-hover:bg-red-500 group-hover:text-white":
                  variant === "danger-outline"
              }
            )}
          >
            {shortcut}
          </kbd>
        )}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button }
