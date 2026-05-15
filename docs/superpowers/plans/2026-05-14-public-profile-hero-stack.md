# Public Profile Hero Stack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the new public profile `Hero Stack` layout with a floating identity hero, one optional featured link, and a calmer standard links section below it.

**Architecture:** Keep Convex as the source of truth for layout presentation settings by storing a single `featuredLinkId` on `userCustomizations`. Refactor the public page into smaller presentation components and use a small pure helper to split `featured` versus `remaining` links so the most fragile logic is testable without needing a browser test stack.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Convex, Clerk, Tailwind CSS, Node test runner, ESLint

---

## File Map

**Create:**

- `D:/VS Code & Local stuff/index-flow/lib/publicProfileLinks.ts`
- `D:/VS Code & Local stuff/index-flow/lib/publicProfileLinks.test.ts`
- `D:/VS Code & Local stuff/index-flow/components/PublicProfileHero.tsx`
- `D:/VS Code & Local stuff/index-flow/components/FeaturedLinkCard.tsx`
- `D:/VS Code & Local stuff/index-flow/components/PublicLinksSection.tsx`

**Modify:**

- `D:/VS Code & Local stuff/index-flow/convex/schema.ts`
- `D:/VS Code & Local stuff/index-flow/convex/lib/userCustomization.ts`
- `D:/VS Code & Local stuff/index-flow/components/CustomizationForm.tsx`
- `D:/VS Code & Local stuff/index-flow/components/Links.tsx`
- `D:/VS Code & Local stuff/index-flow/components/PublicPageContent.tsx`

**Verify with:**

- `node --test lib/publicProfileLinks.test.ts`
- `pnpm lint`

---

### Task 1: Add a pure helper for featured-link splitting

**Files:**

- Create: `D:/VS Code & Local stuff/index-flow/lib/publicProfileLinks.ts`
- Test: `D:/VS Code & Local stuff/index-flow/lib/publicProfileLinks.test.ts`

- [ ] **Step 1: Write the failing helper test**

```ts
import test from "node:test";
import assert from "node:assert/strict";

const { splitPublicProfileLinks } = await import(
  new URL("./publicProfileLinks.ts", import.meta.url).href
);

test("splitPublicProfileLinks returns the selected featured link first and excludes it from the remaining list", () => {
  const links = [
    { _id: "one", title: "Portfolio", url: "https://example.com/portfolio", order: 0 },
    { _id: "two", title: "Book a Call", url: "https://example.com/book", order: 1 },
    { _id: "three", title: "YouTube", url: "https://youtube.com/@indexflow", order: 2 },
  ];

  assert.deepEqual(splitPublicProfileLinks(links, "two"), {
    featuredLink: links[1],
    remainingLinks: [links[0], links[2]],
  });
});

test("splitPublicProfileLinks falls back cleanly when the featured id is missing", () => {
  const links = [
    { _id: "one", title: "Portfolio", url: "https://example.com/portfolio", order: 0 },
    { _id: "two", title: "Book a Call", url: "https://example.com/book", order: 1 },
  ];

  assert.deepEqual(splitPublicProfileLinks(links, "missing"), {
    featuredLink: null,
    remainingLinks: links,
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
node --test D:/VS\ Code\ \&\ Local\ stuff/index-flow/lib/publicProfileLinks.test.ts
```

Expected:

```txt
ERR_MODULE_NOT_FOUND
```

- [ ] **Step 3: Write the minimal helper implementation**

```ts
type PublicLink = {
  _id: string;
  title: string;
  url: string;
  order: number;
};

export const splitPublicProfileLinks = (
  links: PublicLink[],
  featuredLinkId?: string,
) => {
  if (!featuredLinkId) {
    return {
      featuredLink: null,
      remainingLinks: links,
    };
  }

  const featuredLink =
    links.find((link) => link._id === featuredLinkId) ?? null;

  if (!featuredLink) {
    return {
      featuredLink: null,
      remainingLinks: links,
    };
  }

  return {
    featuredLink,
    remainingLinks: links.filter((link) => link._id !== featuredLinkId),
  };
};
```

