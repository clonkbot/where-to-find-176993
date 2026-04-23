import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id, Doc } from "../../convex/_generated/dataModel";
import { ItemCard } from "./ItemCard";
import { AddContainerModal } from "./AddContainerModal";

interface ContainerTreeProps {
  container: Doc<"containers">;
  allContainers: Doc<"containers">[];
  items: Doc<"items">[];
  allItems: Doc<"items">[];
  locationId: Id<"locations">;
  depth: number;
}

export function ContainerTree({ container, allContainers, items, allItems, locationId, depth }: ContainerTreeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddChild, setShowAddChild] = useState(false);
  const removeContainer = useMutation(api.containers.remove);

  const childContainers = allContainers.filter(c => c.parentContainerId === container._id);
  const containerItems = allItems.filter(i => i.containerId === container._id);
  const hasContent = childContainers.length > 0 || containerItems.length > 0;

  const handleDelete = async () => {
    if (!confirm(`Delete "${container.name}" and all its contents?`)) return;
    await removeContainer({ id: container._id });
  };

  return (
    <div className={`${depth > 0 ? "ml-4 md:ml-6 border-l-2 border-[#8B9A7E]/20 pl-3 md:pl-4" : ""}`}>
      <div className="group">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center gap-3 py-2.5 px-3 md:px-4 bg-white/60 rounded-lg hover:bg-white/80 transition-colors text-left"
        >
          <span className="text-lg">📦</span>
          <div className="flex-1 min-w-0">
            <span className="font-sans text-sm md:text-base text-[#2C2C2C] block truncate">{container.name}</span>
            {container.description && (
              <span className="text-xs text-[#2C2C2C]/40 block truncate">{container.description}</span>
            )}
          </div>
          <span className="text-xs text-[#2C2C2C]/40 font-sans whitespace-nowrap">
            {containerItems.length} items
          </span>
          {hasContent && (
            <svg
              className={`w-4 h-4 text-[#2C2C2C]/40 transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>

        {/* Actions (visible on hover/expanded) */}
        {isExpanded && (
          <div className="flex gap-2 mt-2 ml-3 md:ml-4">
            <button
              onClick={() => setShowAddChild(true)}
              className="text-xs text-[#8B9A7E] hover:text-[#6d7a63] font-sans py-1.5 px-2.5 rounded bg-[#8B9A7E]/10 hover:bg-[#8B9A7E]/20 transition-colors"
            >
              + Nested Container
            </button>
            <button
              onClick={handleDelete}
              className="text-xs text-red-600/60 hover:text-red-600 font-sans py-1.5 px-2.5 rounded hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && hasContent && (
        <div className="mt-2 space-y-2">
          {/* Child Containers */}
          {childContainers.map(child => (
            <ContainerTree
              key={child._id}
              container={child}
              allContainers={allContainers}
              items={allItems.filter(i => i.containerId === child._id)}
              allItems={allItems}
              locationId={locationId}
              depth={depth + 1}
            />
          ))}

          {/* Items in this container */}
          {containerItems.length > 0 && (
            <div className="ml-4 md:ml-6 space-y-1">
              {containerItems.map(item => (
                <ItemCard key={item._id} item={item} compact />
              ))}
            </div>
          )}
        </div>
      )}

      {showAddChild && (
        <AddContainerModal
          locationId={locationId}
          containers={allContainers}
          parentContainerId={container._id}
          onClose={() => setShowAddChild(false)}
        />
      )}
    </div>
  );
}
