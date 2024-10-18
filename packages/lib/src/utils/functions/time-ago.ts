import ms from "ms"

export const timeAgo = (
  timestamp: Date | null,
  {
    withAgo
  }: {
    withAgo?: boolean
  } = {}
): string => {
  if (!timestamp) return "Nunca"
  const diff = Date.now() - new Date(timestamp).getTime()
  if (diff < 1000) {
    // less than 1 second
    return "Agora mesmo"
  } else if (diff > 82800000) {
    // more than 23 hours – similar to how Twitter displays timestamps
    return new Date(timestamp).toLocaleDateString("pt-BR", {
      month: "short",
      day: "numeric",
      year:
        new Date(timestamp).getFullYear() !== new Date().getFullYear()
          ? "numeric"
          : undefined
    })
  }
  return `${ms(diff)}${withAgo ? " atrás" : ""}`
}
