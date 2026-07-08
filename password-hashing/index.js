const express = require("express");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());

// Mock user storage (use a real database in production)
const users = new Map();

const SALT_ROUNDS = 12; // Recommended for production

// ─── Routes ──────────────────────────────────────────────────────────────────

// POST /register — hash password before storing
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    if (users.has(username)) {
      return res.status(409).json({ error: "Username already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Store user (NEVER store the plain password)
    users.set(username, { username, password: hashedPassword, createdAt: new Date() });

    console.log(`Stored hash: ${hashedPassword}`); // e.g. $2b$12$...

    res.status(201).json({ message: "User registered successfully", username });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// POST /login — compare password with stored hash
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = users.get(username);
    if (!user) {
      // Use a generic error to not reveal whether username exists
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare plain text password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ message: `Welcome back, ${username}!` });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// POST /change-password — verify old password before updating
app.post("/change-password", async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;

    const user = users.get(username);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: "New password must be at least 8 characters" });
    }

    // Hash and update
    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Password change failed" });
  }
});

// GET /demo — show the difference between plain text and hashed
app.get("/demo", async (req, res) => {
  const password = "mySecurePassword123";
  const hash1 = await bcrypt.hash(password, SALT_ROUNDS);
  const hash2 = await bcrypt.hash(password, SALT_ROUNDS); // Different each time!

  res.json({
    plainText: password,
    hash1,
    hash2,
    sameHash: hash1 === hash2, // false — salts differ
    verifies: await bcrypt.compare(password, hash1), // true
  });
});

app.listen(3009, () => console.log("Password hashing server on http://localhost:3009"));
