(function () {
  'use strict';

  var PET_REGISTRY = {
    // === POKÉMON SECTION ===
    giratina: {
      id: 'giratina',
      category: 'pokemon',
      displayName: 'Giratina',
      subtitle: 'Legendary Ghost / Dragon',
      badge: 'GHOST / DRAGON',
      badgeBg: 'linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(239, 68, 68, 0.3))',
      badgeColor: '#c084fc',
      sheet: '/assets/pets/giratina/spritesheet.webp',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: 'Shadow Force! Distortion World is watching.',
      messages: [
        'Shadow Force!',
        'Distortion World awaits.',
        'Ancient Dragon power!',
        'Ruler of antimatter.',
        'Spikes aligned.',
        'Ghostly aura active.'
      ]
    },
    gardevoir: {
      id: 'gardevoir',
      category: 'pokemon',
      displayName: 'Gardevoir',
      subtitle: 'Psychic / Fairy Pokémon',
      badge: 'PSYCHIC / FAIRY',
      badgeBg: 'linear-gradient(135deg, rgba(236, 72, 153, 0.25), rgba(16, 185, 129, 0.25))',
      badgeColor: '#f472b6',
      sheet: '/assets/pets/gardevoir/spritesheet.webp',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: 'Psychic barrier deployed. Your code is protected.',
      messages: [
        'Psychic aura shining!',
        'Moonblast ready.',
        'Sensing your future builds…',
        'Fairy elegance.',
        'Unwavering devotion.',
        'Teleporting to next project!'
      ]
    },
    kabi: {
      id: 'kabi',
      category: 'pokemon',
      displayName: 'Snorlax (Kabigon)',
      subtitle: 'Sleeping Normal-Type Pokémon',
      badge: 'NORMAL / SLEEPY',
      badgeBg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(16, 185, 129, 0.25))',
      badgeColor: '#60a5fa',
      sheet: '/assets/pets/kabi/spritesheet.webp',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: 'Zzz... Snorlax woke up to review your code!',
      messages: [
        'Zzz... Rest and code.',
        'Heavy slam incoming!',
        'Where is the Poké Flute?',
        'Delicious commits!',
        'Snack break time?',
        'Big chill vibes.'
      ]
    },
    capvolt: {
      id: 'capvolt',
      category: 'pokemon',
      displayName: 'Captain Pikachu',
      subtitle: 'Electric Mouse & Cap',
      badge: 'ELECTRIC CAPTAIN',
      badgeBg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(239, 68, 68, 0.3))',
      badgeColor: '#fbbf24',
      sheet: '/assets/pets/capvolt/spritesheet.webp',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: 'Pika-Pikachu! Captain on deck!',
      messages: [
        'Pika-Pika!',
        'Volt Tackle charge!',
        'Thunderbolt ready ⚡',
        'Captain on duty!',
        'Full power ahead!',
        'Sparks flying!'
      ]
    },

    // === ANIME & COMPANIONS SECTION ===
    goku: {
      id: 'goku',
      category: 'anime',
      displayName: 'Goku',
      subtitle: 'Super Saiyan Warrior',
      badge: 'SUPER SAIYAN',
      badgeBg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(239, 68, 68, 0.25))',
      badgeColor: '#f59e0b',
      sheet: '/assets/pet-goku.webp',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: "It's over 9000! Ready to build.",
      messages: [
        "It's over 9000!",
        'Kaio-Ken!',
        'All systems go.',
        'Ship it!',
        'You got this.',
        'Reviewing your skills…',
        'Drag me anywhere!'
      ]
    },
    boba: {
      id: 'boba',
      category: 'anime',
      displayName: 'Boba Otter',
      subtitle: 'Bubble Tea Companion',
      badge: 'SWEET VIBES',
      badgeBg: 'linear-gradient(135deg, rgba(234, 179, 8, 0.25), rgba(168, 85, 247, 0.25))',
      badgeColor: '#facc15',
      sheet: '/assets/pets/boba/spritesheet.webp',
      cols: 8,
      rows: 11,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: 'Sipping bubble tea and admiring your projects!',
      messages: [
        'Sip sip… delicious!',
        'Stay refreshed & code.',
        'Tapioca pearls of wisdom.',
        'Otterly wonderful code!',
        'Sweet workflow.',
        'Boba break time!'
      ]
    },
    'goose-default': {
      id: 'goose-default',
      category: 'anime',
      displayName: 'Untitled Goose',
      subtitle: 'Mischievous Waterfowl',
      badge: 'CHAOTIC HONK',
      badgeBg: 'linear-gradient(135deg, rgba(249, 115, 22, 0.25), rgba(239, 68, 68, 0.25))',
      badgeColor: '#fb923c',
      sheet: '/assets/pets/goose-default/spritesheet.png',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: 'HONK! Peace was never an option.',
      messages: [
        'HONK HONK!',
        'Peace was never an option.',
        'Stealing the recruiter’s bell…',
        '*Waddle waddle*',
        'Rake in the lake!',
        'Chaotic dev energy.'
      ]
    },
    'kaka-2': {
      id: 'kaka-2',
      category: 'anime',
      displayName: 'Kaka Star',
      subtitle: 'Pink Star-Bell Mascot',
      badge: 'KAWAII STAR',
      badgeBg: 'linear-gradient(135deg, rgba(244, 114, 182, 0.25), rgba(192, 132, 252, 0.25))',
      badgeColor: '#f472b6',
      sheet: '/assets/pets/kaka-2/spritesheet.webp',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: 'Twinkling bright! Happy coding!',
      messages: [
        'Star power activated! ⭐',
        'Tinkle-tinkle bell!',
        'Kawaii build mode!',
        'Shining bright today.',
        'Sparkle on!',
        'Floating with joy.'
      ]
    }
  };

  if (typeof window !== 'undefined') {
    window.PORTFOOLIO_PETS = PET_REGISTRY;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PET_REGISTRY;
  }
})();
