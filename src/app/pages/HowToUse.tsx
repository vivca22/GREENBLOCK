/*
 * CONNECTIONS NEEDED:
 * - Firebase: import { db } from '../lib/firebase'
 * - AI Advisor: import { askGreenBot } from '../lib/gemini'
 * - Connect to OpenRouter API - model: google/gemini-flash-1.5
 * - Trained with mycoremediation knowledge base
 */
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Send, ChefHat, Leaf, Recycle, BookOpen } from "lucide-react";

const plasticTypes = [
  {
    code: 1, symbol: "PET", name: "Polyethylene Terephthalate",
    color: "#DBEAFE", textColor: "#1D4ED8",
    products: "Water bottles, soda bottles, food jars",
    compatible: true,
    tip: "Look for the triangle with 1 on the bottom of the bottle — usually near the center of the base.",
    instruction: "Clean the bottle, cut it into strips of ~2cm. Mix with the substrate in the kit box before inoculating. PET works very well with oyster mushrooms.",
  },
  {
    code: 2, symbol: "HDPE", name: "High-Density Polyethylene",
    color: "#D1FAE5", textColor: "#065F46",
    products: "Milk jugs, detergent bottles, shampoo bottles",
    compatible: true,
    tip: "The triangle with 2 is typically recessed into the plastic at the bottom or back of the container.",
    instruction: "Shred the plastic into small pieces (1–3cm). Sterilize briefly by boiling for 10 min. Add to your kit substrate. Works very well.",
  },
  {
    code: 3, symbol: "PVC", name: "Polyvinyl Chloride",
    color: "#FEF3C7", textColor: "#92400E",
    products: "Pipes, window frames, some food wrap",
    compatible: false,
    tip: "PVC is often unmarked or labeled with a V. Check the bottom of the container for the triangle with 3.",
    instruction: "⚠️ Not recommended for home use. PVC releases chlorine compounds when broken down. Take this plastic to a professional recycling center.",
  },
  {
    code: 4, symbol: "LDPE", name: "Low-Density Polyethylene",
    color: "#D8F3DC", textColor: "#2D6A4F",
    products: "Plastic bags, squeeze bottles, six-pack rings",
    compatible: true,
    tip: "LDPE bags rarely show the code. Look for the triangle with 4 on the bottom of squeeze bottles.",
    instruction: "Cut bags into small 2cm squares. Mix 20% LDPE with 80% substrate. Good colonization results after 3–4 weeks.",
  },
  {
    code: 5, symbol: "PP", name: "Polypropylene",
    color: "#EDE9FE", textColor: "#5B21B6",
    products: "Yogurt containers, ketchup bottles, bottle caps",
    compatible: true,
    tip: "Find the triangle with 5 pressed into the base or inside of the lid. May require a flashlight to see.",
    instruction: "PP caps and small pieces work great. Grind if possible, or cut small. Mix into substrate. Excellent results with oyster mushrooms.",
  },
  {
    code: 6, symbol: "PS", name: "Polystyrene",
    color: "#FEE2E2", textColor: "#991B1B",
    products: "Styrofoam cups, plastic cutlery, CD cases",
    compatible: false,
    tip: "Look for the triangle with 6 on disposable cups and foam packaging. May appear as PS without the number.",
    instruction: "⚠️ Limited compatibility. Styrene byproducts may harm the mycelium. Only use under adult supervision and never in food-growing setups.",
  },
  {
    code: 7, symbol: "Other", name: "Mixed / Other Plastics",
    color: "#F3F4F6", textColor: "#374151",
    products: "Large water bottles, DVDs, some food containers",
    compatible: null,
    tip: "The triangle with 7 (or OTHER) means mixed. Results vary. Identify the exact plastic before using.",
    instruction: "Results vary widely. Send a photo to GreenBot for an assessment before adding to your kit.",
  },
];

