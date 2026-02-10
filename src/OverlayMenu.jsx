import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import sideCharacter from "./assets/overlaySideCharacter.png";

const OverlayMenu = ({ isOpen, closeMenu }) => {
  const containerRef = useRef(null);
  const linksRef = useRef([]);
  const petalsRef = useRef([]);
  const characterRef = useRef(null);
  
  // Notification Refs
  const notificationRef = useRef(null); 
  const notificationBoxRef = useRef(null);
  const toggleBtnRef = useRef(null); // ✅ NEW REF for the button
  
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  
  const tlRef = useRef(null); 

  const menuLinks = [
    { id: "01", label: "HOME", link: "/" },
    { id: "02", label: "ALL EVENTS", link: "/events" },
    { id: "03", label: "WORKSHOPS", link: "/workshops" },
    { id: "04", label: "SPONSORS", link: "/sponsors" },
    { id: "05", label: "MERCHANDISE", link: "/merch" },
    { id: "06", label: "OUR TEAM", link: "/team" },
    { id: "07", label: "CONTACT", link: "/contact" },
  ];
  
  const particles = Array.from({ length: 20 });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const firstPageEnd = window.innerHeight * 2; 
      setIsFirstPage(scrollTop < firstPageEnd);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- NOTIFICATION ANIMATION ---
  useLayoutEffect(() => {
    if (!notificationBoxRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      if (isExpanded) {
        // --- OPEN SEQUENCE ---
        
        // 1. Expand Box
        tl.to(notificationBoxRef.current, {
          width: 380, 
          height: "auto", 
          borderRadius: "0px", 
          backgroundColor: "rgba(5, 11, 20, 0.9)",
          borderColor: "rgba(0, 243, 255, 0.4)",
          boxShadow: "0 0 30px rgba(0, 243, 255, 0.2)",
          duration: 0.6,
          ease: "back.out(1.2)"
        })
        
        // 2. Move Button to Top-Left (Padding position)
        .to(toggleBtnRef.current, {
            top: "24px",   // Matches p-6 (24px)
            left: "24px",  // Matches p-6 (24px)
            xPercent: 0,   // Reset centering
            yPercent: 0,   // Reset centering
            duration: 0.5,
            ease: "power2.inOut"
        }, "<")

        // 3. Scanline
        .fromTo(".scanline", 
          { top: "-10%", opacity: 1 },
          { top: "110%", opacity: 0, duration: 0.5, ease: "power1.in" },
          "-=0.4"
        )
        // 4. Content
        .to(".content-wrapper", {
          opacity: 1,
          visibility: "visible",
          duration: 0.1
        }, "-=0.3")
        .fromTo(".title-text",
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
          "-=0.2"
        )
        .fromTo(".stagger-item",
          { y: 20, opacity: 0, filter: "blur(5px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", stagger: 0.1, duration: 0.5, ease: "power2.out" },
          "-=0.3"
        )
        .to(".decorations", { opacity: 1, duration: 0.5 }, "-=0.5");

      } else {
        // --- CLOSE SEQUENCE ---
        
        // 1. Hide Content
        tl.to([".content-wrapper", ".decorations"], {
          opacity: 0,
          duration: 0.2
        })
        
        // 2. Shrink Box
        .to(notificationBoxRef.current, {
          width: 50, 
          height: 50,
          borderRadius: "50%", 
          backgroundColor: "rgba(0, 0, 0, 0.5)", 
          borderColor: "rgba(0, 243, 255, 0.4)", 
          boxShadow: "0 0 10px rgba(0, 243, 255, 0.4)", 
          duration: 0.4,
          ease: "power3.inOut"
        }, "<")
        
        // 3. Move Button to Dead Center
        // We use top/left 50% + x/yPercent -50% for perfect centering regardless of size
        .to(toggleBtnRef.current, {
            top: "50%",
            left: "50%",
            xPercent: -50,
            yPercent: -50,
            duration: 0.4,
            ease: "power3.inOut",
            scale:1.5
        }, "<");
      }
    }, notificationRef);

    return () => ctx.revert();
  }, [isExpanded]);

  // --- MENU ANIMATION ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });

      gsap.set(characterRef.current, { y: 200, opacity: 0, scale: 0.8 });
      gsap.set(linksRef.current, { x: 100, opacity: 0 });
      gsap.set(containerRef.current, { x: "100%" });

      gsap.to(notificationRef.current, {
        y: -10,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      tl.to(notificationRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: "power2.in",
        pointerEvents: "none",
      }, 0);

      tl.to(containerRef.current, {
        x: "0%",
        duration: 0.8,
        ease: "power4.out",
      }, 0);

      tl.to(characterRef.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: "back.out(1.5)",
      }, "-=0.6");

      tl.to(linksRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      }, "-=0.5");

      tlRef.current = tl;
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (tlRef.current) {
      if (isOpen) {
        tlRef.current.play();
        petalsRef.current.forEach((petal) => {
            if(!petal) return;
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
                overwrite: true 
            });
        });
      } else {
        tlRef.current.reverse();
      }
    }
  }, [isOpen]);

  return (
    <>
      {isFirstPage && (
        <div 
          ref={notificationRef}
          className="absolute top-[70vh] left-[14vw] md:left-25 md:top-80 z-20 font-sans scale-x-110 md:opacity-100"
        >
          <div 
            ref={notificationBoxRef} 
            className="relative overflow-hidden border backdrop-blur-md w-[380px]"
          >
            <div className="scanline absolute left-0 w-full h-[2px] bg-white shadow-[0_0_10px_white] z-50 pointer-events-none opacity-0" />

            <div className="decorations opacity-0 transition-opacity">
              <div className="absolute top-0 left-0 w-[2px] h-6 bg-[#00F3FF]"></div>
              <div className="absolute top-0 left-0 w-16 h-[2px] bg-[#00F3FF] shadow-[0_0_8px_#00F3FF]"></div>
              <div className="absolute bottom-0 right-0 w-[2px] h-6 bg-[#00F3FF]"></div>
              <div className="absolute bottom-0 right-0 w-16 h-[2px] bg-[#00F3FF] shadow-[0_0_8px_#00F3FF]"></div>
              <div className="absolute inset-0 z-[-1] opacity-10 pointer-events-none"
                   style={{ backgroundImage: "linear-gradient(#00F3FF 1px, transparent 1px), linear-gradient(90deg, #00F3FF 1px, transparent 1px)", backgroundSize: "24px 24px" }}
              ></div>
            </div>

            {/* INNER CONTAINER: Added explicit padding (p-6) so text aligns correctly */}
            <div className="relative p-6 flex flex-col w-full h-full">
              
              <div className="flex items-center w-full">
                
                {/* TOGGLE BUTTON - ABSOLUTE POSITIONED via GSAP */}
                {/* We removed 'relative/absolute' classes here to let GSAP handle it fully */}
                <div 
                  ref={toggleBtnRef}
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="absolute flex items-center justify-center w-[30px] h-[30px] md:w-8 md:h-8 rounded-full border border-[#00F3FF] text-[#00F3FF] shadow-[0_0_10px_rgba(0,243,255,0.4)] cursor-pointer hover:bg-[#00F3FF] hover:text-black transition-colors duration-300 z-[60] bg-black/40"
                  style={{ top: "24px", left: "24px" }} // Default Open Position
                >
                  <span className="text-lg font-bold select-none leading-none pt-[1px]">!</span>
                </div>

                {/* TITLE CONTAINER - Added ml-12 to push text away from the absolute button */}
                <div className="content-wrapper opacity-0 invisible w-full overflow-hidden ml-12">
                    <div className="title-text border-b border-[#00F3FF]/20 pb-2 w-full">
                        <h2 className="text-[#00F3FF] tracking-[0.2em] text-lg font-bold drop-shadow-[0_0_5px_rgba(0,243,255,0.8)] whitespace-nowrap">
                        NOTIFICATION
                        </h2>
                    </div>
                </div>
              </div>

              <div className="content-wrapper opacity-0 invisible mt-4 overflow-hidden w-full">
                <div className="text-sm md:text-base leading-relaxed text-gray-300 mb-6 font-mono">
                    <p className="stagger-item mt-2 text-[#00F3FF]/80 animate-pulse">
                    GREETINGS
                    </p>
                    <p className="stagger-item mt-2">
                    CLICK HERE TO REGISTER FOR <span className="text-red-500 font-bold text-lg">AHOUBA</span>
                    </p>
                </div>

                <div className="flex gap-4">
                    <button className="stagger-item flex-1 py-3 border border-[#00F3FF] text-[#00F3FF] text-sm hover:bg-[#00F3FF] hover:text-black transition-all duration-300 uppercase tracking-widest font-bold shadow-[0_0_10px_rgba(0,243,255,0.2)] hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]">
                    REGISTER
                    </button>
                    <button className="stagger-item flex-1 py-3 border border-red-500 text-red-500 text-sm hover:bg-red-500 hover:text-white transition-all duration-300 uppercase tracking-widest font-bold shadow-[0_0_10px_rgba(239,68,68,0.2)] hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]">
                    LOGIN
                    </button>
                </div>
              </div>

            </div>
          </div>
        </div> 
      )}

      {/* CHARACTER & MENU (Unchanged) */}
      <div
        ref={characterRef}
        className="fixed md:bottom-0 left-[-6.5vw] z-300 w-[50vw] md:w-[30vw] bottom-85 h-auto pointer-events-none origin-bottom opacity-0"
      >
        <img 
          src={sideCharacter} 
          alt="Cyberpunk Character" 
          className="w-[55vh] h-auto object-contain drop-shadow-[0_0_30px_rgba(0,243,255,0.4)] relative left-[-8vh] top-[-3vh]"
        />
      </div>

      <div
        ref={containerRef}
        className="fixed top-0 right-0 h-full w-full z-400 
                  bg-gradient-to-r from-[#1A0B2E] via-[#260a2e] to-[#4a0826]
                  translate-x-full shadow-[-10px_0_40px_rgba(255,0,122,0.3)]
                  flex flex-col justify-center items-center overflow-hidden
                  [clip-path:polygon(25%_0,100%_0,100%_100%,0%_100%)]"
      >
        <div className="absolute top-1/2 left-[15%] -translate-y-1/2 text-[40vh] font-black text-[#FF007A] opacity-5 select-none pointer-events-none whitespace-nowrap blur-sm">
          祭り
        </div>
        <div className="absolute top-10 right-10 flex flex-col items-end gap-1 opacity-40">
          <div className="w-32 h-[2px] bg-[#00F3FF]"></div>
        </div>
        <div className="absolute bottom-10 left-[30%] flex flex-col gap-1 opacity-40">
           <div className="w-48 h-[2px] bg-[#F0F600]"></div>
        </div>
        {particles.map((_, i) => (
          <div
            key={i}
            ref={(el) => (petalsRef.current[i] = el)}
            className="absolute top-0 left-0 w-4 h-4 bg-[#FF007A] opacity-0 pointer-events-none shadow-[0_0_10px_#FF007A]"
            style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
          ></div>
        ))}
        <div className="absolute inset-0 opacity-20 pointer-events-none"
             style={{
               backgroundImage: "linear-gradient(#FF007A 1px, transparent 1px), linear-gradient(90deg, #FF007A 1px, transparent 1px)",
               backgroundSize: "40px 40px"
             }}
        ></div>
        <ul className="flex flex-col gap-4 items-start z-50 pl-[20%]">
          {menuLinks.map((item, index) => (
            <li key={item.id} className="block">
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
                  <span className="absolute top-0 left-0 -translate-x-1 translate-y-1 text-[#00F3FF] opacity-0 group-hover:opacity-100 mix-blend-screen pointer-events-none">
                    {item.label}
                  </span>
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