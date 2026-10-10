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

## Identidad visual

Sigue el manual de identidad adventista de la División Interamericana (2022):

- **Colores:** Denim `#2f557f` (Pantone 302) como color principal; Warm `#ffa92d` y Ming `#3e8391` como secundarios.
- **Tipografía:** Noto Sans. Advent Sans es solo para el logo oficial.
- **Esquema de la Creación:** el inicio usa 7 columnas iguales; la 7.ª (la columna del sábado) lleva solo el fondo y el símbolo, nunca texto ni el símbolo circular.
- **Símbolo:** un solo color sólido (Denim, negro o blanco al 100 %), sin efectos. Junto al nombre va la versión normal; sola (favicon) va la circular.
- El símbolo actual (`public/img/logo-mark.png`) se sacó de una captura. Cuando tengan el archivo oficial, reemplázalo por ese (fondo transparente, símbolo en blanco).

## Cambiar datos

Todo está arriba de `public/app.js`, en el objeto `SITE`:

- **Horarios:** en `schedule`. Cada fila tiene el día (`day`: 0 = domingo … 3 = miércoles, 5 = viernes, 6 = sábado), el nombre en `es` y `en`, la hora de inicio `start` en formato 24 h (`"19:30"`) y, si quieres, la hora de terminar `end`. La página arma la semana sola y enseña cuál es la próxima reunión.
- **Dirección:** `address`, `mapQuery` (lo que se busca en Google Maps) y `latLng` (para Apple Maps y Waze).
- **Correo:** está guardado al revés y en base64 para que los bots no lo recojan. Para cambiarlo: `printf %s "correo@ejemplo.com" | rev | base64`.
- **Textos:** en el objeto `T` (una versión `es` y otra `en`). Si cambias un texto, cámbialo en los dos idiomas.

## Videos

- "Ver la transmisión" abre la página de directo del canal en YouTube.
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
