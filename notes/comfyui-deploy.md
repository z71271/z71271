# ComfyUI / Stable Diffusion 部署笔记

> 记录时间：2026年8月 | 状态：已完成

## 概述

在 RTX 3080 上部署 ComfyUI，实现文生图和图生图工作流。

## 环境

- GPU: NVIDIA RTX 3080
- OS: Ubuntu
- Python: 3.10+

## 部署步骤

```bash
# 克隆 ComfyUI
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 启动
python main.py --listen 0.0.0.0 --port 8188
```

## 模型下载

将模型文件放入 `models/checkpoints/` 目录。

### 推荐模型
- SD 1.5 / SDXL 基础模型
- LoRA 模型按需下载

## 工作流

ComfyUI 使用节点式工作流，通过连线组合不同节点：

1. **文生图**：Load Checkpoint → CLIP Text Encode → KSampler → VAE Decode → Save Image
2. **图生图**：Load Image → Load Checkpoint → CLIP Text Encode → KSampler → VAE Decode → Save Image

## 与 Ollama 配合

ComfyUI + Ollama 可以在同一台机器上运行，GPU 内存需要合理分配。

## 踩坑

- CUDA 版本需要与 PyTorch 匹配
- 大模型加载需要足够 GPU 显存（8GB+）
- 建议通过 `--lowvram` 参数启动以节省显存
