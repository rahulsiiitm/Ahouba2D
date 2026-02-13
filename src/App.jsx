import React, { useState, useRef, useCallback, memo, useLayoutEffect, useEffect } from 'react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import Navbar from './NavBar';
import GlitchMenu from './GlitchMenu';
import OverlayMenu from './OverlayMenu';
import SpringSection from './SpringSection.jsx';
import SummerSection from './SummerSection.jsx';
import AutumnSection from './AutumnSection.jsx';
import SecondSection from './SecondSection.jsx';
import FracturedParallelogramTransition from './PageTransition.jsx'; 
import goku from "./assets/Frame3.jpg";

gsap.registerPlugin(ScrollTrigger);

// --- 1. TRIBAL PATHS (UNCHANGED) ---
const TRIBAL_PATHS = {
  A: "M50 2 L65 30 L95 90 L75 80 L65 55 L35 55 L25 80 L5 90 L35 30 Z M40 45 L60 45 L50 25 Z",
  H: "M5 5 L30 15 L25 45 L75 35 L70 15 L95 5 L90 95 L65 85 L70 55 L30 65 L25 85 L10 95 Z",
  O: "M50 5 L85 25 L95 50 L85 75 L50 95 L15 75 L5 50 L15 25 Z M50 25 L75 50 L50 75 L25 50 Z",
  U: "M5 5 L30 15 L30 65 L50 95 L70 65 L70 15 L95 5 L85 80 L50 100 L15 80 Z",
  B: "M10 5 L60 5 L85 25 L55 45 L90 65 L60 95 L10 95 L20 50 Z M30 20 L30 40 L50 35 L50 25 Z M30 55 L30 80 L60 70 L55 60 Z"
};

// --- 2. UPDATED LETTER COMPONENT ---
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

// --- 3. ANIMATED SIDE TYPOGRAPHY ---
const SideTypography = ({ isFirstPage }) => {
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

// --- 4. WAVE FOOTER AS A SCROLL TRANSITION ---
const AnimatedWaveFooter = memo(({ triggerRef }) => {
  const topOverlayRef = useRef(null);
  const bottomFooterRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top center",
          end: "bottom bottom",
          scrub: 1,
        }
      });

      tl.fromTo(topOverlayRef.current, 
        { opacity: 0 }, 
        { opacity: 1, ease: "none" }, 
      0);

      // Decreased footer height size logically: Animates to 60vh (meaning it's 40vh tall)
      tl.fromTo(bottomFooterRef.current, 
        { y: "100vh" }, 
        { y: "60vh", ease: "none" }, 
      0);
    });

    return () => ctx.revert();
  }, [triggerRef]);

  const waveSvg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 1000 150' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'%3E%3Cpath fill='%231a56db' d='M0,150 L0,75 Q250,150 500,75 T1000,75 L1000,150 Z'/%3E%3C/svg%3E")`;

  return (
    <div className="fixed inset-0 w-full h-screen z-[60] pointer-events-none">
      
      {/* Black Overlay over the whole screen */}
      <div ref={topOverlayRef} className="absolute top-0 left-0 w-full h-[100vh] bg-black/50 opacity-0 pointer-events-none" />

      {/* Reduced size: w-full h-[40vh] instead of 50vh */}
      <div ref={bottomFooterRef} className="absolute top-0 left-0 w-full h-[40vh] flex flex-col pointer-events-auto" style={{ transform: 'translateY(100vh)' }}>
        
        {/* 1. THE WAVE DIV (UP) */}
        <div className="relative w-full h-[150px] shrink-0 overflow-hidden leading-[0] pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-100 z-[10] wave-bg animate-wave1" style={{ backgroundImage: waveSvg }} />
          <div className="absolute top-0 left-0 w-full h-full opacity-50 z-[9] wave-bg animate-wave2" style={{ backgroundImage: waveSvg }} />
          <div className="absolute top-0 left-0 w-full h-full opacity-30 z-[8] wave-bg animate-wave3" style={{ backgroundImage: waveSvg }} />
          <div className="absolute top-0 left-0 w-full h-full opacity-70 z-[7] wave-bg animate-wave4" style={{ backgroundImage: waveSvg }} />
        </div>

        {/* 2. THE SOLID DIV (DOWN) */}
        <div className="w-full flex-grow bg-[#1a56db] flex flex-col justify-center items-center pb-8 pt-2 relative z-20">
          
          <ul className="relative flex justify-center items-center gap-[10px] my-[10px] flex-wrap">
            {[FaFacebook, FaTwitter, FaLinkedin, FaInstagram].map((Icon, i) => (
              <li key={i} className="list-none">
                <a href="#" className="text-white text-[2rem] mx-[10px] inline-block transition-transform duration-500 hover:-translate-y-[10px]">
                  <Icon />
                </a>
              </li>
            ))}
          </ul>

          <ul className="relative flex justify-center items-center gap-[10px] my-[20px] flex-wrap">
            {['Home', 'About', 'Services', 'Team', 'Contact'].map((item, i) => (
              <li key={i} className="list-none mx-[10px]">
                <a href="#" className="text-white text-[1.1rem] md:text-[1.2rem] font-[300] no-underline opacity-75 hover:opacity-100 transition-opacity duration-300 inline-block">
                  {item}
                </a>
              </li>
            ))}
          </ul>

          <p className="text-white font-[300] text-[0.9rem] md:text-[1rem] mt-[15px] mb-[10px] opacity-75 text-center">
            &copy;2026 AHOUBA | All Rights Reserved
          </p>
        </div>

        <style>{`
          .wave-bg {
            background-size: 1000px 150px;
            background-repeat: repeat-x;
            background-position: 0 bottom;
          }
          @keyframes wave { 
            0% { background-position-x: 0px; } 
            100% { background-position-x: 1000px; } 
          }
          @keyframes wave-reverse { 
            0% { background-position-x: 1000px; } 
            100% { background-position-x: 0px; } 
          }
          .animate-wave1 { animation: wave 4s linear infinite; }
          .animate-wave2 { animation: wave-reverse 5s linear infinite; }
          .animate-wave3 { animation: wave 6s linear infinite; }
          .animate-wave4 { animation: wave-reverse 7s linear infinite; }
        `}</style>
      </div>
    </div>
  );
});

