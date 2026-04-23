import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // Locations represent physical places (Home, Office, Storage Unit, etc.)
  locations: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    userId: v.id("users"),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Containers can be nested (Room -> Closet -> Box -> Shelf)
  containers: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    locationId: v.id("locations"),
    parentContainerId: v.optional(v.id("containers")),
    userId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_location", ["locationId"])
    .index("by_parent", ["parentContainerId"]),

  // Items are the physical things we're tracking
  items: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    quantity: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    locationId: v.id("locations"),
    containerId: v.optional(v.id("containers")),
    userId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_location", ["locationId"])
    .index("by_container", ["containerId"]),
});
