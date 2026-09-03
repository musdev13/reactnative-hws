import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getTodos = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return [];
    }

    return await ctx.db
      .query("todos")
      .withIndex("by_user_creation", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return {
        total: 0,
        completed: 0,
        active: 0,
        percentage: 0,
      };
    }

    const todos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const total = todos.length;
    const completed = todos.filter((todo) => todo.isCompleted).length;
    const active = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      active,
      percentage,
    };
  },
});

export const createTodo = mutation({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new Error("Необхідно увійти в акаунт");
    }

    const trimmedText = args.text.trim();

    if (!trimmedText) {
      throw new Error("Текст задачі не може бути порожнім");
    }

    return await ctx.db.insert("todos", {
      userId,
      text: trimmedText,
      isCompleted: false,
      createdAt: Date.now(),
    });
  },
});

export const toggleTodo = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new Error("Необхідно увійти в акаунт");
    }

    const todo = await ctx.db.get(args.id);

    if (!todo) {
      throw new Error("Задача не знайдена");
    }

    if (todo.userId !== userId) {
      throw new Error("Немає доступу до цієї задачі");
    }

    await ctx.db.patch(args.id, {
      isCompleted: !todo.isCompleted,
    });
  },
});

export const updateTodo = mutation({
  args: {
    id: v.id("todos"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new Error("Необхідно увійти в акаунт");
    }

    const trimmedText = args.text.trim();

    if (!trimmedText) {
      throw new Error("Текст задачі не може бути порожнім");
    }

    const todo = await ctx.db.get(args.id);

    if (!todo) {
      throw new Error("Задача не знайдена");
    }

    if (todo.userId !== userId) {
      throw new Error("Немає доступу до цієї задачі");
    }

    await ctx.db.patch(args.id, {
      text: trimmedText,
    });
  },
});

export const deleteTodo = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new Error("Необхідно увійти в акаунт");
    }

    const todo = await ctx.db.get(args.id);

    if (!todo) {
      throw new Error("Задача не знайдена");
    }

    if (todo.userId !== userId) {
      throw new Error("Немає доступу до цієї задачі");
    }

    await ctx.db.delete(args.id);
  },
});

export const clearCompleted = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new Error("Необхідно увійти в акаунт");
    }

    const completedTodos = await ctx.db
      .query("todos")
      .withIndex("by_user_completion", (q) =>
        q.eq("userId", userId).eq("isCompleted", true),
      )
      .collect();

    for (const todo of completedTodos) {
      await ctx.db.delete(todo._id);
    }
  },
});

export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new Error("Необхідно увійти в акаунт");
    }

    const todos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const todo of todos) {
      await ctx.db.delete(todo._id);
    }
  },
});
