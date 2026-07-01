# 🔐 JWT — JSON Web Tokens

## What is JWT?

A **JSON Web Token** is a compact, self-contained way to securely transmit information between parties as a JSON object. It consists of three Base64URL-encoded parts separated by dots:

```
header.payload.signature
```

- **Header** — algorithm & token type (`{ "alg": "HS256", "typ": "JWT" }`)
- **Payload** — claims (user data, expiry, etc.)
- **Signature** — verifies the token wasn't tampered with

## When to Use JWT

✅ Stateless authentication (no server-side session storage)  
✅ API authentication between services  
✅ Mobile app auth  
❌ Don't store sensitive data in the payload (it's Base64 encoded, not encrypted)

## Flow

```
1. User logs in → server creates JWT → sends to client
2. Client stores JWT (localStorage or httpOnly cookie)
3. Client sends JWT in Authorization header on each request
4. Server verifies signature → grants access
```

## Express Example

See [`index.js`](./index.js) for a complete working example.

### Endpoints
- `POST /login` — returns a JWT
- `GET /protected` — requires valid JWT

## Key Concepts

| Concept | Detail |
|---------|--------|
| `jwt.sign()` | Creates a token |
| `jwt.verify()` | Validates & decodes a token |
| `expiresIn` | Token expiry (`'1h'`, `'7d'`, etc.) |
| `Authorization: Bearer <token>` | Standard HTTP header |
