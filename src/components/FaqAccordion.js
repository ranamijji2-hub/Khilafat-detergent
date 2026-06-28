'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import JsonLd from './JsonLd';

export default function FaqAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!faqs || faqs.length === 0) return null;

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <section className="bg-white py-16 sm:py-20">
      <JsonLd data={faqJsonLd} />
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary">FAQs</span>
          <h2 className="mt-2 font-heading text-3xl font-extrabold text-ink sm:text-4xl">Frequently Asked Questions</h2>
        </div>

        <div className="mt-8 divide-y divide-gray-100 rounded-2xl border border-gray-100 shadow-card">
          {faqs.map((f, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i}>
                <button
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-sm font-bold text-ink sm:text-base">{f.question}</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-primary transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && <p className="px-5 pb-4 text-sm leading-relaxed text-ink/65">{f.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
