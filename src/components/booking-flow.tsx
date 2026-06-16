"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  MapPin,
  Receipt,
  Route,
  Scissors,
  UserRound
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { services } from "@/lib/data";
import { createAppointment, previewBookingTotal } from "@/lib/mock-api";
import { DISPLACEMENT_THRESHOLD_KM, formatCurrency } from "@/lib/pricing";
import { bookingSchema, type BookingInput } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const steps = [
  { title: "Serviços", icon: Scissors },
  { title: "Dados", icon: UserRound },
  { title: "Endereco", icon: MapPin },
  { title: "Pagamento", icon: CreditCard }
];

const stepFields: Array<Array<keyof BookingInput>> = [
  ["serviceIds"],
  ["name", "phone", "email", "city"],
  ["address", "distanceKm", "scheduledAt"],
  ["serviceIds", "name", "phone", "email", "city", "address", "distanceKm", "scheduledAt", "paymentMethod"]
];

const defaultForm: BookingInput = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "Goiania",
  serviceIds: [],
  scheduledAt: "",
  distanceKm: 0,
  paymentMethod: "pix"
};

export function BookingFlow() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<BookingInput>(defaultForm);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const totals = useMemo(
    () => previewBookingTotal(form.serviceIds, Number(form.distanceKm) || 0),
    [form.distanceKm, form.serviceIds]
  );
  const selectedServices = useMemo(
    () => services.filter((service) => form.serviceIds.includes(service.id)),
    [form.serviceIds]
  );

  const mutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: (appointment) => {
      setConfirmedId(appointment.id);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });

  function update<K extends keyof BookingInput>(key: K, value: BookingInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  function updateSchedule(nextDate: string, nextTime: string) {
    setDate(nextDate);
    setTime(nextTime);
    update("scheduledAt", nextDate && nextTime ? `${nextDate}T${nextTime}` : "");
  }

  function toggleService(serviceId: string) {
    setForm((current) => {
      const exists = current.serviceIds.includes(serviceId);
      const nextServiceIds = exists
        ? current.serviceIds.filter((id) => id !== serviceId)
        : [...current.serviceIds, serviceId];

      return { ...current, serviceIds: nextServiceIds };
    });
    setErrors((current) => ({ ...current, serviceIds: "" }));
  }

  function validateStep(currentStep: number) {
    const parsed = bookingSchema.safeParse(form);

    if (parsed.success) {
      setErrors({});
      return true;
    }

    const relevantFields = stepFields[currentStep];
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const visibleErrors = Object.fromEntries(
      relevantFields
        .map((field) => [field, fieldErrors[field]?.[0]])
        .filter(([, message]) => Boolean(message))
    ) as Record<string, string>;

    setErrors(visibleErrors);
    return Object.keys(visibleErrors).length === 0;
  }

  function nextStep() {
    if (step === 0 && form.serviceIds.length === 0) {
      setErrors({ serviceIds: "Selecione pelo menos um serviço para continuar." });
      return;
    }

    if (!validateStep(step)) {
      return;
    }

    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 0));
  }

  function submitBooking() {
    if (!validateStep(3)) {
      return;
    }

    const parsed = bookingSchema.parse(form);
    mutation.mutate(parsed);
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="grid gap-0 p-0 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6 p-5 md:p-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-primary">Etapa {step + 1} de 4</p>
                <h2 className="mt-1 text-2xl font-semibold leading-tight">{steps[step].title}</h2>
              </div>
              <Badge variant="outline">
                <Route className="mr-1 h-3.5 w-3.5" />
                Taxa a partir de {DISPLACEMENT_THRESHOLD_KM} km
              </Badge>
            </div>

            <div className="grid gap-2 sm:grid-cols-4">
              {steps.map((item, index) => (
                <StepPill key={item.title} active={index === step} done={index < step} icon={item.icon} title={item.title} />
              ))}
            </div>
          </div>

          <div key={step}>
            {step === 0 ? (
              <ServiceStep selectedIds={form.serviceIds} onToggle={toggleService} error={errors.serviceIds} />
            ) : null}

            {step === 1 ? (
              <CustomerStep form={form} errors={errors} update={update} />
            ) : null}

            {step === 2 ? (
              <AddressStep
                form={form}
                date={date}
                time={time}
                errors={errors}
                update={update}
                updateSchedule={updateSchedule}
              />
            ) : null}

            {step === 3 ? (
              <PaymentStep paymentMethod={form.paymentMethod} update={update} />
            ) : null}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-between">
            <Button type="button" variant="outline" onClick={previousStep} disabled={step === 0}>
              Voltar
            </Button>

            {step < 3 ? (
              <Button type="button" onClick={nextStep}>
                Continuar
              </Button>
            ) : (
              <Button type="button" onClick={submitBooking} disabled={mutation.isPending}>
                <CalendarDays className="h-4 w-4" />
                {mutation.isPending ? "Confirmando..." : "Confirmar agendamento"}
              </Button>
            )}
          </div>
        </div>

        <aside className="border-t bg-muted/35 p-5 lg:border-l lg:border-t-0">
          <div className="sticky top-28 space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Resumo</h3>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Atualizado conforme a selecao.</p>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <div className="mb-3 space-y-2">
                {selectedServices.length > 0 ? (
                  selectedServices.map((service) => (
                    <div key={service.id} className="flex items-start justify-between gap-3 text-sm">
                      <span className="text-muted-foreground">{service.name}</span>
                      <span className="font-medium">{formatCurrency(service.price)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhum serviço selecionado.
                  </p>
                )}
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <SummaryRow label="Serviços" value={formatCurrency(totals.subtotal)} />
                <SummaryRow label="Deslocamento" value={formatCurrency(totals.displacementFee)} />
                <Separator />
                <SummaryRow label="Total" value={formatCurrency(totals.total)} strong />
              </div>
            </div>

            {confirmedId ? (
              <div className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm">
                <p className="font-medium text-primary">Agendamento confirmado</p>
                <p className="mt-1 text-muted-foreground">Protocolo {confirmedId}</p>
              </div>
            ) : null}
          </div>
        </aside>
      </CardContent>
    </Card>
  );
}

function ServiceStep({
  selectedIds,
  onToggle,
  error
}: {
  selectedIds: string[];
  onToggle: (serviceId: string) => void;
  error?: string;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Escolha seu serviço</h3>
        <p className="mt-1 text-sm text-muted-foreground">Você pode selecionar mais de um atendimento.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {services.map((service) => {
          const selected = selectedIds.includes(service.id);

          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onToggle(service.id)}
              aria-pressed={selected}
              className={cn(
                "focus-ring flex min-h-52 cursor-pointer flex-col rounded-lg border bg-card p-5 text-left transition hover:border-primary/60 hover:shadow-soft",
                selected && "border-primary bg-primary/10 shadow-soft"
              )}
            >
              <span>
                <span className="block text-base font-semibold leading-6">{service.name}</span>
                <span className="mt-3 block text-sm leading-6 text-muted-foreground">
                  {service.description}
                </span>
              </span>
              <span className="mt-auto flex items-center justify-between gap-3 pt-5">
                <span className="text-lg font-semibold">{formatCurrency(service.price)}</span>
                <span
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm font-medium",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-background text-foreground"
                  )}
                >
                  {selected ? "Selecionado" : "Selecionar"}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </section>
  );
}

function CustomerStep({
  form,
  errors,
  update
}: {
  form: BookingInput;
  errors: Record<string, string>;
  update: <K extends keyof BookingInput>(key: K, value: BookingInput[K]) => void;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Dados do cliente</h3>
        <p className="mt-1 text-sm text-muted-foreground">Esses dados serao usados para confirmar o atendimento.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FieldError message={errors.name}>
          <Label htmlFor="name">Nome completo</Label>
          <Input id="name" value={form.name} onChange={(event) => update("name", event.target.value)} />
        </FieldError>
        <FieldError message={errors.phone}>
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" value={form.phone} onChange={(event) => update("phone", event.target.value)} />
        </FieldError>
        <FieldError message={errors.email}>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
          />
        </FieldError>
        <FieldError message={errors.city}>
          <Label htmlFor="city">Cidade</Label>
          <Input id="city" value={form.city} onChange={(event) => update("city", event.target.value)} />
        </FieldError>
      </div>
    </section>
  );
}

function AddressStep({
  form,
  date,
  time,
  errors,
  update,
  updateSchedule
}: {
  form: BookingInput;
  date: string;
  time: string;
  errors: Record<string, string>;
  update: <K extends keyof BookingInput>(key: K, value: BookingInput[K]) => void;
  updateSchedule: (nextDate: string, nextTime: string) => void;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Endereco e horario</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Taxa de deslocamento aplicada a partir de {DISPLACEMENT_THRESHOLD_KM} km.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <FieldError message={errors.address}>
            <Label htmlFor="address">Endereco completo</Label>
            <Input id="address" value={form.address} onChange={(event) => update("address", event.target.value)} />
          </FieldError>
        </div>
        <FieldError message={errors.distanceKm}>
          <Label htmlFor="distance">Distancia estimada</Label>
          <Input
            id="distance"
            type="number"
            min="0"
            step="0.1"
            value={form.distanceKm}
            onChange={(event) => update("distanceKm", Number(event.target.value))}
          />
        </FieldError>
        <FieldError message={errors.scheduledAt}>
          <Label htmlFor="date">Data</Label>
          <Input id="date" type="date" value={date} onChange={(event) => updateSchedule(event.target.value, time)} />
        </FieldError>
        <FieldError message={errors.scheduledAt}>
          <Label htmlFor="time">Horario</Label>
          <Input id="time" type="time" value={time} onChange={(event) => updateSchedule(date, event.target.value)} />
        </FieldError>
      </div>
    </section>
  );
}

function PaymentStep({
  paymentMethod,
  update
}: {
  paymentMethod: BookingInput["paymentMethod"];
  update: <K extends keyof BookingInput>(key: K, value: BookingInput[K]) => void;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Pagamento e confirmacao</h3>
        <p className="mt-1 text-sm text-muted-foreground">Escolha a forma de pagamento e confirme o agendamento.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {[
          ["pix", "Pix"],
          ["credito", "Cartao de credito"],
          ["debito", "Cartao de debito"]
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => update("paymentMethod", value as BookingInput["paymentMethod"])}
            className={cn(
              "focus-ring flex min-h-20 items-center justify-between rounded-lg border bg-background p-4 text-left text-sm",
              paymentMethod === value && "border-primary bg-primary/10"
            )}
            aria-pressed={paymentMethod === value}
          >
            <span className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              {label}
            </span>
            {paymentMethod === value ? <CheckCircle2 className="h-5 w-5 text-primary" /> : null}
          </button>
        ))}
      </div>
    </section>
  );
}

function StepPill({
  active,
  done,
  icon: Icon,
  title
}: {
  active: boolean;
  done: boolean;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-12 items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground",
        active && "border-primary bg-primary/10 text-foreground",
        done && "border-primary/40 text-foreground"
      )}
    >
      {done ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Icon className="h-4 w-4" />}
      <span className="truncate">{title}</span>
    </div>
  );
}

function FieldError({ children, message }: { children: React.ReactNode; message?: string }) {
  return (
    <div className="space-y-2">
      {children}
      {message ? <p className="text-sm text-destructive">{message}</p> : null}
    </div>
  );
}

function SummaryRow({
  label,
  value,
  strong = false
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-3", strong && "text-base font-semibold")}>
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