- [ ] **Step 4: Run the helper test again**

Run:

```bash
node --test D:/VS\ Code\ \&\ Local\ stuff/index-flow/lib/publicProfileLinks.test.ts
```

Expected:

```txt
# tests 2
# pass 2
```

- [ ] **Step 5: Commit**

```bash
git add D:/VS\ Code\ \&\ Local\ stuff/index-flow/lib/publicProfileLinks.ts D:/VS\ Code\ \&\ Local\ stuff/index-flow/lib/publicProfileLinks.test.ts
git commit -m "test: add public profile featured link helper"
```

---

### Task 2: Add `featuredLinkId` to Convex customizations

**Files:**

- Modify: `D:/VS Code & Local stuff/index-flow/convex/schema.ts`
- Modify: `D:/VS Code & Local stuff/index-flow/convex/lib/userCustomization.ts`

- [ ] **Step 1: Add the new field to the Convex schema**

Update `userCustomizations` in `convex/schema.ts`:

```ts
userCustomizations: defineTable({
  userId: v.string(),
  profilePictureStorageId: v.optional(v.id("_storage")),
  description: v.optional(v.string()),
  accentColor: v.optional(v.string()),
  themePreset: v.optional(v.string()),
  fontFamily: v.optional(v.string()),
  layoutStyle: v.optional(v.string()),
  linkStyle: v.optional(v.string()),
  featuredLinkId: v.optional(v.id("links")),
  backgroundType: v.optional(v.string()),
  backgroundValue: v.optional(v.string()),
  backgroundSolidColor: v.optional(v.string()),
  // ...rest unchanged
}).index("by_user_id", ["userId"]),
```

- [ ] **Step 2: Add `featuredLinkId` to query return types**

In both `getUserCustomizations` and `getCustomizationBySlug`, add the field to the `returns` object:

```ts
returns: v.union(
  v.null(),
  v.object({
    _id: v.id("userCustomizations"),
    _creationTime: v.number(),
    userId: v.string(),
    profilePictureStorageId: v.optional(v.id("_storage")),
    profilePictureUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    accentColor: v.optional(v.string()),
    themePreset: v.optional(v.string()),
    fontFamily: v.optional(v.string()),
    layoutStyle: v.optional(v.string()),
    linkStyle: v.optional(v.string()),
    featuredLinkId: v.optional(v.id("links")),
    backgroundType: v.optional(v.string()),
    // ...rest unchanged
  }),
),
```

- [ ] **Step 3: Accept and persist `featuredLinkId` in `updateCustomizations`**

Add the arg and patch/insert handling:

```ts
args: {
  profilePictureStorageId: v.optional(v.id("_storage")),
  description: v.optional(v.string()),
  accentColor: v.optional(v.string()),
  themePreset: v.optional(v.string()),
  fontFamily: v.optional(v.string()),
  layoutStyle: v.optional(v.string()),
  linkStyle: v.optional(v.string()),
  featuredLinkId: v.optional(v.id("links")),
  backgroundType: v.optional(v.string()),
  // ...rest unchanged
},
```

```ts
...(args.featuredLinkId !== undefined && {
  featuredLinkId: args.featuredLinkId,
}),
```

Include that snippet in both the `db.patch` object and the `db.insert` object.

- [ ] **Step 4: Run lint to catch Convex type drift**

Run:

```bash
pnpm lint
```

Expected:

```txt
0 problems
```

- [ ] **Step 5: Commit**

```bash
git add D:/VS\ Code\ \&\ Local\ stuff/index-flow/convex/schema.ts D:/VS\ Code\ \&\ Local\ stuff/index-flow/convex/lib/userCustomization.ts
git commit -m "feat: add featured link customization field"
```

---

### Task 3: Add featured-link selection to the dashboard customization form

**Files:**

- Modify: `D:/VS Code & Local stuff/index-flow/components/CustomizationForm.tsx`

- [ ] **Step 1: Load the user’s existing links and add `featuredLinkId` to local form state**

Add the links query near the other Convex hooks:

