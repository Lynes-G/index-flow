# Public Profile Hero Stack Design

## Summary

This design updates the public profile page from a balanced but somewhat top-heavy layout into a more memorable identity-led layout. The new direction is a `Hero Stack`:

1. A strong banner sets the mood.
2. A compact floating identity card overlaps the banner.
3. One featured link sits directly under the identity card as the primary call to action.
4. The rest of the links continue in a simpler secondary section.
5. The QR card and footer remain supporting elements lower on the page.

This direction combines the strongest parts of earlier layout exploration:

- The visual identity and floating-card feeling from the `Floating center card` concept.
- The focused action and stronger link priority from the `Featured first link` concept.

The goal is to make the page feel more branded without reducing clarity or usability.

## Problem

The current public profile page has good building blocks, but the information hierarchy can feel too evenly weighted at the top:

- The banner, profile card, details, socials, and links all compete for attention early.
- The page can feel visually heavy before the user reaches the links.
- The main action is not clearly prioritized when a creator wants to highlight one destination.

In simple terms, the page currently introduces everything at once. The redesign should introduce the person first, then guide the visitor to the most important action.

## Goals

- Make the first screen feel more distinctive and memorable.
- Keep the layout balanced rather than overly decorative.
- Reduce visual heaviness before the links section.
- Give one primary link a clearly featured position.
- Preserve good mobile readability and desktop rhythm.
- Create a layout foundation that can later become one user-selectable profile layout option.

## Non-Goals

- Redesigning the theme system, color presets, or typography system.
- Reworking link analytics behavior.
- Changing existing public profile data loading patterns.
- Building the full layout-selector feature in this phase.
- Supporting multiple featured links in the initial implementation.

## User Experience Direction

The intended feeling is:

- Personal first
- Branded but controlled
- Clear next step

Real-world analogy:
The top of the page should feel like meeting the person at the entrance, then immediately seeing a clear sign that says where to start.

## Proposed Layout

### 1. Banner Layer

The existing banner remains the main atmospheric background near the top of the page.

Behavior:

- Keep support for either a custom banner image or an accent-driven gradient fallback.
- Preserve current rounded corners and layered overlay treatment unless minor visual tuning is needed.
- Use the banner as visual context, not as a content container.

Why:
The banner gives identity without adding more text competition.

### 2. Floating Identity Card

The identity card overlaps the bottom area of the banner and becomes the main introduction block.

Contents:

- Profile picture
- Username
- Short description
- Profile details
- Social links

Behavior:

- Keep the identity card compact.
- Avoid letting profile details expand so much that they push links too far down.
- Use tighter spacing than the current layout.
- Maintain a centered composition by default.

Why:
This keeps the person as the hero while stopping the intro area from becoming oversized.

### 3. Featured Link Card

A new featured link card appears directly under the identity card.

Contents:

- Link title
- Optional short supporting text if already available or derivable
- Clear call-to-action styling

Behavior:

- Only one link is featured in the initial design.
- The featured link should visually stand apart from the standard links.
- The card should read as the primary next action after the visitor sees the identity section.

Why:
This gives creators a clean “start here” action without turning the page into a dense dashboard.

### 4. Standard Links Section

All remaining links appear in a simpler section below the featured card.

Behavior:

- Keep the section visually quieter than the featured link.
- Reuse existing link rendering patterns where possible.
- Support both stacked and grid-like rendering if already present in the current link layout system.
- Preserve accessibility and touch-target quality.

Why:
Once the featured link handles emphasis, the rest of the links can become easier to scan.

### 5. QR Card and Footer

The QR card and footer remain lower-priority supporting elements.

Behavior:

- Keep them below the standard links section.
- Avoid moving them into the hero area.
- Preserve current functionality.

Why:
These are useful additions, but they should not compete with the identity and primary action.

## Information Hierarchy

The new reading order should be:

1. Who is this?
2. What is the main action?
3. What other destinations are available?
4. What supporting utilities exist?

This is a better fit for a public profile page because it mirrors how a visitor naturally decides where to click.

## Component Design

The current [components/PublicPageContent.tsx](D:/VS%20Code%20&%20Local%20stuff/index-flow/components/PublicPageContent.tsx) file should evolve into clearer sections with smaller responsibilities.

Suggested component boundaries:

- `PublicPageContent`
  - Owns overall composition and layout branching.
