# 🧭 Atlas de Proyectos

Web app educativa y visual para entender la arquitectura y la estructura de los 51 proyectos:
**catálogo** con thumbnails, **fichas** con diagramas de arquitectura, y vista de **ecosistema**
(Vercel · GitHub · Servidor Docker · Proveedores de IA).

- Sin autenticación, sin backend, sin conexión a LLM.
- Datos verificados a partir del inventario (Excel) del 2026-10-17.
- Responsive + PWA instalable + Vercel Analytics.

## Desarrollo

```bash
npm install
npm run dev
```

## Estructura

- `src/data/projects.ts` — los 51 proyectos (tipo, topología, proveedores, Docker…)
- `src/arch.tsx` — diagramas SVG de arquitectura por proyecto
- `src/eco.tsx` — vista del ecosistema global
- `src/App.tsx` — catálogo con búsqueda y filtros + ficha de proyecto
- `public/shots/` y `public/thumbs/` — capturas de los despliegues (generadas)

## Despliegue

Conecta el repo en Vercel (framework: Vite). El analytics de Vercel se activa solo
al desplegar en Vercel con el paquete `@vercel/analytics` ya incluido.
