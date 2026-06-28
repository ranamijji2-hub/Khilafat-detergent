import { FlaskConical, Shirt, Leaf, BadgeCheck, Sparkles, ShieldCheck, Droplets } from 'lucide-react';

const ICONS = {
  flask: FlaskConical,
  shirt: Shirt,
  leaf: Leaf,
  badge: BadgeCheck,
  sparkles: Sparkles,
  shield: ShieldCheck,
  droplets: Droplets,
};

export default function WhyChooseUs({ items }) {
  return (
    <section className="relative -mt-10 px-4 sm:-mt-14">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 rounded-2xl bg-white p-6 shadow-soft sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = ICONS[item.icon] || Sparkles;
          return (
            <div key={item.title} className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={24} />
              </span>
              <div>
                <h3 className="font-heading text-sm font-bold text-ink">{item.title}</h3>
                <p className="mt-1 text-sm text-ink/60">{item.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
