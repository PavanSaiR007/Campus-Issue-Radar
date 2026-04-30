import Database from "better-sqlite3";

const db = new Database("/tmp/campus.db");

db.exec(`
CREATE TABLE IF NOT EXISTS complaints (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

export default function handler(req, res) {
  if (req.method === "GET") {
    const data = db.prepare("SELECT * FROM complaints").all();
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { title, description } = req.body;

    const result = db.prepare(`
      INSERT INTO complaints (title, description)
      VALUES (?, ?)
    `).run(title, description);

    return res.status(200).json({ id: result.lastInsertRowid });
  }

  res.status(405).json({ error: "Method not allowed" });
}
