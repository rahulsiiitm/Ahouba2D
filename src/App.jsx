import React, { useState, useRef, useCallback, memo, useEffect } from 'react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// --- EXTERNAL COMPONENTS ---
import Navbar from './LandingPageComponents/-1NavBar';
import GlitchMenu from './LandingPageComponents/-1GlitchMenu';
import OverlayMenu from './LandingPageComponents/-1OverlayMenu';
import SpringSection from './LandingPageComponents/2SpringSection.jsx';
import SummerSection from './LandingPageComponents/4SummerSection.jsx'; 
import AutumnSection from './LandingPageComponents/5AutumnSection.jsx';
import SecondSection from './LandingPageComponents/3WinterSection.jsx';
import FracturedParallelogramTransition from './LandingPageComponents/-1PageTransition.jsx'; 
import Gatekeeper from './LandingPageComponents/0Gatekeeper.jsx';
import GokuPage, { SideTypography } from './LandingPageComponents/1GokuPage.jsx';
import AnimatedWaveFooter from './LandingPageComponents/6Footer.jsx'; 
import EventPage from './OtherPages/EventPage.jsx';

gsap.registerPlugin(ScrollTrigger);

// --- HELPER COMPONENTS ---
const fixedPageStyle = {
  position: 'fixed', inset: 0, width: '100%', height: '100vh',
  willChange: 'opacity, transform', transform: 'translateZ(0)', backfaceVisibility: 'hidden',
};

const SpacePage = memo(({ sectionRef, parent }) => (
  <div ref={sectionRef} style={{ ...fixedPageStyle, zIndex: 1, opacity: 0 }}>
    <SecondSection father={parent} />
  </div>
));

const PageWrapper = memo(({ sectionRef, children }) => (
  <div ref={sectionRef} style={{ ...fixedPageStyle, zIndex: 1, opacity: 0 }}>{children}</div>
));

