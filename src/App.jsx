// src/App.jsx
import React, { useState, useRef, useCallback, memo, useLayoutEffect, useEffect } from 'react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa"; 
import Navbar from './components/NavBar';
import GlitchMenu from './components/GlitchMenu';
import OverlayMenu from './components/OverlayMenu';
import SpringSection from './components/SpringSection.jsx';
import SummerSection from './components/SummerSection.jsx';
import AutumnSection from './components/AutumnSection.jsx';
import SecondSection from './components/SecondSection.jsx';
import FracturedParallelogramTransition from './components/PageTransition.jsx'; 
import Gatekeeper from './components/Gatekeeper.jsx';
import goku from "./assets/Frame3.jpg";

gsap.registerPlugin(ScrollTrigger);

// --- 1. TRIBAL PATHS ---
const TRIBAL_PATHS = {
  A: "M50 2 L65 30 L95 90 L75 80 L65 55 L35 55 L25 80 L5 90 L35 30 Z M40 45 L60 45 L50 25 Z",
  H: "M5 5 L30 15 L25 45 L75 35 L70 15 L95 5 L90 95 L65 85 L70 55 L30 65 L25 85 L10 95 Z",
  O: "M50 5 L85 25 L95 50 L85 75 L50 95 L15 75 L5 50 L15 25 Z M50 25 L75 50 L50 75 L25 50 Z",
  U: "M5 5 L30 15 L30 65 L50 95 L70 65 L70 15 L95 5 L85 80 L50 100 L15 80 Z",
  B: "M10 5 L60 5 L85 25 L55 45 L90 65 L60 95 L10 95 L20 50 Z M30 20 L30 40 L50 35 L50 25 Z M30 55 L30 80 L60 70 L55 60 Z"
};

const TribalLetter = ({ char }) => {
  const path = TRIBAL_PATHS[char] || "";
  return (
    <div className="relative w-[12vh] h-[12vh] flex justify-center items-center pointer-events-auto hover:scale-110 transition-transform duration-300">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" style={{ filter: "drop-shadow(0 0 8px rgba(215, 125, 238, 0.8))" }}>
        <path d={path} fill="transparent" stroke="#d77dee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const SideTypography = ({ isFirstPage }) => {
  const containerRef = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (isFirstPage) {
        gsap.to(containerRef.current, { x: 0, opacity: 1, duration: 1.2, ease: "power4.out" });
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

const AnimatedWaveFooter = memo(({ triggerRef }) => {
  const topOverlayRef = useRef(null);
  const bottomFooterRef = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: triggerRef.current, start: "top center", end: "bottom bottom", scrub: 1 } });
      tl.fromTo(topOverlayRef.current, { opacity: 0 }, { opacity: 1, ease: "none" }, 0);
      tl.fromTo(bottomFooterRef.current, { y: "100vh" }, { y: "60vh", ease: "none" }, 0);
    });
    return () => ctx.revert();
  }, [triggerRef]);

  return (
    <div className="fixed inset-0 w-full h-screen z-[60] pointer-events-none">
      <div ref={topOverlayRef} className="absolute top-0 left-0 w-full h-[100vh] bg-black/50 opacity-0 pointer-events-none" />
      <div ref={bottomFooterRef} className="absolute top-0 left-0 w-full h-[40vh] flex flex-col pointer-events-auto" style={{ transform: 'translateY(100vh)' }}>
        <div className="w-full flex-grow bg-[#1a56db] flex flex-col justify-center items-center pb-8 pt-2 relative z-20">
          <ul className="relative flex justify-center items-center gap-[10px] my-[10px] flex-wrap">
            {[FaFacebook, FaTwitter, FaLinkedin, FaInstagram].map((Icon, i) => (
              <li key={i} className="list-none">
                <a href="#" className="text-white text-[2rem] mx-[10px] inline-block transition-transform duration-500 hover:-translate-y-[10px]"><Icon /></a>
              </li>
            ))}
          </ul>
          <p className="text-white font-[300] text-[0.9rem] mt-[15px] mb-[10px] opacity-75 text-center">&copy;2026 AHOUBA | All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
});

