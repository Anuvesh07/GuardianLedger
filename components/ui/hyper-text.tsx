'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface HyperTextProps {
  children: string;
  className?: string;
  duration?: number;
  delay?: number;
  as?: React.ElementType;
  startOnView?: boolean;
  animateOnHover?: boolean;
  characterSet?: string[];
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function HyperText({
  children,
  className = '',
  duration = 800,
  delay = 0,
  as: Component = 'div',
  startOnView = false,
  animateOnHover = true,
  characterSet = DEFAULT_CHARS,
}: HyperTextProps) {
  const [displayText, setDisplayText] = useState(children);
  const [isAnimating, setIsAnimating] = useState(false);
  const iterationCount = useRef(0);
  const elementRef = useRef<HTMLElement>(null);

  const scramble = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const iterations = Math.floor(duration / 30);
    iterationCount.current = 0;

    const interval = setInterval(() => {
      setDisplayText((prev) =>
        prev
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            
            if (index < iterationCount.current) {
              return children[index];
            }
            
            return characterSet[Math.floor(Math.random() * characterSet.length)];
          })
          .join('')
      );

      iterationCount.current += 1 / 3;

      if (iterationCount.current >= children.length) {
        clearInterval(interval);
        setDisplayText(children);
        setIsAnimating(false);
      }
    }, 30);
  };

  useEffect(() => {
    if (!startOnView && !animateOnHover) {
      const timer = setTimeout(() => {
        scramble();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (startOnView && elementRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setTimeout(() => scramble(), delay);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(elementRef.current);
      return () => observer.disconnect();
    }
  }, [startOnView]);

  return (
    <Component
      ref={elementRef}
      className={className}
      onMouseEnter={animateOnHover ? scramble : undefined}
    >
      {displayText}
    </Component>
  );
}
