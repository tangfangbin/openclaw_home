# Speech Recognition Skill

使用本地 faster-whisper 进行语音识别。

## 使用方式

发送音频文件（.mp3/.m4a/.wav/.ogg）给机器人，自动转录为文字。

## 依赖

- faster-whisper（已安装）
- ffmpeg（用于音频格式转换）

## 模型

默认使用 `base` 模型（约 140MB），识别中文+英文效果不错。
如需更好效果可换 `small` 或 `medium`（需要更多下载时间）。
