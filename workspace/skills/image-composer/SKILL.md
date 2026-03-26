---
name: image-composer
description: 图像合成与编辑技能。使用Python PIL库进行图像合成、背景替换、添加文字/水印、图像叠加等操作。当用户需要：(1) 将主体图像放到新背景中 (2) 合成海报/宣传图 (3) 给图片添加文字水印 (4) 将多张图片合并 (5) 保持原图主体不变只加背景/滤镜 时使用此技能。
---

# 图像合成与编辑技能

## 能力范围

| 功能 | 说明 |
|------|------|
| 背景替换 | 将主体图像放到新背景中 |
| 图像叠加 | 将多张图片按位置合并 |
| 添加文字 | 在图片上添加文字/水印 |
| 尺寸调整 | 调整图像大小、比例 |
| 滤镜效果 | 添加模糊、亮度、对比度等 |

## 限制

- **无法完美抠图**：对于复杂边缘（如头发）的背景替换，效果可能不理想
- **需要用户配合**：最好提供主体图和背景图分别的素材

## 工作流程

### 1. 收集素材

从用户获取：
- 主体图像（如点心照片）
- 背景素材（如中餐厅图片）
- 或其他需要叠加的元素

### 2. 执行合成

根据用户需求，选择合适的脚本：

```bash
# 背景替换
python3 ~/.openclaw/workspace/skills/image-composer/scripts/compose_with_background.py \
  --foreground 用户图.png \
  --background 背景图.jpg \
  --output 合成图.png

# 添加文字水印
python3 ~/.openclaw/workspace/skills/image-composer/scripts/add_text.py \
  --image 图.png \
  --text "文字内容" \
  --output 加字图.png
```

### 3. 输出结果

生成合成图并发送给用户

## 脚本列表

| 脚本 | 功能 |
|------|------|
| `compose_with_background.py` | 背景替换（需要用户提供前景+背景图） |
| `add_text.py` | 添加文字水印 |
| `resize_image.py` | 调整图像尺寸 |
| `add_blur.py` | 添加背景模糊效果 |

## 注意事项

1. **用户必须提供素材图**：无法凭空生成用户的原图内容
2. **复杂抠图效果有限**：头发等复杂边缘可能处理不好
3. **优先推荐用户手动合成**：如果用户对效果要求高，建议用Canva/Photoshop

## 参考资料

详见 `references/examples.md`
