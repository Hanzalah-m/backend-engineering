# 📁 File Upload

## What is Multer?

**Multer** is an Express middleware for handling `multipart/form-data`, which is the encoding type used for file uploads.

## Storage Options

| Storage | Description | Use When |
|---------|-------------|----------|
| `memoryStorage` | Files in RAM as Buffer | Small files, direct processing |
| `diskStorage` | Files saved to local disk | Larger files, need path |
| S3 / Cloud | Upload to cloud storage | Production apps |

## File Validation

Always validate:
- **File type** (MIME type + extension)
- **File size** (set `limits.fileSize`)
- **Number of files** (set `limits.files`)

## Security Tips

- Never trust the client-provided filename — sanitize or generate a UUID
- Store files outside the web root or use cloud storage
- Scan for malware in production
- Validate MIME type server-side (clients can spoof it)

## Common MIME Types

```
image/jpeg, image/png, image/gif, image/webp
application/pdf
text/plain, text/csv
application/json
video/mp4
```
