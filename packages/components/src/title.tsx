import { cn } from "@polpi/lib"

export function Title({ text, depth = 0 }: { text: string; depth?: 0 | 1 }) {
  const size = {
    0: "text-3xl",
    1: "text-xl"
  }[depth]

  return (
    <p className={cn("font-semibold cursor-default text-gray-800", size)}>
      {text}
    </p>
  )
}
