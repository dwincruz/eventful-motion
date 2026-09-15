import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Camera, Hash, MapPin, Menu, Search, Smile, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/getsnap-logo.png.asset.json";
import runAsset from "@/assets/run.webp.asset.json";
import triathlonAsset from "@/assets/triathlon.webp.asset.json";
import cyclingAsset from "@/assets/cycling.webp.asset.json";

const images = {
  logo: logoAsset.url,
  run: runAsset.url,
  triathlon: triathlonAsset.url,
  cycling: cyclingAsset.url,
};

const events = [
  { name: "Hunat Sugbu 2026", search: "Hunat Sugbu 2026 Cebu running", type: "running cebu", date: "Sep 13, 2026", location: "Cebu City", photos: "18,420 photos", image: images.run, alt: "Runner at a finish line", badge: "Just added" },
  { name: "Santé Barley Trilogy Leg 3", search: "Sante Barley Trilogy Cebu triathlon", type: "triathlon cebu", date: "Sep 6, 2026", location: "Lapu-Lapu City", photos: "26,805 photos", image: images.triathlon, alt: "Triathletes entering the water", badge: "Featured" },
  { name: "Tour de Bohol", search: "Tour de Bohol cycling Bohol", type: "cycling", date: "Aug 30, 2026", location: "Panglao, Bohol", photos: "12,960 photos", image: images.cycling, alt: "Cyclists racing on a coastal road" },
  { name: "Ormoc City Fun Run", search: "Ormoc City Fun Run Leyte", type: "running", date: "Aug 23, 2026", location: "Ormoc City", photos: "8,740 photos", image: images.run, alt: "Road running event" },
  { name: "Davao Gulf Triathlon", search: "Davao Gulf Triathlon Davao", type: "triathlon", date: "Aug 16, 2026", location: "Davao City", photos: "21,380 photos", image: images.triathlon, alt: "Open water swimming event" },
  { name: "Cebu Coastal Ride", search: "Cebu Coastal Ride Cebu cycling", type: "cycling cebu", date: "Aug 9, 2026", location: "Cebu Province", photos: "10,215 photos", image: images.cycling, alt: "Cycling race" },
];

const filters = ["All events", "Running", "Triathlon", "Cycling", "Cebu"];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GetSnap — Find Your Event Photos" },
      { name: "description", content: "Find and buy your event photos from races, triathlons, cycling events, and more across the Philippines." },
      { property: "og:title", content: "GetSnap — Find Your Event Photos" },
      { property: "og:description", content: "Find and keep your best race-day moments across the Philippines." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GetSnapHome,
});

