import React, { useState, useRef, useLayoutEffect, useEffect, memo } from 'react';
import gsap from "gsap";
import goku from "../assets/Frame3.jpg";

// --- 1. TRIBAL PATHS ---
const TRIBAL_PATHS = {
  A: "M50 2 L65 30 L95 90 L75 80 L65 55 L35 55 L25 80 L5 90 L35 30 Z M40 45 L60 45 L50 25 Z",
  H: "M5 5 L30 15 L25 45 L75 35 L70 15 L95 5 L90 95 L65 85 L70 55 L30 65 L25 85 L10 95 Z",
  O: "M50 5 L85 25 L95 50 L85 75 L50 95 L15 75 L5 50 L15 25 Z M50 25 L75 50 L50 75 L25 50 Z",
  U: "M5 5 L30 15 L30 65 L50 95 L70 65 L70 15 L95 5 L85 80 L50 100 L15 80 Z",
  B: "M10 5 L60 5 L85 25 L55 45 L90 65 L60 95 L10 95 L20 50 Z M30 20 L30 40 L50 35 L50 25 Z M30 55 L30 80 L60 70 L55 60 Z"
};

// --- 2. LETTER COMPONENT ---
const TribalLetter = ({ char }) => {
  const path = TRIBAL_PATHS[char] || "";
  
  return (
    <div className="relative w-[12vh] h-[12vh] flex justify-center items-center pointer-events-auto hover:scale-110 transition-transform duration-300">
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full overflow-visible"
        style={{ filter: "drop-shadow(0 0 8px rgba(215, 125, 238, 0.8))" }} 
      >
        <defs>
          <filter id="glow-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d={path} fill="transparent" stroke="#d77dee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow-noise)" />
        <path d={path} fill="transparent" stroke="rgba(0,0,0,0.8)" strokeWidth="1" />
      </svg>
    </div>
  );
};

// --- 3. ANIMATED SIDE TYPOGRAPHY (Named Export) ---
export const SideTypography = ({ isFirstPage }) => {
  const containerRef = useRef(null);
  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (isFirstPage) {
        gsap.to(containerRef.current, { x: 0, opacity: 1, duration: 1.2, ease: "power4.out" });
        gsap.fromTo(".tribal-char", 
          { scale: 0, rotation: -90, opacity: 0 },
          { scale: 1, rotation: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "back.out(2)", delay: 0.2 }
        );
        gsap.to(".tribal-char", {
            y: "random(-10, 10)", rotation: "random(-5, 5)", duration: "random(2, 4)",
            repeat: -1, yoyo: true, ease: "sine.inOut", stagger: { each: 0.2, from: "random" }
        });
      } else {
        gsap.to(containerRef.current, { x: 100, opacity: 0, duration: 0.5, ease: "power3.in" });
      }
    }, containerRef);
    return () => ctx.revert();
  }, [isFirstPage]);

  return (
    <div ref={containerRef} className="fixed top-0 right-[5vw] h-screen hidden md:flex flex-col justify-center items-center z-[55] pointer-events-none translate-x-20 opacity-0">
      <div className="flex flex-col items-center gap-3">
        {['A','H','O','U','B','A'].map((char, i) => (
          <div key={i} className="tribal-char transform origin-center"><TribalLetter char={char} /></div>
        ))}
      </div>
    </div>
  );
};

