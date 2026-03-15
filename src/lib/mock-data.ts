/** Number of plushie generations in the current calendar month. */
export const MONTHLY_GENERATIONS = 8;

/** Recent credit ledger entries shown on the profile page. */
export const CREDIT_HISTORY = [
  { date: "2026-03-12", description: "Plushie Generation", credits: -1, balance: 75 },
  { date: "2026-03-11", description: "Plushie Generation", credits: -1, balance: 76 },
  { date: "2026-03-10", description: "Plushie Generation", credits: -1, balance: 77 },
  { date: "2026-03-01", description: "Pro Plan — 100 Credits", credits: 100, balance: 78 },
  { date: "2026-02-28", description: "Plushie Generation", credits: -1, balance: 2 },
  { date: "2026-02-15", description: "Plushie Generation", credits: -1, balance: 3 },
];

export const MOCK_USER = {
  name: "Jane Doe",
  email: "jane@example.com",
  image: null,
  credits: 75,
  plan: "Pro",
  totalGenerations: 42,
  memberSince: "2025-11-15",
};

export const PRICING_PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: 9,
    credits: 30,
    popular: false,
    features: [
      "30 credits per month",
      "Standard quality",
      "720p exports",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    credits: 100,
    popular: true,
    features: [
      "100 credits per month",
      "HD quality",
      "1080p exports",
      "Priority support",
      "Batch processing",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    price: 29,
    credits: 200,
    popular: false,
    features: [
      "200 credits per month",
      "Ultra HD quality",
      "4K exports",
      "Priority support",
      "Batch processing",
      "API access",
      "Custom styles",
    ],
  },
];

export const MOCK_GALLERY = [
  {
    id: "1",
    title: "Family Portrait Plushie",
    style: "Classic Plushie",
    createdAt: "2026-03-12",
    creditCost: 1,
    beforeFrom: "#f9a8d4",
    beforeTo: "#f472b6",
    afterFrom: "#fbbf24",
    afterTo: "#f59e0b",
  },
  {
    id: "2",
    title: "Cat Kawaii Style",
    style: "Kawaii",
    createdAt: "2026-03-11",
    creditCost: 1,
    beforeFrom: "#a78bfa",
    beforeTo: "#8b5cf6",
    afterFrom: "#fb923c",
    afterTo: "#f97316",
  },
  {
    id: "3",
    title: "Dog Realistic Plush",
    style: "Realistic Plush",
    createdAt: "2026-03-10",
    creditCost: 1,
    beforeFrom: "#67e8f9",
    beforeTo: "#22d3ee",
    afterFrom: "#a3e635",
    afterTo: "#84cc16",
  },
  {
    id: "4",
    title: "Baby Chibi Version",
    style: "Chibi",
    createdAt: "2026-03-09",
    creditCost: 1,
    beforeFrom: "#86efac",
    beforeTo: "#4ade80",
    afterFrom: "#f9a8d4",
    afterTo: "#f472b6",
  },
  {
    id: "5",
    title: "Grandma Vintage Teddy",
    style: "Vintage Teddy",
    createdAt: "2026-03-08",
    creditCost: 1,
    beforeFrom: "#fde68a",
    beforeTo: "#fbbf24",
    afterFrom: "#c4b5fd",
    afterTo: "#a78bfa",
  },
  {
    id: "6",
    title: "Best Friend Plushie",
    style: "Classic Plushie",
    createdAt: "2026-03-07",
    creditCost: 1,
    beforeFrom: "#fca5a5",
    beforeTo: "#f87171",
    afterFrom: "#6ee7b7",
    afterTo: "#34d399",
  },
  {
    id: "7",
    title: "Parrot Kawaii",
    style: "Kawaii",
    createdAt: "2026-03-06",
    creditCost: 1,
    beforeFrom: "#93c5fd",
    beforeTo: "#60a5fa",
    afterFrom: "#fdba74",
    afterTo: "#fb923c",
  },
  {
    id: "8",
    title: "Hamster Realistic",
    style: "Realistic Plush",
    createdAt: "2026-03-05",
    creditCost: 1,
    beforeFrom: "#d8b4fe",
    beforeTo: "#c084fc",
    afterFrom: "#fca5a5",
    afterTo: "#f87171",
  },
  {
    id: "9",
    title: "Selfie Chibi",
    style: "Chibi",
    createdAt: "2026-03-04",
    creditCost: 1,
    beforeFrom: "#fbcfe8",
    beforeTo: "#f9a8d4",
    afterFrom: "#93c5fd",
    afterTo: "#60a5fa",
  },
  {
    id: "10",
    title: "Couple Vintage Teddy",
    style: "Vintage Teddy",
    createdAt: "2026-03-03",
    creditCost: 1,
    beforeFrom: "#a5f3fc",
    beforeTo: "#67e8f9",
    afterFrom: "#d9f99d",
    afterTo: "#a3e635",
  },
];

export const PLUSHIE_STYLES = [
  {
    id: "classic",
    name: "Classic Plushie",
    description: "Soft, cuddly plushie with rounded features and stitched details",
  },
  {
    id: "kawaii",
    name: "Kawaii",
    description: "Adorable Japanese-inspired style with big eyes and chibi proportions",
  },
  {
    id: "realistic",
    name: "Realistic Plush",
    description: "Lifelike plush toy with detailed textures and natural proportions",
  },
  {
    id: "chibi",
    name: "Chibi",
    description: "Super-deformed style with oversized head and tiny body",
  },
  {
    id: "vintage",
    name: "Vintage Teddy",
    description: "Classic teddy bear style with button eyes and nostalgic charm",
  },
];

export const TESTIMONIALS = [
  {
    name: "Sarah M.",
    role: "Pet Parent",
    quote:
      "I turned my cat into a plushie and now I want to order a real one! The Kawaii style is absolutely adorable.",
    avatarInitial: "S",
  },
  {
    name: "James T.",
    role: "Gift Enthusiast",
    quote:
      "Made plushie versions of my whole family for Christmas cards. Everyone loved them! So easy to use.",
    avatarInitial: "J",
  },
  {
    name: "Mia L.",
    role: "Content Creator",
    quote:
      "Plushify is my secret weapon for social media content. The AI quality is incredible and it only takes seconds.",
    avatarInitial: "M",
  },
  {
    name: "Carlos R.",
    role: "Illustrator",
    quote:
      "As an artist, I'm impressed by the style variety. The Vintage Teddy option is my favorite — so much personality.",
    avatarInitial: "C",
  },
];
