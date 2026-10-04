# Review Checklist

Before merging an authentication change:
- no secrets in source or logs;
- failure paths tested;
- replay considered;
- rate limiting preserved;
- audit event emitted;
- recovery impact reviewed;
- session impact reviewed;
- privilege boundary unchanged or documented;
- tests pass;
- documentation updated.