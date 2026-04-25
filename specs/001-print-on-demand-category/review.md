# Pre-Implementation Review

**Feature**: Print-on-Demand Category Delivery Behavior  
**Artifacts reviewed**: spec.md, plan.md, tasks.md, checklists/print-on-demand.md, checklists/requirements.md, .specify/memory/constitution.md, .analyze-done  
**Review model**: GPT-5-class (Copilot CLI)  
**Generating model**: Unknown / not provided

## Summary

| Dimension | Verdict | Issues |
|-----------|---------|--------|
| Spec-Plan Alignment | WARN | Core behavior aligns, but SC-004 still expects 3 categories while plan/tasks verify 2; no explicit accessibility coverage |
| Plan-Tasks Completeness | WARN | Most plan workstreams map cleanly, but admin verification for multiple configured categories is not explicit in tasks |
| Dependency Ordering | WARN | Fixture/setup ordering is still shaky: T021 depends on T022 conceptually, and T011 may depend on T013 |
| Parallelization Correctness | WARN | Parallel groups are mostly clean, but Group 4 likely hides a fixture dependency |
| Feasibility & Risk | WARN | T029/T030 are large, high-risk tasks around checkout/order semantics and stock behavior |
| Standards Compliance | PASS | Strong alignment with constitution: extension-first, Romanian + English copy, build-output sync, script-gated validation |
| Implementation Readiness | WARN | Most tasks are executable, but some “exact path” tasks still use broad globs and one success criterion remains mismatched |

**Overall**: READY WITH WARNINGS

## Findings

### Critical (FAIL -- must fix before implementing)
None.

### Warnings (WARN -- recommend fixing, can proceed)
1. **Success criteria drift remains**: spec SC-004 requires support/verification for **at least 3 POD categories**, while the revised plan/tasks explicitly validate **2 categories**.
2. **Admin multi-category verification is under-specified**: the plan’s verification section calls for save/reopen coverage for Category A and B, but T012 only says “save/reopen and invalid validation flows,” not clearly two categories.
3. **Fixture ordering still needs cleanup**: T021 (purchase-flow E2E) is listed before T022 (two-category E2E fixture data), and T011 is parallelized with T013 even though reusable fixtures may be a prerequisite.
4. **Parallel group 4 is not fully independent**: if T011 uses the fixture builders from T013, `[P]` is inaccurate.
5. **High-risk logic is concentrated**: T029 and T030 bundle cart, checkout, order-placement, and stock-decrement behavior into very large tasks; that raises regression risk.
6. **Some tasks are still not fully path-specific**: T032/T038/T039/T043 rely on `dist/**` or wildcard targets, which is weaker than the “exact file paths” standard.
7. **Accessibility is not called out**: the plan covers performance and localization well, but there is no explicit treatment of admin form accessibility or changed storefront CTA/delivery text semantics.

### Observations (informational)
1. The revised plan materially fixes the earlier major design gap by defining full purchase-flow continuity through order placement.
2. Constitution compliance is strong: extension-first delivery, Romanian-first localization, committed build outputs, and npm-script validation are all explicit.
3. Parallel-group sizing is otherwise disciplined and respects the max-3 constraint.

## Recommended Actions
- [ ] Reconcile SC-004 with the plan/tasks: either raise verification to 3 categories or amend the success criterion to 2.
- [ ] Make T012 explicitly cover save/reopen for multiple POD categories, not just one generic category flow.
- [ ] Move T022 ahead of T021, and place T013 before any tests that depend on it.
- [ ] Remove `[P]` from any test task that depends on fixture-builder creation.
- [ ] Split T029 and/or T030 into smaller tasks if possible (cart rules vs checkout validation vs order-placement stock behavior).
- [ ] Replace wildcard-only output tasks with more concrete generated-file targets where feasible.
- [ ] Add a brief accessibility requirement/check for the new admin controls and updated storefront CTA/delivery messaging.
