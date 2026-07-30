import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { AnimatedText } from "./ui/AnimatedText";
import { LiquidMetalButton } from "./ui/liquid-metal-button";

export default function Dobra3SplitHover() {
  const [hoveredPanel, setHoveredPanel] = useState<"left" | "right" | null>(null);
  const [activeMobilePanel, setActiveMobilePanel] = useState<"left" | "right">("left");

  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  // Scroll observer on mobile: scale image smoothly when scrolled into focus
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 768) return; // Desktop handles via hover

      const viewportCenter = window.innerHeight / 2;

      if (leftPanelRef.current && rightPanelRef.current) {
        const leftRect = leftPanelRef.current.getBoundingClientRect();
        const rightRect = rightPanelRef.current.getBoundingClientRect();

        const leftDist = Math.abs(leftRect.top + leftRect.height / 2 - viewportCenter);
        const rightDist = Math.abs(rightRect.top + rightRect.height / 2 - viewportCenter);

        if (leftDist < rightDist) {
          setActiveMobilePanel("left");
        } else {
          setActiveMobilePanel("right");
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section 
      className="relative w-full bg-black overflow-hidden border-y border-white/10 scroll-mt-20"
      onMouseLeave={() => setHoveredPanel(null)}
      id="trabalhe-conosco"
    >
      {/* Container: Stacked on mobile (<768px), Flex Row full-width on Desktop (>=768px), Full screen height */}
      <div className="w-full min-h-screen flex flex-col md:flex-row h-auto md:h-screen transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
        
        {/* ================= LEFT PANEL (Recrutamento / Colaboradores) ================= */}
        <div 
          ref={leftPanelRef}
          onMouseEnter={() => setHoveredPanel("left")}
          onClick={() => {
            const el = document.getElementById("trabalhe-conosco");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className={`
            relative w-full md:w-auto min-h-[50vh] md:min-h-0 md:h-full overflow-hidden cursor-pointer
            transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
            border-b md:border-b-0 md:border-r border-white/10 group flex flex-col justify-center items-center px-6 sm:px-10 lg:px-16 text-center py-12 md:py-0
            ${
              hoveredPanel === "left" 
                ? "md:flex-[4]" 
                : hoveredPanel === "right" 
                  ? "md:flex-[1]" 
                  : "md:flex-[1]"
            }
          `}
        >
          {/* Background Image with Scroll-Driven Mobile Zoom Effect */}
          <div 
            className={`
              absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105
              ${activeMobilePanel === "left" ? "scale-110 md:scale-100" : "scale-100"}
            `}
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80')"
            }}
          />
          <div 
            className={`
              absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60 group-hover:via-black/70 transition-colors duration-500
              ${activeMobilePanel === "left" ? "via-black/65" : "via-black/80"}
            `} 
          />

          {/* Panel Content Wrapper */}
          <div className="relative z-10 max-w-xl mx-auto space-y-6 transition-all duration-500">
            {/* Title (H2) */}
            <AnimatedText
              as="h2"
              text="Uma equipe onde sua carreira cresce como juros compostos"
              highlights={["juros compostos"]}
              className={`
                font-heading font-extrabold text-white tracking-tight leading-tight transition-all duration-500
                ${hoveredPanel === "right" ? "text-xl md:text-3xl" : "text-3xl sm:text-4xl md:text-5xl lg:text-6xl"}
              `}
            />

            {/* Subtitle */}
            <AnimatedText
              as="p"
              text="Chega de gastar seu talento no mercado de ofertas descartáveis. Na Dominus, você atua nos bastidores de grandes especialistas e autoridades, desenvolvendo estratégias sólidas, escala de alto padrão e um repertório profissional que fica para a sua vida."
              className={`
                text-zinc-300 font-sans leading-relaxed max-w-md mx-auto transition-all duration-500
                ${hoveredPanel === "right" ? "opacity-40 text-xs line-clamp-2 md:line-clamp-none" : "text-sm sm:text-base md:text-lg opacity-100"}
              `}
              initialDelayMs={200}
            />

            {/* CTA Button */}
            <div className="pt-2 flex justify-center">
              <LiquidMetalButton
                href="#trabalhe-conosco"
                onClick={(e) => {
                  e?.stopPropagation();
                  const el = document.getElementById("trabalhe-conosco");
                  if (el) {
                    e?.preventDefault();
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                label="Quero fazer parte do time"
                icon={<ArrowRight size={14} className="text-[#41F20A]" />}
              />
            </div>
          </div>
        </div>

        {/* ================= RIGHT PANEL (Parceria com Autoridades de Nicho) ================= */}
        <div 
          ref={rightPanelRef}
          onMouseEnter={() => setHoveredPanel("right")}
          onClick={() => {
            const el = document.getElementById("sobre-nos");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className={`
            relative w-full md:w-auto min-h-[50vh] md:min-h-0 md:h-full overflow-hidden cursor-pointer
            transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
            group flex flex-col justify-center items-center px-6 sm:px-10 lg:px-16 text-center py-12 md:py-0
            ${
              hoveredPanel === "right" 
                ? "md:flex-[4]" 
                : hoveredPanel === "left" 
                  ? "md:flex-[1]" 
                  : "md:flex-[1]"
            }
          `}
        >
          {/* Background Image with Scroll-Driven Mobile Zoom Effect */}
          <div 
            className={`
              absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105
              ${activeMobilePanel === "right" ? "scale-110 md:scale-100" : "scale-100"}
            `}
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80')"
            }}
          />
          <div 
            className={`
              absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60 group-hover:via-black/70 transition-colors duration-500
              ${activeMobilePanel === "right" ? "via-black/65" : "via-black/80"}
            `}
          />

          {/* Panel Content Wrapper */}
          <div className="relative z-10 max-w-xl mx-auto space-y-6 transition-all duration-500">
            {/* Title (H2) */}
            <AnimatedText
              as="h2"
              text="Domine o seu mercado e multiplique seus resultados"
              highlights={["multiplique seus resultados"]}
              className={`
                font-heading font-extrabold text-white tracking-tight leading-tight transition-all duration-500
                ${hoveredPanel === "left" ? "text-xl md:text-3xl" : "text-3xl sm:text-4xl md:text-5xl lg:text-6xl"}
              `}
            />

            {/* Subtitle */}
            <AnimatedText
              as="p"
              text="Tenha uma equipe completa de bastidores cuidando do seu posicionamento, tráfego, vendas e escala enquanto você foca naquilo em que é impecável."
              className={`
                text-zinc-300 font-sans leading-relaxed max-w-md mx-auto transition-all duration-500
                ${hoveredPanel === "left" ? "opacity-40 text-xs line-clamp-2 md:line-clamp-none" : "text-sm sm:text-base md:text-lg opacity-100"}
              `}
              initialDelayMs={200}
            />

            {/* CTA Button */}
            <div className="pt-2 flex justify-center">
              <LiquidMetalButton
                href="#sobre-nos"
                onClick={(e) => {
                  e?.stopPropagation();
                  const el = document.getElementById("sobre-nos");
                  if (el) {
                    e?.preventDefault();
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                label="Quero ser parceiro"
                icon={<ArrowRight size={14} className="text-[#41F20A]" />}
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
