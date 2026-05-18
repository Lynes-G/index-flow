# Dashboard Link Creation Sheet Design

## Goal

Replace the current standalone "create new link" experience with a dashboard-native `Sheet` flow built with `shadcn/ui`, while keeping `/dashboard/new-link` as a fully functional fallback page and aligning all related link-management pages to one shared styling convention.

## Product Decisions

- The primary create-link experience should live inside the dashboard, not on a separate page.
- The new primary surface should be a right-side `Sheet` built with the `shadcn/ui` `Sheet` component.
- The existing `/dashboard/new-link` route should remain available as a fallback for direct visits, refreshes, and no-JavaScript cases.
- The reusable form logic should stay shared between the `Sheet` and fallback page.
- Related dashboard pages should follow the same styling convention after this work is complete.
- The preferred visual direction is a blend of the current dashboard card structure and stronger accent treatment on primary actions.

## Why The Current Version Feels Off

The current `/dashboard/new-link` page looks and behaves like a separate product surface:

- it uses a full-page route transition instead of staying in the dashboard flow
- it uses a two-column hero-style layout that does not match the current dashboard sections
- it relies on different spacing, corner radius, and card structure than the rest of the admin UI
- it makes a quick action feel heavier than it needs to be

In practice, adding a link should feel more like opening a tool drawer in a workspace than leaving the workspace entirely.

## Recommended Approach

Use a `Sheet`-first dashboard flow with a shared create form and a styled fallback page.

### Primary Flow

1. The user clicks any `Add Link` entry point inside the authenticated app.
2. The dashboard opens a right-side `Sheet`.
3. The `Sheet` renders the shared create-link form.
4. The user submits the form through the existing Convex mutation.
5. On success, the `Sheet` closes and the dashboard refreshes so the new link appears immediately.
6. If the user visits `/dashboard/new-link` directly, the fallback page renders the same form inside the shared dashboard-style shell.

### Why This Is The Best Fit

- It keeps users anchored in the dashboard context.
- It makes a common action feel fast and lightweight.
- It gives the team room to add previews, helper text, or quick-edit patterns later.
- It preserves a resilient fallback path without over-coupling navigation to JavaScript state.

## Alternatives Considered

### 1. Sheet-First With Fallback Page

This is the recommended approach.

Pros:

- best day-to-day user experience
- resilient direct-link fallback
- easy to reuse for future edit/create flows

Cons:

- requires one extra wrapper component around the form

### 2. Restyle The Existing Page First, Add Sheet Later

Pros:

- smaller short-term change

Cons:

- keeps the awkward route jump
- delays the better interaction pattern

### 3. Replace The Route Entirely With A Redirect To Dashboard

Pros:

- appears simple from a routing perspective

Cons:

- brittle for direct visits and refreshes
- weak no-JavaScript behavior
- harder to reason about when opened from multiple entry points

## Component Design

Separate the form "engine" from the presentation "containers."

### Shared Form Layer

`CreateLinkForm` remains the shared form engine.

Responsibilities:

- render fields
- run validation
- normalize the external URL
- submit through the existing Convex mutation
- surface error and pending states
- support a success callback so different containers can decide what happens next

### Sheet Container

Create a `CreateLinkSheet` wrapper around the shared form.

Responsibilities:

- control `Sheet` open and close state
- render `SheetContent`, `SheetHeader`, `SheetTitle`, and supporting copy
- provide the success behavior for the dashboard flow
- keep styling aligned with the shared dashboard card language

### Fallback Page Container

Keep `app/(app)/(admin)/dashboard/new-link/page.tsx`, but restyle it to match the same design system as the dashboard.

Responsibilities:

- render the same form in a card shell
- support direct navigation safely
- preserve access-limit handling
- visually match the rest of the dashboard experience

## Entry Points

The following current entry points should open the same `Sheet`:

- dashboard "Add New Link" action
- authenticated header "Add Link" action
- mobile user menu "Add Link" action

The fallback route remains:

- `/dashboard/new-link`

This means all common create actions share one primary experience, while the route remains a reliable fallback instead of the default interaction.

## Data Flow

### Dashboard Flow

