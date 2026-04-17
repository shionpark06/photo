'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export default function AboutCursorReveal() {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Ref for the tall scrolling section
  const sectionRef = useRef<HTMLDivElement>(null);
  // Ref for the sticky viewport-sized content
  const stickyRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'] // Tracks while the section is stickied and scrolling
  });

  // Fade logic updated:
  // 0.00 - 0.05: Arrives and sticks as pure white
  // 0.05 - 0.15: Quick but smooth transition into black
  // 0.15 - 1.00: Stays fully black until the end
  const fadeValue = useTransform(scrollYProgress, 
    [0, 0.05, 0.15, 1], 
    [0, 0, 1, 1]
  );

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      if (stickyRef.current) {
        const rect = stickyRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  const size = isHovered ? 400 : 40;

  const innerContainerClass = "w-full h-full max-w-[1400px] mx-auto flex items-center justify-start px-6 md:px-12";
  const textClass = "text-[32px] md:text-[64px] leading-[1.1] font-medium tracking-tight max-w-4xl text-left";

  const baseText = "We are a selectively skilled photography studio with a strong focus on capturing high-quality & impactful cinematic moments.";
  const alternateText = "Crafting elegant session narratives - where art meets memory - delivering timeless frames that you will genuinely cherish.";

  return (
    <section 
      id="about"
      className="w-full relative h-[150vh] cursor-default bg-[#fcfcfc]" 
      ref={sectionRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div ref={stickyRef} className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* LAYER 1: White Background, Black Base Text (Always present under everything) */}
        <div className="absolute inset-0 bg-[#fcfcfc] text-black">
          <div className={innerContainerClass}>
            <p className={textClass}>{baseText}</p>
          </div>
        </div>

        {/* LAYER 2: Black Background, White Base Text (Fades in on scroll) */}
        <motion.div 
          className="absolute inset-0 bg-black text-white pointer-events-none"
          style={{ opacity: fadeValue }}
        >
          <div className={innerContainerClass}>
            <p className={textClass}>{baseText}</p>
          </div>
        </motion.div>

        {/* LAYER 3: White Background, Black Alternate Text with Cursor Mask (Fades in, tracks cursor) */}
        <motion.div
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          animate={{
            WebkitMaskPosition: `${mousePosition.x - size / 2}px ${mousePosition.y - size / 2}px`,
            WebkitMaskSize: `${size}px`,
          } as any}
          transition={{ type: 'tween', ease: 'backOut', duration: 0.15 }}
          className="absolute inset-0 bg-[#fcfcfc] text-black pointer-events-none"
          style={{
            opacity: fadeValue,
            maskImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNEOUQ5RDkiLz4KPC9zdmc+Cg==")`,
            maskRepeat: 'no-repeat',
            WebkitMaskImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNEOUQ5RDkiLz4KPC9zdmc+Cg==")`,
            WebkitMaskRepeat: 'no-repeat',
          }}
        >
          <div className={innerContainerClass}>
            <p className={textClass}>{alternateText}</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
