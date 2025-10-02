import type { Config } from "tailwindcss";

const config: {
  plugins: (({addUtilities, theme}: any) => void)[]; theme: {
    extend: {
      keyframes: {
        fadeOut: { "100%": { opacity: string }; "0%": { opacity: string } };
        bounceSoft: { "0%, 100%": { transform: string }; "50%": { transform: string } };
        fadeIn: { "100%": { opacity: string }; "0%": { opacity: string } };
        slideIn: { "100%": { transform: string; opacity: string }; "0%": { transform: string; opacity: string } };
        slideOut: { "100%": { transform: string; opacity: string }; "0%": { transform: string; opacity: string } };
        pulseSoft: { "0%, 100%": { opacity: string }; "50%": { opacity: string } }
      };
      boxShadow: { large: string; medium: string; "glow-lg": string; glow: string; soft: string };
      spacing: { "88": string; "18": string; "128": string };
      borderRadius: { "4xl": string; "5xl": string };
      backdropBlur: { xs: string };
      screens: { "3xl": string; "4xl": string; xs: string };
      backgroundImage: {
        "gradient-conic": string;
        "gradient-primary": string;
        "gradient-warm": string;
        "gradient-radial": string
      };
      colors: {
        border: string;
        ring: string;
        popover: { foreground: string; DEFAULT: string };
        foreground: { secondary: string; muted: string; DEFAULT: string };
        error: { foreground: string; DEFAULT: string };
        accent: { foreground: string; DEFAULT: string };
        secondary: { foreground: string; DEFAULT: string };
        input: string;
        background: { secondary: string; tertiary: string; muted: string; DEFAULT: string };
        success: { foreground: string; DEFAULT: string };
        warning: { foreground: string; DEFAULT: string };
        muted: { foreground: string; DEFAULT: string };
        card: { foreground: string; DEFAULT: string };
        primary: { light: string; dark: string; foreground: string; DEFAULT: string };
        info: { foreground: string; DEFAULT: string }
      };
      animation: {
        "ping-slow": string;
        "bounce-soft": string;
        "fade-out": string;
        "pulse-soft": string;
        "slide-in": string;
        "fade-in": string;
        "slide-out": string;
        "spin-slow": string
      };
      zIndex: { "100": string; "90": string; "80": string; "70": string; "60": string }
    }
  }; darkMode: string; content: string[]
} = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        // Custom color palette from the image
        primary: {
          DEFAULT: '#003161', // Main primary color
          dark: '#000B58',    // Darker primary
          light: '#006A67',   // Teal secondary
          foreground: '#FDEB9E', // Light yellow for text on dark backgrounds
        },
        secondary: {
          DEFAULT: '#006A67', // Teal
          foreground: '#FDEB9E',
        },
        accent: {
          DEFAULT: '#000B58', // Dark blue accent
          foreground: '#FDEB9E',
        },
        background: {
          DEFAULT: '#FFF', // Light yellow background
          secondary: '#ffffff',
          tertiary: '#f8f9fa',
          muted: '#f1f3f4',
        },
        foreground: {
          DEFAULT: '#000B58', // Dark blue text
          secondary: '#003161',
          muted: '#006A67',
        },
        // Semantic colors using the palette
        success: {
          DEFAULT: '#006A67', // Teal for success
          foreground: '#FDEB9E',
        },
        warning: {
          DEFAULT: '#003161', // Blue for warnings
          foreground: '#FDEB9E',
        },
        error: {
          DEFAULT: '#000B58', // Dark blue for errors
          foreground: '#FDEB9E',
        },
        info: {
          DEFAULT: '#006A67', // Teal for info
          foreground: '#FDEB9E',
        },
        // Border and ring colors
        border: '#003161',
        ring: '#006A67',
        // Input colors
        input: '#FDEB9E',
        // Muted colors
        muted: {
          DEFAULT: '#f8f9fa',
          foreground: '#006A67',
        },
        // Card colors
        card: {
          DEFAULT: '#FDEB9E',
          foreground: '#000B58',
        },
        // Popover colors
        popover: {
          DEFAULT: '#FDEB9E',
          foreground: '#000B58',
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, #000B58 0%, #003161 50%, #006A67 100%)",
        "gradient-warm": "linear-gradient(135deg, #FDEB9E 0%, #ffffff 100%)",
      },
      // Custom animations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-out',
        'bounce-soft': 'bounceSoft 2s infinite',
        'pulse-soft': 'pulseSoft 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      // Custom keyframes
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-10px)', opacity: '0' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      // Custom box shadows
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 49, 97, 0.1), 0 10px 20px -2px rgba(0, 49, 97, 0.05)',
        'medium': '0 4px 25px -5px rgba(0, 11, 88, 0.15), 0 10px 10px -5px rgba(0, 11, 88, 0.1)',
        'large': '0 10px 40px -10px rgba(0, 106, 103, 0.2), 0 2px 10px -2px rgba(0, 106, 103, 0.1)',
        'glow': '0 0 20px rgba(0, 106, 103, 0.5)',
        'glow-lg': '0 0 40px rgba(0, 106, 103, 0.3)',
      },
      // Custom screens
      screens: {
        'xs': '475px',
        '3xl': '1600px',
        '4xl': '1920px',
      },
      // Custom spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Custom border radius
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      // Custom z-index
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      // Custom backdrop blur
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    // Add custom utilities
    function({ addUtilities, theme }: any) {
      const newUtilities = {
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.scrollbar-default': {
          '-ms-overflow-style': 'auto',
          'scrollbar-width': 'auto',
          '&::-webkit-scrollbar': {
            display: 'block',
          },
        },
        '.glass': {
          'background': 'rgba(253, 235, 158, 0.1)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(0, 49, 97, 0.2)',
        },
        '.glass-dark': {
          'background': 'rgba(0, 11, 88, 0.1)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(253, 235, 158, 0.1)',
        },
      }
      addUtilities(newUtilities)
    },
  ],
};
export default config;