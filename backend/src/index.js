import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

const FRONTEND_PUBLIC_URL =
  process.env.FRONTEND_PUBLIC_URL || "http://localhost:5173";

const API_PUBLIC_URL = process.env.API_PUBLIC_URL || "http://localhost:5000";

const DATA_PATH = path.join(__dirname, "data.json");

app.use(cors());
app.use(express.json());

function readData() {
  const data = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(data);
}

function buscarEventoPorSlug(slug) {
  const eventos = readData();
  return eventos.find((evento) => evento.slug === slug);
}

function recortarTexto(texto, largoMaximo = 180) {
  if (!texto) {
    return "";
  }

  if (texto.length <= largoMaximo) {
    return texto;
  }

  return `${texto.slice(0, largoMaximo).trim()}...`;
}

function escaparHtml(texto) {
  return String(texto ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function construirUrlFrontend(evento) {
  const ruta = evento.ruta || `/eventos/${evento.slug}`;
  return `${FRONTEND_PUBLIC_URL}${ruta}`;
}

function construirUrlShare(evento) {
  return `${API_PUBLIC_URL}/share/eventos/${evento.slug}`;
}

function construirMetadataShare(evento) {
  const title = evento.nombre;
  const description = recortarTexto(evento.descripcion);
  const image = evento.imagen;
  const frontendUrl = construirUrlFrontend(evento);
  const url = construirUrlShare(evento);

  return {
    title,
    description,
    image,
    url,
    frontendUrl,
    text: `Revisa este evento: ${title}`,
  };
}

function agregarShare(evento) {
  return {
    ...evento,
    share: construirMetadataShare(evento),
  };
}

app.get("/", (req, res) => {
  res.send("Backend funcionando.");
});

app.get("/eventos", (req, res) => {
  const eventos = readData().map(agregarShare);
  res.json(eventos);
});

app.get("/eventos/:slug", (req, res) => {
  const evento = buscarEventoPorSlug(req.params.slug);

  if (!evento) {
    return res.status(404).json({ error: "Evento no encontrado" });
  }

  res.json(agregarShare(evento));
});

app.get("/eventos/:slug/share", (req, res) => {
  const evento = buscarEventoPorSlug(req.params.slug);

  if (!evento) {
    return res.status(404).json({ error: "Evento no encontrado" });
  }

  res.json(construirMetadataShare(evento));
});

app.get("/share/eventos/:slug", (req, res) => {
  const evento = buscarEventoPorSlug(req.params.slug);

  if (!evento) {
    return res.status(404).send("Evento no encontrado");
  }

  const share = construirMetadataShare(evento);

  const title = escaparHtml(share.title);
  const description = escaparHtml(share.description);
  const image = escaparHtml(share.image);
  const shareUrl = escaparHtml(share.url);
  const frontendUrl = escaparHtml(share.frontendUrl);

  res.type("html").send(`<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>${title}</title>

    <meta name="description" content="${description}" />
    <link rel="canonical" href="${frontendUrl}" />

    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${shareUrl}" />
    <meta property="og:site_name" content="Eventos USM" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />

    <meta http-equiv="refresh" content="0; url=${frontendUrl}" />

    <script>
      window.location.replace(${JSON.stringify(share.frontendUrl)});
    </script>
  </head>

  <body>
    <p>Redirigiendo a <a href="${frontendUrl}">${title}</a>...</p>
  </body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
