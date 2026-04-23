import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface AddLocationModalProps {
  onClose: () => void;
}

const LOCATION_OPTIONS = [
  { value: "home", label: "Home", icon: "🏠" },
  { value: "office", label: "Office", icon: "🏢" },
  { value: "storage", label: "Storage", icon: "📦" },
  { value: "garage", label: "Garage", icon: "🚗" },
  { value: "basement", label: "Basement", icon: "🪜" },
  { value: "attic", label: "Attic", icon: "🏚️" },
  { value: "cabin", label: "Cabin/Vacation", icon: "🏕️" },
  { value: "default", label: "Other", icon: "📍" },
];

export function AddLocationModal({ onClose }: AddLocationModalProps) {
  const createLocation = useMutation(api.locations.create);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("home");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await createLocation({
        name: name.trim(),
        description: description.trim() || undefined,
        icon,
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
          <h2 className="font-serif text-2xl text-[#2C2C2C] mb-6">Add Location</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-sans text-[#2C2C2C]/70 mb-3">
                Type
              </label>
              <div className="grid grid-cols-4 gap-2">
                {LOCATION_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setIcon(option.value)}
                    className={`p-3 rounded-xl text-center transition-all ${
                      icon === option.value
                        ? "bg-[#8B9A7E]/20 border-2 border-[#8B9A7E]"
                        : "bg-[#F5F0E8]/50 border-2 border-transparent hover:border-[#2C2C2C]/10"
                    }`}
                  >
                    <span className="text-xl block mb-1">{option.icon}</span>
                    <span className="text-xs text-[#2C2C2C]/60 font-sans">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-sans text-[#2C2C2C]/70 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Home"
                required
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
                placeholder="123 Main Street"
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
                {isSubmitting ? "Adding..." : "Add Location"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
