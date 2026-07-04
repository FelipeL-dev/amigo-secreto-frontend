"use client";

import { useState } from "react";
import useSWR from "swr";
import { CheckCircle2, Loader2, Play, Shuffle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResultadosList } from "@/components/resultados-list";
import {
  criarSorteio,
  finalizarSorteio,
  getResultadosDoSorteio,
  getSorteios,
  realizarSorteio,
} from "@/lib/services";
import { getErrorMessage } from "@/lib/error";
import { formatDateTime } from "@/lib/format";
import type { Pessoa, Sorteio } from "@/lib/types";

// Busca o sorteio associado a este grupo (a API não expõe /sorteios por grupo,
// então filtramos a lista completa).
async function fetchSorteioDoGrupo(grupoId: number): Promise<Sorteio | null> {
  const sorteios = await getSorteios();
  const doGrupo = sorteios.filter((s) => s.grupoId === grupoId);
  if (doGrupo.length === 0) return null;
  // Usa o mais recente (maior id)
  return doGrupo.reduce((a, b) => (a.id > b.id ? a : b));
}

function isFinalizado(status?: string) {
  return (status ?? "").toUpperCase().includes("FINAL");
}

function isRealizado(status?: string) {
  const s = (status ?? "").toUpperCase();
  return s.includes("REALIZ") || s.includes("SORTEAD") || isFinalizado(s);
}

export function SorteioPanel({
  grupoId,
  pessoas,
}: {
  grupoId: number;
  pessoas: Pessoa[];
}) {
  const {
    data: sorteio,
    isLoading,
    mutate,
  } = useSWR<Sorteio | null>(["sorteio-grupo", grupoId], () =>
    fetchSorteioDoGrupo(grupoId),
  );

  const { data: resultados, mutate: mutateResultados } = useSWR(
    sorteio ? ["resultados", sorteio.id] : null,
    () => getResultadosDoSorteio(sorteio!.id),
  );

  const [acting, setActing] = useState<string | null>(null);

  async function run<T>(
    key: string,
    fn: () => Promise<T>,
    successMsg: string,
    fallbackMsg: string,
  ) {
    setActing(key);
    try {
      await fn();
      toast.success(successMsg);
      await mutate();
      await mutateResultados();
    } catch (err) {
      toast.error(getErrorMessage(err, fallbackMsg));
    } finally {
      setActing(null);
    }
  }

  const realizado = isRealizado(sorteio?.status);
  const finalizado = isFinalizado(sorteio?.status);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <CardTitle>Sorteio</CardTitle>
          </div>
          {sorteio && (
            <Badge variant={finalizado ? "default" : "secondary"}>
              {sorteio.status}
            </Badge>
          )}
        </div>
        <CardDescription>
          {sorteio
            ? `Criado em ${formatDateTime(sorteio.dataSorteio)}`
            : "Nenhum sorteio criado para este grupo ainda."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Carregando sorteio...
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-3">
              {!sorteio && (
                <Button
                  disabled={acting !== null || pessoas.length < 2}
                  onClick={() =>
                    run(
                      "criar",
                      () => criarSorteio(grupoId),
                      "Sorteio criado!",
                      "Não foi possível criar o sorteio.",
                    )
                  }
                >
                  {acting === "criar" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                  Criar sorteio
                </Button>
              )}

              {sorteio && !realizado && (
                <Button
                  disabled={acting !== null}
                  onClick={() =>
                    run(
                      "realizar",
                      () => realizarSorteio(sorteio.id),
                      "Sorteio realizado!",
                      "Não foi possível realizar o sorteio.",
                    )
                  }
                >
                  {acting === "realizar" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Shuffle className="size-4" />
                  )}
                  Realizar sorteio
                </Button>
              )}

              {sorteio && realizado && !finalizado && (
                <Button
                  variant="outline"
                  disabled={acting !== null}
                  onClick={() =>
                    run(
                      "finalizar",
                      () => finalizarSorteio(sorteio.id),
                      "Sorteio finalizado!",
                      "Não foi possível finalizar o sorteio.",
                    )
                  }
                >
                  {acting === "finalizar" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="size-4" />
                  )}
                  Finalizar sorteio
                </Button>
              )}
            </div>

            {!sorteio && pessoas.length < 2 && (
              <p className="text-sm text-muted-foreground">
                Adicione pelo menos 2 pessoas ao grupo para criar um sorteio.
              </p>
            )}

            {sorteio && (
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-medium">
                  <Play className="size-4 text-primary" />
                  Resultados
                </h3>
                {realizado ? (
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-muted p-4 text-sm text-muted-foreground">
                    <CheckCircle2 className="size-4 shrink-0 text-primary" />
                    <span>
                      O sorteio foi realizado! Cada participante recebeu o
                      resultado por email. 🎁
                    </span>
                  </div>
                ) : (
                  <ResultadosList
                    resultados={resultados ?? []}
                    pessoas={pessoas}
                  />
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
