import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const Navbar = ({ toggleMenu }) => {
  const navRef = useRef(null);
  const lastScrollY = useRef(0);

  // ✅ Links matching the IDs in App.js
  const navItems = [
    { name: "HOME", link: "#home" },         // Goes to Top
    { name: "ABOUT", link: "#about" },       // Goes to Spring Section
    { name: "EVENTS", link: "#events" },     // Goes to Winter/Space Section
    { name: "PEOPLE", link: "#people" },     // Goes to Summer Section
    { name: "SPONSORS", link: "#sponsors" }, // Goes to Autumn Section
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const navbar = navRef.current;

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // Scroll Down -> Hide Up
        gsap.to(navbar, {
          yPercent: -100,
          duration: 1.5,
          ease: "power2.out",
        });
      } else {
        // Scroll Up -> Show
        gsap.to(navbar, {
          yPercent: 0,
          duration: 1.5,
          ease: "power2.out",
        });
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Smooth Scroll Handler
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full flex justify-center z-50 pointer-events-none drop-shadow-[0_0_15px_rgba(113,34,250,0.5)]">
      <nav
        ref={navRef}
        className="pointer-events-auto md:w-[75%] md:h-19 h-20 relative w-[85%]    
                   bg-[#1A0B2E]/90 backdrop-blur-md 
                   border-b-4 border-[#FF007A]
                   shadow-[0_4px_30px_rgba(255,0,122,0.4)]
                   [clip-path:polygon(0_0,100%_0,95%_100%,5%_100%)]
                   flex items-center justify-center transition-colors"
      >
        <ul className="flex flex-row md:gap-23 gap-9 list-none m-0 p-0 pb-2">
          {navItems.map((item, index) => (
            <li key={index}>
              <a
                href={item.link}
                onClick={(e) => handleNavClick(e, item.link)} // ✅ Attach Handler
                className="text-white text-xl font-['Orbitron'] font-bold tracking-[0.2em] cursor-pointer 
                           block transition-all duration-200 ease-out
                           hover:text-[#F0F600] hover:scale-110 
                           hover:drop-shadow-[0_0_10px_rgba(240,246,0,0.8)] md:text-[1.2vw] text-[1.9vw]"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;