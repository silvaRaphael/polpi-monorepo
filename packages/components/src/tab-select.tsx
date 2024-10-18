import { cn } from "@comps/lib"
import { LayoutGroup, motion } from "framer-motion"
import { Dispatch, SetStateAction, useId } from "react"

export function TabSelect<T extends string>({
  options,
  selected,
  onSelect
}: {
  options: { id: T; label: string }[]
  selected: string | null
  onSelect?: Dispatch<SetStateAction<T>> | ((id: T) => void)
}) {
  const layoutGroupId = useId()

  return (
    <div
      className={cn(
        "flex text-sm -space-x-1 -ml-3.5 -mr-3.5 relative",
        "before:content-[''] before:absolute before:bottom-0 before:left-3.5 before:w-[calc(100%-28px)] before:border-b"
      )}
    >
      <LayoutGroup id={layoutGroupId}>
        {options.map(({ id, label }) => (
          <div key={id} className="relative">
            <button
              type="button"
              onClick={() => onSelect?.(id)}
              className={cn(
                "px-1.5 pb-1 transition-colors duration-75 font-semibold group",
                id === selected
                  ? "text-color-600 hover:text-color-700"
                  : "text-gray-600 hover:text-gray-700"
              )}
              aria-selected={id === selected}
            >
              <div
                className={cn(
                  "px-2 py-1 rounded-md",
                  id === selected
                    ? "group-hover:bg-color-500/[.05]"
                    : "group-hover:bg-gray-100/75"
                )}
              >
                {label}
              </div>
            </button>
            {id === selected && (
              <motion.div
                layoutId="indicator"
                transition={{
                  duration: 0.1
                }}
                className="absolute bottom-0 w-full px-3.5"
              >
                <div className="h-0.5 bg-color-600" />
              </motion.div>
            )}
          </div>
        ))}
      </LayoutGroup>
    </div>
  )
}
