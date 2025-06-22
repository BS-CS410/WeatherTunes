import React, { useRef, useEffect, useState } from "react";
import {
  LIQUID_GLASS_STYLES,
  COLORS,
  combineStyles,
} from "@/lib";

interface LiquidGlassContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: "enhanced" | "chromatic" | "floating" | "elastic" | "interactive";
  mouseResponsive?: boolean;
  elasticity?: number;
  displacementScale?: number;
  chromaticIntensity?: number;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * Simplified Liquid Glass Container - preserving visual effects with cleaner architecture
 */
export const LiquidGlassContainer: React.FC<LiquidGlassContainerProps> = ({
  children,
  className = "",
  variant = "enhanced",
  mouseResponsive = false,
  elasticity = 0.15,
  displacementScale = 70,
  chromaticIntensity = 2,
  style,
  onClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Simplified mouse tracking with preserved visual effects
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !mouseResponsive) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      container.style.setProperty("--mouse-x", `${x}%`);
      container.style.setProperty("--mouse-y", `${y}%`);

      // Elastic deformation for specific variant
      if (variant === "elastic") {
        const elasticX = (x - 50) * elasticity * 0.1;
        const elasticY = (y - 50) * elasticity * 0.1;
        container.style.setProperty("--elastic-x", elasticX.toString());
        container.style.setProperty("--elastic-y", elasticY.toString());
      }
    };

    const handleMouseLeave = () => {
      container.style.setProperty("--mouse-x", "50%");
      container.style.setProperty("--mouse-y", "50%");
      container.style.setProperty("--elastic-x", "0");
      container.style.setProperty("--elastic-y", "0");
      setIsHovered(false);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseenter", () => setIsHovered(true));

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseenter", () => setIsHovered(true));
    };
  }, [mouseResponsive, variant, elasticity]);

  // Simplified style builder with preserved effects
  const getVariantStyle = () => {
    const baseStyle = mouseResponsive
      ? LIQUID_GLASS_STYLES.mouseResponsive
      : "";

    switch (variant) {
      case "chromatic":
        return combineStyles(LIQUID_GLASS_STYLES.chromaticGlass, baseStyle);
      case "floating":
        return combineStyles(LIQUID_GLASS_STYLES.floating, baseStyle);
      case "elastic":
        return combineStyles(LIQUID_GLASS_STYLES.elasticContainer, baseStyle);
      case "interactive":
        return combineStyles(LIQUID_GLASS_STYLES.interactiveGlass, baseStyle);
      default:
        return combineStyles(COLORS.glass.enhanced, baseStyle);
    }
  };

  const containerStyles = combineStyles(
    getVariantStyle(),
    isHovered ? "liquid-glass-hover" : "",
    onClick ? "cursor-pointer" : "",
    className,
  );

  const dynamicStyle: React.CSSProperties = {
    ...style,
    "--elasticity": elasticity,
    "--displacement-scale": displacementScale,
    "--aberration-intensity": chromaticIntensity,
    "--mouse-x": "50%",
    "--mouse-y": "50%",
    "--elastic-x": "0",
    "--elastic-y": "0",
  } as React.CSSProperties;

  return (
    <div
      ref={containerRef}
      className={containerStyles}
      style={dynamicStyle}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default LiquidGlassContainer;
