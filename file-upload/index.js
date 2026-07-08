const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// ─── Multer: Disk Storage ─────────────────────────────────────────────────────
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp + random + original extension
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// ─── Multer: Memory Storage (for direct processing) ───────────────────────────
const memoryStorage = multer.memoryStorage();

// ─── File Filter: Only allow images ──────────────────────────────────────────
const imageFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only image files are allowed (jpeg, png, gif, webp)"), false);
  }
};

// ─── Multer instances ─────────────────────────────────────────────────────────
const uploadImage = multer({
  storage: diskStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

const uploadAny = multer({
  storage: diskStorage,
  limits: { fileSize: 10 * 1024 * 1024, files: 5 }, // 10MB, max 5 files
});

// ─── Routes ──────────────────────────────────────────────────────────────────

// POST /upload/single — single image upload
app.post("/upload/single", uploadImage.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.status(201).json({
    message: "File uploaded successfully",
    file: {
      originalName: req.file.originalname,
      savedAs: req.file.filename,
      size: req.file.size,
      mimeType: req.file.mimetype,
      path: `/uploads/${req.file.filename}`,
    },
  });
});

// POST /upload/multiple — multiple files (up to 5)
app.post("/upload/multiple", uploadAny.array("files", 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  const files = req.files.map((f) => ({
    originalName: f.originalname,
    savedAs: f.filename,
    size: f.size,
    mimeType: f.mimetype,
  }));

  res.status(201).json({ message: `${files.length} files uploaded`, files });
});

// POST /upload/fields — multiple fields (avatar + document)
app.post(
  "/upload/fields",
  uploadAny.fields([
    { name: "avatar", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  (req, res) => {
    res.json({
      avatar: req.files?.avatar?.[0]?.filename,
      document: req.files?.document?.[0]?.filename,
    });
  }
);

// GET /uploads — list uploaded files
app.get("/uploads", (req, res) => {
  const files = fs.readdirSync(UPLOAD_DIR);
  res.json({ count: files.length, files });
});

// Serve uploaded files statically
app.use("/uploads", express.static(UPLOAD_DIR));

// ─── Error handler for Multer ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large" });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ error: "Too many files" });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

app.listen(3010, () => console.log("File upload server on http://localhost:3010"));
