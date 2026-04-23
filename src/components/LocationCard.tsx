import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id, Doc } from "../../convex/_generated/dataModel";
import { AddContainerModal } from "./AddContainerModal";
import { ContainerTree } from "./ContainerTree";
import { ItemCard } from "./ItemCard";

interface LocationCardProps {
  location: Doc<"locations">;
  containers: Doc<"containers">[];
  items: Doc<"items">[];
  isExpanded: boolean;
  onToggle: () => void;
}

const LOCATION_ICONS: Record<string, string> = {
  home: "🏠",
  office: "🏢",
  storage: "📦",
  garage: "🚗",
  basement: "🪜",
  attic: "🏚️",
  cabin: "🏕️",
  default: "📍",
};

export function LocationCard({ location, containers, items, isExpanded, onToggle }: LocationCardProps) {
  const removeLocation = useMutation(api.locations.remove);
  const [showAddContainer, setShowAddContainer] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const rootContainers = containers.filter(c => !c.parentContainerId);
  const looseItems = items.filter(item => !item.containerId);
  const icon = LOCATION_ICONS[location.icon ?? "default"] ?? LOCATION_ICONS.default;

  const handleDelete = async () => {
    if (!confirm(`Delete "${location.name}" and all its contents?`)) return;
    setIsDeleting(true);
    try {
      await removeLocation({ id: location._id });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white/80 rounded-2xl border border-[#2C2C2C]/5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 md:p-6 text-left hover:bg-[#F5F0E8]/50 transition-colors"
      >
        <span className="text-2xl md:text-3xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-lg md:text-xl text-[#2C2C2C] truncate">{location.name}</h3>
          {location.description && (
            <p className="text-sm text-[#2C2C2C]/50 font-sans truncate">{location.description}</p>
          )}
          <p className="text-xs text-[#2C2C2C]/40 font-sans mt-1">
            {containers.length} containers · {items.length} items
          </p>
        </div>
        <svg
          className={`w-5 h-5 text-[#2C2C2C]/40 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-[#2C2C2C]/5 p-4 md:p-6 space-y-4 md:space-y-6 bg-[#F5F0E8]/30">
          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowAddContainer(true)}
              className="inline-flex items-center gap-2 py-2 px-4 text-sm font-sans text-[#2C2C2C]/70 bg-white/80 rounded-lg border border-[#2C2C2C]/10 hover:border-[#8B9A7E] hover:text-[#8B9A7E] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Container
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 py-2 px-4 text-sm font-sans text-red-600/70 bg-white/80 rounded-lg border border-[#2C2C2C]/10 hover:border-red-300 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Location
            </button>
          </div>

          {/* Containers */}
          {rootContainers.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-wider text-[#2C2C2C]/40 font-sans font-medium">
                Containers
              </h4>
              <div className="space-y-2">
                {rootContainers.map(container => (
                  <ContainerTree
                    key={container._id}
                    container={container}
                    allContainers={containers}
                    items={items.filter(i => i.containerId === container._id)}
                    allItems={items}
                    locationId={location._id}
                    depth={0}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Loose Items */}
          {looseItems.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-wider text-[#2C2C2C]/40 font-sans font-medium">
                Items (not in container)
              </h4>
              <div className="grid gap-2">
                {looseItems.map(item => (
                  <ItemCard key={item._id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {containers.length === 0 && items.length === 0 && (
            <p className="text-center text-[#2C2C2C]/40 font-sans py-8 text-sm">
              This location is empty. Add containers or items to get started.
            </p>
          )}
        </div>
      )}

      {/* Modals */}
      {showAddContainer && (
        <AddContainerModal
          locationId={location._id}
          containers={containers}
          onClose={() => setShowAddContainer(false)}
        />
      )}
    </div>
  );
}
