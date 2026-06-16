# Natiara Designer

Aplicacao Next.js para agendamento de servicos esteticos domiciliares, baseada na documentacao do projeto Natiara Designer.

## Stack

- Next.js + React
- Tailwind CSS + componentes estilo shadcn/ui
- Neon PostgreSQL
- Framer Motion
- Vercel
- Cloudinary
- next-sitemap
- Zod
- Lucide React
- TanStack Query
- Recharts

## Rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Variaveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SITE_URL="https://seu-dominio.vercel.app"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="seu-cloud-name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="natiara-designer"
```

## Banco Neon

O script SQL inicial esta em `src/db/schema.sql`.

## Sitemap

Depois do build:

```bash
npm run sitemap
```
