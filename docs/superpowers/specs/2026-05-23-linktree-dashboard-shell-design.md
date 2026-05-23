# Linktree-Style Dashboard Shell Design

## Summary

Redesign the authenticated IndexFlow dashboard so desktop feels like a true app workspace instead of a long stacked content page.

The approved direction is a `Linktree-style` shell:

- a persistent left sidebar with task-based navigation,
- a wide center workspace for the active section,
- a context-aware right rail that changes based on the current task.

The goal is not to copy Linktree visually. The goal is to borrow the desktop interaction model that gives editors more breathing room, clearer focus, and a more stable relationship between controls and preview.

## Validated Decisions

- The redesign should affect the entire desktop dashboard, not only the customization area.
- The desktop dashboard should move toward a `Linktree feel`.
- Navigation should be task-based.
- The primary tasks are `Links`, `Appearance`, `Analytics`, `Username`, and `Billing`.
- The right rail should be context-aware rather than always showing the same sticky phone preview.
- The dashboard should still feel like IndexFlow, not a cloned Linktree interface.

## Problem

The current dashboard behaves more like a polished landing page made of stacked sections than a desktop editing tool.

This causes a few usability problems:

1. Desktop width is artificially constrained by repeated `max-w-7xl` shells.
2. Important tasks compete vertically instead of feeling like distinct work modes.
3. The preview feels bolted on because the page owns the preview rail while `CustomizationForm.tsx` portals the actual phone into it.
4. Analytics, customization, username management, and links all share one long scroll flow even though they are different tasks.
5. The live preview stays visually dominant even in contexts where a phone mockup is not the most useful companion.

In simple terms, the current dashboard feels like reading one very long settings article. The redesign should feel more like sitting at a desk with tools on the left, work in the middle, and live context on the right.

## Goals

- Make the dashboard feel like a desktop product workspace.
- Give the entire dashboard more horizontal breathing room on large screens.
- Separate major tasks into focused work areas instead of one stacked page.
- Keep the live preview close to the user when it helps, and swap it out when it does not.
- Preserve IndexFlow's warmer, more editorial visual personality inside a more app-like shell.

## Non-Goals

- No redesign of the public profile page in this phase.
- No changes to backend contracts, Convex schema, or Tinybird pipelines.
- No new dashboard feature scope beyond layout, navigation, and section organization.
- No attempt to fully mimic Linktree branding, color, or visual language.

## Recommended Approach

Use one shared desktop dashboard shell with three regions:

1. `Sidebar`
   Persistent task navigation and lightweight account context.
2. `Workspace`
   One active task view at a time.
3. `Context Rail`
   A right-side companion rail whose contents change by active task.

This is the recommended approach because it solves both major complaints together:

- the whole dashboard becomes full-width and easier to breathe in,
- the preview stops feeling like a global sticky object floating over unrelated content.

It also creates a stronger mental model:

- choose a task,
- work in the center,
- reference the companion rail on the right.

## Alternatives Considered

### 1. True App Shell

This is the recommended approach.

Pros:

- most clearly fixes the current page-like feel
- scales best as the dashboard grows
- gives every major task a cleaner ownership boundary
- makes the context rail easier to reason about

Cons:

- requires structural route and component reorganization
- larger change than only widening the existing page

### 2. Wide Shell With One Long Scroll Page

Pros:

- lower implementation cost
- reuses most of the current dashboard page structure

Cons:

- still feels like one long document
- harder to make the right rail feel intentional
- navigation becomes mostly decorative if the main content still stacks vertically

### 3. Customization-Only Studio

Pros:

- fast way to improve the most obvious pain point
- smallest scope

Cons:

- does not solve the "entire dashboard should feel full screen" request
- leaves the broader information architecture mismatch in place

## Information Architecture

The desktop dashboard should stop presenting all admin tasks in one continuous flow.

Instead, use one task-focused navigation model:

- `Links`
- `Appearance`
- `Analytics`
- `Username`
- `Billing`

### Navigation Rationale

This structure matches how creators think while working:

- "I want to change my links"
- "I want to style my page"
- "I want to check performance"

That is simpler than abstract groupings like "settings" or "workspace." It also maps cleanly to the product's current feature set without overdesigning future states.

## User Experience

### Desktop

Desktop should feel like an app shell, not a centered marketing container.

The expected rhythm:

- the sidebar stays visible,
- the active task fills the center workspace,
- the right rail updates to support that task,
- the top command row provides title, save state, and important actions.

Users should not need to scroll past analytics just to reach appearance controls, or see a large phone preview while trying to work on analytics.

### Mobile and Tablet

This spec is primarily about desktop shell behavior, but smaller screens should keep the current stacked model rather than forcing a cramped three-column layout.

Practical rule:

- mobile keeps top navigation and stacked sections or routes,
- desktop upgrades into the three-region shell at a large breakpoint.

The mobile experience should remain coherent even if the information architecture becomes more route-based internally.

## Shell Architecture

### Left Sidebar

