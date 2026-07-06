"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Gift } from "lucide-react"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"
import { AppHeader } from "@/components/app-header"
import { entrarNoGrupo } from "@/lib/services"
import { getErrorMessage } from "@/lib/error"

function EntrarContent({ token }: { token: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    entrarNoGrupo(token)
      .then(() => {
        toast.success("Você entrou no grupo!")
        router.push("/dashboard")
      })
      .catch((err) => {
        toast.error(getErrorMessage(err, "Convite inválido ou expirado."))
        router.push("/dashboard")
      })
      .finally(() => setLoading(false))
  }, [token, router])

  return (
    <div className="min-h-svh bg-muted/40">
      <AppHeader />
      <main className="mx-auto flex max-w-5xl flex-col items-center justify-center px-4 py-20 gap-4 text-muted-foreground">
        <Gift className="size-10 text-primary" />
        {loading && (
          <>
            <Loader2 className="size-6 animate-spin" />
            <p className="text-sm">Entrando no grupo...</p>
          </>
        )}
      </main>
    </div>
  )
}

export default function EntrarPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = use(params)
  return (
    <AuthGuard>
      <EntrarContent token={token} />
    </AuthGuard>
  )
}