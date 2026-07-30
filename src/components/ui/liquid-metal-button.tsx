import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import { Sparkles } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

export interface LiquidMetalButtonProps {
  label?: string;
  onClick?: (e?: React.MouseEvent) => void;
  href?: string;
  viewMode?: "text" | "icon";
  icon?: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  width?: number;
}

export function LiquidMetalButton({
  label = "Get Started",
  onClick,
  href,
  viewMode = "text",
  icon,
  className = "",
  target,
  rel,
  width: customWidth,
}: LiquidMetalButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);
  const shaderRef = useRef<HTMLDivElement>(null);
  const shaderMount = useRef<any>(null);
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const rippleId = useRef(0);

  const calculatedWidth = useMemo(() => {
    if (customWidth) return customWidth;
    if (viewMode === "icon") return 48;
    // Calculate based on label length to avoid truncation
    const estimated = label.length * 9.5 + 56;
    return Math.max(160, Math.min(480, Math.round(estimated)));
  }, [customWidth, viewMode, label]);

  const dimensions = useMemo(() => {
    if (viewMode === "icon") {
      return {
        width: 48,
        height: 48,
        innerWidth: 44,
        innerHeight: 44,
        shaderWidth: 48,
        shaderHeight: 48,
      };
    } else {
      return {
        width: calculatedWidth,
        height: 48,
        innerWidth: calculatedWidth - 4,
        innerHeight: 44,
        shaderWidth: calculatedWidth,
        shaderHeight: 48,
      };
    }
  }, [viewMode, calculatedWidth]);

  useEffect(() => {
    const styleId = "shader-canvas-style-exploded";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .shader-container-exploded canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          border-radius: 100px !important;
        }
        @keyframes ripple-animation {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const loadShader = async () => {
      try {
        if (shaderRef.current) {
          if (shaderMount.current?.destroy) {
            shaderMount.current.destroy();
            shaderMount.current = null;
          }

          // Clear any existing canvas elements to prevent duplicate or stale canvas
          shaderRef.current.innerHTML = "";

          const mount = new ShaderMount(
            shaderRef.current,
            liquidMetalFragmentShader,
            {
              u_repetition: 4,
              u_softness: 0.5,
              u_shiftRed: 0.25,
              u_shiftBlue: 0.35,
              u_distortion: 0.05,
              u_contour: 0,
              u_angle: 45,
              u_scale: 6,
              u_shape: 0, // 0 = full rectangle shader fill, clipped by container's border-radius: 100px
              u_offsetX: 0.1,
              u_offsetY: -0.1,
            },
            undefined,
            0.6
          );
          shaderMount.current = mount;
        }
      } catch (error) {
        console.error("Failed to load liquid metal shader:", error);
      }
    };

    // Timeout ensures DOM layout is updated before ShaderMount measures element width
    const timer = setTimeout(() => {
      loadShader();
    }, 30);

    return () => {
      clearTimeout(timer);
      if (shaderMount.current?.destroy) {
        shaderMount.current.destroy();
        shaderMount.current = null;
      }
    };
  }, [dimensions.shaderWidth, dimensions.shaderHeight, label]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    shaderMount.current?.setSpeed?.(1.2);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    shaderMount.current?.setSpeed?.(0.6);
  };

  const handleClick = (e: React.MouseEvent<any>) => {
    if (shaderMount.current?.setSpeed) {
      shaderMount.current.setSpeed(2.4);
      setTimeout(() => {
        if (isHovered) {
          shaderMount.current?.setSpeed?.(1.2);
        } else {
          shaderMount.current?.setSpeed?.(0.6);
        }
      }, 300);
    }

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = { x, y, id: rippleId.current++ };

      setRipples((prev) => [...prev, ripple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 600);
    }

    onClick?.(e);
  };

  const Element = href ? "a" : "button";

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        style={{
          perspective: "1000px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        <div
          style={{
            position: "relative",
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            transformStyle: "preserve-3d",
            transition:
              "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease",
            transform: "none",
          }}
        >
          {/* Label / Icon Overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transformStyle: "preserve-3d",
              transition:
                "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease, gap 0.4s ease",
              transform: "translateZ(20px)",
              zIndex: 30,
              pointerEvents: "none",
            }}
          >
            {viewMode === "icon" && (
              icon || <Sparkles size={18} className="text-[#41F20A] drop-shadow-[0_1px_4px_rgba(65,242,10,0.5)]" />
            )}
            {viewMode === "text" && (
              <>
                <span
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: isHovered ? "#FFFFFF" : "#41F20A",
                    fontWeight: 800,
                    textShadow: "0px 1px 3px rgba(0, 0, 0, 0.8), 0px 0px 8px rgba(65, 242, 10, 0.3)",
                    transition: "all 0.3s ease",
                    transform: "scale(1)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
                {icon}
              </>
            )}
          </div>

          {/* Inner dark capsule background */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              transformStyle: "preserve-3d",
              transition:
                "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease",
              transform: `translateZ(10px) ${
                isPressed ? "translateY(1px) scale(0.98)" : "translateY(0) scale(1)"
              }`,
              zIndex: 20,
            }}
          >
            <div
              style={{
                width: `${dimensions.innerWidth}px`,
                height: `${dimensions.innerHeight}px`,
                margin: "2px",
                borderRadius: "100px",
                background: isHovered
                  ? "linear-gradient(180deg, #182810 0%, #050a02 100%)"
                  : "linear-gradient(180deg, #181818 0%, #020202 100%)",
                border: "1px solid rgba(65, 242, 10, 0.3)",
                boxShadow: isPressed
                  ? "inset 0px 2px 4px rgba(0, 0, 0, 0.6)"
                  : isHovered
                  ? "0 0 15px rgba(65, 242, 10, 0.25)"
                  : "none",
                transition:
                  "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease, box-shadow 0.2s ease",
              }}
            />
          </div>

          {/* Outer shader canvas container */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              transformStyle: "preserve-3d",
              transition:
                "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease",
              transform: `translateZ(0px) ${
                isPressed ? "translateY(1px) scale(0.98)" : "translateY(0) scale(1)"
              }`,
              zIndex: 10,
            }}
          >
            <div
              style={{
                height: `${dimensions.height}px`,
                width: `${dimensions.width}px`,
                borderRadius: "100px",
                boxShadow: isPressed
                  ? "0px 0px 0px 1px rgba(65, 242, 10, 0.5), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)"
                  : isHovered
                  ? "0px 0px 0px 1px rgba(65, 242, 10, 0.6), 0px 12px 16px 0px rgba(65, 242, 10, 0.15)"
                  : "0px 0px 0px 1px rgba(255, 255, 255, 0.15), 0px 9px 9px 0px rgba(0, 0, 0, 0.3)",
                transition:
                  "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease, box-shadow 0.2s ease",
                background: "rgb(0 0 0 / 0)",
              }}
            >
              <div
                ref={shaderRef}
                className="shader-container-exploded"
                style={{
                  borderRadius: "100px",
                  overflow: "hidden",
                  position: "relative",
                  width: `${dimensions.shaderWidth}px`,
                  maxWidth: `${dimensions.shaderWidth}px`,
                  height: `${dimensions.shaderHeight}px`,
                  transition: "width 0.4s ease, height 0.4s ease",
                }}
              />
            </div>
          </div>

          {/* Interactive button / anchor overlay */}
          <Element
            ref={buttonRef as any}
            href={href}
            target={target}
            rel={rel}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              outline: "none",
              zIndex: 40,
              transformStyle: "preserve-3d",
              transform: "translateZ(25px)",
              transition:
                "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease",
              overflow: "hidden",
              borderRadius: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
            }}
            aria-label={label}
          >
            {ripples.map((ripple) => (
              <span
                key={ripple.id}
                style={{
                  position: "absolute",
                  left: `${ripple.x}px`,
                  top: `${ripple.y}px`,
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(65, 242, 10, 0.6) 0%, rgba(65, 242, 10, 0) 70%)",
                  pointerEvents: "none",
                  animation: "ripple-animation 0.6s ease-out",
                }}
              />
            ))}
          </Element>
        </div>
      </div>
    </div>
  );
}
