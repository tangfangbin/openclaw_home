#!/bin/bash
# 用法: feishu_image_gen.sh <prompt> [output_filename]
# 示例: feishu_image_gen.sh "一只可爱的牛头梗趴在草地上睡觉" "bull_terrier.png"

set -e

PROMPT="${1:-A cute animal}"
OUTPUT_FILE="${2:-/Users/blade/.openclaw/workspace/$(date +%s).png}"
FEISHU_TARGET="user:ou_7a1fdc28fc008f1c4787cccb092f3124"

# 加载环境变量
source ~/.openclaw/.env 2>/dev/null

# 生成图片
echo "🎨 正在生成图片..."
IMAGE_URL=$(curl -s -X POST "https://api.minimaxi.com/v1/image_generation" \
  -H "Authorization: Bearer $MOONSHOT_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"image-01\",
    \"prompt\": \"$PROMPT\",
    \"aspect_ratio\": \"1:1\",
    \"response_format\": \"url\"
  }" | python3 -c "
import json, sys, urllib.request
d = json.load(sys.stdin)
url = d['data']['image_urls'][0]
urllib.request.urlretrieve(url, '$OUTPUT_FILE')
print('$OUTPUT_FILE')
")

echo "✅ 图片已保存: $IMAGE_URL"

# 发送到飞书
echo "📤 正在发送到飞书..."
openclaw message send \
  --channel feishu \
  --target "$FEISHU_TARGET" \
  --media "$IMAGE_URL"

echo "✅ 完成！"
