/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", /* sand-200 */
        input: "var(--color-input)", /* sand-200 */
        ring: "var(--color-ring)", /* earth-600 */
        background: "var(--color-background)", /* sand-50 */
        foreground: "var(--color-foreground)", /* earth-900 */
        primary: {
          DEFAULT: "var(--color-primary)", /* earth-600 */
          foreground: "var(--color-primary-foreground)", /* white */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* sand-300 */
          foreground: "var(--color-secondary-foreground)", /* earth-900 */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* red-500 */
          foreground: "var(--color-destructive-foreground)", /* white */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* sand-200 */
          foreground: "var(--color-muted-foreground)", /* earth-800 */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* earth-400 */
          foreground: "var(--color-accent-foreground)", /* white */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* white */
          foreground: "var(--color-popover-foreground)", /* earth-900 */
        },
        card: {
          DEFAULT: "var(--color-card)", /* white */
          foreground: "var(--color-card-foreground)", /* earth-900 */
        },
        success: {
          DEFAULT: "var(--color-success)", /* emerald-500 */
          foreground: "var(--color-success-foreground)", /* white */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* amber-500 */
          foreground: "var(--color-warning-foreground)", /* white */
        },
        error: {
          DEFAULT: "var(--color-error)", /* red-500 */
          foreground: "var(--color-error-foreground)", /* white */
        },
        /* Custom brand colors */
        sand: {
          50: '#FAF9F7',  /* warm white */
          100: '#F0EBE5', /* light beige */
          200: '#E6DDD3', /* beige */
          300: '#D6C7B5', /* soft beige */
        },
        earth: {
          400: '#A68A76', /* highlight brown */
          500: '#9C7E6A', /* medium brown */
          600: '#8C705F', /* warm brown */
          800: '#543D32', /* dark brown */
          900: '#3D2B24', /* very dark brown */
        },
        chart: {
          "1": "var(--chart-1)", /* earth-600 */
          "2": "var(--chart-2)", /* earth-400 */
          "3": "var(--chart-3)", /* sand-300 */
          "4": "var(--chart-4)", /* earth-800 */
          "5": "var(--chart-5)", /* earth-500 */
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'serif'], /* Elegant, emotional */
        sans: ['Inter', 'sans-serif'], /* Clean, readable */
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shine: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.8s ease-out forwards',
        fadeIn: 'fadeIn 0.6s ease-out forwards',
        slideInRight: 'slideInRight 0.6s ease-out forwards',
        slideInLeft: 'slideInLeft 0.6s ease-out forwards',
        scaleIn: 'scaleIn 0.5s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
        shine: 'shine 3s linear infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}