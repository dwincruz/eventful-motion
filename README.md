# Eventful Motion

Improve the existing GetSnap homepage at:

https://getsnap-ui-version2.blue-wolf-so-0193.chatgpt.site/#events

Focus specifically on the EVENTS / "Recent events" section.

Do NOT redesign the entire website and do NOT replace the existing UI.

Keep the current GetSnap visual identity, content, cards, images, typography, colors, spacing, navigation, and functionality.

Add a premium, modern GSAP + ScrollTrigger animation experience to make the Events section feel more dynamic, polished, and high-end.

Use GSAP + ScrollTrigger properly and make the animations scroll-driven rather than simple one-time fade-ins.

Animation direction:

1. EVENTS SECTION ENTRANCE

- When the user scrolls into the Events section, animate the section heading smoothly into view.

- "Recent events" should reveal with a subtle upward movement + opacity.

- Animate the supporting text slightly after the heading.

- Use smooth easing and a premium cinematic feel.

- Avoid exaggerated bouncing animations.

2. EVENT FILTERS

- Animate the filter buttons/tabs into view with a subtle stagger.

- Each filter should move upward slightly and fade in.

- Keep the existing buttons and functionality unchanged.

- Add a subtle hover interaction:

  - slight scale

  - smooth background transition

  - subtle elevation

- Do not make the interaction feel like a generic template animation.

3. EVENT CARDS

- Animate the event cards into view using ScrollTrigger.

- Cards should appear with a staggered sequence as the user scrolls.

- Use:

  - opacity

  - y translation

  - very subtle scale

- The animation should feel smooth and premium.

- Do not make cards fly dramatically across the screen.

4. IMAGE MOTION

- Add subtle parallax movement to the event card images while scrolling.

- The image should move slightly slower/faster than the card container to create depth.

- Use ScrollTrigger scrub where appropriate.

- Keep the image movement subtle so the event information remains readable.

5. CARD HOVER

Add a premium desktop hover effect:

- image slightly zooms

- image shifts subtly

- card lifts a few pixels

- shadow/elevation increases slightly

- "View photos →" becomes more visually prominent

- transition must be smooth and fast

- do not over-animate.

6. SCROLL-DRIVEN FEATURE

Create one visually impressive scroll-driven moment around the Events section.

As the user scrolls through the event cards:

- cards should subtly transition in scale/opacity based on scroll position

- the currently focused card can feel slightly more prominent

- surrounding cards can remain slightly less emphasized

- use GSAP ScrollTrigger with scrub for this effect.

Do NOT create a confusing horizontal scrolling experience unless it naturally fits the existing responsive layout.

7. PREMIUM TRANSITION

At the beginning and end of the Events section, create a subtle visual transition so the section feels connected to the sections before and after it.

Possible effects:

- subtle opacity transition

- background movement

- slight scale/parallax

- masked/reveal effect

Keep it elegant and minimal.

8. MOBILE RESPONSIVENESS

The animations MUST work properly on mobile.

On mobile:

- reduce movement distance

- reduce scale effects

- avoid heavy parallax

- avoid pinning if it causes usability problems

- keep scrolling natural

- maintain excellent performance.

9. ACCESSIBILITY / PERFORMANCE

- Respect prefers-reduced-motion.

- Do not animate large numbers of expensive DOM properties unnecessarily.

- Prefer transform and opacity.

- Do not block scrolling.

- Do not introduce scroll-jacking.

- Make sure ScrollTrigger refreshes correctly after images/layout changes.

- Properly clean up GSAP/ScrollTrigger instances if using React components.

10. IMPLEMENTATION

Use GSAP and ScrollTrigger.

Register:

gsap.registerPlugin(ScrollTrigger)

Use React-compatible GSAP patterns and proper cleanup.

Use ScrollTrigger features such as:

- trigger

- start

- end

- scrub

- stagger

- toggleActions

- matchMedia where appropriate

Do not use TypeScript.

Use JavaScript only.

IMPORTANT:

Do not replace the current Events section.

Enhance the existing implementation.

Do not change:

- event names

- event dates

- locations

- photo counts

- buttons

- links

- existing functionality

- overall GetSnap branding

The final result should feel like a premium photography/event platform similar to a high-end modern creative website.

The goal is:

"Less scrolling, more reliving."

The animation should make users feel that the event photos are coming alive as they discover them, while still keeping the website fast, clean, professional, and conversion-focused.

Before implementing, inspect the existing DOM/component structure and reuse the existing elements/classes instead of creating unnecessary duplicate components.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/986c8555-dfdf-4fe7-ae3b-92014f16c416).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
