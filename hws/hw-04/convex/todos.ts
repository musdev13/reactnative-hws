import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getTodos = query({
  args: {},
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").collect();
    return todos.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").collect();
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
    const trimmedText = args.text.trim();
    if (!trimmedText) {
      throw new Error("Текст задачи не может быть пустым");
    }

    return await ctx.db.insert("todos", {
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
    const todo = await ctx.db.get(args.id);
    if (!todo) {
      throw new Error("Задача не найдена");
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
    const trimmedText = args.text.trim();
    if (!trimmedText) {
      throw new Error("Текст задачи не может быть пустым");
    }

    const todo = await ctx.db.get(args.id);
    if (!todo) {
      throw new Error("Задача не найдена");
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
    const todo = await ctx.db.get(args.id);
    if (!todo) {
      throw new Error("Задача не найдена");
    }

    await ctx.db.delete(args.id);
  },
});

export const clearCompleted = mutation({
  args: {},
  handler: async (ctx) => {
    const completedTodos = await ctx.db
      .query("todos")
      .withIndex("by_completion", (q) => q.eq("isCompleted", true))
      .collect();

    for (const todo of completedTodos) {
      await ctx.db.delete(todo._id);
    }
  },
});

export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const allTodos = await ctx.db.query("todos").collect();

    for (const todo of allTodos) {
      await ctx.db.delete(todo._id);
    }
  },
});
