'use client';

import { useEffect, useRef, useState } from 'react';

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

const LETTER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const NUMBER_CHARS = '0123456789'.split('');
const SYMBOL_CHARS = ['₹', '$', '€', '£', '¥', ',', '.'];

export function HyperText({
  children,
  className = '',
  duration = 800,
  delay = 0,
  as: Component = 'div',
  startOnView = false,
  animateOnHover = true,
  characterSet,
}: HyperTextProps) {
  const [displayText, setDisplayText] = useState(children);
  const [isAnimating, setIsAnimating] = useState(false);
  const iterationCount = useRef(0);
  const elementRef = useRef<HTMLElement>(null);

  // Helper function to get appropriate character set for a given character
  const getCharSetForChar = (char: string): string[] => {
    if (characterSet) return characterSet;
    if (/[0-9]/.test(char)) return NUMBER_CHARS;
    if (/[₹$€£¥,.]/.test(char)) return SYMBOL_CHARS;
    if (/[A-Za-z]/.test(char)) return LETTER_CHARS;
    return [char]; // Return the character itself if no match
  };

  const scramble = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
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
            
            const charSet = getCharSetForChar(children[index]);
            return charSet[Math.floor(Math.random() * charSet.length)];
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