```ts
const userLinks = useQuery(
  api.lib.links.getLinksByUserId,
  user ? { userId: user.id } : "skip",
);
```

Add `featuredLinkId` to `snapshotFromForm` and the initial `formData` state:

```ts
type FormData = {
  description: string;
  accentColor: string;
  themePreset: string;
  fontFamily: string;
  layoutStyle: LayoutStyle;
  linkStyle: LinkStyle;
  featuredLinkId?: string;
  backgroundType: BackgroundType;
  // ...rest unchanged
};
```

```ts
featuredLinkId: undefined,
```

```ts
featuredLinkId: data.featuredLinkId,
```

- [ ] **Step 2: Hydrate and save the new field**

When loading existing customization data, populate the field:

```ts
featuredLinkId: existingCustomization.featuredLinkId,
```

When saving customizations, pass it through:

```ts
await updateCustomization({
  description: formData.description || undefined,
  accentColor: formData.accentColor || undefined,
  themePreset: formData.themePreset || undefined,
  fontFamily: formData.fontFamily || undefined,
  layoutStyle: formData.layoutStyle || undefined,
  linkStyle: formData.linkStyle || undefined,
  featuredLinkId: formData.featuredLinkId as Id<"links"> | undefined,
  backgroundType: formData.backgroundType || undefined,
  // ...rest unchanged
});
```

- [ ] **Step 3: Add the featured-link picker UI**

Place this in the layout/links settings section near the existing layout style controls:

```tsx
<div className="space-y-3">
  <Label htmlFor="featured-link">Featured Link</Label>
  <select
    id="featured-link"
    value={formData.featuredLinkId || ""}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        featuredLinkId: e.target.value || undefined,
      }))
    }
    className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm"
  >
    <option value="">No featured link</option>
    {(userLinks || []).map((link) => (
      <option key={link._id} value={link._id}>
        {link.title}
      </option>
    ))}
  </select>
  <p className="text-xs text-slate-500">
    The selected link will appear in a larger featured card below your hero.
  </p>
</div>
```

- [ ] **Step 4: Add a lightweight preview cue so the setting is visible before save**

In the preview panel, add a simple featured block above the regular preview links:

```tsx
const featuredPreviewLink =
  (userLinks || []).find((link) => link._id === formData.featuredLinkId) ?? null;
```

```tsx
{featuredPreviewLink ? (
  <div className="mb-4 rounded-[1.5rem] border border-slate-200/70 bg-white/95 p-4 shadow-md shadow-slate-900/5">
    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
      Start here
    </p>
    <h3 className="mt-2 text-base font-semibold text-slate-900">
      {featuredPreviewLink.title}
    </h3>
    <p className="mt-1 truncate text-xs text-slate-500">
      {featuredPreviewLink.url.replace(/^https?:\/\//, "")}
    </p>
  </div>
) : null}
```

- [ ] **Step 5: Run lint and commit**

Run:

```bash
pnpm lint
```

Commit:

```bash
git add D:/VS\ Code\ \&\ Local\ stuff/index-flow/components/CustomizationForm.tsx
git commit -m "feat: add featured link customization controls"
```

---

### Task 4: Build the new public-page presentation components

**Files:**

- Create: `D:/VS Code & Local stuff/index-flow/components/PublicProfileHero.tsx`
- Create: `D:/VS Code & Local stuff/index-flow/components/FeaturedLinkCard.tsx`
- Create: `D:/VS Code & Local stuff/index-flow/components/PublicLinksSection.tsx`
- Modify: `D:/VS Code & Local stuff/index-flow/components/Links.tsx`
- Modify: `D:/VS Code & Local stuff/index-flow/components/PublicPageContent.tsx`

- [ ] **Step 1: Make `Links.tsx` reusable with direct link data**

Change the component signature so it can accept either `preloadedLinks` or an already-resolved `links` array:

