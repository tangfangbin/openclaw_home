#!/bin/bash
# AI News Daily - 发送每日新闻到飞书
# 每天早上 8:00 自动执行

cd /Users/blade/.openclaw/workspace/skills/ai-news-daily

# 运行 Node.js 脚本生成新闻
node fetch-news.js > /tmp/ai-news-output.txt 2>&1

# 读取生成的新闻内容
NEWS_CONTENT=$(cat latest-news.md)

# 使用 openclaw 发送消息（通过飞书）
echo "$NEWS_CONTENT"

echo ""
echo "✅ AI 热点日报已生成"
