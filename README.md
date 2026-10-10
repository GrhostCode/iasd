# IASD Las Piedras

Sitio web de la Iglesia Adventista del Séptimo Día de Las Piedras, PR. En español por defecto, con inglés y modo oscuro en el botón de configuración (arriba a la derecha).

Corre en Cloudflare Workers: los archivos de `public/` se publican tal cual y un Worker pequeño (`src/worker.js`) lee los últimos servicios del canal de YouTube.

```
public/index.html      La página
public/styles.css      Diseño (colores en :root)
public/app.js          Textos ES/EN, horarios, dirección, correo y videos
public/img/            Logo y favicon
public/404.html        Página de "no encontrada"
public/_headers        Cabeceras de seguridad
src/worker.js          GET /api/videos (servicios anteriores desde YouTube)
src/feed.js            Lee el feed público del canal (no hace falta clave de API)
wrangler.jsonc         Configuración de Cloudflare
```

## Cambiar datos

Todo está arriba de `public/app.js`, en el objeto `SITE`:

- **Horarios:** en `schedule`, pon la hora en formato 24 h, por ejemplo `time: "09:15"`. Con `null` sale "Hora por confirmar". Puedes añadir más filas.
- **Dirección:** `address`, `mapQuery` (lo que se busca en Google Maps) y `latLng` (para Apple Maps y Waze).
- **Correo:** está guardado al revés y en base64 para que los bots no lo recojan. Para cambiarlo: `printf %s "correo@ejemplo.com" | rev | base64`.
- **Textos:** en el objeto `T` (una versión `es` y otra `en`). Si cambias un texto, cámbialo en los dos idiomas.

## Videos

- "Ver la transmisión" abre el directo del canal. Si no hay directo, YouTube enseña la próxima transmisión programada.
- "Servicios anteriores" muestra los últimos 9 videos del canal (sin Shorts). Se actualiza solo, como mucho cada 10 minutos.

## Publicar

1. En Cloudflare: **Workers & Pages → Create → Import a repository**, escoge `GrhostCode/iasd`.
2. Build command: vacío. Deploy command: `npx wrangler deploy`.
3. Cada `push` a `main` publica el sitio.
4. Cuando tengan el dominio: en el Worker, **Domains → Add Domain** (el dominio y `www`).

## Probar en tu computadora

```
npx wrangler dev     # http://localhost:8787
npm test             # prueba el lector del feed
```
