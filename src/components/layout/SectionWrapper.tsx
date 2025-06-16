import React from "react";

/**
 * Reusable section wrapper component for grid-based layouts
 * Provides consistent scaling and line-height to prevent spacing issues during responsive resizing
 */
interface SectionWrapperProps {
  scale: number;
  alignment: "start" | "center";
  padding?: string;
  children: React.ReactNode;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  scale,
  alignment,
  padding = "1em",
  children,
}) => {
  const alignmentClasses =
    alignment === "start" ? "items-start" : "items-center";

  return (
    <section
      className={`group flex h-full w-full flex-col justify-center ${alignmentClasses}`}
      style={{
        padding: padding,
        fontSize: `${scale}em`,
        lineHeight: 1.5, // Unitless line-height for consistent scaling
      }}
    >
      {children}
    </section>
  );
};
