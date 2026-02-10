import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FracturedParallelogramTransition = ({ 
  color1, 
  triggerRef, 
  nextSectionRef 
}) => {
  const containerRef = useRef(null);
  const shieldRef = useRef(null); 
  const q = gsap.utils.selector(containerRef);

  // 1. RESPONSIVE GRID CONFIGURATION
  const [grid, setGrid] = useState({ cols: 6, rows: 6, isMobile: false });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768; 
      setGrid({
        cols: mobile ? 3 : 6,  
        rows: mobile ? 8 : 6,  
        isMobile: mobile
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { cols: COLS, rows: ROWS, isMobile } = grid;

  useLayoutEffect(() => {
    if (!triggerRef?.current || !nextSectionRef?.current) return;

    const ctx = gsap.context(() => {
      // 2. INITIAL SETUP
      gsap.set(nextSectionRef.current, { 
        zIndex: 1, 
        opacity: 0, 
        visibility: "hidden",
        pointerEvents: "none" 
      });

      gsap.set(containerRef.current, { 
        zIndex: 100, 
        visibility: "visible", 
        pointerEvents: "none" 
      });

      gsap.set(shieldRef.current, { display: "none" });

      gsap.set(q(".transition-column"), { y: "100%" });
      gsap.set(q(".transition-cell"), { scaleY: 1, transformOrigin: "bottom center" });

      // 3. TIMELINE
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1, 
          onToggle: (self) => {
            if (self.isActive) {
              gsap.set(shieldRef.current, { display: "block" });
              gsap.set(containerRef.current, { visibility: "visible" });
              gsap.set(nextSectionRef.current, { pointerEvents: "none" });
            } else {
              gsap.set(shieldRef.current, { display: "none" });
              if (self.progress === 1) {
                gsap.set(nextSectionRef.current, { pointerEvents: "auto", zIndex: 50 });
                gsap.set(containerRef.current, { visibility: "hidden" });
              } else if (self.progress === 0) {
                gsap.set(containerRef.current, { visibility: "visible" });
              }
            }
          }
        }
      });

      // --- ANIMATION SEQUENCE ---

      // Phase 1: Rise
      tl.to(q(".transition-column"), {
        y: "0%",
        duration: 0.8,
        ease: "power2.inOut",
        stagger: 0.05
      });

      tl.addLabel("covered");

      // Phase 2: Swap
      tl.set(nextSectionRef.current, { 
        zIndex: 60, 
        opacity: 1,
        visibility: "visible"
      }, "covered");

      // Phase 3: Fracture
      const allCells = gsap.utils.shuffle(gsap.utils.toArray(q(".transition-cell")));
      const chunkSize = isMobile ? 3 : 5; 
      const totalBatches = Math.ceil(allCells.length / chunkSize);
      const vanishTl = gsap.timeline();

      for (let i = 0; i < totalBatches; i++) {
        const batch = allCells.slice(i * chunkSize, (i + 1) * chunkSize);
        vanishTl.to(batch, {
          scaleY: 0,
          duration: 0.5,
          ease: "power1.in",
        }, i * 0.1); 
      }
      
      tl.add(vanishTl, "covered");

    });

    return () => ctx.revert();
  }, [triggerRef, nextSectionRef, COLS, ROWS, isMobile]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 100 }}
    >
      <div 
        ref={shieldRef}
        className="absolute inset-0 pointer-events-auto" 
        style={{ display: "none", backgroundColor: "transparent", zIndex: 999 }}
      />

      <div 
        className="absolute inset-0 flex"
        style={{ 
          // ✅ FIX: Increased width to 150vw (from 120vw)
          // ✅ FIX: Increased negative margin to -25vw (from -10vw) to center the extra width
          // This ensures the skewed corners are pushed way off screen
          width: "150vw", 
          marginLeft: "-25vw", 
          transform: "skewX(-15deg)" 
        }}
      >
        {Array.from({ length: COLS }).map((_, colIndex) => (
          <div
            key={colIndex}
            className="transition-column h-full flex-1 flex flex-col"
            style={{ willChange: "transform" }}
          >
            {Array.from({ length: ROWS }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="transition-cell w-full flex-1"
                style={{
                  backgroundColor: color1,
                  marginBottom: "-1px", 
                  marginRight: "-1px",
                  willChange: "transform"
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FracturedParallelogramTransition;