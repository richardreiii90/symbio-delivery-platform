# SYMBIO Delivery Platform (MVP con Vercel + Neon + Prisma + Next.js)

Starter listo para subir a GitHub y desplegar en Vercel. Incluye:
- Next.js 14 (App Router)
- Prisma ORM apuntando a **Neon (PostgreSQL)**
- Estructura para API de pedidos y panel de comercio (con sonido mediante audio local)
- Cron de Vercel para reportes diarios (endpoint stub)
- Lista para conectar Ably y Mapbox

## 1) Preparar base de datos (Neon)
1. Crea un proyecto en [Neon](https://neon.tech/).
2. Copia la cadena de conexión **DATABASE_URL** con `sslmode=require` y colócala en `.env` (basate en `.env.example`).
3. En local o en Vercel, ejecuta las migraciones (opción A o B):
   - **A (local)**: `npm i` → `npx prisma db push` (o `npm run prisma:push`).
   - **B (Vercel)**: usa **Vercel Post-Install Command** o ejecuta una acción desde GitHub que haga `prisma generate` y `prisma db push`.

## 2) Subir a GitHub
1. Crea un repositorio vacío en tu cuenta de GitHub.
2. Subí el contenido de este zip. Ejemplo:
   ```bash
   unzip symbio-delivery-platform.zip
   cd symbio-delivery-platform
   git init
   git add .
   git commit -m "feat: MVP base Next.js + Prisma + Neon"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/symbio-delivery-platform.git
   git push -u origin main
   ```

## 3) Configurar en Vercel
1. **New Project** → Importar el repo.
2. Variables de entorno (Settings → Environment Variables):
   - `DATABASE_URL` (Neon)
   - `NEXTAUTH_SECRET` (si usás Auth.js)
   - `NEXTAUTH_URL` (p.ej. `https://tu-dominio.vercel.app`)
   - `ABLY_API_KEY` y `NEXT_PUBLIC_ABLY_KEY` (opcional por ahora)
   - `MAPBOX_TOKEN` (opcional)
3. (Opcional) En **Project Settings → Functions → Cron Jobs**, confirmá que `vercel.json` cree la tarea para `/api/reports/daily` a las 23:59 ART.

## 4) Probar
- `npm run dev` y abrir `http://localhost:3000`
- `/merchant` tiene un botón **Simular Pedido** que dispara sonido y, si aceptás permisos, una notificación.
- `GET /api/health` debe responder `{ ok: true }`.

## 5) Próximos pasos
- Implementar Auth.js (NextAuth) con PrismaAdapter.
- Crear CRUD para Comercios/Menu (páginas y API).
- Conectar **Ably**: publicar eventos en `merchant:{merchantId}` al crear/actualizar pedidos.
- Agregar cálculo de **tarifa por distancia** (Mapbox/ORS) y estados de repartidor.
- Añadir `/admin` con tablas y export de reportes CSV.
- Crear app **Expo** para repartidores (proyecto aparte o monorepo).

> Tip: mantené el audio en `public/sounds/new-order.mp3` para la alerta del panel del comercio.
