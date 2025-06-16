import { Container, useMediaQuery, useTheme } from "@mui/material";
import { type ReactNode } from "react";

interface ResponsiveLayoutProps {
  children: ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

/**
 * Responsive layout wrapper that provides consistent spacing and breakpoints
 * Integrates MUI's responsive system with existing design
 */
export function ResponsiveLayout({
  children,
  maxWidth = "lg",
  className = "",
}: ResponsiveLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Container
      maxWidth={maxWidth}
      disableGutters={isMobile}
      sx={{
        px: isMobile ? 2 : 4, // responsive padding
        py: isMobile ? 1 : 2, // responsive vertical spacing
        transition: theme.transitions.create(["padding"], {
          duration: theme.transitions.duration.standard,
        }),
      }}
      className={className}
    >
      {children}
    </Container>
  );
}
