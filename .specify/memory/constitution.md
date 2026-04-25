<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- Template Principle 1 -> I. EverShop Extension-First Delivery
- Template Principle 2 -> II. Romanian Storefront & Compliance Integrity
- Template Principle 3 -> III. Type-Safe Source with Committed Build Outputs
- Template Principle 4 -> IV. Script-Gated Validation is Non-Negotiable
- Template Principle 5 -> V. Secure Configuration & Reproducible Operations
Added sections:
- Operational Guardrails
- Delivery Workflow & Quality Gates
Removed sections:
- None; the placeholder template has been fully replaced with project-specific guidance
Templates requiring updates:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
- ✅ .specify/extensions/product-forge/commands/forge.md
- ✅ .specify/extensions/product-forge/commands/research.md
- ✅ .specify/extensions/product-forge/commands/product-spec.md
- ✅ .specify/extensions/product-forge/commands/retrospective.md
- ✅ .specify/extensions/product-forge/commands/implement.md
- ✅ .specify/extensions/product-forge/commands/bridge.md
- ✅ .specify/extensions/product-forge/commands/i18n-harvest.md
- ✅ .specify/extensions/product-forge/commands/test-plan.md
- ✅ .specify/extensions/product-forge/commands/test-run.md
- ✅ README.md
- ✅ QUICK_REFERENCE.md
- ⚠ pending .specify/templates/agent-file-template.md (still agent-centric but not required for this constitution adoption)
Follow-up TODOs:
- None
-->
# Printel Constitution

## Core Principles

### I. EverShop Extension-First Delivery
All storefront, admin, and domain customizations MUST be implemented through the
configured EverShop workspaces under `extensions/` or other declared configuration
surfaces in `config/default.json`. Direct edits to generated `dist/` output without
matching `src/` changes are forbidden; every workspace change MUST leave source,
compiled artifacts, copied GraphQL schema files, and config registration in sync.
Rationale: Printel ships custom behavior through `printelTheme`,
`printelLegalFooter`, and `printelCookieBanner`; extension-first delivery keeps
upgrades isolated and reproducible.

### II. Romanian Storefront & Compliance Integrity
Any customer-visible, legal, privacy, pricing, or consent change MUST preserve the
Romanian default experience (`ro`, `RON`, `Europe/Bucharest`) and update every
affected compliance surface in the same change: storefront copy, admin settings,
translations, legal pages, and ANPC/cookie flows when relevant. English assets may
accompany Romanian support, but Romanian production behavior is the release gate.
Rationale: Printel is a Romanian storefront with explicit legal-footer and
cookie-policy extensions; partial compliance changes create regulatory and trust
risk.

### III. Type-Safe Source with Committed Build Outputs
All extension logic MUST be authored in typed source files (`.ts`/`.tsx`) under
`src/`; migrations, GraphQL resolvers, admin pages, and storefront components MUST
remain aligned with their compiled `dist/` counterparts. A change is incomplete
until `npm run build:extensions` succeeds and the generated workspace outputs
reflect the source. Rationale: the repository executes compiled extension bundles
at runtime and unit tests import built resolver files from `dist/`.

### IV. Script-Gated Validation is Non-Negotiable
Changes MUST be validated through the repository's existing npm entry points
instead of ad-hoc commands. At minimum, contributors MUST run the narrowest
applicable combination of `npm run lint`, `npm run test:unit`, `npm run test:e2e`,
and `npm run build`; any user-facing, settings, migration, or resolver change MUST
include the commands that exercise the touched surface, and skipped scripts MUST be
justified in the plan or review record. Rationale: Printel's scripts encode
prerequisite compilation, Playwright setup, and workspace coordination that raw
runner commands can bypass.

### V. Secure Configuration & Reproducible Operations
Secrets MUST stay in environment files outside version control, while committed
config stays declarative in `config/*.json`, Docker compose files, and checked-in
scripts. Local, CI, and production workflows MUST rely on the documented scripts
and guards already present in the repo, including non-production-only admin
bootstrap helpers and registry-based deployment automation where applicable.
Rationale: this codebase mixes interactive setup, Dockerized Postgres, CI
bootstrap, and production image pulls; reproducibility and secret hygiene prevent
environment drift.

## Operational Guardrails

- Every new feature MUST identify its touched surfaces across `config/`,
  `extensions/`, `tests/`, `translations/`, and deployment/runtime docs before
  implementation starts.
- Customer-visible copy changes MUST update the relevant locale assets and any
  seeded CMS or settings data in the same change.
- Schema or settings additions MUST ship with the corresponding migration and
  admin/runtime retrieval path together.
- Production-impacting changes MUST preserve a documented startup path using the
  existing npm scripts and Docker or registry workflows; contributors MUST NOT
  invent parallel undocumented runbooks.

## Delivery Workflow & Quality Gates

1. Specifications and plans MUST call out the affected extension/theme workspace,
   required migrations, impacted locales, and validation commands before coding
   begins.
2. Implementation MUST begin in `src/` or config sources, then regenerate `dist/`
   and copied artifacts via the existing compile scripts before review.
3. Reviews MUST reject changes that bypass npm-script validation, leave `src` and
   `dist` out of sync, or update Romanian/legal surfaces only partially.
4. Release readiness for storefront changes MUST confirm storefront behavior,
   admin configuration flow, and automated coverage at the unit or E2E layer that
   matches the touched risk.

## Governance

This constitution overrides conflicting local habits, generated template defaults,
and undocumented workflow shortcuts. Amendments REQUIRE: (1) a written rationale,
(2) updates to every impacted SpecKit template or runtime guidance file, (3) a
semantic version decision recorded in the sync impact report, and (4) compliance
review in the related plan, review, or pull request record.

Versioning policy:

- **MAJOR**: remove a principle, weaken a mandatory gate, or redefine governance
  in a backward-incompatible way.
- **MINOR**: add a new principle or section, or materially expand required
  workflow guidance.
- **PATCH**: clarify wording, tighten examples, or make non-semantic template/doc
  sync updates.

Compliance review expectations:

- Every plan's Constitution Check MUST verify extension-first delivery,
  Romanian/compliance surface coverage, compile/output sync, script-gated
  validation, and configuration/security handling.
- Every implementation or review handoff MUST name the validation commands run or
  explicitly justify why a command was not applicable.
- Deferred constitution work MUST be tracked as an explicit TODO in the sync
  impact report; silent drift is non-compliant.

**Version**: 1.0.0 | **Ratified**: 2026-04-25 | **Last Amended**: 2026-04-25
