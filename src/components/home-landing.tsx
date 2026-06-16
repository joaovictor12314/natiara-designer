import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { heroImage } from "@/lib/cloudinary";

export function HomeLanding() {
  return (
    <main>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="Materiais de beleza para atendimento estetico domiciliar"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[rgba(15,45,38,0.66)]" />
        </div>

        <div className="container relative flex min-h-[420px] items-center py-10">
          <div className="max-w-2xl space-y-5 text-white">
            <Badge variant="secondary" className="border-white/20 bg-white text-primary">
              Natiara Designer
            </Badge>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                Agende seu atendimento domiciliar
              </h1>
              <p className="max-w-xl text-base leading-7 text-white/90">
                Escolha o servico, informe seus dados e confirme o pagamento em um fluxo simples.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/agendamento">
                  <CalendarCheck className="h-4 w-4" />
                  Agendar atendimento
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/login">Entrar</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container grid gap-4 py-8 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-5">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <h2 className="mt-3 font-semibold">Servicos claros</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Veja preco, escolha o atendimento e acompanhe o total antes de confirmar.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <CalendarCheck className="h-5 w-5 text-primary" />
          <h2 className="mt-3 font-semibold">Agendamento rapido</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            O formulario foi separado em etapas para nao sobrecarregar a tela.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h2 className="mt-3 font-semibold">Resumo seguro</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Confira servicos, deslocamento e forma de pagamento antes de finalizar.
          </p>
        </div>
      </section>
    </main>
  );
}
