import React from "react";

/**
 * Reusable section wrapper component for grid-based layouts
 * Uses consistent line-height to prevent spacing issues during responsive resizing
 */
interface SectionWrapperProps {
  alignment: "start" | "center";
  padding?: string;
  children: React.ReactNode;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  alignment,
  padding = "1em",
  children,
}) => {
  const alignmentClasses =
    alignment === "start" ? "items-start" : "items-center";

  // Remove text scaling since individual elements handle their own responsive typography
  // Apply consistent line-height to prevent inheritance issues
  const baseClasses = "leading-[1.5]"; // Unitless line-height for consistent scaling

  return (
    <section
      className={`group flex h-full w-full flex-col justify-center ${alignmentClasses} ${baseClasses}`}
      style={{
        padding: padding,
      }}
    >
      {children}
    </section>
  );
};
