import { cn } from "@polpi/lib"
import { tv, VariantProps } from "tailwind-variants"
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"
import React, { ReactNode, useCallback, useState } from "react"
import { Icon } from "./icons"

const inputVariants = tv({
  slots: {
    input: "h-8 w-full rounded-md border text-sm",
    icon: "",
    loadingIcon: ""
  },

  variants: {
    variant: {
      default: {
        input: "border-gray-300 text-gray-900 placeholder-gray-400",
        icon: "text-gray-500",
        loadingIcon: "text-gray-400"
      },
      muted: {
        input:
          "border-gray-100 text-gray-800 placeholder-gray-500 bg-gray-100/75",
        icon: "text-gray-500",
        loadingIcon: "text-gray-400"
      }
    },
    ring: {
      ring: {
        input: "focus:border-gray-500 focus:outline-none focus:ring-gray-500"
      },
      none: {
        input:
          "focus:border-transparent focus:outline-none focus:ring-transparent"
      }
    }
  },
  defaultVariants: {
    variant: "default",
    ring: "ring"
  }
})

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  wrapperClassName?: string
  error?: string
  loading?: boolean
  icon?: Icon | ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      wrapperClassName,
      className,
      type,
      loading,
      icon,
      variant,
      ring,
      ...props
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const toggleIsPasswordVisible = useCallback(
      () => setIsPasswordVisible(!isPasswordVisible),
      [isPasswordVisible, setIsPasswordVisible]
    )

    const {
      input,
      icon: iconVariant,
      loadingIcon
    } = inputVariants({ variant, ring })

    let CustomIcon
    let Icon

    const onlyIcon = icon && !!(icon as any).displayName

    if (onlyIcon) {
      Icon = icon as Icon
    } else {
      CustomIcon = icon as JSX.Element
    }

    return (
      <div className={cn("relative w-max", wrapperClassName)}>
        {loading ? (
          <Loader2
            className={cn(
              "absolute left-2.5 top-2 z-[1] size-4 animate-spin",
              loadingIcon()
            )}
          />
        ) : icon ? (
          Icon && onlyIcon ? (
            <Icon
              className={cn(
                "absolute left-2.5 top-2 z-[1] size-4",
                iconVariant()
              )}
            />
          ) : (
            CustomIcon
          )
        ) : null}
        <input
          type={isPasswordVisible ? "text" : type}
          className={cn(
            input(),
            (icon || loading) && "ps-8",
            type === "password" && "pe-8",
            className
          )}
          ref={ref}
          {...props}
        />

        {type === "password" && (
          <button
            className="absolute inset-y-0 right-0 flex items-center rounded-lg px-2.5"
            type="button"
            onClick={() => toggleIsPasswordVisible()}
            aria-label={isPasswordVisible ? "Hide password" : "Show Password"}
          >
            {isPasswordVisible ? (
              <EyeIcon
                className="size-4 flex-none text-gray-500 transition hover:text-gray-700"
                aria-hidden
              />
            ) : (
              <EyeOffIcon
                className="size-4 flex-none text-gray-500 transition hover:text-gray-700"
                aria-hidden
              />
            )}
          </button>
        )}

        {props.error && (
          <span
            className="block text-sm text-red-500"
            role="alert"
            aria-live="assertive"
          >
            {props.error}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
