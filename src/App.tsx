import { useState, useEffect } from "react";
import { Mail } from "lucide-react";

import Dobra1Hero from "./components/Dobra1Hero";
import Dobra2VSL from "./components/Dobra2VSL";
import DobraSobreNos from "./components/DobraSobreNos";
import Dobra3SplitHover from "./components/Dobra3SplitHover";
import Dobra8WavingFlag from "./components/Dobra8WavingFlag";
import Footer from "./components/Footer";
import FormTimeModal from "./components/FormTimeModal";
import FormParceiroModal from "./components/FormParceiroModal";

export default function App() {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [activeFormModal, setActiveFormModal] = useState<"time" | "parceiro" | null>(null);

  // Sync hash routing for forms (#form-time and #form-parceiro)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#form-time") {
        setActiveFormModal("time");
      } else if (hash === "#form-parceiro") {
        setActiveFormModal("parceiro");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

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

  const openFormTime = () => {
    setActiveFormModal("time");
    window.history.pushState(null, "", "#form-time");
  };

  const openFormParceiro = () => {
    setActiveFormModal("parceiro");
    window.history.pushState(null, "", "#form-parceiro");
  };

  const closeModal = () => {
    setActiveFormModal(null);
    if (window.location.hash === "#form-time" || window.location.hash === "#form-parceiro") {
      window.history.pushState(null, "", window.location.pathname);
    }
  };

  const navLinks = [
    { label: "Onde atuamos", href: "#onde-atuamos" },
    { label: "Trabalhe conosco", href: "#trabalhe-conosco" },
    { label: "Sobre nós", href: "#sobre-nos" },
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white">
      
      {/* iOS Style Glass Floating Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 pt-2 sm:pt-4 pb-2 transition-all duration-300">
        <header 
          className={`max-w-6xl mx-auto rounded-2xl sm:rounded-full transition-all duration-500 ${
            scrolled 
              ? "bg-black/40 backdrop-blur-md border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-2 sm:py-2.5 px-4 sm:px-6" 
              : "bg-transparent border border-transparent py-2 sm:py-4 px-4 sm:px-8"
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

        {/* 2nd dob - Onde Atuamos */}
        <section id="onde-atuamos" className="scroll-mt-20 py-2 sm:py-6 md:py-12 bg-black relative">
          <Dobra2VSL />
        </section>

        {/* 3rd dob - Full-Width Hover Split Screen (Trabalhe Conosco / Colaboradores vs Autoridades) */}
        <Dobra3SplitHover 
          onOpenFormTime={openFormTime}
          onOpenFormParceiro={openFormParceiro}
        />

        {/* 4th dob - Sobre Nós Section */}
        <DobraSobreNos />

        {/* 5th dob - Interactive Waving Flag */}
        <Dobra8WavingFlag />

      </main>

      {/* Modern Dark Mode Footer */}
      <Footer 
        onOpenFormTime={openFormTime}
        onOpenFormParceiro={openFormParceiro}
      />

      {/* Modals para os Formulários */}
      <FormTimeModal 
        isOpen={activeFormModal === "time"} 
        onClose={closeModal} 
      />

      <FormParceiroModal 
        isOpen={activeFormModal === "parceiro"} 
        onClose={closeModal} 
      />

    </div>
  );
}
