import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gndm from "../assets/gndm.png";
import eva from "../assets/wintertree.png";

gsap.registerPlugin(ScrollTrigger);

const SecondSection = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null); 
  const ghostRef = useRef(null); 
  const snowContainerRef = useRef(null);

  useLayoutEffect(() => {
    let mm = gsap.matchMedia();

    const ctx = gsap.context((self) => {
      // 1. SNOWFALL ANIMATION
      const flakes = gsap.utils.toArray(".snowflake", snowContainerRef.current);
      flakes.forEach((flake) => {
        gsap.set(flake, {
          x: Math.random() * window.innerWidth,
          y: -50,
          opacity: Math.random() * 0.8 + 0.2,
          scale: Math.random() * 0.5 + 0.3,
        });

        gsap.to(flake, {
          y: window.innerHeight + 100,
          x: `+=${Math.random() * 100 - 50}`, // Slight wind drift
          rotation: Math.random() * 360,
          duration: Math.random() * 5 + 5,
          repeat: -1,
          delay: Math.random() * 5,
          ease: "none",
        });
      });

      // 2. CARDS ANIMATION
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
          tl.fromTo(card, 
            { z: -800, y: 250, x: 0, opacity: 0, scale: 0.5, force3D: true },
            { 
              z: 0, 
              y: 25, 
              x: isMobile ? 0 : -150 + (i % 2) * 300, 
              opacity: 1, 
              scale: 1, 
              ease: "power3.out", 
              duration: 4 
            },
            i * 5
          );

          if (i > 0) {
            tl.to(cards[i - 1], {
              opacity: 0, scale: 0.8, z: -100, duration: 3
            }, i * 5 + 2);
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative w-full h-full overflow-hidden">
      {/* --- WINTER BACKGROUND --- */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020c1b] via-[#0b1b33] to-[#1e3a5f] -z-10" />
      
      {/* Ambient Winter Fog */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none" />

      {/* --- SNOWFALL LAYER --- */}
      <div ref={snowContainerRef} className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={i} 
            className="snowflake absolute w-2 h-2 bg-white rounded-full blur-[1px]" 
            style={{ filter: "drop-shadow(0 0 5px rgba(255,255,255,0.8))" }}
          />
        ))}
      </div>

      {/* --- CHARACTERS LAYER --- */}
      
      {/* 1. EVA / WINTER TREE (Bottom on Mobile, Top on Laptop) */}
      <div className="
        absolute 
        left-0 
        w-[100vw] 
        z-20 
        pointer-events-none 
        opacity-[0.35] 
        drop-shadow-[0_0_25px_rgba(180,240,255,0.6)]
        bottom-0          
        md:top-0          
        md:bottom-auto    
      ">
        <img
          src={eva}
          alt="Snowman Tree"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* 2. GUNDAM */}
      <div className="absolute top-0 md:right-[-18vh] right-[-8vh] h-[100vh] w-[75vw] md:w-[45vw] z-20 pointer-events-none">
        <img src={gndm} alt="Gundam" className="w-[100vw] h-full object-contain object-right-bottom relative drop-shadow-[0_0_40px_rgba(0,243,255,0.6)]" />
      </div>

      {/* --- UI Container (Shifted UP for Mobile) --- */}
      {/* top-[40%] moves it up on phones. md:top-1/2 keeps it centered on laptop. */}
      <div className="absolute top-[45%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 max-w-[90vw] md:w-[50vw] w-[80vw] h-[60vh] opacity-90">
        
        {/* Decorative Lines */}
        <div className="absolute inset-0 pointer-events-none z-50">
          <div className="absolute top-0 left-0 w-[2px] h-8 bg-[#e0f7fa] shadow-[0_0_10px_#fff]" />
          <div className="absolute top-0 left-0 w-20 h-[2px] bg-[#e0f7fa] shadow-[0_0_10px_#fff]" />
          <div className="absolute bottom-0 right-0 w-[2px] h-8 bg-[#e0f7fa] shadow-[0_0_10px_#fff]" />
          <div className="absolute bottom-0 right-0 w-20 h-[2px] bg-[#e0f7fa] shadow-[0_0_10px_#fff]" />
        </div>

        {/* SCROLLABLE WRAPPER */}
        <div 
          ref={containerRef}
          className="relative h-full w-full p-8 bg-[#0b1b33]/70 backdrop-blur-xl border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-y-auto overflow-x-hidden pointer-events-auto no-scrollbar rounded-sm"
        >
          
          {/* Sticky Header */}
          <div className="sticky top-0 z-[60] pb-4 mb-2 border-b border-white/10 w-full flex justify-center bg-[#0b1b33]/80 backdrop-blur-xl">
              <h2 className="text-[#e0f7fa] tracking-[0.4em] text-xl md:text-2xl font-bold drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] uppercase">EVENTS</h2>
          </div>

          <div ref={ghostRef} className="absolute top-0 left-0 w-full h-[400vh] -z-10 pointer-events-none" />

          <div className="sticky top-[15%] h-[40vh] w-full perspective-[1000px] flex items-center justify-center pointer-events-none">
            {Array.from({ length: 7 }).map((_, i) => (
              <div 
                key={i} 
                className="card absolute bg-gradient-to-b from-[#1e3a5f]/90 to-[#0b1b33]/90 md:h-[45vh] h-[40vh] w-[65vw] md:w-[30vw] backdrop-blur-md border border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.1)] overflow-hidden flex items-center justify-center text-white font-['Orbitron'] tracking-widest"
              >
                MISSION {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx={true}>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default SecondSection;