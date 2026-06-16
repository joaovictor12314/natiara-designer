"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUser } from "@/lib/users";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: ""
};

export function RegisterForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");

  function update(key: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
    setSuccess("");
  }

  function submit() {
    const nextErrors: Record<string, string> = {};

    if (form.name.trim().length < 3) nextErrors.name = "Informe o nome completo.";
    if (!form.email.includes("@")) nextErrors.email = "Informe um e-mail valido.";
    if (form.phone.trim().length < 10) nextErrors.phone = "Informe o telefone.";
    if (form.password.length < 8) nextErrors.password = "A senha deve ter pelo menos 8 caracteres.";
    if (form.confirmPassword !== form.password) nextErrors.confirmPassword = "As senhas nao conferem.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      const user = createUser({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        address: "Cadastro pelo site",
        city: "Goiania",
        role: "cliente"
      });
      setSuccess(`Cadastro de ${user.name} realizado com sucesso.`);
      setErrors({});
      setForm(initialForm);
    } catch (error) {
      setErrors({ email: error instanceof Error ? error.message : "Erro ao cadastrar." });
    }
  }

  return (
    <main className="container py-8">
      <section className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
              <UserPlus className="h-5 w-5" />
            </div>
            <CardTitle>Cadastro da cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field message={errors.name}>
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" value={form.name} onChange={(event) => update("name", event.target.value)} />
            </Field>
            <Field message={errors.email}>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} />
            </Field>
            <Field message={errors.phone}>
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" value={form.phone} onChange={(event) => update("phone", event.target.value)} />
            </Field>
            <Field message={errors.password}>
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value={form.password} onChange={(event) => update("password", event.target.value)} />
            </Field>
            <Field message={errors.confirmPassword}>
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={(event) => update("confirmPassword", event.target.value)}
              />
            </Field>

            {success ? (
              <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm text-primary">
                <CheckCircle2 className="h-4 w-4" />
                {success}
              </div>
            ) : null}

            <Button type="button" className="w-full" onClick={submit}>
              <UserPlus className="h-4 w-4" />
              Cadastrar
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Voltar para login</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function Field({ children, message }: { children: React.ReactNode; message?: string }) {
  return (
    <div className="space-y-2">
      {children}
      {message ? <p className="text-sm text-destructive">{message}</p> : null}
    </div>
  );
}
