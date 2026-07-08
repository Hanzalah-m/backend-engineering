const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const SECRET_KEY = "your-secret-key"; // In production: use env variable

// Mock user database
const users = [{ id: 1, username: "alice", password: "password123" }];

// ─── Middleware: Verify JWT ───────────────────────────────────────────────────
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// POST /login — authenticate and receive a JWT
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Create token (expires in 1 hour)
  const token = jwt.sign(
    { id: user.id, username: user.username }, // payload
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

// GET /protected — only accessible with a valid JWT
app.get("/protected", authenticateToken, (req, res) => {
  res.json({
    message: `Hello, ${req.user.username}! You have access.`,
    user: req.user,
  });
});

// GET /refresh — issue a new token (simplified)
app.get("/refresh", authenticateToken, (req, res) => {
  const newToken = jwt.sign(
    { id: req.user.id, username: req.user.username },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
  res.json({ token: newToken });
});

app.listen(3001, () => console.log("JWT server running on http://localhost:3001"));
