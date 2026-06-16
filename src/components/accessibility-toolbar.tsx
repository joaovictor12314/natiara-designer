"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Hand, Palette, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AccessibilityToolbar() {
  const [colorblind, setColorblind] = useState(false);
  const [fontLarge, setFontLarge] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("natiara-colorblind") === "true";
    const storedFont = window.localStorage.getItem("natiara-font-large") === "true";
    setColorblind(stored);
    setFontLarge(storedFont);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.colorblind = colorblind ? "true" : "false";
    window.localStorage.setItem("natiara-colorblind", String(colorblind));
  }, [colorblind]);

  useEffect(() => {
    document.documentElement.dataset.fontLarge = fontLarge ? "true" : "false";
    window.localStorage.setItem("natiara-font-large", String(fontLarge));
  }, [fontLarge]);

  function openLibras() {
    const accessButton = document.querySelector<HTMLElement>("[vw-access-button]");

    if (accessButton) {
      accessButton.click();
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.setAttribute("vw", "true");
    wrapper.className = "enabled";
    wrapper.innerHTML = `
      <div vw-access-button="true" class="active"></div>
      <div vw-plugin-wrapper="true">
        <div class="vw-plugin-top-wrapper"></div>
      </div>
    `;
    document.body.appendChild(wrapper);

    const script = document.createElement("script");
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;
    script.onload = () => {
      if (window.VLibras) {
        new window.VLibras.Widget("https://vlibras.gov.br/app");
        window.setTimeout(() => {
          document.querySelector<HTMLElement>("[vw-access-button]")?.click();
        }, 300);
      }
    };
    document.body.appendChild(script);
  }

  return (
    <div className="border-b bg-card/96">
      <div className="container relative flex min-h-12 items-center justify-end py-2 text-sm">
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen((value) => !value)}>
          Acessibilidade
          <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
        </Button>

        {open ? (
          <div className="absolute right-4 top-12 z-50 grid w-[min(280px,calc(100vw-2rem))] gap-2 rounded-lg border bg-card p-3 shadow-soft">
            <Button
              type="button"
              variant={colorblind ? "default" : "outline"}
              size="sm"
              onClick={() => setColorblind((value) => !value)}
              aria-pressed={colorblind}
              className="justify-start"
            >
              <Palette className="h-4 w-4" />
              {colorblind ? "Daltonismo ativo" : "Modo daltonismo"}
            </Button>
            <Button
              type="button"
              variant={fontLarge ? "default" : "outline"}
              size="sm"
              onClick={() => setFontLarge((value) => !value)}
              aria-pressed={fontLarge}
              className="justify-start"
            >
              <Type className="h-4 w-4" />
              {fontLarge ? "Fonte ampliada" : "Aumentar fonte"}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={openLibras} className="justify-start">
              <Hand className="h-4 w-4" />
              Libras
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
