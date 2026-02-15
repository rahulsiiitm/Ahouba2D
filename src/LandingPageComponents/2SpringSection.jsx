import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- COMPONENT: TECH RING WITH SPIRIT ORBS ---
const TechRing = ({ className, color = "#E46A9F", id }) => (
  <svg 
    viewBox="0 0 400 400" 
    className={`${className} opacity-100 mix-blend-screen pointer-events-none`} 
    style={{ overflow: 'visible' }}
  >
    <defs>
      <radialGradient id={`spiritGradient-${id}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="white" stopOpacity="1" />
        <stop offset="40%" stopColor={color} stopOpacity="1" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </radialGradient>
      <filter id={`spiritGlow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <circle cx="200" cy="200" r="190" fill="none" stroke={color} strokeWidth="1" strokeDasharray="10 20" opacity="0.6" />
    <path d="M 200 200 m -140, 0 a 140,140 0 1,0 280,0 a 140,140 0 1,0 -280,0" fill="none" stroke={color} strokeWidth="2" strokeDasharray="50 30 10 30" className="origin-center" opacity="0.9" />
    <path d="M 200 100 L 286 150 L 286 250 L 200 300 L 114 250 L 114 150 Z" fill="none" stroke={color} strokeWidth="3" opacity="0.5" />
    
    <g filter={`url(#spiritGlow-${id})`}>
      <circle cx="200" cy="10" r="12" fill={`url(#spiritGradient-${id})`} />
      <circle cx="200" cy="390" r="12" fill={`url(#spiritGradient-${id})`} />
      <circle cx="10" cy="200" r="12" fill={`url(#spiritGradient-${id})`} />
      <circle cx="390" cy="200" r="12" fill={`url(#spiritGradient-${id})`} />
    </g>
  </svg>
);

const SpringSection = () => {
  const sectionRef = useRef(null);
  const fadeOverlayRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardRef = useRef(null);
  const decorLineLeftRef = useRef(null);
  const decorLineRightRef = useRef(null);
  const petalsRef = useRef([]);
  
  const leftRingRef = useRef(null);
  const rightRingRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. DIGITAL CHERRY BLOSSOM ANIMATION
      petalsRef.current.forEach((petal) => {
        gsap.set(petal, {
          x: gsap.utils.random(0, window.innerWidth),
          y: -50,
          rotation: gsap.utils.random(0, 360),
          opacity: gsap.utils.random(0.4, 0.8),
          scale: gsap.utils.random(0.5, 1.2)
        });

        gsap.to(petal, {
          y: window.innerHeight + 100,
          x: "+=100",
          rotation: 360,
          duration: gsap.utils.random(8, 15),
          repeat: -1,
          ease: "none",
          delay: gsap.utils.random(0, 10)
        });
      });

      // 2. TECH RING ROTATION
      gsap.to(leftRingRef.current, { rotation: -360, duration: 40, repeat: -1, ease: "none" });
      gsap.to(rightRingRef.current, { rotation: 360, duration: 50, repeat: -1, ease: "none" });

      // 3. ENTRANCE & FADE
      gsap.fromTo(fadeOverlayRef.current, { opacity: 1 }, {
          opacity: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top 20%",
            scrub: 1,
          },
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo([decorLineLeftRef.current, decorLineRightRef.current], { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 1, ease: "power3.out" });
      tl.fromTo(titleRef.current, { y: 30, opacity: 0, filter: "blur(10px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, ease: "power2.out" }, "-=0.8");
      tl.fromTo(subtitleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, "-=0.6");
      tl.fromTo(cardRef.current, { y: 50, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "back.out(1.2)" }, "-=0.8");

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative w-full h-screen overflow-hidden bg-[#160E1E]">
      
      {/* 1. ATMOSPHERIC CIRCLE GRADIENTS (Restored) */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        {/* Secondary Accent (Lavender) */}
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-[#9D7BCF] blur-[120px] mix-blend-screen"></div>
        {/* Primary Accent (Sakura) */}
        <div className="absolute bottom-[20%] right-[5%] w-[400px] h-[400px] rounded-full bg-[#E46A9F] blur-[100px] opacity-60 mix-blend-screen"></div>
      </div>

      {/* 2. DIGITAL CHERRY BLOSSOM PETALS */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            ref={(el) => (petalsRef.current[i] = el)}
            className="absolute top-0 left-0 w-3 h-3 bg-[#E46A9F] opacity-0"
            style={{
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", // Diamond/Petal shape
            }}
          />
        ))}
      </div>

      {/* --- RINGS --- */}
      <div className="absolute left-[-10%] md:left-[5%] top-1/2 -translate-y-1/2 h-[55vh] w-[55vh] z-10 hidden md:block opacity-60">
         <div ref={leftRingRef} className="w-full h-full">
            <TechRing className="w-full h-full" color="#7BCED9" id="left" />
         </div>
      </div>

      <div className="absolute right-[-10%] md:right-[5%] top-1/2 -translate-y-1/2 h-[55vh] w-[55vh] z-10 hidden md:block opacity-60">
         <div ref={rightRingRef} className="w-full h-full">
            <TechRing className="w-full h-full" color="#E46A9F" id="right" />
         </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="relative z-20 flex flex-col items-center justify-between md:justify-center w-full h-full px-6 md:px-8 text-center pt-24 pb-10 md:pt-0 md:pb-0 gap-6">
        
        <div className="shrink-0 flex flex-col items-center w-full">
          <h1 ref={titleRef} className="text-5xl md:text-8xl font-['Orbitron'] font-bold mb-4 md:mb-6 opacity-0 tracking-tight" style={{ color: "#F1ECF7", textShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
            ABOUT <span className="text-[#E46A9F] font-['Orbitron'] font-bold"> AHOUBA</span>
          </h1>

          <div className="flex items-center gap-4 md:gap-6 mb-4 md:mb-8">
            <div ref={decorLineLeftRef} className="w-16 md:w-24 h-[1px] bg-gradient-to-r from-transparent to-[#E46A9F] origin-left opacity-0"></div>
            <div className="w-2.5 h-2.5 rotate-45 border border-[#E46A9F] bg-[#160E1E]"></div>
            <div ref={decorLineRightRef} className="w-16 md:w-24 h-[1px] bg-gradient-to-l from-transparent to-[#E46A9F] origin-right opacity-0"></div>
          </div>

          <p ref={subtitleRef} className="text-base md:text-2xl text-[#9D7BCF] max-w-2xl font-['Orbitron'] tracking-wide opacity-0 px-2 leading-relaxed">
            The Annual Fest of <span className="text-[#7BCED9]">IIIT Senapati, Manipur </span>
          </p>
        </div>

        <div ref={cardRef} className="relative w-full max-w-2xl bg-[#241622]/80 backdrop-blur-xl rounded-xl border border-[#E46A9F]/25 opacity-0 group transition-all duration-500 
                                     p-6 md:p-10 flex flex-col justify-center flex-grow md:flex-grow-0 md:h-auto overflow-y-auto no-scrollbar">
          
          <div className="absolute inset-0 rounded-xl transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none" style={{ boxShadow: "0 0 20px rgba(228, 106, 159, 0.15)", border: "1px solid rgba(228, 106, 159, 0.5)" }}></div>
          <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-[#7BCED9]/50 rounded-tl-md"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-[#7BCED9]/50 rounded-br-md"></div>

          <p className="text-base sm:text-lg md:text-xl text-[#F1ECF7]/90 leading-relaxed font-['Orbitron'] text-justify">
            <span className="text-[#E46A9F]">Ahouba</span> is the annual technical fest of <span className="text-[#E46A9F]"> IIIT Manipur</span>, organized by its students. 
            The fest features technical competitions such as coding contests, quizzes, and problem-solving challenges, along with workshops and talks. 
            Students from various colleges participate in both team and individual events. 
            Designed for different skill levels, Ahouba promotes practical, hands-on learning while encouraging engagement.
          </p>
        </div>
      </div>

      <div ref={fadeOverlayRef} className="absolute inset-0 bg-[#160E1E] z-50 pointer-events-none"></div>
    </div>
  );
};

export default SpringSection;