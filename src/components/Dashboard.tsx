import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { LocationCard } from "./LocationCard";
import { AddLocationModal } from "./AddLocationModal";
import { AddItemModal } from "./AddItemModal";
import { SearchResults } from "./SearchResults";
import { Id, Doc } from "../../convex/_generated/dataModel";

export function Dashboard() {
  const { signOut } = useAuthActions();
  const locations = useQuery(api.locations.list);
  const items = useQuery(api.items.list);
  const containers = useQuery(api.containers.list);

  const [showAddLocation, setShowAddLocation] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState<Id<"locations"> | null>(null);

  const searchResults = useQuery(
    api.items.search,
    searchTerm.length >= 2 ? { searchTerm } : "skip"
  );

  const stats = useMemo(() => {
    return {
      locations: locations?.length ?? 0,
      containers: containers?.length ?? 0,
      items: items?.length ?? 0,
    };
  }, [locations, containers, items]);

  const isLoading = locations === undefined;

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#F5F0E8]/90 backdrop-blur-md border-b border-[#2C2C2C]/5">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center border-2 border-[#2C2C2C] rounded-full">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-[#2C2C2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h1 className="font-serif text-xl md:text-2xl text-[#2C2C2C] tracking-tight hidden sm:block">
                where to find
              </h1>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => signOut()}
                className="px-3 py-2 md:px-4 text-sm text-[#2C2C2C]/60 hover:text-[#2C2C2C] font-sans transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        {/* Search Bar */}
        <div className="mb-8 md:mb-12 animate-fadeIn">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-[#2C2C2C]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for anything..."
              className="w-full pl-12 pr-4 py-4 md:py-5 bg-white/80 border border-[#2C2C2C]/10 rounded-2xl text-[#2C2C2C] font-sans text-base md:text-lg placeholder:text-[#2C2C2C]/30 focus:outline-none focus:border-[#8B9A7E] focus:ring-2 focus:ring-[#8B9A7E]/20 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-4 flex items-center text-[#2C2C2C]/40 hover:text-[#2C2C2C]/60"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        {searchTerm.length >= 2 && (
          <SearchResults
            results={searchResults ?? []}
            locations={locations ?? []}
            containers={containers ?? []}
            searchTerm={searchTerm}
          />
        )}

        {/* Stats */}
        {!searchTerm && (
          <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-12 animate-slideUp">
            {[
              { label: "Locations", value: stats.locations, icon: "🏠" },
              { label: "Containers", value: stats.containers, icon: "📦" },
              { label: "Items", value: stats.items, icon: "🔖" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="bg-white/60 rounded-xl md:rounded-2xl p-4 md:p-6 border border-[#2C2C2C]/5 text-center"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span className="text-xl md:text-2xl mb-1 md:mb-2 block">{stat.icon}</span>
                <p className="font-serif text-2xl md:text-3xl text-[#2C2C2C] mb-1">{stat.value}</p>
                <p className="text-xs md:text-sm text-[#2C2C2C]/50 font-sans">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        {!searchTerm && (
          <div className="flex flex-col sm:flex-row gap-3 mb-8 md:mb-12 animate-slideUp" style={{ animationDelay: "0.1s" }}>
            <button
              onClick={() => setShowAddLocation(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 md:py-4 px-6 bg-[#2C2C2C] text-white font-sans text-sm md:text-base rounded-xl hover:bg-[#1a1a1a] transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Location
            </button>
            <button
              onClick={() => setShowAddItem(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 md:py-4 px-6 bg-[#8B9A7E] text-white font-sans text-sm md:text-base rounded-xl hover:bg-[#7a8970] transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Item
            </button>
          </div>
        )}

        {/* Locations Grid */}
        {!searchTerm && (
          <div className="space-y-4 md:space-y-6">
            {isLoading ? (
              <div className="text-center py-20">
                <div className="w-10 h-10 border-2 border-[#2C2C2C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[#2C2C2C]/50 font-sans">Loading your spaces...</p>
              </div>
            ) : locations && locations.length > 0 ? (
              <div className="grid gap-4 md:gap-6">
                {locations.map((location: Doc<"locations">, i: number) => (
                  <div
                    key={location._id}
                    className="animate-slideUp"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <LocationCard
                      location={location}
                      containers={(containers ?? []).filter((c: Doc<"containers">) => c.locationId === location._id)}
                      items={(items ?? []).filter((item: Doc<"items">) => item.locationId === location._id)}
                      isExpanded={selectedLocationId === location._id}
                      onToggle={() => setSelectedLocationId(
                        selectedLocationId === location._id ? null : location._id
                      )}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 md:py-20">
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-[#8B9A7E]/10 rounded-full flex items-center justify-center">
                  <span className="text-3xl md:text-4xl">🏡</span>
                </div>
                <h3 className="font-serif text-xl md:text-2xl text-[#2C2C2C] mb-3">Start organizing</h3>
                <p className="text-[#2C2C2C]/50 font-sans max-w-md mx-auto mb-6 text-sm md:text-base px-4">
                  Add your first location — like your home, office, or storage unit — then add containers and items inside.
                </p>
                <button
                  onClick={() => setShowAddLocation(true)}
                  className="inline-flex items-center gap-2 py-3 px-6 bg-[#2C2C2C] text-white font-sans rounded-xl hover:bg-[#1a1a1a] transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Add your first location
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {showAddLocation && (
        <AddLocationModal onClose={() => setShowAddLocation(false)} />
      )}
      {showAddItem && (
        <AddItemModal
          locations={locations ?? []}
          containers={containers ?? []}
          onClose={() => setShowAddItem(false)}
        />
      )}
    </div>
  );
}
