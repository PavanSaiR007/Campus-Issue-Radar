import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("campus_radar.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT CHECK(role IN ('student', 'admin')),
    register_no TEXT,
    department TEXT
  );

  CREATE TABLE IF NOT EXISTS complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    title TEXT,
    description TEXT,
    category TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(student_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS complaint_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    complaint_id INTEGER,
    image_data TEXT,
    FOREIGN KEY(complaint_id) REFERENCES complaints(id)
  );

  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    message TEXT,
    rating INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

// Seed initial users if not exists
const seedUsers = db.prepare("SELECT count(*) as count FROM users").get() as { count: number };
if (seedUsers.count === 0) {
  db.prepare("INSERT INTO users (username, password, role, register_no, department) VALUES (?, ?, ?, ?, ?)").run("student1", "password", "student", "22CSE123", "CSE");
  db.prepare("INSERT INTO users (username, password, role, register_no, department) VALUES (?, ?, ?, ?, ?)").run("student2", "password", "student", "22ECE456", "ECE");
  db.prepare("INSERT INTO users (username, password, role, register_no, department) VALUES (?, ?, ?, ?, ?)").run("student3", "password", "student", "22ME789", "ME");
  db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)").run("admin", "password", "admin");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // Auth API
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password) as any;
    if (user) {
      res.json({ id: user.id, username: user.username, role: user.role });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Complaints API
  app.post("/api/complaints", (req, res) => {
    const { student_id, title, description, category, images } = req.body;
    
    const info = db.prepare("INSERT INTO complaints (student_id, title, description, category) VALUES (?, ?, ?, ?)").run(student_id, title, description, category);
    const complaintId = info.lastInsertRowid;

    if (images && Array.isArray(images)) {
      const insertImage = db.prepare("INSERT INTO complaint_images (complaint_id, image_data) VALUES (?, ?)");
      for (const img of images) {
        insertImage.run(complaintId, img);
      }
    }

    res.json({ id: complaintId, message: "Complaint submitted successfully" });
  });

  app.get("/api/complaints", (req, res) => {
    const { role, userId } = req.query;
    let complaints;
    if (role === 'admin') {
      complaints = db.prepare(`
        SELECT c.*, u.username as student_name 
        FROM complaints c 
        JOIN users u ON c.student_id = u.id 
        ORDER BY created_at DESC
      `).all();
    } else {
      complaints = db.prepare("SELECT * FROM complaints WHERE student_id = ? ORDER BY created_at DESC").all(userId);
    }

    // Attach images
    const complaintsWithImages = complaints.map((c: any) => {
      const images = db.prepare("SELECT image_data FROM complaint_images WHERE complaint_id = ?").all(c.id);
      return { ...c, images: images.map((i: any) => i.image_data) };
    });

    res.json(complaintsWithImages);
  });

  app.patch("/api/complaints/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare("UPDATE complaints SET status = ? WHERE id = ?").run(status, id);
    res.json({ message: "Status updated" });
  });

  // Feedback API
  app.post("/api/feedback", (req, res) => {
    const { user_id, message, rating } = req.body;
    db.prepare("INSERT INTO feedback (user_id, message, rating) VALUES (?, ?, ?)").run(user_id, message, rating);
    res.json({ message: "Feedback submitted successfully" });
  });

  // Radar Data API (Analytics)
  app.get("/api/radar", (req, res) => {
    const stats = db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM complaints 
      GROUP BY category
    `).all();
    res.json(stats);
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
