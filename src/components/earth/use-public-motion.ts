import { useEffect, type RefObject } from "react";

/** Progressive enhancement: content stays readable without motion or JavaScript. */
export function usePublicMotion(ref: RefObject<HTMLDivElement | null>, pathname: string) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dispose = () => {};
    const setup = () => {
      dispose();
      if (preference.matches) return;
      const animations: Animation[] = [];
      const selector =
        ".earth-section-heading, .earth-page-intro-copy > *, .earth-challenge, .earth-workflow article, .earth-solution-card, .earth-audience-grid article, .earth-trust-grid article, .earth-detailed-sections > article, .earth-application-details > article, .earth-long-workflow > article, .earth-insights > article, .earth-program-preview > *, .earth-two-grid > *, .earth-final .earth-container > *, .carbon-practice, .carbon-timeline > li";
      const targets = Array.from(root.querySelectorAll<HTMLElement>(selector));
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter((entry) => entry.isIntersecting);
          visible.forEach((entry, index) => {
            const target = entry.target as HTMLElement;
            const animation = target.animate(
              [
                { opacity: 0, transform: "translateY(32px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              {
                duration: 850,
                delay: Math.min(index, 4) * 90,
                easing: "cubic-bezier(.22,1,.36,1)",
                fill: "backwards",
              },
            );
            animations.push(animation);
            target.dataset["revealed"] = "true";
            observer.unobserve(target);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -35px 0px" },
      );
      targets.forEach((target) => observer.observe(target));
      // Image and visual panels unveil with a soft clip reveal, like a curtain lifting.
      const visuals = Array.from(
        root.querySelectorAll<HTMLElement>(
          ".home-gallery figure, .opp-photos figure, .opp-quick, .earth-evidence-map, .earth-graph, .earth-demo, .field-perspective, .earth-landscape, figure, .earth-product-demo",
        ),
      );
      const visualObserver = new IntersectionObserver(
        (entries) => {
          entries
            .filter((e) => e.isIntersecting)
            .forEach((entry) => {
              const el = entry.target as HTMLElement;
              animations.push(
                el.animate(
                  [
                    {
                      clipPath: "inset(12% 6% 12% 6% round 28px)",
                      opacity: 0.4,
                      transform: "scale(.97)",
                    },
                    { clipPath: "inset(0% 0% 0% 0% round 0px)", opacity: 1, transform: "scale(1)" },
                  ],
                  { duration: 1200, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" },
                ),
              );
              visualObserver.unobserve(el);
            });
        },
        { threshold: 0.12 },
      );
      visuals.forEach((v) => visualObserver.observe(v));
      // Headings slide up from behind a mask for a confident, editorial entrance.
      const headings = Array.from(
        root.querySelectorAll<HTMLElement>("main h2, .earth-carbon-page h2"),
      );
      const headingObserver = new IntersectionObserver(
        (entries) => {
          entries
            .filter((e) => e.isIntersecting)
            .forEach((entry) => {
              const el = entry.target as HTMLElement;
              animations.push(
                el.animate(
                  [
                    { clipPath: "inset(0 0 100% 0)", transform: "translateY(40%)" },
                    { clipPath: "inset(0 0 -20% 0)", transform: "translateY(0)" },
                  ],
                  { duration: 1000, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" },
                ),
              );
              headingObserver.unobserve(el);
            });
        },
        { threshold: 0.2 },
      );
      headings.forEach((h) => headingObserver.observe(h));
      // Grid children cascade in sequence.
      root
        .querySelectorAll<HTMLElement>(
          ".earth-solution-grid, .earth-audience-grid, .earth-trust-grid, .earth-workflow",
        )
        .forEach((grid) => {
          const kids = Array.from(grid.children) as HTMLElement[];
          kids.forEach((kid, i) => kid.style.setProperty("--stagger", String(i)));
        });
      root.querySelectorAll<HTMLElement>(".earth-hero-copy > *").forEach((target, index) => {
        animations.push(
          target.animate(
            [
              { opacity: 0, transform: "translateY(24px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              duration: 1000,
              delay: index * 100,
              easing: "cubic-bezier(.22,1,.36,1)",
              fill: "backwards",
            },
          ),
        );
      });
      let frame = 0;
      const images = root.querySelectorAll<HTMLElement>(
        ".earth-hero-image, .field-perspective-image, .earth-photo-story img, .earth-about-image img, .earth-program-detail > img",
      );
      const update = () => {
        frame = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        root.style.setProperty("--reading-progress", String(max > 0 ? window.scrollY / max : 0));
        images.forEach((image) => {
          const rect = image.parentElement?.getBoundingClientRect();
          if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) return;
          const offset = Math.max(-45, Math.min(45, -rect.top * 0.09));
          const scale = image.matches(".earth-hero-image, .field-perspective-image") ? 1.12 : 1.06;
          image.style.transform = `translateY(${offset}px) scale(${scale})`;
        });
      };
      const onScroll = () => {
        if (!frame) frame = requestAnimationFrame(update);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      update();
      dispose = () => {
        observer.disconnect();
        visualObserver.disconnect();
        headingObserver.disconnect();
        animations.forEach((animation) => animation.cancel());
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        cancelAnimationFrame(frame);
        images.forEach((image) => {
          image.style.transform = "";
        });
        root.style.removeProperty("--reading-progress");
      };
    };
    setup();
    preference.addEventListener("change", setup);
    return () => {
      dispose();
      preference.removeEventListener("change", setup);
    };
  }, [ref, pathname]);
}