```ts
type LinksProps = {
  preloadedLinks?: Preloaded<typeof api.lib.links.getLinksBySlug>;
  links?: Doc<"links">[];
  accentColor: string;
  layoutStyle?: LayoutStyle;
  linkStyle?: LinkStyle;
};

const Links = ({
  preloadedLinks,
  links: providedLinks,
  accentColor,
  layoutStyle = "stacked",
  linkStyle = "rounded",
}: LinksProps) => {
  const preloadedResults = preloadedLinks
    ? usePreloadedQuery(preloadedLinks)
    : null;

  const links = providedLinks ?? preloadedResults ?? [];
  // existing render logic stays the same
};
```

- [ ] **Step 2: Create `PublicProfileHero.tsx` for banner + floating identity**

Use the current `PublicPageContent` hero markup as the starting point and move it into a focused component:

```tsx
type PublicProfileHeroProps = {
  username: string;
  accentColor: string;
  avatarShape: AvatarShape;
  bannerImageUrl?: string;
  bannerImagePositionX?: number;
  bannerImagePositionY?: number;
  profilePictureUrl?: string;
  description?: string;
  profileFields: ProfileFieldInput[];
  socialLinks: Array<{ platform: string; url: string }>;
};

export default function PublicProfileHero({
  username,
  accentColor,
  avatarShape,
  bannerImageUrl,
  bannerImagePositionX,
  bannerImagePositionY,
  profilePictureUrl,
  description,
  profileFields,
  socialLinks,
}: PublicProfileHeroProps) {
  return (
    <>
      <div className="relative h-52 overflow-hidden rounded-[1.75rem] border border-white/25 shadow-2xl shadow-slate-900/10 sm:h-60 sm:rounded-[2rem] lg:h-64">
        {/* existing banner background logic */}
      </div>
      <div className="relative z-10 mx-auto -mt-12 max-w-2xl sm:-mt-16 lg:-mt-18">
        {/* compact floating identity card */}
      </div>
    </>
  );
}
```

- [ ] **Step 3: Create `FeaturedLinkCard.tsx`**

Build a dedicated first-action card that tracks clicks like normal links:

```tsx
"use client";

type FeaturedLinkCardProps = {
  link: Doc<"links">;
  accentColor: string;
};

export default function FeaturedLinkCard({
  link,
  accentColor,
}: FeaturedLinkCardProps) {
  return (
    <Link
      href={link.url}
      className="group block w-full"
      onClick={() => handleLinkClick(link)}
    >
      <div
        className="rounded-[1.75rem] border bg-white/92 p-6 shadow-xl shadow-slate-900/8 transition-all duration-300 group-hover:-translate-y-1"
        style={{ borderColor: `${accentColor}40` }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
          Start here
        </p>
        <div className="mt-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-slate-900">
              {link.title}
            </h2>
            <p className="mt-1 truncate text-sm text-slate-500">
              {link.url.replace(/^https?:\/\//, "")}
            </p>
          </div>
          <ArrowUpRight className="size-5 shrink-0" style={{ color: accentColor }} />
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 4: Create `PublicLinksSection.tsx` and refactor `PublicPageContent.tsx`**

Use the helper from Task 1 in `PublicPageContent.tsx`:

```ts
const links = usePreloadedQuery(preloadedLinks);
const { featuredLink, remainingLinks } = splitPublicProfileLinks(
  links.map((link) => ({ ...link, _id: link._id.toString() })),
  customizations?.featuredLinkId?.toString(),
);
```

Then render the new flow:

```tsx
<PublicProfileHero
  username={username}
  accentColor={accentColor}
  avatarShape={avatarShape}
  bannerImageUrl={customizations?.bannerImageUrl}
  bannerImagePositionX={customizations?.bannerImagePositionX}
  bannerImagePositionY={customizations?.bannerImagePositionY}
  profilePictureUrl={customizations?.profilePictureUrl}
  description={customizations?.description}
  profileFields={customizations?.profileFields || []}
  socialLinks={customizations?.socialLinks || []}
/>

{featuredLink ? (
  <div className="mx-auto mt-7 max-w-4xl">
    <FeaturedLinkCard
      link={links.find((link) => link._id.toString() === featuredLink._id)!}
      accentColor={accentColor}
    />
  </div>
) : null}

