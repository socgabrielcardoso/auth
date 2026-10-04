# Account Recovery

Recovery is part of authentication security and often the weakest path.

Design goals:
- verify identity proportionally to account risk;
- prevent support-driven bypass;
- rate limit;
- notify existing channels;
- revoke risky sessions after recovery;
- record audit evidence.