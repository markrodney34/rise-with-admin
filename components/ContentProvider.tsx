"use client";
import { createContext, useContext } from "react";
import type { Content } from "@/lib/types";
export type PublicContent = Pick<Content, "site" | "images" | "highlights" | "nav">;
const Ctx = createContext<PublicContent | null>(null);
export function ContentProvider({ value, children }: { value: PublicContent; children: React.ReactNode }) { return <Ctx.Provider value={value}>{children}</Ctx.Provider>; }
export function useContent() { const c = useContext(Ctx); if (!c) throw new Error("ContentProvider missing"); return c; }
