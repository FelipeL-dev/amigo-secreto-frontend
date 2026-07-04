"use client"

import { ArrowRight, Gift } from "lucide-react"
import type { Pessoa, ResultadoSorteio } from "@/lib/types"

export function ResultadosList({
  resultados,
  pessoas,
}: {
  resultados: ResultadoSorteio[]
  pessoas: Pessoa[]
}) {
  const nomePorId = new Map(pessoas.map((p) => [p.id, p.nome]))

  function nome(id: number) {
    return nomePorId.get(id) ?? `Pessoa #${id}`
  }

  if (resultados.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum resultado disponível ainda.
      </p>
    )
  }

  return (
    <ul className="space-y-2">
      {resultados.map((r) => (
        <li
          key={r.id}
          className="flex items-center gap-3 rounded-lg border bg-card p-3 text-sm"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Gift className="size-4" />
          </span>
          <span className="font-medium">{nome(r.sorteador_id)}</span>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
          <span className="font-medium text-primary">
            {nome(r.sorteado_id)}
          </span>
        </li>
      ))}
    </ul>
  )
}
