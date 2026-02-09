import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gndm from "./assets/gandam.png";
import eva from "./assets/pokemon.png";

gsap.registerPlugin(ScrollTrigger);

const SecondSection = ({ father }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const phoneQuery = window.matchMedia("(max-width: 767px)");
    let isPhone = phoneQuery.matches;

    const handleMediaChange = (e) => { isPhone = e.matches; };
    phoneQuery.addEventListener("change", handleMediaChange);

    const ctx = gsap.context((self) => {
      const cards = self.selector(".card");
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: father.current,
          start: "top -950vh", 
          end: "bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
        }
      });

      cards.forEach((card, i) => {
        tl.fromTo(card, 
          {
            z: -500,
            // Mobile: Starts at 10 | PC: Starts at 230
            x: isPhone ? 10 : 230,
            opacity: 0,
            scale: 0,
            y: 100,
            force3D: true 
          },
          {
            z: 0,
            // ✅ MOBILE FIX: If phone, all divs end at x: 5 (same as 1st div)
            // PC: Keeps alternating logic (0 or 280)
            x: isPhone ? 5 : 0 + 280 * (i % 2),
            opacity: 1,
            scale: 1,
            y: 0,
            ease: "power1.out",
            duration: 6
          },
          i * 6 + 2 
        );

        if (i > 0) {
          tl.to(cards[i - 1], {
            opacity: 0,
            ease: "power1.out",
            duration: 3
          }, i * 6 + 2);
        }
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      phoneQuery.removeEventListener("change", handleMediaChange);
    };
  }, [father]);

  return (
    <div ref={sectionRef} className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0015] via-[#1a0b2e] to-[#0d1b2a] -z-10" />

      {/* Characters */}
      <div className="absolute top-0 left-0 h-[200vh] w-[45vw] md:w-[25vw] z-20 pointer-events-none">
        <img src={eva} alt="Eva" className="w-full md:h-full relative top-10 object-contain object-left-top drop-shadow-[0_0_40px_rgba(255,0,122,0.6)]" />
        <div className="absolute top-10 left-10 w-32 h-[80vh] bg-gradient-to-b from-[#FF007A] to-[#00F3FF] rounded-lg shadow-[0_0_50px_rgba(255,0,122,0.8)] opacity-0 md:opacity-100 "/>
      </div>

      <div className="absolute top-0 md:right-[-12vh] right-[-8vh] h-[100vh] w-[75vw] md:w-[45vw] z-20 pointer-events-none">
        <img src={gndm} alt="Gundam" className="w-[100vw] h-full object-contain object-right-bottom relative drop-shadow-[0_0_40px_rgba(0,243,255,0.6)]" />
        <div className="absolute top-10 right-40 w-32 h-[80vh] bg-gradient-to-b from-[#00F3FF] to-[#FF007A] rounded-lg shadow-[0_0_50px_rgba(0,243,255,0.8)]  opacity-0 md:opacity-100  "/>
      </div>

      {/* UI Container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 max-w-[90vw] md:w-[50vw] w-[80vw] h-[60vh] opacity-90">
        <div className="relative md:h-[60vh] top-10 md:top-0 h-[53vh] p-8 bg-[#050b14]/85 backdrop-blur-md border border-[#00F3FF]/40 shadow-[0_0_30px_rgba(0,243,255,0.2)] overflow-hidden">
          
          {/* Decorative Corner Lab Lines */}
          <div className="absolute top-0 left-0 w-[2px] h-8 bg-[#00F3FF]" />
          <div className="absolute top-0 left-0 w-20 h-[2px] bg-[#00F3FF]" />
          <div className="absolute bottom-0 right-0 w-[2px] h-8 bg-[#00F3FF]" />
          <div className="absolute bottom-0 right-0 w-20 h-[2px] bg-[#00F3FF]" />

          <div className="flex items-center gap-4 mb-6 border-b border-[#00F3FF]/20 pb-4">
             <h2 className="text-[#00F3FF] tracking-[0.3em] text-xl md:text-2xl font-bold drop-shadow-[0_0_8px_rgba(0,243,255,0.9)]">EVENTS</h2>
          </div>

          <div className="grid grid-cols-2 gap-8 h-[45vh] w-[110%] overflow-y-auto p-4 perspective-[1000px]">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="absolute card bg-[#050b14]/85 md:h-[45vh] h-[40vh] w-[65vw] md:w-[30vw] backdrop-blur-md border border-[#00F3FF]/90 shadow-[0_0_30px_rgba(0,243,255,0.2)] overflow-hidden flex items-center justify-center text-[#00F3FF] font-bold">
                EVENT {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondSection;