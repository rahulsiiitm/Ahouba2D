import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SpringSection = () => {
  const sectionRef = useRef(null);
  const fadeOverlayRef = useRef(null);
  const blobsRef = useRef([]);
  const petalsRef = useRef([]);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardRef = useRef(null);
  const decorLineLeftRef = useRef(null);
  const decorLineRightRef = useRef(null);

  // --- PALETTE CONSTANTS (Dusty Neon) ---
  // Background: #160E1E (Matte Plum)
  // Panel: #241622 (Sakura Charcoal)
  // Primary: #E46A9F (Soft Neon Sakura)
  // Secondary: #9D7BCF (Muted Lavender)
  // Highlight: #7BCED9 (Calm Cyan)
  // Text: #F1ECF7

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. FADE TRANSITION
      gsap.fromTo(
        fadeOverlayRef.current,
        { opacity: 1 },
        {
          opacity: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top 20%",
            scrub: 1,
          },
        }
      );

      // 2. BLOBS (Slower, subtle movement)
      blobsRef.current.forEach((blob, index) => {
        gsap.to(blob, {
          scale: 1.1,
          x: "+=20",
          y: "-=20",
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 1.5,
        });
      });

      // 3. PETALS (Soft Pink #E46A9F, No Glow)
      petalsRef.current.forEach((petal, index) => {
        gsap.set(petal, {
          x: gsap.utils.random(0, window.innerWidth),
          y: -50,
          rotation: gsap.utils.random(0, 360),
          scale: gsap.utils.random(0.5, 1.2),
          opacity: gsap.utils.random(0.4, 0.9),
        });

        gsap.to(petal, {
          y: window.innerHeight + 100,
          x: "+=80",
          rotation: 360,
          duration: gsap.utils.random(5, 10), // Slower fall for "calm" feel
          ease: "none",
          repeat: -1,
          delay: gsap.utils.random(0, 5),
          overwrite: true,
        });
      });

      // 4. UI ENTRANCE ANIMATIONS
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });

      // Decor Lines
      tl.fromTo(
        [decorLineLeftRef.current, decorLineRightRef.current],
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 1, ease: "power3.out" }
      );

      // Title
      tl.fromTo(
        titleRef.current,
        { y: 30, opacity: 0, filter: "blur(10px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, ease: "power2.out" },
        "-=0.8"
      );

      // Subtitle
      tl.fromTo(
        subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
        "-=0.6"
      );

      // Card (Panel)
      tl.fromTo(
        cardRef.current,
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "back.out(1.2)" },
        "-=0.8"
      );

      // Removed the infinite pulsing glow animation to strictly follow "Static glow = fatigue" rule.
      // The card now relies on its border and backdrop filter for presence.

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative w-full h-screen overflow-hidden bg-[#160E1E]">
      
      {/* 1. MATTE BACKGROUND BASE */}
      <div className="absolute inset-0 bg-[#160E1E] -z-20"></div>

      {/* 2. ATMOSPHERE (Dusty/Muted Blobs) */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        {/* Secondary Accent (Lavender) */}
        <div
          ref={(el) => (blobsRef.current[0] = el)}
          className="absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-[#9D7BCF] blur-[120px] mix-blend-screen"
        ></div>
        {/* Primary Accent (Sakura) - darker/dusty */}
        <div
          ref={(el) => (blobsRef.current[1] = el)}
          className="absolute bottom-[20%] right-[5%] w-[400px] h-[400px] rounded-full bg-[#E46A9F] blur-[100px] opacity-60 mix-blend-screen"
        ></div>
        {/* Highlight (Cyan) - very faint */}
        <div
          ref={(el) => (blobsRef.current[2] = el)}
          className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full bg-[#7BCED9] blur-[90px] opacity-30 mix-blend-screen"
        ></div>
      </div>

      {/* 3. PETALS (Flat color, no shadow) */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            ref={(el) => (petalsRef.current[i] = el)}
            // Changed color to #E46A9F, Removed shadow for flat/matte look
            className="absolute top-0 left-0 w-3 h-3 bg-[#E46A9F] opacity-0 pointer-events-none"
            style={{
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            }}
          />
        ))}
      </div>

      {/* 4. CONTENT */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-8 text-center">
        
        {/* Decorative Header Lines */}
     

        {/* Title */}
        <h1
          ref={titleRef}
          className="text-6xl md:text-8xl font-bold mb-6 opacity-0 tracking-tight"
          style={{
            color: "#F1ECF7",
            // Subtle text shadow, tight and dark, just for legibility
            textShadow: "0 4px 12px rgba(0,0,0,0.3)", 
          }}
        >
          ABOUT <span className="text-[#E46A9F] font-light"> AHOUBA</span>
        </h1>

          <div className="flex items-center gap-6 mb-8">
          <div
            ref={decorLineLeftRef}
            className="w-24 h-[1px] bg-gradient-to-r from-transparent to-[#E46A9F] origin-left opacity-0"
          ></div>
          {/* Diamond instead of glowy circle */}
          <div className="w-2 h-2 rotate-45 border border-[#E46A9F] bg-[#160E1E]"></div>
          <div
            ref={decorLineRightRef}
            className="w-24 h-[1px] bg-gradient-to-l from-transparent to-[#E46A9F] origin-right opacity-0"
          ></div>
        </div>
        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-[#9D7BCF] mb-16 max-w-2xl font-light tracking-wide opacity-0"
        >
          The Annual Fest of <span className="text-[#7BCED9]">IIIT Senapati, Manipur </span>
        </p>

        {/* Card (The Sakura Charcoal Panel) */}
        <div
          ref={cardRef}
          // Bg: Sakura Charcoal (#241622) with opacity
          // Border: 1px solid rgba(228, 106, 159, 0.25)
          // Blur: backdrop-blur-xl (Heavy blur, low shine)
          className="relative p-10 bg-[#241622]/80 backdrop-blur-xl rounded-xl border border-[#E46A9F]/25 max-w-2xl opacity-0 group transition-all duration-500"
          style={{
            // No static box-shadow. 
          }}
        >
          {/* Interaction Glow: Only on Hover */}
          <div className="absolute inset-0 rounded-xl transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"
               style={{
                 boxShadow: "0 0 20px rgba(228, 106, 159, 0.15)", // Very subtle glow on hover
                 border: "1px solid rgba(228, 106, 159, 0.5)"
               }}
          ></div>

          {/* Corner Accents (Cyan #7BCED9) */}
          <div className="absolute top-0 left-0 w-6 h-6 border-l border-t border-[#7BCED9]/50 rounded-tl-md"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-r border-b border-[#7BCED9]/50 rounded-br-md"></div>

          <p className="text-lg md:text-xl text-[#F1ECF7]/90 leading-relaxed font-light text-justify">
            <span className="text-[#E46A9F]">Ahouba</span> is the annual technical fest of <span className="text-[#E46A9F]">IIIT Manipur. </span>
  It is organized by the students of the institute.
The fest features a range of technical events and competitions.
Coding contests, quizzes, and problem-solving challenges are part of the lineup.
Workshops and talks are conducted during the fest.
Students from different colleges are invited to participate.
Both team-based and individual events are organized.
Ahouba offers participants a chance to test their skills in a competitive setting.
The fest also includes a few informal and fun events.
It provides space for interaction and collaboration among students.
Events are designed to be accessible to participants with different skill levels.
The fest encourages practical learning through hands-on activities.
Ahouba is held annually at the IIIT Manipur campus.
It is one of the key student-led events of the institute.
Overall, Ahouba offers a balanced mix of competition, learning, and engagement.
            <span className="text-[#E46A9F]"></span>
          </p>
        </div>
      </div>

      {/* FADE OVERLAY (Transition helper) */}
      <div
        ref={fadeOverlayRef}
        className="absolute inset-0 bg-[#160E1E] z-50 pointer-events-none"
      ></div>

    </div>
  );
};

export default SpringSection;