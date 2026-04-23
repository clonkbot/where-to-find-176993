import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id, Doc } from "../../convex/_generated/dataModel";

interface AddContainerModalProps {
  locationId: Id<"locations">;
  containers: Doc<"containers">[];
  parentContainerId?: Id<"containers">;
  onClose: () => void;
}

export function AddContainerModal({ locationId, containers, parentContainerId, onClose }: AddContainerModalProps) {
  const createContainer = useMutation(api.containers.create);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parentContainer = parentContainerId
    ? containers.find(c => c._id === parentContainerId)
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await createContainer({
        name: name.trim(),
        description: description.trim() || undefined,
        locationId,
        parentContainerId,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#2C2C2C]/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl animate-slideUp overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="font-serif text-2xl text-[#2C2C2C] mb-2">Add Container</h2>
          {parentContainer && (
            <p className="text-sm text-[#8B9A7E] font-sans mb-6">
              Inside: {parentContainer.name}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-sans text-[#2C2C2C]/70 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Bedroom Closet, Toolbox, Kitchen Drawer"
                required
                autoFocus
                className="w-full px-4 py-3 bg-[#F5F0E8]/50 border border-[#2C2C2C]/10 rounded-xl text-[#2C2C2C] font-sans placeholder:text-[#2C2C2C]/30 focus:outline-none focus:border-[#8B9A7E] focus:ring-2 focus:ring-[#8B9A7E]/20 transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-sans text-[#2C2C2C]/70 mb-2">
                Description <span className="text-[#2C2C2C]/40">(optional)</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's typically stored here?"
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
                disabled={!name.trim() || isSubmitting}
                className="flex-1 py-3 px-4 bg-[#2C2C2C] text-white font-sans rounded-xl hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Adding..." : "Add Container"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
