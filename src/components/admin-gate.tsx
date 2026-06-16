"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppUser } from "@/lib/users";
import { AdminDashboard } from "@/components/admin-dashboard";

export function AdminGate() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("natiara-current-user");
    setUser(stored ? (JSON.parse(stored) as AppUser) : null);
    setChecked(true);
  }, []);

  if (!checked) {
    return null;
  }

  if (!user || user.role !== "admin") {
    return (
      <main className="container py-8">
        <section className="mx-auto max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Acesso administrativo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-muted-foreground">
                Entre pela aba Administrador para acessar o painel.
              </p>
              <Button asChild className="w-full">
                <Link href="/login">Ir para login</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  return <AdminDashboard />;
}
