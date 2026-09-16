import { useEffect, useRef } from "react";

import logoAsset from "@/assets/getsnap-logo.png.asset.json";

export default function CameraIntro({ children, onProgress }) {
  const wrapRef = useRef(null);

  useEffect(() => {
    let ctx;
    let mm;
    let cancelled = false;

    const run = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !wrapRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        mm = gsap.matchMedia();

        mm.add(
          {
            motion: "(prefers-reduced-motion: no-preference)",
            reduce: "(prefers-reduced-motion: reduce)",
            mobile: "(max-width: 768px)",
          },
          (match) => {
            const { motion, reduce, mobile } = match.conditions;

            if (reduce || !motion) {
              gsap.set(".camera-scene", { opacity: 0, display: "none" });
              gsap.set(".cine-reveal", { opacity: 1, y: 0 });
              onProgress?.(1);
              return;
            }

            // --- Intro: logo reveal ---
            const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
            intro
              .fromTo(
                ".brand-logo",
                { scale: 0.82, opacity: 0, y: 10 },
                { scale: 1, opacity: 1, y: 0, duration: 1.15 },
                0,
              )
              .fromTo(
                ".brand-glow",
                { scale: 0.7, opacity: 0 },
                { scale: 1, opacity: 1, duration: 1.3, ease: "sine.out" },
                0.1,
              )
              .fromTo(
                ".brand-ring",
                { scale: 0.86, opacity: 0, rotate: -12 },
                {
                  scale: 1,
                  opacity: 1,
                  rotate: 0,
                  duration: 1.4,
                  stagger: 0.14,
                  ease: "power2.out",
                },
                0.2,
              )
              .to(".cine-flash", { opacity: 0.55, duration: 0.08 }, 0.85)
              .to(".cine-flash", { opacity: 0, duration: 0.7, ease: "power2.out" })
              .to(
                ".brand-glow",
                { scale: 1.06, duration: 2.6, ease: "sine.inOut", repeat: -1, yoyo: true },
                1.2,
              )
              .fromTo(
                ".brand-tagline",
                { opacity: 0, y: 14 },
                { opacity: 1, y: 0, duration: 0.9 },
                1.05,
              )
              .fromTo(
                ".scroll-hint",
                { opacity: 0, y: 14 },
                { opacity: 1, y: 0, duration: 0.8 },
                "<+=0.25",
              );

            // --- Pinned scroll sequence ---
            const sequence = gsap.timeline({
              defaults: { ease: "sine.inOut" },
              scrollTrigger: {
                trigger: wrapRef.current,
                start: "top top",
                end: mobile ? "+=120%" : "+=190%",
                pin: ".cine-stage",
                pinSpacing: true,
                scrub: 1.3,
                invalidateOnRefresh: true,
                onUpdate: (self) => onProgress?.(self.progress),
              },
            });

            sequence
              .to(".scroll-hint", { opacity: 0, duration: 0.12 }, 0)
              .to(
                ".camera-scene",
                { scale: mobile ? 1.6 : 2.2, opacity: 0, duration: 0.62 },
                0,
              )
              .to(
                ".brand-mark",
                {
                  rotation: mobile ? 60 : 110,
                  duration: 0.62,
                  ease: "sine.inOut",
                },
                0,
              )
              .to(
                ".brand-ring",
                { rotation: mobile ? -50 : -85, duration: 0.62, ease: "sine.inOut" },
                0,
              )
              .fromTo(
                ".cine-reveal",
                { y: mobile ? 26 : 52, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.55,
                  stagger: mobile ? 0.08 : 0.13,
                  ease: "sine.out",
                },
                0.3,
              );
          },
        );
      }, wrapRef);

      ScrollTrigger.refresh();
    };

    run();
    return () => {
      cancelled = true;
      mm?.revert();
      ctx?.revert();
    };
  }, [onProgress]);

  return (
    <div className="cine-wrap" ref={wrapRef}>
      <section className="cine-stage" aria-label="Intro">
        <div className="camera-scene" aria-hidden="true">
          <div className="brand-mark">
            <span className="brand-glow" />
            <span className="brand-ring" />
            <span className="brand-ring two" />
            <img className="brand-logo" src={logoAsset.url} alt="" />
          </div>
          <p className="brand-tagline">Less scrolling, more reliving</p>
          <div className="scroll-hint">
            <span>Scroll to explore</span>
            <span className="scroll-hint-line" />
          </div>
        </div>
        <span className="cine-flash" aria-hidden="true" />
        <div className="cine-hero">{children}</div>
      </section>
    </div>
  );
}
