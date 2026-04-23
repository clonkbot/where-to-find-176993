import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

interface ItemCardProps {
  item: Doc<"items">;
  compact?: boolean;
  showLocation?: boolean;
  locationName?: string;
  containerPath?: string;
}

export function ItemCard({ item, compact, showLocation, locationName, containerPath }: ItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const removeItem = useMutation(api.items.remove);

  const handleDelete = async () => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    await removeItem({ id: item._id });
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 py-2 px-3 bg-[#F5F0E8]/50 rounded-lg group">
        <span className="text-sm">🔖</span>
        <span className="flex-1 text-sm text-[#2C2C2C] font-sans truncate">{item.name}</span>
        {item.quantity && item.quantity > 1 && (
          <span className="text-xs text-[#2C2C2C]/40 bg-white/80 px-2 py-0.5 rounded-full">
            ×{item.quantity}
          </span>
        )}
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 text-red-500/50 hover:text-red-500 transition-all p-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/60 rounded-xl border border-[#2C2C2C]/5 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 p-3 md:p-4 text-left hover:bg-white/80 transition-colors"
      >
        <span className="text-xl">🔖</span>
        <div className="flex-1 min-w-0">
          <span className="font-sans text-sm md:text-base text-[#2C2C2C] block truncate">{item.name}</span>
          {showLocation && (locationName || containerPath) && (
            <span className="text-xs text-[#8B9A7E] block truncate">
              {locationName}{containerPath && ` → ${containerPath}`}
            </span>
          )}
          {item.description && !showLocation && (
            <span className="text-xs text-[#2C2C2C]/50 block truncate">{item.description}</span>
          )}
        </div>
        {item.quantity && item.quantity > 1 && (
          <span className="text-xs text-[#2C2C2C]/50 bg-[#F5F0E8] px-2 py-1 rounded-full">
            ×{item.quantity}
          </span>
        )}
        <svg
          className={`w-4 h-4 text-[#2C2C2C]/40 transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="border-t border-[#2C2C2C]/5 p-3 md:p-4 bg-[#F5F0E8]/30 space-y-3">
          {item.description && (
            <p className="text-sm text-[#2C2C2C]/70 font-sans">{item.description}</p>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs font-sans px-2 py-1 bg-[#8B9A7E]/10 text-[#8B9A7E] rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={handleDelete}
              className="text-xs text-red-600/60 hover:text-red-600 font-sans py-1.5 px-3 rounded hover:bg-red-50 transition-colors"
            >
              Delete item
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
