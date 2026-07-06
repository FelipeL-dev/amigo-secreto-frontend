"use client";

import { use, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  LinkIcon,
  Pencil,
  Users,
  X,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { AuthGuard } from "@/components/auth-guard";
import { AppHeader } from "@/components/app-header";
import { SorteioPanel } from "@/components/sorteio-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateGrupo, gerarConvite, getGrupo, getPessoasDoGrupo } from "@/lib/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { Grupo, Pessoa } from "@/lib/types";

function GrupoContent({ id }: { id: number }) {
  const [editando, setEditando] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [gerandoConvite, setGerandoConvite] = useState(false);

  const { data: grupo, isLoading: loadingGrupo, mutate: mutateGrupo } = useSWR<Grupo>(
    ["grupo", id],
    () => getGrupo(id),
  );

  const { data: pessoas, isLoading: loadingPessoas } = useSWR<Pessoa[]>(
    ["pessoas-grupo", id],
    () => getPessoasDoGrupo(id),
  );

  async function salvarNome() {
    try {
      await updateGrupo(id, novoNome);
      toast.success("Grupo atualizado!");
      await mutateGrupo();
      setEditando(false);
    } catch {
      toast.error("Não foi possível atualizar o grupo.");
    }
  }

  async function handleGerarConvite() {
    setGerandoConvite(true);
    try {
      const link = await gerarConvite(id);
      await navigator.clipboard.writeText(link);
      toast.success("Link copiado para a área de transferência!");
    } catch {
      toast.error("Não foi possível gerar o convite.");
    } finally {
      setGerandoConvite(false);
    }
  }

  return (
    <div className="min-h-svh bg-muted/40">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          render={
            <Link href="/dashboard">
              <ArrowLeft className="size-4" />
              Voltar
            </Link>
          }
        />

        {loadingGrupo ? (
          <div className="flex items-center gap-2 py-20 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            Carregando grupo...
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                {editando ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={novoNome}
                      onChange={(e) => setNovoNome(e.target.value)}
                      className="text-2xl font-semibold h-auto py-1"
                      autoFocus
                    />
                    <Button size="icon" variant="ghost" onClick={salvarNome}>
                      <Check className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditando(false)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold text-balance">
                      {grupo?.nome ?? "Grupo"}
                    </h1>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setNovoNome(grupo?.nome ?? "");
                        setEditando(true);
                      }}
                    >
                      <Pencil className="size-4" />
                    </Button>
                  </div>
                )}
                {grupo && (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="size-4" />
                    Criado em {formatDate(grupo.dataCriacao)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {grupo &&
                  (grupo.sorteado ? (
                    <Badge className="bg-accent text-accent-foreground hover:bg-accent">
                      <CheckCircle2 className="size-3" />
                      Sorteado
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Clock className="size-3" />
                      Pendente
                    </Badge>
                  ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGerarConvite}
                  disabled={gerandoConvite}
                >
                  {gerandoConvite ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <LinkIcon className="size-4" />
                  )}
                  Convidar
                </Button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users className="size-5 text-primary" />
                    <CardTitle>
                      Pessoas {pessoas ? `(${pessoas.length})` : ""}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingPessoas ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />
                      Carregando pessoas...
                    </div>
                  ) : pessoas && pessoas.length > 0 ? (
                    <ul className="space-y-2">
                      {pessoas.map((pessoa) => (
                        <li
                          key={pessoa.id}
                          className="flex items-center gap-3 rounded-lg border bg-card p-3"
                        >
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                            {pessoa.nome?.charAt(0).toUpperCase() ?? "?"}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {pessoa.nome}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {pessoa.email}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma pessoa neste grupo ainda.
                    </p>
                  )}
                </CardContent>
              </Card>

              <SorteioPanel grupoId={id} pessoas={pessoas ?? []} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function GrupoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <AuthGuard>
      <GrupoContent id={Number(id)} />
    </AuthGuard>
  );
}