Responsibilities:

- show account context,
- show task-based navigation,
- indicate the active task,
- optionally expose one or two small utility actions like "view public page" or "create link."

Visual direction:

- calmer than Linktree's stark utility sidebar,
- slightly warm surface,
- compact but comfortable spacing,
- clearer active-state styling than the current page.

The sidebar should feel like a stable home base, not another content card.

### Center Workspace

Responsibilities:

- show the active section only,
- own the section title and helper copy,
- provide a wide editing or reading surface,
- remove unnecessary nested framing inherited from the current stacked layout.

The workspace should be generous on desktop. It should use width where it helps forms, lists, and analytics grids, while still capping line length for long prose.

### Right Context Rail

Responsibilities:

- provide a task-relevant companion panel,
- stay visually stable as the user works,
- avoid wasting space on irrelevant preview content.

The context rail should remain part of the shell, but its contents should change based on the active task.

## Context Rail Behavior By Task

### Links

Show:

- compact phone preview,
- link count,
- featured link snapshot,
- optional quick reminder about drag-and-drop ordering.

Why:

Link management directly affects the public page, so preview context is still valuable.

### Appearance

Show:

- full sticky phone preview,
- current theme summary,
- maybe a small unsaved-changes indicator or preview status chip.

Why:

This is the most preview-dependent task, so the rail should behave closest to the current live-preview concept.

### Analytics

Show:

- compact public profile summary,
- date range or period label,
- top metric highlights or quick insight cards,
- no large device mockup by default.

Why:

A full phone preview adds little value while reading performance data. The rail should become an insight companion instead.

### Username

Show:

- public URL card,
- availability or status message,
- copy and share actions,
- maybe a small identity snapshot.

Why:

This task is about identity and shareability, not page composition.

### Billing

Show:

- plan summary,
- upgrade value reminders,
- account or access status.

Why:

Billing benefits more from concise account context than a phone mockup.

## Section Design By Task

### Links

The `Links` task should become a focused management surface instead of one section inside a much larger page.

Expected characteristics:

- stronger list density,
- clear primary action for adding a link,
- drag-and-drop rows remain elevated objects,
- helper copy stays brief.

### Appearance

The current customization experience should move into the `Appearance` task and become the most studio-like workspace in the app.

Expected characteristics:

- wide control surface,
- clearer grouping of tabs and settings,
- right rail owns the desktop preview,
- mobile preview sheet remains the small-screen fallback.

### Analytics

The `Analytics` task should feel like a report workspace rather than a top section in a long page.

Expected characteristics:

- wider KPI layout on desktop,
- faster scanning of trends and highlights,
- locked states and empty states treated as first-class panels,
- right rail shows summary context instead of a full phone.

### Username

The `Username` task should become a compact utility workspace.

Expected characteristics:

- flatter form layout,
- clearer status messaging,
- easier copy/share actions,
- fewer small nested boxes.

### Billing

Billing should remain expressive, but it should visually belong to the same app shell.

Expected characteristics:

- consistent shell framing,
- billing-specific emphasis inside the workspace,
- rail provides account context and upgrade guidance.

## Visual Direction

The shell should borrow Linktree's structural confidence without borrowing its visual identity.

### Keep From IndexFlow

- warm light surfaces,
- rounded forms and panels,
- editorial typography moments,
- restrained but noticeable brand color usage.

### Borrow From Linktree's Layout Logic

- persistent sidebar on desktop,
- dedicated center workspace,
- stable right rail,
- task-first editing flow,
- more application-like spacing and alignment.

### Avoid

- turning the dashboard into a monochrome utility clone,
- overfilling the shell with borders and mini cards,
- making the rail feel decorative instead of useful.

## Responsive Rules

### Large Desktop

- enable full shell with sidebar, workspace, and right rail
- allow generous width beyond the current `max-w-7xl`
- keep the right rail sticky within viewport constraints

### Laptop / Medium Desktop

- preserve shell structure if space permits
- allow the rail to narrow before collapsing
- prioritize workspace width over decorative padding

### Tablet And Down

- collapse back to a simpler stacked experience
- move rail content into inline panels or mobile preview sheets as needed
- avoid forcing three simultaneous columns

## Component and Route Boundaries

The current dashboard page coordinates too many tasks at once. This redesign should introduce stronger separation.

### New Structural Direction

- a reusable desktop dashboard shell component
- task-specific workspace content components or routes
- task-specific rail content components

### Suggested Responsibilities

- `DashboardShell`
  Owns sidebar, top command row, workspace slot, and rail slot.
- `DashboardSidebar`
  Owns task navigation and active state.
- `DashboardContextRail`
  Owns framing and sticky behavior for task-specific companion content.
- task views such as `DashboardLinksView`, `DashboardAppearanceView`, `DashboardAnalyticsView`, and so on
  Own their workspace content only.

Exact file names can change, but the separation of concerns should remain.

## Existing Files Most Affected

