---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include the targeted validation tasks required by the constitution.
Customer-visible, resolver, settings, migration, and compliance changes MUST add
or update the relevant automated coverage unless the task list documents why a
test is not applicable.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Config**: `config/*.json`
- **EverShop workspaces**: `extensions/<workspace>/src/` and `extensions/<workspace>/dist/`
- **Tests**: `tests/unit/*.test.mjs`, `tests/e2e/*.spec.ts`
- **Localization**: `translations/<locale>/*.json` or seeded CMS/settings migrations
- Paths shown below assume a Printel workspace change - adjust based on plan.md
  structure

<!-- 
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.
  
  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/
  
  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment
  
  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Identify impacted workspaces, config, and validation entry points

- [ ] T001 Identify touched surfaces in `config/`, `extensions/`, `translations/`, and `tests/`
- [ ] T002 Confirm the affected workspace/package paths in `extensions/<workspace>/`
- [ ] T003 [P] Record required validation commands (`npm run lint`, `npm run test:unit`, `npm run test:e2e`, `npm run build`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Add or update workspace migration files in `extensions/<workspace>/src/migration/`
- [ ] T005 [P] Add/update GraphQL types or settings resolvers in `extensions/<workspace>/src/graphql/`
- [ ] T006 [P] Add/update admin configuration surfaces in `extensions/<workspace>/src/pages/admin/`
- [ ] T007 Add shared storefront/config wiring in `config/default.json` or the affected workspace entry points
- [ ] T008 Prepare Romanian and English locale updates in `translations/` or seeded CMS content
- [ ] T009 Confirm non-secret environment/config changes and document any required operational follow-up

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1 ⚠️

> **NOTE: Add the narrowest automated coverage that exercises the touched risk.**

- [ ] T010 [P] [US1] Extend unit coverage in `tests/unit/[name].test.mjs`
- [ ] T011 [P] [US1] Extend storefront/admin coverage in `tests/e2e/[name].spec.ts`

### Implementation for User Story 1

- [ ] T012 [P] [US1] Implement source changes in `extensions/<workspace>/src/...`
- [ ] T013 [P] [US1] Regenerate compiled outputs in `extensions/<workspace>/dist/...`
- [ ] T014 [US1] Update related config, GraphQL, or migration surfaces
- [ ] T015 [US1] Update Romanian and English copy, seeded content, or settings labels
- [ ] T016 [US1] Add validation and explicit error handling consistent with the workspace
- [ ] T017 [US1] Re-run `npm run build:extensions` and capture resulting artifacts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 ⚠️

- [ ] T018 [P] [US2] Extend unit coverage in `tests/unit/[name].test.mjs`
- [ ] T019 [P] [US2] Extend storefront/admin coverage in `tests/e2e/[name].spec.ts`

### Implementation for User Story 2

- [ ] T020 [P] [US2] Implement source changes in `extensions/<workspace>/src/...`
- [ ] T021 [US2] Regenerate compiled outputs in `extensions/<workspace>/dist/...`
- [ ] T022 [US2] Update related config, migration, translations, or CMS content
- [ ] T023 [US2] Integrate with User Story 1 components (if needed)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 ⚠️

- [ ] T024 [P] [US3] Extend unit coverage in `tests/unit/[name].test.mjs`
- [ ] T025 [P] [US3] Extend storefront/admin coverage in `tests/e2e/[name].spec.ts`

### Implementation for User Story 3

- [ ] T026 [P] [US3] Implement source changes in `extensions/<workspace>/src/...`
- [ ] T027 [US3] Regenerate compiled outputs in `extensions/<workspace>/dist/...`
- [ ] T028 [US3] Implement the feature wiring in config, translations, and tests

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX [P] Additional unit/E2E coverage in `tests/unit/` and `tests/e2e/`
- [ ] TXXX Security hardening
- [ ] TXXX Run `npm run lint`
- [ ] TXXX Run `npm run test:unit`
- [ ] TXXX Run `npm run test:e2e` when storefront/admin flows changed
- [ ] TXXX Run `npm run build`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests MUST be added or updated before implementation is considered complete
- Source updates before compiled `dist/` artifacts
- Migrations/settings before dependent storefront or admin flows
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Extend unit coverage in tests/unit/[name].test.mjs"
Task: "Extend storefront/admin coverage in tests/e2e/[name].spec.ts"

# Launch independent workspace changes together:
Task: "Implement source changes in extensions/<workspace>/src/..."
Task: "Regenerate compiled outputs in extensions/<workspace>/dist/..."
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify required validation commands are recorded and run before sign-off
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
