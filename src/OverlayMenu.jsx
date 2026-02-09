import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import sideCharacter from "./assets/overlaySideCharacter.png";

// Move static data outside to prevent re-creation on every render
const MENU_LINKS = [
  { id: "01", label: "HOME", link: "/" },
  { id: "02", label: "ALL EVENTS", link: "/events" },
  { id: "03", label: "WORKSHOPS", link: "/workshops" },
  { id: "04", label: "SPONSORS", link: "/sponsors" },
  { id: "05", label: "MERCHANDISE", link: "/merch" },
  { id: "06", label: "OUR TEAM", link: "/team" },
  { id: "07", label: "CONTACT", link: "/contact" },
];

const PARTICLES_COUNT = 20;

const OverlayMenu = ({ isOpen, closeMenu }) => {
  const containerRef = useRef(null);
  const linksRef = useRef([]);
  const petalsRef = useRef([]);
  const characterRef = useRef(null);
  const notificationRef = useRef(null);
  const notificationInnerRef = useRef(null);
  const tlRef = useRef(null);
  
  const [isFirstPage, setIsFirstPage] = useState(true);

  // 1. SCROLL LISTENER OPTIMIZATION
  useEffect(() => {
    const handleScroll = () => {
      const firstPageEnd = window.innerHeight * 2;
      setIsFirstPage(window.scrollY < firstPageEnd);
    };
    
    // Passive listener improves scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. SETUP BASE ANIMATIONS
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });

      // INITIAL STATES - Grouped for clarity
      gsap.set(containerRef.current, { x: "100%" });
      gsap.set(characterRef.current, { y: 200, opacity: 0, scale: 0.8 });
      gsap.set(linksRef.current, { x: 100, opacity: 0 });

      // CONTINUOUS FLOAT - Using a reusable animation
      gsap.to(notificationInnerRef.current, {
        y: -10,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // TIMELINE SEQUENCE
      tl.to(notificationRef.current, {
        opacity: 0, y: -20, duration: 0.3, ease: "power2.in", pointerEvents: "none"
      }, 0)
      .to(containerRef.current, {
        x: "0%", duration: 0.8, ease: "power4.out"
      }, 0)
      .to(characterRef.current, {
        y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.5)"
      }, "-=0.6")
      .to(linksRef.current, {
        x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out"
      }, "-=0.5");

      tlRef.current = tl;
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 3. TOGGLE SAKURA & MENU
  useEffect(() => {
    if (!tlRef.current) return;

    if (isOpen) {
      tlRef.current.play();
      
      // OPTIMIZED SAKURA LOOP
      petalsRef.current.forEach((petal) => {
        if (!petal) return;
        
        // Kill existing animations on this specific petal to prevent overlap
        gsap.killTweensOf(petal);

        gsap.set(petal, {
          x: gsap.utils.random(0, window.innerWidth),
          y: -50,
          rotation: gsap.utils.random(0, 360),
          scale: gsap.utils.random(0.5, 1.5),
          opacity: gsap.utils.random(0.3, 0.8),
        });

        gsap.to(petal, {
          y: window.innerHeight + 100,
          x: "+=100",
          rotation: "+=360",
          duration: gsap.utils.random(3, 8),
          ease: "none",
          repeat: -1,
          delay: gsap.utils.random(0, 5),
        });
      });
    } else {
      tlRef.current.reverse();
      // Stop petals when menu is closed to save CPU
      gsap.killTweensOf(petalsRef.current);
    }
  }, [isOpen]);

  return (
    <>
      {/* 1. NOTIFICATION */}
      {isFirstPage && (
        <div ref={notificationRef} className="absolute top-[70vh] left-[14vw] md:left-25 md:top-80 z-20 max-w-[85vw] w-[380px] font-sans scale-x-110"> 
          <div ref={notificationInnerRef} className="relative p-6 bg-[#050b14]/85 backdrop-blur-md border border-[#00F3FF]/40 shadow-[0_0_20px_rgba(0,243,255,0.15)] overflow-hidden">
            {/* Decors */}
            <div className="absolute top-0 left-0 w-[2px] h-6 bg-[#00F3FF]" />
            <div className="absolute top-0 left-0 w-16 h-[2px] bg-[#00F3FF] shadow-[0_0_8px_#00F3FF]" />
            <div className="absolute bottom-0 right-0 w-[2px] h-6 bg-[#00F3FF]" />
            <div className="absolute bottom-0 right-0 w-16 h-[2px] bg-[#00F3FF] shadow-[0_0_8px_#00F3FF]" />
            
            <div className="flex items-center gap-3 mb-5 border-b border-[#00F3FF]/20 pb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border border-[#00F3FF] text-[#00F3FF] shadow-[0_0_10px_rgba(0,243,255,0.4)]">
                <span className="text-lg font-bold">!</span>
              </div>
              <h2 className="text-[#00F3FF] tracking-[0.2em] text-lg font-bold drop-shadow-[0_0_5px_rgba(0,243,255,0.8)] uppercase">Notification</h2>
            </div>

            <div className="text-sm md:text-base leading-relaxed text-gray-300 mb-6 font-mono">
              <p className="mt-2 text-[#00F3FF]/80">GREETINGS</p>
              <p>CLICK HERE TO REGISTER FOR <span className="text-red-500 font-bold animate-pulse text-lg">AHOUBA</span></p>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 py-3 border border-[#00F3FF] text-[#00F3FF] text-sm hover:bg-[#00F3FF] hover:text-black transition-all duration-300 uppercase tracking-widest font-bold">REGISTER</button>
              <button className="flex-1 py-3 border border-red-500 text-red-500 text-sm hover:bg-red-500 hover:text-white transition-all duration-300 uppercase tracking-widest font-bold">LOGIN</button>
            </div>
            
            <div className="absolute inset-0 z-[-1] opacity-10 pointer-events-none"
                 style={{ backgroundImage: "linear-gradient(#00F3FF 1px, transparent 1px), linear-gradient(90deg, #00F3FF 1px, transparent 1px)", backgroundSize: "24px 24px" }}
            />
          </div>
        </div> 
      )}

      {/* 2. CHARACTER */}
      <div ref={characterRef} className="fixed md:bottom-0 left-[-6.5vw] z-[300] w-[50vw] md:w-[30vw] bottom-85 h-auto pointer-events-none origin-bottom opacity-0 will-change-transform">
        <img src={sideCharacter} alt="Cyberpunk" className="w-[55vh] h-auto object-contain drop-shadow-[0_0_30px_rgba(0,243,255,0.4)] relative left-[-8vh] top-[-3vh]" />
      </div>

      {/* MAIN MENU CONTAINER */}
      <div
        ref={containerRef}
        className="fixed top-0 right-0 h-full w-full z-[400] 
                   bg-gradient-to-r from-[#1A0B2E] via-[#260a2e] to-[#4a0826]
                   translate-x-full shadow-[-10px_0_40px_rgba(255,0,122,0.3)]
                   flex flex-col justify-center items-center overflow-hidden
                   [clip-path:polygon(25%_0,100%_0,100%_100%,0%_100%)] will-change-transform"
      >
        {/* Background Accents */}
        <div className="absolute top-1/2 left-[15%] -translate-y-1/2 text-[40vh] font-black text-[#FF007A] opacity-5 select-none pointer-events-none blur-sm">祭り</div>
        
        {/* Optimized Sakura Particles */}
        {Array.from({ length: PARTICLES_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={(el) => (petalsRef.current[i] = el)}
            className="absolute top-0 left-0 w-4 h-4 bg-[#FF007A] opacity-0 pointer-events-none shadow-[0_0_10px_#FF007A] will-change-transform"
            style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
          />
        ))}
        
        <div className="absolute inset-0 opacity-20 pointer-events-none"
             style={{ backgroundImage: "linear-gradient(#FF007A 1px, transparent 1px), linear-gradient(90deg, #FF007A 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />

        <ul className="flex flex-col gap-4 items-start z-50 pl-[20%]">
          {MENU_LINKS.map((item, index) => (
            <li key={item.id}>
              <a
                href={item.link}
                onClick={closeMenu}
                ref={(el) => (linksRef.current[index] = el)}
                className="group relative flex items-center gap-6 text-4xl md:text-8xl font-['Orbitron'] font-black uppercase text-transparent 
                           transition-all duration-300 ease-out cursor-pointer hover:translate-x-4"
                style={{ WebkitTextStroke: "1px rgba(255,255,255,0.8)" }}
              >
                <span className="text-lg md:text-2xl text-[#FF007A] font-medium tracking-widest border border-[#FF007A] px-2 py-1 
                                 group-hover:bg-[#FF007A] group-hover:text-black transition-colors relative top-[4vh]">
                  {item.id}
                </span>
                <span className="relative top-[4vh] inline-block group-hover:text-[#F0F600] group-hover:drop-shadow-[0_0_10px_rgba(240,246,0,0.8)] transition-colors duration-300">
                  {item.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default OverlayMenu;