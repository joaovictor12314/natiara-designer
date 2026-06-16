"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser, type AppUser } from "@/lib/users";
import { cn } from "@/lib/utils";

type LoginTab = "cliente" | "admin";

export function LoginForm() {
  const router = useRouter();
  const [tab, setTab] = useState<LoginTab>("cliente");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function changeTab(nextTab: LoginTab) {
    setTab(nextTab);
    setError("");
    setEmail("");
    setPassword("");
  }

  async function submit() {
    try {
      if (tab === "admin") {
        const response = await fetch("/api/auth/admin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        });
        const data = (await response.json()) as { message?: string; user?: AppUser };

        if (!response.ok || !data.user) {
          setError(data.message || "Nao foi possivel entrar como administrador.");
          return;
        }

        window.localStorage.setItem("natiara-current-user", JSON.stringify(data.user));
        router.push("/admin");
        return;
      }

      const user = loginUser({ email, password });

      if (tab === "cliente" && user.role === "admin") {
        setError("Use a aba Administrador para este usuario.");
        return;
      }

      router.push("/agendamento");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nao foi possivel entrar.");
    }
  }

  return (
    <main className="container py-8">
      <section className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
              <TabButton active={tab === "cliente" } onClick={() => changeTab("cliente")}>
                Cliente
              </TabButton>
              <TabButton active={tab === "admin"} onClick={() => changeTab("admin")}>
                Administrador
              </TabButton>
            </div>
            <CardTitle className="pt-3">
              {tab === "cliente" ? "Acesso da cliente" : "Acesso administrativo"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button className="w-full" type="button" onClick={submit}>
              <Mail className="h-4 w-4" />
              {tab === "cliente" ? "Entrar" : "Entrar como admin"}
            </Button>

            {tab === "cliente" ? (
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <Link href="/cadastro" className="hover:text-foreground">
                  Criar cadastro
                </Link>
                <Link href="/login" className="hover:text-foreground">
                  Recuperar senha
                </Link>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function TabButton({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "focus-ring rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition",
        active && "bg-card text-foreground shadow-sm"
      )}
    >
      {children}
    </button>
  );
}
