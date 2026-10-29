export const initialProducts = [
  {
    id: "prod-1",
    title: "Aura Pro Wireless Noise-Cancelling Headphones",
    category: "Audio",
    price: 299.99,
    originalPrice: 379.99,
    rating: 4.9,
    reviewCount: 142,
    stock: 18,
    isFeatured: true,
    isTrending: true,
    isNew: false,
    badge: "Best Seller",
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80"
    ],
    colors: ["Space Gray", "Silver", "Midnight Blue"],
    description: "Immerse yourself in pure studio-grade sound with the Aura Pro. Featuring hybrid active noise cancellation, custom 40mm beryllium drivers, 40 hours of playback, and memory-foam ear cushions designed for all-day comfort.",
    features: [
      "Active Noise Cancellation with Transparency Mode",
      "40-hour ultra-long battery life with USB-C fast charging",
      "Spatial audio with dynamic head tracking",
      "Multipoint Bluetooth 5.3 connection"
    ],
    reviews: [
      { id: "rev-1", author: "Gokilavani", rating: 5, date: "2026-10-15", comment: "The noise cancellation is unmatched. Flights are dead silent now!" },
      { id: "rev-2", author: "Priya Patel", rating: 5, date: "2026-10-10", comment: "Super comfortable earcups and battery easily lasts all week." }
    ]
  },
  {
    id: "prod-2",
    title: "Chronos Ultra Smartwatch & Health Tracker",
    category: "Wearables",
    price: 249.50,
    originalPrice: 299.00,
    rating: 4.8,
    reviewCount: 98,
    stock: 12,
    isFeatured: true,
    isTrending: true,
    isNew: true,
    badge: "New Release",
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80"
    ],
    colors: ["Titanium Black", "Starlight", "Ocean Blue"],
    description: "Engineered for athletes and everyday high achievers. Chronos Ultra combines an aerospace-grade titanium frame with continuous ECG monitoring, dual-frequency GPS, and a dazzling 2000-nit AMOLED display.",
    features: [
      "Always-on 1.43'' AMOLED Sapphire Glass Display",
      "Continuous Heart Rate, ECG, SpO2 & Sleep Stages tracking",
      "50m Water Resistance (5 ATM) with Swim Tracking",
      "Up to 14 days of typical battery life"
    ],
    reviews: [
      { id: "rev-3", author: "Rohan Verma", rating: 5, date: "2026-10-20", comment: "Looks sleek in the office and performs like a beast on trails." }
    ]
  },
  {
    id: "prod-3",
    title: "Apex Mechanical Keyboard RGB (Hot-Swappable)",
    category: "Electronics",
    price: 139.00,
    originalPrice: 169.00,
    rating: 4.7,
    reviewCount: 86,
    stock: 25,
    isFeatured: true,
    isTrending: false,
    isNew: false,
    badge: "Popular",
    thumbnail: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80"
    ],
    colors: ["Gunmetal Gray", "Chalk White"],
    description: "Crafted for enthusiasts. Featuring custom lubricated tactile switches, sound-dampening acoustic silicone padding, per-key RGB backlighting, and a solid CNC aluminum top plate.",
    features: [
      "Pre-lubed Gateron Pro Tactile Yellow switches",
      "Hot-swappable PCB supports 3-pin and 5-pin switches",
      "Double-shot PBT Cherry profile keycaps",
      "Tri-mode: 2.4GHz wireless, Bluetooth 5.0, and USB-C"
    ],
    reviews: [
      { id: "rev-4", author: "Vikram Malhotra", rating: 5, date: "2026-10-18", comment: "The sound signature is like pure raindrops. Amazing quality." }
    ]
  },
  {
    id: "prod-4",
    title: "Vortex Pro Ergonomic Wireless Mouse",
    category: "Electronics",
    price: 89.99,
    originalPrice: 109.99,
    rating: 4.6,
    reviewCount: 64,
    stock: 30,
    isFeatured: false,
    isTrending: true,
    isNew: false,
    badge: "Ergonomic",
    thumbnail: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80"
    ],
    colors: ["Matte Black", "Graphite"],
    description: "Say goodbye to wrist fatigue. Vortex Pro's natural 57-degree vertical handshake angle aligns your forearm and reduces muscle strain by 40% while preserving pinpoint optical precision.",
    features: [
      "57° Natural ergonomic hand angle",
      "4000 DPI high-precision sensor with glass tracking",
      "Whisper-quiet magnetic click mechanism",
      "Rechargeable battery lasts up to 90 days on single charge"
    ],
    reviews: [
      { id: "rev-5", author: "Ananya Iyer", rating: 4, date: "2026-10-04", comment: "No more wrist cramps after 8-hour coding sessions." }
    ]
  },
  {
    id: "prod-5",
    title: "Lumina 4K Ultra HD Streaming Webcam",
    category: "Electronics",
    price: 159.00,
    originalPrice: 189.00,
    rating: 4.7,
    reviewCount: 52,
    stock: 14,
    isFeatured: false,
    isTrending: false,
    isNew: true,
    badge: "Top Rated",
    thumbnail: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&auto=format&fit=crop&q=80"
    ],
    colors: ["Space Black"],
    description: "Broadcast-ready video quality for remote professionals, streamers, and creators. Lumina delivers crystal 4K 60FPS video with AI-powered auto-framing and dual noise-reducing stereo microphones.",
    features: [
      "Sony STARVIS CMOS sensor with HDR processing",
      "AI auto-focus and facial tracking",
      "Integrated magnetic privacy shutter",
      "Plug-and-play USB-C connectivity"
    ],
    reviews: []
  },
  {
    id: "prod-6",
    title: "Nomad Canvas & Leather Travel Backpack",
    category: "Fashion",
    price: 119.50,
    originalPrice: 149.00,
    rating: 4.9,
    reviewCount: 115,
    stock: 22,
    isFeatured: true,
    isTrending: true,
    isNew: false,
    badge: "Travel Pick",
    thumbnail: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80"
    ],
    colors: ["Vintage Olive", "Charcoal Gray", "Caramel Tan"],
    description: "The ultimate companion for urban commuters and globe trotters. Made from weather-treated heavy duty waxed canvas and vegetable-tanned full grain leather with padded 16'' laptop protection.",
    features: [
      "Water-resistant waxed cotton canvas shell",
      "Shockproof padded sleeve fits up to 16'' MacBook Pro",
      "Luggage pass-through strap for rolling suitcases",
      "Quick-access passport and RFID protected pocket"
    ],
    reviews: [
      { id: "rev-6", author: "Arjun Nair", rating: 5, date: "2026-10-12", comment: "Took it across 4 countries. Looks even better with age." }
    ]
  },
  {
    id: "prod-7",
    title: "Minimalist Italian Leather Bi-Fold Wallet",
    category: "Fashion",
    price: 49.00,
    originalPrice: 65.00,
    rating: 4.5,
    reviewCount: 43,
    stock: 40,
    isFeatured: false,
    isTrending: false,
    isNew: false,
    badge: "Sale",
    thumbnail: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80"
    ],
    colors: ["Chestnut Brown", "Onyx Black"],
    description: "Handcrafted from top-grain Tuscan cowhide leather. Slim profile holds up to 10 cards and flat cash without bulging your pockets, backed with high-frequency RFID-blocking shields.",
    features: [
      "Handmade with genuine Italian vegetable-tanned leather",
      "RFID blocking lining for contactless card safety",
      "Ultra-slim 8mm profile when loaded",
      "6 card slots, 2 hidden pockets, and full-width billfold"
    ],
    reviews: []
  },
  {
    id: "prod-8",
    title: "Solaris Ceramic Smart Desk Lamp",
    category: "Home & Office",
    price: 85.00,
    originalPrice: 110.00,
    rating: 4.8,
    reviewCount: 77,
    stock: 16,
    isFeatured: true,
    isTrending: false,
    isNew: true,
    badge: "Smart Home",
    thumbnail: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80"
    ],
    colors: ["Matte White", "Sand Ceramic"],
    description: "Harmonize your workspace with natural circadian lighting. Solaris shifts color temperature from energetic 6500K daylight to calming 2700K sunset light as evening falls, complete with wireless Qi base charging.",
    features: [
      "Circadian rhythm auto-sync technology",
      "Built-in 15W Qi fast wireless phone charger",
      "Stepless touch brightness & color temperature dimmer",
      "CRI 98+ true-to-life color rendering"
    ],
    reviews: [
      { id: "rev-7", author: "Kavita Reddy", rating: 5, date: "2026-10-22", comment: "My eye fatigue disappeared after switching to this desk lamp." }
    ]
  },
  {
    id: "prod-9",
    title: "Pulse Acoustic Portable Bluetooth Speaker",
    category: "Audio",
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.8,
    reviewCount: 89,
    stock: 20,
    isFeatured: true,
    isTrending: true,
    isNew: false,
    badge: "Waterproof",
    thumbnail: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80"
    ],
    colors: ["Deep Forest", "Coral Red", "Storm Gray"],
    description: "Room-filling 360-degree acoustic fidelity with deep, punchy bass. IP67 waterproof and dustproof design makes it tough enough for poolside parties, beach outings, and mountain hikes.",
    features: [
      "360° omnidirectional acoustic dispersion",
      "IP67 dustproof & submersible up to 1 meter for 30 mins",
      "24-hour non-stop battery life with power bank output",
      "PartySync mode links over 100 speakers together"
    ],
    reviews: []
  },
  {
    id: "prod-10",
    title: "AeroGlide Ultralight Running Shoes",
    category: "Fashion",
    price: 145.00,
    originalPrice: 180.00,
    rating: 4.7,
    reviewCount: 104,
    stock: 8,
    isFeatured: false,
    isTrending: true,
    isNew: false,
    badge: "Low Stock",
    thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80"
    ],
    colors: ["Crimson Red", "Volt Yellow", "Obsidian Black"],
    description: "Fly through your miles with responsive carbon-fiber propulsion plates and nitrogen-infused supercritical foam that returns up to 88% of your kinetic energy per stride.",
    features: [
      "Supercritical foam midsole with carbon composite plate",
      "Engineered breathable jacquard mesh upper",
      "High-abrasion Continental rubber traction pods",
      "Weighs only 195g (Size 9)"
    ],
    reviews: [
      { id: "rev-8", author: "Aditya Sen", rating: 5, date: "2026-10-14", comment: "Shaved 2 minutes off my 10K personal record on the first run!" }
    ]
  },
  {
    id: "prod-11",
    title: "Barista Touch Espresso Machine",
    category: "Home & Office",
    price: 499.00,
    originalPrice: 599.00,
    rating: 4.9,
    reviewCount: 68,
    stock: 6,
    isFeatured: true,
    isTrending: false,
    isNew: false,
    badge: "Premium Choice",
    thumbnail: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80"
    ],
    colors: ["Brushed Stainless Steel", "Matte Truffle"],
    description: "Café-quality third wave specialty coffee at home. Equipped with 15-bar Italian pump pressure, PID temperature control, integrated hardened steel conical burr grinder, and micro-foam milk wand.",
    features: [
      "ThermoJet heating system reaches optimal temp in 3 seconds",
      "Intuitive touch screen with pre-programmed coffee menu",
      "Automatic micro-foam milk texturing with temp sensors",
      "Precision dose control for rich full-bodied crema"
    ],
    reviews: []
  },
  {
    id: "prod-12",
    title: "Moonlight Horizon 34'' Curved Gaming Monitor",
    category: "Electronics",
    price: 429.99,
    originalPrice: 549.99,
    rating: 4.8,
    reviewCount: 83,
    stock: 10,
    isFeatured: false,
    isTrending: true,
    isNew: true,
    badge: "Sale 22%",
    thumbnail: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80"
    ],
    colors: ["Matte Black"],
    description: "Unlock panoramic visual immersion. 3440 x 1440 WQHD resolution with a deep 1500R curvature wraps around your field of view, powered by a blistering 165Hz refresh rate and 1ms response time.",
    features: [
      "34'' Ultrawide 21:9 WQHD curved panel (1500R)",
      "165Hz refresh rate with AMD FreeSync Premium Pro",
      "HDR 400 with 99% sRGB color gamut coverage",
      "Dual HDMI 2.1, DisplayPort 1.4, and 90W USB-C hub"
    ],
    reviews: [
      { id: "rev-9", author: "Karan Mehta", rating: 5, date: "2026-10-25", comment: "Games look mind-blowing and split screen productivity is unmatched." }
    ]
  }
];

export const categories = [
  { name: "All", icon: "LayoutGrid" },
  { name: "Electronics", icon: "Cpu", count: 4 },
  { name: "Audio", icon: "Headphones", count: 2 },
  { name: "Wearables", icon: "Watch", count: 1 },
  { name: "Fashion", icon: "Shirt", count: 3 },
  { name: "Home & Office", icon: "Home", count: 2 },
];