// --- HELPER COMPONENTS ---
const GokuPage = memo(({ sectionRef }) => (
  <div ref={sectionRef} className="fixed inset-0 w-full h-screen" style={{ zIndex: 10, opacity: 1 }}>
    <img src={goku} alt="Goku" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'grayscale(0.8) brightness(0.75) contrast(1.7)' }} loading="eager" />
  </div>
));

const PageWrapper = memo(({ sectionRef, children }) => (
  <div ref={sectionRef} className="fixed inset-0 w-full h-screen" style={{ zIndex: 1, opacity: 0 }}>{children}</div>
));

// --- MAIN APP COMPONENT ---
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [showGate, setShowGate] = useState(true);
  const PARENT = useRef(null);

  const transitionRefs = { t1: useRef(null), t2: useRef(null), t3: useRef(null), t4: useRef(null), t5: useRef(null) };
  const sectionRefs = { goku: useRef(null), space: useRef(null), spring: useRef(null), summer: useRef(null), autumn: useRef(null) };

  useEffect(() => {
    // Check gatekeeper status
    const passed = sessionStorage.getItem('ahouba_gate_passed');
    if (passed) setShowGate(false);
    
    // Scroll listener for side typography
    const handleScroll = () => { setIsFirstPage(window.scrollY < window.innerHeight * 2.3); };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSelect = (mode) => {
    if (mode === '3d') {
      window.location.href = 'https://3d.ahouba.com';
    } else {
      sessionStorage.setItem('ahouba_gate_passed', 'true');
      setShowGate(false);
    }
  };

  if (showGate) return <Gatekeeper onSelect={handleSelect} />;

  return (
    <>
      <div ref={PARENT} className="relative w-full" style={{ height: 'auto', minHeight: '1200vh' }}>
        <div className="h-screen" /> 
        <div ref={transitionRefs.t1} className="h-[300vh]" />
        <div className="h-[100vh]" />
        <div ref={transitionRefs.t2} className="h-[300vh]" />
        <div ref={transitionRefs.t3} className="h-[300vh]" />
        <div className="h-[100vh]" />
        <div ref={transitionRefs.t4} className="h-[300vh]" />
        <div className="h-[250vh]" /> 
        <div ref={transitionRefs.t5} className="h-[150vh]" />
      </div>

      <div className="fixed inset-0 w-full h-screen overflow-hidden pointer-events-none">
        <div className="fixed top-0 left-0 right-0 z-[1000] pointer-events-auto">
          <Navbar toggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
          <GlitchMenu onClick={() => setIsMenuOpen(!isMenuOpen)} isOpen={isMenuOpen} />
        </div>
        <div className="pointer-events-auto">
           <OverlayMenu isOpen={isMenuOpen} closeMenu={() => setIsMenuOpen(false)} />
        </div>
        <SideTypography isFirstPage={isFirstPage} />
        
        {/* Sections */}
        <GokuPage sectionRef={sectionRefs.goku} />
        
        <PageWrapper sectionRef={sectionRefs.spring}>
            <SpringSection />
        </PageWrapper>
        
        <div ref={sectionRefs.space} className="fixed inset-0 w-full h-screen" style={{ zIndex: 1, opacity: 0 }}>
            <SecondSection />
        </div>
        
        <PageWrapper sectionRef={sectionRefs.summer}>
            <SummerSection />
        </PageWrapper>
        
        <PageWrapper sectionRef={sectionRefs.autumn}>
            <AutumnSection />
        </PageWrapper>

        {/* Transitions */}
        <FracturedParallelogramTransition color1="#160E1E" triggerRef={transitionRefs.t1} nextSectionRef={sectionRefs.spring} />
        <FracturedParallelogramTransition color1="#0b1b33" triggerRef={transitionRefs.t2} nextSectionRef={sectionRefs.space} />
        <FracturedParallelogramTransition color1="#ffe0b2" triggerRef={transitionRefs.t3} nextSectionRef={sectionRefs.summer} />
        <FracturedParallelogramTransition color1="#bcaaa4" triggerRef={transitionRefs.t4} nextSectionRef={sectionRefs.autumn} />
        
        <AnimatedWaveFooter triggerRef={transitionRefs.t5} />
      </div>
    </>
  );
}

export default App;