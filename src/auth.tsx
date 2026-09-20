import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

/**
 * Prototype-only auth. There is no server and no real credential check —
 * one seeded demo account, matched in the browser. Nothing here is security.
 */
export const DEMO = {
  ashaId: 'KL-PKD-04-2291',
  password: 'demo1234',
}

const KEY = 'asha.auth'

function read(): boolean {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

type Ctx = {
  signedIn: boolean
  signIn: () => void
  signOut: () => void
  /** Returns false when the credentials do not match the demo account. */
  attempt: (ashaId: string, password: string) => boolean
}

const AuthContext = createContext<Ctx>({
  signedIn: false,
  signIn: () => {},
  signOut: () => {},
  attempt: () => false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(read)

  const write = (v: boolean) => {
    setSignedIn(v)
    try {
      v ? localStorage.setItem(KEY, '1') : localStorage.removeItem(KEY)
    } catch {
      /* storage can be blocked; the session still works in memory */
    }
  }

  const value = useMemo<Ctx>(
    () => ({
      signedIn,
      signIn: () => write(true),
      signOut: () => write(false),
      attempt: (ashaId, password) => {
        const ok =
          ashaId.trim().toUpperCase() === DEMO.ashaId && password === DEMO.password
        if (ok) write(true)
        return ok
      },
    }),
    [signedIn],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
