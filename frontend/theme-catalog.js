/**
 * Portfoolio Theme Showcase Catalog
 * Rich metadata, designer attribution, engagement metrics & visual palettes
 * Inspired by Dribbble / Mobbin / Framer showcase galleries.
 */
(function(root, factory) {
  const lib = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = lib;
  }
  if (root) {
    root.PortfoolioThemeCatalog = lib;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';

  
  
  const TECH_AUTHORS = {
    midnight: { name: 'Kakha Kakhadzen', handle: '@kakhakhadze', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', initials: 'KK' },
    minimal: { name: 'Type08 (Alen Pavlovic)', handle: '@type08', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', initials: 'AP' },
    terminal: { name: 'Elliot Alderson', handle: '@mrrobot', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80', initials: 'EA' },
    creative: { name: 'Studio Pigment', handle: '@pigment', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', initials: 'SP' },
    aurora: { name: 'Jeroen van Eerden', handle: '@jeroen', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80', initials: 'JE' },
    editorial: { name: 'Monotype Atelier', handle: '@atelier_mono', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80', initials: 'MA' },
    brutalist: { name: 'BrutalLab', handle: '@brutallab', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80', initials: 'BL' },
    afterglow: { name: 'Sunset Collective', handle: '@afterglow', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80', initials: 'SC' },
    ultraviolet: { name: 'CyberPulse', handle: '@cyberpulse', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80', initials: 'CP' },
    tidepool: { name: 'DeepOcean Studios', handle: '@deepocean', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80', initials: 'DO' },
    darkpro: { name: 'Vercel Craft', handle: '@vercel_style', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80', initials: 'VC' },
    fullpage: { name: 'Horizontal Studio', handle: '@fullpage', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80', initials: 'HS' },
    moderncv: { name: 'Swiss Gridworks', handle: '@swissgrid', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80', initials: 'SG' },
    ultracode: { name: 'Crimson IDE', handle: '@crimsoncode', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80', initials: 'CI' },
    devblue: { name: 'Stripe Press', handle: '@stripe_press', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&q=80', initials: 'SP' },
    cube: { name: 'ThreeJS Collective', handle: '@three_cube', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=120&q=80', initials: '3C' },
    nova: { name: 'Cosmos Design', handle: '@cosmos', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=120&q=80', initials: 'CD' },
    codeflow: { name: 'Systems Lab', handle: '@systems_lab', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80', initials: 'SL' },
    wave: { name: 'Synthwave Digital', handle: '@synthwave', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=120&q=80', initials: 'SD' },
    assistant: { name: 'OpenAI Foundry', handle: '@ai_foundry', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80', initials: 'AI' },
    console: { name: 'Shell Protocol', handle: '@shell_proto', avatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=120&q=80', initials: 'SP' },
    snowcard: { name: 'Dotted Studio', handle: '@snowcard', avatar: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?auto=format&fit=crop&w=120&q=80', initials: 'DS' },
    parchment: { name: 'Bodoni Antiqua', handle: '@bodoni', avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=120&q=80', initials: 'BA' },
    cloud: { name: 'Tailwind Labs', handle: '@tailwind_ui', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80', initials: 'TL' },
    github: { name: 'Octocat Foundry', handle: '@octocat', avatar: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=120&q=80', initials: 'GH' },
    particle: { name: 'WebGL Matrix', handle: '@particle_lab', avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=120&q=80', initials: 'WM' },
    panels: { name: 'Linear App Design', handle: '@linear_craft', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', initials: 'LD' },
    monolith: { name: 'Bauhaus Werkstatt', handle: '@bauhaus', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', initials: 'BW' },
    editor: { name: 'VS Code Team', handle: '@vscode_craft', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80', initials: 'VC' },
    magazine: { name: 'Condé Nast Digital', handle: '@magazine_lab', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80', initials: 'CN' },
    bold: { name: 'Lime & Obsidian', handle: '@bold_mode', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80', initials: 'LO' },
    clean: { name: 'Cupertino Minimal', handle: '@clean_pro', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80', initials: 'CM' },
    vibrant: { name: 'Rainbow Prism', handle: '@vibrant_ui', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80', initials: 'RP' },
    neon: { name: 'NightCity 2077', handle: '@nightcity', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80', initials: 'NC' },
    hacker: { name: 'Matrix Core', handle: '@hacker_crt', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80', initials: 'MC' }
  };

  const DEV_THEMES = {
    midnight: {
      id: 'midnight',
      tags: ["dark","developer","neon","cyber","particles"],
      likes: 84,
      views: '13.8k', author: TECH_AUTHORS['midnight'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["light","clean","swiss","minimal","ats","typography"],
      likes: 68,
      views: '11.2k', author: TECH_AUTHORS['minimal'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["hacker","retro","terminal","dark","matrix","green"],
      likes: 92,
      views: '14.5k', author: TECH_AUTHORS['terminal'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["colorful","gradient","playful","art","portfolio"],
      likes: 77,
      views: '9.8k', author: TECH_AUTHORS['creative'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["glass","pastel","glow","modern","clean"],
      likes: 118,
      views: '16.4k', author: TECH_AUTHORS['aurora'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["serif","classic","print","monograph","editorial"],
      likes: 54,
      views: '8.2k', author: TECH_AUTHORS['editorial'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["bold","heavy","neo-brutalist","high-contrast","pop"],
      likes: 89,
      views: '12.1k', author: TECH_AUTHORS['brutalist'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["sunset","orange","warm","neon","dark"],
      likes: 63,
      views: '9.4k', author: TECH_AUTHORS['afterglow'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["purple","violet","electric","glow","cyber"],
      likes: 95,
      views: '14.0k', author: TECH_AUTHORS['ultraviolet'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["cyan","teal","ocean","bioluminescent","dark"],
      likes: 58,
      views: '7.9k', author: TECH_AUTHORS['tidepool'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["sleek","dark","yellow","pro","modern"],
      likes: 132,
      views: '19.3k', author: TECH_AUTHORS['darkpro'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["snap","fullpage","slider","red","presentation"],
      likes: 71,
      views: '10.5k', author: TECH_AUTHORS['fullpage'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["resume","cv","executive","bilingual","clean"],
      likes: 145,
      views: '22.1k', author: TECH_AUTHORS['moderncv'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["ide","crimson","code","sidebar","developer"],
      likes: 83,
      views: '11.7k', author: TECH_AUTHORS['ultracode'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["royal-blue","corporate","clean","stripe","systems"],
      likes: 104,
      views: '15.6k', author: TECH_AUTHORS['devblue'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["3d","interactive","cube","mint","threejs"],
      likes: 112,
      views: '17.8k', author: TECH_AUTHORS['cube'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["galaxy","particles","teal","space","cosmos"],
      likes: 128,
      views: '18.9k', author: TECH_AUTHORS['nova'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["tabs","code-snippets","dark","architecture","systems"],
      likes: 97,
      views: '13.2k', author: TECH_AUTHORS['codeflow'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["synthwave","emerald","laser","glow","3d"],
      likes: 110,
      views: '15.1k', author: TECH_AUTHORS['wave'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["chatgpt","ai","conversational","bot","dark"],
      likes: 165,
      views: '26.4k', author: TECH_AUTHORS['assistant'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["shell","workstation","ide","amber","terminal"],
      likes: 79,
      views: '10.8k', author: TECH_AUTHORS['console'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["dotted-grid","yellow","clean","white","tabs"],
      likes: 86,
      views: '11.9k', author: TECH_AUTHORS['snowcard'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["antique","scroll","sepia","serif","vintage"],
      likes: 52,
      views: '7.4k', author: TECH_AUTHORS['parchment'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["sky-blue","friendly","rounded","light","clean"],
      likes: 94,
      views: '13.6k', author: TECH_AUTHORS['cloud'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["octocat","pinned-repos","dark","developer","open-source"],
      likes: 178,
      views: '28.5k', author: TECH_AUTHORS['github'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["webgl","3d-canvas","constellation","dual-hero","futuristic"],
      likes: 142,
      views: '21.0k', author: TECH_AUTHORS['particle'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["linear","tabbed","purple","modern","product"],
      likes: 115,
      views: '16.7k', author: TECH_AUTHORS['panels'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["bauhaus","heavy-borders","bold","black","monumental"],
      likes: 73,
      views: '10.2k', author: TECH_AUTHORS['monolith'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["vs-code","ide","file-tree","copilot","dark"],
      likes: 188,
      views: '31.2k', author: TECH_AUTHORS['editor'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["fraunces","drop-cap","literary","editorial","warm"],
      likes: 88,
      views: '12.8k', author: TECH_AUTHORS['magazine'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["lime","obsidian","high-contrast","electric","punchy"],
      likes: 99,
      views: '14.3k', author: TECH_AUTHORS['bold'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["pill-nav","soft-shadows","cupertino","clean","light"],
      likes: 121,
      views: '18.0k', author: TECH_AUTHORS['clean'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["spectrum","rainbow","lilac","smooth","modern"],
      likes: 85,
      views: '11.5k', author: TECH_AUTHORS['vibrant'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["cyberpunk","laser","3d-floor","nightcity","pink"],
      likes: 156,
      views: '24.1k', author: TECH_AUTHORS['neon'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["crt-scanlines","phosphor","matrix","terminal","retro"],
      likes: 103,
      views: '15.8k', author: TECH_AUTHORS['hacker'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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

  
  
  const VISUAL_AUTHORS = {
    gallery: { name: 'MoMA Digital', handle: '@moma_digital', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80', initials: 'MD' },
    studio: { name: 'Aperture & Co', handle: '@aperture', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80', initials: 'AC' },
    noir: { name: 'Cinema Vérité', handle: '@noir_film', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&q=80', initials: 'CV' },
    museum: { name: 'Louvre Curatorial', handle: '@museum_arch', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=120&q=80', initials: 'LC' },
    catalog: { name: 'Swiss Art Book', handle: '@catalog_press', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=120&q=80', initials: 'SA' },
    bloom: { name: 'Flora Pastels', handle: '@bloom_dream', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80', initials: 'FP' },
    motion: { name: 'Framer MCP', handle: '@framer_mcp', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=120&q=80', initials: 'FM' },
    atelier: { name: 'Haute Couture Studio', handle: '@atelier_paris', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80', initials: 'HC' },
    cinema: { name: 'A24 Aesthetics', handle: '@cinema_239', avatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=120&q=80', initials: 'A2' },
    arch: { name: 'Foster & Partners', handle: '@arch_draft', avatar: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?auto=format&fit=crop&w=120&q=80', initials: 'FP' },
    zine: { name: 'Risograph Press', handle: '@risozine', avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=120&q=80', initials: 'RP' },
    zen: { name: 'Kyoto Ceramics', handle: '@wabisabi_zen', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80', initials: 'KC' },
    desire: { name: 'Aurélis Design', handle: '@aurelis_craft', avatar: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=120&q=80', initials: 'AD' },
    lumina: { name: 'Prism Optics', handle: '@lumina_glass', avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=120&q=80', initials: 'PO' },
    vogue: { name: 'Vogue Runway', handle: '@vogue_editorial', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', initials: 'VR' },
    filmstrip: { name: 'Kodak Darkroom', handle: '@filmstrip35', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', initials: 'KD' },
    biennale: { name: 'Venice Biennale', handle: '@biennale_art', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80', initials: 'VB' },
    sketchbook: { name: 'Moleskine Atelier', handle: '@sketchbook_art', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80', initials: 'MA' },
    pavilion: { name: 'Serpentine Pavilion', handle: '@pavilion_arch', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80', initials: 'SP' },
    documenta: { name: 'Kassel Curatorial', handle: '@documenta_kassel', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80', initials: 'KC' },
    triennale: { name: 'Milan Triennale', handle: '@triennale_milano', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80', initials: 'MT' },
    salon: { name: 'Emerald Salon', handle: '@salon_gilded', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80', initials: 'ES' },
    illustra: { name: 'Collage Collective', handle: '@illustra_mag', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80', initials: 'CC' },
    techno: { name: 'Creative Tech Lab', handle: '@techno_berlin', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80', initials: 'TL' },
    analog: { name: 'Vintage Desk Studio', handle: '@analog_desk', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80', initials: 'VD' },
    mythos: { name: 'Celestial Classical', handle: '@mythos_sculpt', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&q=80', initials: 'CC' },
    suki: { name: 'Suki Tokyo', handle: '@suki_tokyo', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=120&q=80', initials: 'ST' },
    lo: { name: 'Lo Studios', handle: '@lo_maker', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=120&q=80', initials: 'LS' },
    mara: { name: 'Mara Art Direction', handle: '@mara_director', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80', initials: 'MD' }
  };

  const VISUAL_THEMES = {
    gallery: {
      id: 'gallery',
      tags: ["masonry","fine-art","photography","grid","visual"],
      likes: 91,
      views: '13.4k',
      author: VISUAL_AUTHORS['gallery'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["editorial","covers","daylight","magazine","art"],
      likes: 82,
      views: '11.9k',
      author: VISUAL_AUTHORS['studio'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["monochrome","black-and-white","cinematic","full-bleed"],
      likes: 107,
      views: '16.2k',
      author: VISUAL_AUTHORS['noir'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["framed","walls","classic","curatorial","serene"],
      likes: 74,
      views: '10.1k',
      author: VISUAL_AUTHORS['museum'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["plates","swiss","art-book","publication","clean"],
      likes: 66,
      views: '8.9k',
      author: VISUAL_AUTHORS['catalog'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["pastel","dreamscape","ethereal","soft-blur","blush"],
      likes: 93,
      views: '13.7k',
      author: VISUAL_AUTHORS['bloom'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["framer","fluid","kinetic","gradients","animation"],
      likes: 162,
      views: '25.0k',
      author: VISUAL_AUTHORS['motion'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["haute-couture","luxury","serif","fashion","editorial"],
      likes: 114,
      views: '17.3k',
      author: VISUAL_AUTHORS['atelier'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["widescreen","a24","hud","stills","cinematic"],
      likes: 139,
      views: '22.8k',
      author: VISUAL_AUTHORS['cinema'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["architectural","blueprint","plates","drafting","geometry"],
      likes: 78,
      views: '11.0k',
      author: VISUAL_AUTHORS['arch'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["risograph","indie","print","washi-tape","diy"],
      likes: 96,
      views: '13.9k',
      author: VISUAL_AUTHORS['zine'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["wabi-sabi","stone","ceramic","calm","earthy"],
      likes: 87,
      views: '12.4k',
      author: VISUAL_AUTHORS['zen'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["digital-design","loupe","orange","interactive","agency"],
      likes: 149,
      views: '23.5k',
      author: VISUAL_AUTHORS['desire'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["prism","holographic","iridescent","glassmorphism"],
      likes: 124,
      views: '18.6k',
      author: VISUAL_AUTHORS['lumina'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["didot","high-fashion","editorial","runway","chic"],
      likes: 118,
      views: '17.5k',
      author: VISUAL_AUTHORS['vogue'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["35mm","cinema-reel","darkroom","sprockets","analog"],
      likes: 98,
      views: '14.7k',
      author: VISUAL_AUTHORS['filmstrip'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["venice","exhibition","contemporary","art","international"],
      likes: 89,
      views: '12.9k',
      author: VISUAL_AUTHORS['biennale'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["graphite","charcoal","moleskine","texture","hand-drawn"],
      likes: 83,
      views: '11.8k',
      author: VISUAL_AUTHORS['sketchbook'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["serpentine","spatial","geometry","architecture","ambient"],
      likes: 79,
      views: '10.9k',
      author: VISUAL_AUTHORS['pavilion'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["archive","curatorial","research","notes","scholarly"],
      likes: 72,
      views: '9.7k',
      author: VISUAL_AUTHORS['documenta'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["milan","industrial-design","exposition","geometric"],
      likes: 81,
      views: '11.4k',
      author: VISUAL_AUTHORS['triennale'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["gilded","gold-leaf","emerald","palatial","ornate"],
      likes: 95,
      views: '13.8k',
      author: VISUAL_AUTHORS['salon'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["mixed-media","collage","vibrant","vector","illustration"],
      likes: 90,
      views: '12.7k',
      author: VISUAL_AUTHORS['illustra'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["berlin","generative","soundwaves","creative-tech","club"],
      likes: 134,
      views: '20.3k',
      author: VISUAL_AUTHORS['techno'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["desk-collage","vintage","dark-wood","artifacts","warm"],
      likes: 105,
      views: '15.9k',
      author: VISUAL_AUTHORS['analog'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["classical-sculpture","celestial","violet","statue","cosmic"],
      likes: 112,
      views: '16.8k',
      author: VISUAL_AUTHORS['mythos'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["video-director","tokyo","neon-hud","timeline","motion"],
      likes: 151,
      views: '23.9k',
      author: VISUAL_AUTHORS['suki'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["multidisciplinary","maker","seamless-tiles","narrative","craft"],
      likes: 147,
      views: '22.4k',
      author: VISUAL_AUTHORS['lo'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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
      tags: ["art-director","wipe-motion","high-contrast","portrait","bold"],
      likes: 173,
      views: '27.6k',
      author: VISUAL_AUTHORS['mara'] || { name: 'Portfoolio Studio', handle: '@portfoolio', initials: 'PF' },
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

  
  
  function getThemeShotHtml(themeId, meta) {
    const id = (themeId || 'midnight').toLowerCase();
    const title = (meta && meta.title) || id;
    const author = (meta && meta.author) || { name: 'Creator', handle: '@creator' };

    switch(id) {
      case 'midnight':
        return `
          <div class="shot-chrome"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">alex.portfoolio.me</span></div>
          <div class="shot-body shot-midnight-body">
            <div class="shot-hero-row">
              <div class="shot-avatar-glow" style="background:linear-gradient(135deg,#38bdf8,#818cf8)"></div>
              <div>
                <div class="shot-badge-cyan">SYSTEMS ARCHITECT</div>
                <div class="shot-heading-white">Alex Vance</div>
              </div>
            </div>
            <div class="shot-code-preview">
              <span class="shot-token-kw">const</span> <span class="shot-token-fn">cluster</span> = <span class="shot-token-kw">new</span> <span class="shot-token-cls">HyperMesh</span>();
            </div>
            <div class="shot-pills">
              <span class="shot-pill">React</span><span class="shot-pill">Rust</span><span class="shot-pill">Three.js</span>
            </div>
          </div>`;

      case 'minimal':
        return `
          <div class="shot-chrome light"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">nordic.portfoolio.me</span></div>
          <div class="shot-body shot-minimal-body">
            <div class="shot-badge-mono">SWISS ARCHITECTURE</div>
            <div class="shot-heading-black">ANNA LINDQVIST</div>
            <div class="shot-sub-gray">Principal Design Engineer • Stockholm</div>
            <div class="shot-table-mock">
              <div class="shot-table-row"><span>01 / DESIGN SYSTEMS</span><span>2026</span></div>
              <div class="shot-table-row"><span>02 / INTERACTION LAB</span><span>2025</span></div>
            </div>
          </div>`;

      case 'terminal':
        return `
          <div class="shot-chrome dark"><span class="sc-dot sc-red"></span><span class="sc-dot sc-yellow"></span><span class="sc-dot sc-green"></span><span class="sc-url">dev@mainframe:~#</span></div>
          <div class="shot-body shot-terminal-body">
            <div class="shot-term-prompt"><span class="term-green">guest@mainframe:~$</span> <span class="term-white">cat profile.sh</span></div>
            <div class="shot-term-banner">
              [+] DEV: Elliot Alderson<br>
              [+] ROLE: Cyber Security & Kernel Dev<br>
              [+] STATUS: 99.99% Uptime • Zero Bugs
            </div>
            <div class="shot-term-cursor">> _</div>
          </div>`;

      case 'creative':
        return `
          <div class="shot-chrome pop"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">sarah.portfoolio.me</span></div>
          <div class="shot-body shot-creative-body">
            <span class="shot-badge-pink">CREATIVE TECH</span>
            <div class="shot-heading-pop">Sarah Chen 🎨</div>
            <div class="shot-sub-pop">Making the web delightfully playful</div>
            <div class="shot-cards-row">
              <div class="shot-mini-card pink">✨ 3D Canvas</div>
              <div class="shot-mini-card purple">🔮 Fluid GSAP</div>
            </div>
          </div>`;

      case 'aurora':
        return `
          <div class="shot-chrome glass"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">aurora.portfoolio.me</span></div>
          <div class="shot-body shot-aurora-body">
            <div class="shot-aurora-orb"></div>
            <div class="shot-glass-card">
              <div class="shot-badge-glass">FROSTED GLASS</div>
              <div class="shot-heading-glass">Elena Rostova</div>
              <div class="shot-sub-glass">Spatial UX & Design Systems</div>
              <div class="shot-glass-stats"><span>12 Projects</span> • <span>98 ATS</span></div>
            </div>
          </div>`;

      case 'editorial':
        return `
          <div class="shot-chrome paper"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">gazette.portfoolio.me</span></div>
          <div class="shot-body shot-editorial-body">
            <div class="shot-vol-tag">VOL. IV • PARIS EDITIONS</div>
            <div class="shot-heading-serif">THE MONOGRAPH</div>
            <div class="shot-serif-author">By Claire Fontaine • Typographer</div>
            <div class="shot-editorial-cols">
              <p>Refined print calm with classical serifs and balanced proportions.</p>
            </div>
          </div>`;

      case 'brutalist':
        return `
          <div class="shot-chrome brutal"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">RAW.DEV</span></div>
          <div class="shot-body shot-brutalist-body">
            <div class="shot-brutal-badge">NO COMPROMISE</div>
            <div class="shot-heading-brutal">BRUTAL.CRAFT</div>
            <div class="shot-sub-brutal">HARD EDGES • ZERO OPACITY</div>
            <button type="button" class="shot-brutal-btn">HIRE NOW →</button>
          </div>`;

      case 'moderncv':
        return `
          <div class="shot-chrome light"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">cv.portfoolio.me</span></div>
          <div class="shot-body shot-moderncv-body">
            <div class="shot-moderncv-split">
              <div class="shot-moderncv-col left">
                <div class="shot-avatar-circle" style="background:#4f46e5;color:#fff">JC</div>
                <div class="shot-moderncv-name">Julian Croft</div>
                <div class="shot-moderncv-role">Principal Architect</div>
                <div class="shot-pill-mini">EN / FR Bilingual</div>
              </div>
              <div class="shot-moderncv-col right">
                <div class="shot-timeline-item">
                  <span class="timeline-dot"></span>
                  <div class="timeline-title">Staff Eng @ Stripe</div>
                  <div class="timeline-sub">2022 — Pres • Core Ledger</div>
                </div>
                <div class="shot-timeline-item">
                  <span class="timeline-dot"></span>
                  <div class="timeline-title">Senior Dev @ Google</div>
                  <div class="timeline-sub">2019 — 2022 • Cloud Fleet</div>
                </div>
              </div>
            </div>
          </div>`;

      case 'ultracode':
        return `
          <div class="shot-chrome dark"><span class="sc-dot sc-red"></span><span class="sc-dot sc-yellow"></span><span class="sc-dot sc-green"></span><span class="sc-url">VS Code — Portfoolio</span></div>
          <div class="shot-body shot-ultracode-body">
            <div class="shot-ide-tabs">
              <span class="ide-tab active">cluster.go ✕</span>
              <span class="ide-tab">schema.graphql</span>
            </div>
            <div class="shot-ide-editor">
              <div class="ide-code-line"><span class="ide-kw">func</span> <span class="ide-fn">StartCluster</span>(nodes <span class="ide-type">int</span>) <span class="ide-type">error</span> {</div>
              <div class="ide-code-line indent"><span class="ide-var">mesh</span> := <span class="ide-pkg">wire</span>.<span class="ide-fn">NewMesh</span>()</div>
              <div class="ide-code-line indent"><span class="ide-kw">return</span> <span class="ide-var">mesh</span>.<span class="ide-fn">Deploy</span>(nodes)</div>
              <div class="ide-code-line">}</div>
            </div>
            <div class="shot-ide-status">
              <span>⚡ Ready • Git: main*</span>
              <span class="ide-status-lang">Go 1.22</span>
            </div>
          </div>`;

      case 'devblue':
        return `
          <div class="shot-chrome blue"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">stripe-press.portfoolio.me</span></div>
          <div class="shot-body shot-devblue-body">
            <div class="shot-badge-royal">ENGINEERING LEAD</div>
            <div class="shot-heading-white">David Miller</div>
            <div class="shot-devblue-metrics">
              <div class="metric-chip"><span class="metric-val">12M+</span> QPS</div>
              <div class="metric-chip"><span class="metric-val">99.999%</span> SLA</div>
            </div>
            <div class="shot-devblue-cards">
              <div class="devblue-card"><span>Global Ledger Mesh</span> →</div>
            </div>
          </div>`;

      case 'cube':
        return `
          <div class="shot-chrome dark"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">cube3d.portfoolio.me</span></div>
          <div class="shot-body shot-cube-body">
            <div class="shot-cube-visual">
              <div class="cube-wireframe"></div>
            </div>
            <div class="shot-cube-info">
              <span class="cube-tag">3D PERSPECTIVE SLIDER</span>
              <div class="shot-heading-mint">Muzammal Creative</div>
              <div class="cube-controls">◄ 01 / 03 ►</div>
            </div>
          </div>`;

      case 'nova':
        return `
          <div class="shot-chrome space"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">cosmos.portfoolio.me</span></div>
          <div class="shot-body shot-nova-body">
            <div class="shot-nova-orb"></div>
            <div class="shot-badge-cyan">ORBIT ARCHITECTURE</div>
            <div class="shot-heading-white">Nova Galaxy</div>
            <div class="shot-sub-gray">Deep Cosmic Navy Particle Mesh</div>
            <div class="shot-nova-cards">
              <span class="nova-chip">🪐 Nebula DB</span>
              <span class="nova-chip">✨ Starlight CDN</span>
            </div>
          </div>`;

      case 'codeflow':
        return `
          <div class="shot-chrome dark"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">pipeline.portfoolio.me</span></div>
          <div class="shot-body shot-codeflow-body">
            <div class="shot-flow-tabs">
              <span class="flow-tab active">Architecture.rs</span>
              <span class="flow-tab">Telemetry.ts</span>
            </div>
            <div class="shot-flow-diagram">
              <span class="flow-node">Ingest</span>
              <span class="flow-arrow">➔</span>
              <span class="flow-node">Kafka</span>
              <span class="flow-arrow">➔</span>
              <span class="flow-node">Spark</span>
            </div>
            <div class="shot-pills">
              <span class="shot-pill">Rust</span><span class="shot-pill">Distributed</span>
            </div>
          </div>`;

      case 'wave':
        return `
          <div class="shot-chrome dark"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">waveform.portfoolio.me</span></div>
          <div class="shot-body shot-wave-body">
            <div class="shot-wave-svg">
              <svg viewBox="0 0 100 25" class="wave-lines"><path d="M0 12 Q25 0 50 12 T100 12" fill="none" stroke="#6366f1" stroke-width="2.5"/></svg>
            </div>
            <div class="shot-heading-white">Waveform Labs</div>
            <div class="shot-sub-gray">Audio DSP & Neural Synthesizers</div>
            <div class="shot-wave-meters">
              <span class="meter-bar active">-12dB</span><span class="meter-bar active">-6dB</span><span class="meter-bar">0dB</span>
            </div>
          </div>`;

      case 'assistant':
        return `
          <div class="shot-chrome light"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">alex.ai.portfoolio.me</span></div>
          <div class="shot-body shot-assistant-body">
            <div class="shot-ai-chat-bubble">
              <span class="ai-sparkle">✦</span> Ask me about Alex's systems experience...
            </div>
            <div class="shot-ai-prompt-pills">
              <span class="ai-prompt">View Projects</span>
              <span class="ai-prompt">Cloud Fleet</span>
            </div>
          </div>`;

      case 'console':
        return `
          <div class="shot-chrome dark"><span class="sc-dot sc-green"></span><span class="sc-url">ARCADE-88 // OS</span></div>
          <div class="shot-body shot-console-body">
            <div class="console-hud">SCORE: 99420 • LIVES: ❤❤❤</div>
            <div class="console-title">[STAGE 1: FULLSTACK]</div>
            <div class="console-bar"><div class="console-progress"></div></div>
            <div class="console-status">READY PLAYER ONE</div>
          </div>`;

      case 'snowcard':
        return `
          <div class="shot-chrome light"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">nordic.portfoolio.me</span></div>
          <div class="shot-body shot-snowcard-body">
            <div class="shot-snow-card">
              <div class="shot-badge-mono">PRODUCT DESIGN</div>
              <div class="shot-heading-black">Freja Lindqvist</div>
              <div class="shot-sub-gray">Subtle Frosted Nordic Glass</div>
              <div class="shot-pills">
                <span class="shot-pill dark">Figma</span><span class="shot-pill dark">Systems</span>
              </div>
            </div>
          </div>`;

      case 'parchment':
        return `
          <div class="shot-chrome antique"><span class="sc-dot"></span><span class="sc-url">chronicle.portfoolio.me</span></div>
          <div class="shot-body shot-parchment-body">
            <div class="parchment-seal">✦</div>
            <div class="shot-heading-serif">The Chronicle of Works</div>
            <div class="serif-author">Master Craftsman • Est. MMXXVI</div>
            <div class="parchment-line"></div>
          </div>`;

      case 'cloud':
        return `
          <div class="shot-chrome cloud"><span class="sc-dot"></span><span class="sc-url">cloud.portfoolio.me</span></div>
          <div class="shot-body shot-cloud-body">
            <div class="shot-cloud-pill">☁ 99.99% RESILIENT</div>
            <div class="shot-heading-white">Cloud Architecture</div>
            <div class="shot-pills">
              <span class="shot-pill">AWS</span><span class="shot-pill">Kubernetes</span><span class="shot-pill">Terraform</span>
            </div>
          </div>`;

      case 'github':
        return `
          <div class="shot-chrome dark"><span class="sc-dot"></span><span class="sc-url">github.com/alexvance</span></div>
          <div class="shot-body shot-github-body">
            <div class="gh-header">
              <div class="gh-avatar">AV</div>
              <div>
                <div class="gh-name">Alex Vance</div>
                <div class="gh-bio">Staff Systems Engineer • OSS Author</div>
              </div>
            </div>
            <div class="gh-card">
              <div class="gh-repo">★ 1.4k • hypermesh-db</div>
              <div class="gh-desc">High performance graph telemetry in Rust</div>
            </div>
          </div>`;

      case 'particle':
        return `
          <div class="shot-chrome dark"><span class="sc-dot"></span><span class="sc-url">particles.portfoolio.me</span></div>
          <div class="shot-body shot-particle-body">
            <div class="particle-mesh">
              <span class="p-dot" style="top:20%;left:25%"></span>
              <span class="p-dot" style="top:40%;left:70%"></span>
              <span class="p-dot" style="top:70%;left:45%"></span>
            </div>
            <div class="shot-badge-cyan">INTERACTIVE PARTICLES</div>
            <div class="shot-heading-white">Neural Mesh</div>
            <div class="shot-sub-gray">Physics Simulation & Shaders</div>
          </div>`;

      case 'panels':
        return `
          <div class="shot-chrome"><span class="sc-dot"></span><span class="sc-url">panels.portfoolio.me</span></div>
          <div class="shot-body shot-panels-body">
            <div class="panels-grid">
              <div class="panel-slice p1"><span>Engineering</span></div>
              <div class="panel-slice p2"><span>Architecture</span></div>
              <div class="panel-slice p3"><span>Cloud</span></div>
            </div>
          </div>`;

      case 'monolith':
        return `
          <div class="shot-chrome dark"><span class="sc-dot"></span><span class="sc-url">MONOLITH.SYSTEM</span></div>
          <div class="shot-body shot-monolith-body">
            <div class="monolith-block">
              <div class="shot-heading-brutal">MONOLITH</div>
              <div class="monolith-sub">CONCRETE MATTE • SYSTEM 01</div>
            </div>
          </div>`;

      case 'editor':
        return `
          <div class="shot-chrome light"><span class="sc-dot"></span><span class="sc-url">workspace.portfoolio.me</span></div>
          <div class="shot-body shot-editor-body">
            <div class="vs-sidebar">
              <div class="vs-code"><span class="shot-token-kw">interface</span> Portfolio {</div>
              <div class="vs-code indent">name: <span class="shot-token-cls">"Alex Vance"</span>;</div>
              <div class="vs-code indent">role: <span class="shot-token-cls">"Systems Architect"</span>;</div>
              <div class="vs-code">}</div>
            </div>
          </div>`;

      case 'magazine':
        return `
          <div class="shot-chrome light"><span class="sc-dot"></span><span class="sc-url">magazine.portfoolio.me</span></div>
          <div class="shot-body shot-magazine-body">
            <div class="magazine-issue">ISSUE 42 • MILAN & NY</div>
            <div class="shot-heading-serif">VOGUE MODERN</div>
            <div class="magazine-author">Editorial Art Direction</div>
          </div>`;

      case 'bold':
        return `
          <div class="shot-chrome dark"><span class="sc-dot"></span><span class="sc-url">bold.portfoolio.me</span></div>
          <div class="shot-body shot-bold-body">
            <div class="shot-heading-lime">BOLD & DIRECT.</div>
            <div class="shot-sub-white">High impact engineering. Zero fluff.</div>
            <button type="button" class="bold-cta-btn">EXPLORE WORK →</button>
          </div>`;

      case 'clean':
        return `
          <div class="shot-chrome light"><span class="sc-dot"></span><span class="sc-url">clean.portfoolio.me</span></div>
          <div class="shot-body shot-clean-body">
            <div class="clean-rule"></div>
            <div class="shot-heading-black">ATS Clean Resume</div>
            <div class="shot-sub-gray">Maximum Recruiter & Reader Readability</div>
            <div class="shot-pills">
              <span class="shot-pill dark">Clean</span><span class="shot-pill dark">Fast</span>
            </div>
          </div>`;

      case 'vibrant':
        return `
          <div class="shot-chrome pop"><span class="sc-dot"></span><span class="sc-url">vibrant.portfoolio.me</span></div>
          <div class="shot-body shot-vibrant-body">
            <div class="shot-badge-pink">HYPER VIBRANT</div>
            <div class="shot-heading-white">Color Alchemy</div>
            <div class="shot-cards-row">
              <div class="shot-mini-card pink">★ 100% Vibrant</div>
              <div class="shot-mini-card purple">✦ Dynamic</div>
            </div>
          </div>`;

      case 'neon':
        return `
          <div class="shot-chrome dark"><span class="sc-dot sc-red"></span><span class="sc-url">neon.portfoolio.me</span></div>
          <div class="shot-body shot-neon-body">
            <div class="neon-glow-sign">NEON NIGHTS</div>
            <div class="neon-sub">Cyberpunk Tokyo Glow • 2026</div>
            <div class="shot-pills">
              <span class="neon-pill">CYBER</span><span class="neon-pill">GLOW</span>
            </div>
          </div>`;

      case 'hacker':
        return `
          <div class="shot-chrome dark"><span class="sc-dot sc-green"></span><span class="sc-url">matrix.portfoolio.me</span></div>
          <div class="shot-body shot-hacker-body">
            <div class="matrix-rain">01011001 01101010 11001010</div>
            <div class="hacker-box">
              <span class="term-green">[ACCESS GRANTED: ROOT]</span><br>
              <span class="term-white">Elliot Alderson // Kernel Hacker</span>
            </div>
          </div>`;

      case 'gallery':
        return `
          <div class="shot-chrome light"><span class="sc-dot"></span><span class="sc-url">gallery.portfoolio.me</span></div>
          <div class="shot-body shot-gallery-body">
            <div class="gallery-tag">EXHIBITION 2026</div>
            <div class="shot-heading-black">Form & Dimension</div>
            <div class="gallery-frames">
              <span class="art-frame f1"></span>
              <span class="art-frame f2"></span>
            </div>
          </div>`;

      case 'studio':
        return `
          <div class="shot-chrome light"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">studio.portfoolio.me</span></div>
          <div class="shot-body shot-studio-body">
            <div class="studio-mag-top">
              <span class="studio-issue">VOL. 04 / EDITORIAL</span>
              <span class="studio-loc">ZÜRICH • PARIS</span>
            </div>
            <div class="studio-hero-title">STUDIO MONOGRAPH</div>
            <div class="studio-mag-grid">
              <div class="studio-col-left">
                <div class="studio-lead-text">Selected works in creative direction, brand identity and spatial typography.</div>
                <div class="studio-client-tag">CLIENTS // NIKE • APPLE • STRIPE</div>
              </div>
              <div class="studio-col-right">
                <div class="studio-photo-mock">
                  <div class="studio-silhouette"></div>
                  <span class="studio-photo-label">FIG. 01 — ARCHETYPE</span>
                </div>
              </div>
            </div>
          </div>`;

      case 'noir':
        return `
          <div class="shot-chrome dark"><span class="sc-dot sc-red"></span><span class="sc-dot sc-yellow"></span><span class="sc-dot sc-green"></span><span class="sc-url">noir.portfoolio.me</span></div>
          <div class="shot-body shot-noir-body">
            <div class="noir-grain-overlay"></div>
            <div class="noir-top-bar">
              <span class="noir-aspect">35MM MONOCHROME</span>
              <span class="noir-year">EST. 2026</span>
            </div>
            <div class="noir-frame-center">
              <div class="noir-title">CINEMA VÉRITÉ</div>
              <div class="noir-subtitle">DIRECTED BY KAELEN CROSS</div>
            </div>
            <div class="noir-bottom-meta">
              <span>FULL BLEED</span>
              <span>HIGH CONTRAST</span>
              <span>ISO 400</span>
            </div>
          </div>`;

      case 'museum':
        return `
          <div class="shot-chrome museum"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">museum.portfoolio.me</span></div>
          <div class="shot-body shot-museum-body">
            <div class="museum-gallery-wall">
              <div class="museum-art-frame">
                <div class="museum-canvas-art">
                  <div class="canvas-color-block block-ochre"></div>
                  <div class="canvas-color-block block-cobalt"></div>
                </div>
              </div>
              <div class="museum-plaque">
                <div class="plaque-artist">JULIAN VANE</div>
                <div class="plaque-title">Composition in Ultramarine & Ochre, 2026</div>
                <div class="plaque-medium">Oil and cold wax on linen • Room 4B</div>
              </div>
            </div>
          </div>`;

      case 'catalog':
        return `
          <div class="shot-chrome swiss"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">catalog.portfoolio.me</span></div>
          <div class="shot-body shot-catalog-body">
            <div class="catalog-grid-header">
              <span class="catalog-swiss-mark">SWISS ART BOOK</span>
              <span class="catalog-plate-num">PLATE 04</span>
            </div>
            <div class="catalog-headline">CATALOGUE RAISONNÉ</div>
            <div class="catalog-two-plate">
              <div class="catalog-plate-item p1">
                <div class="catalog-thumb t1"></div>
                <span class="catalog-idx">NO. 104 / MONOLITH</span>
              </div>
              <div class="catalog-plate-item p2">
                <div class="catalog-thumb t2"></div>
                <span class="catalog-idx">NO. 105 / GEOMETRY</span>
              </div>
            </div>
          </div>`;

      case 'bloom':
        return `
          <div class="shot-chrome bloom"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">bloom.portfoolio.me</span></div>
          <div class="shot-body shot-bloom-body">
            <div class="bloom-gradient-mesh"></div>
            <div class="bloom-glass-card">
              <div class="bloom-badge">🌸 DREAMSCAPE</div>
              <div class="bloom-title">Aoi Tanaka</div>
              <div class="bloom-desc">Floral Poetics & Ambient Visuals</div>
              <div class="bloom-pills">
                <span>Pastel</span><span>Ambient</span><span>Serene</span>
              </div>
            </div>
          </div>`;

      case 'motion':
        return `
          <div class="shot-chrome dark"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">motion.portfoolio.me</span></div>
          <div class="shot-body shot-motion-body">
            <div class="motion-hud-top">
              <span class="motion-pill">120 FPS KINETIC</span>
              <span class="motion-timing">bezier(0.42, 0, 0.58, 1)</span>
            </div>
            <div class="motion-title">LEO VANCE</div>
            <div class="motion-sub">Creative Motion & Interaction Lab</div>
            <div class="motion-timeline-track">
              <div class="motion-curve-line"></div>
              <div class="motion-scrubber-point p1"></div>
              <div class="motion-scrubber-point p2"></div>
            </div>
          </div>`;

      case 'atelier':
        return `
          <div class="shot-chrome couture"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">atelier.portfoolio.me</span></div>
          <div class="shot-body shot-atelier-body">
            <div class="atelier-monogram">MAISON DELACROIX</div>
            <div class="atelier-rule-gold"></div>
            <div class="atelier-season">HAUTE COUTURE • PARIS</div>
            <div class="atelier-card-grid">
              <div class="atelier-card c1"><span>LOOK 01</span></div>
              <div class="atelier-card c2"><span>LOOK 02</span></div>
            </div>
            <div class="atelier-num">MMXXVI COLLECTION</div>
          </div>`;

      case 'arch':
        return `
          <div class="shot-chrome cad"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">arch.portfoolio.me</span></div>
          <div class="shot-body shot-arch-body">
            <div class="arch-blueprint-grid"></div>
            <div class="arch-top-meta">
              <span>ELEVATION A-A</span>
              <span>SCALE 1:50</span>
            </div>
            <div class="arch-drawing">
              <div class="arch-roof-truss"></div>
              <div class="arch-columns-wire"></div>
              <span class="arch-dimension-line"><i class="dim-arrow"></i> 32.4m <i class="dim-arrow"></i></span>
            </div>
            <div class="arch-title">SOREN KJAER ARCHITECTS</div>
          </div>`;

      case 'zine':
        return `
          <div class="shot-chrome riso"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">zine.portfoolio.me</span></div>
          <div class="shot-body shot-zine-body">
            <div class="zine-washi-tape"></div>
            <div class="zine-badge">DIY RISO // ISSUE 07</div>
            <div class="zine-cutout-title">PUNK & FORM</div>
            <div class="zine-halftone-box">
              <div class="zine-photo-duotone"></div>
              <span class="zine-caption">PHOTOCOPY ARCHIVE</span>
            </div>
          </div>`;

      case 'zen':
        return `
          <div class="shot-chrome washi"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">zen.portfoolio.me</span></div>
          <div class="shot-body shot-zen-body">
            <div class="zen-enso-circle"></div>
            <div class="zen-badge">間 • NEGATIVE SPACE</div>
            <div class="zen-title">KYOTO CERAMICS</div>
            <div class="zen-sub">Kenji Sato • Wabi-Sabi Studio</div>
            <div class="zen-stone-row"><span class="stone s1"></span><span class="stone s2"></span></div>
          </div>`;

      case 'lumina':
        return `
          <div class="shot-chrome glass"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">lumina.portfoolio.me</span></div>
          <div class="shot-body shot-lumina-body">
            <div class="lumina-prism-orb"></div>
            <div class="lumina-card">
              <div class="lumina-tag">PRISM & OPTICS</div>
              <div class="lumina-title">Zara Chen</div>
              <div class="lumina-sub">Refractive Spatial Graphics</div>
            </div>
          </div>`;

      case 'vogue':
        return `
          <div class="shot-chrome dark"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">vogue.portfoolio.me</span></div>
          <div class="shot-body shot-vogue-body">
            <div class="vogue-masthead">VOGUE</div>
            <div class="vogue-issue-bar">SEPTEMBER ISSUE • RUNWAY 2026</div>
            <div class="vogue-model-card">
              <div class="vogue-model-silhouette"></div>
              <div class="vogue-headline">HAUTE COUTURE & FUTURE FORM</div>
            </div>
          </div>`;

      case 'filmstrip':
        return `
          <div class="shot-chrome dark"><span class="sc-dot sc-red"></span><span class="sc-url">filmstrip.portfoolio.me</span></div>
          <div class="shot-body shot-filmstrip-body">
            <div class="film-sprockets top"><span></span><span></span><span></span><span></span><span></span><span></span></div>
            <div class="film-frame-center">
              <div class="film-kodak-mark">KODAK 400TX • 24A</div>
              <div class="film-photo-inner">
                <div class="film-title">DARIUS FINCH</div>
                <div class="film-sub">35mm Darkroom & Film Reel</div>
              </div>
            </div>
            <div class="film-sprockets bottom"><span></span><span></span><span></span><span></span><span></span><span></span></div>
          </div>`;

      case 'biennale':
        return `
          <div class="shot-chrome light"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">biennale.portfoolio.me</span></div>
          <div class="shot-body shot-biennale-body">
            <div class="biennale-red-stripe"></div>
            <div class="biennale-header">LA BIENNALE DI VENEZIA</div>
            <div class="biennale-sub">60TH INTERNATIONAL ART EXHIBITION</div>
            <div class="biennale-curator">Curated by Marco Bellini</div>
            <div class="biennale-box-grid"><span class="b-box">PAVILION 01</span><span class="b-box">PAVILION 02</span></div>
          </div>`;

      case 'sketchbook':
        return `
          <div class="shot-chrome paper"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">sketchbook.portfoolio.me</span></div>
          <div class="shot-body shot-sketchbook-body">
            <div class="sketch-rings"><i></i><i></i><i></i><i></i><i></i></div>
            <div class="sketch-page">
              <div class="sketch-tag">GRAPHITE & CHARCOAL</div>
              <div class="sketch-title">Ines Moreno</div>
              <div class="sketch-hatch-art">
                <div class="hatch-strokes"></div>
              </div>
              <div class="sketch-date">OCTOBER 2026 • SKETCHBOOK N° 12</div>
            </div>
          </div>`;

      case 'pavilion':
        return `
          <div class="shot-chrome arch"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">pavilion.portfoolio.me</span></div>
          <div class="shot-body shot-pavilion-body">
            <div class="pavilion-tag">SERPENTINE GALLERY PAVILION</div>
            <div class="pavilion-axonometric">
              <div class="pavilion-plane pl1"></div>
              <div class="pavilion-plane pl2"></div>
            </div>
            <div class="pavilion-title">ARIS THORNE ARCHITECTURE</div>
          </div>`;

      case 'documenta':
        return `
          <div class="shot-chrome light"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">documenta.portfoolio.me</span></div>
          <div class="shot-body shot-documenta-body">
            <div class="doc-stamp">ARCHIVE // DOC-XV</div>
            <div class="doc-title">KASSEL CURATORIAL</div>
            <div class="doc-sub">Hannah Weber • Research & Critical Studies</div>
            <div class="doc-table">
              <div class="doc-row"><span>01 / MANIFESTO</span><span>DOC.41</span></div>
              <div class="doc-row"><span>02 / DIALOGUES</span><span>DOC.42</span></div>
            </div>
          </div>`;

      case 'triennale':
        return `
          <div class="shot-chrome swiss"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">triennale.portfoolio.me</span></div>
          <div class="shot-body shot-triennale-body">
            <div class="triennale-badge">MILANO TRIENNALE</div>
            <div class="triennale-shapes">
              <div class="shape-circle-red"></div>
              <div class="shape-rect-black"></div>
            </div>
            <div class="triennale-title">LUCA ROSSI DESIGN</div>
          </div>`;

      case 'salon':
        return `
          <div class="shot-chrome dark"><span class="sc-dot sc-yellow"></span><span class="sc-url">salon.portfoolio.me</span></div>
          <div class="shot-body shot-salon-body">
            <div class="salon-gold-frame">
              <div class="salon-frame-inner">
                <div class="salon-spotlight"></div>
                <div class="salon-title">VERONIQUE S.</div>
                <div class="salon-sub">Gilded Salon & Classical Portraits</div>
              </div>
            </div>
          </div>`;

      case 'illustra':
        return `
          <div class="shot-chrome pop"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">illustra.portfoolio.me</span></div>
          <div class="shot-body shot-illustra-body">
            <div class="illustra-torn-edge"></div>
            <div class="illustra-botanical">🌺</div>
            <div class="illustra-title">MAYA SOL</div>
            <div class="illustra-sub">Mixed-Media & Editorial Collage</div>
          </div>`;

      case 'techno':
        return `
          <div class="shot-chrome dark"><span class="sc-dot sc-green"></span><span class="sc-url">techno.portfoolio.me</span></div>
          <div class="shot-body shot-techno-body">
            <div class="techno-matrix-grid"></div>
            <div class="techno-badge">GEN:ART // 0x7F4A</div>
            <div class="techno-title">DEXTER HOLT</div>
            <div class="techno-sub">Creative Technology & Generative Audio</div>
            <div class="techno-code-line">> initializing canvas shader [OK]</div>
          </div>`;

      case 'analog':
        return `
          <div class="shot-chrome wood"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">analog.portfoolio.me</span></div>
          <div class="shot-body shot-analog-body">
            <div class="analog-clip"></div>
            <div class="analog-polaroid">
              <div class="polaroid-photo"></div>
              <div class="polaroid-text">TOBY MERCER // 1994</div>
            </div>
          </div>`;

      case 'mythos':
        return `
          <div class="shot-chrome dark"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">mythos.portfoolio.me</span></div>
          <div class="shot-body shot-mythos-body">
            <div class="mythos-moon"></div>
            <div class="mythos-bust-silhouette">🏛️</div>
            <div class="mythos-title">CASSIAN COLE</div>
            <div class="mythos-sub">Celestial Sculpture & Classical Myth</div>
          </div>`;

      case 'suki':
        return `
          <div class="shot-chrome dark"><span class="sc-dot sc-cyan"></span><span class="sc-url">suki.portfoolio.me</span></div>
          <div class="shot-body shot-suki-body">
            <div class="suki-nle-header">
              <span class="suki-tc">00:14:22:18</span>
              <span class="suki-tag">CYBER NLE TIMELINE</span>
            </div>
            <div class="suki-title">SUKI TANAKA</div>
            <div class="suki-tracks">
              <div class="suki-track-v"></div>
              <div class="suki-track-a"></div>
            </div>
          </div>`;

      case 'cinema':
        return `
          <div class="shot-chrome cinema"><span class="sc-dot sc-red"></span><span class="cinema-rec">● REC</span><span class="sc-url">01:24:19:04</span></div>
          <div class="shot-body shot-cinema-body">
            <div class="shot-cinema-hud">
              <span class="hud-tag">2.39:1 ANAMORPHIC</span>
              <span class="hud-fps">24 FPS • 8K</span>
            </div>
            <div class="shot-cinema-title">AUSTIN REED</div>
            <div class="shot-cinema-sub">DIRECTOR OF PHOTOGRAPHY</div>
          </div>`;

      case 'lo':
        return `
          <div class="shot-chrome paper"><span class="sc-dot"></span><span class="sc-url">lo-studio.portfoolio.me</span></div>
          <div class="shot-body shot-lo-body">
            <div class="lo-brand-tag">LO STUDIO • ESSENTIALS</div>
            <div class="shot-heading-black">Art & Artifacts</div>
            <div class="lo-grid-mock">
              <span class="lo-cell c1"></span><span class="lo-cell c2"></span><span class="lo-cell c3"></span>
            </div>
          </div>`;

      case 'mara':
        return `
          <div class="shot-chrome dark"><span class="sc-dot"></span><span class="sc-url">mara-voss.portfoolio.me</span></div>
          <div class="shot-body shot-mara-body">
            <div class="mara-tag">01 / DESIGN AS INTENT</div>
            <div class="shot-heading-white">MARA VOSS</div>
            <div class="shot-sub-gray">Independent Art Director & Digital Designer</div>
            <div class="mara-manifesto">Form follows precision. Pure monochrome.</div>
          </div>`;

      case 'desire':
        return `
          <div class="shot-chrome dark"><span class="sc-dot"></span><span class="sc-url">desire.portfoolio.me</span></div>
          <div class="shot-body shot-desire-body">
            <span class="shot-badge-orange">EDITORIAL LUXURY</span>
            <div class="shot-heading-white">Mikael K.</div>
            <div class="shot-sub-gray">Art Direction & Brand Craft</div>
          </div>`;

      default:
        return `
          <div class="shot-chrome"><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-dot"></span><span class="sc-url">${id}.portfoolio.me</span></div>
          <div class="shot-body shot-default-body" style="background:${meta && meta.gradient ? meta.gradient : '#0f172a'}">
            <div class="shot-badge-mono">${(meta && meta.track === 'visual') ? 'VISUAL ARTS' : 'DEVELOPER'}</div>
            <div class="shot-heading-white">${title}</div>
            <div class="shot-sub-gray">${meta && meta.subtitle ? meta.subtitle : 'Handcrafted Portfolio Theme'}</div>
            <div class="shot-pills">
              <span class="shot-pill">${(meta && meta.badge) || 'PRO'}</span>
              <span class="shot-pill">Handcrafted</span>
            </div>
          </div>`;
    }
  }

  function getTheme(id) {
    if (!id) return CATALOG.midnight;
    const cleanId = String(id).toLowerCase().trim();
    return CATALOG[cleanId] || CATALOG.midnight;
  }

  function getAllThemes() {
    return Object.values(CATALOG);
  }

  function getThemesByTrack(track) {
    if (!track || track === 'all') return getAllThemes();
    return getAllThemes().filter(t => t.track === track);
  }

  function searchThemes(query, filter) {
    let list = getAllThemes();
    if (filter && filter !== 'all') {
      if (filter === 'tech' || filter === 'visual') {
        list = list.filter(t => t.track === filter);
      } else if (filter === 'dark') {
        list = list.filter(t => t.dark === true);
      } else if (filter === 'minimal') {
        list = list.filter(t => (t.tags && (t.tags.includes('minimal') || t.tags.includes('clean'))));
      }
    }
    if (!query) return list;
    const q = query.toLowerCase().trim();
    return list.filter(t => {
      return (
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q) ||
        (t.author && t.author.name.toLowerCase().includes(q)) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
      );
    });
  }

  function getLikesCount(themeId) {
    const meta = getTheme(themeId);
    let base = meta.likes || 42;
    try {
      const stored = JSON.parse(localStorage.getItem('portfoolio_theme_likes') || '{}');
      if (stored[themeId]) base += 1;
    } catch {}
    return base;
  }

  function toggleLikeTheme(themeId) {
    let liked = false;
    try {
      const key = 'portfoolio_theme_likes';
      const stored = JSON.parse(localStorage.getItem(key) || '{}');
      if (stored[themeId]) {
        delete stored[themeId];
        liked = false;
      } else {
        stored[themeId] = true;
        liked = true;
      }
      localStorage.setItem(key, JSON.stringify(stored));
    } catch {}
    return liked;
  }

  function isThemeLiked(themeId) {
    try {
      const stored = JSON.parse(localStorage.getItem('portfoolio_theme_likes') || '{}');
      return !!stored[themeId];
    } catch {
      return false;
    }
  }

  return {
    CATALOG,
    getTheme,
    getAllThemes,
    getThemesByTrack,
    searchThemes,
    getLikesCount,
    toggleLikeTheme,
    isThemeLiked,
    getThemeShotHtml,
    version: '1.0.0'
  };

});
