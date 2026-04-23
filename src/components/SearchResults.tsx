import { Doc } from "../../convex/_generated/dataModel";
import { ItemCard } from "./ItemCard";

interface SearchResultsProps {
  results: Doc<"items">[];
  locations: Doc<"locations">[];
  containers: Doc<"containers">[];
  searchTerm: string;
}

export function SearchResults({ results, locations, containers, searchTerm }: SearchResultsProps) {
  const getLocationName = (locationId: string) => {
    const location = locations.find(l => l._id === locationId);
    return location?.name ?? "Unknown";
  };

  const getContainerPath = (containerId: string | undefined): string => {
    if (!containerId) return "";
    const container = containers.find(c => c._id === containerId);
    if (!container) return "";

    const parentPath = getContainerPath(container.parentContainerId);
    return parentPath ? `${parentPath} → ${container.name}` : container.name;
  };

  return (
    <div className="mb-8 md:mb-12 animate-fadeIn">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <h2 className="font-serif text-lg md:text-xl text-[#2C2C2C]">
          Results for "{searchTerm}"
        </h2>
        <span className="text-sm text-[#2C2C2C]/40 font-sans bg-[#F5F0E8] px-3 py-1 rounded-full">
          {results.length} found
        </span>
      </div>

      {results.length > 0 ? (
        <div className="grid gap-3">
          {results.map((item, i) => (
            <div
              key={item._id}
              className="animate-slideUp"
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <ItemCard
                item={item}
                showLocation
                locationName={getLocationName(item.locationId)}
                containerPath={getContainerPath(item.containerId)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 md:py-16 bg-white/40 rounded-2xl border border-[#2C2C2C]/5">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#2C2C2C]/5 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[#2C2C2C]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-[#2C2C2C]/50 font-sans">
            No items found matching "{searchTerm}"
          </p>
          <p className="text-sm text-[#2C2C2C]/30 font-sans mt-1">
            Try different keywords or add new items
          </p>
        </div>
      )}
    </div>
  );
}
