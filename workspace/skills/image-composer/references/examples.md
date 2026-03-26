# 图像合成示例

## 场景1：点心照片 + 中餐厅背景

### 所需素材
1. 用户提供的点心原图
2. 中餐厅背景图（可AI生成）

### 执行命令

**Step 1**: 先生成中餐厅背景
```bash
python3 generate_background.py --prompt "luxury Chinese restaurant interior, red gold decor, lanterns"
```

**Step 2**: 合成点心+背景
```bash
python3 compose_with_background.py \
  --foreground 用户点心图.png \
  --background 中餐厅背景.jpg \
  --output 合成图.png \
  --scale 0.5
```

## 场景2：添加文字水印

```bash
python3 add_text.py \
  --image 合成图.png \
  --text "美食推广" \
  --output 最终图.png \
  --size 80 \
  --color gold \
  --y 100
```

## 场景3：人物照片替换背景

```bash
python3 compose_with_background.py \
  --foreground 人物图.png \
  --background 新背景.jpg \
  --output 新图.png \
  --scale 0.8
```

## 注意事项

1. **前景图需要PNG透明背景**效果最好，如果是JPG需要主体和背景差异大
2. **缩放比例**：前景图太大时用 `--scale` 调整
3. **位置调整**：用 `--x` `--y` 精确控制位置

## 局限性

- 头发等复杂边缘的抠图效果有限
- 如果用户原图背景复杂，合成效果可能不理想
- 最佳效果需要用户提供：透明背景PNG + 分开的背景图