<PublicLinksSection accentColor={accentColor}>
  <Links
    links={links.filter((link) => link._id.toString() !== featuredLink?._id)}
    accentColor={accentColor}
    layoutStyle={layoutStyle === "grid" ? "grid" : "stacked"}
    linkStyle={linkStyle === "outline" ? "rounded" : linkStyle}
  />
</PublicLinksSection>
```

- [ ] **Step 5: Run lint and commit**

Run:

```bash
pnpm lint
```

Commit:

```bash
git add D:/VS\ Code\ \&\ Local\ stuff/index-flow/components/PublicProfileHero.tsx D:/VS\ Code\ \&\ Local\ stuff/index-flow/components/FeaturedLinkCard.tsx D:/VS\ Code\ \&\ Local\ stuff/index-flow/components/PublicLinksSection.tsx D:/VS\ Code\ \&\ Local\ stuff/index-flow/components/Links.tsx D:/VS\ Code\ \&\ Local\ stuff/index-flow/components/PublicPageContent.tsx
git commit -m "feat: add public profile hero stack layout"
```

---

### Task 5: Verify the public profile behavior end to end

**Files:**

- Verify: `D:/VS Code & Local stuff/index-flow/components/PublicPageContent.tsx`
- Verify: `D:/VS Code & Local stuff/index-flow/components/CustomizationForm.tsx`
- Verify: `D:/VS Code & Local stuff/index-flow/lib/publicProfileLinks.test.ts`

- [ ] **Step 1: Run the targeted automated checks**

Run:

```bash
node --test D:/VS\ Code\ \&\ Local\ stuff/index-flow/lib/publicProfileLinks.test.ts
pnpm lint
```

Expected:

```txt
# pass
```

and:

```txt
0 problems
```

- [ ] **Step 2: Run the app locally and verify the dashboard flow**

Run:

```bash
pnpm dev
```

Manual checks:

- Open the dashboard customization form.
- Pick a featured link from the new selector.
- Save.
- Confirm the preview shows the featured card.

- [ ] **Step 3: Verify the public profile rendering cases**

Manual checks on `/u/<username>`:

- Hero card overlaps the banner cleanly.
- Featured link appears directly below the hero when selected.
- Standard links no longer repeat the featured link.
- If the featured link is cleared, the page falls back to the normal links list.
- Sparse profiles still look intentional when description, socials, or details are missing.

- [ ] **Step 4: Verify responsive behavior**

Manual checks:

- Mobile width: hero remains compact and readable.
- Tablet width: featured link still reads as the primary action.
- Desktop width: page stays centered and does not revert to a dashboard-like split.

- [ ] **Step 5: Commit the final polish**

```bash
git add D:/VS\ Code\ \&\ Local\ stuff/index-flow/components/PublicPageContent.tsx D:/VS\ Code\ \&\ Local\ stuff/index-flow/components/CustomizationForm.tsx D:/VS\ Code\ \&\ Local\ stuff/index-flow/components/Links.tsx D:/VS\ Code\ \&\ Local\ stuff/index-flow/lib/publicProfileLinks.ts D:/VS\ Code\ \&\ Local\ stuff/index-flow/lib/publicProfileLinks.test.ts D:/VS\ Code\ \&\ Local\ stuff/index-flow/convex/schema.ts D:/VS\ Code\ \&\ Local\ stuff/index-flow/convex/lib/userCustomization.ts
git commit -m "chore: verify public profile hero stack"
```

---

## Self-Review

### Spec coverage

- Floating identity hero: covered by Task 4.
- Single featured link: covered by Tasks 1, 2, 3, and 4.
- Standard links remain simpler and secondary: covered by Task 4.
- Future layout-option compatibility: supported by Task 4 component split and Task 2 customization storage.
- Fallback and invalid-featured-link behavior: covered by Task 1 and Task 5.

### Placeholder scan

- No `TODO`, `TBD`, or “implement later” placeholders remain.
- Every coding step includes concrete code snippets or commands.

### Type consistency

- The plan consistently uses `featuredLinkId`.
- The public-page split logic consistently distinguishes `featuredLink` from `remainingLinks`.

