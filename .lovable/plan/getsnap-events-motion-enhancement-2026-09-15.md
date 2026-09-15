# GetSnap Events Motion Enhancement

## Scope
- Recreate the referenced GetSnap homepage at `/` because the local project is currently an empty starter.
- Preserve the live page’s current navigation, copy, event names, dates, locations, counts, filters, imagery, branding, and interactions.
- Apply the requested visual enhancement only to the `#events` / “Recent events” area and its transitions to adjacent sections.
- Use the supplied “Shutter Scroll Joy” demo as the motion-quality reference: cinematic pacing, scroll-linked depth, restrained focus shifts, and polished transitions—without copying its different layout, content, or branding.

## Implementation
- Build the page in React using JavaScript and retain the existing DOM concepts and class hooks: `.section-head`, `.filters`, `.filter`, `.event-grid`, `.event`, `.event-media`, and `.event-foot`.
- Install GSAP and register ScrollTrigger in the client-side Events component.
- Add scoped GSAP timelines for the heading, supporting copy, filters, and card entrance with smooth easing and restrained stagger.
- Add scrubbed image parallax and a scroll-position focus effect that subtly adjusts each visible card’s scale and opacity.
- Adapt the demo’s strongest scroll qualities to the existing card grid rather than its pinned opening sequence, keeping the Events experience natural and conversion-focused.
- Add fast desktop-only card/filter hover polish while keeping existing click and filter behavior unchanged.
- Add restrained section-edge transitions without pinning, horizontal scrolling, or scroll-jacking.
- Use `gsap.context()` and React effect cleanup, refresh ScrollTrigger after images settle, and restore all content correctly when filters change.

## Responsive and Accessibility
- Use GSAP matchMedia for desktop/mobile tuning: shorter travel, lighter scaling, and minimal image motion on small screens.
- Disable motion cleanly for `prefers-reduced-motion`, leaving all content visible and usable.
- Animate transforms and opacity only, preserving natural scrolling and touch behavior.

## Validation
- Confirm the page matches the referenced GetSnap layout and content at desktop and mobile sizes.
- Test filter buttons, event-card clicks, search, modal behavior, section navigation, reduced motion, and ScrollTrigger cleanup.
- Verify there are no runtime, console, or build errors and that page metadata is GetSnap-specific.
