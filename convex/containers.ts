import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("containers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const listByLocation = query({
  args: { locationId: v.id("locations") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("containers")
      .withIndex("by_location", (q) => q.eq("locationId", args.locationId))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    locationId: v.id("locations"),
    parentContainerId: v.optional(v.id("containers")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("containers", {
      name: args.name,
      description: args.description,
      locationId: args.locationId,
      parentContainerId: args.parentContainerId,
      userId,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("containers"),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const container = await ctx.db.get(args.id);
    if (!container || container.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.id, {
      name: args.name,
      description: args.description,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("containers") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const container = await ctx.db.get(args.id);
    if (!container || container.userId !== userId) throw new Error("Not found");

    // Delete all items in this container
    const items = await ctx.db
      .query("items")
      .withIndex("by_container", (q) => q.eq("containerId", args.id))
      .collect();
    for (const item of items) {
      await ctx.db.delete(item._id);
    }

    // Delete all child containers
    const children = await ctx.db
      .query("containers")
      .withIndex("by_parent", (q) => q.eq("parentContainerId", args.id))
      .collect();
    for (const child of children) {
      await ctx.db.delete(child._id);
    }

    await ctx.db.delete(args.id);
  },
});
