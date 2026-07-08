# 🔒 Password Hashing

## Why Hash Passwords?

**Never store plain text passwords.** If your database is compromised, hashed passwords are useless to attackers (when done correctly).

## How bcrypt Works

1. Generates a random **salt** (prevents rainbow table attacks)
2. Combines salt + password
3. Runs through the Blowfish cipher N times (controlled by **cost factor**)
4. Result: `$2b$12$<salt><hash>`

## Cost Factor / Work Factor

The cost factor controls how computationally expensive hashing is. Higher = slower = more secure:

| Cost | Approx. time | Use When |
|------|-------------|----------|
| 10 | ~100ms | Development |
| 12 | ~400ms | Production (recommended) |
| 14 | ~1.5s | High-security apps |

The higher the cost, the harder for attackers to brute-force.

## Never Do This

```js
// ❌ Plain text
db.save({ password: "mypassword123" })

// ❌ MD5 or SHA1 (too fast, broken)
crypto.createHash('md5').update(password).digest('hex')

// ❌ Unsalted SHA256 (still vulnerable to rainbow tables)
crypto.createHash('sha256').update(password).digest('hex')
```

## Correct Approach

```js
// ✅ bcrypt with salt rounds
const hash = await bcrypt.hash(password, 12);
const match = await bcrypt.compare(inputPassword, hash);
```
