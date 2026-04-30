import Database from "better-sqlite3";

const db = new Database("/tmp/campus.db");

// create users table
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  password TEXT,
  role TEXT
);
`);

// seed users
const count = db.prepare("SELECT COUNT(*) as count FROM users").get();
if (count.count === 0) {
  db.prepare("INSERT INTO users VALUES (NULL, ?, ?, ?)").run("241FA04505", "password", "student");
  db.prepare("INSERT INTO users VALUES (NULL, ?, ?, ?)").run("241FA04535", "password", "student");
  db.prepare("INSERT INTO users VALUES (NULL, ?, ?, ?)").run("admin", "password", "admin");
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  const user = db.prepare(`
    SELECT * FROM users WHERE username = ? AND password = ?
  `).get(username, password);

  if (user) {
    return res.status(200).json(user);
  }

  return res.status(401).json({ error: "Invalid credentials" });
}
