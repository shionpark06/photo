'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { fetchPlans, type Plan } from '@/lib/data';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';

gsap.registerPlugin(ScrollTrigger);

const planImages = [
  { src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80', y: 0,  speed: 0.8 },
  { src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80', y: 28, speed: 0.6 },
  { src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', y: 56, speed: 1.0 },
  { src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80', y: 0,  speed: 0.7 },
  { src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80', y: 28, speed: 0.9 },
  { src: 'https://images.unsplash.com/photo-1506956191951-7a88da4435e5?auto=format&fit=crop&w=800&q=80', y: 56, speed: 0.8 },
];

export default function Gallery() {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    fetchPlans().then(setPlans).catch(() => setPlans([]));
  }, []);

  useEffect(() => {
    if (plans.length === 0 || isMobile) return;
    const ctx = gsap.context(() => {
      imagesRef.current.forEach((img, i) => {
        if (!img) return;

        gsap.to(img, {
          y: () => -60 * (planImages[i]?.speed || 1),
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [plans, isMobile]);

  return (
    <div ref={containerRef} className="relative w-full min-h-[110vh] bg-notion-bg overflow-hidden py-14 md:py-20" id="plans">
      <div className="max-w-7xl mx-auto px-6 relative h-full">
        <div className="mb-8 md:mb-10 flex items-end justify-between">
          <div>
            <span className="text-notion-text-muted text-xs font-medium tracking-[0.2em] uppercase">Sessions</span>
            <h2 className="mt-2 text-[clamp(28px,4vw,52px)] font-medium tracking-tight text-notion-text">
              Our Packages
            </h2>
          </div>
          <p className="hidden md:block text-notion-text-muted font-medium text-base max-w-xs text-right leading-snug">
            All plans include high-res digital delivery.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative">
          {plans.map((plan, i) => {
            const imgData = planImages[i] || planImages[0];
            return (
              <div
                key={plan.id}
                ref={(el) => {
                  imagesRef.current[i] = el;
                }}
                className={`relative w-full group ${isMobile ? 'mx-auto max-w-[304px]' : ''}`}
                style={{ marginTop: isMobile ? `${(i % 2) * 18}px` : `${imgData.y}px` }}
              >
                <Link href={`/plan/${plan.slug}`} className="block">
                  <div className="relative w-full h-[300px] md:h-auto md:aspect-[4/5] overflow-hidden rounded-2xl shadow-sm bg-notion-bg-hover mb-4 md:mb-5">
                    <Image
                      src={imgData.src}
                      alt={plan.name}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      referrerPolicy="no-referrer"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                  <div className="px-1">
                    <div className="flex justify-between items-baseline mb-1.5">
                      <h3 className="text-base md:text-lg font-medium tracking-tight text-notion-text">{plan.name}</h3>
                      <span className="text-xs md:text-sm font-medium text-notion-text-muted">from ${plan.price}</span>
                    </div>
                    <p className="text-sm text-notion-text-muted line-clamp-1 leading-relaxed">{plan.description}</p>
                    <div className="mt-1.5 text-xs font-medium text-notion-text-muted/60 uppercase tracking-widest">
                      {plan.duration} min session
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
