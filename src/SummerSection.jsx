import React, { useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SummerSection = () => {
  const sectionRef = useRef(null);
  const sunRef = useRef(null);
  const raysRef = useRef(null);
  const bigDivRef = useRef(null);
  
  const [activeIndex, setActiveIndex] = useState(0);

  const data = [
    { 
      id: "A", 
      title: "SOLAR CORE", 
      desc: "Primary energy source.", 
      bio: "The Solar Core module manages the central radiation levels, ensuring the golden glow remains constant throughout the interface cycle.",
      img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=500&auto=format&fit=crop"
    },
    { 
      id: "B", 
      title: "FLARE SYNC", 
      desc: "Atmospheric pulse.", 
      bio: "Flare Sync coordinates the heat wave animations with the background scroll, creating a seamless transition between light and motion.",
      img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=500&auto=format&fit=crop" 
    },
    { 
      id: "C", 
      title: "THERMAL GRID", 
      desc: "Heat distribution.", 
      bio: "The Thermal Grid is responsible for the amber color gradients, distributing warm tones across the layout based on user interaction.",
      img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=500&auto=format&fit=crop" 
    },
    { 
      id: "D", 
      title: "RAY TRACER", 
      desc: "Light path logic.", 
      bio: "Ray Tracer calculates the angle of the sun rays, ensuring they rotate realistically around the central sun element at all times.",
      img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=500&auto=format&fit=crop" 
    },
    { 
      id: "E", 
      title: "ZENITH LOG", 
      desc: "Peak light data.", 
      bio: "Zenith Log records the peak brightness levels of the section, triggering the bloom effect when the user reaches the golden horizon.",
      img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=500&auto=format&fit=crop" 
    },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Sun & Rays
      gsap.to(sunRef.current, { scale: 1.1, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(raysRef.current, { rotation: 360, duration: 60, repeat: -1, ease: "none" });

      // 2. Menu Entrance
      gsap.from(".side-item-wrapper", { 
        x: -50, 
        opacity: 0, 
        stagger: 0.1, 
        duration: 0.8, 
        ease: "power2.out",
        scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center", 
        }
      });

      // 3. WIND LINES ANIMATION
      const windLines = gsap.utils.toArray(".wind-line");
      windLines.forEach((line) => {
        gsap.to(line, {
            x: "130vw", 
            duration: gsap.utils.random(4, 8), 
            repeat: -1,
            ease: "none", 
            delay: gsap.utils.random(0, 5)
        });
        gsap.to(line, {
            y: gsap.utils.random(-30, 30), 
            duration: gsap.utils.random(1.5, 3), 
            repeat: -1,
            yoyo: true, 
            ease: "sine.inOut"
        });
        gsap.to(line, {
            opacity: 0,
            duration: gsap.utils.random(2, 4),
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });
      });

      // 4. LEAVES ANIMATION
      const leaves = gsap.utils.toArray(".floating-leaf");
      leaves.forEach((leaf) => {
        gsap.set(leaf, { rotation: gsap.utils.random(0, 360) });
        gsap.to(leaf, {
            x: "130vw", 
            duration: gsap.utils.random(10, 20), 
            repeat: -1,
            ease: "none",
            delay: gsap.utils.random(0, 10)
        });
        gsap.to(leaf, {
            rotation: "+=360",
            duration: gsap.utils.random(5, 10),
            repeat: -1,
            ease: "none"
        });
        gsap.to(leaf, {
            y: gsap.utils.random(-50, 50),
            duration: gsap.utils.random(2, 4),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleItemClick = (index) => {
    if (index === activeIndex) return;

    const direction = index > activeIndex ? 1 : -1;

    const tl = gsap.timeline();
    tl.to(bigDivRef.current, { 
      x: direction * -30, 
      opacity: 0, 
      duration: 0.2, 
      ease: "power2.in",
      onComplete: () => setActiveIndex(index) 
    })
    .fromTo(bigDivRef.current, 
      { x: direction * 30, opacity: 0 }, 
      { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
    );
  };

  return (
    <div ref={sectionRef} className="relative w-full h-screen overflow-hidden flex items-center justify-center px-4 md:px-10">
      
      {/* 1. BACKGROUND GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fff9e6] via-[#ffe0b2] to-[#ffcc80] -z-20"></div>
      
      {/* 2. ATMOSPHERE LAYER (WIND + LEAVES) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
            <div 
                key={`wind-${i}`} 
                className="wind-line absolute rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                style={{
                    height: '3px',
                    background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent)",
                    top: `${Math.random() * 100}%`, 
                    left: '-20%', 
                    width: `${Math.random() * 250 + 150}px`, 
                    opacity: Math.random() * 0.7 + 0.3 
                }}
            />
        ))}
        {[...Array(12)].map((_, i) => (
            <div
                key={`leaf-${i}`}
                className="floating-leaf absolute"
                style={{
                    top: `${Math.random() * 90 + 5}%`, 
                    left: '-10%',
                    width: `${Math.random() * 20 + 20}px`, 
                    height: `${Math.random() * 20 + 20}px`,
                    opacity: Math.random() * 0.6 + 0.4,
                    filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.1))"
                }}
            >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-orange-400/60">
                    <path d="M12,2C12,2 12,22 12,22C12,22 2,16 2,10C2,4 12,2 12,2ZM12,2C12,2 12,22 12,22C12,22 22,16 22,10C22,4 12,2 12,2Z" />
                </svg>
            </div>
        ))}
      </div>

      {/* 3. SUN */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 z-0 opacity-40 pointer-events-none">
        <div ref={sunRef} className="w-[300px] h-[300px] rounded-full" style={{ background: 'radial-gradient(circle, #fff9e6 0%, #ffe082 100%)', filter: 'blur(40px)' }}></div>
        <div ref={raysRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute top-1/2 left-1/2 w-[400px] h-[2px] origin-left" style={{ background: 'linear-gradient(90deg, rgba(255,167,38,0.3), transparent)', transform: `rotate(${i * 30}deg)` }}></div>
          ))}
        </div>
      </div>

      {/* 4. MAIN CONTENT CONTAINER - SHIFTED LAYOUT */}
      {/* Changed: max-w to 95%, justify-between pushes items to edges */}
      <div className="relative z-10 flex flex-col md:flex-row w-full max-w-[95%] h-[85vh] gap-25 justify-center items-center">
        
        {/* --- LEFT SIDE: MENU LIST --- */}
        {/* Changed: Width to 30%, added padding-left (md:pl-10) to shift visually left */}
        <div className="flex flex-col justify-center gap-4 w-full md:w-[30%] h-full z-20 select-none md:pl-10">
          {data.map((item, i) => {
            const isActive = activeIndex === i;

            return (
              <div key={item.id} className="side-item-wrapper"> 
                <div
                    onClick={() => handleItemClick(i)}
                    className={`group relative cursor-pointer p-4 rounded-2xl border transition-all duration-300 ease-out flex items-center gap-5 backdrop-blur-md
                    ${isActive 
                        ? "bg-white/90 border-orange-500 scale-105 shadow-2xl z-30 translate-x-4 ring-2 ring-orange-400/30" 
                        : "bg-white/20 border-white/30 hover:bg-white/40 hover:scale-105 hover:shadow-lg hover:border-orange-200 hover:translate-x-2"
                    }`}
                >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl flex-shrink-0 transition-all duration-300
                    ${isActive 
                        ? "bg-orange-500 text-white shadow-md scale-110" 
                        : "bg-white/40 text-orange-900/40 group-hover:bg-orange-400 group-hover:text-white group-hover:scale-110"
                    }`}>
                    {item.id}
                    </div>
                    
                    <div className="flex flex-col overflow-hidden">
                        <h4 className={`font-bold text-sm uppercase tracking-wider transition-colors duration-300
                            ${isActive ? "text-orange-800" : "text-orange-900/50 group-hover:text-orange-800"}`}>
                            {item.title}
                        </h4>
                        <span className={`text-[10px] font-semibold uppercase tracking-tight transition-colors duration-300
                            ${isActive ? "text-orange-600" : "text-orange-900/30 group-hover:text-orange-600"}`}>
                            {item.desc}
                        </span>
                    </div>

                    {isActive && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                            </span>
                        </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>

        {/* --- RIGHT SIDE: DISPLAY --- */}
        {/* Changed: Width to 65%, added padding-right (md:pr-10) to shift visually right */}
        <div className="w-full md:w-[55%] h-full flex items-center justify-center z-10 md:pr-10">
          <div
            ref={bigDivRef}
            className="relative w-full h-[60vh] md:h-[70vh] bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white/40 shadow-xl p-8 md:p-12 flex flex-col justify-center overflow-hidden select-text"
          >
            {/* Background Bloom */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-400/20 rounded-full blur-[100px] pointer-events-none"></div>

            {/* --- IMAGE CONTAINER --- */}
            <div className="absolute top-6 right-6 md:top-10 md:right-10 w-32 h-32 md:w-64 md:h-64 rounded-full border-2 border-orange-500/20 shadow-lg overflow-hidden z-20 pointer-events-none">
                <img 
                    src={data[activeIndex].img} 
                    alt={data[activeIndex].title} 
                    className="w-full h-full object-cover opacity-80 mix-blend-overlay hover:opacity-100 transition-opacity duration-500"
                />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6 opacity-80 select-none">
                <span className="w-8 h-[3px] bg-orange-500"></span>
                <span className="text-orange-800 font-bold tracking-[0.3em] uppercase text-xs">System Data // {data[activeIndex].id}</span>
              </div>

              <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-600 to-orange-900 mb-6 uppercase leading-tight drop-shadow-sm selection:bg-orange-200 selection:text-orange-900">
                {data[activeIndex].title}
              </h2>
              
              <p className="text-lg md:text-2xl text-gray-800 leading-relaxed font-medium border-l-4 border-orange-400/50 pl-6 py-2 italic selection:bg-orange-200 selection:text-orange-900">
                {data[activeIndex].bio}
              </p>
            </div>

            <div className="absolute bottom-10 right-10 opacity-30 pointer-events-none select-none">
                <div className="text-[10px] font-mono text-orange-900 tracking-widest">SECURE_CONNECTION_ESTABLISHED</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SummerSection;