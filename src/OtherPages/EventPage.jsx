import React, { useRef, useLayoutEffect, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const YourNameSection = ({ globalTriggerRef }) => {
  const sectionRef = useRef(null);
  const bigDivRef = useRef(null);
  const stringPathRef = useRef(null); // Reference for the path itself
  const auroraContainerRef = useRef(null);
  const cloudsRef = useRef(null);
  
  const [activeIndex, setActiveIndex] = useState(0);

  const data = useMemo(() => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    return alphabet.map((char, index) => ({
      id: char,
      title: `TWILIGHT HOUR ${char}`,
      desc: `THREAD OF FATE ${index < 9 ? '0' + (index + 1) : index + 1}`,
      bio: `Timeline diverging at Node ${char}. The comet trail leaves a soft glow across the winter horizon. The cold air carries the sound of the lake's heartbeat.`,
      img: [
        "https://images.unsplash.com/photo-1506318137071-a8bcbf6d919d?q=80&w=500&auto=format&fit=crop", 
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=500&auto=format&fit=crop", 
        "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=500&auto=format&fit=crop"
      ][index % 3]
    }));
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // --- 1. BIG RANDOM ORGANIC THREAD ANIMATION ---
      const stringPath = stringPathRef.current;
      const waveConfig = { 
        p1: 0, p2: 0, p3: 0, 
        amp: 60 
      };

      gsap.to(waveConfig, {
        p1: Math.PI * 4,
        p2: Math.PI * 2,
        p3: Math.PI * 3,
        amp: 150, 
        repeat: -1,
        duration: 14,
        yoyo: true,
        ease: "sine.inOut",
        onUpdate: () => {
          const a = waveConfig.amp;
          const y1 = 450 + Math.sin(waveConfig.p1) * a;
          const y2 = 450 + Math.cos(waveConfig.p2) * (a * 1.3); 
          const y3 = 450 + Math.sin(waveConfig.p3) * (a * 0.8);
          const newPath = `M-200,450 C200,${y1} 500,${y2} 720,${y3} C940,${y2} 1300,${y1} 1700,450`;
          stringPath.setAttribute("d", newPath);
        }
      });

      gsap.to(".heading-aurora-glow", {
        x: "random(-30, 30)",
        skewX: "random(-15, 15)",
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to(".string-svg", {
        x: -50,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      const layers = gsap.utils.toArray(".aurora-layer");
      layers.forEach((layer, i) => {
        gsap.to(layer, {
          x: "random(-15, 15)%",
          y: "random(-10, 10)%",
          skewX: "random(-20, 20)",
          opacity: "random(0.3, 0.6)",
          duration: "random(6, 12)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.5
        });
      });

      gsap.to(".cloud-layer", {
        x: "+=30",
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 3
      });

      const flakes = gsap.utils.toArray(".snowflake");
      flakes.forEach((flake) => {
        gsap.set(flake, { 
          x: gsap.utils.random(0, window.innerWidth), 
          y: gsap.utils.random(-100, -10),
          opacity: gsap.utils.random(0.3, 0.8),
          scale: gsap.utils.random(0.3, 0.7)
        });
        gsap.to(flake, {
          y: window.innerHeight + 100,
          x: `+=${gsap.utils.random(-40, 40)}`, 
          rotation: gsap.utils.random(0, 360),
          duration: gsap.utils.random(10, 25),
          ease: "none",
          repeat: -1,
        });
      });

      const triggerElement = globalTriggerRef?.current || sectionRef.current;
      gsap.from(".list-item-text", { 
        x: -20, 
        opacity: 0, 
        filter: "blur(5px)",
        stagger: 0.04, 
        duration: 1, 
        ease: "power3.out",
        scrollTrigger: {
            trigger: triggerElement,
            start: globalTriggerRef ? "70% center" : "top center", 
        }
      });

    }, sectionRef);
    return () => ctx.revert();
  }, [globalTriggerRef]);

  const handleItemClick = (index) => {
    if (index === activeIndex) return;
    const tl = gsap.timeline();
    tl.to(bigDivRef.current, { opacity: 0, y: 10, duration: 0.2, ease: "power2.in", onComplete: () => setActiveIndex(index) })
      .to(bigDivRef.current, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
  };

  return (
    <div ref={sectionRef} className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-start px-4 md:px-10 py-12 md:py-16 bg-[#070b14] font-sans">
      
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a101e] via-[#1a1133] to-[#05080f] -z-20"></div>
      
      <div ref={auroraContainerRef} className="absolute top-[-10%] left-0 w-full h-[60vh] z-0 pointer-events-none overflow-hidden mix-blend-screen opacity-50">
        <div className="aurora-layer absolute top-0 left-[10%] w-[80%] h-[150px] bg-[#00F3FF] rounded-full blur-[100px] opacity-40 origin-center"></div>
        <div className="aurora-layer absolute top-[50px] left-[20%] w-[60%] h-[200px] bg-[#8000ff] rounded-full blur-[120px] opacity-30 origin-center"></div>
        <div className="aurora-layer absolute top-[20px] left-[40%] w-[70%] h-[180px] bg-[#FF007A] rounded-full blur-[110px] opacity-25 origin-center"></div>
      </div>

      <div className="absolute inset-0 opacity-40 z-[-15]" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '80px 80px' }}></div>

      <div className="absolute inset-0 z-0 pointer-events-none opacity-50 mix-blend-screen">
        <svg className="string-svg w-full h-full" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none">
            <path ref={stringPathRef} d="M-200,450 C200,200 400,800 720,450 C1040,100 1240,700 1700,450" stroke="#ff4d4d" strokeWidth="3" strokeLinecap="round" filter="url(#string-glow)"/>
            <defs><filter id="string-glow"><feGaussianBlur stdDeviation="3" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter></defs>
        </svg>
      </div>

      {/* --- TOP HEADING SECTION (Gap Decreased) --- */}
      <div className="relative z-30 flex flex-col items-center mb-2"> 
        <div className="heading-aurora-glow absolute -top-10 w-[300px] h-[100px] bg-[#ff007a]/40 blur-[70px] rounded-full pointer-events-none opacity-60"></div>
        <h1 className="text-white text-5xl md:text-7xl font-bold tracking-[0.05em] uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          Events
        </h1>
        <div className="w-44 h-[2px] bg-gradient-to-r from-transparent via-[#ff4d4d] to-transparent mt-2 opacity-70"></div>
      </div>

      {/* Main Content (Gap to heading decreased) */}
      <div className="relative z-10 flex flex-col md:flex-row w-full max-w-7xl h-full md:h-[70vh] gap-8 md:gap-16 justify-center items-center mt-0">
        
        {/* LEFT LIST */}
        <div className="order-2 md:order-1 flex flex-col w-full md:w-[45%] h-[50vh] md:h-[65vh] overflow-y-auto overflow-x-visible no-scrollbar pr-20 z-20 select-none mask-fade">
          <div className="flex flex-col gap-6 pl-4 md:pl-8 py-10">
            {data.map((item, i) => (
                <div 
                  key={item.id} 
                  onClick={() => handleItemClick(i)} 
                  className="group cursor-pointer flex items-center gap-5 transition-all duration-500"
                  style={{ 
                    paddingTop: activeIndex === i ? '15px' : '0px',
                    paddingBottom: activeIndex === i ? '15px' : '0px',
                  }}
                >
                  <span className={`text-[10px] font-sans font-bold tracking-widest transition-all duration-300 ${activeIndex === i ? "text-[#ff4d4d]" : "text-indigo-200/30"}`}>
                    {i < 9 ? `0${i + 1}` : i + 1}
                  </span>
                  <div className="list-item-text flex flex-col">
                    <h4 
                      className={`text-xl md:text-4xl font-semibold tracking-tight transition-all duration-500 leading-none ${activeIndex === i ? "text-white drop-shadow-[0_0_8px_#ff4d4d]" : "text-slate-500 group-hover:text-indigo-200 "}`}
                      style={{ 
                        transform: activeIndex === i ? 'scale(1.2)' : 'scale(1)',
                        transformOrigin: 'left center',
                        display: 'inline-block'        
                      }}
                    >
                      {item.title}
                    </h4>
                  </div>
                </div>
            ))}
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="order-1 md:order-2 w-full md:w-[65%] flex items-center justify-center z-10">
          <div 
            ref={bigDivRef} 
            className="relative w-full h-[45vh] md:h-[60vh] bg-white/[0.01] backdrop-blur-[10px] rounded-[1rem] border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-12 flex flex-col justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="absolute -top-40 -right-40 w-[30rem] h-[30rem] bg-[#ff4d4d]/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="absolute top-6 right-6 md:top-[3vw] md:right-[3vw] w-[24vw] h-[24vw] md:w-[14vw] md:h-[14vw] rounded-full border border-white/10 shadow-xl overflow-hidden z-20 pointer-events-none">
                <img src={data[activeIndex].img} alt="" className="w-full h-full object-cover opacity-80 mix-blend-lighten" />
            </div>

            <div className="relative z-10 w-full max-w-[70%] text-left">
              <div className="flex items-center gap-3 mb-6 opacity-70">
                <div className="w-10 h-[1px] bg-[#ff4d4d]"></div>
                <span className="text-white text-[10px] tracking-[0.4em] uppercase">Fragment // {data[activeIndex].id}</span>
              </div>
              <h2 className="text-4xl md:text-[4vw] font-bold text-white mb-6 tracking-tight leading-[0.9] drop-shadow-md">
                {data[activeIndex].title}
              </h2>
              <p className="text-sm md:text-xl text-indigo-100/70 leading-relaxed font-light pl-6 border-l border-white/10 py-2 italic">
                {data[activeIndex].bio}
              </p>
            </div>
            <div className="absolute bottom-12 right-12 opacity-30 text-[9px] font-sans text-white tracking-[0.5em]">KIMI_NO_NA_WA_SYSTEM</div>
          </div>
        </div>
      </div>

 {/* SNOW LAYER (TOP LAYER) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(60)].map((_, i) => (
            <div key={`snow-${i}`} className="snowflake absolute bg-white rounded-full blur-[0.5px]" style={{ width: '6px', height: '6px', boxShadow: "0 0 4px rgba(255, 255, 255, 0.5)" }} />
        ))}
      </div>

      <style jsx="true">{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .mask-fade {
            mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
            -webkit-mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
        }
      `}</style>
    </div>
  );
};

export default YourNameSection;