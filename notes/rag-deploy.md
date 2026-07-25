# RAG 知识库部署笔记

> 记录时间：2026年7月 | 状态：已完成

## RAG 是什么

RAG = Retrieval-Augmented Generation（检索增强生成）

简单说：**让 AI 先翻你的文档，再回答问题**。

没有 RAG：问 "我会什么技术？" → AI 瞎编
有 RAG：问 "我会什么技术？" → AI 翻你的简历 → 准确回答

## 技术原理

```
用户提问 → 向量检索（从知识库找相关文档片段）→ 拼接上下文 → LLM 生成回答
              ↑
知识库（文档 → 切块 → 向量化 → 存入向量数据库）
```

两个关键组件：
1. **Embedding 模型**：把文字转成向量（数字），用于计算"相似度"
2. **向量数据库**：存向量 + 快速检索

## 工具选型

我选了 **AnythingLLM**（桌面版），原因：

- 一键安装，不需要 Docker（Docker Hub 拉不到镜像的痛...）
- 内置 Embedding 模型和向量数据库（LanceDB）
- 直接连接 Ollama
- 支持拖拽上传文档

对比过的方案：
- Dify：功能全但需要 5-6 个 Docker 容器，资源吃太多
- MaxKB：国产但社区太小
- FastGPT：部署复杂

## 部署步骤

1. 下载 AnythingLLM Windows 版
2. 安装启动
3. 设置 LLM Provider → Ollama（http://localhost:11434）
4. 选择模型 → qwen2.5:7b
5. Embedding → AnythingLLM Embedder（内置）
6. 向量数据库 → LanceDB（内置）
7. 创建工作区 → "我的技术知识库"
8. 上传文档 → 拖入技术笔记/简历

**一共不到 10 分钟。**

## 知识库内容

上传了这些文档：

- 技术技能清单（网络/Linux/Web/AI/Docker/Python）
- Dockerfile 学习笔记
- Ollama 部署笔记
- 简历关键信息

## RAG 问答测试结果

| 问题 | 结果 |
|------|------|
| 郑敬耀的网络技能怎么样？ | ✅ 准确提到 90分、eNSP、OSPF、BGP |
| 他会用Docker吗？ | ✅ 准确提到 Dockerfile、7个指令、compose |
| 本地部署了哪些AI模型？ | ✅ 准确提到 qwen2.5、llama3.1、deepseek-r1 |
| 服务器配置是什么？ | ✅ 准确提到阿里云 2C2G |

**5个问题全对，没有幻觉。**

## 总结

RAG 是让 AI "懂你"的最实用方案。不需要微调模型（费GPU），不需要重新训练，只需把文档扔进知识库。对于技术面试场景：面试官如果问"AI 懂什么"，你不仅能说，还能当场演示——上传一份新文档，问 AI 相关问题，立刻看到效果。
