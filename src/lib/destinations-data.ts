export type Destination = {
  slug: string;
  name: string;
  region: string;
  country: "India" | "International";
  tagline: string;
  bestTime: string;
  budgetPerDay: string;
  vibe: string[];
  image: string;
  hotels: { name: string; price: string; vibe: string }[];
  restaurants: { name: string; cuisine: string; price: string }[];
  sights: { name: string; note: string }[];
};

// Photos via Unsplash (royalty-free, hot-linkable).
const img = (id: string, q = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${q}&q=80`;

export const DESTINATIONS: Destination[] = [
  {
    slug: "goa",
    name: "Goa",
    region: "West India",
    country: "India",
    tagline: "Sun-soaked beaches, Portuguese cafés, and sunset shacks.",
    bestTime: "Nov – Feb",
    budgetPerDay: "₹2,500 – ₹6,000",
    vibe: ["Beach", "Nightlife", "Couples"],
    image: img("1512343879784-a960bf40e7f2"),
    hotels: [
      { name: "Zostel Goa (Anjuna)", price: "₹700 – ₹1,400", vibe: "Backpacker" },
      { name: "W Goa, Vagator", price: "₹18,000+", vibe: "Luxury beachfront" },
      { name: "Stone Wood Resort, Morjim", price: "₹4,500", vibe: "Mid-range boutique" },
    ],
    restaurants: [
      { name: "Gunpowder, Assagao", cuisine: "South Indian", price: "₹1,200 for two" },
      { name: "Thalassa, Vagator", cuisine: "Greek", price: "₹2,000 for two" },
      { name: "Britto's, Baga", cuisine: "Goan seafood", price: "₹1,500 for two" },
    ],
    sights: [
      { name: "Dudhsagar Falls", note: "Jeep safari + train view, ₹400 entry" },
      { name: "Fort Aguada", note: "Sunset spot, free entry" },
      { name: "Old Goa Churches", note: "UNESCO heritage, free" },
    ],
  },
  {
    slug: "manali",
    name: "Manali",
    region: "Himachal Pradesh",
    country: "India",
    tagline: "Snow-dusted peaks, apple orchards, and Old Manali cafés.",
    bestTime: "Mar – Jun · Dec – Jan (snow)",
    budgetPerDay: "₹2,000 – ₹5,000",
    vibe: ["Mountains", "Adventure", "Couples"],
    image: img("1626621341517-bbf3d9990a23"),
    hotels: [
      { name: "Zostel Old Manali", price: "₹600 – ₹1,200", vibe: "Backpacker" },
      { name: "Span Resort & Spa", price: "₹12,000+", vibe: "Riverside luxury" },
      { name: "Apple Country Resort", price: "₹3,500", vibe: "Mid-range" },
    ],
    restaurants: [
      { name: "Johnson's Café", cuisine: "Continental", price: "₹1,200 for two" },
      { name: "Drifters' Inn", cuisine: "Pizza & pasta", price: "₹900 for two" },
      { name: "Café 1947", cuisine: "Italian + live music", price: "₹1,000 for two" },
    ],
    sights: [
      { name: "Solang Valley", note: "Paragliding ₹1,800, skiing in winter" },
      { name: "Hadimba Temple", note: "Cedar-forest shrine, free" },
      { name: "Rohtang Pass", note: "Snow point, permit ₹550" },
    ],
  },
  {
    slug: "jaipur",
    name: "Jaipur",
    region: "Rajasthan",
    country: "India",
    tagline: "Pink City forts, royal palaces, and bazaars of dreams.",
    bestTime: "Oct – Mar",
    budgetPerDay: "₹2,500 – ₹6,000",
    vibe: ["Heritage", "Food", "Family"],
    image: img("1599661046289-e31897846e41"),
    hotels: [
      { name: "Zostel Jaipur", price: "₹700", vibe: "Backpacker" },
      { name: "Rambagh Palace", price: "₹40,000+", vibe: "Heritage luxury" },
      { name: "Pearl Palace Heritage", price: "₹3,200", vibe: "Boutique" },
    ],
    restaurants: [
      { name: "Laxmi Misthan Bhandar", cuisine: "Rajasthani thali", price: "₹500 for two" },
      { name: "Bar Palladio", cuisine: "Italian, royal vibe", price: "₹3,000 for two" },
      { name: "Tapri Central", cuisine: "Chai + snacks", price: "₹400 for two" },
    ],
    sights: [
      { name: "Amber Fort", note: "₹200 entry, go at sunrise" },
      { name: "Hawa Mahal", note: "₹50 entry, photo at 7 AM" },
      { name: "City Palace", note: "₹500 entry, royal museum" },
    ],
  },
  {
    slug: "kerala",
    name: "Kerala Backwaters",
    region: "Alleppey & Kumarakom",
    country: "India",
    tagline: "Coconut palms, houseboats, and the gentlest sunsets in India.",
    bestTime: "Sep – Mar",
    budgetPerDay: "₹3,500 – ₹8,000",
    vibe: ["Nature", "Couples", "Slow travel"],
    image: img("1602216056096-3b40cc0c9944"),
    hotels: [
      { name: "Lake Palace Resort", price: "₹6,500", vibe: "Lakeside boutique" },
      { name: "Kumarakom Lake Resort", price: "₹22,000+", vibe: "Luxury heritage" },
      { name: "Houseboat (1 night)", price: "₹8,000 – ₹15,000", vibe: "All-inclusive" },
    ],
    restaurants: [
      { name: "Thaff Restaurant, Alleppey", cuisine: "Malabar seafood", price: "₹800 for two" },
      { name: "Cassia, Kumarakom", cuisine: "Kerala fine dining", price: "₹2,500 for two" },
      { name: "Mushroom Restaurant", cuisine: "Vegetarian Kerala", price: "₹500 for two" },
    ],
    sights: [
      { name: "Alleppey Houseboat Cruise", note: "Sunset cruise from ₹1,500/person" },
      { name: "Marari Beach", note: "Quiet beach day, free" },
      { name: "Pathiramanal Island", note: "Bird sanctuary, ferry ₹50" },
    ],
  },
  {
    slug: "rishikesh",
    name: "Rishikesh",
    region: "Uttarakhand",
    country: "India",
    tagline: "Ganga aarti, yoga sunrises, and white-water adrenaline.",
    bestTime: "Sep – Nov · Feb – May",
    budgetPerDay: "₹1,500 – ₹4,000",
    vibe: ["Spiritual", "Adventure", "Solo"],
    image: img("1591018653840-4be3afbe5b95"),
    hotels: [
      { name: "Live Free Hostel", price: "₹600", vibe: "Backpacker" },
      { name: "Ananda in the Himalayas", price: "₹45,000+", vibe: "Wellness luxury" },
      { name: "Aloha on the Ganges", price: "₹5,500", vibe: "Riverside mid-range" },
    ],
    restaurants: [
      { name: "Little Buddha Café", cuisine: "Continental, river view", price: "₹800 for two" },
      { name: "Beatles Café", cuisine: "Israeli + Indian", price: "₹700 for two" },
      { name: "Chotiwala", cuisine: "Classic North Indian thali", price: "₹500 for two" },
    ],
    sights: [
      { name: "Triveni Ghat Aarti", note: "Evening ceremony, free" },
      { name: "Rafting Shivpuri → Rishikesh", note: "16 km, ₹1,200/person" },
      { name: "Beatles Ashram", note: "₹150 entry, street-art ruins" },
    ],
  },
  {
    slug: "udaipur",
    name: "Udaipur",
    region: "Rajasthan",
    country: "India",
    tagline: "Lake palaces, ghats at dusk, and India's most romantic city.",
    bestTime: "Oct – Mar",
    budgetPerDay: "₹3,000 – ₹7,000",
    vibe: ["Heritage", "Couples", "Photography"],
    image: img("1568454537842-d933259bb1ce"),
    hotels: [
      { name: "Zostel Udaipur", price: "₹700", vibe: "Backpacker" },
      { name: "Taj Lake Palace", price: "₹60,000+", vibe: "Iconic luxury" },
      { name: "Jaiwana Haveli", price: "₹3,500", vibe: "Lakeside boutique" },
    ],
    restaurants: [
      { name: "Ambrai Restaurant", cuisine: "Lake-view fine dining", price: "₹2,500 for two" },
      { name: "Café Edelweiss", cuisine: "Bakery + breakfast", price: "₹600 for two" },
      { name: "1559 AD", cuisine: "Rajasthani thali", price: "₹1,500 for two" },
    ],
    sights: [
      { name: "City Palace", note: "₹300 entry, half-day visit" },
      { name: "Lake Pichola Boat Ride", note: "Sunset cruise ₹400" },
      { name: "Bagore Ki Haveli", note: "Folk dance show ₹100" },
    ],
  },
  {
    slug: "bali",
    name: "Bali",
    region: "Indonesia",
    country: "International",
    tagline: "Rice terraces, surf villages, and Ubud's jungle yoga.",
    bestTime: "Apr – Oct",
    budgetPerDay: "₹4,000 – ₹10,000",
    vibe: ["Beach", "Wellness", "Couples"],
    image: img("1537996194471-e657df975ab4"),
    hotels: [
      { name: "Wonderloft Hostel, Seminyak", price: "₹900", vibe: "Backpacker" },
      { name: "Bisma Eight, Ubud", price: "₹12,000", vibe: "Boutique" },
      { name: "Four Seasons Sayan", price: "₹65,000+", vibe: "Luxury jungle" },
    ],
    restaurants: [
      { name: "Locavore, Ubud", cuisine: "Tasting menu", price: "₹9,000 for two" },
      { name: "La Brisa, Canggu", cuisine: "Beach club", price: "₹4,000 for two" },
      { name: "Warung Babi Guling Ibu Oka", cuisine: "Balinese local", price: "₹600 for two" },
    ],
    sights: [
      { name: "Tegallalang Rice Terraces", note: "Free entry, go at 7 AM" },
      { name: "Uluwatu Temple + Kecak", note: "₹300 entry, sunset show" },
      { name: "Mt Batur Sunrise Trek", note: "₹3,000/person, 4 AM start" },
    ],
  },
  {
    slug: "ladakh",
    name: "Ladakh",
    region: "North India",
    country: "India",
    tagline: "Moonscapes, monasteries, and the world's highest motorable passes.",
    bestTime: "Jun – Sep",
    budgetPerDay: "₹3,000 – ₹7,000",
    vibe: ["Adventure", "Mountains", "Roadtrip"],
    image: img("1589182337358-2cb63099350c"),
    hotels: [
      { name: "Zostel Leh", price: "₹900", vibe: "Backpacker" },
      { name: "The Grand Dragon Ladakh", price: "₹14,000", vibe: "Luxury" },
      { name: "Nimmu House", price: "₹9,000", vibe: "Heritage boutique" },
    ],
    restaurants: [
      { name: "Bon Appétit, Leh", cuisine: "Ladakhi + Continental", price: "₹1,200 for two" },
      { name: "Tibetan Kitchen", cuisine: "Momos, thukpa", price: "₹600 for two" },
      { name: "Gesmo Café", cuisine: "Bakery breakfast", price: "₹400 for two" },
    ],
    sights: [
      { name: "Pangong Lake", note: "Day trip from Leh, permit ₹600" },
      { name: "Nubra Valley", note: "Camel safari ₹1,500" },
      { name: "Thiksey Monastery", note: "Sunrise prayers, free" },
    ],
  },
];

export const findDestination = (slug: string) =>
  DESTINATIONS.find((d) => d.slug === slug);
