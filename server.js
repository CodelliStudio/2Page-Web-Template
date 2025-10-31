// server.js
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import { randomUUID } from "crypto";
import path from "path";
import { fileURLToPath } from "url";

// --- Configuración base ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, "public")));

// --- Configurar cliente OpenAI ---
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

// --- Historial de sesiones ---
const sessions = {};

// --- Middleware para manejar sessionId ---
app.use((req, res, next) => {
  if (!req.headers["x-session-id"]) {
    req.sessionId = randomUUID();
    res.setHeader("x-session-id", req.sessionId);
  } else {
    req.sessionId = req.headers["x-session-id"];
  }
  next();
});

// --- Endpoint del chatbot ---
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  const sessionId = req.sessionId;

  if (!sessions[sessionId]) {
    sessions[sessionId] = [
      {
        role: "system",
        content: "Eres 'TitanBot', un asesor de soporte super amable y persuasivo para TitanFuel, una tienda de suplementos deportivos. Siempre respondes como un humano cordial, guiando al usuario y tratando de convertirlo en cliente."
      },
    ];
  }

  sessions[sessionId].push({ role: "user", content: message });

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: sessions[sessionId],
    });

    const reply = response.choices[0].message.content;
    sessions[sessionId].push({ role: "assistant", content: reply });

    res.json({ reply });
  } catch (err) {
    console.error("Error conectando con OpenAI:", err);
    res.status(500).json({ reply: "Error conectando con la IA" });
  }
});

// --- Reiniciar sesión ---
app.post("/reset-session", (req, res) => {
  const sessionId = req.headers["x-session-id"];
  if (sessionId && sessions[sessionId]) delete sessions[sessionId];
  res.json({ success: true });
});

// --- Servir index.html por defecto ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// --- Levantar servidor ---
app.listen(3000, () =>
  console.log("✅ Servidor corriendo en http://localhost:3000")
);
