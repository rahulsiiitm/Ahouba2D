import React, { useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom"; 
import sideCharacter from "../assets/overlaySideCharacter.png";

const OverlayMenu = ({ isOpen, closeMenu }) => {
  const containerRef = useRef(null);
  const linksRef = useRef([]);
  const petalsRef = useRef([]);
  const characterRef = useRef(null);
  
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

  // --- MENU ANIMATION ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });

      gsap.set(characterRef.current, { y: 200, opacity: 0, scale: 0.8 });
      gsap.set(linksRef.current, { x: 100, opacity: 0 });
      gsap.set(containerRef.current, { x: "100%" });

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
      {/* CHARACTER */}
      <div
        ref={characterRef}
        className="fixed md:bottom-0 left-[-6.5vw] z-[39] w-[50vw] md:w-[30vw] bottom-85 h-auto pointer-events-none origin-bottom opacity-0"
      >
        <img 
          src={sideCharacter} 
          alt="Cyberpunk Character" 
          className="w-[55vh] h-auto object-contain drop-shadow-[0_0_30px_rgba(0,243,255,0.4)] relative left-[-8vh] top-[-3vh]"
        />
      </div>

      {/* MENU CONTAINER */}
      <div
        ref={containerRef}
        className="fixed top-0 right-0 h-full w-full z-[40] 
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
              <Link
                to={item.link}
                onClick={closeMenu}
                ref={(el) => (linksRef.current[index] = el)}
                className="group relative flex items-center gap-6 text-4xl md:text-7xl font-['Orbitron'] font-black uppercase text-transparent 
                           transition-all duration-300 ease-out cursor-pointer hover:translate-x-4"
                style={{ WebkitTextStroke: "1px rgba(255,255,255,0.8)" }}
              >
                {/* ✅ REMOVED "relative top-[4vh]" to shift text up */}
                <span className="relative top-[2vh] text-lg md:text-2xl text-[#FF007A] font-medium tracking-widest border border-[#FF007A] px-2 py-1 
                                 group-hover:bg-[#FF007A] group-hover:text-black transition-colors">
                  {item.id}
                </span>
                
                {/* ✅ REMOVED "relative top-[4vh]" to shift text up */}
                <span className=" relative top-[2vh] inline-block group-hover:text-[#F0F600] group-hover:drop-shadow-[0_0_10px_rgba(240,246,0,0.8)] transition-colors duration-300">
                  {item.label}
                  <span className="absolute top-0 left-0 -translate-x-1 translate-y-1 text-[#00F3FF] opacity-0 group-hover:opacity-100 mix-blend-screen pointer-events-none">
                    {item.label}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default OverlayMenu;