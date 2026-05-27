export default {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: '#F5F0E8', 50: '#FDFCF9', 100: '#F9F6F0', 200: '#F5F0E8', 300: '#EDE4D4' },
        parchment: { DEFAULT: '#E8DFC8', dark: '#D4C9A8' },
        gold: { light: '#C9A84C', DEFAULT: '#A67C2E', dark: '#7D5A1E', muted: '#C4A882' },
        forest: { light: '#3D6B4F', DEFAULT: '#2C5038', dark: '#1A3324', muted: '#4A7860' },
        navy: { light: '#2A3F5F', DEFAULT: '#1C2E4A', dark: '#0F1E33', muted: '#3A5070' },
        cognac: { light: '#8B4A2B', DEFAULT: '#6B3320', dark: '#4A2215', muted: '#A0614A' },
        charcoal: { light: '#4A4440', DEFAULT: '#2C2824', dark: '#1A1614', muted: '#6B6460' },
        ivory: { DEFAULT: '#FFFFF0', warm: '#FEFAE0' },
        stone: { 100: '#F0EBE3', 200: '#E0D8CC', 300: '#C8BDB0', 400: '#A89888', 500: '#887870' },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['EB Garamond', 'Georgia', 'serif'],
        elegant: ['Cormorant Garamond', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
        'display-sm': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['5rem', { lineHeight: '1.0', letterSpacing: '-0.03em' }],
      },
      borderWidth: { '0.5': '0.5px' },
      boxShadow: {
        'old-money': '0 1px 3px rgba(44,40,36,0.08), 0 4px 16px rgba(44,40,36,0.06)',
        'old-money-lg': '0 4px 6px rgba(44,40,36,0.05), 0 10px 40px rgba(44,40,36,0.1)',
        'gold-glow': '0 0 20px rgba(166,124,46,0.15)',
        'inset-top': 'inset 0 1px 0 rgba(255,255,255,0.5)',
      },
      backgroundImage: {
        linen: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #A67C2E 50%, #C9A84C 100%)',
        'page-texture': 'radial-gradient(ellipse at top, #F9F6F0 0%, #F0EBE3 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-in': 'slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        shimmer: 'shimmer 2s linear infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideIn: { from: { opacity: '0', transform: 'translateX(-16px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        shimmer: { from: { backgroundPosition: '-200% center' }, to: { backgroundPosition: '200% center' } },
        pulseGold: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
      },
    },
  },
  plugins: [],
};
