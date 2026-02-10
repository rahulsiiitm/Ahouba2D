import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gndm from "./assets/gandam.png";
import eva from "./assets/pokemon.png";

gsap.registerPlugin(ScrollTrigger);

const SecondSection = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null); // The Scrollable Box
  const ghostRef = useRef(null);     // The Invisible Height Stretcher

  useLayoutEffect(() => {
    let mm = gsap.matchMedia();

    const ctx = gsap.context((self) => {
      // ✅ FIX: Scope the selector to ONLY cards inside this container
      const cards = gsap.utils.toArray(".card", containerRef.current);

      mm.add({
        isMobile: "(max-width: 767px)",
        isDesktop: "(min-width: 768px)",
      }, (context) => {
        let { isMobile } = context.conditions;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ghostRef.current,      
            scroller: containerRef.current, 
            start: "top top", 
            end: "bottom bottom",
            scrub: 1, 
            invalidateOnRefresh: true,
          }
        });

        cards.forEach((card, i) => {
          // 1. ENTER ANIMATION
          tl.fromTo(card, 
            {
              z: -800,    // Start deep in background
              y: 250,     // Start from bottom
              x: 0,       // Center aligned
              opacity: 0,
              scale: 0.5, 
              force3D: true
            },
            {
              z: 0,       
              y: 25,
              x: isMobile? 0: -150 + (i%2)*300,
              opacity: 1,
              scale: 1,
              ease: "power3.out", 
              duration: 4 
            },
            i * 5 // Stagger start time
          );

          // 2. EXIT ANIMATION (Fade out previous card)
          if (i > 0) {
            tl.to(cards[i - 1], {
              opacity: 0,      
              scale: 0.8,      
              z: -100,         
              duration: 3
            }, i * 5 + 2);     
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []); 

  return (
    <div ref={sectionRef} className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0015] via-[#1a0b2e] to-[#0d1b2a] -z-10" />

      {/* Characters Layer */}
      <div className="absolute top-0 left-0 h-[200vh] w-[45vw] md:w-[25vw] z-20 pointer-events-none">
        <img src={eva} alt="Eva" className="w-full md:h-full relative top-10 object-contain object-left-top drop-shadow-[0_0_40px_rgba(255,0,122,0.6)]" />
        {/* <div className="absolute top-10 left-10 w-32 h-[80vh] bg-gradient-to-b from-[#FF007A] to-[#00F3FF] rounded-lg shadow-[0_0_50px_rgba(255,0,122,0.8)] opacity-0 md:opacity-100 "/> */}
      </div>

      <div className="absolute top-0 md:right-[-12vh] right-[-8vh] h-[100vh] w-[75vw] md:w-[45vw] z-20 pointer-events-none">
        <img src={gndm} alt="Gundam" className="w-[100vw] h-full object-contain object-right-bottom relative drop-shadow-[0_0_40px_rgba(0,243,255,0.6)]" />
        {/* <div className="absolute top-10 right-40 w-32 h-[80vh] bg-gradient-to-b from-[#00F3FF] to-[#FF007A] rounded-lg shadow-[0_0_50px_rgba(0,243,255,0.8)] opacity-0 md:opacity-100 "/> */}
      </div>

      {/* --- UI Container --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 max-w-[90vw] md:w-[50vw] w-[80vw] h-[60vh] opacity-90">
        
        {/* Decorative Lines (Sticky to Box) */}
        <div className="absolute inset-0 pointer-events-none z-50">
          <div className="absolute top-0 left-0 w-[2px] h-8 bg-[#00F3FF]" />
          <div className="absolute top-0 left-0 w-20 h-[2px] bg-[#00F3FF]" />
          <div className="absolute bottom-0 right-0 w-[2px] h-8 bg-[#00F3FF]" />
          <div className="absolute bottom-0 right-0 w-20 h-[2px] bg-[#00F3FF]" />
        </div>

        {/* SCROLLABLE WRAPPER */}
        <div 
          ref={containerRef}
          className="relative h-full w-full p-8 bg-[#050b14]/85 backdrop-blur-md border border-[#00F3FF]/40 shadow-[0_0_30px_rgba(0,243,255,0.2)] overflow-y-auto overflow-x-hidden pointer-events-auto no-scrollbar"
        >
          
          {/* Sticky Header */}
          <div className="sticky top-0 z-[60] pb-4 mb-2 border-b border-[#00F3FF]/20 w-full flex justify-center bg-[#050b14]/90 backdrop-blur-xl">
             <h2 className="text-[#00F3FF] tracking-[0.3em] text-xl md:text-2xl font-bold drop-shadow-[0_0_8px_rgba(0,243,255,0.9)]">EVENTS</h2>
          </div>

          {/* GHOST TRACK */}
          <div ref={ghostRef} className="absolute top-0 left-0 w-full h-[400vh] -z-10 pointer-events-none" />

          {/* THE STAGE */}
          <div className="sticky top-[15%] h-[40vh] w-full perspective-[1000px] flex items-center justify-center pointer-events-none">
            {Array.from({ length: 7 }).map((_, i) => (
              <div 
                key={i} 
                className="card absolute bg-[#050b14]/90 md:h-[45vh] h-[40vh] w-[65vw] md:w-[30vw] backdrop-blur-md border border-[#00F3FF]/90 shadow-[0_0_30px_rgba(0,243,255,0.2)] overflow-hidden flex items-center justify-center text-[#00F3FF] font-bold"
              >
                EVENT {i + 1}
              </div>
            ))}
          </div>
          
        </div>
      </div>
      
      <style jsx="true">{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default SecondSection;