- `ProfileHero`
  - Renders banner + floating identity card.
- `FeaturedLinkCard`
  - Renders the single highlighted link.
- `LinksSection`
  - Renders remaining links and section heading.
- Existing supporting components stay reused where appropriate:
  - `ProfileDetails`
  - `SocialLinks`
  - `ProfileQrCard`
  - `PublicPageFooter`

Why this split helps:

- Each unit has one main responsibility.
- Layout variants become easier to manage later.
- The file becomes easier to teach, debug, and iterate on.

## Data Model Direction

The current data model can stay mostly intact.

The main likely addition is support for a single featured link reference.

Possible model shapes:

- `featuredLinkId`
- A boolean flag on a link such as `isFeatured`

Recommended direction:

- Prefer `featuredLinkId` on customization or profile-level settings.

Reason:

- It avoids multiple links accidentally being marked featured.
- It keeps the “page presentation” choice separate from base link data.
- It will scale more cleanly if different layout variants later need different presentation settings.

## Data Flow

High-level flow:

1. Load profile customizations and links using the existing preloaded query pattern.
2. Resolve the featured link from the selected id, if one exists.
3. Render the hero section from customization data.
4. Render the featured link card if a valid featured link exists.
5. Render remaining links excluding the featured one.
6. Render QR and footer as supporting sections.

Fallback behavior:

- If no featured link is set, skip the featured section and render the standard links normally.
- If the stored featured link id is missing or invalid, fail gracefully and fall back to the normal links list.

## Responsive Behavior

### Mobile

- Maintain a single-column flow.
- Keep the hero compact.
- Place the featured link immediately below the identity card.
- Use generous tap targets and simple spacing.

### Desktop

- Keep the overall composition centered rather than forcing a split dashboard layout.
- Allow wider cards and more breathing room.
- Keep the featured link prominent, but avoid making it so large that the standard links disappear below the fold unnecessarily.

The layout should feel like the same design across breakpoints, not two unrelated pages.

## Error Handling and Edge Cases

The layout should handle:

- No banner image
- No profile picture
- No description
- No profile details
- No social links
- No featured link
- Invalid featured link id
- Very long usernames or descriptions
- Large numbers of links

Guidance:

- Missing optional content should collapse cleanly rather than leaving awkward empty containers.
- The layout should still feel intentional even in sparse profiles.
- The standard links section should remain the reliable fallback center of gravity.

## Accessibility

Requirements:

- Preserve semantic heading order.
- Keep link cards fully keyboard reachable.
- Ensure the featured link remains obviously interactive.
- Maintain sufficient contrast over banner and card surfaces.
- Avoid layout choices that rely only on color to show importance.

The featured link should be more prominent visually, but not more confusing structurally.

## Testing Strategy

### Visual and Layout Testing

- Verify the hero stack works with and without a banner image.
- Verify sparse and dense profiles both look intentional.
- Verify mobile and desktop spacing.
- Verify the featured link card remains visually distinct from normal links.

### Behavior Testing

- Verify the featured link is excluded from the standard links list.
- Verify fallback behavior when no featured link is configured.
- Verify invalid featured link configuration does not break rendering.

### Regression Testing

- Verify existing analytics and click tracking still work for featured and standard links.
- Verify profile details, social links, QR card, and footer still render under expected conditions.

## Future Layout Options

This hero-stack design should be built as the default candidate for a future layout system.

A reasonable future `layoutVariant` set could be:

- `classic`
- `heroStack`
- `linkHub`

Why this matters now:

- If the page is refactored into focused sections, adding layout variants later becomes much easier.
- The hero-stack design can become the expressive default without blocking more minimal alternatives.

## Risks

- The hero card could become too tall if profile details and social links are not visually constrained.
- The featured link could feel redundant if many users do not have a clear primary destination.
- The new hierarchy could be weakened if too many decorative elements are added around the hero.

Mitigations:

- Keep the hero intentionally compact.
- Make the featured link optional.
- Keep the standard links section calm and consistent.

## Recommendation

Build the public profile around the `Hero Stack` layout as the next design iteration.

Implementation should prioritize:

1. Refactoring the page into clearer presentation sections.
2. Adding optional support for a single featured link.
3. Tightening the visual hierarchy so identity leads, one action follows, and the full links list supports.

This gives IndexFlow a stronger public-page personality while preserving the practical scanning behavior users expect from a link-in-bio product.
