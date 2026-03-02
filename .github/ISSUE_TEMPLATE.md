---
name: Support / Bug Report
description: Report a bug, ask for help, or request an enhancement.
title: "[TYPE]: short summary"
labels: [triage]
---

## Issue Type
- [ ] Bug
- [ ] Help Request
- [ ] Feature Request

## Summary
Describe the problem or request clearly.

## Environment
- OS:
- Node.js version:
- postman-parallel version (`postman-parallel --version`):
- Postman CLI version (`postman --version`):

## Command Used
```bash
postman-parallel --config ./config.json
```

## Config (sanitized)
```json
{
  "collectionsFolder": "./collections",
  "parallel": true,
  "reporters": "cli,json",
  "outputDir": "./results"
}
```

## Logs / Error Output
Paste full output from:
```bash
postman-parallel --verbose
```

## Reproduction Steps
1.
2.
3.

## Expected Behavior
What did you expect to happen?

## Actual Behavior
What happened instead?

## Checklist
- [ ] I ran `postman-parallel --validate`
- [ ] I checked `docs/TROUBLESHOOTING.md`
- [ ] I removed secrets from config/logs
