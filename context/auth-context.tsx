"use client"

import { useRouter } from "next/navigation"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { setOnAuthFailure } from "@/lib/api"
import { clearTokens, getAccessToken, setTokens } from "@/lib/auth-tokens"
import * as services from "@/lib/services"
import type { LoginRequest, RegisterRequest } from "@/lib/types"

interface AuthContextValue {
  isAuthenticated: boolean
  loading: boolean
  login: (payload: LoginRequest) => Promise<void>
  register: (payload: RegisterRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    clearTokens()
    setIsAuthenticated(false)
    router.push("/login")
  }, [router])

  // Sincroniza estado inicial e reage a falhas de autenticação vindas do axios
  useEffect(() => {
    setIsAuthenticated(!!getAccessToken())
    setLoading(false)

    setOnAuthFailure(() => {
      clearTokens()
      setIsAuthenticated(false)
      router.push("/login")
    })

    return () => setOnAuthFailure(null)
  }, [router])

  const login = useCallback(async (payload: LoginRequest) => {
    const data = await services.login(payload)
    setTokens(data.token, data.refreshToken)
    setIsAuthenticated(true)
  }, [])

  const register = useCallback(async (payload: RegisterRequest) => {
    const data = await services.register(payload)
    setTokens(data.token, data.refreshToken)
    setIsAuthenticated(true)
  }, [])

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return ctx
}
