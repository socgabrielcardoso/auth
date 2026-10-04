# OAuth Baseline

OAuth delegates authorization and is not automatically an authentication protocol.

For login, use OpenID Connect where appropriate. Validate state, redirect URIs, issuer, audience and nonce. Authorization code with PKCE is preferred for modern public clients.