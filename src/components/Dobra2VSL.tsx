import { useEffect, useRef, useState } from "react";
import { AnimatedText } from "./ui/AnimatedText";

export default function Dobra2VSL() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [ondeX, setOndeX] = useState(0);
  const [atuamosX, setAtuamosX] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const totalDistance = windowHeight + rect.height;
      const currentProgress = (windowHeight - rect.top) / totalDistance;
      const clamped = Math.max(0, Math.min(1, currentProgress));
      
      // Horizontal only displacement:
      // ONDE moves right as page scrolls down
      // ATUAMOS moves left as page scrolls down
      const moveAmount = (clamped - 0.5) * 160;
      setOndeX(moveAmount);
      setAtuamosX(-moveAmount);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Text content & highlights
  const eyebrowText = "ONDE ATUAMOS";
  const headlineText = "Nosso trabalho é transformar conhecimento em uma marca que gera influência, oportunidades e vendas.";
  const paragraphText = "Criamos estratégias que posicionam especialistas como referência em seus nichos, gerando audiência qualificada, autoridade e um fluxo previsível de clientes sem depender apenas de indicação ou conteúdo viral.";
  const paragraphHighlights = [
    "posicionam especialistas como referência em seus nichos",
    "fluxo previsível de clientes"
  ];

  return (
    <div className="relative text-white w-full" id="dobra2-container">
      
      {/* SECTION: ONDE ATUAMOS (Pure black background with smooth gradient transition blends & increased spacing) */}
      <section
        ref={sectionRef}
        id="onde-atuamos"
        className="relative w-full bg-black min-h-[90vh] flex flex-col justify-center items-center py-36 md:py-56 px-4 md:px-8 overflow-hidden my-12 md:my-20"
      >
        {/* Top Smooth Transition Gradient (Fades softly from Dobra 1 into Dobra 2) */}
        <div className="absolute top-0 inset-x-0 h-32 md:h-52 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-10" />

        {/* Bottom Smooth Transition Gradient (Fades softly from Dobra 2 into Dobra 3) */}
        <div className="absolute bottom-0 inset-x-0 h-32 md:h-52 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10" />
        {/* Watermark Giant Text 1: "ONDE" (Top-Left corner, moves ONLY horizontally on scroll with green light behind) */}
        <div 
          className="absolute top-[6%] sm:top-[8%] left-[2%] sm:left-[5%] font-black font-heading tracking-wider uppercase select-none pointer-events-none z-0 leading-none whitespace-nowrap transition-transform duration-75 ease-out"
          style={{
            fontSize: "clamp(3.5rem, 11vw, 9.5rem)",
            transform: `translateX(${ondeX}px)`,
            willChange: "transform",
          }}
        >
          {/* Green degrade / light glow beam passing directly behind ONDE */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[150%] bg-gradient-to-r from-[#41F20A]/0 via-[#41F20A]/25 to-[#41F20A]/0 rounded-full blur-[50px] sm:blur-[80px] -z-10 pointer-events-none" />
          <span className="relative z-10 text-white/[0.08] sm:text-white/[0.12] drop-shadow-[0_0_30px_rgba(65,242,10,0.35)]">
            ONDE
          </span>
        </div>

        {/* Watermark Giant Text 2: "ATUAMOS" (Bottom-Right corner, moves ONLY horizontally on scroll with green light behind) */}
        <div 
          className="absolute bottom-[6%] sm:bottom-[8%] right-[2%] sm:right-[5%] font-black font-heading tracking-wider uppercase select-none pointer-events-none z-0 leading-none whitespace-nowrap transition-transform duration-75 ease-out"
          style={{
            fontSize: "clamp(3.5rem, 11vw, 9.5rem)",
            transform: `translateX(${atuamosX}px)`,
            willChange: "transform",
          }}
        >
          {/* Green degrade / light glow beam passing directly behind ATUAMOS */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[150%] bg-gradient-to-r from-[#41F20A]/0 via-[#41F20A]/25 to-[#41F20A]/0 rounded-full blur-[50px] sm:blur-[80px] -z-10 pointer-events-none" />
          <span className="relative z-10 text-white/[0.08] sm:text-white/[0.12] drop-shadow-[0_0_30px_rgba(65,242,10,0.35)]">
            ATUAMOS
          </span>
        </div>

        {/* Foreground Content (z-index above watermark, max-width ~920px) */}
        <div className="relative z-10 max-w-[920px] mx-auto text-center space-y-8 px-4">
          
          {/* 1. Eyebrow */}
          <div className="text-[#41F20A] text-xl sm:text-2xl md:text-3xl font-extrabold tracking-[0.25em] font-heading drop-shadow-none">
            <AnimatedText
              text={eyebrowText}
              as="span"
            />
          </div>

          {/* 2. Headline Principal */}
          <AnimatedText
            as="h2"
            text={headlineText}
            className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-heading font-extrabold text-white leading-snug tracking-tight"
            initialDelayMs={150}
          />

          {/* 3. Parágrafo com trechos em destaque */}
          <AnimatedText
            as="p"
            text={paragraphText}
            highlights={paragraphHighlights}
            className="text-zinc-200 text-lg sm:text-xl md:text-2xl lg:text-3xl font-sans leading-relaxed max-w-4xl mx-auto font-medium"
            initialDelayMs={300}
          />

        </div>
      </section>

    </div>
  );
}