1. User opens `Sheet`.
2. User fills out the shared form.
3. Form submits through `api.lib.links.createLink`.
4. On success, the form calls a passed success handler.
5. The `Sheet` closes.
6. The dashboard refreshes and the new link appears in the list.

### Fallback Page Flow

1. User visits `/dashboard/new-link`.
2. The page renders the same form inside the shared shell.
3. On success, the user returns to `/dashboard`.

## Styling Convention

This work should establish one consistent style language for related dashboard pages.

### Shared Visual Rules

- use the dashboard content width pattern with `max-w-7xl`
- use soft page spacing rather than hero-style full-page composition
- use `rounded-3xl` section cards for primary surfaces
- use `border-slate-200/70` or equivalent soft slate borders
- use white or near-white surfaces with subtle shadow
- reserve accent color for primary buttons, small highlights, and selected emphasis
- keep supporting text in the existing slate/gray tone family

### Surfaces To Align

These areas should follow the same convention after implementation:

- dashboard link management section
- create-link fallback page
- edit-link page
- link-related empty states
- link-related limit-reached states

### Sheet Styling Direction

The `Sheet` should feel like a natural extension of the dashboard, not a generic off-canvas panel.

Recommended treatment:

- soft white panel background
- strong but not heavy border separation
- comfortable vertical rhythm
- headline and helper copy that match dashboard tone
- accent-colored primary submit button
- secondary actions styled in the same subdued way as the dashboard

## Routing And Fallback Behavior

The app should not depend entirely on route redirects to open the `Sheet`.

Recommendation:

- keep the `Sheet` as a client-side interaction owned by the dashboard UI
- keep `/dashboard/new-link` as a real page
- do not replace the route with a forced redirect-based open state in this iteration

This avoids unnecessary complexity and keeps navigation easier to debug.

## Accessibility And Interaction Notes

- the `Sheet` must support keyboard focus management through the underlying `shadcn/ui` dialog primitives
- the close button and escape-key dismissal should work by default unless the form is actively submitting
- the header action that opens the `Sheet` should remain clearly labeled
- mobile layout should still feel intentional, even if the right-side `Sheet` becomes a more full-screen panel on smaller viewports

## Error Handling

### Shared Form Errors

- invalid URL stays inline in the form
- mutation failures show a consistent error surface in both containers
- pending state disables duplicate submits

### Container Behavior

- `Sheet` flow: keep the panel open on error so the user can correct the issue
- fallback page flow: keep the page stable on error and preserve entered values

## Testing Strategy

### Functional Checks

- header `Add Link` opens the `Sheet`
- dashboard `Add New Link` opens the `Sheet`
- mobile menu `Add Link` opens the `Sheet`
- successful create closes the `Sheet` and shows the new link in the dashboard
- direct visit to `/dashboard/new-link` still works
- validation and server errors display correctly in both containers

### Styling Checks

- create-link fallback page matches dashboard spacing and card conventions
- edit-link page matches the same shell pattern
- limit and empty states use the same surface language
- primary action styling is consistent across related pages

### Responsive Checks

- the `Sheet` remains usable on mobile widths
- the fallback page remains readable on smaller screens

## Implementation Notes

Likely implementation pieces:

- add a local `Sheet` component under `components/ui/` if it is not already present
- introduce a reusable `CreateLinkSheet` component
- update `CreateLinkForm` to support container-specific success behavior
- convert existing `Add Link` entry points to open the shared `Sheet`
- restyle `/dashboard/new-link` to the shared dashboard convention
- restyle the edit-link page and related link-management states to match

## Out Of Scope

These should stay out of this iteration unless needed for a bug fix:

- redesigning the full dashboard information architecture
- adding live link previews
- combining create and edit into one multi-mode side panel
- changing the underlying Convex create-link mutation contract

## Success Criteria

This work is successful when:

- the main create-link experience opens in a `shadcn/ui` `Sheet`
- direct visits to `/dashboard/new-link` still work cleanly
- the shared form logic is reused rather than duplicated
- adding a link feels faster and more natural inside the dashboard
- link-related dashboard pages follow one clear styling convention instead of mixed layouts
