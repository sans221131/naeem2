"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ActivityCard from "@/components/ActivityCard";
import ContactForm from "@/components/ContactForm";
import type { Activity } from "../../../../db/schema";

// Map of destination IDs to display names, flags, hero images, and descriptions
const destinationInfo: Record<
  string,
  { name: string; flag: string; image: string; description: string[] }
> = {
  argentina: {
    name: "Argentina",
    flag: "🇦🇷",
    image: "/countries/argentina.webp",
    description: [
      "Experience vibrant cities that blend European elegance with Latin soul.",
      "Savor regional cuisine, from classic parrillas to contemporary bistros.",
      "Explore sweeping plains and dramatic mountain backdrops for outdoor thrills.",
      "Enjoy lively cultural nights filled with music, dance, and local markets.",
      "Unwind with scenic drives and unforgettable sunsets across diverse regions.",
    ],
  },
  australia: {
    name: "Australia",
    flag: "🇦🇺",
    image: "/countries/australia.webp",
    description: [
      "Discover coastal cities known for beaches, cafés, and laid-back charm.",
      "Venture into vast outback landscapes with iconic natural wonders.",
      "Meet unique wildlife on guided experiences and conservation tours.",
      "Enjoy world-class road trips along dramatic shorelines.",
      "Balance adventure and relaxation with sun-soaked escapes year-round.",
    ],
  },
  austria: {
    name: "Austria",
    flag: "🇦🇹",
    image: "/countries/austria.jpg",
    description: [
      "Stroll through elegant cities rich with music, art, and history.",
      "Admire alpine scenery with picture-perfect lakes and villages.",
      "Taste refined cuisine alongside cozy café culture.",
      "Enjoy seasonal festivals that celebrate heritage and local traditions.",
      "Find tranquil escapes in mountain towns and scenic valleys.",
    ],
  },
  bali: {
    name: "Bali",
    flag: "🇮🇩",
    image: "/countries/bali.jpg",
    description: [
      "Relax on tropical beaches with warm waters and golden sunsets.",
      "Explore lush rice terraces and serene inland landscapes.",
      "Experience vibrant ceremonies, crafts, and spiritual heritage.",
      "Indulge in wellness retreats and rejuvenating spa rituals.",
      "Savor island flavors with fresh seafood and local specialties.",
    ],
  },
  belgium: {
    name: "Belgium",
    flag: "🇧🇪",
    image: "/countries/belgium.jpg",
    description: [
      "Wander through medieval squares and canal-lined towns.",
      "Taste famed chocolates, waffles, and artisanal brews.",
      "Explore art-filled museums and grand historic architecture.",
      "Enjoy lively cafés and neighborhood markets.",
      "Take easy day trips between charming cities and countryside.",
    ],
  },
  brazil: {
    name: "Brazil",
    flag: "🇧🇷",
    image: "/countries/brazil.jpg",
    description: [
      "Feel the energy of vibrant cities and iconic beach culture.",
      "Discover diverse landscapes from rainforests to dramatic coastlines.",
      "Experience lively music, dance, and festive street scenes.",
      "Sample regional dishes bursting with tropical flavors.",
      "Balance adventure with relaxing seaside escapes.",
    ],
  },
  bulgaria: {
    name: "Bulgaria",
    flag: "🇧🇬",
    image: "/countries/bulgaria.jpg",
    description: [
      "Explore historic towns with layers of culture and tradition.",
      "Enjoy mountain retreats with crisp air and scenic trails.",
      "Visit Black Sea resorts with relaxed coastal vibes.",
      "Try hearty cuisine rooted in regional ingredients.",
      "Discover folklore, festivals, and warm local hospitality.",
    ],
  },
  canada: {
    name: "Canada",
    flag: "🇨🇦",
    image: "/countries/canada.webp",
    description: [
      "Experience welcoming cities with diverse neighborhoods and culture.",
      "Marvel at vast wilderness, lakes, and mountain ranges.",
      "Enjoy outdoor adventures year-round, from hikes to snowy escapes.",
      "Sample global cuisine shaped by multicultural communities.",
      "Take scenic journeys across expansive, breathtaking landscapes.",
    ],
  },
  china: {
    name: "China",
    flag: "🇨🇳",
    image: "/countries/china.jpg",
    description: [
      "Explore ancient landmarks alongside modern skylines.",
      "Discover diverse regions with distinct cuisines and traditions.",
      "Visit dramatic natural landscapes and serene countryside.",
      "Experience bustling markets and vibrant street life.",
      "Immerse yourself in heritage, arts, and timeless architecture.",
    ],
  },
  croatia: {
    name: "Croatia",
    flag: "🇭🇷",
    image: "/countries/coratia.jpg",
    description: [
      "Enjoy crystal-clear coastlines and island-hopping adventures.",
      "Stroll through historic walled cities and seaside promenades.",
      "Explore national parks with waterfalls and lush forests.",
      "Taste Mediterranean flavors and local seafood.",
      "Soak in sunsets over the Adriatic with relaxed coastal charm.",
    ],
  },
  cuba: {
    name: "Cuba",
    flag: "🇨🇺",
    image: "/countries/cuba.jpg",
    description: [
      "Step into colorful streets with classic architecture and music.",
      "Relax on beaches with turquoise waters and warm breezes.",
      "Discover local crafts, dance, and cultural traditions.",
      "Sample iconic cuisine and vibrant café culture.",
      "Enjoy a laid-back atmosphere full of character and charm.",
    ],
  },
  czechia: {
    name: "Czechia",
    flag: "🇨🇿",
    image: "/countries/czechia.jpeg",
    description: [
      "Wander through fairytale towns and cobblestone streets.",
      "Explore grand castles and centuries-old landmarks.",
      "Enjoy hearty cuisine and local brews in cozy pubs.",
      "Discover artsy districts and cultural festivals.",
      "Take scenic trips through countryside and river valleys.",
    ],
  },
  denmark: {
    name: "Denmark",
    flag: "🇩🇰",
    image: "/countries/denmark.jpg",
    description: [
      "Experience charming cities with design-forward culture.",
      "Cycle along waterfronts and explore cozy neighborhoods.",
      "Visit historic castles and coastal villages.",
      "Enjoy fresh, seasonal cuisine and café life.",
      "Embrace a relaxed pace with hygge-inspired moments.",
    ],
  },
  dominican: {
    name: "Dominican Republic",
    flag: "🇩🇴",
    image: "/countries/dominican.jpg",
    description: [
      "Unwind on sunlit beaches and palm-lined shores.",
      "Explore colonial history in vibrant city centers.",
      "Enjoy water adventures in crystal-clear bays.",
      "Taste island cuisine with fresh, tropical ingredients.",
      "Balance resort comfort with local culture and music.",
    ],
  },
  dubai: {
    name: "Dubai",
    flag: "🇦🇪",
    image: "/countries/dubai.jpg",
    description: [
      "Discover a skyline of bold architecture and modern marvels.",
      "Enjoy luxury shopping, dining, and world-class experiences.",
      "Explore desert landscapes with dune adventures and sunsets.",
      "Visit cultural districts showcasing heritage and artistry.",
      "Relax at beachfront promenades with a vibrant city vibe.",
    ],
  },
  egypt: {
    name: "Egypt",
    flag: "🇪🇬",
    image: "/countries/egypt.avif",
    description: [
      "Journey through ancient history with iconic monuments and temples.",
      "Cruise along scenic waterways lined with timeless landscapes.",
      "Discover bustling markets and vibrant city life.",
      "Relax on coastal resorts with warm, clear seas.",
      "Experience rich traditions, cuisine, and local hospitality.",
    ],
  },
  france: {
    name: "France",
    flag: "🇫🇷",
    image: "/countries/france.jpg",
    description: [
      "Explore elegant cities filled with art, fashion, and history.",
      "Savor world-renowned cuisine and regional specialties.",
      "Stroll through charming villages and countryside vineyards.",
      "Relax along scenic coastlines and riverside towns.",
      "Discover culture at every turn, from museums to markets.",
    ],
  },
  germany: {
    name: "Germany",
    flag: "🇩🇪",
    image: "/countries/germany.webp",
    description: [
      "Experience dynamic cities with modern culture and history.",
      "Explore castles, forests, and picturesque countryside.",
      "Enjoy hearty regional dishes and celebrated brews.",
      "Discover lively festivals and seasonal markets.",
      "Travel easily between vibrant hubs and quiet villages.",
    ],
  },
  greece: {
    name: "Greece",
    flag: "🇬🇷",
    image: "/countries/greece.jpg",
    description: [
      "Visit ancient sites that shaped world history.",
      "Relax on island beaches with sparkling blue waters.",
      "Savor Mediterranean flavors in seaside tavernas.",
      "Wander whitewashed villages and coastal promenades.",
      "Enjoy golden sunsets and a laid-back island rhythm.",
    ],
  },
  hungary: {
    name: "Hungary",
    flag: "🇭🇺",
    image: "/countries/hungary.jpg",
    description: [
      "Discover grand architecture and riverside city views.",
      "Unwind in renowned thermal baths and spa traditions.",
      "Explore charming towns and countryside wineries.",
      "Taste rich, comforting cuisine with local flavors.",
      "Enjoy cultural performances and historic landmarks.",
    ],
  },
  india: {
    name: "India",
    flag: "🇮🇳",
    image: "/countries/india.jpg",
    description: [
      "Experience vibrant cities with colorful markets and traditions.",
      "Explore diverse landscapes from mountains to tropical coasts.",
      "Savor bold regional cuisine and street food delights.",
      "Visit historic landmarks and spiritual sites.",
      "Immerse yourself in festivals, arts, and local culture.",
    ],
  },
  ireland: {
    name: "Ireland",
    flag: "🇮🇪",
    image: "/countries/ireland.webp",
    description: [
      "Enjoy rolling green landscapes and dramatic coastal cliffs.",
      "Explore lively cities filled with music and storytelling.",
      "Visit historic castles and charming villages.",
      "Relax in cozy pubs with warm local hospitality.",
      "Take scenic drives along iconic coastal routes.",
    ],
  },
  italy: {
    name: "Italy",
    flag: "🇮🇹",
    image: "/countries/italy.jpg",
    description: [
      "Admire timeless art, architecture, and historic landmarks.",
      "Savor regional cuisine, from rustic to refined.",
      "Stroll through charming towns and vibrant city squares.",
      "Relax by lakes, coastlines, and countryside vineyards.",
      "Experience a rich cultural heritage in every region.",
    ],
  },
  jamaica: {
    name: "Jamaica",
    flag: "🇯🇲",
    image: "/countries/jamiaca.jpg",
    description: [
      "Soak up sun-drenched beaches and turquoise waters.",
      "Enjoy reggae rhythms and lively island culture.",
      "Explore lush mountains, waterfalls, and nature trails.",
      "Taste flavorful cuisine with bold local spices.",
      "Relax with a laid-back vibe and warm hospitality.",
    ],
  },
  japan: {
    name: "Japan",
    flag: "🇯🇵",
    image: "/countries/japan.jpg",
    description: [
      "Discover a blend of timeless tradition and modern innovation.",
      "Explore vibrant cities, serene temples, and scenic gardens.",
      "Savor seasonal cuisine and renowned culinary craftsmanship.",
      "Experience cultural festivals and historic neighborhoods.",
      "Travel through varied landscapes from mountains to coastlines.",
    ],
  },
  jordan: {
    name: "Jordan",
    flag: "🇯🇴",
    image: "/countries/jordan.webp",
    description: [
      "Explore ancient wonders carved into dramatic landscapes.",
      "Experience desert adventures and starry night skies.",
      "Relax by mineral-rich waters and tranquil shores.",
      "Discover vibrant markets and warm local hospitality.",
      "Enjoy regional flavors with traditional cuisine.",
    ],
  },
  london: {
    name: "London",
    flag: "🇬🇧",
    image: "/countries/london.jpg",
    description: [
      "Experience iconic landmarks and world-class museums.",
      "Explore diverse neighborhoods with unique character.",
      "Enjoy theaters, markets, and vibrant nightlife.",
      "Savor global cuisine in lively dining districts.",
      "Stroll along riverside paths and historic streets.",
    ],
  },
  malaysia: {
    name: "Malaysia",
    flag: "🇲🇾",
    image: "/countries/malaysia.webp",
    description: [
      "Discover bustling cities and lush tropical landscapes.",
      "Relax on island beaches with clear, warm waters.",
      "Experience rich multicultural traditions and festivals.",
      "Savor diverse cuisine blending regional flavors.",
      "Explore rainforest adventures and vibrant markets.",
    ],
  },
  mexico: {
    name: "Mexico",
    flag: "🇲🇽",
    image: "/countries/mexico.avif",
    description: [
      "Explore colorful cities rich in history and art.",
      "Relax on beautiful beaches with laid-back charm.",
      "Discover ancient sites and cultural landmarks.",
      "Taste bold cuisine with regional specialties.",
      "Enjoy lively music, festivals, and local markets.",
    ],
  },
  morocco: {
    name: "Morocco",
    flag: "🇲🇦",
    image: "/countries/morocco.avif",
    description: [
      "Wander through vibrant souks and historic medinas.",
      "Experience desert landscapes and mountain escapes.",
      "Discover colorful architecture and intricate design.",
      "Savor aromatic cuisine with rich spices.",
      "Enjoy warm hospitality and lively cultural traditions.",
    ],
  },
  netherlands: {
    name: "Netherlands",
    flag: "🇳🇱",
    image: "/countries/netherlands.avif",
    description: [
      "Explore canal cities with charming bridges and cafés.",
      "Cycle through scenic countryside and colorful towns.",
      "Visit museums showcasing art and history.",
      "Enjoy lively markets and local food scenes.",
      "Experience a relaxed pace and welcoming culture.",
    ],
  },
  newzealand: {
    name: "New Zealand",
    flag: "🇳🇿",
    image: "/countries/newzealand.webp",
    description: [
      "Experience dramatic landscapes from mountains to fjords.",
      "Enjoy outdoor adventures across lakes, trails, and coasts.",
      "Discover welcoming towns and local culture.",
      "Savor fresh cuisine and regional wines.",
      "Take scenic drives through unforgettable natural beauty.",
    ],
  },
  norway: {
    name: "Norway",
    flag: "🇳🇴",
    image: "/countries/Norway.jpg",
    description: [
      "Explore fjords with towering cliffs and serene waters.",
      "Experience vibrant cities with modern design and culture.",
      "Enjoy outdoor adventures in pristine natural settings.",
      "Savor fresh, seasonal cuisine and coastal flavors.",
      "Discover tranquil villages and scenic routes.",
    ],
  },
  poland: {
    name: "Poland",
    flag: "🇵🇱",
    image: "/countries/poland.avif",
    description: [
      "Explore historic cities with charming old towns.",
      "Discover castles, cathedrals, and cultural landmarks.",
      "Enjoy hearty cuisine with traditional favorites.",
      "Visit scenic countryside and mountain regions.",
      "Experience lively markets and warm local hospitality.",
    ],
  },
  portugal: {
    name: "Portugal",
    flag: "🇵🇹",
    image: "/countries/portugal.jpg",
    description: [
      "Wander through coastal cities with colorful neighborhoods.",
      "Relax on sunny beaches and dramatic cliffs.",
      "Enjoy local cuisine, pastries, and fresh seafood.",
      "Discover historic towns and scenic river valleys.",
      "Savor relaxed vibes and golden Atlantic sunsets.",
    ],
  },
  qatar: {
    name: "Qatar",
    flag: "🇶🇦",
    image: "/countries/qatar.jpg",
    description: [
      "Experience modern architecture and cultural museums.",
      "Explore desert adventures and scenic dunes.",
      "Enjoy seaside promenades and waterfront views.",
      "Discover local markets and traditional crafts.",
      "Savor international cuisine in a vibrant city setting.",
    ],
  },
  romania: {
    name: "Romania",
    flag: "🇷🇴",
    image: "/countries/romania.jpg",
    description: [
      "Discover medieval towns and storybook castles.",
      "Explore mountains, forests, and scenic landscapes.",
      "Enjoy traditional cuisine with regional flavors.",
      "Visit cultural sites and historic landmarks.",
      "Experience welcoming villages and local traditions.",
    ],
  },
  saudi: {
    name: "Saudi Arabia",
    flag: "🇸🇦",
    image: "/countries/saudi.jpg",
    description: [
      "Explore a blend of heritage sites and modern cities.",
      "Experience vast deserts with dramatic landscapes.",
      "Discover coastal escapes along warm waters.",
      "Enjoy regional cuisine and welcoming hospitality.",
      "Visit cultural districts showcasing art and history.",
    ],
  },
  singapore: {
    name: "Singapore",
    flag: "🇸🇬",
    image: "/countries/singapore.webp",
    description: [
      "Discover a modern city with lush gardens and skylines.",
      "Enjoy diverse neighborhoods and multicultural heritage.",
      "Savor renowned food scenes and hawker delights.",
      "Explore waterfront promenades and vibrant nightlife.",
      "Experience efficient travel with plenty to see and do.",
    ],
  },
  southafrica: {
    name: "South Africa",
    flag: "🇿🇦",
    image: "/countries/southafrica.jpg",
    description: [
      "Experience stunning coastlines and dramatic landscapes.",
      "Explore vibrant cities with rich culture and history.",
      "Enjoy wildlife encounters and scenic outdoor adventures.",
      "Savor diverse cuisine and regional wines.",
      "Discover warm hospitality and colorful local traditions.",
    ],
  },
  southkorea: {
    name: "South Korea",
    flag: "🇰🇷",
    image: "/countries/southkorea.jpg",
    description: [
      "Experience dynamic cities with modern energy and culture.",
      "Explore historic palaces and traditional neighborhoods.",
      "Enjoy flavorful cuisine and vibrant street food.",
      "Discover scenic mountains and coastal escapes.",
      "Enjoy festivals, markets, and a lively arts scene.",
    ],
  },
  spain: {
    name: "Spain",
    flag: "🇪🇸",
    image: "/countries/spain.webp",
    description: [
      "Explore lively cities with art, architecture, and culture.",
      "Relax on sunny beaches along stunning coastlines.",
      "Enjoy tapas, local markets, and regional cuisine.",
      "Experience festivals filled with music and dance.",
      "Wander charming towns and scenic countryside routes.",
    ],
  },
  sweden: {
    name: "Sweden",
    flag: "🇸🇪",
    image: "/countries/sweden.webp",
    description: [
      "Discover stylish cities with waterfront views and design.",
      "Explore forests, lakes, and tranquil outdoor spaces.",
      "Enjoy cozy cafés and seasonal cuisine.",
      "Visit charming towns and cultural landmarks.",
      "Experience a calm, welcoming travel pace.",
    ],
  },
  switzerland: {
    name: "Switzerland",
    flag: "🇨🇭",
    image: "/countries/switzerland.jpg",
    description: [
      "Marvel at alpine scenery with lakes and mountain peaks.",
      "Enjoy scenic rail journeys through pristine landscapes.",
      "Explore charming villages and vibrant cities.",
      "Savor Swiss cuisine and chocolate traditions.",
      "Find peaceful escapes in nature-rich regions.",
    ],
  },
  thailand: {
    name: "Thailand",
    flag: "🇹🇭",
    image: "/countries/thailand.jpg",
    description: [
      "Relax on tropical beaches and island hideaways.",
      "Explore bustling cities with temples and markets.",
      "Enjoy world-famous cuisine and street food.",
      "Discover lush jungles and scenic countryside.",
      "Experience warm hospitality and vibrant culture.",
    ],
  },
  tunisia: {
    name: "Tunisia",
    flag: "🇹🇳",
    image: "/countries/tunisia.webp",
    description: [
      "Explore Mediterranean coastlines and seaside towns.",
      "Discover historic medinas and ancient ruins.",
      "Experience desert landscapes and oasis retreats.",
      "Savor flavorful cuisine with regional spices.",
      "Enjoy a mix of culture, history, and relaxation.",
    ],
  },
  turkey: {
    name: "Turkey",
    flag: "🇹🇷",
    image: "/countries/turkey.jpg",
    description: [
      "Explore vibrant cities bridging cultures and history.",
      "Discover ancient sites and stunning coastal towns.",
      "Savor rich cuisine with diverse regional flavors.",
      "Experience colorful bazaars and local crafts.",
      "Enjoy scenic landscapes from coastlines to valleys.",
    ],
  },
  "united-states": {
    name: "United States",
    flag: "🇺🇸",
    image: "/countries/united-states.jpg",
    description: [
      "Discover iconic cities with culture, music, and food.",
      "Explore diverse landscapes from coasts to mountains.",
      "Enjoy world-class attractions and outdoor adventures.",
      "Experience regional flavors and local traditions.",
      "Travel across varied regions with distinct vibes.",
    ],
  },
  vietnam: {
    name: "Vietnam",
    flag: "🇻🇳",
    image: "/countries/vietnam.webp",
    description: [
      "Explore lively cities and charming historic quarters.",
      "Discover scenic bays, rice fields, and mountain vistas.",
      "Savor fresh, flavorful cuisine and street food culture.",
      "Experience warm hospitality and vibrant traditions.",
      "Enjoy a balance of adventure and relaxed coastal time.",
    ],
  },
};

