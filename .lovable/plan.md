# Events collage scroll animation

## Goal
Keep the current GetSnap Events content, filters, cards, and branding, while changing the section’s scroll choreography so the event images gather into a composed collage inspired by this.design.

## Implementation
- Reuse the existing six event cards and image containers; no event data or controls will change.
- Add a dedicated scroll stage inside the Events section that starts with images spread around the viewport and smoothly gathers them into a layered collage as the user scrolls.
- Keep the section pinned only during the collage assembly, then transition naturally into the existing readable event-card grid.
- Use GSAP ScrollTrigger with scrubbed transforms, restrained rotation, staggered depth, and image parallax; avoid horizontal scrolling and scroll-jacking.
- Preserve filter behavior by rebuilding the animation safely whenever visible cards change.
- Reduce distances and remove pinning on small screens; show a simpler scroll-linked gathering motion instead.
- Respect reduced-motion by rendering the normal event grid immediately with no gathering effect.

## Validation
- Check desktop and mobile layouts, card/filter interactions, scroll behavior, and reduced-motion fallback.
- Confirm the preview builds without errors and no content overlaps or horizontal overflow appear.
