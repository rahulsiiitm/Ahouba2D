import React, { memo, useRef, useLayoutEffect } from 'react';
import gsap from "gsap";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa"; 

const AnimatedWaveFooter = memo(({ triggerRef }) => {
  const topOverlayRef = useRef(null);
  const bottomFooterRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top center",
          end: "bottom bottom",
          scrub: 1,
        }
      });

      tl.fromTo(topOverlayRef.current, 
        { opacity: 0 }, 
        { opacity: 1, ease: "none" }, 
      0);

      // Animates to 60vh (meaning it's 40vh tall)
      tl.fromTo(bottomFooterRef.current, 
        { y: "100vh" }, 
        { y: "60vh", ease: "none" }, 
      0);
    });

    return () => ctx.revert();
  }, [triggerRef]);

  const waveSvg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 1000 150' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'%3E%3Cpath fill='%231a56db' d='M0,150 L0,75 Q250,150 500,75 T1000,75 L1000,150 Z'/%3E%3C/svg%3E")`;

  return (
    <div className="fixed inset-0 w-full h-screen z-[60] pointer-events-none">
      
      {/* Black Overlay over the whole screen */}
      <div ref={topOverlayRef} className="absolute top-0 left-0 w-full h-[100vh] bg-black/50 opacity-0 pointer-events-none" />

      {/* Reduced size: w-full h-[40vh] instead of 50vh */}
      <div ref={bottomFooterRef} className="absolute top-0 left-0 w-full h-[40vh] flex flex-col pointer-events-auto" style={{ transform: 'translateY(100vh)' }}>
        
        {/* 1. THE WAVE DIV (UP) */}
        <div className="relative w-full h-[150px] shrink-0 overflow-hidden leading-[0] pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-100 z-[10] wave-bg animate-wave1" style={{ backgroundImage: waveSvg }} />
          <div className="absolute top-0 left-0 w-full h-full opacity-50 z-[9] wave-bg animate-wave2" style={{ backgroundImage: waveSvg }} />
          <div className="absolute top-0 left-0 w-full h-full opacity-30 z-[8] wave-bg animate-wave3" style={{ backgroundImage: waveSvg }} />
          <div className="absolute top-0 left-0 w-full h-full opacity-70 z-[7] wave-bg animate-wave4" style={{ backgroundImage: waveSvg }} />
        </div>

        {/* 2. THE SOLID DIV (DOWN) */}
        <div className="w-full flex-grow bg-[#1a56db] flex flex-col justify-center items-center pb-8 pt-2 relative z-20">
          
          <ul className="relative flex justify-center items-center gap-[10px] my-[10px] flex-wrap">
            {[FaFacebook, FaTwitter, FaLinkedin, FaInstagram].map((Icon, i) => (
              <li key={i} className="list-none">
                <a href="#" className="text-white text-[2rem] mx-[10px] inline-block transition-transform duration-500 hover:-translate-y-[10px]">
                  <Icon />
                </a>
              </li>
            ))}
          </ul>

          <ul className="relative flex justify-center items-center gap-[10px] my-[20px] flex-wrap">
            {['Home', 'About', 'Services', 'Team', 'Contact'].map((item, i) => (
              <li key={i} className="list-none mx-[10px]">
                <a href="#" className="text-white text-[1.1rem] md:text-[1.2rem] font-[300] no-underline opacity-75 hover:opacity-100 transition-opacity duration-300 inline-block">
                  {item}
                </a>
              </li>
            ))}
          </ul>

          <p className="text-white font-[300] text-[0.9rem] md:text-[1rem] mt-[15px] mb-[10px] opacity-75 text-center">
            &copy;2026 AHOUBA | All Rights Reserved
          </p>
        </div>

         <style>{`
          .wave-bg {
            background-size: 1000px 150px;
            background-repeat: repeat-x;
            background-position: 0 bottom;
          }
          @keyframes wave { 
            0% { background-position-x: 0px; } 
            100% { background-position-x: 1000px; } 
          }
          @keyframes wave-reverse { 
            0% { background-position-x: 1000px; } 
            100% { background-position-x: 0px; } 
          }
          .animate-wave1 { animation: wave 4s linear infinite; }
          .animate-wave2 { animation: wave-reverse 5s linear infinite; }
          .animate-wave3 { animation: wave 6s linear infinite; }
          .animate-wave4 { animation: wave-reverse 7s linear infinite; }
        `}</style>
      </div>
    </div>
  );
});

export default AnimatedWaveFooter;