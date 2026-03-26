#!/usr/bin/env python3
"""
图像背景替换脚本
用法: python3 compose_with_background.py --foreground 图.png --background 背景.jpg --output 合成图.png
"""

import sys
import os
import argparse
from PIL import Image, ImageFilter

def compose_with_background(foreground_path, background_path, output_path, position=None, scale=None):
    """
    将前景图像放到背景中
    
    Args:
        foreground_path: 前景图路径
        background_path: 背景图路径  
        output_path: 输出路径
        position: 位置 (x, y)，默认居中
        scale: 前景缩放比例，默认None表示保持原尺寸
    """
    # 打开前景和背景图
    fg = Image.open(foreground_path).convert("RGBA")
    bg = Image.open(background_path).convert("RGBA")
    
    # 如果指定了缩放比例
    if scale:
        new_width = int(fg.width * scale)
        new_height = int(fg.height * scale)
        fg = fg.resize((new_width, new_height), Image.Resampling.LANCZOS)
    
    # 计算位置（默认居中）
    if position is None:
        x = (bg.width - fg.width) // 2
        y = (bg.height - fg.height) // 2
    else:
        x, y = position
    
    # 确保背景足够大
    if x + fg.width > bg.width or y + fg.height > bg.height:
        # 缩放前景图以适应背景
        max_width = bg.width - x
        max_height = bg.height - y
        scale_w = max_width / fg.width
        scale_h = max_height / fg.height
        scale = min(scale_w, scale_h, 1.0)
        new_width = int(fg.width * scale)
        new_height = int(fg.height * scale)
        fg = fg.resize((new_width, new_height), Image.Resampling.LANCZOS)
        x = (bg.width - fg.width) // 2
        y = (bg.height - fg.height) // 2
    
    # 合成
    bg.paste(fg, (x, y), fg)
    
    # 保存
    bg.convert("RGB").save(output_path, "PNG")
    print(f"合成图已保存到: {output_path}")

def main():
    parser = argparse.ArgumentParser(description="将前景图放到背景中")
    parser.add_argument("--foreground", required=True, help="前景图路径")
    parser.add_argument("--background", required=True, help="背景图路径")
    parser.add_argument("--output", required=True, help="输出图路径")
    parser.add_argument("--x", type=int, default=None, help="X位置")
    parser.add_argument("--y", type=int, default=None, help="Y位置")
    parser.add_argument("--scale", type=float, default=None, help="缩放比例")
    
    args = parser.parse_args()
    
    position = (args.x, args.y) if args.x is not None and args.y is not None else None
    
    compose_with_background(
        args.foreground,
        args.background,
        args.output,
        position=position,
        scale=args.scale
    )

if __name__ == "__main__":
    main()
