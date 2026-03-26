# Learnings Log

Captured learnings, corrections, and discoveries. Review before major tasks.

---

## [LRN-20260326-001] image_generation

**Logged**: 2026-03-26T13:34:00+08:00
**Priority**: critical
**Status**: pending
**Area**: image_generation

### Summary
AI image generation often produces incorrect human hand anatomy - must explicitly prompt "each hand has exactly 5 fingers"

### Details
When generating images of people, AI models frequently create hands with wrong number of fingers (4, 6, or more). User Alex repeatedly corrected this. Must always include explicit hand anatomy instructions in prompts.

### Suggested Action
For any image generation involving people, always include in prompt:
- "each hand has exactly five fingers: thumb, index, middle, ring, pinky"
- "both hands have five fingers each"
- For multiple people, specify per person

### Metadata
- Source: user_feedback
- Tags: image-generation, anatomy, human-body
- See Also: LRN-20260326-002

---

## [LRN-20260326-002] skill_design

**Logged**: 2026-03-26T09:08:00+08:00
**Priority**: high
**Status**: pending
**Area**: config

### Summary
HEARTBEAT.md should only coordinate tasks, detailed format requirements belong in skill SKILL.md files

### Details
User Alex pointed out that heartbeat task details should not be in HEARTBEAT.md - it should be simplified to just coordination/checking. Detailed format specifications, search queries, and output requirements should live in each skill's SKILL.md file.

### Suggested Action
- HEARTBEAT.md: Only check if file exists, call skill, send message
- SKILL.md: Contains full execution flow + output format + search queries + example reference

### Metadata
- Source: user_feedback
- Tags: skill-design, heartbeat, openclaw
- See Also: LRN-20260326-003

---

## [LRN-20260326-003] news_format

**Logged**: 2026-03-26T08:33:00+08:00
**Priority**: high
**Status**: pending
**Area**: docs

### Summary
AI daily news format: 10 China + 10 overseas news, each with source link, ending with insight summary (tech trends, industry trends, business opportunities)

### Details
User provided exact format for AI news daily report:
- File header: ---
- Title: 📋 AI 热点日报 — YYYY年M月D日（周X）
- 🇨🇳 国内 AI 热点 (10 items)
- 🌍 海外 AI 热点 (10 items, 💥 for major news)
- 💡 洞察总结 with 🔬 技术趋势, 📊 行业趋势, 💰 商业机会
- File ending: --- + 🦐

Each news item format: "标题（[来源名称](URL)）"

### Metadata
- Source: user_feedback
- Related Files: ~/.openclaw/workspace/skills/ai-news-daily/SKILL.md
- Tags: news-format, daily-report, template

---

## [LRN-20260326-004] adult_ecommerce_news_format

**Logged**: 2026-03-26T08:33:00+08:00
**Priority**: high
**Status**: pending
**Area**: docs

### Summary
Adult products cross-border e-commerce daily format: 6 overseas + 6 China news, with insight summary (industry trends, business opportunities, platform policy changes)

### Details
User provided exact format for adult e-commerce news:
- File header: ---
- Title: 🦐 成人用品跨境电商行业日报 📅 YYYY年M月D日（周X）
- 【🌐 海外跨境电商热点】 (6 items)
- 【🇨🇳 国内行业动态】 (6 items)
- 【💡 行业洞察总结】 with sections: 行业趋势, 商业机会, 平台政策变化
- File ending: 数据来源 + 🦐

Each news item format: "标题（[来源名称](URL)）"

### Metadata
- Source: user_feedback
- Related Files: ~/.openclaw/workspace/skills/adult-ecommerce-news/SKILL.md
- Tags: news-format, adult-ecommerce, daily-report

---
