# HEARTBEAT.md

## 每日定时任务

每天早上 8:00 定时执行以下任务。

---

### 任务一：AI 热点日报

1. 检查 `~/.openclaw/workspace/ai-news/daily-{today}.md` 是否存在
2. 如不存在，使用 `ai-news-daily` skill 生成
3. 生成后发送飞书消息："🦐 今日 AI 新闻已备好，查看：~/.openclaw/workspace/ai-news/daily-{date}.md"

---

### 任务二：成人用品跨境电商行业日报

1. 检查 `~/.openclaw/workspace/adult-ecommerce-news/daily-{today}.md` 是否存在
2. 如不存在，使用 `adult-ecommerce-news` skill 生成
3. 生成后发送飞书消息："🦐 今日成人用品跨境电商新闻已备好，查看：~/.openclaw/workspace/adult-ecommerce-news/daily-{date}.md"

---

### 注意事项

- 检查文件是否存在，避免重复生成
- 时间必须是**昨天**的新闻
- 详细格式要求见各 skill 的 SKILL.md
