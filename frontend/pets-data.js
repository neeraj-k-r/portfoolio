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
    },

    // === ANIME HEROES COLLECTION (https://petdex.dev/collections/anime-heroes) ===
    luffy: {
      id: 'luffy',
      category: 'anime-heroes',
      displayName: 'Monkey D. Luffy',
      subtitle: 'Straw Hat Captain · King of the Pirates',
      badge: 'STRAW HAT',
      badgeBg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(245, 158, 11, 0.3))',
      badgeColor: '#f87171',
      sheet: '/assets/pets/luffy/spritesheet.webp',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: "I'm Monkey D. Luffy, and I'm gonna be King of the Pirates!",
      messages: [
        'Gomu Gomu no...',
        'Meat!! I need meat!',
        'Join my crew!',
        'Never give up on your dreams!',
        'Kaizoku ou ni, ore wa naru!',
        'Set sail for the Grand Line!'
      ]
    },
    zoro: {
      id: 'zoro',
      category: 'anime-heroes',
      displayName: 'Roronoa Zoro',
      subtitle: 'Master Swordsman · Three-Sword Style',
      badge: 'THREE-SWORD',
      badgeBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.3))',
      badgeColor: '#34d399',
      sheet: '/assets/pets/zoro/spritesheet.webp',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: 'Nothing happened. Let us keep moving.',
      messages: [
        'Three-Sword Style: Onigiri!',
        'Scars on the back are a swordsman’s shame.',
        'Wait, which way was north again?',
        'I will become the greatest swordsman!',
        'A wound that would kill an ordinary man…',
        'Blade sharpened and ready.'
      ]
    },
    naruto: {
      id: 'naruto',
      category: 'anime-heroes',
      displayName: 'Naruto Uzumaki',
      subtitle: 'Seventh Hokage · Will of Fire',
      badge: 'WILL OF FIRE',
      badgeBg: 'linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(234, 179, 8, 0.3))',
      badgeColor: '#fb923c',
      sheet: '/assets/pets/naruto/spritesheet.webp',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: "Believe it! I never go back on my word, that's my nindo!",
      messages: [
        'Rasengan!',
        'Shadow Clone Jutsu!',
        'Dattebayo!',
        'I will become Hokage!',
        'Ramen break time at Ichiraku 🍜',
        'Will of Fire burns bright!'
      ]
    },
    itachi: {
      id: 'itachi',
      category: 'anime-heroes',
      displayName: 'Itachi Uchiha',
      subtitle: 'Shadow of Konoha · Mangekyo Sharingan',
      badge: 'SHARINGAN',
      badgeBg: 'linear-gradient(135deg, rgba(185, 28, 28, 0.35), rgba(30, 41, 59, 0.4))',
      badgeColor: '#f87171',
      sheet: '/assets/pets/itachi/spritesheet.webp',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: 'You are already under my genjutsu.',
      messages: [
        'Amaterasu.',
        'Tsukuyomi.',
        'Forgive me... maybe next time.',
        'Self-sacrifice is what makes a true shinobi.',
        'Crows taking flight…',
        'Protecting the village from the shadows.'
      ]
    },
    gojo: {
      id: 'gojo',
      category: 'anime-heroes',
      displayName: 'Satoru Gojo',
      subtitle: 'The Honored One · Limitless & Six Eyes',
      badge: 'HONORED ONE',
      badgeBg: 'linear-gradient(135deg, rgba(56, 189, 248, 0.3), rgba(129, 140, 248, 0.3))',
      badgeColor: '#38bdf8',
      sheet: '/assets/pets/gojo/spritesheet.webp',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: 'Throughout heaven and earth, I alone am the honored one.',
      messages: [
        'Domain Expansion: Infinite Void.',
        'Hollow Technique: Purple.',
        'Don’t worry, I’m the strongest.',
        'Infinity between us.',
        'Sweet snack time!',
        'Limitless cursed energy active.'
      ]
    },
    sukuna: {
      id: 'sukuna',
      category: 'anime-heroes',
      displayName: 'Ryomen Sukuna',
      subtitle: 'King of Curses · Malevolent Shrine',
      badge: 'CURSE KING',
      badgeBg: 'linear-gradient(135deg, rgba(220, 38, 38, 0.35), rgba(88, 28, 135, 0.35))',
      badgeColor: '#f87171',
      sheet: '/assets/pets/sukuna/spritesheet.webp',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: 'Know your place, fool.',
      messages: [
        'Domain Expansion: Malevolent Shrine.',
        'Dismantle and Cleave.',
        'Stand proud, you are strong.',
        'A curse born from true malice.',
        'Feast on despair.',
        'Cursed energy overflow.'
      ]
    },
    'goku-blue': {
      id: 'goku-blue',
      category: 'anime-heroes',
      displayName: 'Goku (SSJ Blue)',
      subtitle: 'Super Saiyan God SS · Divine Ki',
      badge: 'SSJ BLUE',
      badgeBg: 'linear-gradient(135deg, rgba(14, 165, 233, 0.35), rgba(37, 99, 235, 0.35))',
      badgeColor: '#38bdf8',
      sheet: '/assets/pets/goku-blue/spritesheet.webp',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: 'Haaaa! Super Saiyan Blue power unlocked!',
      messages: [
        'Kaio-ken times ten!',
        'Godly Kamehameha!',
        'Pushing past every mortal limit!',
        'Whis trained us well!',
        'Divine aura radiating ⚡',
        'Let’s test our power!'
      ]
    },
    nezuko: {
      id: 'nezuko',
      category: 'anime-heroes',
      displayName: 'Nezuko Kamado',
      subtitle: 'Demon Sister · Blood Demon Art',
      badge: 'DEMON SISTER',
      badgeBg: 'linear-gradient(135deg, rgba(244, 114, 182, 0.3), rgba(251, 113, 133, 0.3))',
      badgeColor: '#fb7185',
      sheet: '/assets/pets/nezuko/spritesheet.webp',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: 'Mmh mmh! (Nezuko is here to protect your site!)',
      messages: [
        'Mmh mmh!',
        'Blood Demon Art: Exploding Blood!',
        '*Gentle head pat*',
        'Protecting humans with all her heart!',
        'Shrinking down into the box…',
        'Pink bamboo charm ready.'
      ]
    },
    'kyojuro-rengoku': {
      id: 'kyojuro-rengoku',
      category: 'anime-heroes',
      displayName: 'Kyojuro Rengoku',
      subtitle: 'Flame Hashira · Set Your Heart Ablaze',
      badge: 'FLAME HASHIRA',
      badgeBg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.35), rgba(245, 158, 11, 0.35))',
      badgeColor: '#fb923c',
      sheet: '/assets/pets/kyojuro-rengoku/spritesheet.webp',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: 'Set your heart ablaze! Proceed with conviction!',
      messages: [
        'TASTY! (UMAI!) 🍱',
        'Flame Breathing: Ninth Form, Rengoku!',
        'I will fulfill my duty as a Hashira!',
        'Never let your flame die down!',
        'Blazing spirit unconquered.',
        'Warm heart, unshakeable courage.'
      ]
    },
    gon: {
      id: 'gon',
      category: 'anime-heroes',
      displayName: 'Gon Freecss',
      subtitle: 'Hunter · Jajanken Master',
      badge: 'HUNTER NEN',
      badgeBg: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(234, 179, 8, 0.3))',
      badgeColor: '#4ade80',
      sheet: '/assets/pets/gon/spritesheet.webp',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: 'First comes rock! Let us go on an adventure!',
      messages: [
        'Jajanken: Rock!',
        'Jajanken: Scissors!',
        'Jajanken: Paper!',
        'Friends are everything to me.',
        'I want to see what my father saw.',
        'Enhancement Nen charged up!'
      ]
    },
    killua: {
      id: 'killua',
      category: 'anime-heroes',
      displayName: 'Killua Zoldyck',
      subtitle: 'Godspeed Assassin · Lightning Nen',
      badge: 'GODSPEED',
      badgeBg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(56, 189, 248, 0.3))',
      badgeColor: '#c084fc',
      sheet: '/assets/pets/killua/spritesheet.webp',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: "Godspeed: Whirlwind! You won't even see me move.",
      messages: [
        'Thunderbolt!',
        'Electricity runs through my veins ⚡',
        'Gon is my best friend.',
        'Assassination rhythm echoes.',
        'Yo-yo spin and strike!',
        'Lightning aura at full voltage.'
      ]
    },
    sabo: {
      id: 'sabo',
      category: 'anime-heroes',
      displayName: 'Sabo',
      subtitle: 'Flame Emperor · Revolutionary Chief',
      badge: 'FLAME EMPEROR',
      badgeBg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(249, 115, 22, 0.3))',
      badgeColor: '#60a5fa',
      sheet: '/assets/pets/sabo/spritesheet.webp',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: "Inheriting Ace’s will: Fire Fist!",
      messages: [
        'Dragon Claw Fist!',
        'Mera Mera no Mi power!',
        'Luffy is my brother — touch him and pay!',
        'Revolutionary flame burning bright.',
        'Gentleman top-hat, fiery spirit.',
        'Freedom is worth fighting for!'
      ]
    },

    // === ONE PIECE THEME / CREW SECTION ===
    'luffy-gear-5-chibi': {
      id: 'luffy-gear-5-chibi',
      category: 'onepiece',
      displayName: 'Luffy (Gear 5 Nika)',
      subtitle: 'Sun God Nika · Warrior of Liberation',
      badge: 'GEAR 5 NIKA',
      badgeBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.35), rgba(245, 158, 11, 0.35))',
      badgeColor: '#fef08a',
      sheet: '/assets/pets/luffy-gear-5-chibi/spritesheet.webp',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: 'AHAHAHA! This is my peak! Drums of Liberation!',
      messages: [
        'Drums of Liberation sound! 🥁',
        'AHAHAHAHAHA!',
        'Rubber world! Everything stretches!',
        'Gomu Gomu no Gigant!',
        'Freedom is the greatest treasure!',
        'Warrior of Liberation awakened!'
      ]
    },
    robin: {
      id: 'robin',
      category: 'onepiece',
      displayName: 'Nico Robin',
      subtitle: 'Archaeologist · Hana Hana no Mi',
      badge: 'HANA HANA',
      badgeBg: 'linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.3))',
      badgeColor: '#c084fc',
      sheet: '/assets/pets/robin/spritesheet.webp',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: 'I want to live! Take me out to the sea with you!',
      messages: [
        'Cien Fleur: Wing! 🌸',
        'I want to live!',
        'The Rio Poneglyph holds the truth.',
        'Hands blooming like flowers.',
        'A quiet moment with a good book.',
        'Mille Fleur: Gigantesco Mano!'
      ]
    },
    'smoke-kick': {
      id: 'smoke-kick',
      category: 'onepiece',
      displayName: 'Sanji (Black Leg)',
      subtitle: 'Martial Chef · Diable Jambe',
      badge: 'DIABLE JAMBE',
      badgeBg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.35), rgba(239, 68, 68, 0.35))',
      badgeColor: '#fb923c',
      sheet: '/assets/pets/smoke-kick/spritesheet.webp',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: "I'll never let anyone starve. Diable Jambe!",
      messages: [
        'Diable Jambe: Flambage Shot! 🔥',
        'Never waste food in my kitchen.',
        'Cooking with heart and precision.',
        'Black Leg martial style ready.',
        'Ifrit Jambe ignited!',
        'A true gentleman never strikes a lady.'
      ]
    },

    // === DRAGON BALL COLLECTION (https://petdex.dev/collections/franchise-dragon-ball) ===
    beerus: {
      id: 'beerus',
      category: 'dragonball',
      displayName: 'Beerus',
      subtitle: 'God of Destruction · Universe 7',
      badge: 'DESTROYER GOD',
      badgeBg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.35), rgba(236, 72, 153, 0.35))',
      badgeColor: '#c084fc',
      sheet: '/assets/pets/beerus/spritesheet.webp',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: 'Before creation must come destruction. Hakai!',
      messages: [
        'Hakai! 💥',
        'Before creation must come destruction.',
        'Now where is my Earth delicacy?',
        'Whis, fetch the ramen pudding!',
        'Your code power is mildly amusing.',
        'Do not test a God of Destruction.'
      ]
    },
    'super-goku': {
      id: 'super-goku',
      category: 'dragonball',
      displayName: 'Super Goku',
      subtitle: 'Super Saiyan · Golden Lightning Aura',
      badge: 'SUPER SAIYAN',
      badgeBg: 'linear-gradient(135deg, rgba(234, 179, 8, 0.35), rgba(245, 158, 11, 0.35))',
      badgeColor: '#eab308',
      sheet: '/assets/pets/super-goku/spritesheet.webp',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: "I am the hope of the universe! Let's power up!",
      messages: [
        'Super Saiyan power unleashed! ⚡',
        'Kamehameha! 💥',
        'I am the hope of the universe.',
        'Power level breaking limits!',
        'Never give up the fight!',
        'Spirit Bomb gathering energy.'
      ]
    },
    gohan: {
      id: 'gohan',
      category: 'dragonball',
      displayName: 'Gohan',
      subtitle: 'Half-Saiyan Prodigy · Masenko',
      badge: 'POTENTIAL UNLOCKED',
      badgeBg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.35), rgba(168, 85, 247, 0.35))',
      badgeColor: '#60a5fa',
      sheet: '/assets/pets/gohan/spritesheet.webp',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: "I won't let you hurt my friends! Masenko-Ha!",
      messages: [
        'Masenko-Ha! ⚡',
        'Unleashing hidden potential!',
        'I fight to protect the peace.',
        'Father taught me to never surrender.',
        'Super Saiyan 2 awakening!',
        'Focusing inner ki and intellect.'
      ]
    },
    'fat-buu': {
      id: 'fat-buu',
      category: 'dragonball',
      displayName: 'Majin Buu',
      subtitle: 'Cheerful Djinn · Sweet Magic',
      badge: 'MAJIN MAGIC',
      badgeBg: 'linear-gradient(135deg, rgba(244, 114, 182, 0.35), rgba(251, 191, 36, 0.35))',
      badgeColor: '#f472b6',
      sheet: '/assets/pets/fat-buu/spritesheet.webp',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: 'Buu make you into chocolate! Buu happy!',
      messages: [
        'Buu turn you into candy! 🍬',
        'Buu loves sweets and chocolate!',
        'You nice person, Buu like you!',
        'Majin breath blast!',
        'No one makes Buu angry!',
        'Yay, fun time with friend!'
      ]
    },
    'kid-goku-classic-actions': {
      id: 'kid-goku-classic-actions',
      category: 'dragonball',
      displayName: 'Kid Goku',
      subtitle: 'Power Pole & Flying Nimbus · Classic',
      badge: 'FLYING NIMBUS',
      badgeBg: 'linear-gradient(135deg, rgba(249, 115, 22, 0.35), rgba(234, 179, 8, 0.35))',
      badgeColor: '#f97316',
      sheet: '/assets/pets/kid-goku-classic-actions/spritesheet.webp',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: 'Nimbus, to me! Power Pole extend!',
      messages: [
        'Power Pole extend! 🥢',
        'Flying Nimbus! ☁️',
        'Kamehameha blast!',
        'I got a monkey tail!',
        'Time for a big feast after training!',
        'Grandpa Gohan taught me well.'
      ]
    },
    yamcha: {
      id: 'yamcha',
      category: 'dragonball',
      displayName: 'Yamcha',
      subtitle: 'Wolf Fang Fist · Desert Bandit',
      badge: 'WOLF FANG',
      badgeBg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.35), rgba(249, 115, 22, 0.35))',
      badgeColor: '#f87171',
      sheet: '/assets/pets/yamcha/spritesheet.webp',
      cols: 8,
      rows: 9,
      cellW: 192,
      cellH: 208,
      viewW: 96,
      viewH: 104,
      defaultGreeting: 'Wolf Fang Fist! Rogue martial artist ready!',
      messages: [
        'Roga Fufu Ken! (Wolf Fang Fist) 🐺',
        'Spirit Ball barrage!',
        'Turtle School warrior standing tall.',
        'Training hard with Puar!',
        'Kamehameha charge ready!',
        'Never underestimate the desert wolf.'
      ]
    }
  };

  if (typeof window !== 'undefined') {
    window.PORTFOOLIO_PETS = PET_REGISTRY;
    window.getPortfoolioPet = function (id) {
      if (!id) return PET_REGISTRY.goku;
      var clean = String(id).toLowerCase().trim();
      return PET_REGISTRY[clean] || PET_REGISTRY.goku;
    };
    window.getPortfoolioPetsByCategory = function (cat) {
      return Object.values(PET_REGISTRY).filter(function (p) { return p.category === cat; });
    };
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      PET_REGISTRY: PET_REGISTRY,
      getPortfoolioPet: function (id) {
        if (!id) return PET_REGISTRY.goku;
        var clean = String(id).toLowerCase().trim();
        return PET_REGISTRY[clean] || PET_REGISTRY.goku;
      },
      getPortfoolioPetsByCategory: function (cat) {
        return Object.values(PET_REGISTRY).filter(function (p) { return p.category === cat; });
      }
    };
  }
})();
