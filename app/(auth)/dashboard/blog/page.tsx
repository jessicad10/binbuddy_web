"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Clock, Calendar, BookOpen, X, ChevronRight, Share2, Heart, Award } from "lucide-react";
import Header from "@/app/(auth)/_components/Header";
import Footer from "@/app/(auth)/_components/Footer";

interface BlogPost {
  id: string;
  title: string;
  category: "Composting" | "Waste Sorting" | "Eco Living" | "Earth Conservation";
  summary: string;
  content: string[];
  imageUrl: string;
  readTime: string;
  date: string;
  author: string;
  authorRole: string;
  likes: number;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "composting-101",
    title: "Composting 101: Turn Your Kitchen Scraps Into Black Gold",
    category: "Composting",
    summary: "Learn the science of composting at home, what goes in, what stays out, and how to use it to supercharge your garden.",
    imageUrl: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800",
    readTime: "5 min read",
    date: "July 24, 2026",
    author: "Dr. Clara Greenfield",
    authorRole: "Soil Scientist & Ecologist",
    likes: 124,
    content: [
      "Composting is nature's way of recycling. By combining organic kitchen and garden waste under the right conditions, you can produce a nutrient-rich soil amendment known as humus or 'black gold'. It's one of the single most powerful actions an individual can take to divert waste from landfills and fight climate change.",
      "The secret to a successful compost pile lies in balancing two main elements: 'Greens' (nitrogen-rich materials) and 'Browns' (carbon-rich materials). Greens include fruit and vegetable scraps, coffee grounds, and fresh grass clippings. Browns include dry leaves, twigs, shredded cardboard, and paper.",
      "A healthy compost pile should have a ratio of roughly 3 parts Browns to 1 part Greens. Layer them in your compost bin, ensuring there is enough aeration. Moisten the pile occasionally—it should feel like a wrung-out sponge, not soggy.",
      "To accelerate decomposition, turn the compost pile with a pitchfork once every week or two. This introduces oxygen, which is essential for aerobic microbes to do their work. Within 2 to 4 months, your scraps will turn into a dark, crumbly material that smells like fresh forest earth. Mix this into your garden beds to enrich soil structure, retain water, and feed plants naturally."
    ]
  },
  {
    id: "perfect-recycling",
    title: "The 5-Step Guide to Perfect Recycling",
    category: "Waste Sorting",
    summary: "Demystifying the recycle bin. Understand plastic numbers, clean recycling, and how to prevent 'wishcycling'.",
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800",
    readTime: "6 min read",
    date: "July 20, 2026",
    author: "Marcus Vance",
    authorRole: "Waste Management Specialist",
    likes: 98,
    content: [
      "Recycling sounds simple: throw plastic, glass, and paper in the blue bin and save the environment. In reality, modern recycling systems are highly complex, and contamination is a massive issue. 'Wishcycling'—the act of tossing non-recyclable items into the bin hoping they'll be recycled—actually ruins batch after batch of good recycling.",
      "Step 1: Know your plastics. Look at the chasing arrow symbol on your plastic containers. Typically, numbers 1 (PETE) and 2 (HDPE) are widely accepted by almost all curbside programs. Numbers 3 through 7 are much harder to process and are often rejected. Check your local municipal guidelines.",
      "Step 2: Clean and dry. Food residue is the number one enemy of recycling. A quick rinse to remove grease, sauce, or liquids prevents mold growth and paper contamination. Wet paper cannot be recycled because the fibers weaken.",
      "Step 3: Keep it loose. Never bag your recyclables in plastic garbage bags. Sorting facilities use optical scanners and automated belts that cannot open bags, so bagged recyclables are frequently sent straight to the landfill.",
      "Step 4: Say no to 'tanglers'. Hoses, plastic wrap, cords, plastic bags, and clothing get caught in sorting gears, causing system shutdowns and safety hazards. Keep these items out of standard bins.",
      "Step 5: When in doubt, throw it out. It is far better to place an ambiguous item in the general trash than to contaminate an entire truckload of clean recyclables. Follow these steps to ensure your recycling efforts actually make an impact."
    ]
  },
  {
    id: "zero-waste-kitchen",
    title: "10 Simple Habits for a Zero-Waste Kitchen",
    category: "Eco Living",
    summary: "Small, practical steps to eliminate single-use plastics, store food sustainably, and drastically reduce daily trash output.",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800",
    readTime: "4 min read",
    date: "July 15, 2026",
    author: "Elena Rostova",
    authorRole: "Sustainability Blogger",
    likes: 142,
    content: [
      "The kitchen is often the biggest source of household waste, from plastic packaging to discarded food. Transitioning to a zero-waste kitchen doesn't have to happen overnight. By adopting a few simple habits, you can significantly reduce your environmental footprint and save money.",
      "1. Ditch paper towels: Replace them with reusable cotton cloths and microfiber rags. Keep a basket for clean cloths and a jar or bin for dirty ones.",
      "2. Embrace glass jars: Instead of buying plastic storage bags, reuse clean jars from pasta sauce, jam, and pickles to store leftovers, dry grains, and spices.",
      "3. Shop the bulk section: Bring your own reusable cotton produce bags and jars to buy grains, nuts, flour, and oils package-free.",
      "4. Ditch the plastic wrap: Use beeswax wraps, silicone bowl covers, or simply place a plate over a bowl to keep food fresh in the fridge.",
      "5. Plan meals and eat leftovers: Food waste releases methane in landfills. Plan your weekly meals, stick to a shopping list, and dedicate one night a week to clearing out leftovers.",
      "6. Switch to solid dish soap: Trade liquid dish soap in plastic bottles for solid soap blocks and natural wood scrub brushes.",
      "7. Freeze vegetable scraps: Keep a bag in the freezer for onion skins, carrot peels, and celery ends. When full, boil them to make delicious, free vegetable broth.",
      "8. Opt for loose-leaf tea: Many tea bags contain microplastics that don't biodegrade. Switch to loose-leaf tea with a metal infuser.",
      "9. Buy locally and seasonally: Reduce carbon emissions from food transportation by supporting local farmer's markets.",
      "10. Set up a compost bowl: Keep a small bowl or container on your counter during prep to collect peels and scraps, ready to carry to your outdoor bin."
    ]
  },
  {
    id: "reforestation-power",
    title: "Our Forests, Our Future: The Power of Reforestation",
    category: "Earth Conservation",
    summary: "Why planting native trees is one of the most effective strategies to combat climate change, restore biodiversity, and heal soil.",
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
    readTime: "7 min read",
    date: "July 10, 2026",
    author: "Aris Thorne",
    authorRole: "Forest Conservationist",
    likes: 189,
    content: [
      "Forests are the lungs of our planet. They filter our air, regulate water cycles, prevent soil erosion, and provide habitat for over 80% of terrestrial biodiversity. Over the last century, deforestation has decimated these vital systems. Reforestation—restoring destroyed forest ecosystems—is a critical key to restoring global balance.",
      "Trees are incredibly efficient carbon sinks. Through photosynthesis, a single mature tree absorbs roughly 22 kilograms of carbon dioxide per year, storing carbon in its wood and roots while releasing oxygen. On a large scale, massive tree-planting initiatives can capture gigatons of carbon emissions.",
      "However, reforestation must be done mindfully. Monoculture tree farms—planting only one species like pine or eucalyptus over vast areas—do not create a forest. They dry out soil, offer little benefit to local wildlife, and are highly vulnerable to pests and wildfire.",
      "Successful ecological restoration involves planting a diverse mix of native species that naturally belong in that region. This helps restore natural soil microbial networks, invites local insects, birds, and mammals back, and creates a self-sustaining resilient ecosystem. You can support local forestry initiatives, join planting drives, and vote for policies that prioritize public land conservation."
    ]
  },
  {
    id: "understanding-ewaste",
    title: "Understanding E-Waste: The Invisible Threat",
    category: "Waste Sorting",
    summary: "What happens to discarded electronics, the dangers of toxic heavy metals, and how we can recycle gadgets responsibly.",
    imageUrl: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=800",
    readTime: "5 min read",
    date: "July 02, 2026",
    author: "Koji Tanaka",
    authorRole: "E-Waste Circularity Researcher",
    likes: 76,
    content: [
      "Electronic waste, or e-waste, is the fastest-growing waste stream in the world. As technology upgrades accelerate, millions of tons of smartphones, laptops, chargers, and household appliances are discarded annually. When electronics end up in standard landfills, they pose a severe environmental threat.",
      "Electronics contain heavy metals like lead, mercury, cadmium, and arsenic, alongside chemical flame retardants. As rainwater filters through landfills, these toxins leach into the surrounding soil and groundwater, entering local food webs and ecosystems.",
      "Simultaneously, manufacturing electronics requires mining rare earth elements, gold, silver, copper, and cobalt. Extracting these materials is energy-intensive and causes extensive habitat destruction. Recycling old devices allows us to recover these metals—a process known as 'urban mining'—reducing the demand for raw mining.",
      "To responsibly manage e-waste: never throw electronics in standard household trash. Find local certified e-waste recyclers or drop-off points, check manufacture take-back programs, or donate working electronics to schools and community centers. Let's close the loop on electronics."
    ]
  },
  {
    id: "circular-economy",
    title: "The Circular Economy: Rethinking Consumerism",
    category: "Eco Living",
    summary: "Moving away from the linear 'take-make-waste' model towards a sustainable loop of reuse, repair, and regeneration.",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800",
    readTime: "8 min read",
    date: "June 25, 2026",
    author: "Diana Prince",
    authorRole: "Sustainability & Business Strategist",
    likes: 156,
    content: [
      "For generations, the global economy has operated on a linear model: we extract raw materials, make products, use them, and then discard them as waste. This 'take-make-waste' approach is hitting ecological limits. The circular economy offers a better way forward by design.",
      "The circular economy is based on three fundamental principles: designing out waste and pollution, keeping products and materials in use for as long as possible, and regenerating natural systems. It mimics biological cycles, where nothing is wasted and everything becomes input for another process.",
      "In a circular model, products are built to last, easy to repair, and easy to disassemble for recycling. For example, instead of buying lightbulbs, corporate clients might buy 'lighting-as-a-service', where the manufacturer owns the bulbs and maintains them, incentivizing them to build durable, recyclable lighting.",
      "As consumers, we can drive this shift. We can support repair cafes, buy products with lifetime warranties, rent tools instead of buying them, and buy refurbished electronics. By shifting from ownership to stewardship, we can enjoy a high standard of living without exhausting the planet."
    ]
  }
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("binbuddy_blogs");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setBlogs([...parsed, ...BLOG_POSTS]);
          return;
        } catch (e) {
          console.error(e);
        }
      }
    }
    setBlogs(BLOG_POSTS);
  }, []);

  const categories = ["All", "Composting", "Waste Sorting", "Eco Living", "Earth Conservation"];

  // Filter posts based on search query and category
  const filteredPosts = useMemo(() => {
    return blogs.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, blogs]);

  const handleLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
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

        {/* Hero Section */}
        <header className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-semibold mb-4 border border-green-200">
            <BookOpen size={14} />
            BinBuddy Publication
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-955 tracking-tight leading-tight">
            Sustainability & Eco Insights
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            Explore curated articles on organic composting, smart waste management, eco-friendly lifestyle tips, and global conservation efforts.
          </p>
        </header>

        {/* Controls: Search and Filters */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-150 mb-12 flex flex-col md:flex-row gap-6 justify-between items-center">
          {/* Categories Tab */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
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
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 w-full rounded-xl border border-gray-300 py-2.5 text-sm text-black caret-green-900 focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition bg-[#F3F0DE]/50"
              placeholder="Search articles, topics..."
            />
          </div>
        </section>

        {/* Blog Post Grid */}
        {filteredPosts.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => {
              const isLiked = !!likedPosts[post.id];
              return (
                <article
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition duration-300 flex flex-col group cursor-pointer"
                >
                  {/* Article Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#124B34] text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-white/20">
                      {post.category}
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {post.readTime}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-green-900 group-hover:text-green-950 transition mb-3 line-clamp-2">
                        {post.title}
                      </h2>

                      <p className="text-sm text-gray-700 line-clamp-3 mb-6">
                        {post.summary}
                      </p>
                    </div>

                    {/* Author & Actions footer */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-800">{post.author}</span>
                        <span className="text-[10px] text-gray-500">{post.authorRole.split("&")[0]}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleLike(post.id, e)}
                          className={`p-2 rounded-xl transition ${
                            isLiked
                              ? "bg-red-50 text-red-500"
                              : "bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50"
                          }`}
                        >
                          <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                        </button>
                        <span className="text-xs font-medium text-gray-600">
                          {post.likes + (isLiked ? 1 : 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-150 shadow-sm max-w-lg mx-auto">
            <BookOpen size={48} className="text-green-800 mx-auto opacity-40 mb-4" />
            <h3 className="text-lg font-bold text-green-900">No Articles Found</h3>
            <p className="text-gray-500 text-sm mt-2 px-6">
              We couldn't find any articles matching "{searchQuery}" under category "{selectedCategory}". Try another search term.
            </p>
          </div>
        )}
      </div>

      {/* Interactive Blog Reading Modal / Overlay */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-green-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Header Controls */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button
                onClick={() => {
                  const isLiked = !!likedPosts[selectedPost.id];
                  setLikedPosts((prev) => ({ ...prev, [selectedPost.id]: !isLiked }));
                }}
                className="bg-white/90 backdrop-blur-md text-gray-700 hover:text-red-500 p-2.5 rounded-full shadow-md transition"
              >
                <Heart size={18} fill={likedPosts[selectedPost.id] ? "red" : "none"} className={likedPosts[selectedPost.id] ? "text-red-500" : ""} />
              </button>
              <button
                onClick={() => setSelectedPost(null)}
                className="bg-white/90 backdrop-blur-md text-gray-700 hover:text-black p-2.5 rounded-full shadow-md transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="overflow-y-auto flex-1 pb-10">
              {/* Image banner */}
              <div className="relative h-80 w-full">
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="bg-green-800 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {selectedPost.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold mt-3 tracking-tight leading-tight">
                    {selectedPost.title}
                  </h2>
                </div>
              </div>

              {/* Text Layout */}
              <div className="p-6 md:p-10 max-w-3xl mx-auto">
                {/* Meta details */}
                <div className="flex flex-wrap items-center justify-between border-b border-gray-150 pb-6 mb-8 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center font-bold text-[#124B34] border border-green-200">
                      {selectedPost.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                        {selectedPost.author}
                        <Award size={14} className="text-yellow-600" />
                      </p>
                      <p className="text-xs text-gray-500">{selectedPost.authorRole}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {selectedPost.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {selectedPost.readTime}
                    </span>
                  </div>
                </div>

                {/* Article paragraphs */}
                <div className="space-y-6 text-gray-700 leading-relaxed text-base font-light">
                  {selectedPost.content.map((paragraph, index) => (
                    <p key={index} className="first-letter:text-3xl first-letter:font-bold first-letter:text-green-950 first-letter:float-left first-letter:mr-2 first-letter:leading-none">
                      {index === 0 ? paragraph : paragraph.substring(0)}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Modal Footer */}
            <div className="bg-gray-50 border-t border-gray-150 py-4 px-6 md:px-10 flex justify-between items-center rounded-b-3xl">
              <span className="text-xs font-semibold text-gray-500">
                BinBuddy Sustainability Series
              </span>
              <button
                onClick={() => setSelectedPost(null)}
                className="bg-[#124B34] hover:bg-green-950 text-white font-bold py-2 px-6 rounded-xl text-sm transition"
              >
                Finished Reading
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </main>
  );
}
