import { useState, useMemo } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id, Doc } from "../../convex/_generated/dataModel";

interface AddItemModalProps {
  locations: Doc<"locations">[];
  containers: Doc<"containers">[];
  onClose: () => void;
}

export function AddItemModal({ locations, containers, onClose }: AddItemModalProps) {
  const createItem = useMutation(api.items.create);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [tags, setTags] = useState("");
  const [locationId, setLocationId] = useState<Id<"locations"> | "">(
    locations.length > 0 ? locations[0]._id : ""
  );
  const [containerId, setContainerId] = useState<Id<"containers"> | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableContainers = useMemo(() => {
    if (!locationId) return [];
    return containers.filter(c => c.locationId === locationId);
  }, [containers, locationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !locationId) return;

    setIsSubmitting(true);
    try {
      await createItem({
        name: name.trim(),
        description: description.trim() || undefined,
        quantity: quantity ? Number(quantity) : undefined,
        tags: tags.trim() ? tags.split(",").map(t => t.trim()).filter(Boolean) : undefined,
        locationId: locationId as Id<"locations">,
        containerId: containerId ? (containerId as Id<"containers">) : undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset container when location changes
  const handleLocationChange = (newLocationId: Id<"locations">) => {
    setLocationId(newLocationId);
    setContainerId("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#2C2C2C]/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl animate-slideUp overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8">
          <h2 className="font-serif text-2xl text-[#2C2C2C] mb-6">Add Item</h2>

          {locations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#2C2C2C]/50 font-sans mb-4">
                You need to create a location first before adding items.
              </p>
              <button
                onClick={onClose}
                className="py-2 px-4 text-[#8B9A7E] font-sans underline hover:text-[#6d7a63]"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-sans text-[#2C2C2C]/70 mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Winter Coat, Passport, Spare Keys"
                  required
                  autoFocus
                  className="w-full px-4 py-3 bg-[#F5F0E8]/50 border border-[#2C2C2C]/10 rounded-xl text-[#2C2C2C] font-sans placeholder:text-[#2C2C2C]/30 focus:outline-none focus:border-[#8B9A7E] focus:ring-2 focus:ring-[#8B9A7E]/20 transition-all"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-sans text-[#2C2C2C]/70 mb-2">
                  Location
                </label>
                <select
                  value={locationId}
                  onChange={(e) => handleLocationChange(e.target.value as Id<"locations">)}
                  required
                  className="w-full px-4 py-3 bg-[#F5F0E8]/50 border border-[#2C2C2C]/10 rounded-xl text-[#2C2C2C] font-sans focus:outline-none focus:border-[#8B9A7E] focus:ring-2 focus:ring-[#8B9A7E]/20 transition-all appearance-none cursor-pointer"
                >
                  {locations.map(loc => (
                    <option key={loc._id} value={loc._id}>{loc.name}</option>
                  ))}
                </select>
              </div>

              {/* Container */}
              {availableContainers.length > 0 && (
                <div>
                  <label className="block text-sm font-sans text-[#2C2C2C]/70 mb-2">
                    Container <span className="text-[#2C2C2C]/40">(optional)</span>
                  </label>
                  <select
                    value={containerId}
                    onChange={(e) => setContainerId(e.target.value as Id<"containers">)}
                    className="w-full px-4 py-3 bg-[#F5F0E8]/50 border border-[#2C2C2C]/10 rounded-xl text-[#2C2C2C] font-sans focus:outline-none focus:border-[#8B9A7E] focus:ring-2 focus:ring-[#8B9A7E]/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Not in a container</option>
                    {availableContainers.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-sans text-[#2C2C2C]/70 mb-2">
                  Description <span className="text-[#2C2C2C]/40">(optional)</span>
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional details about the item"
                  className="w-full px-4 py-3 bg-[#F5F0E8]/50 border border-[#2C2C2C]/10 rounded-xl text-[#2C2C2C] font-sans placeholder:text-[#2C2C2C]/30 focus:outline-none focus:border-[#8B9A7E] focus:ring-2 focus:ring-[#8B9A7E]/20 transition-all"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-sans text-[#2C2C2C]/70 mb-2">
                  Quantity <span className="text-[#2C2C2C]/40">(optional)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value ? parseInt(e.target.value) : "")}
                  placeholder="1"
                  className="w-full px-4 py-3 bg-[#F5F0E8]/50 border border-[#2C2C2C]/10 rounded-xl text-[#2C2C2C] font-sans placeholder:text-[#2C2C2C]/30 focus:outline-none focus:border-[#8B9A7E] focus:ring-2 focus:ring-[#8B9A7E]/20 transition-all"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-sans text-[#2C2C2C]/70 mb-2">
                  Tags <span className="text-[#2C2C2C]/40">(comma separated, optional)</span>
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="clothing, winter, important"
                  className="w-full px-4 py-3 bg-[#F5F0E8]/50 border border-[#2C2C2C]/10 rounded-xl text-[#2C2C2C] font-sans placeholder:text-[#2C2C2C]/30 focus:outline-none focus:border-[#8B9A7E] focus:ring-2 focus:ring-[#8B9A7E]/20 transition-all"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 text-[#2C2C2C]/70 font-sans border border-[#2C2C2C]/10 rounded-xl hover:bg-[#F5F0E8] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name.trim() || !locationId || isSubmitting}
                  className="flex-1 py-3 px-4 bg-[#8B9A7E] text-white font-sans rounded-xl hover:bg-[#7a8970] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Adding..." : "Add Item"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
