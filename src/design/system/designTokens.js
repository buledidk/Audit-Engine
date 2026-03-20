/**
 * Modern Design Tokens System
 * Latest design trends: Glass morphism, Neumorphism, Dark mode,
 * Modern gradients, Dynamic shadows, Micro-interactions
 */

export const DESIGN_TOKENS = {
  // Color Palette - Modern & Professional
  colors: {
    // Primary Gradients
    gradients: {
      primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      success: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
      danger: "linear-gradient(135deg, #eb3349 0%, #f45c43 100%)",
      warning: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      info: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      dark: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      glass: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)"
    },

    // Semantic Colors
    semantic: {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
      neutral: "#6b7280"
    },

    // Neutral Scale
    neutral: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
      950: "#030712"
    },

    // Brand Colors
    brand: {
      primary: "#667eea",
      secondary: "#764ba2",
      accent: "#f093fb",
      light: "#f0f4ff",
      dark: "#1a1a2e"
    }
  },

  // Typography System
  typography: {
    fontFamily: {
      sans: "'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
      display: "'Poppins', 'Sora', sans-serif"
    },

    fontSizes: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "30px",
      "4xl": "36px",
      "5xl": "48px"
    },

    fontWeights: {
      thin: 100,
      extralight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900
    },

    lineHeights: {
      tight: 1.2,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2
    },

    letterSpacing: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0em",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em"
    }
  },

  // Spacing System
  spacing: {
    0: "0px",
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
    16: "64px",
    20: "80px",
    24: "96px"
  },

  // Shadows - Modern & Layered
  shadows: {
    xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    base: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    md: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    lg: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    xl: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
    glow: "0 0 20px rgba(102, 126, 234, 0.4)",
    glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
  },

  // Border Radius
  borderRadius: {
    none: "0px",
    sm: "4px",
    base: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    "2xl": "20px",
    "3xl": "24px",
    full: "9999px"
  },

  // Glass Morphism
  glassmorphism: {
    light: {
      background: "rgba(255, 255, 255, 0.25)",
      border: "1px solid rgba(255, 255, 255, 0.18)",
      backdropFilter: "backdrop-filter: blur(4px)"
    },
    medium: {
      background: "rgba(255, 255, 255, 0.15)",
      border: "1px solid rgba(255, 255, 255, 0.12)",
      backdropFilter: "backdrop-filter: blur(10px)"
    },
    heavy: {
      background: "rgba(255, 255, 255, 0.10)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      backdropFilter: "backdrop-filter: blur(20px)"
    }
  },

  // Neumorphism (Soft UI)
  neumorphism: {
    light: {
      boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff"
    },
    dark: {
      boxShadow: "8px 8px 16px #0a0e27, -8px -8px 16px #1a1f3a"
    }
  },

  // Z-index Scale
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070
  },

  // Transitions
  transitions: {
    fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    base: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
    slower: "500ms cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    ease: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)"
  },

  // Breakpoints
  breakpoints: {
    xs: "320px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px"
  }
};

export default DESIGN_TOKENS;
