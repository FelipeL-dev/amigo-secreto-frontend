"use client"

import { useState } from "react"
import { Loader2, Plus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { criarGrupo } from "@/lib/services"
import { getErrorMessage } from "@/lib/error"
import type { Grupo } from "@/lib/types"

export function CreateGrupoDialog({
  onCreated,
}: {
  onCreated: (grupo: Grupo) => void
}) {
  const [open, setOpen] = useState(false)
  const [nome, setNome] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim()) return
    setSubmitting(true)
    try {
      const grupo = await criarGrupo(nome.trim())
      toast.success("Grupo criado com sucesso!")
      onCreated(grupo)
      setNome("")
      setOpen(false)
    } catch (err) {
      toast.error(getErrorMessage(err, "Não foi possível criar o grupo."))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="size-4" />
            Novo grupo
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar novo grupo</DialogTitle>
          <DialogDescription>
            Dê um nome para o seu grupo de amigo secreto.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome-grupo">Nome do grupo</Label>
            <Input
              id="nome-grupo"
              placeholder="Ex: Amigos do trabalho"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoFocus
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="size-4 animate-spin" />}
              Criar grupo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
