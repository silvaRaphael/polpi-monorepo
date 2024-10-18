import { useCallback, useEffect, useRef, useState } from "react"

export function useScrollPosition(orientation: "vertical" | "horizontal") {
  const scrollPositionRef = useRef(null)

  const [scrollPosition, setScrollPosition] = useState<{
    distance: number
    maxDistance: number
    position: "none" | "start" | "middle" | "end"
  }>({
    distance: 0,
    maxDistance: 0,
    position: "none"
  })

  const onScroll = useCallback((e: any) => {
    const scrollOffset =
      orientation === "vertical" ? e.target.scrollTop : e.target.scrollLeft
    const maxScrollOffset =
      orientation === "vertical"
        ? e.target.scrollHeight - e.target.clientHeight
        : e.target.scrollWidth - e.target.clientWidth

    setScrollPosition({
      distance: scrollOffset,
      maxDistance: maxScrollOffset,
      position:
        scrollOffset === maxScrollOffset && scrollOffset === 0
          ? "none"
          : scrollOffset === maxScrollOffset
          ? "end"
          : scrollOffset === 0
          ? "start"
          : "middle"
    })
  }, [])

  useEffect(() => {
    if (scrollPositionRef.current)
      onScroll({
        target: scrollPositionRef.current
      })
  }, [scrollPositionRef.current])

  return { scrollPosition, onScroll, scrollPositionRef }
}
