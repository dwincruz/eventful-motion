import { useEffect, useRef } from "react";

import lensPhoto from "@/assets/lens.jpg";

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
              gsap.set(".iris", { scale: 0.46 });
              gsap.set(".camera-scene", { opacity: 0, display: "none" });
              gsap.set(".cine-reveal", { opacity: 1, y: 0 });
              onProgress?.(1);
              return;
            }

            // --- Intro: shutter click + flash, then settle to a narrow aperture ---
            const intro = gsap.timeline({ defaults: { ease: "sine.inOut" } });
            intro
              .set(".iris", { scale: 0 })
              .fromTo(
                ".camera-body",
                { scale: 1.08, opacity: 0 },
                { scale: 1, opacity: 1, duration: 1.1, ease: "power2.out" },
                0,
              )
              .to(".iris", { scale: 1.18, duration: 1.05, ease: "power3.out" }, 0.3)
              .to(".iris", { scale: 0.015, duration: 0.24, ease: "power4.in" }, "+=0.5")
              .to(".cine-flash", { opacity: 0.92, duration: 0.07 }, "<+=0.16")
              .to(".cine-flash", { opacity: 0, duration: 0.6, ease: "power2.out" })
              .to(".iris", { scale: 0.46, duration: 1, ease: "power2.out" }, "<")
              .fromTo(
                ".scroll-hint",
                { opacity: 0, y: 14 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
                "-=0.35",
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
                { scale: mobile ? 1.9 : 2.7, opacity: 0, duration: 0.62 },
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
          <div className="camera-body">
            <img className="camera-lens" src={lensPhoto} alt="" width={1024} height={1024} />
            <span className="iris" />
            <span className="camera-bezel" />
          </div>
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
