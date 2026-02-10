import React, { useState, useRef, useCallback, memo } from 'react';
import Navbar from './NavBar';
import GlitchMenu from './GlitchMenu';
import OverlayMenu from './OverlayMenu';
import SpringSection from './SpringSection.jsx';
import SummerSection from './SummerSection.jsx';
import AutumnSection from './AutumnSection.jsx';
import SecondSection from './SecondSection.jsx';
import FracturedParallelogramTransition from './PageTransition.jsx'; 
import goku from "./assets/Frame3.jpg";

const fixedPageStyle = {
  position: 'fixed',
  inset: 0,
  width: '100%',
  height: '100vh',
  willChange: 'opacity, transform',
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden',
};

const GokuPage = memo(({ sectionRef }) => (
  <div ref={sectionRef} style={{ ...fixedPageStyle, zIndex: 10, opacity: 1 }}>
    <img 
      src={goku} 
      alt="Goku" 
      className="absolute inset-0 w-full h-full object-cover" 
      style={{ filter: 'grayscale(0.8) brightness(0.7) contrast(1.7)' }}
      loading="eager" 
    />
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.68) 25%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.68) 75%, rgba(0,0,0,1) 100%)`
      }}
    />
  </div>
));

// MODIFIED: SpacePage now starts hidden (opacity 0, zIndex 1) because it comes 3rd
const SpacePage = memo(({ sectionRef, parent }) => (
  <div ref={sectionRef} style={{ ...fixedPageStyle, zIndex: 1, opacity: 0 }}>
    <SecondSection father={parent} />
  </div>
));

const PageWrapper = memo(({ sectionRef, children }) => (
  <div ref={sectionRef} style={{ ...fixedPageStyle, zIndex: 1, opacity: 0 }}>
    {children}
  </div>
));

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const PARENT = useRef(null);

  const transitionRefs = {
    t1: useRef(null), 
    t2: useRef(null), 
    t3: useRef(null), 
    t4: useRef(null),
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

  return (
    <>
      {/* SCROLLABLE TRACK */}
      {/* Increased height slightly to accommodate gaps */}
      <div ref={PARENT} className="relative w-full" style={{ height: 'auto', minHeight: '2600vh' }}>
        <div className="h-screen" /> 
        
        {/* --- T1: Goku -> Spring --- */}
        <div ref={transitionRefs.t1} className="h-[300vh]" />

        {/* Spring Content Buffer */}
        <div className="h-[100vh]" />

        {/* --- T2: Spring -> Space --- */}
        <div ref={transitionRefs.t2} className="h-[300vh]" />

        {/* Space Content Buffer */}
        <div id="space-trigger" className="h-[150vh] bg-transparent" />

        {/* --- T3: Space -> Summer --- */}
        <div ref={transitionRefs.t3} className="h-[300vh]" />

        {/* --- T4: Summer -> Autumn --- */}
        <div ref={transitionRefs.t4} className="h-[300vh]" />
        
        <div className="h-screen" /> 
      </div>

      <div className="fixed inset-0 w-full h-screen overflow-hidden pointer-events-none">
        
        {/* UI LAYER */}
        <div className="fixed top-0 left-0 right-0 z-[1000] pointer-events-auto">
          <Navbar toggleMenu={toggleMenu} />
          <GlitchMenu onClick={toggleMenu} isOpen={isMenuOpen} />
        </div>

        <div className="pointer-events-auto">
           <OverlayMenu isOpen={isMenuOpen} closeMenu={closeMenu} />
        </div>

        {/* --- PAGES --- */}
        
        {/* 1. Goku */}
        <GokuPage sectionRef={sectionRefs.goku} />
        
        {/* 2. Spring (Swapped to be 2nd) */}
        <PageWrapper sectionRef={sectionRefs.spring}><SpringSection /></PageWrapper>

        {/* 3. Space (Swapped to be 3rd) */}
        <SpacePage sectionRef={sectionRefs.space} parent={PARENT} />
        
        {/* 4. Summer & Autumn */}
        <PageWrapper sectionRef={sectionRefs.summer}><SummerSection /></PageWrapper>
        <PageWrapper sectionRef={sectionRefs.autumn}><AutumnSection /></PageWrapper>

        {/* --- TRANSITIONS --- */}
        
        {/* 1. Goku -> Spring */}
        <FracturedParallelogramTransition
          color1="#2e1a3e" // Spring Color
          triggerRef={transitionRefs.t1}
          nextSectionRef={sectionRefs.spring}
        />

        {/* 2. Spring -> Space */}
        <FracturedParallelogramTransition
          color1="#050b14" // Space Color (Dark Navy/Black)
          triggerRef={transitionRefs.t2}
          nextSectionRef={sectionRefs.space}
        />

        {/* 3. Space -> Summer */}
        <FracturedParallelogramTransition
          color1="#f8bbd0" // Summer Color
          triggerRef={transitionRefs.t3}
          nextSectionRef={sectionRefs.summer}
        />

        {/* 4. Summer -> Autumn */}
        <FracturedParallelogramTransition
          color1="#ffe0b2" 
          triggerRef={transitionRefs.t4}
          nextSectionRef={sectionRefs.autumn}
        />

      </div>
    </>
  );
}

export default App;