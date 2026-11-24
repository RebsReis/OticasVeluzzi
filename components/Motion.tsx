'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Animações de entrada (seção 05 do Design System):
 * - [data-reveal]        → fade-up 600ms com stagger de 100ms, dispara com ~15% visível
 * - hero                 → .hero-in (CSS) fade-in + translateY 24px em 900ms
 * - [data-parallax]      → parallax discreto (desligado no mobile)
 * Respeita prefers-reduced-motion e simplifica no mobile.
 */
export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 767px)').matches;
    const offset = mobile ? 12 : 24;

    const ctx = gsap.context(() => {
      // O hero usa animação CSS (.hero-in, 900ms) para funcionar também na troca de banners
      const rest = gsap.utils.toArray<HTMLElement>('[data-reveal]').filter((el) => el.getBoundingClientRect().top > window.innerHeight * 0.85);
      if (reduce) return;

      gsap.set(rest, { opacity: 0, y: offset });
      ScrollTrigger.batch(rest, {
        start: 'top 85%',
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: mobile ? 0.45 : 0.6, ease, stagger: 0.1, overwrite: true }),
      });

      if (!mobile) {
        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
          gsap.fromTo(el, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: el, scrub: true } });
        });
      }
    });

    const refresh = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => { clearTimeout(refresh); ctx.revert(); };
  }, [pathname]);

  return null;
}
