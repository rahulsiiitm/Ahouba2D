import React, { useState, useRef, useCallback, memo } from 'react';
import Navbar from './NavBar';
import GlitchMenu from './GlitchMenu';
import OverlayMenu from './OverlayMenu';
import SpringSection from './SpringSection.jsx';
import SummerSection from './SummerSection.jsx';
import AutumnSection from './AutumnSection.jsx';
import SecondSection from './SecondSection.jsx';
// REPLACE CircleReveal with our new component
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
      style={{ filter: 'sepia(0.2) hue-rotate(280deg) saturate(0.7) brightness(0.88)' }}
      loading="eager" 
    />
    <div className="absolute inset-0 bg-blue-600/30 mix-blend-screen pointer-events-none" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
  </div>
));

const SpacePage = memo(({ sectionRef, parent }) => (
  // Start with lower zIndex so Goku is on top initially
  <div ref={sectionRef} style={{ ...fixedPageStyle, zIndex: 8, opacity: 1 }}>
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
      <div ref={PARENT} className="relative w-full" style={{ height: '2600vh' }}>
        <div className="h-screen" /> 
        
        {/* T1: Goku -> Space */}
        <div ref={transitionRefs.t1} className="h-[300vh]" />

        {/* SPACE ANIMATION ZONE */}
        <div id="space-trigger" className="h-[100vh] bg-transparent" />

        {/* Following Seasons */}
        <div ref={transitionRefs.t2} className="h-[300vh]" />
        <div ref={transitionRefs.t3} className="h-[300vh]" />
        <div ref={transitionRefs.t4} className="h-[300vh]" />
        
        <div className="h-screen" /> 
      </div>

      <div className="fixed inset-0 w-full h-screen overflow-hidden pointer-events-none">
        
        {/* UI LAYER (Navbar + Menu) - Interactive */}
        <div className="fixed top-0 left-0 right-0 z-[1000] pointer-events-auto">
          <Navbar toggleMenu={toggleMenu} />
          <GlitchMenu onClick={toggleMenu} isOpen={isMenuOpen} />
        </div>

        <div className="pointer-events-auto">
           <OverlayMenu isOpen={isMenuOpen} closeMenu={closeMenu} />
        </div>

        <GokuPage sectionRef={sectionRefs.goku} />
        <SpacePage sectionRef={sectionRefs.space} />
        
        <PageWrapper sectionRef={sectionRefs.spring}><SpringSection /></PageWrapper>
        <PageWrapper sectionRef={sectionRefs.summer}><SummerSection /></PageWrapper>
        <PageWrapper sectionRef={sectionRefs.autumn}><AutumnSection /></PageWrapper>

        {/* TRANSITIONS */}
        
        {/* Goku -> Space */}
        <FracturedParallelogramTransition
          color1="#0a0015" // Matches Space background
          triggerRef={transitionRefs.t1}
          nextSectionRef={sectionRefs.space}
        />

        {/* Space -> Spring */}
        <FracturedParallelogramTransition
          color1="#2e1a3e" 
          triggerRef={transitionRefs.t2}
          nextSectionRef={sectionRefs.spring}
        />

        {/* Spring -> Summer */}
        <FracturedParallelogramTransition
          color1="#f8bbd0" 
          triggerRef={transitionRefs.t3}
          nextSectionRef={sectionRefs.summer}
        />

        {/* Summer -> Autumn */}
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