### [app/(app)/(admin)/layout.tsx](</D:/VS Code & Local stuff/index-flow/app/(app)/(admin)/layout.tsx>)

Expected changes:

- remove the centered `max-w-7xl` main-shell assumption on desktop
- allow the authenticated dashboard area to own a real app container
- ensure the top header and dashboard shell coexist cleanly

### [app/(app)/(admin)/dashboard/page.tsx](</D:/VS Code & Local stuff/index-flow/app/(app)/(admin)/dashboard/page.tsx>)

Expected changes:

- stop stacking all major tasks on one page for desktop
- route or compose active task content into the center workspace
- stop owning a generic desktop preview rail that applies to the whole page

### [components/dashboard/AdminShell.tsx](</D:/VS Code & Local stuff/index-flow/components/dashboard/AdminShell.tsx>)

Expected changes:

- either evolve beyond a simple centered width wrapper or replace it for desktop dashboard usage
- preserve smaller reusable surface patterns where still useful

### [components/CustomizationForm.tsx](</D:/VS Code & Local stuff/index-flow/components/CustomizationForm.tsx>)

Expected changes:

- remove ownership of the desktop preview portal target
- render workspace content only
- hand desktop rail preview responsibility to the shell or appearance task container

### [components/DashboardMetrics.tsx](</D:/VS Code & Local stuff/index-flow/components/DashboardMetrics.tsx>)

Expected changes:

- treat analytics as a full workspace view rather than one section in a stack
- widen desktop grids and simplify inherited section framing where needed

### [components/UsernameForm.tsx](</D:/VS Code & Local stuff/index-flow/components/UsernameForm.tsx>)

Expected changes:

- simplify layout to fit a dedicated utility workspace
- rely on the shell and rail for surrounding context instead of extra local boxes

### [components/ManageLinks.tsx](</D:/VS Code & Local stuff/index-flow/components/ManageLinks.tsx>)

Expected changes:

- operate as the main `Links` workspace body
- align spacing and actions with the new task-focused layout

## Interaction Notes

- the active task should be obvious in the sidebar and the top command row
- save state should remain visible during editing tasks
- the right rail should not jump unpredictably when switching tasks
- sticky behavior should feel anchored to the shell, not to random inner elements

## Accessibility Notes

- sidebar navigation should be keyboard reachable and clearly marked as active
- desktop shell must preserve sensible heading order
- the right rail must not trap keyboard users
- collapsed mobile versions of rail content should remain available in the main flow where needed
- color should not be the only active-state indicator

## Error Handling and States

- if a task has no meaningful rail companion, show a useful summary card rather than empty chrome
- empty states should still feel like part of the workspace, not floating mini pages
- locked states such as premium analytics should remain visible and understandable in the wider shell
- loading states should preserve shell structure to avoid jarring reflow

## Testing Strategy

### Manual Verification

- desktop shell feels full-width and no longer constrained like a centered content page
- sidebar remains stable while switching tasks
- `Appearance` shows the full sticky preview rail
- `Analytics`, `Username`, and `Billing` replace the phone preview with more relevant rail content
- the dashboard still works comfortably on laptop widths
- mobile and tablet do not inherit a broken desktop shell

### Regression Checks

- customization preview still reflects live unsaved edits
- link management still supports drag-and-drop and quick actions
- analytics data still renders and locked states still appear correctly
- username editing and copy/share flows still work
- billing remains reachable and visually coherent

## Risks

### Route and State Coordination

Moving from one stacked page to task-based views can create duplicated state or inconsistent save behavior if responsibilities are not clearly reassigned.

Mitigation:

Keep each task view responsible only for its own workspace content, and keep shell-level state limited to navigation and rail framing.

### Preview Ownership

The current preview architecture is split between the page and the customization form.

Mitigation:

Move desktop preview ownership fully into the shell plus `Appearance` task boundary so the data flow is easier to follow.

### Width Without Hierarchy

Simply making the dashboard wider could make it feel emptier rather than better if section hierarchy is not also improved.

Mitigation:

Pair increased width with route-based task focus, clearer workspace framing, and task-specific rail content.

## Implementation Sequence

1. Introduce the desktop dashboard shell and sidebar structure.
2. Define the task-based navigation model and active-task routing/composition.
3. Move `Appearance` preview ownership from portal-based page wiring into shell-aware task composition.
4. Extract task-specific right-rail content for `Links`, `Analytics`, `Username`, and `Billing`.
5. Refine each workspace view for wider desktop usage.
6. Verify responsive collapse behavior for smaller screens.

## Open Questions Resolved

- Should the redesign affect only customization?
  No. It should affect the entire desktop dashboard.
- Should navigation be abstract or task-based?
  Task-based.
- Should the right rail always show a phone preview?
  No. It should be context-aware.
- Should the product copy Linktree's visual style?
  No. Borrow structure, not branding.

## Spec Review Notes

This spec is intentionally focused on dashboard shell, layout, and task ownership. It does not prescribe final pixel styling for every task view, and it does not expand into new product features.
