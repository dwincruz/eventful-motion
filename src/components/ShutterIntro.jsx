import { useEffect, useRef } from "react";

const BLADES = [0, 60, 120, 180, 240, 300];

export default function ShutterIntro() {
  const rootRef = useRef(null);

  useEffect(() => {
    let context;
    let cancelled = false;
    const root = rootRef.current;
    if (!root) return undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hide = () => {
      root.style.display = "none";
      document.body.style.removeProperty("overflow");
    };

    if (reduce) {
      hide();
      return undefined;
    }

    document.body.style.overflow = "hidden";

    const run = async () => {
      const { gsap } = await import("gsap");
      if (cancelled) return;

      context = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: "power3.inOut" }, onComplete: hide });

        timeline
          .fromTo(".shutter-ring", { scale: 1.18, opacity: 0 }, { scale: 1, opacity: 1, duration: .55, ease: "power2.out" })
          .fromTo(".shutter-word", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: "power2.out" }, "-=.3")
          .to(".shutter-ring", { scale: .965, duration: .18, ease: "power2.inOut" }, "+=.15")
          .to(".shutter-flash", { opacity: .85, duration: .1 }, "<")
          .to(".shutter-flash", { opacity: 0, duration: .45 })
          .to(".shutter-word", { opacity: 0, y: -8, duration: .35, ease: "power2.in" }, "<")
          .to(".shutter-blade", { scale: 2.35, opacity: .9, duration: 1.05, stagger: .035, ease: "power3.inOut" }, "-=.25")
          .to(".shutter-ring", { scale: 1.6, opacity: 0, duration: .8, ease: "power3.inOut" }, "<")
          .to(root, { opacity: 0, duration: .55, ease: "power2.out" }, "-=.5");
      }, root);
    };

    run();
    return () => {
      cancelled = true;
      context?.revert();
      document.body.style.removeProperty("overflow");
    };
  }, []);

  return (
    <div className="shutter-intro" ref={rootRef} aria-hidden="true">
      <div className="shutter-stage">
        {BLADES.map((angle) => (
          <span key={angle} className="shutter-blade" style={{ transform: `rotate(${angle}deg)` }} />
        ))}
        <span className="shutter-ring" />
        <span className="shutter-word">getsnap.ph</span>
      </div>
      <span className="shutter-flash" />
    </div>
  );
}
