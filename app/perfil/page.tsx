"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Gift, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthGuard } from "@/components/auth-guard";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/lib/error";
import { getMe, updateMe } from "@/lib/services";
import { setTokens } from "@/lib/auth-tokens";

function PerfilContent() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getMe()
      .then((data) => {
        setNome(data.nome);
        setEmail(data.email);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await updateMe({ nome, email });
      setTokens(data.token, data.refreshToken);
      toast.success("Perfil atualizado!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(getErrorMessage(err, "Não foi possível atualizar o perfil."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-svh bg-muted/40">
      <AppHeader />
      <main className="mx-auto flex max-w-md flex-col px-4 py-8">
        <Card>
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Gift className="size-6" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl">Meu Perfil</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais
              </CardDescription>
            </div>
          </CardHeader>
          {loading ? (
            <CardContent className="flex justify-center py-8">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Seu nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="voce@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="mt-6">
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="size-4 animate-spin" />}
                  Salvar alterações
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </main>
    </div>
  );
}

export default function PerfilPage() {
  return (
    <AuthGuard>
      <PerfilContent />
    </AuthGuard>
  );
}
