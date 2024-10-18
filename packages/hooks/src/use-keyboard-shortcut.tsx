import { stableSort } from "@polpi/lib"
import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState
} from "react"

type KeyboardShortcutListener = {
  id: string
  key: string | string[]
  enabled?: boolean
  priority?: number
  allowCtrlKey?: boolean
  requireAllKeys?: boolean
  forceEscKey?: boolean
}

export const KeyboardShortcutContext = createContext<{
  listeners: KeyboardShortcutListener[]
  setListeners: Dispatch<SetStateAction<KeyboardShortcutListener[]>>
}>({
  listeners: [] as KeyboardShortcutListener[],
  setListeners: () => {}
})

export function KeyboardShortcutProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [listeners, setListeners] = useState<KeyboardShortcutListener[]>([])

  return (
    <KeyboardShortcutContext.Provider value={{ listeners, setListeners }}>
      {children}
    </KeyboardShortcutContext.Provider>
  )
}

export function useKeyboardShortcut(
  key: KeyboardShortcutListener["key"],
  callback: (e: KeyboardEvent) => void,
  options: Pick<
    KeyboardShortcutListener,
    "enabled" | "priority" | "allowCtrlKey" | "requireAllKeys" | "forceEscKey"
  > = {}
) {
  const id = useId()

  const { listeners, setListeners } = useContext(KeyboardShortcutContext)
  const pressedKeys = useRef<Set<string>>(new Set())

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const existingModalBackdrop = document.getElementById("modal-backdrop")

      // Ignore shortcuts if the user is holding a modifier key, typing in an input or textarea, or in a modal
      if (
        (e.metaKey ||
          (e.ctrlKey && !options.allowCtrlKey) ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          existingModalBackdrop) &&
        !options?.forceEscKey
      )
        return

      // Ignore shortcut if it doesn't match this listener
      if (Array.isArray(key) ? !key.includes(e.key) : e.key !== key) return

      // Add the pressed key to the set
      pressedKeys.current.add(e.key)

      const matchingListeners = listeners.filter((l) => {
        if (l.enabled === false) return false

        // If `requireAllKeys` is true, ensure all keys in the array are pressed
        if (Array.isArray(l.key)) {
          if (options.requireAllKeys) {
            return l.key.every((k) => pressedKeys.current.has(k))
          } else {
            return l.key.includes(e.key)
          }
        }

        return l.key === e.key
      })

      if (!matchingListeners.length) return

      // Sort the listeners by priority
      const topListener = stableSort(
        matchingListeners,
        (a: any, b: any) => (b.priority ?? 0) - (a.priority ?? 0)
      ).slice(-1)[0]

      // Check if this is the top listener
      if (topListener.id !== id) return

      e.preventDefault()
      callback(e)
    },
    [key, listeners, id, callback, JSON.stringify(options)]
  )

  const onKeyUp = useCallback((e: KeyboardEvent) => {
    // Remove the key from the set when it is released
    pressedKeys.current.delete(e.key)
  }, [])

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("keyup", onKeyUp)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("keyup", onKeyUp)
    }
  }, [onKeyDown, onKeyUp])

  // Register/unregister the listener
  useEffect(() => {
    setListeners((prev) => [
      ...prev.filter((listener) => listener.id !== id),
      { id, key, ...options }
    ])

    return () =>
      setListeners((prev) => prev.filter((listener) => listener.id !== id))
  }, [
    JSON.stringify(key),
    options.enabled,
    options.priority,
    options.allowCtrlKey,
    options.requireAllKeys
  ])
}
