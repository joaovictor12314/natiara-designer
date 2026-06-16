import { BookingFlow } from "@/components/booking-flow";

export function BookingWorkspace() {
  return (
    <main className="bg-background">
      <section className="border-b bg-card">
        <div className="container py-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold leading-tight">Agendamento Natiara Designer</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Escolha o servico, informe seus dados e confirme o pagamento. Cada etapa mostra apenas o necessario.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-8">
        <BookingFlow />
      </section>
    </main>
  );
}
