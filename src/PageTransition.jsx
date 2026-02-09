import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CircleRevealTransition = ({ 
  color1, 
  triggerRef, 
  currentSectionRef,
  nextSectionRef,
  originPosition = "center",
  isDual = false,
  dualOrigins = null,
  delay = 0.25
}) => {
  const containerRef = useRef(null);
  const nextPageOverlayRef = useRef(null);
  const outerRingRef = useRef(null);
  const outerCircleRef = useRef(null);
  const innerCircleRef = useRef(null);

  // Grouping refs for Dual mode to keep code clean
  const circles1Ref = useRef({ outer: null, inner: null });
  const circles2Ref = useRef({ outer: null, inner: null });

  const [nextPageContent, setNextPageContent] = useState("");

  const getOriginCoordinates = (position) => {
    const positions = {
      "top-left": { x: 5, y: 5 },
      "bottom-right": { x: 95, y: 95 },
      "top-right": { x: 95, y: 5 },
      "bottom-left": { x: 5, y: 95 },
      "center": { x: 50, y: 50 },
    };
    return positions[position] || positions.center;
  };

  // 1. Sync content only when necessary (not every frame)
  useEffect(() => {
    if (nextSectionRef?.current) {
      setNextPageContent(nextSectionRef.current.innerHTML);
    }
  }, [nextSectionRef]);

  // 2. Main GSAP Logic
  useLayoutEffect(() => {
    if (!triggerRef?.current || !nextSectionRef?.current || !currentSectionRef?.current) return;

    const ctx = gsap.context(() => {
      const maxSizePx = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) * 3;
      const maxSizeVw = (maxSizePx / window.innerWidth) * 100;
      const origin = getOriginCoordinates(originPosition);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 2,
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const display = (progress > 0 && progress < 1) ? "block" : "none";
            
            // Direct DOM manipulation is faster than useState for visibility
            gsap.set([containerRef.current, nextPageOverlayRef.current, outerRingRef.current], { display });

            if (progress > 0 && progress < 1) {
              gsap.set(nextSectionRef.current, { opacity: 1, zIndex: 5 });
              gsap.set(currentSectionRef.current, { 
                opacity: progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1, 
                zIndex: 10 
              });
            }
          },
          onLeave: () => {
            gsap.set(currentSectionRef.current, { opacity: 0, zIndex: 1 });
            gsap.set(nextSectionRef.current, { opacity: 1, zIndex: 10 });
            gsap.set([containerRef.current, nextPageOverlayRef.current, outerRingRef.current], { display: "none" });
          },
          onEnterBack: () => {
            gsap.set([containerRef.current, nextPageOverlayRef.current, outerRingRef.current], { display: "block" });
          },
          onLeaveBack: () => {
            gsap.set(nextSectionRef.current, { opacity: 0, zIndex: 1 });
            gsap.set(currentSectionRef.current, { opacity: 1, zIndex: 10 });
            gsap.set([containerRef.current, nextPageOverlayRef.current, outerRingRef.current], { display: "none" });
          }
        },
      });

      // Update CSS Variables on the container to drive the clip-paths
      // This is 10x faster than updating React state
      const updateClipSizes = (outer, inner, outer2 = null, inner2 = null) => {
        const target = containerRef.current;
        if (!target) return;
        target.style.setProperty('--o-size', `${outer}vw`);
        target.style.setProperty('--i-size', `${inner}vw`);
        if (outer2 !== null) target.style.setProperty('--o2-size', `${outer2}vw`);
        if (inner2 !== null) target.style.setProperty('--i2-size', `${inner2}vw`);
      };

      if (isDual && dualOrigins?.length === 2) {
        const o1 = { x: parseFloat(dualOrigins[0].x), y: parseFloat(dualOrigins[0].y) };
        const o2 = { x: parseFloat(dualOrigins[1].x), y: parseFloat(dualOrigins[1].y) };

        gsap.set(containerRef.current, {
          '--o-x': `${o1.x}%`, '--o-y': `${o1.y}%`,
          '--o2-x': `${o2.x}%`, '--o2-y': `${o2.y}%`
        });

        tl.to({}, {
          duration: 1.25, // accounting for delay
          onUpdate: function() {
            const p = this.progress();
            const oSize = p * maxSizeVw;
            const iSize = Math.max(0, (p - delay) / (1 - delay)) * maxSizeVw;
            updateClipSizes(oSize, iSize, oSize, iSize);
          }
        }, 0);

        // Border animations kept separate as they are physical DOM nodes
        tl.fromTo([circles1Ref.current.outer, circles2Ref.current.outer], 
          { width: 0, height: 0 }, { width: maxSizePx, height: maxSizePx, duration: 1, ease: "power1.inOut" }, 0)
          .fromTo([circles1Ref.current.inner, circles2Ref.current.inner], 
          { width: 0, height: 0 }, { width: maxSizePx, height: maxSizePx, duration: 1, ease: "power1.inOut" }, delay);

      } else {
        // Single Mode
        gsap.set(containerRef.current, { '--o-x': `${origin.x}%`, '--o-y': `${origin.y}%` });

        tl.to({}, {
          duration: 1.25,
          onUpdate: function() {
            const p = this.progress();
            const oSize = p * maxSizeVw;
            const iSize = p > delay ? ((p - delay) / (1 - delay)) * maxSizeVw : 0;
            updateClipSizes(oSize, iSize);
          }
        }, 0);

        tl.fromTo(outerCircleRef.current, { width: 0, height: 0 }, { width: maxSizePx, height: maxSizePx, duration: 1, ease: "power1.inOut" }, 0)
          .fromTo(innerCircleRef.current, { width: 0, height: 0 }, { width: maxSizePx, height: maxSizePx, duration: 1, ease: "power1.inOut" }, delay);
      }
    }, containerRef);

    return () => ctx.revert();
  }, [triggerRef, currentSectionRef, nextSectionRef, originPosition, isDual, dualOrigins, delay]);

  // Template for Clip Paths using CSS Variables
  const singlePath = (sz) => `circle(var(${sz}) at var(--o-x) var(--o-y))`;
  const dualPath = (sz, sz2) => `circle(var(${sz}) at var(--o-x) var(--o-y)), circle(var(${sz2}) at var(--o2-x) var(--o2-y))`;

  const clipOuter = isDual ? dualPath('--o-size', '--o2-size') : singlePath('--o-size');
  const clipInner = isDual ? dualPath('--i-size', '--i2-size') : singlePath('--i-size');

  return (
    <div ref={containerRef} style={{ display: "none" }}>
      {/* OUTER RING */}
      <div
        ref={outerRingRef}
        className="fixed inset-0 z-[98]"
        style={{ clipPath: clipOuter, WebkitClipPath: clipOuter, willChange: "clip-path" }}
      >
        <div 
          className="w-full h-full"
          style={{ filter: "blur(8px) brightness(0.7)", opacity: 0.6 }}
          dangerouslySetInnerHTML={{ __html: nextPageContent }}
        />
      </div>

      {/* INNER CIRCLE */}
      <div
        ref={nextPageOverlayRef}
        className="fixed inset-0 z-[99]"
        style={{ clipPath: clipInner, WebkitClipPath: clipInner, willChange: "clip-path" }}
      >
        <div 
          className="w-full h-full"
          dangerouslySetInnerHTML={{ __html: nextPageContent }}
        />
      </div>

      {/* BORDER CIRCLES */}
      <div className="fixed inset-0 pointer-events-none z-[100]">
        {isDual ? (
          <>
            <div ref={(el) => (circles1Ref.current.outer = el)} className="absolute rounded-full border-[5px]" style={{ borderColor: color1, transform: "translate(-50%, -50%)", left: "var(--o-x)", top: "var(--o-y)" }} />
            <div ref={(el) => (circles1Ref.current.inner = el)} className="absolute rounded-full border-[3px]" style={{ borderColor: color1, transform: "translate(-50%, -50%)", left: "var(--o-x)", top: "var(--o-y)" }} />
            <div ref={(el) => (circles2Ref.current.outer = el)} className="absolute rounded-full border-[5px]" style={{ borderColor: color1, transform: "translate(-50%, -50%)", left: "var(--o2-x)", top: "var(--o2-y)" }} />
            <div ref={(el) => (circles2Ref.current.inner = el)} className="absolute rounded-full border-[3px]" style={{ borderColor: color1, transform: "translate(-50%, -50%)", left: "var(--o2-x)", top: "var(--o2-y)" }} />
          </>
        ) : (
          <>
            <div ref={outerCircleRef} className="absolute rounded-full border-[6px]" style={{ borderColor: color1, transform: "translate(-50%, -50%)", left: "var(--o-x)", top: "var(--o-y)" }} />
            <div ref={innerCircleRef} className="absolute rounded-full border-[4px]" style={{ borderColor: color1, transform: "translate(-50%, -50%)", left: "var(--o-x)", top: "var(--o-y)" }} />
          </>
        )}
      </div>
    </div>
  );
};

export default CircleRevealTransition;