{/*Emmanuel wema*/}
import { useState } from "react";
import { ChevronDown, Home, BarChart3, Cog, FileText, Users, Settings, Zap } from "lucide-react";

const statCards = [
  { label: "Total sales anually", value: "500,000" },
  { label: "total stock in inventory", value: "300 pieces" },
  { label: "Total sales monthly", value: "100,000" },
  { label: "Website logins", value: "3,000" },
];

const navSections = [
  {
    title: "DASHBOARDS",
    items: [
      { label: "Dashboard", icon: Home },
      { label: "Parts still in stock", icon: BarChart3 },
    ],
  },
  {
    title: "REPORTS",
    items: [
      { label: "Staff and users", icon: Users },
    ],
  },
  {
    title: "PRICE CHANGE",
    items: [
      { label: "Price change", icon: Zap },
    ],
  },
];

export function AdminSidebarDemo() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [expandedSections, setExpandedSections] = useState({
    DASHBOARDS: true,
    REPORTS: true,
    "PRICE CHANGE": false,
  });

  const toggleSection = (sectionTitle) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black">
      {/* LEFT SIDEBAR - Dark blue */}
      <div className="w-[30%] flex-shrink-0 bg-gradient-to-b from-[#1a3a52] to-[#0f2438] px-6 py-8 flex flex-col overflow-y-auto border-r border-[#5cd9e0]/20">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-[#5cd9e0]/20">
          <h2 className="text-lg font-bold text-[#5cd9e0]">Admin</h2>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 space-y-2">
          {navSections.map((section) => {
            const isExpanded = expandedSections[section.title];
            return (
              <div key={section.title}>
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold uppercase text-[#5cd9e0]/60 hover:text-[#5cd9e0] transition-colors"
                >
                  <span>{section.title}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      isExpanded ? "rotate-0" : "-rotate-90"
                    }`}
                  />
                </button>

                {/* Section Items */}
                {isExpanded && (
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = item.label === activeItem;
                      return (
                        <button
                          key={item.label}
                          onClick={() => setActiveItem(item.label)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded transition-colors ${
                            isActive
                              ? "bg-[#5cd9e0]/20 text-[#5cd9e0]"
                              : "text-[#b0d4e3] hover:bg-[#1a3a52]/80 hover:text-white"
                          }`}
                        >
                          <Icon size={18} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* RIGHT MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden bg-black relative">
        {/* Car background image using img tag */}
        <img
          src="/car-bg.jpg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ opacity: 0.6 }}
        />
        
        {/* Dark overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.4) 100%)",
          }}
        />

        {/* Header */}
        <header className="relative z-10 bg-gradient-to-r from-[#5cd9e0] to-[#f5b8d1] px-12 py-5 text-4xl font-bold text-white shadow-lg">
          Admin &gt; Dashboard
        </header>

        {/* Stats Grid Container */}
        <main className="relative z-10 flex-1 px-16 py-16 overflow-auto">
          <div className="grid grid-cols-2 gap-12 max-w-4xl">
            {statCards.map((card) => (
              <div key={card.label} className="flex flex-col items-center justify-start">
                {/* Label Pill */}
                <div className="rounded-full bg-[#fffbea] px-8 py-3 font-bold text-base text-[#1a1a1a] shadow-lg mb-8 text-center min-h-[50px] flex items-center justify-center">
                  {card.label}
                </div>
                {/* Value */}
                <p className="text-5xl font-light text-white mt-4">
                  {card.value}
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
