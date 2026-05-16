# Landing Preview Showcase Design

## Summary

Restructure the landing-page hero so the marketing message and primary call to action appear first, with the dashboard preview moved into its own showcase section underneath on all screen sizes, including desktop. The showcase should feel roomier and more intentional, replacing the cramped side-by-side hero composition with a larger, story-driven preview area.

## Goals

- Make the top of the landing page easier to scan by separating hero copy from the product preview.
- Give the dashboard preview enough space to breathe on desktop and mobile.
- Recast the preview as a showcase section with clearer hierarchy.
- Use a local Magic Bento-style card layout that fits the existing design system instead of adding a new external dependency.

## Non-Goals

- No change to the product messaging itself beyond minor supportive showcase copy.
- No new analytics or interactive business logic.
- No full landing-page redesign outside the hero and preview area.

## User Experience

The page should read in this order:

1. Hero badge, headline, supporting paragraph, and call to action.
2. Trust chips below the call to action.
3. A distinct preview showcase section underneath with its own intro.
4. A large dashboard panel featuring one primary profile card and four supporting insight cards.

This should feel like moving from promise to proof. The hero tells visitors what IndexFlow does, and the showcase immediately demonstrates what that experience looks like.

## Layout Changes

### Hero

- Remove the two-column desktop hero layout that currently places the preview next to the headline.
- Convert the hero content area into a single-column composition across breakpoints.
- Preserve the existing visual background treatment and trust-chip row.
- Keep the marquee/logos strip below the hero flow.

### Showcase

- Add a separate showcase block under the CTA/trust-chip area inside the hero section flow.
- Introduce a small eyebrow, short heading, and one-sentence intro above the preview panel.
- Increase vertical spacing between the hero content and the preview section so the transition feels deliberate.

## Preview Composition

The preview panel should keep the current dashboard framing, but the internal content should be rebalanced:

- One large anchor card for the public profile preview.
- Four supporting cards:
  - Theme switch
  - Live clicks
  - Audience pulse
  - Product-led first impression

The anchor card should remain the main storytelling element. The supporting cards should operate like proof tiles around it.

## Magic Bento-Style Treatment

Implement a local Bento-style system using existing project tools and styling patterns:

- Larger card gaps to reduce crowding.
- Taller cards or minimum heights where needed.
- Rounded surfaces, layered borders, and soft shadows consistent with the current landing aesthetic.
- Subtle hover enhancement such as light lift, glow, or border emphasis.
- Motion should remain lightweight and respect reduced-motion preferences.

This should feel premium and interactive without turning the section into a visual effects demo.

## Technical Approach

- Refactor `components/marketing/editorial-hero.tsx` to separate hero copy from preview rendering.
- Extract repeated card surface styles into small local helper class patterns or inline component structure if it improves readability.
- Keep implementation local to the existing component unless a tiny supporting component clearly improves maintainability.
- Do not add a `reactbits` dependency for this task because a stable official integration target for the requested Magic Bento pattern was not verified.

## Responsive Behavior

- Desktop: hero copy stays above; showcase spans underneath with a wide, centered preview panel.
- Tablet: showcase grid compresses gracefully while maintaining generous spacing.
- Mobile: cards stack in a readable order, with the anchor card first.

## Testing

- Verify the landing page visually at mobile, tablet, and desktop widths.
- Run lint after the refactor.
- Confirm hover/motion enhancements do not break reduced-motion expectations.

## Risks and Mitigations

- Risk: The showcase could become too tall and push important content too far down.
  - Mitigation: Keep the intro copy tight and avoid oversized empty space.
- Risk: A custom Bento treatment could drift from the existing landing-page language.
  - Mitigation: Reuse the current color, radius, border, and shadow vocabulary.
- Risk: Refactoring the hero could accidentally weaken the CTA hierarchy.
  - Mitigation: Keep CTA placement unchanged relative to headline and body copy.
