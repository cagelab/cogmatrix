# CogMatrix

GraphQL service for neuroscience experimental data management.

## Project Overview

CogMatrix is designed to provide a unified way to organize, manage, and query neuroscience experiment datasets (subjects, tasks, sessions, recordings, annotations, and metadata).

The project is inspired by alyx, implemented with Node.js + TypeScript, and uses GraphQL (instead of a REST-only API) for flexible, researcher-oriented data access.

## Why GraphQL

- Request only required fields to avoid over/under-fetching
- Model complex relationships naturally (experiment -> session -> recording -> annotation)
- Aggregate related sources in a single query
- Improve exploratory workflows with self-documented schema
- Evolve schema incrementally without breaking existing analysis workflows

## Performance Philosophy

The system targets research-oriented, interactive data workflows rather than extreme QPS.

Priorities:

- Developer/researcher query experience over peak throughput
- Low-latency interactive querying for daily exploration
- Predictable behavior over premature micro-optimizations
- Clarity and maintainability of data modeling

## Quick Start (Scaffold)

### Requirements

- Node.js >= 20
- pnpm

### Install

```bash
pnpm install
```

### Run (development)

```bash
pnpm run start:dev
```

Default server port is `3000` (or `PORT` if provided).

### Common Scripts

```bash
pnpm run build
pnpm run lint
pnpm run test
pnpm run start:prod
```
