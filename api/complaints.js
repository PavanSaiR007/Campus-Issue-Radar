import Database from "better-sqlite3";

const db = new Database("/tmp/campus.db");

// Create tables
db.exec(`
CREATE TABLE IF NOT EXISTS complaints (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  description TEXT,
  category TEXT,
  location TEXT,
  urgency TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

export default function handler(req, res) {

  // GET complaints
  if (req.method === "GET") {
    const data = db.prepare("SELECT * FROM complaints").all();
    return res.status(200).json(data);
  }

  // POST complaints
  if (req.method === "POST") {
    const { title, description, category, location, urgency } = req.body;

    const result = db.prepare(`
      INSERT INTO complaints (title, description, category, location, urgency)
      VALUES (?, ?, ?, ?, ?)
    `).run(title, description, category, location, urgency);

    return res.status(200).json({ id: result.lastInsertRowid });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
