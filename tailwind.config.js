/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        fma: {
          bg: '#0F1116',
          surface: '#1A1D24',
          card: '#1F242D',
          border: 'rgba(255, 255, 255, 0.15)',
          gold: '#C5A059',
          goldLight: '#E5C985',
          goldDark: '#99732B',
          navy: '#14233C',
          slate: '#242C3D',
        },
        eid: {
          bg: '#06172B',
          surface: '#0A1E35',
          card: '#0F2742',
          border: 'rgba(207, 212, 219, 0.15)',
          gold: '#D9C8A6',
          goldMuted: '#8E7A66',
          text: '#CFD4DB',
          heading: '#FFFFFF',
          slate: '#1F2C43',
        },
        amp: {
          petroleum: {
            50: '#F0F7FF',
            100: '#E0EFFF',
            200: '#BAE0FF',
            300: '#7CC4FA',
            400: '#38A0F2',
            500: '#0052D9', // Alibaba Cloud Enterprise Blue
            600: '#003B99', // Rich Petrol Blue
            700: '#002B72',
            800: '#0A2540', // Deep Petrol Midnight
            900: '#06162B',
            950: '#030C1A',
          },
          softdark: {
            bg: '#0F172A',      // Soft Slate (not too dark)
            subtle: '#151F32',
            surface: '#1E293B',
            border: '#334155',
            card: '#1B2436',
            cardHover: '#232E45',
            text: '#F8FAFC',
            textMuted: '#94A3B8',
          }
        },
        ecp: {
          black: '#0A0A0D',
          dark: '#111116',
          surface: '#16161D',
          card: '#1D1D26',
          border: 'rgba(255, 255, 255, 0.08)',
          borderRed: 'rgba(229, 25, 34, 0.3)',
          red: '#E51922',
          redHover: '#FF2A34',
          redDark: '#A81118',
          gray: '#8E8E9E',
          grayLight: '#D1D5DB'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Outfit"', 'system-ui', 'sans-serif'],
        outfit: ['"Outfit"', 'sans-serif'],
        syne: ['"Syne"', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
        work: ['"Work Sans"', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        felix: ['"Felix Titling"', '"Perpetua Titling MT"', '"Perpetua Titling ITC"', '"Cinzel"', '"Castoro Titling"', 'serif'],
        perpetua: ['"Perpetua Titling MT"', '"Perpetua Titling ITC"', '"Felix Titling"', '"Cinzel"', 'serif'],
        cormorant: ['"Cormorant Garamond"', '"Playfair Display"', 'serif'],
      },
      boxShadow: {
        'amp-card': '0 4px 20px -2px rgba(0, 82, 217, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'amp-hover': '0 20px 35px -5px rgba(0, 82, 217, 0.12), 0 10px 15px -3px rgba(0, 0, 0, 0.04)',
        'amp-glow': '0 0 35px rgba(0, 82, 217, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.99)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
