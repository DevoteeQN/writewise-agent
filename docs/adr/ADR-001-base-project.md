# ADR-001: Base Project

## Status

Accepted

## Context

WriteWise Agent is an AI agent coding competition project. The project starts
from the Prisma Next.js Auth Starter:

https://github.com/prisma/nextjs-auth-starter

The competition goal is to build original AI-assisted writing functionality,
but Phase 1 is limited to bootstrap and rebrand work. The starter already
provides a working Next.js application with authentication, Prisma, and basic
database-backed routes, so replacing that foundation would add risk without
advancing the current milestone.

## Decision

Use the Prisma Next.js Auth Starter as the base project and preserve its core
technical foundation during Phase 1.

## Reused From The Starter

- Next.js App Router structure
- NextAuth.js credentials authentication
- Prisma ORM and Prisma Postgres setup
- User and Post models
- Register, login, list, create, view, and delete flows for posts
- Database setup screen and setup instructions
- Existing lint/build tooling and dependency structure

## To Be Replaced

- Starter/blog product branding
- Generic blog-oriented homepage copy
- Demo-oriented README content
- Starter framing around posts as a blog product

The underlying `Post` model and routes remain in place during Phase 1. They are
temporarily presented as writing samples until later increments introduce
domain-specific naming and data models.

## Future Original Competition Increments

- AI feedback generation for writing samples
- Feedback persistence linked to authenticated users
- Writing rubric, score, and issue taxonomy
- Revision history and progress tracking
- Learner dashboard for writing activity and feedback trends
- Training-plan generation based on repeated writing issues
- Additional agent logs and ADRs for each major competition increment

## Consequences

This decision keeps the app runnable and reduces Phase 1 scope to rebranding,
documentation, and safety checks. Later phases can focus on original AI writing
features while building on known-good auth and persistence behavior.
