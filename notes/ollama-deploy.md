# Ollama 本地大模型部署笔记

> 记录时间：2026年7月 | 状态：已完成

## 硬件环境

| 组件 | 配置 |
|------|------|
| CPU | i5-14600KF (14核20线程) |
| GPU | RTX 3080 (10GB VRAM) |
| RAM | 32GB DDR5 |
| 系统 | Windows 11 |

## 为什么在本地部署

云服务器 2C2G 无 GPU，跑 7B 模型回复一个字要 30 秒。本地 RTX 3080 推理速度是秒级。面试时可以当场打开演示——这是最有说服力的。

## 部署了哪些模型

| 模型 | 大小 | 特点 | 适用场景 |
|------|------|------|----------|
| qwen2.5:7b | 4.4GB | 中文能力强 | 中文问答、文档分析 |
| llama3.1:8b | 4.7GB | 英文/通用知识广 | 英文对话、通用任务 |
| deepseek-r1:8b | 4.9GB | 推理逻辑强、显示思考过程 | 数学推理、复杂问题 |

## 配套工具

- **Open WebUI**：类 ChatGPT 界面，pip 安装，连接 Ollama
- **AnythingLLM**：RAG 知识库，桌面版一键安装
- **Python 脚本**：`local_ai_demo.py`，支持多模型切换+流式输出+对话历史

## API 配置

```bash
# 开启局域网访问
OLLAMA_HOST=0.0.0.0

# API 端点
http://localhost:11434/api/tags     # 模型列表
http://localhost:11434/v1/chat/completions  # 兼容 OpenAI 格式
```

## Python 调用示例

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"
)

response = client.chat.completions.create(
    model="qwen2.5:7b",
    messages=[{"role": "user", "content": "什么是Docker？"}],
    stream=True  # 流式输出
)

for chunk in response:
    print(chunk.choices[0].delta.content, end="")
```

## 踩坑记录

### 坑1：显存不足

同时加载两个 7B+ 模型会爆 10GB 显存。解决方案：不用的模型用 `ollama stop` 卸载。

### 坑2：Ollama 默认只监听 127.0.0.1

需要设环境变量 `OLLAMA_HOST=0.0.0.0` 才能让局域网其他设备访问。

## 总结

本地 AI 部署的核心价值：自己拥有完整的环境控制权，能展示从模型拉取到 API 调用的全过程——而不是"我用过 ChatGPT"。
