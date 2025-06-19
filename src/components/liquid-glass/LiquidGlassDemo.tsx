import React from "react";
import { LiquidGlassContainer } from "./LiquidGlassContainer";
import { useLiquidGlass } from "../../hooks/useLiquidGlass";
import {
  BUTTON_STYLES,
  CARD_STYLES,
  createLiquidGlassButton,
  createLiquidGlassCard,
} from "../../lib/unifiedStyles";

/**
 * Demo component showcasing various liquid glass effects
 * Inspired by Apple's design and the rdev/liquid-glass-react library
 */
export const LiquidGlassDemo: React.FC = () => {
  const elasticGlass = useLiquidGlass({
    mouseResponsive: true,
    enableElastic: true,
    elasticity: 0.25,
  });

  const chromaticGlass = useLiquidGlass({
    mouseResponsive: true,
    enableChromatic: true,
    chromaticIntensity: 3,
  });

  const interactiveGlass = useLiquidGlass({
    mouseResponsive: true,
    enableElastic: true,
    enableDisplacement: true,
    elasticity: 0.15,
    displacementScale: 100,
  });

  return (
    <div className="min-h-screen space-y-8 bg-gradient-to-br from-blue-50 to-purple-50 p-8 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-12 text-center text-4xl font-bold text-gray-900 dark:text-white">
          Advanced Liquid Glass Effects
        </h1>

        {/* Basic Liquid Glass Cards */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Basic Liquid Glass Cards
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <LiquidGlassContainer variant="enhanced" className="p-6">
              <h3 className="mb-2 text-lg font-semibold">Enhanced Glass</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Basic liquid glass with enhanced backdrop blur and subtle
                shadows.
              </p>
            </LiquidGlassContainer>

            <LiquidGlassContainer variant="floating" className="p-6">
              <h3 className="mb-2 text-lg font-semibold">Floating Glass</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Maximum glassmorphism effect with floating appearance.
              </p>
            </LiquidGlassContainer>

            <LiquidGlassContainer variant="chromatic" className="p-6">
              <h3 className="mb-2 text-lg font-semibold">Chromatic Glass</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Simulated chromatic aberration effect with color separation.
              </p>
            </LiquidGlassContainer>
          </div>
        </section>

        {/* Mouse-Responsive Cards */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Mouse-Responsive Effects
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div
              ref={elasticGlass.ref as React.RefObject<HTMLDivElement>}
              className={elasticGlass.getClasses(CARD_STYLES.enhanced + " p-6")}
              style={elasticGlass.styles}
            >
              <h3 className="mb-2 text-lg font-semibold">
                Elastic Deformation
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Hover to see elastic deformation that follows your mouse. The
                card stretches and skews based on cursor position.
              </p>
              <button
                className="mt-4 rounded-lg bg-blue-500/20 px-4 py-2 backdrop-blur-sm transition-colors hover:bg-blue-500/30"
                onClick={() => elasticGlass.animationControls.elastic()}
              >
                Trigger Elastic Animation
              </button>
            </div>

            <div
              ref={chromaticGlass.ref as React.RefObject<HTMLDivElement>}
              className={chromaticGlass.getClasses(
                CARD_STYLES.chromatic + " p-6",
              )}
              style={chromaticGlass.styles}
            >
              <h3 className="mb-2 text-lg font-semibold">
                Chromatic Aberration
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Advanced chromatic aberration simulation with RGB channel
                separation. Move your mouse to see the effect respond.
              </p>
              <button
                className="mt-4 rounded-lg bg-purple-500/20 px-4 py-2 backdrop-blur-sm transition-colors hover:bg-purple-500/30"
                onClick={() => chromaticGlass.animationControls.chromatic()}
              >
                Trigger Chromatic Effect
              </button>
            </div>
          </div>
        </section>

        {/* Interactive Buttons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Liquid Glass Buttons
          </h2>

          <div className="flex flex-wrap gap-4">
            <button className={BUTTON_STYLES.liquidGlass}>
              Liquid Glass Primary
            </button>

            <button
              className={createLiquidGlassButton("secondary", {
                mouseResponsive: true,
              })}
            >
              Mouse Responsive
            </button>

            <button
              className={createLiquidGlassButton("liquidGlass", {
                mouseResponsive: true,
                elastic: true,
              })}
            >
              Elastic Button
            </button>

            <button className={BUTTON_STYLES.displacement}>
              Displacement Effect
            </button>
          </div>
        </section>

        {/* Advanced Interactive Card */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Advanced Interactive Glass
          </h2>

          <div
            ref={interactiveGlass.ref as React.RefObject<HTMLDivElement>}
            className={interactiveGlass.getClasses(
              createLiquidGlassCard("morphing", {
                mouseResponsive: true,
                elastic: true,
              }) + " p-8",
            )}
            style={interactiveGlass.styles}
          >
            <div className="text-center">
              <h3 className="mb-4 text-2xl font-bold">Ultimate Liquid Glass</h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                This card combines multiple effects: elastic deformation, mouse
                tracking, displacement simulation, and advanced glassmorphism.
                Move your mouse around to see the full effect.
              </p>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <button
                  className="rounded-lg bg-white/10 px-3 py-2 text-sm backdrop-blur-sm transition-colors hover:bg-white/20"
                  onClick={() => interactiveGlass.animationControls.morph()}
                >
                  Morph
                </button>
                <button
                  className="rounded-lg bg-white/10 px-3 py-2 text-sm backdrop-blur-sm transition-colors hover:bg-white/20"
                  onClick={() => interactiveGlass.animationControls.breathe()}
                >
                  Breathe
                </button>
                <button
                  className="rounded-lg bg-white/10 px-3 py-2 text-sm backdrop-blur-sm transition-colors hover:bg-white/20"
                  onClick={() => interactiveGlass.animationControls.shimmer()}
                >
                  Shimmer
                </button>
                <button
                  className="rounded-lg bg-white/10 px-3 py-2 text-sm backdrop-blur-sm transition-colors hover:bg-white/20"
                  onClick={() => interactiveGlass.animationControls.stopAll()}
                >
                  Stop All
                </button>
              </div>

              <div className="mt-6 rounded-lg bg-black/5 p-4 backdrop-blur-sm dark:bg-white/5">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Mouse Position: (
                  {Math.round(interactiveGlass.state.mousePosition.x)}%,{" "}
                  {Math.round(interactiveGlass.state.mousePosition.y)}%)
                  <br />
                  Distance from Center:{" "}
                  {Math.round(interactiveGlass.state.mouseFromCenter * 100)}%
                  <br />
                  Hovered: {interactiveGlass.state.isHovered ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Guide */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            How to Use
          </h2>

          <LiquidGlassContainer variant="enhanced" className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Implementation</h3>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
              <div>
                <strong>1. Basic Usage:</strong>
                <code className="mt-1 block rounded bg-gray-100 p-2 text-xs dark:bg-gray-800">
                  {`<LiquidGlassContainer variant="enhanced">\n  Your content here\n</LiquidGlassContainer>`}
                </code>
              </div>

              <div>
                <strong>2. With React Hook:</strong>
                <code className="mt-1 block rounded bg-gray-100 p-2 text-xs dark:bg-gray-800">
                  {`const glass = useLiquidGlass({ mouseResponsive: true, enableElastic: true });\n<div ref={glass.ref} className={glass.getClasses('your-classes')} style={glass.styles}>`}
                </code>
              </div>

              <div>
                <strong>3. Advanced Button:</strong>
                <code className="mt-1 block rounded bg-gray-100 p-2 text-xs dark:bg-gray-800">
                  {`<button className={createLiquidGlassButton('liquidGlass', { mouseResponsive: true })}>`}
                </code>
              </div>
            </div>
          </LiquidGlassContainer>
        </section>
      </div>
    </div>
  );
};

export default LiquidGlassDemo;
