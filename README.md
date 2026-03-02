# CogMatrix

[中文](./README.zh-CN.md)

GraphQL service for neuroscience experimental data management (Monorepo).

CogMatrix is designed to provide a unified way to organize, manage, and query neuroscience experiment datasets (subjects, tasks, sessions, recordings, annotations, and metadata).

The project is inspired by alyx, implemented with Node.js + TypeScript, and uses GraphQL (instead of a REST-only API) for flexible, researcher-oriented data access.


## Project Overview

CogMatrix provides a unified way to organize and query neuroscience experiment data.

## Why GraphQL

- Request only required fields to avoid over/under-fetching
- Model complex relationships naturally (experiment -> session -> recording -> annotation)
- Aggregate related sources in a single query
- Improve exploratory workflows with self-documented schema
- Evolve schema incrementally without breaking existing workflows

## Performance Philosophy

The system targets research-oriented, interactive data workflows rather than extreme QPS.

- Developer/researcher query experience over peak throughput
- Low-latency interactive querying for daily exploration
- Predictable behavior over premature micro-optimizations
- Clarity and maintainability of data modeling

## Quick Start

### Requirements

- Node.js >= 20
- pnpm

### Install

```bash
pnpm install
```

### Run API (development)

From repository root:

```bash
pnpm --filter api start:dev
```

From `apps/api`:

```bash
pnpm run start:dev
```

Default server port is `3000` (or `PORT` if provided).

### Common scripts

From repository root:

```bash
pnpm --filter api build
pnpm --filter api test
pnpm --filter api test:e2e
pnpm --filter api lint
```

## Temporary Bootstrap Notes (To Remove Later)

The following starter notes are intentionally kept for now and can be deleted later when repository cleanup is complete:

- Template origin: Turborepo with Vite React example
- Existing utility stack: TypeScript, ESLint, Prettier
