---
name: Pull Request
about: Submit code changes or documentation updates
title: 'feat: implement caching for listing personnel'
labels: enhancement
assignees: anicmarko9
---

# Pull Request

**Description**  
Provide a brief summary of the changes made. Mention if this affects the backend, database, API, or caching system.

- [ ] Bug fix
- [ ] Feature enhancement
- [ ] Documentation update

**Related Issues**  
Link to any related issues or tickets:

- Issue #[issue_number]

**Changes Made**  
List the key changes in your code:

1. Modified `...` (e.g., `cache.service.ts`) to improve Redis caching.
2. Added a new service `/core/utils/...` for user session validation.
3. Updated PostgreSQL entity to include `...`.

**Testing**  
Describe how you tested the changes:

- Unit tests: [e.g., Jest]
- End-to-end tests: [e.g., Postman collection]

**Checklist**  
Ensure the PR meets these conditions:

- [ ] **Type-checking passes** (`npm run typecheck`)
- [ ] **Prettier formatting applied** (`npm run ci:format`)
- [ ] **ESLint rules satisfied** (`npm run ci:lint`)
- [ ] **All tests pass** (`npm run ci:test`)
- [ ] **New/updated endpoints documented**
- [ ] **Database migrations handled** (if applicable)
- [ ] **Environment variables updated** (if applicable)

**Screenshots (if applicable)**  
If the changes affect the UI, add relevant screenshots to show the impact.

**Additional Context**  
Mention any considerations (like breaking changes, deployment steps, or specific database migrations) required for this PR.
