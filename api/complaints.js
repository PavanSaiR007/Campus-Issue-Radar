import Database from "better-sqlite3";

const db = new Database("/tmp/campus.db");

// Create tables
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  password TEXT,
  role TEXT
);

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

// Seed users (only once)
const count = db.prepare("SELECT COUNT(*) as count FROM users").get();
if (count.count === 0) {
  db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)").run("241FA04505", "password", "student");
  db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)").run("241FA04535", "password", "student");
  db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)").run("admin", "password", "admin");
}

export default function handler(req, res) {

  // ✅ LOGIN API
  if (req.url.includes("/login") && req.method === "POST") {
    const { username, password } = req.body;

    const user = db.prepare(`
      SELECT * FROM users WHERE username = ? AND password = ?
    `).get(username, password);

    if (user) return res.status(200).json(user);
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // ✅ GET complaints
  if (req.method === "GET") {
    const data = db.prepare("SELECT * FROM complaints").all();
    return res.status(200).json(data);
  }

  // ✅ POST complaints
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
