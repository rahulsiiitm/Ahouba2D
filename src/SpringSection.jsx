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

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. FADE TRANSITION (unchanged)
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

      // 2. LIGHTER BLOBS (reduced complexity)
      blobsRef.current.forEach((blob, index) => {
        gsap.to(blob, {
          scale: 1.12,
          duration: 7,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: index * 1,
        });
      });

      // 3. SIMPLE PETALS LIKE OVERLAYMENU (8 petals only)
      petalsRef.current.forEach((petal, index) => {
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
          rotation: 360,
          duration: gsap.utils.random(3, 8),
          ease: "none",
          repeat: -1,
          delay: gsap.utils.random(0, 5),
          overwrite: true,
        });
      });

      // 4. TEXT ANIMATIONS (unchanged)
      gsap.fromTo(
        decorLineLeftRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 50%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        decorLineRightRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay: 0.3,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 50%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        titleRef.current,
        { x: -200, opacity: 0, scale: 0.7, rotationY: -30 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 1.5,
          ease: "back.out(1.7)",
          delay: 0.5,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 50%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        subtitleRef.current,
        { x: 200, opacity: 0, filter: "blur(15px)" },
        {
          x: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.4,
          ease: "power3.out",
          delay: 1.0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 50%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        cardRef.current,
        { scale: 0.5, opacity: 0, y: 100, rotationX: 45 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 1.6,
          ease: "back.out(2)",
          delay: 1.4,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 50%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.to(cardRef.current, {
        boxShadow: "0 15px 60px rgba(236, 64, 122, 0.25)",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 3.2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative w-full h-screen overflow-hidden">
      {/* BASE BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br 
from-[#2A0F3D] 
via-[#4A1459]
to-[#8E1459] -z-10"></div>

      {/* FADE OVERLAY */}
      <div
        ref={fadeOverlayRef}
        className="absolute inset-0 bg-gradient-to-b from-[#1a0b2e] via-[#2e1a3e] to-[#1a0b2e] z-10 pointer-events-none"
      ></div>

      {/* LIGHTER BLOBS (same positions, reduced effects) */}
      <div className="absolute inset-0 z-0">
        <div
          ref={(el) => (blobsRef.current[0] = el)}
          className="absolute top-[10%] left-[5%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-[#f8bbd0]/30 to-transparent blur-[60px]"
        ></div>
        <div
          ref={(el) => (blobsRef.current[1] = el)}
          className="absolute top-[50%] right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#ffccbc]/40 to-transparent blur-[70px]"
        ></div>
        <div
          ref={(el) => (blobsRef.current[2] = el)}
          className="absolute bottom-[5%] left-[40%] w-[420px] h-[420px] rounded-full bg-gradient-to-br from-[#e1bee7]/30 to-transparent blur-[55px]"
        ></div>
      </div>

      {/* SIMPLE CHERRY BLOSSOMS LIKE OVERLAYMENU (8 petals) */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            ref={(el) => (petalsRef.current[i] = el)}
            className="absolute top-0 left-0 w-4 h-4 bg-[#FF007A] opacity-0 pointer-events-none shadow-[0_0_10px_#FF007A]"
            style={{ 
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            }}
          />
        ))}
      </div>

      {/* CONTENT (unchanged) */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-8 text-center">
        <div className="flex items-center gap-6 mb-8">
          <div
            ref={decorLineLeftRef}
            className="w-24 h-[2px] bg-gradient-to-r from-transparent to-pink-400 origin-left opacity-0"
            style={{ boxShadow: '0 0 10px rgba(236, 64, 122, 0.4)' }}
          ></div>
          <div className="w-3 h-3 rounded-full bg-pink-400" style={{ boxShadow: '0 0 15px rgba(236, 64, 122, 0.6)' }}></div>
          <div
            ref={decorLineRightRef}
            className="w-24 h-[2px] bg-gradient-to-l from-transparent to-pink-400 origin-right opacity-0"
            style={{ boxShadow: '0 0 10px rgba(236, 64, 122, 0.4)' }}
          ></div>
        </div>

        <h1
          ref={titleRef}
          className="text-7xl md:text-9xl font-black mb-6 opacity-0"
          style={{
            background: 'linear-gradient(135deg, #ec407a 0%, #f06292 50%, #f8bbd0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 8px 30px rgba(236, 64, 122, 0.3)',
            perspective: '1000px',
          }}
        >
          CHERRY BLOOM
        </h1>

        <p
          ref={subtitleRef}
          className="text-2xl md:text-3xl text-pink-900/80 mb-16 max-w-3xl font-light tracking-wide opacity-0"
          style={{
            textShadow: '0 2px 10px rgba(236, 64, 122, 0.1)',
          }}
        >
          Delicate petals drift • A symphony of spring awakening
        </p>

        <div
          ref={cardRef}
          className="relative p-10 bg-white/60 backdrop-blur-md rounded-[2rem] border border-pink-200/40 max-w-2xl opacity-0"
          style={{
            boxShadow: '0 10px 50px rgba(236, 64, 122, 0.15)',
            perspective: '1000px',
          }}
        >
          <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-pink-300 rounded-tl-lg"></div>
          <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-pink-300 rounded-br-lg"></div>
          
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            Spring whispers softly through the air—cherry blossoms dance on gentle winds, 
            each petal a fleeting moment of beauty. Nature awakens with quiet grace.
          </p>
        </div>
      </div>

      {/* LIGHT GRADIENT */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.3) 0%, transparent 60%)',
        }}
      ></div>

      <style jsx="true">{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default SpringSection;
