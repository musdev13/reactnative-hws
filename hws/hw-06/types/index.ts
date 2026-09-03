import { Id } from "@/convex/_generated/dataModel";

export interface Todo {
  _id: Id<"todos">;
  text: string;
  isCompleted: boolean;
  createdAt: number;
}

export interface TodoStats {
  total: number;
  completed: number;
  active: number;
  percentage: number;
}

export interface ThemeColors {
  primary: string;
  background: string;
  bg?: string;
  surface: string;
  text: string;
  textSecondary: string;
  textMuted?: string;
  border: string;
  error?: string;
  success?: string;
  danger?: string;
  statusBarStyle?: "dark" | "light";
}

export interface ThemeContextValue {
  isDark: boolean;
  theme?: "light" | "dark";
  toggleTheme: () => void;
  colors: ThemeColors;
}

export interface HeaderProps {
  title: string;
}
