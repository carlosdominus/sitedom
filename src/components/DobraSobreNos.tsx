import { useEffect, useRef, useState } from "react";

export default function DobraSobreNos() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check user preference for reduced motion
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
          if (sectionRef.current) observer.unobserve(sectionRef.current);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Bloco 1 Text (A dor)
  const block1Text =
    "A maioria das autoridades do mercado possui um conhecimento extraordinário, mas peca na falta de infraestrutura, escala comercial e previsibilidade de receita.";

  // Bloco 2 Text Parts (A virada)
  // "A Dominus nasce como o " [motor estratégico e operacional] " que assume a complexidade dos bastidores para que você foque apenas no seu " [genius zone] "."
  const block2Words = [
    { word: "A", type: "normal" },
    { word: "Dominus", type: "normal" },
    { word: "nasce", type: "normal" },
    { word: "como", type: "normal" },
    { word: "o", type: "normal" },
    { word: "motor", type: "green" },
    { word: "estratégico", type: "green" },
    { word: "e", type: "green" },
    { word: "operacional", type: "green" },
    { word: "que", type: "normal" },
    { word: "assume", type: "normal" },
    { word: "a", type: "normal" },
    { word: "complexidade", type: "normal" },
    { word: "dos", type: "normal" },
    { word: "bastidores", type: "normal" },
    { word: "para", type: "normal" },
    { word: "que", type: "normal" },
    { word: "você", type: "normal" },
    { word: "foque", type: "normal" },
    { word: "apenas", type: "normal" },
    { word: "no", type: "normal" },
    { word: "seu", type: "normal" },
    { word: "genius", type: "genius" },
    { word: "zone.", type: "genius" },
  ];

  const block1WordsList = block1Text.split(" ");

  return (
    <section
      ref={sectionRef}
      id="sobre-nos"
      className="w-full bg-[#0a0a0a] py-[clamp(80px,10vh,140px)] px-4 sm:px-6 md:px-12 relative overflow-hidden border-t border-zinc-900/80 scroll-mt-20"
    >
      {/* Subtle Static Ambient Background Glow (No grid, no mouse tracking) */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#41F20A]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* COLUNA ESQUERDA (60% / 7 cols) - Texto Principal / Tese */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Eyebrow - estilo Onde Atuamos */}
            <div className="text-[#41F20A] text-sm sm:text-base md:text-lg font-extrabold tracking-[0.25em] font-heading drop-shadow-[0_0_15px_rgba(65,242,10,0.4)] uppercase">
              SOBRE NÓS
            </div>

            {/* Bloco 1 (A Dor) */}
            <p className="text-zinc-300 text-lg sm:text-xl md:text-2xl leading-relaxed font-normal font-sans">
              {block1WordsList.map((word, idx) => {
                const delay = idx * 35;
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
            </p>

            {/* Bloco 2 (A Virada) */}
            <p className="text-white text-xl sm:text-2xl md:text-3xl lg:text-[2rem] leading-snug font-semibold font-sans pt-2">
              {block2Words.map((item, idx) => {
                const delay = (block1WordsList.length + idx) * 35;
                const isGreen = item.type === "green";
                const isGenius = item.type === "genius";

                if (isGenius) {
                  return (
                    <span
                      key={idx}
                      className="inline-block mr-[0.25em] italic text-[#41F20A] font-extrabold underline decoration-[#41F20A]/70 underline-offset-8 drop-shadow-[0_0_16px_rgba(65,242,10,0.5)] font-heading"
                      style={{
                        opacity: isVisible || prefersReducedMotion ? 1 : 0,
                        transform: isVisible || prefersReducedMotion ? "translateY(0)" : "translateY(16px)",
                        filter: isVisible || prefersReducedMotion ? "blur(0px)" : "blur(4px)",
                        transition: prefersReducedMotion
                          ? "none"
                          : `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms, filter 0.6s ease-out ${delay}ms`,
                      }}
                    >
                      {item.word}
                    </span>
                  );
                }

                if (isGreen) {
                  return (
                    <span
                      key={idx}
                      className="inline-block mr-[0.25em] text-[#41F20A] font-bold drop-shadow-[0_0_12px_rgba(65,242,10,0.4)]"
                      style={{
                        opacity: isVisible || prefersReducedMotion ? 1 : 0,
                        transform: isVisible || prefersReducedMotion ? "translateY(0)" : "translateY(16px)",
                        filter: isVisible || prefersReducedMotion ? "blur(0px)" : "blur(4px)",
                        transition: prefersReducedMotion
                          ? "none"
                          : `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms, filter 0.6s ease-out ${delay}ms`,
                      }}
                    >
                      {item.word}
                    </span>
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
                    {item.word}
                  </span>
                );
              })}
            </p>

          </div>

          {/* COLUNA DIREITA (40% / 5 cols) - Elemento Visual de Apoio */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl space-y-6">
              
              {/* Top Accent Line */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#41F20A] to-transparent" />

              {/* Subdued Logo / Brand Indicator */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
                <img
                  src="https://i.ibb.co/chkPHKnw/logo-extensa-branca.webp"
                  alt="DOMINUS"
                  className="h-4 w-auto object-contain opacity-80"
                />
                <span className="text-[10px] font-mono text-[#41F20A] tracking-widest uppercase px-2.5 py-1 rounded-full bg-[#41F20A]/10 border border-[#41F20A]/30">
                  ENGANHARIA & ESCALA
                </span>
              </div>

              {/* Big Supporting Metric & Quote */}
              <div className="space-y-3">
                <div className="text-4xl sm:text-5xl font-black font-heading tracking-tight text-white flex items-baseline gap-2">
                  <span>100%</span>
                  <span className="text-sm font-sans font-medium text-zinc-400">foco no seu Genius Zone</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                  Assumimos toda a estratégia, tecnologia, tráfego pago, cópias de Direct Response e gestão comercial para que você construa equity real.
                </p>
              </div>

              {/* Placeholder / Team Badge */}
              <div className="pt-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-[#41F20A]/40 flex items-center justify-center text-[#41F20A] font-bold font-mono text-xs shadow-[0_0_10px_rgba(65,242,10,0.2)]">
                  DR
                </div>
                <div>
                  <div className="text-xs font-bold text-white font-heading">DOMINUS COPRODUÇÃO</div>
                  <div className="text-[10px] text-zinc-500 font-mono">Infraestrutura & Direct Response</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
