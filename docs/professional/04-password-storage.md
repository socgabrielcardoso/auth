# Password Storage

Passwords must never be stored reversibly.

Use a modern password hashing function with per-user salt and appropriate work factor. Compare hashes in constant-time-capable library functions where applicable.

Logs, analytics and error messages must never contain passwords.