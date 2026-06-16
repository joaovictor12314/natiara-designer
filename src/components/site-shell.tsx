import Link from "next/link";
import { CalendarCheck, Home, LogIn, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-background/92 backdrop-blur">
        <div className="container flex min-h-16 items-center justify-between gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">Natiara Designer</span>
              <span className="block truncate text-xs text-muted-foreground">Agendamento domiciliar</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Inicio</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/agendamento">
                <CalendarCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Agendar</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/login">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            </Button>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
