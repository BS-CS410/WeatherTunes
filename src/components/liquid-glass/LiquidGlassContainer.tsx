import React, { useRef, useEffect, useState } from "react";
import {
  LIQUID_GLASS_STYLES,
  MOUSE_TRACKING_UTILS,
  createLiquidGlassCard,
  combineStyles,
} from "../../lib/unifiedStyles";

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
 * Advanced Liquid Glass Container inspired by Apple's design
 * Implements mouse tracking, elastic deformation, and visual effects
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
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !mouseResponsive) return;

    const handleMouseMove = (event: MouseEvent) => {
      MOUSE_TRACKING_UTILS.applyMouseTracking(container, event);

      if (variant === "elastic") {
        MOUSE_TRACKING_UTILS.applyElasticDeformation(
          container,
          event,
          elasticity,
        );
      }
    };

    const handleMouseLeave = () => {
      MOUSE_TRACKING_UTILS.resetMouseTracking(container);
      setIsHovered(false);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseResponsive, variant, elasticity]);

  // Build styles based on variant and options
  const getContainerStyles = () => {
    switch (variant) {
      case "chromatic":
        return combineStyles(
          LIQUID_GLASS_STYLES.chromaticGlass,
          mouseResponsive ? LIQUID_GLASS_STYLES.mouseResponsive : "",
          className,
        );

      case "floating":
        return combineStyles(
          LIQUID_GLASS_STYLES.floating,
          mouseResponsive ? LIQUID_GLASS_STYLES.mouseResponsive : "",
          className,
        );

      case "elastic":
        return combineStyles(
          LIQUID_GLASS_STYLES.elasticContainer,
          mouseResponsive ? LIQUID_GLASS_STYLES.mouseResponsive : "",
          className,
        );

      case "interactive":
        return combineStyles(
          LIQUID_GLASS_STYLES.interactiveGlass,
          mouseResponsive ? LIQUID_GLASS_STYLES.mouseResponsive : "",
          className,
        );

      default:
        return (
          createLiquidGlassCard("enhanced", {
            mouseResponsive,
            chromatic: false,
            elastic: false,
            floating: false,
          }) +
          " " +
          className
        );
    }
  };

  const handleMouseDown = () => {
    setIsActive(true);
  };

  const handleMouseUp = () => {
    setIsActive(false);
  };

  const containerStyles = combineStyles(
    getContainerStyles(),
    isHovered ? "liquid-glass-hover" : "",
    isActive ? "scale-95" : "",
    onClick ? "cursor-pointer" : "",
  );

  const dynamicStyle: React.CSSProperties = {
    ...style,
    "--elasticity": elasticity,
    "--displacement-scale": displacementScale,
    "--aberration-intensity": chromaticIntensity,
    "--mouse-x": "50%",
    "--mouse-y": "50%",
    "--mouse-from-center": "0",
    "--elastic-x": "0",
    "--elastic-y": "0",
    "--elastic-intensity": elasticity,
  } as React.CSSProperties;

  return (
    <div
      ref={containerRef}
      className={containerStyles}
      style={dynamicStyle}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {children}
    </div>
  );
};

export default LiquidGlassContainer;
