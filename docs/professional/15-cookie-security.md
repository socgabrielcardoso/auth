# Cookie Security

Session cookies should normally use:
- Secure;
- HttpOnly;
- appropriate SameSite;
- narrow Path and Domain;
- non-persistent lifetime when suitable.

Cookie flags reduce exposure but do not replace CSRF defenses or server-side authorization.