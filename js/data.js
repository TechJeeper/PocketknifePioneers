/**
 * Pocketknife Pioneers - Data Definitions & Game Content
 */

const GAME_DATA = {
  archetypes: [
    {
      id: 'steel_snob',
      name: 'The Steel Snob',
      tagline: 'Refuses to touch anything below CPM-MagnaCut.',
      description: 'Starts with high cash and premium knives, but loses sanity if knives rust or drop below 85% condition.',
      startingCash: 1200,
      startingItems: { bandaid: 3, silica: 5, torx: 1, pass: 1 },
      startingKnives: ['edc_bugout', 'maxamet_folder'],
      perk: 'High starting cash & super steels.'
    },
    {
      id: 'whatnot_addict',
      name: 'The Whatnot Addict',
      tagline: 'Always watching stream auctions at 2:00 AM.',
      description: 'Gets extra auction passes and high auction win rates, but prone to impulse buying low-tier knives.',
      startingCash: 850,
      startingItems: { bandaid: 5, silica: 3, pass: 5, energy: 4 },
      startingKnives: ['gas_station_dragon', 'rainbow_karambit'],
      perk: '+25% Auction advantage & 5 Auction Passes.'
    },
    {
      id: 'budget_hunter',
      name: 'The Budget Hunter',
      tagline: 'Looks for $30 gems that punch way above their weight.',
      description: 'Starts with a massive stash of medical & maintenance supplies. Resistant to scalper markups.',
      startingCash: 600,
      startingItems: { bandaid: 12, silica: 15, sharpening_kit: 2, torx: 1, energy: 3 },
      startingKnives: ['classic_slipjoint', 'salt_folder'],
      perk: 'Loaded with supplies & high resilience.'
    },
    {
      id: 'knife_modder',
      name: 'The Knife Modder',
      tagline: 'Anodizes titanium in bleach and tunes pivot screws by ear.',
      description: 'Equipped with Torx tools and sharpening gear to repair damaged blades on the trail without losing cash.',
      startingCash: 950,
      startingItems: { bandaid: 6, silica: 6, sharpening_kit: 3, torx: 2 },
      startingKnives: ['titanium_flipper', 'edc_bugout'],
      perk: 'Can fix blade play and sharpen knives anytime.'
    }
  ],

  items: {
    bandaid: { name: 'Band-Aid Box', cost: 10, desc: 'Restores +30 Health when you cut your fingers testing sharpness.' },
    silica: { name: 'Silica Gel Packs (10x)', cost: 15, desc: 'Protects carbon steel & D2 knives from rusting in humid weather.' },
    sharpening_kit: { name: 'Kapex & Strop Kit', cost: 45, desc: 'Restores 40% knife sharpness & condition on the trail.' },
    torx: { name: 'Torx Screwdriver Set', cost: 25, desc: 'Fixes blade play and pivot wobble instantly.' },
    pass: { name: 'Whatnot Express Pass', cost: 30, desc: 'Grants extra reaction time and auto-snipe in live auctions.' },
    energy: { name: 'Nitrous Cold Brew', cost: 12, desc: 'Restores +35 Sanity when burnout hits.' }
  },

  knives: {
    gas_station_dragon: {
      id: 'gas_station_dragon',
      name: 'Gas Station Dragon Claw',
      tier: 'Gas Station',
      steel: 'Unknown Mystery Metal',
      value: 12,
      sharpness: 40,
      condition: 70,
      rustResist: 20,
      image: '🗡️'
    },
    rainbow_karambit: {
      id: 'rainbow_karambit',
      name: 'Mall Ninja Rainbow Karambit',
      tier: 'Gas Station',
      steel: '420J2 Stainless',
      value: 18,
      sharpness: 50,
      condition: 80,
      rustResist: 60,
      image: '🌈'
    },
    classic_slipjoint: {
      id: 'classic_slipjoint',
      name: 'Vintage Barlow Slipjoint',
      tier: 'Vintage',
      steel: '1095 High Carbon',
      value: 65,
      sharpness: 85,
      condition: 90,
      rustResist: 10,
      image: '🔪'
    },
    edc_bugout: {
      id: 'edc_bugout',
      name: 'Ultralight EDC Bugout',
      tier: 'EDC',
      steel: 'CPM-S30V',
      value: 170,
      sharpness: 90,
      condition: 95,
      rustResist: 80,
      image: '🪶'
    },
    maxamet_folder: {
      id: 'maxamet_folder',
      name: 'Maxamet Edge Retentive Folder',
      tier: 'Super Steel',
      steel: 'CPM-Maxamet',
      value: 250,
      sharpness: 100,
      condition: 90,
      rustResist: 15,
      image: '⚡'
    },
    salt_folder: {
      id: 'salt_folder',
      name: 'Salt Marine Rustproof Folder',
      tier: 'EDC',
      steel: 'LC200N',
      value: 155,
      sharpness: 85,
      condition: 100,
      rustResist: 100,
      image: '🌊'
    },
    titanium_flipper: {
      id: 'titanium_flipper',
      name: 'Titanium Frame Lock Flipper',
      tier: 'Tactical',
      steel: 'M390',
      value: 340,
      sharpness: 92,
      condition: 95,
      rustResist: 90,
      image: '⚙️'
    },
    custom_damasteel: {
      id: 'custom_damasteel',
      name: 'Custom Damasteel Gentleman Blade',
      tier: 'Custom',
      steel: 'Damasteel Patterned',
      value: 800,
      sharpness: 95,
      condition: 100,
      rustResist: 75,
      image: '✨'
    },
    holy_grail: {
      id: 'holy_grail',
      name: 'The Holy Grail Custom #001',
      tier: 'Grail',
      steel: 'Vanax SuperClean',
      value: 2800,
      sharpness: 100,
      condition: 100,
      rustResist: 98,
      image: '👑'
    }
  },

  trailLocations: [
    { name: 'Blade Town Outpost', mile: 0, desc: 'Stock up on Band-Aids, silica packs, and emergency EDC knives before heading into the wild.' },
    { name: 'Scalper Ridge Pass', mile: 300, desc: 'Beware of trench-coat flippers selling out-of-stock sprint runs for 300% markup.' },
    { name: 'Whatnot Wilds', mile: 600, desc: 'Live auction territory! Test your bidding reflexes against high-speed stream snipers.' },
    { name: 'Humid Swamps of D2', mile: 900, desc: 'High atmospheric moisture! Keep your carbon steel oiled or suffer rust spots.' },
    { name: 'Pre-Order Lottery Peak', mile: 1200, desc: 'Raffle drops, customs lotteries, and knife swap trade tables.' },
    { name: 'TSA & Customs Border', mile: 1500, desc: 'Security checkpoint! Make sure your knives are packed safely or risk confiscation.' },
    { name: 'Blade Show Atlanta', mile: 1800, desc: 'The promised land! Exhibit your collection, buy your ultimate grail, and calculate your score!' }
  ],

  whatnotAuctions: [
    { name: 'Mystery Box: Sealed Sprint Run', startingBid: 50, estimatedValue: 220, steel: 'CPM-CruWear', tier: 'EDC', image: '📦' },
    { name: 'Custom Titanium Anodized Flipper', startingBid: 120, estimatedValue: 450, steel: 'CPM-20CV', tier: 'Custom', image: '🎨' },
    { name: 'Blemished Factory Second Bugout', startingBid: 30, estimatedValue: 120, steel: 'CPM-S30V', tier: 'EDC', image: '🏷️' },
    { name: 'Damascus Slipjoint by Master Bladesmith', startingBid: 200, estimatedValue: 900, steel: 'Custom Damascus', tier: 'Custom', image: '💎' },
    { name: 'Grail Custom Flipper #001 Prototype', startingBid: 500, estimatedValue: 2500, steel: 'Vanax SuperClean', tier: 'Grail', image: '👑' }
  ],

  randomEvents: [
    {
      id: 'paper_test_cut',
      title: 'Hair-Shaving Sharpness Test!',
      text: 'You tested your knife on arm hair and newspaper. You pushed too hard and sliced your thumb!',
      effect: (state) => {
        if (state.items.bandaid > 0) {
          state.items.bandaid--;
          return { text: 'You used a Band-Aid from your stash. Health intact! (-1 Band-Aid)', healthDelta: 0, sanityDelta: 5 };
        } else {
          return { text: 'You had no Band-Aids! You bled onto your sleeve. (-20 Health, -10 Sanity)', healthDelta: -20, sanityDelta: -10 };
        }
      }
    },
    {
      id: 'amazon_box_massacre',
      title: 'Cardboard Box Breakdown',
      text: 'You broke down 25 Amazon delivery boxes to test edge retention. You hit a hidden heavy-duty staple!',
      effect: (state) => {
        let knife = state.inventory.find(k => k.sharpness > 20);
        if (knife) {
          knife.sharpness = Math.max(10, knife.sharpness - 30);
          knife.condition = Math.max(10, knife.condition - 15);
          return { text: `Your ${knife.name} suffered a micro-chip! (-30% Sharpness, -15% Condition)`, healthDelta: 0, sanityDelta: -15 };
        }
        return { text: 'Luckily, none of your sharp knives were damaged.', healthDelta: 0, sanityDelta: 0 };
      }
    },
    {
      id: 'spouse_credit_card',
      title: 'Bank Statement Interrogation!',
      text: 'Your partner found a credit card statement showing 12 transactions labeled "WHATNOT LIVE AUCTIONS". They ask: "Why did you spend $450 on pocketknives?"',
      options: [
        {
          label: 'Option A: "It\'s an investment portfolio!"',
          action: (state) => ({ text: 'They looked at you with deep skepticism. (-15 Sanity)', cashDelta: 0, sanityDelta: -15 })
        },
        {
          label: 'Option B: "I bought them for you to open Amazon packages!"',
          action: (state) => {
            if (state.inventory.length > 1) {
              let given = state.inventory.shift();
              return { text: `You gifted your ${given.name} on the spot! Crisis averted! (-1 Knife, +20 Sanity)`, cashDelta: 0, sanityDelta: 20 };
            }
            return { text: 'You had no spare knife to gift! Panic ensued! (-25 Sanity)', cashDelta: 0, sanityDelta: -25 };
          }
        },
        {
          label: 'Option C: Honest confession and promise to limit bidding.',
          action: (state) => ({ text: 'Honesty paid off. They let it slide this time. (+10 Sanity)', cashDelta: 0, sanityDelta: 10 })
        }
      ]
    },
    {
      id: 'humid_rainstorm',
      title: 'D2 Humid Torrent Rain',
      text: 'A heavy rainstorm hits the trail. Atmospheric humidity surges to 98%!',
      effect: (state) => {
        if (state.items.silica >= 2) {
          state.items.silica -= 2;
          return { text: 'You packed your knives in Silica Gel Packs! Rust prevented (-2 Silica Packs).', healthDelta: 0, sanityDelta: 10 };
        } else {
          let rustedCount = 0;
          state.inventory.forEach(k => {
            if (k.rustResist < 70) {
              k.condition = Math.max(20, k.condition - 25);
              rustedCount++;
            }
          });
          return { text: `Without silica packs, ${rustedCount} of your low rust-resistance knives got rust spots! (-25% Condition, -20 Sanity)`, healthDelta: 0, sanityDelta: -20 };
        }
      }
    },
    {
      id: 'lock_rock_wobble',
      title: 'Blade Play Emergency!',
      text: 'Your favorite titanium flipper developed severe side-to-side blade wobble after heavy flipping.',
      effect: (state) => {
        if (state.items.torx > 0) {
          return { text: 'You pulled out your Torx T8 driver and tuned the pivot screw to buttery perfection! (+15 Sanity)', healthDelta: 0, sanityDelta: 15 };
        } else {
          return { text: 'Without a Torx screwdriver, the annoying blade play drives you insane! (-20 Sanity)', healthDelta: 0, sanityDelta: -20 };
        }
      }
    },
    {
      id: 'garage_sale_find',
      title: 'Garage Sale Hidden Gem!',
      text: 'You spotted an old wooden tackle box at a rural garage sale for $15.',
      effect: (state) => {
        if (state.cash >= 15) {
          state.cash -= 15;
          state.inventory.push({ ...GAME_DATA.knives.classic_slipjoint, value: 120, name: 'Vintage USA Bone Slipjoint' });
          return { text: 'Inside was a mint vintage 1970s USA Bone Slipjoint worth $120! (+1 Rare Knife, -$15 Cash, +30 Sanity)', healthDelta: 0, sanityDelta: 30 };
        }
        return { text: 'You did not have $15 cash in hand! A bystander bought it right in front of you! (-15 Sanity)', healthDelta: 0, sanityDelta: -15 };
      }
    },
    {
      id: 'scalper_trench_coat',
      title: 'Scalper Ridge Encounter',
      text: 'A guy behind a booth at Scalper Ridge offers a hard-to-find Sprint Run knife for $300 (MSRP $140).',
      options: [
        {
          label: 'Buy it anyway (Impulse buy!)',
          action: (state) => {
            if (state.cash >= 300) {
              state.cash -= 300;
              state.inventory.push({ ...GAME_DATA.knives.edc_bugout, name: 'Exclusive Sprint Run Bugout', value: 200 });
              return { text: 'You bought it! You have the knife, but you feel scalped. (-$300 Cash, -10 Sanity)', cashDelta: 0, sanityDelta: -10 };
            }
            return { text: 'Your card was declined! Scalper laughed at you. (-20 Sanity)', cashDelta: 0, sanityDelta: -20 };
          }
        },
        {
          label: 'Pass and scoff at the 200% markup',
          action: (state) => ({ text: 'You walked away with your wallet intact. Pure financial discipline! (+15 Sanity)', cashDelta: 0, sanityDelta: 15 })
        }
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GAME_DATA;
}
