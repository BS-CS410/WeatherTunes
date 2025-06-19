import { useRef, useEffect, useState, useCallback } from "react";

// Simple utility functions for mouse tracking
const getMousePosition = (event: MouseEvent, element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  const centerX = 50;
  const centerY = 50;
  const fromCenter =
    Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)) / 70.71;
  return { x, y, fromCenter };
};

const calculateElasticDeformation = (
  mouseX: number,
  mouseY: number,
  intensity: number = 0.15,
) => {
  const elasticX = (mouseX - 50) * intensity * 0.1;
  const elasticY = (mouseY - 50) * intensity * 0.1;
  return { elasticX, elasticY };
};

interface UseLiquidGlassOptions {
  mouseResponsive?: boolean;
  elasticity?: number;
  displacementScale?: number;
  chromaticIntensity?: number;
  enableElastic?: boolean;
  enableChromatic?: boolean;
  enableDisplacement?: boolean;
}

interface LiquidGlassState {
  isHovered: boolean;
  isActive: boolean;
  mousePosition: { x: number; y: number };
  mouseFromCenter: number;
}

/**
 * Advanced React hook for implementing liquid glass effects
 * Inspired by the rdev/liquid-glass-react implementation
 */
export const useLiquidGlass = (options: UseLiquidGlassOptions = {}) => {
  const {
    mouseResponsive = false,
    elasticity = 0.15,
    displacementScale = 70,
    chromaticIntensity = 2,
    enableElastic = false,
    enableChromatic = false,
    enableDisplacement = false,
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const [state, setState] = useState<LiquidGlassState>({
    isHovered: false,
    isActive: false,
    mousePosition: { x: 50, y: 50 },
    mouseFromCenter: 0,
  });

  // Calculate dynamic styles based on mouse position and effects
  const getDynamicStyles = useCallback(() => {
    const { mousePosition, mouseFromCenter, isHovered, isActive } = state;

    const styles: Record<string, string | number> = {
      "--mouse-x": `${mousePosition.x}%`,
      "--mouse-y": `${mousePosition.y}%`,
      "--mouse-from-center": mouseFromCenter,
      "--elasticity": elasticity,
      "--displacement-scale": displacementScale,
      "--aberration-intensity": chromaticIntensity,
    };

    if (enableElastic) {
      const { elasticX, elasticY } = calculateElasticDeformation(
        mousePosition.x,
        mousePosition.y,
        elasticity,
      );
      styles["--elastic-x"] = elasticX;
      styles["--elastic-y"] = elasticY;
      styles["--elastic-intensity"] = elasticity;
    }

    // Add transform calculations for advanced effects
    if (isHovered && mouseResponsive) {
      const baseScale = 1 + mouseFromCenter * 0.02;
      const rotateX = (mousePosition.y - 50) * 0.1;
      const rotateY = (mousePosition.x - 50) * 0.1;

      styles.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(${isActive ? baseScale * 0.95 : baseScale})
      `
        .replace(/\s+/g, " ")
        .trim();
    }

    return styles;
  }, [
    state,
    elasticity,
    displacementScale,
    chromaticIntensity,
    enableElastic,
    mouseResponsive,
  ]);

  // Mouse event handlers
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!elementRef.current || !mouseResponsive) return;

      const { x, y, fromCenter } = getMousePosition(event, elementRef.current);

      setState((prev) => ({
        ...prev,
        mousePosition: { x, y },
        mouseFromCenter: fromCenter,
      }));

      // Apply CSS variables directly for real-time updates
      elementRef.current.style.setProperty("--mouse-x", `${x}%`);
      elementRef.current.style.setProperty("--mouse-y", `${y}%`);
      elementRef.current.style.setProperty(
        "--mouse-from-center",
        fromCenter.toString(),
      );

      if (enableElastic) {
        const { elasticX, elasticY } = calculateElasticDeformation(
          x,
          y,
          elasticity,
        );
        elementRef.current.style.setProperty(
          "--elastic-x",
          elasticX.toString(),
        );
        elementRef.current.style.setProperty(
          "--elastic-y",
          elasticY.toString(),
        );
        elementRef.current.style.setProperty(
          "--elastic-intensity",
          elasticity.toString(),
        );
      }
    },
    [mouseResponsive, enableElastic, elasticity],
  );

  const handleMouseEnter = useCallback(() => {
    setState((prev) => ({ ...prev, isHovered: true }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isHovered: false,
      mousePosition: { x: 50, y: 50 },
      mouseFromCenter: 0,
    }));

    if (elementRef.current) {
      elementRef.current.style.setProperty("--mouse-x", "50%");
      elementRef.current.style.setProperty("--mouse-y", "50%");
      elementRef.current.style.setProperty("--mouse-from-center", "0");
      elementRef.current.style.setProperty("--elastic-x", "0");
      elementRef.current.style.setProperty("--elastic-y", "0");
    }
  }, []);

  const handleMouseDown = useCallback(() => {
    setState((prev) => ({ ...prev, isActive: true }));
  }, []);

  const handleMouseUp = useCallback(() => {
    setState((prev) => ({ ...prev, isActive: false }));
  }, []);

  // Set up event listeners
  useEffect(() => {
    const element = elementRef.current;
    if (!element || !mouseResponsive) return;

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mousedown", handleMouseDown);
    element.addEventListener("mouseup", handleMouseUp);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mousedown", handleMouseDown);
      element.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    mouseResponsive,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp,
  ]);

  // Generate CSS classes based on state and options
  const getClasses = useCallback(
    (baseClasses: string = "") => {
      const classes = [baseClasses];

      if (state.isHovered) {
        classes.push("liquid-glass-hover");
      }

      if (state.isActive) {
        classes.push("scale-95");
      }

      if (mouseResponsive) {
        classes.push("mouse-tracking");
      }

      if (enableElastic) {
        classes.push("elastic-mouse-response");
      }

      return classes.filter(Boolean).join(" ");
    },
    [state.isHovered, state.isActive, mouseResponsive, enableElastic],
  );

  // Advanced animation controls
  const animationControls = {
    morph: () => {
      if (!elementRef.current) return;
      elementRef.current.style.animation =
        "liquid-morph 2s ease-in-out infinite";
    },

    breathe: () => {
      if (!elementRef.current) return;
      elementRef.current.style.animation =
        "liquid-breathe 3s ease-in-out infinite";
    },

    shimmer: () => {
      if (!elementRef.current) return;
      elementRef.current.style.animation = "liquid-shimmer 2s ease-in-out";
    },

    chromatic: () => {
      if (!elementRef.current || !enableChromatic) return;
      elementRef.current.style.animation =
        "chromatic-shift 4s ease-in-out infinite";
    },

    elastic: () => {
      if (!elementRef.current || !enableElastic) return;
      elementRef.current.style.animation =
        "elastic-deform 2s ease-in-out infinite";
    },

    displacement: () => {
      if (!elementRef.current || !enableDisplacement) return;
      elementRef.current.style.animation =
        "displacement-wave 3s ease-in-out infinite";
    },

    stopAll: () => {
      if (!elementRef.current) return;
      elementRef.current.style.animation = "none";
    },
  };

  return {
    ref: elementRef,
    state,
    styles: getDynamicStyles(),
    getClasses,
    animationControls,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
    },
  };
};

export default useLiquidGlass;
