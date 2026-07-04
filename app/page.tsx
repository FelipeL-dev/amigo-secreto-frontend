"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Gift } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function Home() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    router.replace(isAuthenticated ? "/dashboard" : "/login")
  }, [isAuthenticated, loading, router])

  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Gift className="size-8 animate-pulse text-primary" />
        <p className="text-sm">Carregando...</p>
      </div>
    </div>
  )
}
