import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("cards.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS cards (
    id TEXT PRIMARY KEY,
    youtube_id TEXT NOT NULL
  )
`);

// Seed some initial data if empty
const count = db.prepare("SELECT COUNT(*) as count FROM cards").get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare("INSERT INTO cards (id, youtube_id) VALUES (?, ?)");
  insert.run("1", "dQw4w9WgXcQ"); // Rick Astley
  insert.run("2", "kJQP7kiw5Fk"); // Despacito
  insert.run("3", "60ItHLz5WEA"); // Alan Walker - Faded
  insert.run("142", "dQw4w9WgXcQ"); // Example from request
  
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to get card info
  app.get("/api/cards/:id", (req, res) => {
    const card = db.prepare("SELECT * FROM cards WHERE id = ?").get(req.params.id) as { id: string, youtube_id: string } | undefined;
    if (card) {
      res.json(card);
    } else {
      res.status(404).json({ error: "Card not found" });
    }
  });

  // Card redirect route
  app.get("/c/:id", (req, res) => {
    const card = db.prepare("SELECT * FROM cards WHERE id = ?").get(req.params.id) as { id: string, youtube_id: string } | undefined;
    if (card) {
      // In a real app, we might do a server-side redirect, 
      // but since this is a SPA, we'll let the frontend handle the /c/:id route too 
      // or redirect to /play/:id
      res.redirect(`/play/${req.params.id}`);
    } else {
      res.status(404).send("Card not found");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