const recipes = [
  {
    category: "Growing",
    emoji: "🌱",
    title: "PET Bottle Myco-Garden",
    time: "3–4 weeks",
    difficulty: "Easy",
    steps: [
      "Collect 5–6 clean PET (code 1) bottles and cut into 2cm strips.",
      "Sterilize strips in boiling water for 10 minutes, then let cool.",
      "Open your Green Block kit box and mix the PET strips evenly into the substrate (max 20% plastic).",
      "Seal the bag and leave in a dark spot at 20–24°C.",
      "Check daily — white mycelium should appear in 7–10 days.",
      "Once fully colonized (white all over), open the bag and mist with water twice daily.",
      "Harvest mushrooms when caps start to flatten. The plastic will be visibly degraded!",
    ],
  },
  {
    category: "Growing",
    emoji: "🍄",
    title: "HDPE Cap Cluster Kit",
    time: "2–3 weeks",
    difficulty: "Easy",
    steps: [
      "Collect 50+ HDPE (code 2) plastic caps of any color.",
      "Wash thoroughly with soap and rinse well.",
      "Arrange caps in a single layer on the substrate surface of your opened kit.",
      "Mist daily and cover loosely with plastic wrap.",
      "Mycelium will colonize caps from below within 5–7 days.",
      "Keep misting. Mushrooms will pin through the cap gaps in week 2–3.",
    ],
  },
  {
    category: "Culinary",
    emoji: "🍳",
    title: "Sautéed Oyster Mushrooms with Garlic",
    time: "15 min",
    difficulty: "Easy",
    steps: [
      "Harvest fresh oyster mushrooms from your kit — 200g is ideal.",
      "Tear into bite-sized pieces along the natural grain.",
      "Heat 2 tbsp olive oil in a pan on medium-high.",
      "Add 3 crushed garlic cloves, cook 1 minute.",
      "Add mushrooms in a single layer. Don't stir for 2 minutes — let them brown.",
      "Toss, add salt, pepper, a splash of soy sauce and fresh parsley.",
      "Serve on toast or as a side dish. Delicious!",
    ],
  },
  {
    category: "Culinary",
    emoji: "🥘",
    title: "Mycelium Risotto",
    time: "35 min",
    difficulty: "Medium",
    steps: [
      "Sauté 1 diced onion in butter until translucent.",
      "Add 1 cup Arborio rice, stir 2 minutes.",
      "Pour in ½ cup white wine, stir until absorbed.",
      "Add warm vegetable broth ladle by ladle, stirring constantly (25 min).",
      "In a separate pan, sauté 150g oyster mushrooms with thyme and garlic.",
      "Fold mushrooms into risotto. Add parmesan, salt and pepper.",
      "Serve immediately with fresh lemon zest on top.",
    ],
  },
  {
    category: "Eco DIY",
    emoji: "♻️",
    title: "Myco-Compost Booster",
    time: "6–8 weeks",
    difficulty: "Medium",
    steps: [
      "After mushroom harvest, collect the spent substrate (white mycelium block).",
      "Break it into small chunks and add to your compost pile.",
      "The mycelium will continue breaking down organic matter and any remaining plastic.",
      "Mix with kitchen scraps, leaves and cardboard every 2 weeks.",
      "After 6–8 weeks you'll have rich mycelium-enriched compost.",
      "Use in your garden — excellent for soil structure!",
    ],
  },
];

interface BotMessage {
  id: number;
  from: "user" | "bot";
  text: string;
}

const initialBotMessages: BotMessage[] = [
  {
    id: 1, from: "bot",
    text: "Hi! I'm GreenBot 🌿 I know everything about mycoremediation, using your Green Block kit, and cooking with your mushrooms. What would you like to know?",
  },
];

const botSuggestions = [
  "What plastics work best?",
  "How long until mushrooms grow?",
  "Can I eat these mushrooms?",
  "My mycelium isn't growing, help!",
  "How much plastic can it degrade?",
];

