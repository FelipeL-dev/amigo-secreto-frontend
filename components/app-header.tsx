"use client";
import Link from "next/link";
import { Gift, LogOut, UserCircle } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  const { logout } = useAuth();
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Gift className="size-4" />
          </span>
          <span className="text-lg font-semibold">Amigo Secreto</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/perfil"
            className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            <UserCircle className="size-4" />
            Perfil
          </Link>

          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="size-4" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
