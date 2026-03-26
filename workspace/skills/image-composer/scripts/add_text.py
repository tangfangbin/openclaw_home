#!/usr/bin/env python3
"""
添加文字水印脚本
用法: python3 add_text.py --image 图.png --text "文字" --output 加字图.png
"""

import sys
import argparse
from PIL import Image, ImageDraw, ImageFont

def add_text(image_path, text, output_path, position=None, font_size=50, color=(255, 255, 255), opacity=255):
    """
    在图片上添加文字
    
    Args:
        image_path: 图片路径
        text: 文字内容
        output_path: 输出路径
        position: 位置 (x, y)，默认居中
        font_size: 字体大小
        color: RGB颜色
        opacity: 透明度 0-255
    """
    img = Image.open(image_path).convert("RGBA")
    
    # 创建文字层
    txt_layer = Image.new("RGBA", img.size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(txt_layer)
    
    # 尝试加载字体（默认系统字体）
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
    except:
        try:
            font = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", font_size)
        except:
            font = ImageFont.load_default()
    
    # 获取文字尺寸
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # 计算位置（默认居中）
    if position is None:
        x = (img.width - text_width) // 2
        y = (img.height - text_height) // 2
    else:
        x, y = position
    
    # 绘制阴影（提高可读性）
    shadow_color = (0, 0, 0, int(opacity * 0.5))
    draw.text((x + 2, y + 2), text, font=font, fill=shadow_color)
    
    # 绘制文字
    draw.text((x, y), text, font=font, fill=color + (opacity,))
    
    # 合并图层
    result = Image.alpha_composite(img, txt_layer)
    
    # 保存
    result.convert("RGB").save(output_path, "PNG")
    print(f"加字图已保存到: {output_path}")

def main():
    parser = argparse.ArgumentParser(description="在图片上添加文字")
    parser.add_argument("--image", required=True, help="图片路径")
    parser.add_argument("--text", required=True, help="文字内容")
    parser.add_argument("--output", required=True, help="输出路径")
    parser.add_argument("--x", type=int, default=None, help="X位置")
    parser.add_argument("--y", type=int, default=None, help="Y位置")
    parser.add_argument("--size", type=int, default=50, help="字体大小")
    parser.add_argument("--color", default="white", help="颜色 (white/black/red/blue)")
    
    args = parser.parse_args()
    
    position = (args.x, args.y) if args.x is not None and args.y is not None else None
    
    color_map = {
        "white": (255, 255, 255),
        "black": (0, 0, 0),
        "red": (255, 0, 0),
        "blue": (0, 0, 255),
        "gold": (255, 215, 0),
    }
    color = color_map.get(args.color.lower(), (255, 255, 255))
    
    add_text(args.image, args.text, args.output, position=position, font_size=args.size, color=color)

if __name__ == "__main__":
    main()
