import { useState, useEffect } from "react";
import { Mail } from "lucide-react";

import Dobra1Hero from "./components/Dobra1Hero";
import Dobra2VSL from "./components/Dobra2VSL";
import Dobra3SplitHover from "./components/Dobra3SplitHover";
import Dobra8WavingFlag from "./components/Dobra8WavingFlag";

export default function App() {
  const [scrolled, setScrolled] = useState<boolean>(false);

  // Monitor scroll state for some header dynamic opacity adjustments
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Onde atuamos", href: "#onde-atuamos" },
    { label: "Sobre nós", href: "#faturamento" },
    { label: "Trabalhe conosco", href: "#trabalhe-conosco" },
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white">
      
      {/* iOS Style Glass Floating Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 pt-3 sm:pt-4 pb-2 transition-all duration-300">
        <header 
          className={`max-w-6xl mx-auto rounded-2xl sm:rounded-full border transition-all duration-500 ${
            scrolled 
              ? "bg-black/85 backdrop-blur-xl border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.9)] py-2 sm:py-2.5 px-4 sm:px-6" 
              : "bg-black/40 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border-white/5 sm:border-transparent py-2.5 sm:py-4 px-4 sm:px-8"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
            
            {/* DOMINUS White Premium Logo - Centered on mobile */}
            <a href="#faturamento" className="flex items-center justify-center transition">
              <img 
                src="https://i.ibb.co/chkPHKnw/logo-extensa-branca.webp" 
                alt="DOMINUS" 
                referrerPolicy="no-referrer"
                className="h-5 sm:h-7 w-auto object-contain brightness-105 active:scale-95 transition-transform"
              />
            </a>

            {/* Anchor links list - Underneath logo on mobile, right-aligned on desktop */}
            <nav className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[11px] sm:text-xs md:text-sm font-sans font-semibold text-[#F1F1F1]/80 hover:text-white uppercase tracking-wider transition-colors duration-200 cursor-pointer whitespace-nowrap"
                >
                  {link.label}
                </a>
              ))}
            </nav>

          </div>
        </header>
      </div>

      {/* Main Continuous Canvas Stage */}
      <main className="relative pt-0">
        
        {/* Glow Effects backdrop layout */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-zinc-900/20 rounded-full blur-[160px] pointer-events-none" />
        
        {/* 1st dob - Faturamento / Intro */}
        <section 
          id="faturamento" 
          className="scroll-mt-28 pt-24 pb-12 md:pt-32 md:pb-20 bg-cover bg-center bg-no-repeat relative"
          style={{
            backgroundImage: "linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 60%, rgba(0, 0, 0, 1) 100%), url('https://dominus.site/slides/mariana/img/bk.png')"
          }}
        >
          {/* Subtle glow underneath */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70vw] h-[40vh] bg-[#1B4D3E]/10 rounded-full blur-[130px] pointer-events-none" />
          
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <Dobra1Hero
              onNext={() => document.getElementById("onde-atuamos")?.scrollIntoView({ behavior: "smooth" })}
            />
          </div>
          
          {/* Bottom gradient transition into Dobra 2 */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-black pointer-events-none" />
        </section>

        {/* 2nd dob - Onde Atuamos (Pure black background with generous spacing and gradient glow) */}
        <section id="onde-atuamos" className="scroll-mt-28 py-8 md:py-16 bg-black relative">
          <Dobra2VSL />
        </section>

        {/* 3rd dob - Full-Width Hover Split Screen (Colaboradores vs Autoridades) */}
        <Dobra3SplitHover />

        {/* 4th dob - Interactive Waving Flag */}
        <Dobra8WavingFlag />

      </main>

      {/* Elegant CTA Footer bar */}
      <footer className="bg-black border-t border-zinc-900/80 py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-3">
            <img 
              src="https://i.ibb.co/chkPHKnw/logo-extensa-branca.webp" 
              alt="DOMINUS" 
              referrerPolicy="no-referrer"
              className="h-5 w-auto object-contain brightness-95"
            />
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mt-3 font-sans">
              Engenharia estratégica de funis de Direct Response e coprodução premium para grandes autoridades digitais.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-wildest">Metas da Parceria</h4>
            <ul className="text-xs text-zinc-400 space-y-1.5 font-medium font-sans">
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 bg-[#41F20A] rounded-full" />
                Dobra dos ganhos mensais de forma imediata via Upsell
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 bg-[#41F20A] rounded-full" />
                Escala de 10x na entrega orgânica através de ganchos de 3s
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 bg-[#41F20A] rounded-full" />
                Estruturação do roteiro VSL de alta conversão
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-wildest">Contato Direto</h4>
            <div className="space-y-2">
              <a 
                href="mailto:contacto@dominus.site" 
                className="flex items-center gap-2 text-xs text-zinc-300 hover:text-white transition font-sans"
              >
                <Mail size={13} className="text-[#41F20A]" />
                <span>contacto@dominus.site</span>
              </a>
              <div className="text-[10px] text-zinc-500 font-mono">
                Planejado e executado por Gilberto & Felipe
              </div>
            </div>
          </div>

        </div>

        <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-zinc-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] text-zinc-500 font-mono uppercase tracking-widest">
          <span>© 1026 COPRODUÇÃO DOMINUS • TODOS OS DIREITOS RESERVADOS</span>
          <span>ESTATÍSTICAS VALIDADAS EM MARKETPLACE DR</span>
        </div>
      </footer>

    </div>
  );
}