// --- APP PAGES ---
const fixedPageStyle = {
  position: 'fixed', inset: 0, width: '100%', height: '100vh',
  willChange: 'opacity, transform', transform: 'translateZ(0)', backfaceVisibility: 'hidden',
};

const GokuPage = memo(({ sectionRef }) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const desktopGradient = `linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.68) 25%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.68) 75%, rgba(0,0,0,1) 100%)`;
  const mobileGradient = `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.68) 5%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.68) 95%, rgba(0,0,0,0.8) 100%)`;

  return (
    <div ref={sectionRef} style={{ ...fixedPageStyle, zIndex: 10, opacity: 1 }}>
      <img src={goku} alt="Goku" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'grayscale(0.8) brightness(0.75) contrast(1.7)' }} loading="eager" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: isMobile ? mobileGradient : desktopGradient }} />
    </div>
  );
});

const SpacePage = memo(({ sectionRef, parent }) => (
  <div ref={sectionRef} style={{ ...fixedPageStyle, zIndex: 1, opacity: 0 }}><SecondSection father={parent} /></div>
));

const PageWrapper = memo(({ sectionRef, children }) => (
  <div ref={sectionRef} style={{ ...fixedPageStyle, zIndex: 1, opacity: 0 }}>{children}</div>
));


// --- MAIN APP COMPONENT ---
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const PARENT = useRef(null);

  const transitionRefs = {
    t1: useRef(null), 
    t2: useRef(null), 
    t3: useRef(null), 
    t4: useRef(null),
    t5: useRef(null), 
  };

  const sectionRefs = {
    goku: useRef(null), 
    space: useRef(null), 
    spring: useRef(null), 
    summer: useRef(null), 
    autumn: useRef(null),
  };

  const toggleMenu = useCallback(() => setIsMenuOpen(v => !v), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  useEffect(() => {
    const handleScroll = () => { setIsFirstPage(window.scrollY < window.innerHeight * 2.3); };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div ref={PARENT} className="relative w-full" style={{ height: 'auto', minHeight: '1200vh' }}>
        <div className="h-screen" /> 
        <div ref={transitionRefs.t1} className="h-[300vh]" />
        <div className="h-[100vh]" />
        <div ref={transitionRefs.t2} className="h-[300vh]" />
        <div id="space-trigger" className="h-[150vh] bg-transparent" />
        <div ref={transitionRefs.t3} className="h-[300vh]" />
        <div className="h-[100vh]" />
        <div ref={transitionRefs.t4} className="h-[300vh]" />
        
        {/* BIG GAP: Increased space before the footer starts rising */}
        <div className="h-[250vh]" /> 
        
        {/* Reduced length for the last trigger, meaning it completes slightly faster */}
        <div ref={transitionRefs.t5} className="h-[150vh]" />
      </div>

      <div className="fixed inset-0 w-full h-screen overflow-hidden pointer-events-none">
        
        <div className="fixed top-0 left-0 right-0 z-[1000] pointer-events-auto">
          <Navbar toggleMenu={toggleMenu} />
          <GlitchMenu onClick={toggleMenu} isOpen={isMenuOpen} />
        </div>

        <div className="pointer-events-auto">
           <OverlayMenu isOpen={isMenuOpen} closeMenu={closeMenu} />
        </div>

        <SideTypography isFirstPage={isFirstPage} />

        {/* --- PAGES --- */}
        <GokuPage sectionRef={sectionRefs.goku} />
        <PageWrapper sectionRef={sectionRefs.spring}><SpringSection /></PageWrapper>
        <SpacePage sectionRef={sectionRefs.space} parent={PARENT} />
        <PageWrapper sectionRef={sectionRefs.summer}><SummerSection /></PageWrapper>
        <PageWrapper sectionRef={sectionRefs.autumn}><AutumnSection /></PageWrapper>

        {/* --- TRANSITIONS --- */}
        <FracturedParallelogramTransition color1="#160E1E" triggerRef={transitionRefs.t1} nextSectionRef={sectionRefs.spring} />
        <FracturedParallelogramTransition color1="#0b1b33" triggerRef={transitionRefs.t2} nextSectionRef={sectionRefs.space} />
        <FracturedParallelogramTransition color1="#ffe0b2" triggerRef={transitionRefs.t3} nextSectionRef={sectionRefs.summer} />
        <FracturedParallelogramTransition color1="#bcaaa4" triggerRef={transitionRefs.t4} nextSectionRef={sectionRefs.autumn} />

        {/* --- WAVE FOOTER SCROLL TRANSITION --- */}
        <AnimatedWaveFooter triggerRef={transitionRefs.t5} />

      </div>
    </>
  );
}

export default App;