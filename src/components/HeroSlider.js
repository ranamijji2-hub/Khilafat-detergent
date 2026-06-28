'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Leaf, Droplets } from 'lucide-react';

const FEATURES = [
  { icon: Sparkles, label: 'Deep Cleaning Formula' },
  { icon: ShieldCheck, label: 'Gentle on Clothes' },
  { icon: Droplets, label: 'Fresh Fragrance' },
  { icon: Leaf, label: 'Safe for All Fabrics' },
];

const BUBBLE_LAYOUT = [
  { top: '8%', left: '6%', size: 26, delay: '0s', slow: true },
  { top: '70%', left: '4%', size: 16, delay: '1.2s' },
  { top: '20%', left: '92%', size: 20, delay: '0.6s' },
  { top: '78%', left: '90%', size: 30, delay: '0.3s', slow: true },
  { top: '50%', left: '50%', size: 14, delay: '0.9s' },
];

export default function HeroSlider({ banners }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const slides = banners && banners.length > 0 ? banners : [];

  const next = useCallback(() => {
    setIndex((i) => (slides.length ? (i + 1) % slides.length : 0));
  }, [slides.length]);

  const prev = useCallback(() => {
    setIndex((i) => (slides.length ? (i - 1 + slides.length) % slides.length : 0));
  }, [slides.length]);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [paused, next, slides.length]);

  if (slides.length === 0) return null;
  const slide = slides[index];

  return (
    <section
      className="relative overflow-hidden water-bg"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {/* ambient bubbles */}
      {BUBBLE_LAYOUT.map((b, i) => (
        <span
          key={i}
          className={`bubble ${b.slow ? 'animate-float-slower' : 'animate-float-slow'}`}
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            animationDelay: b.delay,
          }}
        />
      ))}

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 sm:py-20 lg:grid-cols-2 lg:py-24">
        <div className="relative z-10" key={`text-${index}`}>
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-primary animate-rise-fade">
            {slide.subtitle ? 'Khilafat Detergent' : 'Khilafat Detergent'}
          </span>
          <h1 className="animate-rise-fade font-heading text-4xl font-extrabold leading-tight text-ink sm:text-5xl lg:text-6xl">
            {slide.title.split(' ').slice(0, 1)}{' '}
            <span className="text-gradient-brand">{slide.title.split(' ').slice(1).join(' ')}</span>
          </h1>
          {slide.subtitle && (
            <p className="mt-4 max-w-md animate-rise-fade text-lg text-ink/70" style={{ animationDelay: '0.1s' }}>
              {slide.subtitle}
            </p>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.label} className="flex flex-col items-center gap-1.5 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/20 text-primary">
                  <f.icon size={20} />
                </span>
                <span className="text-[11px] font-semibold leading-tight text-ink/60">{f.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={slide.ctaLink || '/products'} className="btn-primary rounded-full px-7 py-3 text-sm font-bold shadow-soft">
              {slide.ctaText || 'Shop Now'}
            </Link>
            <Link
              href="/contact"
              className="rounded-full border-2 border-primary px-7 py-3 text-sm font-bold text-primary transition hover:bg-primary hover:text-white"
            >
              Contact Us
            </Link>
          </div>

          {(slide.urduLine1 || slide.urduLine2) && (
            <div className="mt-6 hidden text-right font-heading text-accent sm:block" dir="rtl" lang="ur">
              {slide.urduLine1 && <p className="text-xl font-bold text-primary">{slide.urduLine1}</p>}
              {slide.urduLine2 && <p className="text-2xl font-extrabold">{slide.urduLine2}</p>}
            </div>
          )}
        </div>

        <div className="relative z-10 flex justify-center">
          <div className="relative animate-float-slow">
            <div className="absolute inset-0 -z-10 rounded-full bg-secondary/20 blur-3xl" />
            <img
              src={slide.image || '/images/brand/hero-pack.webp'}
              alt="Khilafat Detergent pack"
              className="relative w-64 drop-shadow-2xl sm:w-80 lg:w-96"
            />
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={prev}
            className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/80 p-2 text-primary shadow-card hover:bg-white sm:flex"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            aria-label="Next slide"
            onClick={next}
            className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/80 p-2 text-primary shadow-card hover:bg-white sm:flex"
          >
            <ChevronRight size={22} />
          </button>
          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-7 bg-primary' : 'w-2 bg-primary/30'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
