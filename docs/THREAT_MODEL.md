# Authentication abuse cases and release criteria

This document defines security requirements to be **implemented and tested**, not controls proven present in the application.

## Trust boundaries
Browser input, HTTP headers, cookies, OTPs, OAuth callback parameters, WebAuthn challenges, configuration and email/phone destinations are untrusted. The server must be the authority for identities, sessions and authorization.

## Critical checks
| Threat | Expected mitigation | Regression test |
| --- | --- | --- |
| User enumeration | Consistent login/recovery responses | Unknown and known identifiers produce indistinguishable external results |
| Credential stuffing and OTP guessing | Rate limits by account and client, monitoring, lockout/backoff | Repeated attempts fail safely without exhausting service |
| Session fixation/theft | Regenerate session on login, HttpOnly/Secure/SameSite cookies, rotation/revocation | Pre-auth session cannot be reused after login or logout |
| CSRF | SameSite plus anti-CSRF checks where needed | Cross-origin state-changing request is rejected |
| OAuth state confusion | Validate state, issuer, redirect URI, PKCE and nonce when applicable | Mismatched response is rejected |
| WebAuthn/passkey replay | Validate challenge, RP ID, origin and counter/credential properties | Altered challenge, origin and RP ID are rejected |
| TOTP/OTP replay | Short TTL, single use when applicable, bounded attempts | Token cannot be reused after successful verification |
| Account recovery takeover | Recovery uses equal-or-stronger assurance and revokes sessions | Stolen/expired recovery artifacts fail |
| Stored secret exposure | Hash credentials with suitable password KDF, encrypt/protect other secrets | No plaintext secret in logs, fixtures or persistent stores |
| XSS in login UI | Safe DOM APIs, CSP, output escaping | Malicious identifier is rendered inert |

## Release gate
Run automated negative tests for every enabled authentication method, dependency/security scans and secret checks. Record pass/fail evidence against a commit SHA. No demo authentication flow should be described as production-safe until audited in context.

## User interface rules
Maintain semantic HTML, compact accessible controls, no ornamental scripts/CDNs by default, no misleading assurance indicators. Never present client-side validation as an authorization boundary.
