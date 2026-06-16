"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    VLibras?: {
      Widget: new (url: string) => unknown;
    };
  }
}

export function LibrasWidget() {
  useEffect(() => {
    let initialized = false;

    function initialize() {
      if (initialized || !window.VLibras) {
        return;
      }

      initialized = true;
      new window.VLibras.Widget("https://vlibras.gov.br/app");
    }

    function openFromToolbar() {
      initialize();
      window.setTimeout(() => {
        document.querySelector<HTMLElement>("[vw-access-button]")?.click();
      }, 250);
    }

    window.addEventListener("natiara:open-libras", openFromToolbar);

    if (document.querySelector("script[data-vlibras-widget]")) {
      initialize();
      return () => window.removeEventListener("natiara:open-libras", openFromToolbar);
    }

    if (!document.querySelector("[vw]")) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;
    script.dataset.vlibrasWidget = "true";
    script.onload = initialize;
    document.body.appendChild(script);

    return () => window.removeEventListener("natiara:open-libras", openFromToolbar);
  }, []);

  return (
    <div id="vlibras" {...{ vw: "true" }} className="enabled">
      <div {...{ "vw-access-button": "true" }} className="active" />
      <div {...{ "vw-plugin-wrapper": "true" }}>
        <div className="vw-plugin-top-wrapper" />
      </div>
    </div>
  );
}
