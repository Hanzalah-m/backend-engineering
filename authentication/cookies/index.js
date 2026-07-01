const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());



// POST /set-cookie — set a secure cookie
app.post("/set-cookie", (req, res) => {
  const { username } = req.body;

  res.cookie("user", username, {
    httpOnly: true,          // Not accessible via document.cookie
    secure: false,           // Set to true in production (HTTPS)
    sameSite: "strict",      // Prevent CSRF
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  });

  res.json({ message: `Cookie set for user: ${username}` });
});

// GET /read-cookie — read the cookie
app.get("/read-cookie", (req, res) => {
  const user = req.cookies.user;

  if (!user) {
    return res.status(401).json({ error: "No cookie found" });
  }

  res.json({ message: `Welcome back, ${user}!` });
});

// POST /set-multiple — set multiple cookies
app.post("/set-multiple", (req, res) => {
  res.cookie("theme", "dark", { maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.cookie("lang", "en", { maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ message: "Multiple cookies set" });
});

// DELETE /clear-cookie — clear a cookie
app.delete("/clear-cookie", (req, res) => {
  res.clearCookie("user");
  res.json({ message: "Cookie cleared" });
});

// GET /all-cookies — see all cookies
app.get("/all-cookies", (req, res) => {
  res.json({ cookies: req.cookies });
});

app.listen(3000, () => console.log("Cookie server running on http://localhost:3000"));
