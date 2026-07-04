"use client"

import useSWR from "swr"
import { Gift, Loader2, Users } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { AppHeader } from "@/components/app-header"
import { CreateGrupoDialog } from "@/components/create-grupo-dialog"
import { GrupoCard } from "@/components/grupo-card"
import { getMeusGrupos } from "@/lib/services"
import type { Grupo } from "@/lib/types"

function DashboardContent() {
  const { data, error, isLoading, mutate } = useSWR<Grupo[]>(
    "meus-grupos",
    getMeusGrupos,
  )

  function handleCreated(grupo: Grupo) {
    mutate((prev) => [...(prev ?? []), grupo], { revalidate: true })
  }

  return (
    <div className="min-h-svh bg-muted/40">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Meus grupos</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie seus grupos de amigo secreto
            </p>
          </div>
          <CreateGrupoDialog onCreated={handleCreated} />
        </div>

        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            Carregando grupos...
          </div>
        )}

        {error && !isLoading && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
            Não foi possível carregar seus grupos. Verifique sua conexão com a
            API.
          </div>
        )}

        {!isLoading && !error && data && data.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-20 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Users className="size-6" />
            </span>
            <div>
              <p className="font-medium">Você ainda não tem grupos</p>
              <p className="text-sm text-muted-foreground">
                Crie seu primeiro grupo para começar.
              </p>
            </div>
          </div>
        )}

        {!isLoading && !error && data && data.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((grupo) => (
              <GrupoCard key={grupo.id} grupo={grupo} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
