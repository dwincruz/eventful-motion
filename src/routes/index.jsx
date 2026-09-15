import { createFileRoute } from "@tanstack/react-router";
import {
  Bike,
  CalendarDays,
  Camera,
  GraduationCap,
  Hash,
  MapPin,
  Menu,
  PartyPopper,
  Quote,
  Search,
  Smile,
  Sparkles,
  Timer,
  Upload,
  Wallet,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import CameraIntro from "@/components/CameraIntro";
import logoAsset from "@/assets/getsnap-logo.png.asset.json";
import runAsset from "@/assets/run.webp.asset.json";
import triathlonAsset from "@/assets/triathlon.webp.asset.json";
import cyclingAsset from "@/assets/cycling.webp.asset.json";
import funrunPhoto from "@/assets/funrun.jpg";
import schoolPhoto from "@/assets/school.jpg";

const images = {
  logo: logoAsset.url,
  run: runAsset.url,
  triathlon: triathlonAsset.url,
  cycling: cyclingAsset.url,
  funrun: funrunPhoto,
  school: schoolPhoto,
};

const events = [
  { name: "Hunat Sugbu 2026", search: "Hunat Sugbu 2026 Cebu running", type: "running cebu", date: "Sep 13, 2026", location: "Cebu City", photos: "18,420 photos", image: images.run, alt: "Runner at a finish line", badge: "Just added" },
  { name: "Santé Barley Trilogy Leg 3", search: "Sante Barley Trilogy Cebu triathlon", type: "triathlon cebu", date: "Sep 6, 2026", location: "Lapu-Lapu City", photos: "26,805 photos", image: images.triathlon, alt: "Triathletes entering the water", badge: "Featured" },
  { name: "Tour de Bohol", search: "Tour de Bohol cycling Bohol", type: "cycling", date: "Aug 30, 2026", location: "Panglao, Bohol", photos: "12,960 photos", image: images.cycling, alt: "Cyclists racing on a coastal road" },
  { name: "Ormoc City Fun Run", search: "Ormoc City Fun Run Leyte", type: "running", date: "Aug 23, 2026", location: "Ormoc City", photos: "8,740 photos", image: images.funrun, alt: "Road running event" },
  { name: "Davao Gulf Triathlon", search: "Davao Gulf Triathlon Davao", type: "triathlon", date: "Aug 16, 2026", location: "Davao City", photos: "21,380 photos", image: images.triathlon, alt: "Open water swimming event" },
  { name: "Cebu Coastal Ride", search: "Cebu Coastal Ride Cebu cycling", type: "cycling cebu", date: "Aug 9, 2026", location: "Cebu Province", photos: "10,215 photos", image: images.cycling, alt: "Cycling race" },
];

const filters = ["All events", "Running", "Triathlon", "Cycling", "Cebu"];

const stats = [
  { value: 1240000, suffix: "+", label: "Photos indexed" },
  { value: 860, suffix: "+", label: "Events covered" },
  { value: 420, suffix: "", label: "Pro photographers" },
];

const categories = [
  { title: "Marathons", copy: "Road races from 5K to full marathon distance.", icon: Timer, image: images.run },
  { title: "Cycling", copy: "Gran fondos, criteriums, and island century rides.", icon: Bike, image: images.cycling },
  { title: "Fun runs", copy: "Color runs, charity runs, and corporate races.", icon: PartyPopper, image: images.funrun },
  { title: "School events", copy: "Palaro, intramurals, and field day coverage.", icon: GraduationCap, image: images.school },
];

const testimonials = [
  { quote: "I found all 34 of my photos from a selfie in under a minute. Wala nang scrolling.", name: "Maricar L.", role: "Runner, Cebu City" },
  { quote: "As a photographer I finally get paid fast, and the watermarking is automatic.", name: "Jhun P.", role: "Event photographer, Davao" },
  { quote: "We uploaded 40,000 photos for our fun run and participants found themselves instantly.", name: "Arcee T.", role: "Race organizer, Iloilo" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GetSnap — Find Your Race Photos in Seconds" },
      { name: "description", content: "GetSnap is the Philippine event-photography marketplace. Find your marathon, cycling, fun run, and school event photos by bib number or selfie." },
      { property: "og:title", content: "GetSnap — Find Your Race Photos in Seconds" },
      { property: "og:description", content: "Find your marathon, cycling, fun run, and school event photos by bib number or selfie." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GetSnapHome,
});

function formatStat(value) {
  return value >= 1000000
    ? `${(value / 1000000).toFixed(2)}M`
    : value.toLocaleString("en-US");
}

function GetSnapHome() {
  const pageRef = useRef(null);
  const eventsRef = useRef(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [navSolid, setNavSolid] = useState(false);

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

  const handleIntroProgress = useCallback((progress) => {
    setNavSolid(progress > 0.55);
  }, []);

  // Page-wide scroll motion: progress bar, section reveals, stat counters.
  useEffect(() => {
    let ctx;
    let mm;
    let cancelled = false;

    const run = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !pageRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.to(".scroll-progress-bar", {
          scaleX: 1,
          ease: "none",
          transformOrigin: "left center",
          scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
        });

        mm = gsap.matchMedia();
        mm.add(
          {
            motion: "(prefers-reduced-motion: no-preference)",
            reduce: "(prefers-reduced-motion: reduce)",
            mobile: "(max-width: 768px)",
          },
          (match) => {
            const { motion, reduce, mobile } = match.conditions;
            const groups = gsap.utils.toArray("[data-reveal]");

            if (reduce || !motion) {
              groups.forEach((group) => gsap.set(group.children, { clearProps: "all", opacity: 1 }));
              document.querySelectorAll("[data-count]").forEach((node) => {
                node.textContent = formatStat(Number(node.dataset.count));
              });
              return;
            }

            groups.forEach((group) => {
              gsap.from(group.children, {
                y: mobile ? 24 : 44,
                opacity: 0,
                duration: 0.95,
                stagger: mobile ? 0.08 : 0.13,
                ease: "sine.out",
                scrollTrigger: { trigger: group, start: "top 82%", toggleActions: "play none none reverse" },
              });
            });

            gsap.utils.toArray("[data-count]").forEach((node) => {
              const target = Number(node.dataset.count);
              const counter = { value: 0 };
              gsap.to(counter, {
                value: target,
                duration: 1.6,
                ease: "power2.out",
                scrollTrigger: { trigger: node, start: "top 90%", toggleActions: "play none none none" },
                onUpdate: () => {
                  node.textContent = formatStat(Math.round(counter.value));
                },
              });
            });

            gsap.utils.toArray(".collage-tile").forEach((tile, index) => {
              gsap.fromTo(
                tile,
                { yPercent: index % 2 ? 4 : -4 },
                {
                  yPercent: index % 2 ? -4 : 4,
                  ease: "none",
                  scrollTrigger: { trigger: tile, start: "top bottom", end: "bottom top", scrub: mobile ? 0.5 : 1 },
                },
              );
            });
          },
        );
      }, pageRef);
    };

    run();
    return () => {
      cancelled = true;
      mm?.revert();
      ctx?.revert();
    };
  }, []);

  // Events section motion (scroll-driven focus, parallax, edge transitions).
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
          const { mobile, reduce } = match.conditions;
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
    <div className="getsnap-page" ref={pageRef}>
      <div className="scroll-progress" aria-hidden="true"><span className="scroll-progress-bar" /></div>

      <header className={`nav-bar ${navSolid ? "is-solid" : ""}`}>
        <div className="shell nav">
          <a className="brand" href="#top"><img src={images.logo} alt="GetSnap logo" /><span>getsnap.ph</span></a>
          <nav className="links" aria-label="Main navigation"><a href="#categories">Categories</a><a href="#events">Events</a><a href="#how">How it works</a><a href="#photographers">For photographers</a></nav>
          <div className="nav-actions">
            <Button variant="ghost" className="pill-btn nav-ghost">Log in</Button>
            <Button className="pill-btn nav-cta">Create account</Button>
            <Button variant="secondary" size="icon" className="menu-btn md:hidden" aria-label="Open menu"><Menu /></Button>
          </div>
        </div>
      </header>

      <main id="top">
        <CameraIntro onProgress={handleIntroProgress}>
          <div className="cine-hero-inner">
            <div className="cine-reveal eyebrow"><span className="pulse-dot" />Philippine event photography</div>
            <h1 className="cine-reveal cine-title">Your best moments are already <span className="accent-text">here.</span></h1>
            <p className="cine-reveal cine-copy">Search by bib number or selfie and find every photo of you from runs, rides, and races nationwide.</p>

            <div className="cine-reveal search-card">
              <form className="finder" onSubmit={(e) => { e.preventDefault(); applyFilter(search.trim() || "all"); }}>
                <label className="search-wrap"><Search size={20} /><input aria-label="Search event" placeholder="Search event, city, or organizer" value={search} onChange={(e) => setSearch(e.target.value)} /></label>
                <Button className="pill-btn">Find my event →</Button>
              </form>
              <div className="search-split">
                <form className="bib-entry" onSubmit={(e) => { e.preventDefault(); const value = new FormData(e.currentTarget).get("bib"); value ? notify(`Searching all recent events for bib #${value}…`) : notify("Enter your bib number first."); }}>
                  <Hash size={16} />
                  <input name="bib" aria-label="Bib number" placeholder="Bib no. 1042" />
                  <Button className="bib-submit" aria-label="Search bib">→</Button>
                </form>
                <Button variant="outline" className="pill-btn selfie-btn" onClick={() => setModalOpen(true)}><Smile size={18} />Search with a selfie</Button>
              </div>
            </div>

            <div className="cine-reveal stat-row">
              {stats.map((stat) => (
                <div className="stat" key={stat.label}>
                  <b><span data-count={stat.value}>0</span>{stat.suffix}</b>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="cine-reveal collage">
              <img className="collage-tile" src={images.run} alt="Runner crossing the finish line" loading="lazy" />
              <img className="collage-tile" src={images.cycling} alt="Cyclists on a coastal road" loading="lazy" />
              <img className="collage-tile" src={images.funrun} alt="Fun run participants at sunrise" loading="lazy" />
              <img className="collage-tile" src={images.triathlon} alt="Triathletes entering the water" loading="lazy" />
            </div>
          </div>
        </CameraIntro>

        <section className="shell content-section" id="categories" aria-labelledby="categories-title">
          <div className="section-head" data-reveal>
            <div><div className="kicker">Every kind of finish line</div><h2 id="categories-title">Event categories</h2></div>
            <p>From provincial fun runs to national championships — coverage across the archipelago.</p>
          </div>
          <div className="category-grid" data-reveal>
            {categories.map(({ title, copy, icon: Icon, image }) => (
              <article className="category" key={title}>
                <div className="category-media"><img src={image} alt="" loading="lazy" /></div>
                <div className="category-body">
                  <span className="category-icon"><Icon size={20} /></span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="shell content-section events-section" id="events" ref={eventsRef}>
          <span className="events-transition-top" aria-hidden="true" />
          <div className="section-head"><div><div className="kicker events-kicker">Fresh from the finish line</div><h2 className="events-title">Recent events</h2></div><p className="events-copy">Real moments from events across the country, ready to find, buy, and keep.</p></div>
          <div className="filters" role="group" aria-label="Filter events">
            {filters.map((label) => <Button key={label} variant="outline" className={`filter ${filter === label.toLowerCase().replace(" events", "") ? "active" : ""}`} onClick={() => applyFilter(label.toLowerCase().replace(" events", ""))}>{label}</Button>)}
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

        <section className="process content-section" id="how">
          <div className="shell process-grid">
            <div className="process-visual" style={{ backgroundImage: `url(${images.triathlon})` }}>
              <div className="float-card top"><div className="float-title">Match found ✓</div><div className="float-sub">32 photos from your selfie</div></div>
              <div className="float-card bottom"><div className="float-title">Ready to download</div><div className="float-sub">Full resolution, no watermark</div></div>
            </div>
            <div className="process-copy" data-reveal>
              <div className="kicker">Less scrolling, more reliving</div>
              <h2>Find yourself in seconds.</h2>
              <div className="steps">
                {[["01", "Choose your event", "Browse recent events or search by event name and location."], ["02", "Search your way", "Use a selfie, bib number, or simply browse the gallery."], ["03", "Keep the moment", "Buy securely and download the high-resolution original instantly."]].map(([num, title, copy]) => (
                  <div className="step" key={num}><div className="num">{num}</div><div><h3>{title}</h3><p>{copy}</p></div></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="shell content-section payout-section" id="photographers">
          <div className="payout-card" data-reveal>
            <div className="payout-figure"><Wallet size={26} /><b>80%</b><span>of every sale goes straight to the photographer</span></div>
            <div className="payout-copy">
              <div className="kicker gold">For photographers</div>
              <h2>Shoot the moment. Keep the bigger share.</h2>
              <p>Weekly payouts to GCash or bank transfer, automatic watermarking, bulk upload, and face-match delivery — all handled for you.</p>
              <Button className="pill-btn payout-cta"><Sparkles size={18} />Start selling your photos</Button>
            </div>
          </div>
        </section>

        <section className="shell content-section" aria-labelledby="loved-title">
          <div className="section-head" data-reveal>
            <div><div className="kicker">Loved nationwide</div><h2 id="loved-title">What the community says</h2></div>
            <p>Runners, riders, organizers, and photographers using GetSnap every weekend.</p>
          </div>
          <div className="testimonial-grid" data-reveal>
            {testimonials.map((item) => (
              <figure className="testimonial" key={item.name}>
                <Quote className="testimonial-mark" size={22} />
                <blockquote>{item.quote}</blockquote>
                <figcaption><b>{item.name}</b><span>{item.role}</span></figcaption>
              </figure>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-grid" data-reveal>
          <div>
            <a className="brand" href="#top"><img src={images.logo} alt="" /><span>getsnap.ph</span></a>
            <p className="footer-tag">Less scrolling, more reliving.</p>
          </div>
          <div className="footer-col"><b>Explore</b><a href="#categories">Categories</a><a href="#events">Events</a><a href="#how">How it works</a></div>
          <div className="footer-col"><b>Photographers</b><a href="#photographers">Sell your photos</a><a href="#photographers">Payouts</a><a href="#top">Support</a></div>
          <div className="footer-col"><b>Company</b><a href="#top">About</a><a href="#top">Privacy</a><a href="#top">Contact</a></div>
        </div>
        <div className="shell footer-base"><span>© 2026 GetSnap · Made in the Philippines</span></div>
      </footer>

      {modalOpen && <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}><div className="modal"><Button variant="secondary" className="close-btn" onClick={() => setModalOpen(false)} aria-label="Close"><X /></Button><div className="kicker">AI photo match</div><h2 id="modal-title">Upload a clear selfie</h2><p className="modal-copy">We’ll use it only to find your matching event photos.</p><label className="drop"><div className="quick-icon"><Camera /></div><b>Choose a selfie</b><p>JPG or PNG works best</p><input className="sr-only" type="file" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) { setModalOpen(false); notify("Selfie ready. Choose an event to start matching."); } }} /><Upload className="mx-auto" /></label></div></div>}
      <div className={`toast ${toast ? "show" : ""}`} role="status">{toast}</div>
    </div>
  );
}