// --- LANDING PAGE COMPONENT ---
const LandingPage = ({ gatePassed, setGatePassed }) => {
  const [isFirstPage, setIsFirstPage] = useState(true);
  
  const PARENT = useRef(null);
  const transitionRefs = { t1: useRef(null), t2: useRef(null), t3: useRef(null), t4: useRef(null), t5: useRef(null) };
  const sectionRefs = { goku: useRef(null), space: useRef(null), spring: useRef(null), summer: useRef(null), autumn: useRef(null) };

  // Handle Gatekeeper logic
  const handleSelect = (mode) => {
    if (mode === '3d') {
      window.location.href = 'https://3d.ahouba.com';
    } else {
      sessionStorage.setItem('ahouba_gate_passed', 'true');
      setGatePassed(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => { setIsFirstPage(window.scrollY < window.innerHeight * 2.3); };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); 
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // If gate not passed, show Gatekeeper and NOTHING else
  if (!gatePassed) return <Gatekeeper onSelect={handleSelect} />;

  return (
    <>
      {/* --- SCROLL TRACKER (INVISIBLE LAYOUT) --- 
          This defines the scroll height and navigation anchors. 
          IDs are positioned absolutely to avoid layout shifts (glitches).
      */}
      <div ref={PARENT} className="relative w-full" style={{ height: 'auto', minHeight: '1200vh' }}>
        
        {/* 1. HOME */}
        <div id="home" className="absolute top-0 w-full h-1 pointer-events-none" />
        <div className="h-screen w-full" /> 

        {/* TRANSITION 1 */}
        <div ref={transitionRefs.t1} className="h-[300vh] w-full" />
        
        {/* 2. ABOUT (Spring Section) */}
        <div id="about" className="absolute w-full h-1 pointer-events-none" style={{ top: '400vh' }} /> 
        {/* The top value approx matches (100vh home + 300vh t1) */}
        
        <div className="h-[100vh] w-full" />

        {/* TRANSITION 2 */}
        <div ref={transitionRefs.t2} className="h-[300vh] w-full" />
        
        {/* 3. EVENTS (Winter/Space Section) */}
        {/* ID placed on the space-trigger container */}
        <div id="events" className="absolute w-full h-1 pointer-events-none" style={{ top: '800vh' }} />
        <div id="space-trigger" className="h-[150vh] bg-transparent w-full" />
        
        {/* TRANSITION 3 */}
        <div ref={transitionRefs.t3} className="h-[300vh] w-full" />
        
        {/* 4. PEOPLE (Summer Section) */}
        <div id="people" className="absolute w-full h-1 pointer-events-none" style={{ top: '1250vh' }} />
        <div className="h-[100vh] w-full" />

        {/* TRANSITION 4 */}
        <div ref={transitionRefs.t4} className="h-[300vh] w-full" />
        
        {/* 5. SPONSORS (Autumn Section) */}
        <div id="sponsors" className="absolute w-full h-1 pointer-events-none" style={{ top: '1650vh' }} />
        <div className="h-[250vh] w-full" /> 

        {/* FOOTER TRANSITION */}
        <div ref={transitionRefs.t5} className="h-[150vh] w-full" />
      </div>

      {/* --- VISUAL LAYERS (FIXED POSITION) --- */}
      <div className="fixed inset-0 w-full h-screen overflow-hidden pointer-events-none">
        
        <SideTypography isFirstPage={isFirstPage} />
        
        {/* 1. GOKU */}
        <GokuPage sectionRef={sectionRefs.goku} />
        
        {/* 2. SPRING */}
        <PageWrapper sectionRef={sectionRefs.spring}>
            <SpringSection globalTriggerRef={transitionRefs.t1} />
        </PageWrapper>
        
        {/* 3. SPACE/WINTER */}
        <SpacePage sectionRef={sectionRefs.space} parent={PARENT} />
        
        {/* 4. SUMMER */}
        <PageWrapper sectionRef={sectionRefs.summer}>
            <SummerSection globalTriggerRef={transitionRefs.t3} />
        </PageWrapper>
        
        {/* 5. AUTUMN */}
        <PageWrapper sectionRef={sectionRefs.autumn}>
            <AutumnSection globalTriggerRef={transitionRefs.t4} />
        </PageWrapper>

        {/* TRANSITIONS */}
        <FracturedParallelogramTransition color1="#160E1E" triggerRef={transitionRefs.t1} nextSectionRef={sectionRefs.spring} />
        <FracturedParallelogramTransition color1="#0b1b33" triggerRef={transitionRefs.t2} nextSectionRef={sectionRefs.space} />
        <FracturedParallelogramTransition color1="#ffe0b2" triggerRef={transitionRefs.t3} nextSectionRef={sectionRefs.summer} />
        <FracturedParallelogramTransition color1="#bcaaa4" triggerRef={transitionRefs.t4} nextSectionRef={sectionRefs.autumn} />

        <AnimatedWaveFooter triggerRef={transitionRefs.t5} />

      </div>
    </>
  );
};

// --- SCROLL RESET HELPER ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, [pathname]);
  return null;
};

// --- MAIN APP COMPONENT ---
function App() {
  // ✅ STATE: Check session storage immediately
  const [gatePassed, setGatePassed] = useState(() => {
    return sessionStorage.getItem('ahouba_gate_passed') === 'true';
  });
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => setIsMenuOpen(v => !v), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  return (
    <Router>
      <ScrollToTop />
      
      {/* ✅ CONDITION: Only render Navbar & Menu if Gate is Passed */}
      {gatePassed && (
        <>
          {/* NAVBAR: z-[1000] */}
          <div className="fixed top-0 left-0 right-0 z-[1000] pointer-events-auto">
            <Navbar toggleMenu={toggleMenu} />
            <GlitchMenu onClick={toggleMenu} isOpen={isMenuOpen} />
          </div>

          {/* OVERLAY MENU: z-[999] */}
          <div className="fixed inset-0 z-[999] pointer-events-none">
             <div className="pointer-events-auto">
                <OverlayMenu isOpen={isMenuOpen} closeMenu={closeMenu} />
             </div>
          </div>
        </>
      )}

      <Routes>
        <Route 
          path="/" 
          element={
            <LandingPage 
              gatePassed={gatePassed} 
              setGatePassed={setGatePassed} 
            />
          } 
        />
        <Route path="/events" element={<EventPage />} />
      </Routes>
    </Router>
  );
}

export default App;