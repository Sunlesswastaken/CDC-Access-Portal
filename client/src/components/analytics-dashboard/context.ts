"use client";

import { createContext, useContext } from "react";
import type { AnalyticsDashboardData, AnalyticsPerson, AnalyticsPullRequest } from "./data";

export type AnalyticsDashboardPage = "overview" | "faculty" | "students";

export type AnalyticsDashboardAccent = "blue" | "violet" | "teal" | "amber";

export const ACCENTS: Record<AnalyticsDashboardAccent, { label: string; ui: string }> = {
  blue: { label: "Indigo", ui: "#4f46e5" },
  violet: { label: "Violet", ui: "#7c3aed" },
  teal: { label: "Teal", ui: "#0d9488" },
  amber: { label: "Amber", ui: "#d97706" },
};

export type AnalyticsDashboardUser = {
  name: string;
  email: string;
  avatar: string;
  role?: string;
};

export type AnswerHandler = (question: string, pullRequest: AnalyticsPullRequest) => string | Promise<string>;

type DashboardState = {
  data: AnalyticsDashboardData;
  person: (handle: string) => AnalyticsPerson | undefined;
  user: AnalyticsDashboardUser;
  assistantName: string;
  answer?: AnswerHandler;
  /** Prefix for element ids, unique per dashboard instance. */
  uid: string;
  /** True when rendered as a non-interactive preview (e.g. the login screen): pages must not fetch. */
  preview: boolean;
  selected: number;
  openPr: (prNumber: number) => void;
  navigate: (page: AnalyticsDashboardPage) => void;
  accent: AnalyticsDashboardAccent;
  setAccent: (accent: AnalyticsDashboardAccent) => void;
};

export const DashboardContext = createContext<DashboardState | null>(null);

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used inside <AnalyticsDashboard>");
  return ctx;
}
