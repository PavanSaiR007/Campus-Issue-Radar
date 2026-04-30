import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ FIXED PORT (important for deployment)
const PORT = process.env.PORT || 3000;

const app = express();

// ✅ ENABLE CORS (important for frontend connection)
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// ✅ DATABASE
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
    location TEXT,
    urgency TEXT,
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

// Seed users
const seedUsers = db.prepare("SELECT count(*) as count FROM users").get() as { count: number };

if (seedUsers.count === 0) {
  const students = [
    { name: "Ganesh", reg: "241FA04505" },
    { name: "Dhanush", reg: "241FA04535" },
    { name: "Pavan", reg: "241FA04528" },
    { name: "Hardhik", reg: "241FA04518" }
  ];

  for (const s of students) {
    db.prepare(`
      INSERT INTO users (username, password, role, register_no, department)
      VALUES (?, ?, ?, ?, ?)
    `).run(s.name, "password", "student", s.reg, "CSE");
  }

  db.prepare(`
    INSERT INTO users (username, password, role)
    VALUES (?, ?, ?)
  `).run("admin", "password", "admin");
}

// ================= APIs =================

// Test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// Auth API
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const user = db.prepare(`
    SELECT * FROM users 
    WHERE (LOWER(username) = LOWER(?) OR LOWER(register_no) = LOWER(?)) 
    AND password = ?
  `).get(username, username, password) as any;

  if (user) {
    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      register_no: user.register_no,
      department: user.department
    });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Register
app.post("/api/register", (req, res) => {
  const { username, password, register_no, department } = req.body;

  try {
    const info = db.prepare(`
      INSERT INTO users (username, password, role, register_no, department)
      VALUES (?, ?, 'student', ?, ?)
    `).run(username, password, register_no, department || "CSE");

    res.json({ id: info.lastInsertRowid, message: "User registered successfully" });
  } catch (err: any) {
    if (err.message.includes("UNIQUE")) {
      res.status(400).json({ error: "Username already exists" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Create complaint
app.post("/api/complaints", (req, res) => {
  const { student_id, title, description, category, location, urgency, images } = req.body;

  const info = db.prepare(`
    INSERT INTO complaints (student_id, title, description, category, location, urgency)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(student_id, title, description, category, location, urgency);

  const complaintId = info.lastInsertRowid;

  if (images && Array.isArray(images)) {
    const insertImage = db.prepare(`
      INSERT INTO complaint_images (complaint_id, image_data)
      VALUES (?, ?)
    `);

    for (const img of images) {
      insertImage.run(complaintId, img);
    }
  }

  res.json({ id: complaintId, message: "Complaint submitted successfully" });
});

// Get complaints
app.get("/api/complaints", (req, res) => {
  const { role, userId } = req.query;

  let complaints;

  if (role === "admin") {
    complaints = db.prepare(`
      SELECT c.*, u.username as student_name 
      FROM complaints c 
      JOIN users u ON c.student_id = u.id 
      ORDER BY created_at DESC
    `).all();
  } else {
    complaints = db.prepare(`
      SELECT * FROM complaints 
      WHERE student_id = ? 
      ORDER BY created_at DESC
    `).all(userId);
  }

  const complaintsWithImages = complaints.map((c: any) => {
    const images = db.prepare(`
      SELECT image_data FROM complaint_images WHERE complaint_id = ?
    `).all(c.id);

    return { ...c, images: images.map((i: any) => i.image_data) };
  });

  res.json(complaintsWithImages);
});

// Update status
app.patch("/api/complaints/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.prepare(`
    UPDATE complaints SET status = ? WHERE id = ?
  `).run(status, id);

  res.json({ message: "Status updated" });
});

// Feedback
app.post("/api/feedback", (req, res) => {
  const { user_id, message, rating } = req.body;

  db.prepare(`
    INSERT INTO feedback (user_id, message, rating)
    VALUES (?, ?, ?)
  `).run(user_id, message, rating);

  res.json({ message: "Feedback submitted successfully" });
});

// Radar analytics
app.get("/api/radar", (req, res) => {
  const stats = db.prepare(`
    SELECT category, COUNT(*) as count 
    FROM complaints 
    GROUP BY category
  `).all();

  res.json(stats);
});

// ================= START SERVER =================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
