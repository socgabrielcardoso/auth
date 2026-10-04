# TOTP

TOTP is a possession-based second factor backed by a shared secret.

Security requirements:
- protect enrollment secret;
- confirm enrollment;
- tolerate only small clock drift;
- rate limit attempts;
- provide safe recovery;
- prevent secret exposure in logs.

TOTP improves security but remains phishable.