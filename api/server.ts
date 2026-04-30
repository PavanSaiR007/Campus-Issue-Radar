import express from "express";
import Database from "better-sqlite3";

const app = express();
app.use(express.json());

// ⚠️ Vercel temp storage
const db = new Database("/tmp/campus_radar.db");

// Create tables (runs every time safely)
db.exec(`
CREATE TABLE IF NOT EXISTS complaints (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

// Test route
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// Add complaint
app.post("/complaints", (req, res) => {
  const { title, description } = req.body;

  const result = db.prepare(`
    INSERT INTO complaints (title, description)
    VALUES (?, ?)
  `).run(title, description);

  res.json({ id: result.lastInsertRowid });
});

// Get complaints
app.get("/complaints", (req, res) => {
  const data = db.prepare("SELECT * FROM complaints").all();
  res.json(data);
});

// IMPORTANT for Vercel
export default app;
