"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Lightbulb, Trash2, CheckSquare, ChevronDown, ChevronUp, Heart } from "lucide-react";
import Header from "@/app/(auth)/_components/Header";
import Footer from "@/app/(auth)/_components/Footer";

interface Tip {
  id: string;
  title: string;
  category: "Sort Smart" | "Reduce Waste" | "Reuse & Recycle" | "Food & Organics" | "E-Waste & Hazardous" | "Eco Habits";
  description: string;
  whyItMatters: string;
  steps: string[];
  icon: string;
}

const TIPS_DATA: Tip[] = [
  {
    id: "tip-plastic-numbers",
    title: "Decode the Plastic Numbers on Packaging",
    category: "Sort Smart",
    description: "Learn how to read the resin identification codes (1 to 7) on plastic containers so you only throw in recyclable items.",
    whyItMatters: "Most recycling facilities can only process plastic #1 (PETE) and #2 (HDPE). Throwing in others contaminates recyclables.",
    steps: [
      "Check the bottom or side of the plastic container for the chasing arrows triangle.",
      "Look at the number (1-7) inside the triangle.",
      "If it's #1 (water bottles, peanut butter jars) or #2 (milk jugs, shampoo bottles), rinse and put in recycling.",
      "If it's #3, #4, #5, #6, or #7, check local guidelines or dispose of in general waste to avoid contamination."
    ],
    icon: "♻️"
  },
  {
    id: "tip-clean-jars",
    title: "Always Wash Out Food Residues",
    category: "Sort Smart",
    description: "Dirty recycling containers can cause an entire batch of recyclables to be sent directly to the landfill.",
    whyItMatters: "Food and liquid decay ruins paper recyclables nearby and damages mechanical sorting sensors.",
    steps: [
      "Empty any remaining food particles or liquids into trash/compost.",
      "Fill the container with warm water, add a tiny drop of dish soap, and shake or scrub.",
      "Let it dry completely before tossing it into the recycle bin."
    ],
    icon: "🧽"
  },
  {
    id: "tip-ditch-bags",
    title: "Avoid Curbside Recycling Bags",
    category: "Sort Smart",
    description: "Toss recyclables loosely into your bin. Never bag them in plastic grocery or trash bags.",
    whyItMatters: "Sorting workers cannot rip open trash bags quickly, so bagged recyclables are usually discarded as trash.",
    steps: [
      "Keep a reusable storage bin inside to collect loose papers, clean plastics, and metals.",
      "Empty the storage bin directly (loose) into your curbside blue bin.",
      "Reuse or recycle your transport bags separately at supermarket drop-offs."
    ],
    icon: "🚫"
  },
  {
    id: "tip-weekly-planning",
    title: "Plan Meals and Keep a Grocery List",
    category: "Reduce Waste",
    description: "Reduce food waste and save money by planning your meals and buying only what you actually need.",
    whyItMatters: "Food waste accounts for a massive percentage of greenhouse gases emitted from landfills globally.",
    steps: [
      "Audit your fridge and pantry once a week before grocery shopping.",
      "Write down a concrete meal plan for 5 out of 7 days.",
      "Create a strict shopping list based on the ingredients needed and stick to it at the store.",
      "Designate a 'Use First' shelf in your fridge for ingredients that expire soon."
    ],
    icon: "📝"
  },
  {
    id: "tip-ditch-disposables",
    title: "Switch to Durable Reusables",
    category: "Reduce Waste",
    description: "Replace single-use items in your daily routine with high-quality reusable alternatives.",
    whyItMatters: "A single reusable bottle or bag can replace thousands of single-use items throughout its lifespan.",
    steps: [
      "Keep a reusable water bottle and canvas shopping bag in your car or backpack.",
      "Swap paper towels with micro-fiber cloths or cotton dish towels.",
      "Use reusable containers or beeswax wraps instead of plastic cling wrap for leftovers."
    ],
    icon: "🛍️"
  },
  {
    id: "tip-bulk-shopping",
    title: "Buy Grains and Spices in Bulk",
    category: "Reduce Waste",
    description: "Shop from the bulk bins at grocery stores to eliminate cardboard and plastic packaging.",
    whyItMatters: "Eliminating packaging at the consumer level prevents upstream manufacturing emissions and plastics.",
    steps: [
      "Collect empty glass jars or purchase lightweight cotton bulk bags.",
      "Tare (weigh) your jars at the counter before filling them.",
      "Fill them with bulk oats, rice, lentils, nuts, or spices.",
      "Label them and check out, paying only for the food, not the package."
    ],
    icon: "🫙"
  },
  {
    id: "tip-repurpose-jars",
    title: "Upcycle Glass Jars and Jams",
    category: "Reuse & Recycle",
    description: "Upcycle pickle and jam jars into food storage, desk organizers, or propagation vessels.",
    whyItMatters: "Reusing items is far more energy-efficient than recycling them, which requires melting glass down.",
    steps: [
      "Soak empty jars in hot soapy water to peel off adhesive paper labels easily.",
      "Sterilize the jar by washing it on the top rack of your dishwasher.",
      "Use it to pack lunch, store pantry staples, or hold pens and stationery."
    ],
    icon: "🍯"
  },
  {
    id: "tip-composting-diy",
    title: "Set Up a Simple Compost Pile",
    category: "Food & Organics",
    description: "Establish a backyard or balcony compost system to recycle nutrient-rich organic waste.",
    whyItMatters: "Composting keeps organic scraps out of landfills where they would release harmful methane gas.",
    steps: [
      "Obtain a ventilated bin or clear a small patch in your yard.",
      "Layer 'browns' (dry leaves, twigs, cardboard) on the bottom.",
      "Add your 'greens' (fruit scraps, vegetable peels, coffee grounds).",
      "Stir once every 2 weeks to introduce oxygen and keep it moist like a wrung-out sponge."
    ],
    icon: "🍂"
  },
  {
    id: "tip-hazardous-batteries",
    title: "Never Throw Batteries in the Trash",
    category: "E-Waste & Hazardous",
    description: "Collect spent batteries in a box and take them to a designated e-waste drop-off point.",
    whyItMatters: "Batteries leak toxic heavy metals like lead, mercury, and lithium into landfills, contaminating aquifers.",
    steps: [
      "Place a small dedicated jar or box in your utility closet for dead batteries.",
      "Tape the terminal ends of lithium or 9V batteries to prevent accidental fire hazards.",
      "Once full, drop them off at a local recycling depot, library, or hardware store that accepts batteries."
    ],
    icon: "🔋"
  },
  {
    id: "tip-cold-wash",
    title: "Wash Clothes in Cold Water",
    category: "Eco Habits",
    description: "Switch your washing machine settings to cold water to save energy and extend clothing life.",
    whyItMatters: "About 75% to 90% of the energy your washing machine uses goes toward heating the water.",
    steps: [
      "Turn the washing machine dial to 'Cold' or '30°C'.",
      "Use cold-water-optimized laundry detergents to ensure spotless cleaning.",
      "Hang clothes to dry outdoors or on a rack instead of running the dryer."
    ],
    icon: "👕"
  }
];

