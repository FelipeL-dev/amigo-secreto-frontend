"use client"

import { useRouter } from "next/navigation"
import { ArrowRight, CalendarDays, CheckCircle2, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Grupo } from "@/lib/types"
import { formatDate } from "@/lib/format"

export function GrupoCard({ grupo }: { grupo: Grupo }) {
  const router = useRouter()

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-balance">{grupo.nome}</CardTitle>
          {grupo.sorteado ? (
            <Badge className="shrink-0 bg-accent text-accent-foreground hover:bg-accent">
              <CheckCircle2 className="size-3" />
              Sorteado
            </Badge>
          ) : (
            <Badge variant="secondary" className="shrink-0">
              <Clock className="size-3" />
              Pendente
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="size-4" />
          Criado em {formatDate(grupo.dataCriacao)}
        </p>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push(`/grupos/${grupo.id}`)}
        >
          Entrar no grupo
          <ArrowRight className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