function GetSnapHome() {
  const eventsRef = useRef(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");

  const visibleEvents = events.filter((event) =>
    filter === "all" || event.type.includes(filter) || event.search.toLowerCase().includes(filter),
  );

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const applyFilter = (value) => {
    const normalized = value.toLowerCase();
    setFilter(normalized);
    const hasResults = events.some((event) => normalized === "all" || event.type.includes(normalized) || event.search.toLowerCase().includes(normalized));
    if (!hasResults) notify("No matching events yet. Try another search.");
    window.setTimeout(() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" }), 0);
  };

  useEffect(() => {
    let context;
    let media;
    let cancelled = false;

    const setupMotion = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled || !eventsRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        media = gsap.matchMedia();
        media.add({ desktop: "(min-width: 769px) and (prefers-reduced-motion: no-preference)", mobile: "(max-width: 768px) and (prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" }, (match) => {
          const { desktop, mobile, reduce } = match.conditions;
          const cards = gsap.utils.toArray(".event");
          const cardImages = gsap.utils.toArray(".event-media img");

          if (reduce) {
            gsap.set([".events-kicker", ".events-title", ".events-copy", ".filter", cards], { clearProps: "all", opacity: 1 });
            return;
          }

          const entrance = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: eventsRef.current, start: "top 78%", end: "top 32%", toggleActions: "play none none reverse" },
          });
          entrance
            .from(".events-kicker", { y: mobile ? 12 : 18, opacity: 0, duration: .65 })
            .from(".events-title", { y: mobile ? 20 : 32, opacity: 0, duration: .9 }, "-=.44")
            .from(".events-copy", { y: mobile ? 12 : 22, opacity: 0, duration: .72 }, "-=.5")
            .from(".filter", { y: mobile ? 10 : 16, opacity: 0, stagger: .07, duration: .55 }, "-=.42");

          gsap.from(cards, {
            y: mobile ? 24 : 46,
            scale: mobile ? .99 : .975,
            opacity: 0,
            duration: .95,
            stagger: mobile ? .08 : .12,
            ease: "power3.out",
            scrollTrigger: { trigger: ".event-grid", start: "top 84%", toggleActions: "play none none reverse" },
          });

          cards.forEach((card) => {
            gsap.timeline({
              scrollTrigger: { trigger: card, start: "top 95%", end: "bottom 8%", scrub: mobile ? .35 : .65 },
            })
              .fromTo(card, { scale: mobile ? .992 : .965, opacity: mobile ? .9 : .76 }, { scale: 1, opacity: 1, ease: "none", duration: .48 })
              .to(card, { scale: mobile ? .995 : .985, opacity: mobile ? .95 : .88, ease: "none", duration: .52 });
          });

          cardImages.forEach((image) => {
            gsap.fromTo(image, { yPercent: mobile ? -1.5 : -4 }, {
              yPercent: mobile ? 1.5 : 4,
              ease: "none",
              scrollTrigger: { trigger: image.closest(".event"), start: "top bottom", end: "bottom top", scrub: mobile ? .45 : .8 },
            });
          });

          gsap.fromTo(".events-transition-top", { opacity: 0, scaleY: .5 }, { opacity: .65, scaleY: 1, ease: "none", scrollTrigger: { trigger: eventsRef.current, start: "top 92%", end: "top 55%", scrub: .7 } });
          gsap.fromTo(".events-transition-bottom", { opacity: .65, scaleY: 1 }, { opacity: 0, scaleY: .55, ease: "none", scrollTrigger: { trigger: eventsRef.current, start: "bottom 78%", end: "bottom 28%", scrub: .7 } });
        });

        const refresh = () => ScrollTrigger.refresh();
        const loadedImages = [...eventsRef.current.querySelectorAll("img")];
        loadedImages.forEach((image) => {
          if (!image.complete) image.addEventListener("load", refresh, { once: true });
        });
        window.setTimeout(refresh, 80);
      }, eventsRef);
    };

    setupMotion();
    return () => {
      cancelled = true;
      media?.revert();
      context?.revert();
    };
  }, [filter]);

  return (
    <div className="getsnap-page">
      <header className="shell nav">
        <a className="brand" href="#top"><img src={images.logo} alt="GetSnap logo" /><span>getsnap.ph</span></a>
        <nav className="links" aria-label="Main navigation"><a href="#events">Events</a><a href="#how">How it works</a><a href="#photographers">For photographers</a></nav>
        <div className="nav-actions"><Button variant="ghost" className="pill-btn">Log in</Button><Button className="pill-btn bg-ink text-primary-foreground hover:bg-ink/90">Create account</Button><Button variant="secondary" size="icon" className="menu-btn md:hidden" aria-label="Open menu"><Menu /></Button></div>
      </header>

      <main id="top">
        <div className="shell">
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-inner">
              <div className="eyebrow"><span className="pulse-dot" />Event photos, found fast</div>
              <h1 id="hero-title">Your best moments are already <span className="accent-text">here.</span></h1>
              <p className="hero-copy">Find your photos from runs, rides, races, and celebrations across the Philippines.</p>
              <form className="finder" onSubmit={(e) => { e.preventDefault(); applyFilter(search.trim() || "all"); }}>
                <label className="search-wrap"><Search size={22} /><input aria-label="Search event" placeholder="Search event, city, or organizer" value={search} onChange={(e) => setSearch(e.target.value)} /></label>
                <Button className="pill-btn">Find my event →</Button>
              </form>
              <div className="hero-note"><span><b className="tick">✓</b> AI-powered search</span><span><b className="tick">✓</b> Secure checkout</span><span><b className="tick">✓</b> Instant download</span></div>
            </div>
            <div className="hero-photo-wrap"><img className="hero-photo" src={images.run} alt="Filipino runner celebrating at the finish line" /><div className="snap-mark">SNAP!</div><div className="photo-label"><b>Hunat Sugbu 2026</b><span>Cebu City • 18,420 photos</span></div></div>
          </section>
          <div className="quick-find">
            <article className="quick-card"><div className="quick-icon"><Smile /></div><div><h3>Find with a selfie</h3><p>Match your face across thousands of event photos.</p></div><Button className="pill-btn" onClick={() => setModalOpen(true)}>Upload selfie</Button></article>
            <article className="quick-card"><div className="quick-icon"><Hash /></div><div><h3>Know your bib?</h3><p>Enter it and go.</p></div><form className="bib-entry" onSubmit={(e) => { e.preventDefault(); const value = new FormData(e.currentTarget).get("bib"); value ? notify(`Searching all recent events for bib #${value}…`) : notify("Enter your bib number first."); }}><input name="bib" aria-label="Bib number" placeholder="e.g. 1042" /><Button className="bib-submit" aria-label="Search bib">→</Button></form></article>
          </div>
        </div>

        <section className="shell content-section events-section" id="events" ref={eventsRef}>
          <span className="events-transition-top" aria-hidden="true" />
          <div className="section-head"><div><div className="kicker events-kicker">Fresh from the finish line</div><h2 className="events-title">Recent events</h2></div><p className="events-copy">Real moments from events across the country, ready to find, buy, and keep.</p></div>
          <div className="filters" role="group" aria-label="Filter events">
            {filters.map((label) => <Button key={label} variant="outline" className={`filter ${filter === label.toLowerCase().replace(" events", "") ? "active bg-ink text-primary-foreground border-ink" : ""}`} onClick={() => applyFilter(label.toLowerCase().replace(" events", ""))}>{label}</Button>)}
          </div>
          <div className="event-grid" id="eventGrid">
            {visibleEvents.map((event) => (
              <article className="event" key={event.name} tabIndex={0} role="button" onClick={() => notify(`Opening ${event.name} gallery…`)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") notify(`Opening ${event.name} gallery…`); }}>
                <div className="event-media"><img src={event.image} alt={event.alt} loading="lazy" />{event.badge && <span className="badge">{event.badge}</span>}</div>
                <div className="event-body"><h3>{event.name}</h3><div className="meta"><span><CalendarDays />{event.date}</span><span><MapPin />{event.location}</span></div><div className="event-foot"><span>{event.photos}</span><span className="view-photos">View photos →</span></div></div>
              </article>
            ))}
          </div>
          <span className="events-transition-bottom" aria-hidden="true" />
        </section>

        <section className="process content-section" id="how"><div className="shell process-grid"><div className="process-visual" style={{ backgroundImage: `url(${images.triathlon})` }}><div className="float-card top"><div className="float-title">Match found ✓</div><div className="float-sub">32 photos from your selfie</div></div><div className="float-card bottom"><div className="float-title">Ready to download</div><div className="float-sub">Full resolution, no watermark</div></div></div><div className="process-copy"><div className="kicker">Less scrolling, more reliving</div><h2>Find yourself in seconds.</h2><div className="steps">{[["01", "Choose your event", "Browse recent events or search by event name and location."], ["02", "Search your way", "Use a selfie, bib number, or simply browse the gallery."], ["03", "Keep the moment", "Buy securely and download the high-resolution original instantly."]].map(([num, title, copy]) => <div className="step" key={num}><div className="num">{num}</div><div><h3>{title}</h3><p>{copy}</p></div></div>)}</div></div></div></section>
        <section className="shell content-section photog" id="photographers"><div className="photog-card"><div className="kicker">For photographers</div><h2>Focus on the moment. GetSnap handles the rest.</h2><p>Upload thousands of photos, protect them automatically, reach more participants, and track your sales in one simple workspace.</p><div className="perks"><span>✓ Bulk upload</span><span>✓ Auto watermarking</span><span>✓ Smart face matching</span><span>✓ Sales analytics</span></div><Button className="pill-btn">Start selling your photos →</Button></div></section>
      </main>

      <footer className="site-footer"><div className="shell footer-row"><a className="brand" href="#top"><img src={images.logo} alt="" /><span>getsnap.ph</span></a><div className="footer-links"><a href="#events">Events</a><a href="#photographers">Photographers</a><a href="#top">Privacy</a><a href="#top">Contact</a></div><span>© 2026 GetSnap</span></div></footer>

      {modalOpen && <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}><div className="modal"><Button variant="secondary" className="close-btn" onClick={() => setModalOpen(false)} aria-label="Close"><X /></Button><div className="kicker">AI photo match</div><h2 id="modal-title">Upload a clear selfie</h2><p className="modal-copy">We’ll use it only to find your matching event photos.</p><label className="drop"><div className="quick-icon"><Camera /></div><b>Choose a selfie</b><p>JPG or PNG works best</p><input className="sr-only" type="file" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) { setModalOpen(false); notify("Selfie ready. Choose an event to start matching."); } }} /><Upload className="mx-auto" /></label></div></div>}
      <div className={`toast ${toast ? "show" : ""}`} role="status">{toast}</div>
    </div>
  );
}