function formatPrice(activity: Activity): string {
  const price = typeof activity.price === "string" ? parseFloat(activity.price) : Number(activity.price);
  if (!Number.isFinite(price) || price === 0) return "Free";
  return `${activity.currency} ${price.toFixed(2)}`;
}

export default function DestinationPage() {
  const params = useParams();
  const id = params.id as string;
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isContactOpen, setIsContactOpen] = useState(false);
  
  const destination = destinationInfo[id];

  useEffect(() => {
    async function fetchActivities() {
      try {
        const response = await fetch(`/api/destinations/${id}/activities`);
        if (response.ok) {
          const data = await response.json() as Activity[];
          setActivities(data);
        }
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      }
    }

    fetchActivities();
  }, [id]);

  const activeActivities = activities.filter(a => a.isActive);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Breadcrumb */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition">Home</Link>
            <span>/</span>
            <Link href="/destinations" className="hover:text-blue-600 transition">Destinations</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">{destination?.name || id}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl">
            {destination?.image && (
              <Image
                src={destination.image}
                alt={destination.name}
                fill
                className="object-cover"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-5xl md:text-6xl">{destination?.flag}</span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-3 drop-shadow-2xl">
                {destination?.name || id}
              </h1>
              <p className="text-lg md:text-xl text-white/90 drop-shadow-lg">
                {activeActivities.length} {activeActivities.length === 1 ? 'activity' : 'activities'} available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      {destination?.description?.length ? (
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
          <div className="bg-gradient-to-br from-white via-[#FAF7F2] to-white rounded-3xl border border-[#E7E2D9] shadow-[0_20px_60px_-35px_rgba(0,0,0,0.3)] overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                {/* Left: Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-1 w-12 bg-gradient-to-r from-[#0EA5A4] to-[#0EA5A4]/50 rounded-full"></div>
                    <h2 className="text-3xl md:text-4xl font-black text-[#0F172A]">
                      About {destination.name}
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    {destination.description.map((line, index) => (
                      <div key={index} className="flex items-start gap-3 group">
                        <div className="flex-shrink-0 mt-1.5">
                          <div className="h-2 w-2 rounded-full bg-[#0EA5A4] group-hover:scale-125 transition-transform"></div>
                        </div>
                        <p className="text-lg text-[#64748B] leading-relaxed">{line}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: CTA Card */}
                <div className="lg:w-80 flex-shrink-0">
                  <div className="bg-white rounded-2xl border border-[#E7E2D9] shadow-lg p-6 sticky top-24">
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#0EA5A4] to-[#0EA5A4]/80 mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                        Plan Your Trip
                      </h3>
                      <p className="text-sm text-[#64748B]">
                        Get personalized recommendations and exclusive deals
                      </p>
                    </div>
                    
                    <button
                      onClick={() => setIsContactOpen(true)}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0EA5A4] to-[#0EA5A4]/90 hover:from-[#0EA5A4]/90 hover:to-[#0EA5A4] text-white font-bold text-base shadow-md hover:shadow-xl transition-all smooth-hover active:scale-95 mb-3"
                    >
                      Enquire Now
                    </button>
                    
                    <div className="flex items-center justify-center gap-2 text-xs text-[#64748B]">
                      <svg className="w-4 h-4 text-[#0EA5A4]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Free consultation • Quick response</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Activities Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {activeActivities.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              No activities found
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We&apos;re currently adding activities for {destination?.name || id}. Check back soon!
            </p>
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Browse Other Destinations
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
                Available Activities
              </h2>
              <p className="text-gray-600">
                Explore the best experiences in {destination?.name || id}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  destination={destination}
                  formatPrice={formatPrice(activity)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Contact Form Modal */}
      {isContactOpen && (
        <ContactForm
          onClose={() => setIsContactOpen(false)}
          cartItems={[]}
          onSuccess={() => setIsContactOpen(false)}
        />
      )}
    </main>
  );
}
