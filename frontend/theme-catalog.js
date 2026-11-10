/**
 * Portfoolio Theme Showcase Catalog
 * Rich metadata, designer attribution, engagement metrics & visual palettes
 * Inspired by Dribbble / Mobbin / Framer showcase galleries.
 */
(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PortfoolioThemeCatalog = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';

  
  const DEV_THEMES = {
    midnight: {
      id: 'midnight',
      title: 'Midnight Wow',
      subtitle: 'Dark neon glowing developer portfolio',
      track: 'tech',
      badge: 'PRO',
      accentColor: '#38bdf8',
      gradient: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 100%)',
      icon: '🌌',
      dark: true
    },
    minimal: {
      id: 'minimal',
      title: 'Minimal Clean',
      subtitle: 'Light ATS-friendly Swiss typography',
      track: 'tech',
      badge: 'PRO',
      accentColor: '#0f172a',
      gradient: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      icon: '📄',
      dark: false
    },
    terminal: {
      id: 'terminal',
      title: 'Terminal Hacker',
      subtitle: 'CRT green phosphor command-line interface',
      track: 'tech',
      badge: 'CORE',
      accentColor: '#22c55e',
      gradient: 'linear-gradient(135deg, #050505 0%, #064e3b 100%)',
      icon: '>_',
      dark: true
    },
    creative: {
      id: 'creative',
      title: 'Creative Pop',
      subtitle: 'Playful vibrant gradient showcase',
      track: 'tech',
      badge: 'PRO',
      accentColor: '#ec4899',
      gradient: 'linear-gradient(135deg, #fdf2f8 0%, #ede9fe 100%)',
      icon: '🎨',
      dark: false
    },
    aurora: {
      id: 'aurora',
      title: 'Aurora Glass',
      subtitle: 'Frosted pastel glassmorphic canvas',
      track: 'tech',
      badge: 'PRO',
      accentColor: '#06b6d4',
      gradient: 'linear-gradient(135deg, #e0e7ff 0%, #ccfbf1 100%)',
      icon: '🔮',
      dark: false
    },
    editorial: {
      id: 'editorial',
      title: 'Editorial Serif',
      subtitle: 'Refined print monograph with serif typography',
      track: 'tech',
      badge: 'PRO',
      accentColor: '#78350f',
      gradient: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
      icon: 'Ag',
      dark: false
    },
    brutalist: {
      id: 'brutalist',
      title: 'Neo-Brutalist',
      subtitle: 'High-contrast raw borders and pop colors',
      track: 'tech',
      badge: 'FEATURED',
      accentColor: '#fbbf24',
      gradient: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)',
      icon: '🧱',
      dark: false
    },
    afterglow: {
      id: 'afterglow',
      title: 'Afterglow',
      subtitle: 'Sunset gradient with neon horizons',
      track: 'tech',
      badge: 'PRO',
      accentColor: '#f97316',
      gradient: 'linear-gradient(135deg, #1c1917 0%, #7c2d12 100%)',
      icon: '🌇',
      dark: true
    },
    ultraviolet: {
      id: 'ultraviolet',
      title: 'Ultraviolet',
      subtitle: 'Electric violet & deep indigo cyber aura',
      track: 'tech',
      badge: 'PRO',
      accentColor: '#a855f7',
      gradient: 'linear-gradient(135deg, #180828 0%, #3b0764 100%)',
      icon: '🟣',
      dark: true
    },
    tidepool: {
      id: 'tidepool',
      title: 'Tidepool',
      subtitle: 'Bioluminescent deep-sea cyan glow',
      track: 'tech',
      badge: 'PRO',
      accentColor: '#14b8a6',
      gradient: 'linear-gradient(135deg, #041f2a 0%, #0f3d4c 100%)',
      icon: '🪼',
      dark: true
    },
    darkpro: {
      id: 'darkpro',
      title: 'Dark Pro',
      subtitle: 'Sleek dark interface with vibrant amber accent',
      track: 'tech',
      badge: 'PRO',
      accentColor: '#eab308',
      gradient: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)',
      icon: '🌑',
      dark: true
    },
    fullpage: {
      id: 'fullpage',
      title: 'Fullpage Scroll',
      subtitle: 'Full-viewport snap slide presentation',
      track: 'tech',
      badge: 'PRO',
      accentColor: '#ef4444',
      gradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      icon: '📄',
      dark: true
    },
    moderncv: {
      id: 'moderncv',
      title: 'Modern CV',
      subtitle: 'Executive bilingual resume & curriculum vitae',
      track: 'tech',
      badge: 'PRO',
      accentColor: '#2563eb',
      gradient: 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)',
      icon: '💼',
      dark: false
    },
    ultracode: {
      id: 'ultracode',
      title: 'Ultra Code',
      subtitle: 'High-density sidebar IDE layout with crimson glow',
      track: 'tech',
      badge: 'PRO',
      accentColor: '#f43f5e',
      gradient: 'linear-gradient(135deg, #0f0a0a 0%, #20080c 100%)',
      icon: '🔴',
      dark: true
    },
    devblue: {
      id: 'devblue',
      title: 'Dev Blue',
      subtitle: 'Corporate engineering aesthetic in Royal Blue',
      track: 'tech',
      badge: 'PRO',
      accentColor: '#3b82f6',
      gradient: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
      icon: '🔷',
      dark: false
    },
    cube: {
      id: 'cube',
      title: '3D Cube',
      subtitle: 'Mint and charcoal with interactive 3D slider',
      track: 'tech',
      badge: 'FEATURED',
      accentColor: '#10b981',
      gradient: 'linear-gradient(135deg, #111827 0%, #064e3b 100%)',
      icon: '🟩',
      dark: true
    },
    nova: {
      id: 'nova',
      title: 'Nova Galaxy',
      subtitle: 'Teal particle nebula with interactive cards',
      track: 'tech',
      badge: 'PRO',
      accentColor: '#2dd4bf',
      gradient: 'linear-gradient(135deg, #081726 0%, #0e3b43 100%)',
      icon: '🌌',
      dark: true
    },
    codeflow: {
      id: 'codeflow',
      title: 'Codeflow',
      subtitle: 'Tabbed systems architecture & code syntax showcase',
      track: 'tech',
      badge: 'PRO',
      accentColor: '#38bdf8',
      gradient: 'linear-gradient(135deg, #090e17 0%, #1e293b 100%)',
      icon: '⚡',
      dark: true
    },
    wave: {
      id: 'wave',
      title: 'Neon Wave',
      subtitle: 'Emerald laser wave and holographic cyber canvas',
      track: 'tech',
      badge: 'PRO',
      accentColor: '#10b981',
      gradient: 'linear-gradient(135deg, #061e16 0%, #022c22 100%)',
      icon: '🌊',
      dark: true
    },
    assistant: {
      id: 'assistant',
      title: 'AI Assistant',
      subtitle: 'ChatGPT style conversational portfolio bot',
      track: 'tech',
      badge: 'FEATURED',
      accentColor: '#10a37f',
      gradient: 'linear-gradient(135deg, #202123 0%, #2a2b32 100%)',
      icon: '🤖',
      dark: true
    },
    console: {
      id: 'console',
      title: 'Dev Console',
      subtitle: 'Unix workstation terminal with tabbed panels',
      track: 'tech',
      badge: 'PRO',
      accentColor: '#f59e0b',
      gradient: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
      icon: '🖥️',
      dark: true
    },
    snowcard: {
      id: 'snowcard',
      title: 'Snowcard',
      subtitle: 'Dotted grid canvas with sunny amber tabs',
      track: 'tech',
      badge: 'PRO',
      accentColor: '#f59e0b',
      gradient: 'linear-gradient(135deg, #ffffff 0%, #fef3c7 100%)',
      icon: '❄️',
      dark: false
    },
    parchment: {
      id: 'parchment',
      title: 'Parchment Scroll',
      subtitle: 'Vintage scholarly parchment with antique serif',
      track: 'tech',
      badge: 'PRO',
      accentColor: '#b45309',
      gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      icon: '📜',
      dark: false
    },
    cloud: {
      id: 'cloud',
      title: 'Cloud Blue',
      subtitle: 'Friendly rounded cloud shapes and sky blue air',
      track: 'tech',
      badge: 'PRO',
      accentColor: '#0284c7',
      gradient: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
      icon: '☁️',
      dark: false
    },
    github: {
      id: 'github',
      title: 'GitHub',
      subtitle: 'Octocat dark theme with pinned repository cards',
      track: 'tech',
      badge: 'FEATURED',
      accentColor: '#58a6ff',
      gradient: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
      icon: '🐙',
      dark: true
    },
    particle: {
      id: 'particle',
      title: 'Particle Mesh',
      subtitle: '3D constellation canvas with glowing dual-hero',
      track: 'tech',
      badge: 'FEATURED',
      accentColor: '#818cf8',
      gradient: 'linear-gradient(135deg, #050510 0%, #18122b 100%)',
      icon: '✨',
      dark: true
    },
    panels: {
      id: 'panels',
      title: 'Panels',
      subtitle: 'Tabbed modern product view with purple aura',
      track: 'tech',
      badge: 'PRO',
      accentColor: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #0c0a1f 0%, #1e113a 100%)',
      icon: '🗂️',
      dark: true
    },
    monolith: {
      id: 'monolith',
      title: 'Monolith',
      subtitle: 'Monumental black typography & heavy brutalist grids',
      track: 'tech',
      badge: 'PRO',
      accentColor: '#ffffff',
      gradient: 'linear-gradient(135deg, #000000 0%, #1c1917 100%)',
      icon: '⬛',
      dark: true
    },
    editor: {
      id: 'editor',
      title: 'Editor',
      subtitle: 'VS Code IDE with tree explorer & Copilot companion',
      track: 'tech',
      badge: 'FEATURED',
      accentColor: '#007acc',
      gradient: 'linear-gradient(135deg, #1e1e1e 0%, #252526 100%)',
      icon: '💻',
      dark: true
    },
    magazine: {
      id: 'magazine',
      title: 'Magazine',
      subtitle: 'Literary editorial publication with Fraunces drop caps',
      track: 'tech',
      badge: 'PRO',
      accentColor: '#c2410c',
      gradient: 'linear-gradient(135deg, #fffbeb 0%, #fed7aa 100%)',
      icon: '📰',
      dark: false
    },
    bold: {
      id: 'bold',
      title: 'Bold',
      subtitle: 'Obsidian dark canvas with electric lime energy',
      track: 'tech',
      badge: 'PRO',
      accentColor: '#a3e635',
      gradient: 'linear-gradient(135deg, #09090b 0%, #1a2e05 100%)',
      icon: '⚡',
      dark: true
    },
    clean: {
      id: 'clean',
      title: 'Clean Pro',
      subtitle: 'Floating pill navigation and soft card elevations',
      track: 'tech',
      badge: 'PRO',
      accentColor: '#4f46e5',
      gradient: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
      icon: '🕊️',
      dark: false
    },
    vibrant: {
      id: 'vibrant',
      title: 'Vibrant',
      subtitle: 'Spectrum rainbow gradient with lilac glow',
      track: 'tech',
      badge: 'PRO',
      accentColor: '#d946ef',
      gradient: 'linear-gradient(135deg, #fae8ff 0%, #fce7f3 100%)',
      icon: '🌈',
      dark: false
    },
    neon: {
      id: 'neon',
      title: 'Neon Cyberpunk',
      subtitle: '3D synthwave grid floor with laser pink highlights',
      track: 'tech',
      badge: 'FEATURED',
      accentColor: '#f43f5e',
      gradient: 'linear-gradient(135deg, #0f051d 0%, #350826 100%)',
      icon: '🌆',
      dark: true
    },
    hacker: {
      id: 'hacker',
      title: 'Hacker Terminal',
      subtitle: 'Phosphor green matrix terminal with CRT scanlines',
      track: 'tech',
      badge: 'PRO',
      accentColor: '#22c55e',
      gradient: 'linear-gradient(135deg, #020c04 0%, #042f14 100%)',
      icon: '💻',
      dark: true
    }
  };

  
  const VISUAL_THEMES = {
    gallery: {
      id: 'gallery',
      title: 'Gallery',
      subtitle: 'Clean visual masonry grid for fine art photography',
      track: 'visual',
      badge: 'PRO',
      accentColor: '#e2e8f0',
      gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      icon: '🖼️',
      dark: true
    },
    studio: {
      id: 'studio',
      title: 'Studio',
      subtitle: 'Bright daylight editorial covers with clean margins',
      track: 'visual',
      badge: 'PRO',
      accentColor: '#0f172a',
      gradient: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      icon: '☀️',
      dark: false
    },
    noir: {
      id: 'noir',
      title: 'Noir',
      subtitle: 'Cinematic full-bleed monochromatic black & white',
      track: 'visual',
      badge: 'PRO',
      accentColor: '#ffffff',
      gradient: 'linear-gradient(135deg, #000000 0%, #111111 100%)',
      icon: '🌙',
      dark: true
    },
    museum: {
      id: 'museum',
      title: 'Museum',
      subtitle: 'Framed gallery walls with classic museum plaques',
      track: 'visual',
      badge: 'PRO',
      accentColor: '#78350f',
      gradient: 'linear-gradient(135deg, #fafaf9 0%, #e7e5e4 100%)',
      icon: '🏛️',
      dark: false
    },
    catalog: {
      id: 'catalog',
      title: 'Catalog',
      subtitle: 'Swiss art-book publication plates with index columns',
      track: 'visual',
      badge: 'PRO',
      accentColor: '#ea580c',
      gradient: 'linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%)',
      icon: '📖',
      dark: false
    },
    bloom: {
      id: 'bloom',
      title: 'Bloom',
      subtitle: 'Ethereal pastel dreamscape with soft blur transitions',
      track: 'visual',
      badge: 'PRO',
      accentColor: '#f472b6',
      gradient: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
      icon: '🌸',
      dark: false
    },
    motion: {
      id: 'motion',
      title: 'Motion Flow',
      subtitle: 'Smooth fluid animation cards with kinetic typography',
      track: 'visual',
      badge: 'FEATURED',
      accentColor: '#6366f1',
      gradient: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
      icon: '⚡',
      dark: false
    },
    atelier: {
      id: 'atelier',
      title: 'Atelier',
      subtitle: 'Haute couture fashion house monograph with serif titles',
      track: 'visual',
      badge: 'PRO',
      accentColor: '#d97706',
      gradient: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)',
      icon: '🏛️',
      dark: true
    },
    cinema: {
      id: 'cinema',
      title: 'Cinema',
      subtitle: '2.39:1 widescreen stills with live film HUD gauges',
      track: 'visual',
      badge: 'FEATURED',
      accentColor: '#ef4444',
      gradient: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)',
      icon: '🎬',
      dark: true
    },
    arch: {
      id: 'arch',
      title: 'Arch',
      subtitle: 'Architectural blueprint drafting plates with scale rules',
      track: 'visual',
      badge: 'PRO',
      accentColor: '#0284c7',
      gradient: 'linear-gradient(135deg, #0f172a 0%, #0369a1 100%)',
      icon: '📐',
      dark: true
    },
    zine: {
      id: 'zine',
      title: 'Zine',
      subtitle: 'Risograph indie print collage with washi tape accents',
      track: 'visual',
      badge: 'PRO',
      accentColor: '#f43f5e',
      gradient: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
      icon: '🎨',
      dark: false
    },
    zen: {
      id: 'zen',
      title: 'Zen',
      subtitle: 'Wabi-sabi ceramic and stone aesthetic with calm rhythm',
      track: 'visual',
      badge: 'PRO',
      accentColor: '#78716c',
      gradient: 'linear-gradient(135deg, #f5f5f4 0%, #d6d3d1 100%)',
      icon: '🍵',
      dark: false
    },
    desire: {
      id: 'desire',
      title: 'Desire',
      subtitle: 'Vibrant modern digital designer portfolio with loupe zoom',
      track: 'visual',
      badge: 'FEATURED',
      accentColor: '#ff4d00',
      gradient: 'linear-gradient(135deg, #0d0d0f 0%, #1f1105 100%)',
      icon: '✨',
      dark: true
    },
    lumina: {
      id: 'lumina',
      title: 'Lumina',
      subtitle: 'Holographic prism iridescent glassmorphic layout',
      track: 'visual',
      badge: 'PRO',
      accentColor: '#c084fc',
      gradient: 'linear-gradient(135deg, #0f0b1e 0%, #2e1065 100%)',
      icon: '💎',
      dark: true
    },
    vogue: {
      id: 'vogue',
      title: 'Vogue',
      subtitle: 'High-fashion editorial Didot display typography',
      track: 'visual',
      badge: 'PRO',
      accentColor: '#f59e0b',
      gradient: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
      icon: '👠',
      dark: true
    },
    filmstrip: {
      id: 'filmstrip',
      title: 'Filmstrip',
      subtitle: '35mm cinema reel darkroom with sprocket hole border',
      track: 'visual',
      badge: 'PRO',
      accentColor: '#ea580c',
      gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1c0f0a 100%)',
      icon: '🎞️',
      dark: true
    },
    biennale: {
      id: 'biennale',
      title: 'Biennale',
      subtitle: 'Venice international art exhibition curatorial catalogue',
      track: 'visual',
      badge: 'PRO',
      accentColor: '#dc2626',
      gradient: 'linear-gradient(135deg, #ffffff 0%, #fee2e2 100%)',
      icon: '🏛️',
      dark: false
    },
    sketchbook: {
      id: 'sketchbook',
      title: 'Sketchbook',
      subtitle: 'Graphite pencil sketches and textured kraft paper',
      track: 'visual',
      badge: 'PRO',
      accentColor: '#57534e',
      gradient: 'linear-gradient(135deg, #fbfbf9 0%, #f5f5f4 100%)',
      icon: '✏️',
      dark: false
    },
    pavilion: {
      id: 'pavilion',
      title: 'Pavilion',
      subtitle: 'Architectural spatial pavilion with ambient geometry',
      track: 'visual',
      badge: 'PRO',
      accentColor: '#059669',
      gradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      icon: '🏛️',
      dark: false
    },
    documenta: {
      id: 'documenta',
      title: 'Documenta',
      subtitle: 'Curatorial research archive with archival notes',
      track: 'visual',
      badge: 'PRO',
      accentColor: '#2563eb',
      gradient: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      icon: '📚',
      dark: false
    },
    triennale: {
      id: 'triennale',
      title: 'Triennale',
      subtitle: 'Milanese industrial design exposition catalogue',
      track: 'visual',
      badge: 'PRO',
      accentColor: '#0d9488',
      gradient: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
      icon: '📐',
      dark: false
    },
    salon: {
      id: 'salon',
      title: 'Salon',
      subtitle: 'Emerald gilded gallery with gold leaf ornaments',
      track: 'visual',
      badge: 'PRO',
      accentColor: '#10b981',
      gradient: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)',
      icon: '🖼️',
      dark: true
    },
    illustra: {
      id: 'illustra',
      title: 'Illustra',
      subtitle: 'Modern mixed-media illustration and graphic art grid',
      track: 'visual',
      badge: 'PRO',
      accentColor: '#f43f5e',
      gradient: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
      icon: '🌺',
      dark: false
    },
    techno: {
      id: 'techno',
      title: 'Techno',
      subtitle: 'Berlin creative tech laboratory with dynamic soundwaves',
      track: 'visual',
      badge: 'FEATURED',
      accentColor: '#a855f7',
      gradient: 'linear-gradient(135deg, #0b0716 0%, #2e1065 100%)',
      icon: '✳️',
      dark: true
    },
    analog: {
      id: 'analog',
      title: 'Analog',
      subtitle: 'Dark vintage desk collage with physical artifacts',
      track: 'visual',
      badge: 'PRO',
      accentColor: '#d97706',
      gradient: 'linear-gradient(135deg, #14120e 0%, #261f14 100%)',
      icon: '🎞️',
      dark: true
    },
    mythos: {
      id: 'mythos',
      title: 'Mythos',
      subtitle: 'Cosmic violet classical sculpture and celestial sphere',
      track: 'visual',
      badge: 'PRO',
      accentColor: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #0c071e 0%, #241142 100%)',
      icon: '🏛️',
      dark: true
    },
    suki: {
      id: 'suki',
      title: 'Suki',
      subtitle: 'Cyber Tokyo video director with neon HUD interface',
      track: 'visual',
      badge: 'FEATURED',
      accentColor: '#06b6d4',
      gradient: 'linear-gradient(135deg, #08101e 0%, #0c233c 100%)',
      icon: '🎬',
      dark: true
    },
    lo: {
      id: 'lo',
      title: 'Lo',
      subtitle: 'Multidisciplinary maker narrative with seamless art tiles',
      track: 'visual',
      badge: 'FEATURED',
      accentColor: '#ec4899',
      gradient: 'linear-gradient(135deg, #0f0f12 0%, #23121d 100%)',
      icon: '🎨',
      dark: true
    },
    mara: {
      id: 'mara',
      title: 'Mara',
      subtitle: 'High-contrast art director with wipe motion interactions',
      track: 'visual',
      badge: 'FEATURED',
      accentColor: '#ff4d00',
      gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1f1105 100%)',
      icon: '🖤',
      dark: true
    }
  };

  const CATALOG = { ...DEV_THEMES, ...VISUAL_THEMES };

  return {
    CATALOG,
    version: '1.0.0'
  };
});
