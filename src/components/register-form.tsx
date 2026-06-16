"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userRegistrationSchema, verificationCodeSchema } from "@/lib/schemas";
import { createUser } from "@/lib/users";

const PROTOTYPE_VERIFICATION_CODE = "123456";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  password: "",
  confirmPassword: "",
  verificationCode: ""
};

type RegisterFormState = typeof initialForm;

export function RegisterForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");
  const [codeConfirmed, setCodeConfirmed] = useState(false);

  function update(key: keyof RegisterFormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
    setSuccess("");

    if (key === "verificationCode") {
      setCodeConfirmed(false);
    }
  }

  function validateRegistration() {
    const parsed = userRegistrationSchema.safeParse({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      password: form.password,
      role: "cliente"
    });
    const nextErrors: Record<string, string> = {};

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      Object.entries(fieldErrors).forEach(([field, messages]) => {
        if (messages?.[0]) {
          nextErrors[field] = messages[0];
        }
      });
    }

    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "As senhas nao conferem.";
    }

    return {
      data: parsed.success ? parsed.data : null,
      errors: nextErrors
    };
  }

  function validateVerificationCode() {
    const parsed = verificationCodeSchema.safeParse(form.verificationCode.trim());

    if (!parsed.success) {
      return parsed.error.flatten().formErrors[0] || "Informe um codigo de 6 digitos.";
    }

    if (parsed.data !== PROTOTYPE_VERIFICATION_CODE) {
      return "Codigo de verificacao incorreto.";
    }

    return "";
  }

  function confirmCode() {
    const codeError = validateVerificationCode();

    if (codeError) {
      setCodeConfirmed(false);
      setErrors((current) => ({ ...current, verificationCode: codeError }));
      return;
    }

    setCodeConfirmed(true);
    setErrors((current) => ({ ...current, verificationCode: "" }));
  }

  function submit() {
    setSuccess("");

    const validation = validateRegistration();
    const nextErrors = { ...validation.errors };
    const codeError = validateVerificationCode();

    if (codeError) {
      nextErrors.verificationCode = codeError;
    } else if (!codeConfirmed) {
      nextErrors.verificationCode = "Confirme o codigo de verificacao antes de cadastrar.";
    }

    if (Object.keys(nextErrors).length > 0 || !validation.data) {
      setErrors(nextErrors);
      return;
    }

    try {
      const user = createUser(validation.data);

      setSuccess(`Cadastro de ${user.name} realizado com sucesso.`);
      setErrors({});
      setForm(initialForm);
      setCodeConfirmed(false);
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
            <Field message={errors.address}>
              <Label htmlFor="address">Endereco completo</Label>
              <Input id="address" value={form.address} onChange={(event) => update("address", event.target.value)} />
            </Field>
            <Field message={errors.city}>
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" value={form.city} onChange={(event) => update("city", event.target.value)} />
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
            <Field message={errors.verificationCode}>
              <Label htmlFor="verificationCode">Codigo de verificacao</Label>
              <div className="flex gap-2">
                <Input
                  id="verificationCode"
                  inputMode="numeric"
                  maxLength={6}
                  value={form.verificationCode}
                  onChange={(event) => update("verificationCode", event.target.value)}
                />
                <Button type="button" variant="outline" onClick={confirmCode}>
                  Confirmar
                </Button>
              </div>
            </Field>

            {codeConfirmed ? (
              <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm text-primary">
                <CheckCircle2 className="h-4 w-4" />
                Codigo confirmado.
              </div>
            ) : null}

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
