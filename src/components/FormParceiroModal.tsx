import React, { useState } from "react";
import { X, ChevronLeft, Check, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { LiquidMetalButton } from "./ui/liquid-metal-button";

interface FormParceiroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FormParceiroModal({ isOpen, onClose }: FormParceiroModalProps) {
  const [step, setStep] = useState<number>(1);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Form State
  const [vendasHoje, setVendasHoje] = useState<string[]>([]);
  const [faturamento, setFaturamento] = useState<string>("");
  const [investimento, setInvestimento] = useState<string>("");
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [perfil, setPerfil] = useState<string>("");

  if (!isOpen) return null;

  const totalSteps = 4;

  const toggleVendasHoje = (option: string) => {
    if (vendasHoje.includes(option)) {
      setVendasHoje(vendasHoje.filter((item) => item !== option));
    } else {
      setVendasHoje([...vendasHoje, option]);
    }
  };

  const handleNext = () => {
    if (step === 1 && vendasHoje.length === 0) return;
    if (step === 2 && !faturamento) return;
    if (step === 3 && !investimento) return;

    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!nome.trim() || !email.trim() || !whatsapp.trim() || !perfil.trim()) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setStep(1);
    setVendasHoje([]);
    setFaturamento("");
    setInvestimento("");
    setNome("");
    setEmail("");
    setWhatsapp("");
    setPerfil("");
    onClose();
  };

  const canContinue = () => {
    if (step === 1) return vendasHoje.length > 0;
    if (step === 2) return faturamento.length > 0;
    if (step === 3) return investimento.length > 0;
    if (step === 4) return nome.trim() !== "" && email.trim() !== "" && whatsapp.trim() !== "" && perfil.trim() !== "";
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300">
      
      {/* Background glow effect */}
      <div className="absolute w-[500px] h-[500px] bg-[#41F20A]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Container do Modal */}
      <div className="relative w-full max-w-lg sm:max-w-xl bg-[#090a0e] border border-zinc-800/90 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_0_120px_rgba(0,0,0,0.9)] my-auto flex flex-col min-h-[520px] justify-between z-10">
        
        {/* Top Header Navigation & Segmented Progress Bar */}
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            {step > 1 && !submitted ? (
              <button
                onClick={handleBack}
                className="w-10 h-10 rounded-full bg-[#121319] border border-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition hover:bg-zinc-800 focus:outline-none shrink-0"
                aria-label="Voltar etapa"
              >
                <ChevronLeft size={20} />
              </button>
            ) : (
              <div className="w-10 h-10 shrink-0" />
            )}

            {/* Segmented Progress Bar */}
            {!submitted && (
              <div className="flex items-center gap-2 flex-1 max-w-[200px] mx-auto">
                {Array.from({ length: totalSteps }).map((_, idx) => {
                  const currentIdx = idx + 1;
                  const isCompleted = currentIdx < step;
                  const isActive = currentIdx === step;

                  return (
                    <div
                      key={idx}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        isActive
                          ? "bg-[#41F20A] shadow-[0_0_12px_rgba(65,242,10,0.6)]"
                          : isCompleted
                          ? "bg-[#41F20A]/60"
                          : "bg-zinc-800/80"
                      }`}
                    />
                  );
                })}
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-[#121319] border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition hover:bg-zinc-800 focus:outline-none shrink-0"
              aria-label="Fechar formulário"
            >
              <X size={20} />
            </button>
          </div>

          {/* Conteúdo por Etapa */}
          {submitted ? (
            /* Estado de Sucesso */
            <div className="py-10 text-center space-y-6 my-auto">
              <div className="w-20 h-20 rounded-full bg-[#41F20A]/10 border border-[#41F20A]/40 flex items-center justify-center text-[#41F20A] mx-auto shadow-[0_0_35px_rgba(65,242,10,0.35)]">
                <CheckCircle2 size={44} />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                  Análise Solicitada!
                </h3>
                <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-md mx-auto leading-relaxed">
                  Avaliamos suas respostas e nossa equipe de coprodução entrará em contato via WhatsApp.
                </p>
              </div>

              <div className="pt-4 flex justify-center">
                <LiquidMetalButton
                  label="VOLTAR AO SITE"
                  icon={<ArrowLeft size={14} className="text-[#41F20A]" />}
                  onClick={handleReset}
                  width={220}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6 pt-2">
              
              {/* ETAPA 1 */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
                      Como você vende hoje?
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400 font-sans">
                      Selecione todas as opções que se aplicam
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      "Lançamento (webinar/evento)",
                      "Venda manual (DM, WhatsApp, indicação)",
                      "Já tenho um funil/página rodando",
                      "Ainda não vendo, só tenho conteúdo/audiência"
                    ].map((option) => {
                      const isSelected = vendasHoje.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleVendasHoje(option)}
                          className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 ${
                            isSelected
                              ? "bg-[#181922] border-[#41F20A] text-white shadow-[0_0_20px_rgba(65,242,10,0.18)]"
                              : "bg-[#121319] border-zinc-800/80 text-zinc-300 hover:bg-[#171822] hover:border-zinc-700"
                          }`}
                        >
                          <span className="text-sm font-medium pr-4">{option}</span>
                          <div
                            className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                              isSelected
                                ? "bg-[#41F20A] border-[#41F20A] text-black shadow-[0_0_10px_rgba(65,242,10,0.6)]"
                                : "border-zinc-600 bg-zinc-950/80"
                            }`}
                          >
                            {isSelected && <Check size={14} strokeWidth={3} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ETAPA 2 */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
                      Qual seu faturamento mensal atual?
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400 font-sans">
                      Selecione a faixa média do seu projeto
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      "Ainda não faturo",
                      "Até R$20.000",
                      "R$20 mil a R$100 mil/mês",
                      "Acima de R$ 100 mil/mês"
                    ].map((option) => {
                      const isSelected = faturamento === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setFaturamento(option)}
                          className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 ${
                            isSelected
                              ? "bg-[#181922] border-[#41F20A] text-white shadow-[0_0_20px_rgba(65,242,10,0.18)]"
                              : "bg-[#121319] border-zinc-800/80 text-zinc-300 hover:bg-[#171822] hover:border-zinc-700"
                          }`}
                        >
                          <span className="text-sm font-medium pr-4">{option}</span>
                          <div
                            className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                              isSelected
                                ? "bg-[#41F20A] border-[#41F20A] text-black shadow-[0_0_10px_rgba(65,242,10,0.6)]"
                                : "border-zinc-600 bg-zinc-950/80"
                            }`}
                          >
                            {isSelected && <Check size={14} strokeWidth={3} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ETAPA 3 */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
                  <div className="space-y-1">
                    <h2 className="text-lg sm:text-2xl font-bold font-heading text-white tracking-tight leading-snug">
                      Você está disposto a investir tempo e dinheiro em uma estrutura capaz de gerar + R$100.000 de LUCRO por mês?
                    </h2>
                  </div>

                  <div className="space-y-3 pt-2">
                    {["SIM", "NÃO"].map((option) => {
                      const isSelected = investimento === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setInvestimento(option)}
                          className={`w-full p-4.5 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 ${
                            isSelected
                              ? "bg-[#181922] border-[#41F20A] text-white shadow-[0_0_20px_rgba(65,242,10,0.18)]"
                              : "bg-[#121319] border-zinc-800/80 text-zinc-300 hover:bg-[#171822] hover:border-zinc-700"
                          }`}
                        >
                          <span className="text-base font-bold tracking-wider">{option}</span>
                          <div
                            className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                              isSelected
                                ? "bg-[#41F20A] border-[#41F20A] text-black shadow-[0_0_10px_rgba(65,242,10,0.6)]"
                                : "border-zinc-600 bg-zinc-950/80"
                            }`}
                          >
                            {isSelected && <Check size={14} strokeWidth={3} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ETAPA 4 - DADOS FINAIS */}
              {step === 4 && (
                <form id="parceiro-form" onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
                      Quero Ser Parceiro
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400 font-sans">
                      Preencha seus dados para finalizarmos sua análise estratégica
                    </p>
                  </div>

                  <div className="space-y-3.5 pt-1">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase tracking-wider">
                        Nome do Especialista / Autoridade *
                      </label>
                      <input
                        type="text"
                        required
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Seu nome completo"
                        className="w-full bg-[#121319] border border-zinc-800/90 focus:border-[#41F20A] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#41F20A] transition"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase tracking-wider">
                          E-mail de Contato *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="seu.email@exemplo.com"
                          className="w-full bg-[#121319] border border-zinc-800/90 focus:border-[#41F20A] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#41F20A] transition"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase tracking-wider">
                          WhatsApp (com DDD) *
                        </label>
                        <input
                          type="tel"
                          required
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          placeholder="(11) 99999-9999"
                          className="w-full bg-[#121319] border border-zinc-800/90 focus:border-[#41F20A] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#41F20A] transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 font-semibold uppercase tracking-wider">
                        Link do Perfil Principal (Instagram/YouTube) *
                      </label>
                      <input
                        type="url"
                        required
                        value={perfil}
                        onChange={(e) => setPerfil(e.target.value)}
                        placeholder="https://instagram.com/seu.perfil"
                        className="w-full bg-[#121319] border border-zinc-800/90 focus:border-[#41F20A] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#41F20A] transition"
                      />
                    </div>
                  </div>
                </form>
              )}

            </div>
          )}
        </div>

        {/* Bottom CTA Button with Liquid Metal Pill */}
        {!submitted && (
          <div className="pt-6 mt-6 border-t border-zinc-900/80 flex justify-center">
            {step < totalSteps ? (
              <div className={!canContinue() ? "opacity-50 pointer-events-none transition" : "transition"}>
                <LiquidMetalButton
                  label="CONTINUAR"
                  icon={<ArrowRight size={14} className="text-[#41F20A]" />}
                  onClick={handleNext}
                  width={280}
                />
              </div>
            ) : (
              <div className={!canContinue() ? "opacity-50 pointer-events-none transition" : "transition"}>
                <LiquidMetalButton
                  label="ENVIAR ANÁLISE DE PARCERIA"
                  icon={<ArrowRight size={14} className="text-[#41F20A]" />}
                  onClick={handleSubmit}
                  width={340}
                />
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
