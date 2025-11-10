/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Roboto', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'heading': ['Roboto', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#9B2226',
          dark: '#800F2F',
          light: '#F8E6E7',
        },
        study: {
          DEFAULT: '#3A86FF',
          light: '#eff6ff',
          border: '#dbeafe',
        },
        exam: {
          light: '#F8E6E7',
          border: '#f5d4d6',
        },
        paper: '#ffffff',
        ink: '#212529',
        muted: '#6c757d',
        line: '#dee2e6',
        bg: '#f8f9fa',
      },
      boxShadow: {
        soft: '0 2px 4px rgba(0,0,0,0.06)',
        medium: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        large: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
      },
      borderRadius: {
        'xl': '10px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        modalFadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        modalContentSlideIn: {
          '0%': { transform: 'translateY(-20px) scale(0.98)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out',
        modalFadeIn: 'modalFadeIn 0.3s ease',
        modalContentSlideIn: 'modalContentSlideIn 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
      }
    }
  },
  plugins: [],
}


