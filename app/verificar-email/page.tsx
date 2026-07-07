"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, Suspense } from "react"
import { Gift, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getErrorMessage } from "@/lib/error"
import { verificarEmail, reenviarVerificacao } from "@/lib/services"

function VerificarEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") ?? ""

  const [codigo, setCodigo] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [reenviando, setReenviando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await verificarEmail(codigo)
      toast.success("Email verificado com sucesso!")
      router.push("/login")
    } catch (err) {
      toast.error(getErrorMessage(err, "Código inválido ou expirado."))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleReenviar() {
    setReenviando(true)
    try {
      await reenviarVerificacao(email)
      toast.success("Novo código enviado!")
    } catch (err) {
      toast.error(getErrorMessage(err, "Não foi possível reenviar o código."))
    } finally {
      setReenviando(false)
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Gift className="size-6" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl">Verifique seu email</CardTitle>
            <CardDescription>
              Enviamos um código de 6 dígitos para {email || "seu email"}. Digite-o abaixo para ativar sua conta.
            </CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código de verificação</Label>
              <Input
                id="codigo"
                type="text"
                placeholder="000000"
                maxLength={6}
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="mt-6 flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="size-4 animate-spin" />}
              Verificar
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              disabled={reenviando || !email}
              onClick={handleReenviar}
            >
              {reenviando && <Loader2 className="size-4 animate-spin" />}
              Reenviar código
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}

export default function VerificarEmailPage() {
  return (
    <Suspense>
      <VerificarEmailContent />
    </Suspense>
  )
}