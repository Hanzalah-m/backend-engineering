# 🍪 Cookies

## What are Cookies?

Cookies are small pieces of data stored in the **browser** and automatically sent to the server on every request via the `Cookie` HTTP header.

## Cookie Attributes

| Attribute | Purpose |
|-----------|---------|
| `httpOnly` | Prevents JavaScript access (XSS protection) |
| `secure` | Only sent over HTTPS |
| `sameSite` | Controls cross-site behavior (`Strict`, `Lax`, `None`) |
| `maxAge` | Expiry in milliseconds |
| `domain` | Which domain receives the cookie |

## Types of Cookies

- **Session cookies** — no expiry, deleted when browser closes
- **Persistent cookies** — have `maxAge` or `expires`
- **httpOnly cookies** — server-only, invisible to JavaScript

## Express Example

See [`index.js`](./index.js) for a complete working example.

### Endpoints
- `POST /set-cookie` — sets a cookie
- `GET /read-cookie` — reads the cookie
- `DELETE /clear-cookie` — clears the cookie

## Security Best Practices

```js
res.cookie("token", value, {
  httpOnly: true,   // ✅ No JS access
  secure: true,     // ✅ HTTPS only
  sameSite: "strict" // ✅ No CSRF
});
```
