import React, { useRef, useLayoutEffect, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- STATIC DATA ---
const GALLERY_ITEMS = [
  { id: 1, title: "Amber Fall", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600" },
  { id: 2, title: "Crimson Path", img: "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&q=80&w=600" },
  { id: 3, title: "Golden Mist", img: "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?auto=format&fit=crop&q=80&w=600" },
  { id: 4, title: "Rustic Leaf", img: "https://images.unsplash.com/photo-1507371341162-fe632446b1df?auto=format&fit=crop&q=80&w=600" },
  { id: 5, title: "Autumn Rain", img: "https://images.unsplash.com/photo-1514477917009-389c76a86b68?auto=format&fit=crop&q=80&w=600" },
  { id: 6, title: "Harvest Moon", img: "https://images.unsplash.com/photo-1509565840034-3c385bed64f3?auto=format&fit=crop&q=80&w=600" },
  { id: 7, title: "Frosty Morning", img: "https://images.unsplash.com/photo-1485627941502-d2e6429fa2b0?auto=format&fit=crop&q=80&w=600" },
];

const AutumnSection = () => {
  const sectionRef = useRef(null);
  const fadeOverlayRef = useRef(null);
  const leavesRef = useRef([]);
  const windLinesRef = useRef([]);
  const cardsRef = useRef([]);
  
  // --- STATE ---
  const [activeIndex, setActiveIndex] = useState(0); 
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // --- 1. RESPONSIVE CHECK ---
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- 2. AUTO-PLAY ENGINE ---
  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % GALLERY_ITEMS.length);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
  }, []);

  // Timer Logic
  useEffect(() => {
    let interval;
    let timeout;

    if (!isPaused) {
      interval = setInterval(handleNext, 2000); // Auto-play every 2 seconds
    } else {
      // Resume after 2 seconds of inactivity
      timeout = setTimeout(() => {
        setIsPaused(false);
      }, 2000);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isPaused, handleNext]);

  // Manual Interaction
  const manualInteraction = (action) => {
    setIsPaused(true);
    if (action === 'next') handleNext();
    if (action === 'prev') handlePrev();
  };

  // --- 3. CAROUSEL ANIMATION (GSAP) ---
  useEffect(() => {
    const cards = cardsRef.current;
    const len = GALLERY_ITEMS.length;

    cards.forEach((card, index) => {
      let dist = (index - activeIndex) % len;
      if (dist > len / 2) dist -= len;
      if (dist < -len / 2) dist += len;

      let config = {
        overwrite: "auto",
        duration: 0.9,
        ease: "expo.out",
      };

      // --- VISUAL LOGIC ---
      if (dist === 0) {
        // ACTIVE CENTER
        config = { 
          ...config, 
          xPercent: 0, 
          scale: 1, 
          height: isMobile ? "45vh" : "60vh", 
          opacity: 1, 
          zIndex: 20, 
          filter: "blur(0px) brightness(1)" 
        };
      } 
      else if (Math.abs(dist) === 1) {
        // NEIGHBORS
        // Mobile spacing: 55% overlap (tighter stack) | Desktop: 110% (spread out)
        const spacing = isMobile ? 55 : 110; 
        config = { 
          ...config, 
          xPercent: dist * spacing, 
          scale: 0.9, 
          height: isMobile ? "45vh" : "45vh", 
          opacity: 0.6, 
          zIndex: 10, 
          filter: "blur(2px) brightness(0.8)" 
        };
      } 
      else if (Math.abs(dist) === 2 && !isMobile) {
        // OUTER (Desktop Only)
        config = { 
          ...config, 
          xPercent: dist * 160, 
          scale: 0.8, 
          height: "30vh", 
          opacity: 0.3, 
          zIndex: 5, 
          filter: "blur(4px) brightness(0.6)" 
        };
      } 
      else {
        // HIDDEN
        config = { ...config, xPercent: dist * 50, scale: 0, height: "0vh", opacity: 0, zIndex: 0 };
      }

      gsap.to(card, config);
    });
  }, [activeIndex, isMobile]);

  // --- 4. BACKGROUND EFFECTS ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Fade Overlay
      gsap.fromTo(fadeOverlayRef.current, { opacity: 1 }, {
        opacity: 0,
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "top 30%", scrub: 1 }
      });

      // Leaves
      leavesRef.current.forEach((leaf) => {
        gsap.set(leaf, { x: gsap.utils.random(-100, window.innerWidth + 100), y: -100, rotation: gsap.utils.random(0, 360), scale: gsap.utils.random(0.5, 1) });
        gsap.to(leaf, { y: window.innerHeight + 150, x: `+=${gsap.utils.random(-200, 200)}`, rotation: `+=${gsap.utils.random(360, 720)}`, duration: gsap.utils.random(10, 20), repeat: -1, ease: "none", delay: gsap.utils.random(0, 10) });
      });

      // Wind
      windLinesRef.current.forEach((line, index) => {
        gsap.fromTo(line, { x: -window.innerWidth * 0.5, opacity: 0 }, { x: window.innerWidth * 1.5, opacity: 0.3, duration: gsap.utils.random(4, 8), repeat: -1, ease: "sine.inOut", delay: index * 0.5 });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-[#d7ccc8]">
      
      {/* --- BACKGROUNDS --- */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#d7ccc8] via-[#bcaaa4] to-[#8d6e63] -z-10" />
      <div ref={fadeOverlayRef} className="absolute inset-0 bg-gradient-to-b from-[#ffe0b2] via-[#ffcc80] to-[#fff9e6] z-10 pointer-events-none" />
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-40 mix-blend-multiply" style={{ background: 'radial-gradient(circle at center, transparent 20%, #5d4037 100%)' }} />

      {/* --- ATMOSPHERE --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div key={i} ref={(el) => (windLinesRef.current[i] = el)} className="absolute h-[2px] rounded-full bg-white blur-[1px]" style={{ top: `${20 + i * 10}%`, width: '120vw' }} />
        ))}
      </div>
      <div className="absolute inset-0 z-5 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <svg key={i} ref={(el) => (leavesRef.current[i] = el)} width="30" height="30" viewBox="0 0 28 28" className="absolute opacity-80" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
            <path d="M14 2 L16 8 L20 6 L18 12 L24 14 L18 16 L20 22 L16 20 L14 26 L12 20 L8 22 L10 16 L4 14 L10 12 L8 6 L12 8 Z" fill={['#d84315', '#e64a19', '#f4511e', '#ff6f00', '#ffab00', '#8d6e63'][i % 6]} />
          </svg>
        ))}
      </div>

      {/* --- GALLERY SECTION --- */}
      <div className="relative z-30 w-full h-full flex flex-col items-center justify-center">
        
        {/* Title */}
        <div className="absolute top-8 md:top-12 text-center z-40">
            <h2 className="text-orange-900/90 tracking-[0.4em] text-xs md:text-sm font-black uppercase drop-shadow-sm">Autumn Collection</h2>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full h-[65vh] flex items-center justify-center perspective-1000">
          {GALLERY_ITEMS.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => (cardsRef.current[index] = el)}
              onClick={() => {
                setActiveIndex(index);
                manualInteraction(); 
              }}
              // Width: 75vw for Phone (Big/Wide), 18vw for Desktop
              className="absolute w-[75vw] md:w-[18vw] rounded-xl md:rounded-2xl shadow-2xl overflow-hidden bg-orange-50 border-[3px] border-white/40 cursor-pointer will-change-transform"
              style={{ 
                left: '50%',
                // Center alignment: -37.5vw for Mobile (half of 75), -9vw for Desktop (half of 18)
                marginLeft: isMobile ? '-37.5vw' : '-9vw',
              }}
            >
              <img src={item.img} alt={item.title} className="w-full h-full object-cover pointer-events-none" loading="eager" />
              
              <div className="absolute bottom-0 left-0 right-0 py-3 md:py-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                <p className="text-white text-center font-medium tracking-widest text-[10px] md:text-xs uppercase">{item.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CONTROLS (High Z-Index & Pointer Events Force) */}
        <div className="absolute bottom-10 md:bottom-16 flex gap-8 md:gap-12 z-[100] pointer-events-auto">
          <button 
            onClick={() => manualInteraction('prev')}
            className="group flex items-center justify-center w-14 h-14 md:w-14 md:h-14 rounded-full border border-orange-900/20 bg-white/30 backdrop-blur-md hover:bg-orange-700 hover:border-orange-700 active:scale-95 transition-all duration-200 shadow-lg touch-manipulation"
            aria-label="Previous Slide"
          >
            <svg className="w-6 h-6 text-orange-900 group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>

          <button 
            onClick={() => manualInteraction('next')}
            className="group flex items-center justify-center w-14 h-14 md:w-14 md:h-14 rounded-full border border-orange-900/20 bg-white/30 backdrop-blur-md hover:bg-orange-700 hover:border-orange-700 active:scale-95 transition-all duration-200 shadow-lg touch-manipulation"
            aria-label="Next Slide"
          >
            <svg className="w-6 h-6 text-orange-900 group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

      </div>
    </div>
  );
};

export default AutumnSection;