# Errors Log

Command failures, exceptions, and unexpected behaviors.

---

## [ERR-20260326-001] feishu_message

**Logged**: 2026-03-26T13:24:00+08:00
**Priority**: medium
**Status**: wont_fix
**Area**: infra

### Summary
Feishu message tool requires card parameter even when not using interactive cards

### Error
```
Validation failed for tool "message":
  - card: must have required property 'card'
```

### Context
When sending simple text messages via feishu, the tool required a card parameter even though it was a basic text message.

### Suggested Fix
Use card: {} (empty object) when sending simple text messages, or use openclaw CLI instead

### Metadata
- Reproducible: yes
- Related Files: ~/.openclaw/workspace/HEARTBEAT.md

---
