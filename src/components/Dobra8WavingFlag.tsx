import { useEffect, useRef, useState } from "react";

export default function Dobra8WavingFlag() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isInteracting, setIsInteracting] = useState(false);
  const [textureLoaded, setTextureLoaded] = useState(false);

  // Interaction coordinates and strength
  const pointerRef = useRef({
    x: -1000,
    y: -1000,
    active: false,
    strength: 0,
    targetStrength: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;

    // Grid resolution (36 cols, 24 rows)
    const COLS = 36;
    const ROWS = 22;

    // Offscreen canvas for the flag texture
    const textureCanvas = document.createElement("canvas");
    const texCtx = textureCanvas.getContext("2d");
    
    const TEX_WIDTH = 1400;
    const TEX_HEIGHT = 800;
    textureCanvas.width = TEX_WIDTH;
    textureCanvas.height = TEX_HEIGHT;

    // Function to render the flag texture on offscreen canvas
    const createFlagTexture = (logoImg?: HTMLImageElement) => {
      if (!texCtx) return;

      // Dark silk/satin luxury background gradient
      const bgGrad = texCtx.createLinearGradient(0, 0, TEX_WIDTH, TEX_HEIGHT);
      bgGrad.addColorStop(0, "#080808");
      bgGrad.addColorStop(0.5, "#121212");
      bgGrad.addColorStop(1, "#0a0a0a");
      texCtx.fillStyle = bgGrad;
      texCtx.fillRect(0, 0, TEX_WIDTH, TEX_HEIGHT);

      // Subtle diagonal carbon weave lines
      texCtx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      texCtx.lineWidth = 1;
      for (let i = -TEX_HEIGHT; i < TEX_WIDTH; i += 24) {
        texCtx.beginPath();
        texCtx.moveTo(i, 0);
        texCtx.lineTo(i + TEX_HEIGHT, TEX_HEIGHT);
        texCtx.stroke();
      }

      // Flag top & bottom neon green subtle border stroke
      texCtx.strokeStyle = "#41F20A";
      texCtx.lineWidth = 8;
      texCtx.shadowColor = "#41F20A";
      texCtx.shadowBlur = 16;

      texCtx.beginPath();
      texCtx.moveTo(0, 4);
      texCtx.lineTo(TEX_WIDTH, 4);
      texCtx.moveTo(0, TEX_HEIGHT - 4);
      texCtx.lineTo(TEX_WIDTH, TEX_HEIGHT - 4);
      texCtx.stroke();
      texCtx.shadowBlur = 0; // Reset shadow

      // Center decorative watermark / glow
      const radialGlow = texCtx.createRadialGradient(
        TEX_WIDTH / 2, TEX_HEIGHT / 2, 80,
        TEX_WIDTH / 2, TEX_HEIGHT / 2, 500
      );
      radialGlow.addColorStop(0, "rgba(65, 242, 10, 0.15)");
      radialGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      texCtx.fillStyle = radialGlow;
      texCtx.fillRect(0, 0, TEX_WIDTH, TEX_HEIGHT);

      // Draw company logo if loaded, or draw stylized vector DOMINUS logo
      if (logoImg && logoImg.complete && logoImg.naturalWidth > 0) {
        const logoAspect = logoImg.naturalWidth / logoImg.naturalHeight;
        const targetWidth = 780;
        const targetHeight = targetWidth / logoAspect;
        const x = (TEX_WIDTH - targetWidth) / 2;
        const y = (TEX_HEIGHT - targetHeight) / 2;
        
        // Glow effect behind white logo
        texCtx.shadowColor = "rgba(65, 242, 10, 0.6)";
        texCtx.shadowBlur = 35;
        texCtx.drawImage(logoImg, x, y, targetWidth, targetHeight);
        texCtx.shadowBlur = 0;
      } else {
        // Fallback DOMINUS text logo
        texCtx.fillStyle = "#FFFFFF";
        texCtx.font = "900 96px 'Plus Jakarta Sans', sans-serif";
        texCtx.textAlign = "center";
        texCtx.textBaseline = "middle";
        texCtx.letterSpacing = "8px";
        texCtx.fillText("DOMINUS", TEX_WIDTH / 2, TEX_HEIGHT / 2 - 25);

        texCtx.fillStyle = "#41F20A";
        texCtx.font = "700 24px 'Plus Jakarta Sans', sans-serif";
        texCtx.letterSpacing = "10px";
        texCtx.fillText("ENGENHARIA DE ESCALA", TEX_WIDTH / 2, TEX_HEIGHT / 2 + 55);
      }

      // Small brand tagline in top right corner of flag
      texCtx.fillStyle = "rgba(255, 255, 255, 0.4)";
      texCtx.font = "600 16px monospace";
      texCtx.textAlign = "right";
      texCtx.fillText("DIRECT RESPONSE • COPRODUÇÃO", TEX_WIDTH - 40, 45);

      setTextureLoaded(true);
    };

    // Load company logo image
    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    logoImg.src = "https://i.ibb.co/chkPHKnw/logo-extensa-branca.webp";
    logoImg.onload = () => createFlagTexture(logoImg);
    logoImg.onerror = () => createFlagTexture(); // Fallback if blocked
    createFlagTexture(); // Initial draw with vector text

    // Grid vertices structure
    interface Vertex {
      baseX: number;
      baseY: number;
      x: number;
      y: number;
      u: number;
      v: number;
      pin: number; // 0 at flagpole (left), 1 at free end (right)
    }

    let width = 0;
    let height = 0;
    let grid: Vertex[][] = [];

    // Pole dimensions
    const POLE_WIDTH = 12;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      
      width = rect.width;
      // Full screen aspect scale for flag
      height = Math.min(rect.width * 0.55, 760);
      if (width < 640) {
        height = Math.min(rect.width * 0.68, 480);
      }

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // Build grid mesh
      const flagMarginLeft = POLE_WIDTH + 24;
      const flagMarginTop = 35;
      const flagWidth = width - flagMarginLeft - 30;
      const flagHeight = height - flagMarginTop * 2;

      grid = [];
      for (let r = 0; r <= ROWS; r++) {
        const rowArr: Vertex[] = [];
        const v = r / ROWS;
        const baseY = flagMarginTop + v * flagHeight;

        for (let c = 0; c <= COLS; c++) {
          const u = c / COLS;
          const baseX = flagMarginLeft + u * flagWidth;

          // Pin factor: 0 at c=0 (flagpole), ramping up quickly to 1.0
          // Makes the left edge tightly pinned to the pole rings
          const pin = Math.pow(u, 1.15);

          rowArr.push({
            baseX,
            baseY,
            x: baseX,
            y: baseY,
            u: u * TEX_WIDTH,
            v: v * TEX_HEIGHT,
            pin,
          });
        }
        grid.push(rowArr);
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    // Helper function to draw a single textured triangle on 2D Canvas using affine matrix
    const drawTexturedTriangle = (
      p0: { x: number; y: number },
      p1: { x: number; y: number },
      p2: { x: number; y: number },
      t0: { u: number; v: number },
      t1: { u: number; v: number },
      t2: { u: number; v: number },
      lightFactor: number
    ) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.closePath();
      ctx.clip();

      const delta = t0.u * (t1.v - t2.v) - t1.u * (t0.v - t2.v) + t2.u * (t0.v - t1.v);
      if (Math.abs(delta) > 0.0001) {
        const a = (p0.x * (t1.v - t2.v) - p1.x * (t0.v - t2.v) + p2.x * (t0.v - t1.v)) / delta;
        const b = (t0.u * (p1.x - p2.x) - t1.u * (p0.x - p2.x) + t2.u * (p0.x - p1.x)) / delta;
        const c = p0.x - a * t0.u - b * t0.v;

        const d = (p0.y * (t1.v - t2.v) - p1.y * (t0.v - t2.v) + p2.y * (t0.v - t1.v)) / delta;
        const e = (t0.u * (p1.y - p2.y) - t1.u * (p0.y - p2.y) + t2.u * (p0.y - p1.y)) / delta;
        const f = p0.y - d * t0.u - e * t0.v;

        ctx.transform(a, d, b, e, c, f);
        ctx.drawImage(textureCanvas, 0, 0);
      }

      ctx.restore();

      // Apply cloth fold lighting / shadow overlay
      if (Math.abs(lightFactor) > 0.01) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();
        
        if (lightFactor > 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.25, lightFactor * 0.35)})`;
        } else {
          ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.45, -lightFactor * 0.5)})`;
        }
        ctx.fill();
        ctx.restore();
      }
    };

    // Animation Loop
    let animId: number;
    let startTime = performance.now();

    const render = (now: number) => {
      const time = (now - startTime) * 0.001; // in seconds

      ctx.clearRect(0, 0, width, height);

      // Smooth interpolation for pointer interaction strength
      const ptr = pointerRef.current;
      ptr.strength += (ptr.targetStrength - ptr.strength) * 0.08;

      // 1. UPDATE GRID VERTICES
      for (let r = 0; r <= ROWS; r++) {
        for (let c = 0; c <= COLS; c++) {
          const pt = grid[r][c];
          const pin = pt.pin;

          // Continuous Primary Sine Wave (wind motion)
          const primaryWave = Math.sin(c * 0.22 - time * 3.8) * 16 * pin;
          
          // Secondary harmonic wave (vertical ripple & diagonal flutter)
          const secondaryWave = Math.sin(c * 0.12 + r * 0.18 - time * 2.2) * 8 * pin;
          
          // Slight horizontal wave motion
          const horizWave = Math.cos(c * 0.2 - time * 2.5) * 6 * pin;

          let interactOffset = 0;

          // Localized interaction ripple from mouse / touch
          if (ptr.strength > 0.001) {
            const dx = pt.baseX - ptr.x;
            const dy = pt.baseY - ptr.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const radius = 180; // interaction influence radius in px

            if (dist < radius) {
              const normDist = dist / radius;
              // Impact ripple propagating outwards
              const ripple = Math.sin(normDist * Math.PI * 3.0 - time * 8) * (1 - normDist);
              interactOffset = ripple * 32 * pin * ptr.strength;
            }
          }

          pt.x = pt.baseX + horizWave;
          pt.y = pt.baseY + primaryWave + secondaryWave + interactOffset;
        }
      }

      // 2. DRAW MESH TRIANGLES
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const p00 = grid[r][c];
          const p10 = grid[r][c + 1];
          const p11 = grid[r + 1][c + 1];
          const p01 = grid[r + 1][c];

          // Calculate cell slope/gradient for cloth lighting calculation
          const dy = p10.y - p00.y;
          const dx = p10.x - p00.x;
          const slope = dx !== 0 ? dy / dx : 0;
          const lightFactor = slope * 0.8; // positive = highlight, negative = shadow

          // Triangle 1: (p00, p10, p01)
          drawTexturedTriangle(
            { x: p00.x, y: p00.y },
            { x: p10.x, y: p10.y },
            { x: p01.x, y: p01.y },
            { u: p00.u, v: p00.v },
            { u: p10.u, v: p10.v },
            { u: p01.u, v: p01.v },
            lightFactor
          );

          // Triangle 2: (p10, p11, p01)
          drawTexturedTriangle(
            { x: p10.x, y: p10.y },
            { x: p11.x, y: p11.y },
            { x: p01.x, y: p01.y },
            { u: p10.u, v: p10.v },
            { u: p11.u, v: p11.v },
            { u: p01.u, v: p01.v },
            lightFactor
          );
        }
      }

      // 3. DRAW FLAGPOLE (MASTRO) ON THE LEFT
      const poleX = POLE_WIDTH + 6;
      const poleTop = 15;
      const poleBottom = height - 15;

      // Metallic flagpole gradient
      const poleGrad = ctx.createLinearGradient(poleX - POLE_WIDTH, 0, poleX, 0);
      poleGrad.addColorStop(0, "#1a1a1a");
      poleGrad.addColorStop(0.3, "#666666");
      poleGrad.addColorStop(0.6, "#ffffff");
      poleGrad.addColorStop(0.9, "#333333");
      poleGrad.addColorStop(1, "#0d0d0d");

      ctx.fillStyle = poleGrad;
      ctx.beginPath();
      ctx.roundRect(poleX - POLE_WIDTH, poleTop, POLE_WIDTH, poleBottom - poleTop, 4);
      ctx.fill();

      // Metallic top cap/sphere on flagpole
      const capGrad = ctx.createRadialGradient(poleX - 6, poleTop - 2, 2, poleX - 4, poleTop, 10);
      capGrad.addColorStop(0, "#ffffff");
      capGrad.addColorStop(0.4, "#41F20A");
      capGrad.addColorStop(1, "#113300");
      ctx.fillStyle = capGrad;
      ctx.beginPath();
      ctx.arc(poleX - POLE_WIDTH / 2, poleTop - 2, 8, 0, Math.PI * 2);
      ctx.fill();

      // Flag attachment rings on flagpole (top & bottom)
      ctx.fillStyle = "#888888";
      const topRingY = grid[0][0].y;
      const bottomRingY = grid[ROWS][0].y;

      ctx.beginPath();
      ctx.arc(poleX - POLE_WIDTH / 2, topRingY, 4, 0, Math.PI * 2);
      ctx.arc(poleX - POLE_WIDTH / 2, bottomRingY, 4, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, []);

  // Event handlers for mouse & touch interaction
  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    pointerRef.current.x = x;
    pointerRef.current.y = y;
    pointerRef.current.targetStrength = 1.0;
    setIsInteracting(true);
  };

  const handlePointerLeave = () => {
    pointerRef.current.targetStrength = 0;
    setIsInteracting(false);
  };

  return (
    <section className="relative w-full bg-black py-20 px-4 border-t border-zinc-900/80 overflow-hidden" id="bandeira-interativa">
      {/* Background ambient green glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] max-w-[750px] h-[350px] bg-[#41F20A]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-full mx-auto space-y-10 relative z-10 px-2 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white font-heading">
            O Movimento Não Para
          </h2>
          
          <p className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed max-w-4xl mx-auto font-sans font-medium">
            Não hasteamos bandeira por vaidade.<br className="hidden sm:block" /> Hasteamos para dizer que este terreno é nosso.
          </p>
        </div>

        {/* Waving Flag Canvas Stage (Full screen wide, no container box) */}
        <div 
          ref={containerRef}
          className="relative w-full max-w-7xl mx-auto flex justify-center items-center cursor-grab active:cursor-grabbing select-none my-4"
          onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
          onMouseLeave={handlePointerLeave}
          onTouchStart={(e) => {
            if (e.touches.length > 0) {
              handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          onTouchMove={(e) => {
            if (e.touches.length > 0) {
              handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          onTouchEnd={handlePointerLeave}
        >
          <canvas 
            ref={canvasRef} 
            className="block w-full max-w-full drop-shadow-[0_25px_50px_rgba(0,0,0,0.95)]"
          />
        </div>

      </div>
    </section>
  );
}
