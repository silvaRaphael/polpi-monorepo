import { createContext, useContext, useEffect, useState } from "react"
import { addDays, isBefore } from "date-fns"

export const roles = {
  manager: "ADMINISTRADOR",
  member: "MEMBRO"
}

export type Role = keyof typeof roles

export type User = {
  id: string
  name: string
  email: string
  image: string | null
  role: Role
}

export interface Session {
  user?: User
  status: "logged" | "expired" | "not-logged"
  lastLogin?: Date
  reLogin: boolean
}

type SessionProviderProps = {
  children: React.ReactNode
  session: Session
  revalidateRedirect?: () => void
  storageKey?: string
}

type SessionProviderState = {
  session: Session
  signIn: (user: User, callback?: () => void) => void
  signOut: (callback?: () => void) => void
}

const initialState: SessionProviderState = {
  session: {
    user: undefined,
    status: "not-logged",
    reLogin: false,
    lastLogin: undefined
  },
  signIn() {},
  signOut() {}
}

const SessionProviderContext = createContext<SessionProviderState>(initialState)

export function SessionProvider({
  children,
  session = initialState.session,
  revalidateRedirect,
  storageKey = "session",
  ...props
}: SessionProviderProps) {
  const sessionFromStorage = JSON.parse(
    localStorage.getItem(storageKey) ?? "{}"
  )

  const [data, setData] = useState<Session | undefined>(
    Object.keys(sessionFromStorage).length
      ? (sessionFromStorage as Session)
      : session
  )

  useEffect(() => {
    let sessionData = {
      ...(data
        ? data
        : ({
            user: undefined,
            status: "not-logged",
            lastLogin: undefined,
            reLogin: false
          } as Session))
    }

    // revalidade session after 7 days logged
    if (data?.status === "logged" && data.lastLogin)
      if (isBefore(data.lastLogin, addDays(new Date(), -7))) {
        sessionData = {
          ...sessionData,
          reLogin: true,
          status: "expired"
        }

        localStorage.setItem(storageKey, JSON.stringify(sessionData))
        setData(sessionData)

        return revalidateRedirect?.()
      }

    // redirect if not authenticated
    if (data?.status === "not-logged" || data?.status === "expired")
      return revalidateRedirect?.()

    localStorage.setItem(storageKey, JSON.stringify(sessionData))
    setData(sessionData)
  }, [data?.status])

  return (
    <SessionProviderContext.Provider
      {...props}
      value={{
        session: data
          ? ({
              ...data
            } as Session)
          : initialState.session,
        signIn: (user, callback) => {
          const sessionData = {
            ...(session
              ? ({
                  ...session,
                  user,
                  status: "logged",
                  reLogin: false,
                  lastLogin: new Date()
                } as Session)
              : ({
                  user: undefined,
                  status: "not-logged",
                  lastLogin: undefined,
                  reLogin: false
                } as Session))
          }

          localStorage.setItem(storageKey, JSON.stringify(sessionData))

          setData(sessionData)

          callback?.()
        },
        signOut: (callback) => {
          const sessionData = {
            user: undefined,
            status: "not-logged",
            lastLogin: undefined,
            reLogin: false
          } as Session

          localStorage.setItem(storageKey, JSON.stringify(sessionData))

          setData(undefined)

          callback?.()
        }
      }}
    >
      {children}
    </SessionProviderContext.Provider>
  )
}

export const useSession = () => {
  const context = useContext(SessionProviderContext)

  if (context === undefined)
    throw new Error("useSession must be used within a SessionProvider")

  return context
}
