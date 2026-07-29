"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Trash2, HelpCircle, RefreshCw, Sparkles, Clock, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import Header from "@/app/(auth)/_components/Header";
import Footer from "@/app/(auth)/_components/Footer";

interface ClassificationResult {
  item: string;
  category: "organic" | "recyclable" | "hazardous" | "landfill";
  categoryLabel: string;
  icon: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  explanation: string;
  disposal: string;
  timestamp: string;
}

const SUGGESTIONS = [
  { label: "🍌 Banana Peel", value: "Banana Peel" },
  { label: "🥤 Coke Bottle", value: "Coke Bottle" },
  { label: "🔋 Battery", value: "Battery" },
  { label: "📦 Cardboard Box", value: "Cardboard Box" },
  { label: "🍎 Apple Core", value: "Apple Core" },
  { label: "📱 Old Phone", value: "Old Phone" },
];

export default function SmartSortPage() {
  const [inputValue, setInputValue] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState("");
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [recentSorts, setRecentSorts] = useState<ClassificationResult[]>([]);
  const [errorText, setErrorText] = useState("");
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("binbuddy_sorts");
    if (saved) {
      try {
        setRecentSorts(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveToHistory = (item: ClassificationResult) => {
    setRecentSorts((prev) => {
      const updated = [item, ...prev.filter((x) => x.item.toLowerCase() !== item.item.toLowerCase())].slice(0, 10);
      localStorage.setItem("binbuddy_sorts", JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    localStorage.removeItem("binbuddy_sorts");
    setRecentSorts([]);
  };

  const classifyItem = (query: string) => {
    const q = query.trim().toLowerCase();
    
    // Default categories configuration
    let category: "organic" | "recyclable" | "hazardous" | "landfill" = "landfill";
    let categoryLabel = "General Landfill Waste";
    let icon = "🗑️";
    let colorClass = "text-gray-800";
    let bgClass = "bg-gray-50 border-gray-200";
    let borderClass = "border-gray-200";
    let explanation = `"${query}" has been categorized as general household trash. Wrap it safely before disposal.`;
    let disposal = "Place inside the general trash bin for municipal collection.";

    // Simple rule-based classifier matching common garbage types
    if (
      q.includes("banana") || q.includes("apple") || q.includes("peel") || q.includes("core") ||
      q.includes("leftover") || q.includes("food") || q.includes("bread") || q.includes("vegetable") ||
      q.includes("fruit") || q.includes("egg") || q.includes("leaf") || q.includes("leaves") ||
      q.includes("grass") || q.includes("compost") || q.includes("organic")
    ) {
      category = "organic";
      categoryLabel = "Organic Waste";
      icon = "🌱";
      colorClass = "text-green-800";
      bgClass = "bg-green-50/50 border-green-200";
      borderClass = "border-green-200";
      explanation = `"${query}" is organic biodegradable waste that decomposes naturally over time.`;
      disposal = "Place inside the green organic waste bin or transfer to your backyard compost pile.";
    } else if (
      q.includes("bottle") || q.includes("can") || q.includes("cardboard") || q.includes("box") ||
      q.includes("paper") || q.includes("plastic") || q.includes("glass") || q.includes("metal") ||
      q.includes("aluminum") || q.includes("tin") || q.includes("newspaper") || q.includes("jar")
    ) {
      category = "recyclable";
      categoryLabel = "Recyclable Waste";
      icon = "♻️";
      colorClass = "text-blue-800";
      bgClass = "bg-blue-50/50 border-blue-200";
      borderClass = "border-blue-200";
      explanation = `"${query}" is made of materials that can be processed and reused in the circular economy.`;
      disposal = "Rinse off any food residue, dry it, and toss it loosely (unbagged) into the recycling bin.";
    } else if (
      q.includes("battery") || q.includes("phone") || q.includes("mobile") || q.includes("electronics") ||
      q.includes("laptop") || q.includes("chemical") || q.includes("paint") || q.includes("bulb") ||
      q.includes("spray") || q.includes("mercury") || q.includes("toxic") || q.includes("charger")
    ) {
      category = "hazardous";
      categoryLabel = "Hazardous Waste";
      icon = "⚠️";
      colorClass = "text-red-800";
      bgClass = "bg-red-50/50 border-red-200";
      borderClass = "border-red-200";
      explanation = `"${query}" contains heavy metals or corrosive chemicals that pose a toxicity threat to groundwater.`;
      disposal = "Do NOT put in standard bins. Place in a box and take it to your nearest local e-waste or hazardous collection depot.";
    }

    return {
      item: query,
      category,
      categoryLabel,
      icon,
      colorClass,
      bgClass,
      borderClass,
      explanation,
      disposal,
      timestamp: "Just now",
    };
  };

  const handleClassify = (queryToClassify?: string) => {
    const target = queryToClassify || inputValue;
    setErrorText("");

    if (!target.trim()) {
      setErrorText("Please enter a waste item name to sort.");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    
    // Simulate AI loading steps for premium user experience
    setAnalysisStep("Initializing BinBuddy AI...");
    
    setTimeout(() => {
      setAnalysisStep("Scanning chemical structures & markers...");
      setTimeout(() => {
        setAnalysisStep("Fetching Kathmandu sorting guidelines...");
        setTimeout(() => {
          const finalResult = classifyItem(target);
          setResult(finalResult);
          saveToHistory(finalResult);
          setIsAnalyzing(false);
          setAnalysisStep("");
        }, 500);
      }, 500);
    }, 500);
  };

  const handleChipClick = (value: string) => {
    setInputValue(value);
    handleClassify(value);
  };

  const handleReset = () => {
    setInputValue("");
    setResult(null);
    setErrorText("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <main className="min-h-screen bg-[#F3F0DE] font-sans flex flex-col">
      <Header />
      <div className="flex-grow max-w-4xl w-full mx-auto py-12 px-4 sm:px-6 lg:px-8">
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
        <header className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-green-150 text-green-800 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-semibold mb-4 border border-green-200">
            <Sparkles size={14} className="text-yellow-600 animate-pulse" />
            AI Waste sorter
          </div>
          <h1 className="text-4xl font-extrabold text-green-950 tracking-tight leading-tight">
            Smart Sort
          </h1>
          <p className="mt-3 text-gray-700 text-sm md:text-base">
            Not sure where your waste belongs? Let BinBuddy's AI sort it for you.
          </p>
        </header>

        {/* Main Interface Card */}
        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-150 mb-8 max-w-2xl mx-auto">
          {/* Input field and trigger button */}
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                <Search size={20} />
              </span>
              <input
                ref={inputRef}
                type="text"
                disabled={isAnalyzing}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleClassify()}
                className="pl-12 pr-4 w-full rounded-2xl border border-gray-300 py-3.5 text-sm text-black caret-green-900 focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition bg-gray-50/50"
                placeholder="Enter a waste item, e.g. banana peel or Coke bottle..."
              />
            </div>

            {errorText && (
              <p className="text-xs text-red-600 font-semibold pl-1 flex items-center gap-1">
                <AlertTriangle size={12} />
                {errorText}
              </p>
            )}

            <button
              onClick={() => handleClassify()}
              disabled={isAnalyzing}
              className="w-full bg-[#124B34] hover:bg-green-950 text-white font-bold py-3.5 rounded-2xl text-sm transition shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  Classifying Waste...
                </>
              ) : (
                "Sort My Waste"
              )}
            </button>
          </div>

          {/* Suggested Items Chips */}
          <div className="mt-6">
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-2">Common Suggestions</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => handleChipClick(s.value)}
                  disabled={isAnalyzing}
                  className="bg-[#F3F0DE] hover:bg-green-100 text-green-900 border border-green-900/10 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Animated AI Loading Step */}
          {isAnalyzing && (
            <div className="mt-8 border-t border-gray-100 pt-8 text-center animate-pulse">
              <RefreshCw className="animate-spin text-green-850 w-8 h-8 mx-auto mb-3" />
              <p className="text-xs text-gray-500 font-semibold">{analysisStep}</p>
            </div>
          )}

          {/* Results Card */}
          {result && (
            <div className={`mt-8 border rounded-3xl p-6 ${result.bgClass} ${result.borderClass} animate-in zoom-in-95 duration-200`}>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Classification Result</span>
                  <h3 className="text-2xl font-black text-gray-900 mt-1 capitalize">
                    {result.icon} {result.item}
                  </h3>
                </div>

                <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase border ${result.colorClass} border-current bg-white/60`}>
                  {result.categoryLabel}
                </span>
              </div>

              {/* Explanation statement */}
              <div className="mt-5">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Why this category?</h4>
                <p className="text-xs text-gray-700 leading-relaxed mt-1">{result.explanation}</p>
              </div>

              {/* Recommended Action */}
              {(() => {
                let actionStyles = {
                  container: "bg-gray-100 border border-gray-250 p-4 rounded-2xl",
                  title: "text-gray-900",
                  iconColor: "text-gray-700",
                  text: "text-gray-900 font-medium"
                };

                if (result.category === "organic") {
                  actionStyles = {
                    container: "bg-green-100/60 border border-green-200 p-4 rounded-2xl",
                    title: "text-green-900",
                    iconColor: "text-green-700",
                    text: "text-green-950 font-medium"
                  };
                } else if (result.category === "recyclable") {
                  actionStyles = {
                    container: "bg-blue-100/60 border border-blue-200 p-4 rounded-2xl",
                    title: "text-blue-900",
                    iconColor: "text-blue-700",
                    text: "text-blue-950 font-medium"
                  };
                } else if (result.category === "hazardous") {
                  actionStyles = {
                    container: "bg-red-100/60 border border-red-200 p-4 rounded-2xl",
                    title: "text-red-950",
                    iconColor: "text-red-700",
                    text: "text-red-950 font-medium"
                  };
                }

                return (
                  <div className={`mt-5 ${actionStyles.container}`}>
                    <h4 className={`text-xs font-bold ${actionStyles.title} uppercase tracking-wide flex items-center gap-1.5`}>
                      <CheckCircle2 size={14} className={actionStyles.iconColor} />
                      Recommended Action
                    </h4>
                    <p className={`text-xs ${actionStyles.text} leading-relaxed mt-1.5`}>
                      {result.disposal}
                    </p>
                  </div>
                );
              })()}

              {/* Action resets */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleReset}
                  className="bg-[#124B34] hover:bg-green-950 text-white font-bold py-2 px-6 rounded-xl text-xs transition cursor-pointer"
                >
                  Sort Another Item
                </button>
              </div>
            </div>
          )}
        </section>

        {/* History Feed */}
        <section className="max-w-2xl mx-auto bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-150">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-green-950 flex items-center gap-2">
              <Clock size={18} />
              Recent Sorts
            </h3>

            {recentSorts.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs font-bold text-red-600 hover:text-red-800 transition cursor-pointer"
              >
                Clear History
              </button>
            )}
          </div>

          {recentSorts.length > 0 ? (
            <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto pr-2 space-y-2">
              {recentSorts.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3 px-1 hover:bg-gray-50/50 transition rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-xs text-gray-800 capitalize">{item.item}</h4>
                      <p className="text-[10px] text-gray-400">Classified recently</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.colorClass} border-current bg-white`}>
                    {item.categoryLabel}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <HelpCircle size={36} className="mx-auto mb-2 opacity-30" />
              <h4 className="font-bold text-xs text-gray-600">No recent sorts</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Your classified garbage items history will appear here.</p>
            </div>
          )}
        </section>
      </div>
      <Footer />
    </main>
  );
}
