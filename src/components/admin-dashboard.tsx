"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Edit3,
  Plus,
  Scissors,
  ShieldCheck,
  UsersRound
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/metric-card";
import { requirements, riskMatrix, services, testPlan } from "@/lib/data";
import { createSampleAppointment, describeAppointmentServices, listDashboardData } from "@/lib/mock-api";
import { formatCurrency } from "@/lib/pricing";

export function AdminDashboard() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: listDashboardData
  });

  const mutation = useMutation({
    mutationFn: createSampleAppointment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dashboard"] })
  });

  const appointments = data?.appointments ?? [];
  const todayKey = new Date().toISOString().slice(0, 10);
  const todaysAppointments = appointments.filter((appointment) =>
    appointment.scheduledAt.startsWith(todayKey)
  ).length;
  const pendingPayments = appointments.filter((appointment) => appointment.status === "pendente").length;

  return (
    <main className="container space-y-6 py-6">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold leading-tight">Painel administrativo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie agenda, servicos, pagamentos e informacoes do projeto.
          </p>
        </div>
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          <Plus className="h-4 w-4" />
          Inserir atendimento
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Agendamentos de hoje"
          value={String(todaysAppointments)}
          detail="Atendimentos marcados para hoje"
          icon={CalendarCheck}
        />
        <MetricCard
          label="Servicos ativos"
          value={String(services.length)}
          detail="Disponiveis para agendamento"
          icon={Scissors}
        />
        <MetricCard
          label="Clientes cadastrados"
          value={String(data?.metrics.clients ?? 0)}
          detail="Clientes na base inicial"
          icon={UsersRound}
        />
        <MetricCard
          label="Pagamentos pendentes"
          value={String(pendingPayments)}
          detail="Aguardando confirmacao"
          icon={CreditCard}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Proximos agendamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <TableHead>Cliente</TableHead>
                    <TableHead>Servico</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Horario</TableHead>
                    <TableHead>Status</TableHead>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => {
                    const scheduledAt = new Date(appointment.scheduledAt);

                    return (
                      <tr key={appointment.id}>
                        <TableCell className="font-medium">{appointment.customerName}</TableCell>
                        <TableCell>{describeAppointmentServices(appointment.serviceIds)}</TableCell>
                        <TableCell>{scheduledAt.toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>
                          {scheduledAt.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge variant={appointment.status === "confirmado" ? "default" : "secondary"}>
                            {appointment.status}
                          </Badge>
                        </TableCell>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Servicos cadastrados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {services.map((service) => (
              <div key={service.id} className="rounded-lg border bg-background p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{service.description}</p>
                    <p className="mt-2 text-sm font-semibold">{formatCurrency(service.price)}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit3 className="h-4 w-4" />
                    Editar
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Rastreabilidade do projeto</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-4">
            <TraceSummary
              icon={ClipboardList}
              label="Requisitos"
              value={String(requirements.length)}
              detail="Funcionais e nao funcionais"
            />
            <TraceSummary
              icon={CheckCircle2}
              label="Testes"
              value={String(testPlan.length)}
              detail="Plano ISO/IEC 29119"
            />
            <TraceSummary icon={ShieldCheck} label="Aprovacao" value="100%" detail="Requisitos validados" />
            <TraceSummary
              icon={AlertTriangle}
              label="Riscos"
              value={String(riskMatrix.length)}
              detail="Matriz ISO 31000"
            />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <ProjectList
          title="Requisitos"
          items={requirements.map((requirement) => ({
            key: requirement.code,
            label: requirement.code,
            text: requirement.title,
            badge: requirement.priority
          }))}
        />
        <ProjectList
          title="Testes"
          items={testPlan.map((test) => ({
            key: test.id,
            label: test.id,
            text: test.scenario,
            badge: test.requirement
          }))}
        />
        <ProjectList
          title="Riscos"
          items={riskMatrix.map((risk) => ({
            key: risk.risk,
            label: risk.risk,
            text: risk.treatment,
            badge: risk.impact
          }))}
        />
      </section>
    </main>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return <th className="border-b px-3 py-3 font-medium">{children}</th>;
}

function TableCell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`border-b px-3 py-4 align-middle ${className}`}>{children}</td>;
}

function TraceSummary({
  detail,
  icon: Icon,
  label,
  value
}: {
  detail: string;
  icon: typeof ClipboardList;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-primary">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function ProjectList({
  items,
  title
}: {
  title: string;
  items: Array<{ key: string; label: string; text: string; badge: string }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.key} className="rounded-lg border bg-background p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
              </div>
              <Badge variant="outline">{item.badge}</Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
