# Dashboard Page Overrides

> **PROJECT:** IndexFlow
> **Generated:** 2026-03-31 14:47:23
> **Page Type:** Dashboard / Data View

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** 1200px (standard)
- **Layout:** Full-width sections, centered content
- **Sections:** 1. Hero (product + live preview or status), 2. Key metrics/indicators, 3. How it works, 4. CTA (Start trial / Contact)

### Spacing Overrides

- No overrides — use Master spacing

### Typography Overrides

- No overrides — use Master typography

### Color Overrides

- **Strategy:** Dark or neutral. Status colors (green/amber/red). Data-dense but scannable.

### Component Overrides

- Avoid: Large blocking CSS files
- Avoid: Desktop-first causing mobile issues
- Avoid: Overflow or broken layout

---

## Page-Specific Components

- No unique components for this page

---

## Recommendations

- Effects: Number animations (count-up), trend direction indicators, percentage change animations, profit/loss color transitions
- Performance: Inline critical CSS defer non-critical
- Responsive: Start with mobile styles then add breakpoints
- Content: Truncate with ellipsis and expand option
- CTA Placement: Primary CTA in nav + After metrics
