import { useEffect, useRef, useState, ElementType } from "react";

interface Props {
  text: string;
  as?: ElementType;
  className?: string;
  highlights?: string[];
  highlightClassName?: string;
  staggerMs?: number;
  initialDelayMs?: number;
  threshold?: number;
}

function tokenizeText(text: string, highlights: string[]) {
  if (!highlights.length) {
    return text.split(" ").map((word) => ({ word, isHighlighted: false }));
  }

  const ranges: { start: number; end: number }[] = [];
  for (const phrase of highlights) {
    let pos = 0;
    while ((pos = text.indexOf(phrase, pos)) !== -1) {
      ranges.push({ start: pos, end: pos + phrase.length });
      pos += phrase.length;
    }
  }

  const words = text.split(" ");
  let currentPos = 0;

  return words.map((word) => {
    const wordStart = text.indexOf(word, currentPos);
    const wordEnd = wordStart + word.length;
    currentPos = wordEnd > -1 ? wordEnd : currentPos;

    const isHighlighted = ranges.some(
      (r) => wordStart >= r.start && wordEnd <= r.end
    );

    return { word, isHighlighted };
  });
}

function InteractiveGreenWord({
  word,
  isVisible,
  delay,
  prefersReducedMotion,
  customClassName = "",
}: {
  key?: number | string;
  word: string;
  isVisible: boolean;
  delay: number;
  prefersReducedMotion: boolean;
  customClassName?: string;
}) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let animId: number;
    let targetGradPos = 50;
    let currentGradPos = 50;

    const handleMouseMove = (e: MouseEvent) => {
      if (!spanRef.current) return;
      const rect = spanRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const dx = e.clientX - centerX;
      
      // Map mouse X offset relative to word to gradient shift
      const distRatio = Math.max(-1, Math.min(1, dx / 250));
      targetGradPos = 50 + distRatio * 50;
    };

    const loop = () => {
      currentGradPos += (targetGradPos - currentGradPos) * 0.1;

      if (spanRef.current) {
        spanRef.current.style.backgroundPosition = `${currentGradPos.toFixed(1)}% 50%`;
      }

      animId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [prefersReducedMotion]);

  return (
    <span
      ref={spanRef}
      className={`inline-block mr-[0.22em] font-heading font-black text-[1.12em] select-none text-transparent bg-clip-text bg-[length:220%_auto] transition-all duration-200 ${customClassName}`}
      style={{
        backgroundImage:
          "linear-gradient(110deg, #2bb102 0%, #41F20A 30%, #c4ff9e 50%, #41F20A 70%, #1a8300 100%)",
        backgroundPosition: "50% 50%",
        opacity: isVisible || prefersReducedMotion ? 1 : 0,
        filter: isVisible || prefersReducedMotion ? "blur(0px)" : "blur(4px)",
        transition: prefersReducedMotion
          ? "none"
          : `opacity 0.6s ease-out ${delay}ms, filter 0.6s ease-out ${delay}ms`,
      }}
    >
      {word}
    </span>
  );
}

export function AnimatedText({
  text,
  as: Component = "p",
  className = "",
  highlights = [],
  highlightClassName = "font-heading font-black text-[1.12em] sm:text-[1.18em]",
  staggerMs = 35,
  initialDelayMs = 0,
  threshold = 0.2,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setPrefersReducedMotion(true);
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  const tokens = tokenizeText(text, highlights);

  return (
    <Component ref={ref as any} className={className}>
      {tokens.map(({ word, isHighlighted }, idx) => {
        const delay = initialDelayMs + idx * staggerMs;
        if (isHighlighted) {
          return (
            <InteractiveGreenWord
              key={idx}
              word={word}
              isVisible={isVisible}
              delay={delay}
              prefersReducedMotion={prefersReducedMotion}
              customClassName={highlightClassName}
            />
          );
        }

        return (
          <span
            key={idx}
            className="inline-block mr-[0.25em]"
            style={{
              opacity: isVisible || prefersReducedMotion ? 1 : 0,
              transform: isVisible || prefersReducedMotion ? "translateY(0)" : "translateY(16px)",
              filter: isVisible || prefersReducedMotion ? "blur(0px)" : "blur(4px)",
              transition: prefersReducedMotion
                ? "none"
                : `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms, filter 0.6s ease-out ${delay}ms`,
            }}
          >
            {word}
          </span>
        );
      })}
    </Component>
  );
}
