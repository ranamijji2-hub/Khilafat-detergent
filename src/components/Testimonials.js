import { Star, Quote } from 'lucide-react';

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;
  return (
    <section className="bg-[var(--color-primary-dark)] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">What Customers Say</span>
          <h2 className="mt-2 font-heading text-3xl font-extrabold text-white sm:text-4xl">Loved by Households Across Pakistan</h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <div key={i} className="rounded-2xl bg-white/5 p-6 backdrop-blur-sm">
              <Quote size={26} className="text-accent" />
              <p className="mt-3 text-sm leading-relaxed text-white/85">{t.text}</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">{t.name}</div>
                  <div className="text-xs text-white/50">{t.location}</div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      size={14}
                      className={idx < t.rating ? 'fill-accent text-accent' : 'text-white/20'}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