// --- 4. GOKU PAGE COMPONENT (Default Export) ---
const GokuPage = memo(({ sectionRef }) => {
  const [isMobile, setIsMobile] = useState(false);
  
  // Notification States & Refs
  const [isExpanded, setIsExpanded] = useState(true);
  const notificationRef = useRef(null); 
  const notificationBoxRef = useRef(null);
  const toggleBtnRef = useRef(null); 

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // --- NOTIFICATION ANIMATION ---
  useLayoutEffect(() => {
    if (!notificationBoxRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Initial Floating Animation
      gsap.to(notificationRef.current, {
        y: -10,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      if (isExpanded) {
        // OPEN STATE
        tl.to(notificationBoxRef.current, {
          width: 380, height: "auto", borderRadius: "0px", 
          backgroundColor: "rgba(5, 11, 20, 0.9)", borderColor: "rgba(0, 243, 255, 0.4)",
          boxShadow: "0 0 30px rgba(0, 243, 255, 0.2)", duration: 0.6, ease: "back.out(1.2)"
        })
        .to(toggleBtnRef.current, { top: "24px", left: "24px", xPercent: 0, yPercent: 0, duration: 0.5, ease: "power2.inOut" }, "<")
        .fromTo(".scanline", { top: "-10%", opacity: 1 }, { top: "110%", opacity: 0, duration: 0.5, ease: "power1.in" }, "-=0.4")
        .to(".content-wrapper", { opacity: 1, visibility: "visible", duration: 0.1 }, "-=0.3")
        .fromTo(".title-text", { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" }, "-=0.2")
        .fromTo(".stagger-item", { y: 20, opacity: 0, filter: "blur(5px)" }, { y: 0, opacity: 1, filter: "blur(0px)", stagger: 0.1, duration: 0.5, ease: "power2.out" }, "-=0.3")
        .to(".decorations", { opacity: 1, duration: 0.5 }, "-=0.5");
      } else {
        // CLOSED STATE
        tl.to([".content-wrapper", ".decorations"], { opacity: 0, duration: 0.2 })
        .to(notificationBoxRef.current, {
          width: 50, height: 50, borderRadius: "50%", 
          backgroundColor: "rgba(0, 0, 0, 0.5)", borderColor: "rgba(0, 243, 255, 0.4)", 
          boxShadow: "0 0 10px rgba(0, 243, 255, 0.4)", duration: 0.4, ease: "power3.inOut"
        }, "<")
        .to(toggleBtnRef.current, { top: "50%", left: "50%", xPercent: -50, yPercent: -50, duration: 0.4, ease: "power3.inOut", scale: 1.5 }, "<");
      }
    }, notificationRef);

    return () => ctx.revert();
  }, [isExpanded]);

  const desktopGradient = `linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.68) 25%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.68) 75%, rgba(0,0,0,1) 100%)`;
  const mobileGradient = `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.68) 5%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.68) 95%, rgba(0,0,0,0.8) 100%)`;

  const fixedPageStyle = {
    position: 'fixed', inset: 0, width: '100%', height: '100vh',
    willChange: 'opacity, transform', transform: 'translateZ(0)', backfaceVisibility: 'hidden',
  };

  return (
    <div ref={sectionRef} style={{ ...fixedPageStyle, zIndex: 10, opacity: 1 }}>
      <img src={goku} alt="Goku" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'grayscale(0.8) brightness(0.75) contrast(1.7)' }} loading="eager" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: isMobile ? mobileGradient : desktopGradient }} />

      {/* --- ADDED NOTIFICATION BOX --- */}
      <div ref={notificationRef} className="absolute top-[70vh] left-[6vw] md:left-[6vw] md:left-25 md:top-90 z-20 font-sans scale-x-110 md:opacity-100 pointer-events-auto">
          <div ref={notificationBoxRef} className="relative overflow-hidden border backdrop-blur-md w-[380px]">
            <div className="scanline absolute left-0 w-full h-[2px] bg-white shadow-[0_0_10px_white] z-50 pointer-events-none opacity-0" />

            <div className="decorations opacity-0 transition-opacity pointer-events-none">
              <div className="absolute top-0 left-0 w-[2px] h-6 bg-[#00F3FF]"></div>
              <div className="absolute top-0 left-0 w-16 h-[2px] bg-[#00F3FF] shadow-[0_0_8px_#00F3FF]"></div>
              <div className="absolute bottom-0 right-0 w-[2px] h-6 bg-[#00F3FF]"></div>
              <div className="absolute bottom-0 right-0 w-16 h-[2px] bg-[#00F3FF] shadow-[0_0_8px_#00F3FF]"></div>
              <div className="absolute inset-0 z-[-1] opacity-10" style={{ backgroundImage: "linear-gradient(#00F3FF 1px, transparent 1px), linear-gradient(90deg, #00F3FF 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>
            </div>

            <div className="relative p-6 flex flex-col w-full h-full justify-between">
              <div className="flex items-center w-full min-h-[32px]">
                <div ref={toggleBtnRef} onClick={() => setIsExpanded(!isExpanded)} className="absolute flex items-center justify-center w-[30px] h-[30px] md:w-8 md:h-8 rounded-full border border-[#00F3FF] text-[#00F3FF] shadow-[0_0_10px_rgba(0,243,255,0.4)] cursor-pointer hover:bg-[#00F3FF] hover:text-black transition-colors duration-300 z-[60] bg-black/40" style={{ top: "24px", left: "24px" }}>
                  <span className="text-lg font-bold select-none leading-none pt-[1px]">!</span>
                </div>
                <div className="content-wrapper opacity-0 invisible w-full overflow-hidden ml-12 mt-1">
                    <div className="title-text border-b border-[#00F3FF]/20 pb-2 w-full">
                        <h2 className="text-[#00F3FF] tracking-[0.2em] text-lg font-bold drop-shadow-[0_0_5px_rgba(0,243,255,0.8)] whitespace-nowrap">
                        NOTIFICATION
                        </h2>
                    </div>
                </div>
              </div>

              <div className="content-wrapper opacity-0 invisible mt-4 overflow-hidden w-full flex-grow">
                <div className="text-sm md:text-base leading-relaxed text-gray-300 mb-6 font-mono">
                    <p className="stagger-item text-[#00F3FF]/80 animate-pulse">GREETINGS</p>
                    <p className="stagger-item mt-4">CLICK HERE TO REGISTER FOR <span className="text-red-500 font-bold text-lg">AHOUBA</span></p>
                </div>
                <div className="flex gap-4 w-full">
                    <button className="stagger-item flex-1 py-3 flex items-center justify-center border border-[#00F3FF] text-[#00F3FF] text-sm hover:bg-[#00F3FF] hover:text-black transition-all duration-300 uppercase tracking-widest font-bold shadow-[0_0_10px_rgba(0,243,255,0.2)] hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]">REGISTER</button>
                    <button className="stagger-item flex-1 py-3 flex items-center justify-center border border-red-500 text-red-500 text-sm hover:bg-red-500 hover:text-white transition-all duration-300 uppercase tracking-widest font-bold shadow-[0_0_10px_rgba(239,68,68,0.2)] hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]">LOGIN</button>
                </div>
              </div>
            </div>
          </div>
      </div> 
    </div>
  );
});

export default GokuPage;