#!/usr/bin/env python3
"""使用 faster-whisper 本地转录音频文件"""

import sys
import os

def transcribe(audio_path, model_size="base"):
    from faster_whisper import WhisperModel
    
    print(f"正在加载模型 {model_size}...")
    model = WhisperModel(model_size, compute_type="float16")
    
    print(f"正在转录: {audio_path}")
    segments, info = model.transcribe(audio_path, language="zh")
    
    print(f"检测到语言: {info.language} (概率: {info.language_probability:.2%})")
    print("-" * 40)
    
    full_text = []
    for segment in segments:
        text = segment.text.strip()
        print(f"[{segment.start:.1f}s -> {segment.end:.1f}s] {text}")
        full_text.append(text)
    
    return "".join(full_text)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python3 transcribe.py <音频文件> [模型大小: tiny/base/small/medium]")
        sys.exit(1)
    
    audio_file = sys.argv[1]
    model = sys.argv[2] if len(sys.argv) > 2 else "base"
    
    if not os.path.exists(audio_file):
        print(f"文件不存在: {audio_file}")
        sys.exit(1)
    
    result = transcribe(audio_file, model)
    print("=" * 40)
    print("转录结果:")
    print(result)
