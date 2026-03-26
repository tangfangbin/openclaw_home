---
name: image-gen
description: "用 MiniMax image-01 模型生成图片并发送到飞书。当用户说'生成图片'、'画一张'、'生图'时激活。"
---

# 图片生成 Skill

## 触发条件
用户请求生成图片时使用（"生成一张图片"、"画一个XXX"、"生图"等）

## 执行步骤

### 1. 调用 MiniMax image-01 API 生成图片

```bash
source ~/.openclaw/.env 2>/dev/null

RESPONSE=$(curl -s -X POST "https://api.minimaxi.com/v1/image_generation" \
  -H "Authorization: Bearer $MOONSHOT_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"image-01\",
    \"prompt\": \"${PROMPT}\",
    \"aspect_ratio\": \"1:1\",
    \"response_format\": \"url\"
  }")

IMAGE_URL=$(echo "$RESPONSE" | python3 -c "
import json, sys, urllib.request
d = json.load(sys.stdin)
url = d['data']['image_urls'][0]
output_path = '/Users/blade/.openclaw/workspace/img_$(date +%s).png'
urllib.request.urlretrieve(url, output_path)
print(output_path)
")
```

### 2. 发送到飞书

```bash
openclaw message send \
  --channel feishu \
  --target "user:ou_7a1fdc28fc008f1c4787cccb092f3124" \
  --media "$IMAGE_URL"
```

## 参数
- `${PROMPT}`: 用户想要的图片描述（英文效果更好）

## 注意事项
- 图片比例默认为 1:1
- 生成后自动发到飞书，无需手动操作
- 图片保存在 ~/.openclaw/workspace/
