# CogMatrix

[English](./README.md)

面向神经科学实验数据管理的 GraphQL 服务（Monorepo）。

项目受 alyx 启发，使用 Node.js + TypeScript 实现，并采用 GraphQL（而非仅 REST）来提供更灵活、面向研究者的数据访问方式。

## 项目概述

CogMatrix 旨在为神经科学实验数据（受试对象、任务、会话、记录、标注与元数据）提供统一的组织、管理与查询能力。

## 为什么选择 GraphQL

- 按需获取字段，减少过取与欠取
- 更自然地表达复杂关系（experiment -> session -> recording -> annotation）
- 单次查询聚合多源数据
- 借助 schema 自文档提升探索式查询体验
- 支持渐进式演进并降低对既有流程的影响

## 性能策略

该系统主要服务于科研场景下的交互式数据工作流，不以极端 QPS 为目标。

优先级：

- 开发者与研究者查询体验优先于峰值吞吐
- 日常探索场景下保持低延迟交互
- 可预测行为优先于过早微优化
- 保持数据建模的清晰性与可维护性

## 快速开始

### 环境要求

- Node.js >= 20
- pnpm

### 安装依赖

```bash
pnpm install
```

### 启动 API（开发模式）

在仓库根目录执行：

```bash
pnpm --filter api start:dev
```

在 `apps/api` 目录执行：

```bash
pnpm run start:dev
```

默认端口为 `3000`（可通过 `PORT` 环境变量覆盖）。

### 常用脚本

在仓库根目录执行：

```bash
pnpm --filter api build
pnpm --filter api test
pnpm --filter api test:e2e
pnpm --filter api lint
```

## 临时 Bootstrap 说明（后续删除）

以下内容当前暂时保留，待仓库清理阶段可删除：

- 模板来源：Turborepo with Vite React example
- 现有工具链：TypeScript、ESLint、Prettier
