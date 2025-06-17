import { Container, useMediaQuery, useTheme } from "@mui/material";
import { type ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

/**
 * Responsive layout wrapper that provides consistent spacing and breakpoints
 * Integrates MUI's responsive system with existing design
 */
export function AppLayout({
  children,
  maxWidth = "lg",
  className = "",
}: AppLayoutProps) {
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