const botResponses: Record<string, string> = {
  "What plastics work best?": "PET (code 1), HDPE (code 2), LDPE (code 4) and PP (code 5) all work great with oyster mushrooms. Avoid PVC (code 3) and be careful with PS (code 6). Always clean plastics before adding them to your kit! 🍄",
  "How long until mushrooms grow?": "After inoculating your substrate, expect white mycelium in 7–14 days. Mushroom pins (tiny baby mushrooms) appear in 2–3 weeks, and you can harvest in 3–4 weeks. Keep humidity high and temperature between 18–24°C! 🌱",
  "Can I eat these mushrooms?": "Yes! Oyster mushrooms grown on plastic substrate are safe to eat. The mycelium digests the plastic internally — the mushroom fruit bodies are perfectly clean and nutritious. Make sure to harvest before the caps curl upward. Enjoy your Myco Risotto! 🍳",
  "My mycelium isn't growing, help!": "Check these: 1) Temperature — should be 18–24°C. 2) Humidity — mist the inside of the bag daily. 3) Too much light? Move to a darker spot. 4) Contamination — if you see green/black spots, that's mold — start over with a clean setup. Contact us if the problem persists! 💚",
  "How much plastic can it degrade?": "A single 500g Green Block kit can degrade approximately 15–30% of the plastic mixed into the substrate over 4–6 weeks. The rest becomes more porous and brittle, making it easier to process. Over multiple cycles you can degrade significantly more! 🌍",
};

