# Validation

## Local checks

Install dependencies and run the existing automated tests:

```bash
npm install
npm test
```

Run the development build when a change affects runtime behavior.

## Security-focused checks

Validate both accepted and rejected inputs. Authentication changes should cover:
- missing or malformed factors;
- expired or invalid values;
- recovery behavior;
- unexpected state transitions;
- accidental secret exposure in logs.

## Acceptance criteria

A change should preserve clear separation between authentication methods, keep configuration outside source code and avoid implying that a laboratory flow is production-ready without the controls described in the security documentation.
