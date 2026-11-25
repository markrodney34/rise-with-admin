"use client";
import { useState } from "react";
export type Row = { pos: number; team: string; p: number; w: number; d: number; l: number; f: number; a: number; gd: number; pts: number };
export type Season = { season: string; title: string; rows: Row[] };
const cols: [keyof Row, string][] = [["p", "P"], ["w", "W"], ["d", "D"], ["l", "L"], ["f", "F"], ["a", "A"], ["gd", "GD"], ["pts", "Pts"]];
export default function Standings({ seasons, label }: { seasons: Season[]; label: string }) {
  const [i, setI] = useState(0); const s = seasons[i];
  return (<div>
    <div className="flex flex-wrap gap-2" role="tablist" aria-label={`${label} seasons`}>{seasons.map((x, n) => (
      <button key={x.title} role="tab" aria-selected={i === n} onClick={() => setI(n)} className={`min-h-[44px] border-b-2 px-5 text-sm font-extrabold uppercase tracking-wide transition ${i === n ? "border-grow bg-navy text-white" : "border-transparent bg-white text-navy hover:border-grow hover:bg-mist"}`}>{x.season}</button>))}</div>
    <div className="mt-4 overflow-x-auto border border-navy/10 bg-white shadow-lift" role="tabpanel">
      <table className="w-full min-w-[520px] text-left text-sm sm:text-base">
        <caption className="sr-only">{s.title} league table</caption>
        <thead className="bg-navy text-white"><tr><th scope="col" className="px-3 py-4 text-xs uppercase tracking-wider">Pos</th><th scope="col" className="px-3 py-4 text-xs uppercase tracking-wider">Club</th>{cols.map(([k, h]) => <th key={k} scope="col" className="px-2 py-4 text-right text-xs uppercase tracking-wider">{h}</th>)}</tr></thead>
        <tbody>{s.rows.map((r) => (<tr key={r.team} className={`border-b border-mist transition-colors hover:bg-mist/70 ${r.pos === 1 ? "bg-[#f2f8e8] font-bold" : ""}`}>
          <td className="px-3 py-3">{r.pos}</td><th scope="row" className="px-3 py-3 font-semibold text-navy">{r.team}</th>
          {cols.map(([k]) => <td key={k} className={`px-2 py-3 text-right tabular-nums ${k === "pts" ? "font-bold text-navy" : ""}`}>{r[k]}</td>)}</tr>))}</tbody></table></div>
    <p className="mt-3 text-sm text-ink/60">P played, W won, D drawn, L lost, F goals for, A goals against, GD goal difference, Pts points. Figures as published by RISE.</p></div>);
}