export function HowToUse() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<"plastics" | "instructions" | "recipes" | "bot">("plastics");
  const [selectedRecipe, setSelectedRecipe] = useState<typeof recipes[0] | null>(null);
  const [botMessages, setBotMessages] = useState<BotMessage[]>(initialBotMessages);
  const [botInput, setBotInput] = useState("");
  const [selectedPlastic, setSelectedPlastic] = useState<typeof plasticTypes[0] | null>(null);

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#D8F3DC", fontFamily: "Nunito, sans-serif" }}>
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🔒</div>
          <h2 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.4rem", marginBottom: "0.5rem" }}>Members Only</h2>
          <p className="mb-6 text-sm" style={{ color: "#4B5563" }}>
            Register with your Green Block kit purchase to access your personalized guide and recipes.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-3 rounded-xl transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700 }}
          >
            Register Now →
          </button>
        </div>
      </div>
    );
  }

  const sendBotMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: BotMessage = { id: Date.now(), from: "user", text };
    // TODO: const reply = await askGreenBot(text, { kitType: user.kitType, context: "mycoremediation" })
    const reply = botResponses[text] ?? "Great question! Our GreenBot is learning more every day about mycoremediation and plastic degradation. Connect to the Gemini API for live personalized answers! 🌿";
    const botMsg: BotMessage = { id: Date.now() + 1, from: "bot", text: reply };
    setBotMessages((prev) => [...prev, userMsg, botMsg]);
    setBotInput("");
  };

  const tabs = [
    { key: "plastics" as const, icon: <Recycle size={16} />, label: "Plastic Types" },
    { key: "instructions" as const, icon: <BookOpen size={16} />, label: "Instructions" },
    { key: "recipes" as const, icon: <ChefHat size={16} />, label: "Recipes" },
    { key: "bot" as const, icon: <Leaf size={16} />, label: "GreenBot AI" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F4EF", fontFamily: "Nunito, sans-serif" }}>
      {/* Header */}
      <div className="w-full py-10 px-4" style={{ backgroundColor: "#2D6A4F" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <img src={user.photo} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white" onError={(e) => { (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name) + "&background=52B788&color=fff"; }} />
            <span className="text-sm" style={{ color: "#95D5B2", fontWeight: 600 }}>Welcome, {user.name.split(" ")[0]}!</span>
          </div>
          <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "2rem", color: "white", lineHeight: 1.2 }}>
            How to Use Your Green Block Kit 🍄
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#95D5B2" }}>
            {user.kitType} · Registered {user.purchaseDate ? new Date(user.purchaseDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ""}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full px-4 py-0" style={{ backgroundColor: "#1B4332" }}>
        <div className="max-w-5xl mx-auto flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key)}
              className="flex items-center gap-2 px-5 py-3 text-sm whitespace-nowrap transition-colors"
              style={{
                fontFamily: "Nunito, sans-serif",
                fontWeight: 700,
                color: activeSection === tab.key ? "#2D6A4F" : "#95D5B2",
                backgroundColor: activeSection === tab.key ? "#F8F4EF" : "transparent",
                borderRadius: activeSection === tab.key ? "12px 12px 0 0" : "0",
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* PLASTIC TYPES SECTION */}
        {activeSection === "plastics" && (
          <div>
            <div className="mb-6">
              <h2 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.4rem", marginBottom: "0.5rem" }}>
                🔎 Find Your Plastic Type
              </h2>
              <p className="text-sm" style={{ color: "#4B5563" }}>
                Every plastic bottle or container has a recycling symbol — a triangle with a number from 1 to 7 — usually on the bottom. Tap a type to learn more.
              </p>
            </div>

            {/* How to find the icon */}
            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: "#D8F3DC", border: "1px solid #95D5B2" }}>
              <p style={{ fontWeight: 700, color: "#1B4332", marginBottom: "0.5rem" }}>📍 How to find the icon on your bottle:</p>
              <ol className="text-sm flex flex-col gap-1" style={{ color: "#2D6A4F" }}>
                <li><strong>1.</strong> Turn your bottle upside down and look at the base.</li>
                <li><strong>2.</strong> You'll see a small triangle made of arrows with a number inside (1–7).</li>
                <li><strong>3.</strong> The letters below the triangle are the plastic abbreviation (PET, HDPE, etc.).</li>
                <li><strong>4.</strong> Match the number to the cards below for your specific instructions.</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {plasticTypes.map((p) => (
                <button
                  key={p.code}
                  onClick={() => setSelectedPlastic(selectedPlastic?.code === p.code ? null : p)}
                  className="text-left p-4 rounded-2xl transition-all hover:shadow-md"
                  style={{
                    backgroundColor: p.color,
                    border: selectedPlastic?.code === p.code ? `2px solid ${p.textColor}` : "2px solid transparent",
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    {/* Recycling triangle SVG */}
                    <div className="relative flex items-center justify-center w-12 h-12">
                      <svg viewBox="0 0 48 48" width="48" height="48">
                        <path d="M24 4 L44 40 L4 40 Z" fill="none" stroke={p.textColor} strokeWidth="3" strokeLinejoin="round"/>
                        <path d="M24 4 L26 8 M44 40 L40 40 M4 40 L8 40" stroke={p.textColor} strokeWidth="2.5" strokeLinecap="round"/>
                        <text x="24" y="32" textAnchor="middle" style={{ fontSize: "13px", fontWeight: "bold", fill: p.textColor, fontFamily: "Nunito, sans-serif" }}>{p.code}</text>
                      </svg>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs flex-shrink-0"
                      style={{
                        backgroundColor: p.compatible === true ? "#2D6A4F" : p.compatible === false ? "#DC2626" : "#6B7280",
                        color: "white",
                        fontWeight: 700,
                      }}
                    >
                      {p.compatible === true ? "✓ Compatible" : p.compatible === false ? "✗ Avoid" : "? Varies"}
                    </span>
                  </div>
                  <p style={{ fontWeight: 800, color: p.textColor, fontSize: "1rem" }}>{p.symbol}</p>
                  <p className="text-xs mt-0.5 mb-2" style={{ color: p.textColor, opacity: 0.8 }}>{p.name}</p>
                  <p className="text-xs" style={{ color: p.textColor, opacity: 0.7 }}>{p.products}</p>
                </button>
              ))}
            </div>

            {/* Selected plastic detail */}
            {selectedPlastic && (
              <div className="mt-6 p-6 rounded-2xl" style={{ backgroundColor: selectedPlastic.color, border: `2px solid ${selectedPlastic.textColor}` }}>
                <h3 style={{ fontWeight: 800, color: selectedPlastic.textColor, fontSize: "1.1rem", marginBottom: "1rem" }}>
                  Code {selectedPlastic.code} — {selectedPlastic.symbol}: {selectedPlastic.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm mb-1" style={{ fontWeight: 700, color: selectedPlastic.textColor }}>📍 How to find the icon:</p>
                    <p className="text-sm" style={{ color: selectedPlastic.textColor, opacity: 0.85 }}>{selectedPlastic.tip}</p>
                  </div>
                  <div>
                    <p className="text-sm mb-1" style={{ fontWeight: 700, color: selectedPlastic.textColor }}>🍄 How to use with your kit:</p>
                    <p className="text-sm" style={{ color: selectedPlastic.textColor, opacity: 0.85 }}>{selectedPlastic.instruction}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* INSTRUCTIONS SECTION */}
        {activeSection === "instructions" && (
          <div>
            <h2 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.4rem", marginBottom: "0.5rem" }}>
              📋 Step-by-Step Instructions
            </h2>
            <p className="text-sm mb-6" style={{ color: "#4B5563" }}>
              Follow these steps to set up your {user.kitType} for plastic degradation.
            </p>

            {[
              { num: "1", icon: "🧹", title: "Prepare your plastics", color: "#D8F3DC", desc: "Collect clean plastic bottles or containers. Remove labels and caps. Wash thoroughly with soap and warm water. Let dry completely." },
              { num: "2", icon: "🔍", title: "Identify the plastic type", color: "#DBEAFE", desc: "Check the bottom of each container for the recycling triangle with a number (1–7). Use the Plastic Types tab to confirm compatibility. Only use codes 1, 2, 4, and 5." },
              { num: "3", icon: "✂️", title: "Cut into small pieces", color: "#EDE9FE", desc: "Cut plastic into strips or pieces of 2–3cm max. Smaller pieces = faster degradation. For rigid plastics, ask an adult to help with scissors or a cutter." },
              { num: "4", icon: "♨️", title: "Optional: Sterilize", color: "#FEF3C7", desc: "For HDPE and PP plastics, boil the pieces in water for 10 minutes, then let cool completely. This removes surface contaminants that could harm your mycelium." },
              { num: "5", icon: "📦", title: "Mix with substrate", color: "#D8F3DC", desc: "Open your Green Block kit bag. Add plastic pieces (max 20% of total volume). Mix evenly throughout the substrate. Seal the bag leaving the filter patch exposed." },
              { num: "6", icon: "🌡️", title: "Colonization phase", color: "#DBEAFE", desc: "Place the sealed bag in a dark spot at 18–24°C. Check daily. White fluffy mycelium should appear in 7–14 days. Do not open the bag during this phase." },
              { num: "7", icon: "💧", title: "Fruiting phase", color: "#EDE9FE", desc: "Once 70%+ of the bag is white, cut 3–4 X-shapes in the bag. Mist with clean water 2–3 times daily. Keep humidity high. Mushrooms will pin within 5–7 days." },
              { num: "8", icon: "🍄", title: "Harvest!", color: "#FEF3C7", desc: "When caps start to flatten and the edges wave slightly, grab the base and twist gently. Harvest the whole cluster at once. The plastic will be visibly degraded — grey and brittle!" },
            ].map((step) => (
              <div key={step.num} className="flex gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: step.color }}
                >
                  <span style={{ fontSize: "1.4rem" }}>{step.icon}</span>
                </div>
                <div className="flex-1 p-4 rounded-2xl" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#D8F3DC", color: "#2D6A4F", fontWeight: 700 }}>Step {step.num}</span>
                    <p style={{ fontWeight: 700, color: "#1B4332" }}>{step.title}</p>
                  </div>
                  <p className="text-sm" style={{ color: "#4B5563", lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RECIPES SECTION */}
        {activeSection === "recipes" && (
          <div>
            <h2 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.4rem", marginBottom: "0.5rem" }}>
              🍳 Recipes & Projects
            </h2>
            <p className="text-sm mb-6" style={{ color: "#4B5563" }}>
              Growing projects, culinary recipes, and eco DIY ideas for your mushroom kit.
            </p>

            {selectedRecipe ? (
              <div>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="mb-4 flex items-center gap-1 text-sm transition-opacity hover:opacity-70"
                  style={{ color: "#2D6A4F", fontWeight: 600 }}
                >
                  ← Back to recipes
                </button>
                <div className="p-6 rounded-2xl" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{selectedRecipe.emoji}</span>
                    <div>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#D8F3DC", color: "#2D6A4F", fontWeight: 700 }}>
                        {selectedRecipe.category}
                      </span>
                      <h3 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.2rem", marginTop: "0.25rem" }}>{selectedRecipe.title}</h3>
                      <div className="flex gap-3 mt-1">
                        <span className="text-xs" style={{ color: "#6B7280" }}>⏱ {selectedRecipe.time}</span>
                        <span className="text-xs" style={{ color: "#6B7280" }}>📊 {selectedRecipe.difficulty}</span>
                      </div>
                    </div>
                  </div>
                  <ol className="flex flex-col gap-3">
                    {selectedRecipe.steps.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs mt-0.5"
                          style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700 }}
                        >
                          {i + 1}
                        </span>
                        <p className="text-sm" style={{ color: "#374151", lineHeight: 1.6 }}>{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ) : (
              <div>
                {(["Growing", "Culinary", "Eco DIY"] as const).map((cat) => (
                  <div key={cat} className="mb-8">
                    <h3 className="mb-3" style={{ fontWeight: 700, color: "#2D6A4F" }}>
                      {cat === "Growing" ? "🌱 Growing Projects" : cat === "Culinary" ? "🍳 Culinary Recipes" : "♻️ Eco DIY Projects"}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {recipes.filter((r) => r.category === cat).map((recipe) => (
                        <button
                          key={recipe.title}
                          onClick={() => setSelectedRecipe(recipe)}
                          className="text-left p-5 rounded-2xl transition-all hover:shadow-md"
                          style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-3xl">{recipe.emoji}</span>
                            <div>
                              <p style={{ fontWeight: 700, color: "#1B4332" }}>{recipe.title}</p>
                              <div className="flex gap-3 mt-1">
                                <span className="text-xs" style={{ color: "#6B7280" }}>⏱ {recipe.time}</span>
                                <span className="text-xs" style={{ color: "#6B7280" }}>📊 {recipe.difficulty}</span>
                              </div>
                              <p className="text-xs mt-2" style={{ color: "#9CA3AF" }}>{recipe.steps.length} steps →</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* GREENBOT AI SECTION */}
        {activeSection === "bot" && (
          <div>
            <div className="mb-4">
              <h2 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.4rem", marginBottom: "0.25rem" }}>
                🌿 GreenBot AI Advisor
              </h2>
              <p className="text-sm" style={{ color: "#4B5563" }}>
                Trained in mycoremediation, plastic science, and mushroom cultivation. Ask me anything!
              </p>
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #E5E7EB", backgroundColor: "white" }}>
              {/* Chat area */}
              <div className="p-4 flex flex-col gap-3 overflow-y-auto" style={{ minHeight: "320px", maxHeight: "480px" }}>
                {botMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.from === "bot" && (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5" style={{ backgroundColor: "#D8F3DC" }}>
                        <span style={{ fontSize: "0.8rem" }}>🌿</span>
                      </div>
                    )}
                    <div
                      className="px-4 py-3 max-w-xs sm:max-w-md text-sm"
                      style={{
                        fontFamily: "Nunito, sans-serif",
                        backgroundColor: msg.from === "user" ? "#2D6A4F" : "#F3F4F6",
                        color: msg.from === "user" ? "white" : "#374151",
                        borderRadius: msg.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        lineHeight: 1.5,
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggestion chips */}
              <div className="px-4 pb-3 flex flex-wrap gap-2" style={{ borderTop: "1px solid #F3F4F6" }}>
                {botSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendBotMessage(s)}
                    className="px-3 py-1 rounded-full text-xs transition-opacity hover:opacity-70"
                    style={{ backgroundColor: "#D8F3DC", color: "#2D6A4F", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2 px-4 py-3" style={{ borderTop: "1px solid #E5E7EB" }}>
                <input
                  value={botInput}
                  onChange={(e) => setBotInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendBotMessage(botInput)}
                  placeholder="Ask about plastics, growing, recipes..."
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: "#F3F4F6", fontFamily: "Nunito, sans-serif", color: "#374151" }}
                />
                <button
                  onClick={() => sendBotMessage(botInput)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#2D6A4F" }}
                >
                  <Send size={16} color="white" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
