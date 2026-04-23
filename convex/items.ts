import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("items")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const items = await ctx.db
      .query("items")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const term = args.searchTerm.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(term))
    );
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    quantity: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    locationId: v.id("locations"),
    containerId: v.optional(v.id("containers")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("items", {
      name: args.name,
      description: args.description,
      quantity: args.quantity,
      tags: args.tags,
      locationId: args.locationId,
      containerId: args.containerId,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("items"),
    name: v.string(),
    description: v.optional(v.string()),
    quantity: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    locationId: v.id("locations"),
    containerId: v.optional(v.id("containers")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.id, {
      name: args.name,
      description: args.description,
      quantity: args.quantity,
      tags: args.tags,
      locationId: args.locationId,
      containerId: args.containerId,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("items") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});
