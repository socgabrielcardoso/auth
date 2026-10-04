# Token Security

Tokens should be scoped, short-lived and protected like credentials.

Avoid logging full tokens. Validate issuer, audience, expiration and signature. Prefer server-side revocation mechanisms for high-risk flows where immediate invalidation matters.