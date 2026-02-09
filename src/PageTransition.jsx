import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CircleRevealTransition = ({ 
  color1, 
  triggerRef, 
  currentSectionRef,
  nextSectionRef,
  originPosition = "center"
}) => {
  const colorLayerRef = useRef(null);

  const getOriginCoordinates = (position) => {
    const positions = {
      "top-left": { x: 5, y: 5 },
      "bottom-right": { x: 95, y: 95 },
      "top-right": { x: 95, y: 5 },
      "bottom-left": { x: 5, y: 95 },
      "center": { x: 50, y: 50 },
    };
    return positions[position] || positions.center;
  };

  useLayoutEffect(() => {
    if (!triggerRef?.current || !nextSectionRef?.current) return;

    const ctx = gsap.context(() => {
      const origin = getOriginCoordinates(originPosition);
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;
            if (p > 0 && p < 1) {
              // FORCE visibility and high z-index for the color and next section
              gsap.set(colorLayerRef.current, { display: "block", zIndex: 40 });
              gsap.set(nextSectionRef.current, { 
                display: "block", 
                opacity: 1, 
                zIndex: 41, // Section sits just above the color layer
                visibility: "visible" 
              });
            }
          },
          onLeave: () => {
            gsap.set(colorLayerRef.current, { display: "none" });
          }
        }
      });

      // Animate the COLOR LAYER and the NEXT SECTION together
      const clipFrom = `circle(0% at ${origin.x}% ${origin.y}%)`;
      const clipTo = `circle(150% at ${origin.x}% ${origin.y}%)`;

      tl.fromTo([colorLayerRef.current, nextSectionRef.current], 
        { clipPath: clipFrom, webkitClipPath: clipFrom },
        { clipPath: clipTo, webkitClipPath: clipTo, ease: "none" }
      );
    });
    
    return () => ctx.revert();
  }, [originPosition, triggerRef]);

  return (
    // This div acts as the solid color "wall" that reveals the next page
    <div 
      ref={colorLayerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ 
        backgroundColor: color1, // This is where your pink/purple/blue comes from
        display: "none",
        willChange: "clip-path"
      }}
    />
  );
};

export default CircleRevealTransition;