import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  threshold?: number;
  className?: string;
  triggerOnce?: boolean;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = "up",
  distance = 50,
  duration = 0.8,
  delay = 0,
  stagger = 0,
  threshold = 0.1,
  className = "",
  triggerOnce = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let x = 0;
    let y = 0;

    switch (direction) {
      case "up":
        y = distance;
        break;
      case "down":
        y = -distance;
        break;
      case "left":
        x = distance;
        break;
      case "right":
        x = -distance;
        break;
    }

    // Set initial state
    const children = Array.from(element.children);
    gsap.set(children, {
      opacity: 0,
      x,
      y,
    });

    // Create ScrollTrigger
    const st = ScrollTrigger.create({
      trigger: element,
      start: `top ${100 - threshold * 100}%`,
      toggleActions: triggerOnce ? "play none none none" : "play none none reverse",
      onEnter: () => {
        gsap.to(children, {
          opacity: 1,
          x: 0,
          y: 0,
          duration,
          delay,
          stagger,
          ease: "power3.out",
          overwrite: true,
        });
      },
      onLeaveBack: () => {
        if (!triggerOnce) {
          gsap.to(children, {
            opacity: 0,
            x,
            y,
            duration,
            ease: "power3.in",
            overwrite: true,
          });
        }
      },
    });

    return () => {
      st.kill();
      gsap.killTweensOf(children);
    };
  }, [direction, distance, duration, delay, stagger, threshold, triggerOnce]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default ScrollReveal;
