---
name: reflex
description: Build, migrate, debug, test, and verify React, React Native, SSR, or headless applications that use Reflex (reflex.js.org, @flexsurfer/reflex), the re-frame-style JavaScript/TypeScript state library. Use for canonical Reflex application architecture, state roots, events, subscriptions, effects, coeffects, AppContracts, feature modules, platform adapters, migration from other state stores, and focused DevTools MCP inspection. Do not use for the Python Reflex framework (reflex.dev), react-reflex, or reflexjs.
---

# Reflex

Treat `@flexsurfer/reflex` as Reflex. Never substitute the Python Reflex framework, `react-reflex`, or `reflexjs`.

## Load Only The Needed Reference

- Read [architecture.md](references/architecture.md) before changing application-authored Reflex state, contracts, handlers, subscriptions, modules, or runtime composition.
- Read [new-project.md](references/new-project.md) to create a project or introduce the canonical application boundary.
- Read [events-effects.md](references/events-effects.md) only for events, effects, coeffects, interceptors, or external ingress.
- Read [subscriptions.md](references/subscriptions.md) only for reactive roots, derived data, query parameters, equality, or view wiring.
- Read [migrate-existing-state.md](references/migrate-existing-state.md) for migration from React state, Context, Redux, Zustand, MobX, reducers, or service-owned state.
- Read [setup.md](references/setup.md) only when packages, bindings, DevTools, MCP, or a headless entry are missing.
- Read [verification.md](references/verification.md) after the smallest relevant code/type check when focused tests or live runtime evidence are useful.

Do not load unrelated references. All detailed guidance is one link away from this file.

## Workflow

1. Detect the framework, execution targets, package manager, installed Reflex API, and local test/typecheck commands.
2. Distinguish application authoring from work inside the `@flexsurfer/reflex` package; the canonical application rules do not govern framework internals.
3. For a canonical app, discover in this order: `src/app/reflex/catalog.ts` -> `contracts.ts` -> the owning feature or selected `platform/<target>` module. For a legacy app, locate its smallest existing state index, then migrate the touched vertical slice deliberately.
4. Search direct catalog literals or symbols with exact-match `rg`. Read the smallest relevant function or file section; do not scan every feature or broad store file.
5. Read the routed reference, update every contract/catalog/registration surface it names, and preserve one runtime owner and one reactive graph per execution owner.
6. Run the narrowest useful formatter, typecheck, and test. Use runtime inspection only for evidence static checks cannot provide.

## Context And Runtime Discipline

- Do not load `llms.txt` or broad state dumps while the catalog, contract, exact search, or scoped runtime tools can answer the question.
- Treat initial/hydrated state, accepted event values, snapshots, and subscription results as runtime-owned; never mutate them outside an event handler's `draftState`.
- Call `app_status` first after a cold start or reload and pass a selected `runtimeId` when more than one runtime is connected.
- Use only tools and capabilities advertised by the connected DevTools server. Inspection is read-only by default; never work around a denied mutation capability.
- Treat a changed `sessionEpoch` as a new DevTools session and discard its old trace IDs.