export default function TipsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedTipId, setExpandedTipId] = useState<string | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [tips, setTips] = useState<Tip[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("binbuddy_tips");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setTips([...parsed, ...TIPS_DATA]);
          return;
        } catch (e) {
          console.error(e);
        }
      }
    }
    setTips(TIPS_DATA);
  }, []);

  const categories = ["All", "Sort Smart", "Reduce Waste", "Reuse & Recycle", "Food & Organics", "E-Waste & Hazardous", "Eco Habits"];

  // Handle Search and Filter
  const filteredTips = useMemo(() => {
    return tips.filter((tip) => {
      const matchesSearch =
        tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tip.whyItMatters.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || tip.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, tips]);

  const toggleExpand = (id: string) => {
    setExpandedTipId((prev) => (prev === id ? null : id));
  };

  const handleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleStepCheck = (stepId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [stepId]: e.target.checked,
    }));
  };

  return (
    <main className="min-h-screen bg-[#F3F0DE] font-sans flex flex-col">
      <Header />
      <div className="flex-grow max-w-7xl w-full mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-green-900 hover:text-green-700 font-semibold transition"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>

        {/* Hero Banner */}
        <header className="bg-[#124B34] text-white rounded-3xl p-8 md:p-12 mb-12 relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200')] bg-cover bg-center" />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-green-300 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-semibold mb-4 border border-white/10">
              <Lightbulb size={14} />
              Bite-sized Eco Tips
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Tips & Sustainability Guides
            </h1>
            <p className="mt-4 text-green-100 text-sm md:text-base max-w-xl mx-auto">
              Small, simple actions add up to a massive environmental impact. Learn how to sort, compost, reduce waste, and build sustainable habits.
            </p>
          </div>
        </header>

        {/* Controls: Search and Filters */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-150 mb-12 flex flex-col lg:flex-row gap-6 justify-between items-center">
          {/* Categories Tab */}
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start w-full lg:w-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
                  selectedCategory === category
                    ? "bg-[#124B34] text-white shadow-sm"
                    : "bg-[#F3F0DE] text-green-900 hover:bg-green-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 w-full rounded-xl border border-gray-300 py-2.5 text-sm text-black caret-green-900 focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition bg-[#F3F0DE]/50"
              placeholder="Search guides, action steps..."
            />
          </div>
        </section>

        {/* Tips Grid list */}
        {filteredTips.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTips.map((tip) => {
              const isExpanded = expandedTipId === tip.id;
              const isFav = !!favorites[tip.id];
              return (
                <article
                  key={tip.id}
                  onClick={() => toggleExpand(tip.id)}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition duration-300 flex flex-col p-6 cursor-pointer relative"
                >
                  {/* Category, Points & Heart Row */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl">{tip.icon}</span>
                    
                    <div className="flex items-center gap-2">
                      <span className="bg-green-50 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200 uppercase">
                        {tip.category}
                      </span>
                      
                      <button
                        onClick={(e) => handleFavorite(tip.id, e)}
                        className={`p-1.5 rounded-full transition ${
                          isFav ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-400 hover:text-red-500"
                        }`}
                      >
                        <Heart size={14} fill={isFav ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>

                  {/* Title & short description */}
                  <h3 className="text-lg font-bold text-green-900 mb-2 leading-tight">
                    {tip.title}
                  </h3>

                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {tip.description}
                  </p>

                  {/* Expandable Section */}
                  {isExpanded && (
                    <div className="mt-4 border-t border-gray-100 pt-4 animate-in slide-in-from-top-4 duration-200">
                      {/* Why it matters */}
                      <div className="mb-4 bg-green-50/50 p-4 rounded-2xl border border-green-100">
                        <h4 className="text-xs font-bold text-green-900 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                          <Trash2 size={12} />
                          Why It Matters
                        </h4>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          {tip.whyItMatters}
                        </p>
                      </div>

                      {/* Step-by-Step Checklist */}
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                          <CheckSquare size={12} />
                          Action Checklist
                        </h4>
                        
                        <ul className="space-y-2.5">
                          {tip.steps.map((step, idx) => {
                            const stepKey = `${tip.id}-step-${idx}`;
                            return (
                              <li
                                key={idx}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-start gap-2.5"
                              >
                                <input
                                  type="checkbox"
                                  id={stepKey}
                                  checked={!!checkedSteps[stepKey]}
                                  onChange={(e) => handleStepCheck(stepKey, e)}
                                  className="mt-0.5 accent-green-800 w-4 h-4 rounded border-gray-300 cursor-pointer"
                                />
                                <label
                                  htmlFor={stepKey}
                                  className={`text-xs text-gray-700 leading-relaxed cursor-pointer select-none ${
                                    checkedSteps[stepKey] ? "line-through text-gray-400" : ""
                                  }`}
                                >
                                  {step}
                                </label>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Toggle Indicator */}
                  <div className="text-center mt-auto text-gray-400 hover:text-green-800 transition pt-3 border-t border-gray-50">
                    {isExpanded ? <ChevronUp size={16} className="mx-auto" /> : <ChevronDown size={16} className="mx-auto" />}
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-150 shadow-sm max-w-lg mx-auto">
            <Lightbulb size={48} className="text-green-800 mx-auto opacity-40 mb-4" />
            <h3 className="text-lg font-bold text-green-900">No Guides Found</h3>
            <p className="text-gray-500 text-sm mt-2 px-6">
              No tips matched "{searchQuery}" under category "{selectedCategory}". Try another filter category or search keyword.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
