"use client";
import { useForm } from "react-hook-form"; import { z } from "zod"; import { zodResolver } from "@hookform/resolvers/zod"; import { useState } from "react"; import { useContent } from "./ContentProvider";
const schema = z.object({ name: z.string().min(2, "Enter your name"), email: z.string().email("Enter a valid email address"), topic: z.enum(["General", "Partnership", "Volunteer"]), message: z.string().min(10, "Write at least 10 characters"), website: z.string().optional() });
type F = z.infer<typeof schema>;
export default function ContactForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<F>({ resolver: zodResolver(schema), defaultValues: { topic: "General" } });
  const [done, setDone] = useState(false); const [err, setErr] = useState(""); const { site } = useContent();
  // Messages are saved on the server and appear in Admin > Messages.
  const onSubmit = async (d: F) => { setErr(""); setDone(false);
    try { const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) }); if (!r.ok) throw new Error((await r.json()).error); setDone(true); reset(); }
    catch (e) { setErr((e as Error).message || `Something went wrong. Please email ${site.email}.`); } };
  const f = "mt-1 w-full border-2 border-navy/20 bg-white px-4 py-3 focus:border-blue"; const er = (m?: string) => m && <p role="alert" className="mt-1 text-sm font-semibold text-red-700">{m}</p>;
  return (<form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5" id="involved">
    <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" {...register("website")} />
    <div><label htmlFor="name" className="font-semibold">Name</label><input id="name" className={f} {...register("name")} aria-invalid={!!errors.name} />{er(errors.name?.message)}</div>
    <div><label htmlFor="email" className="font-semibold">Email</label><input id="email" type="email" className={f} {...register("email")} aria-invalid={!!errors.email} />{er(errors.email?.message)}</div>
    <div><label htmlFor="topic" className="font-semibold">I'm writing about</label><select id="topic" className={f} {...register("topic")}><option>General</option><option>Partnership</option><option>Volunteer</option></select></div>
    <div><label htmlFor="message" className="font-semibold">Message</label><textarea id="message" rows={5} className={f} {...register("message")} aria-invalid={!!errors.message} />{er(errors.message?.message)}</div>
    <button className="btn-g w-full sm:w-auto" disabled={isSubmitting}>Send message</button>
    {done && <p role="status" className="bg-grow/10 p-4 font-semibold text-navy">Thank you. Your message has been sent and the RISE team will reply by email.</p>}
    {err && <p role="alert" className="bg-red-50 p-4 font-semibold text-red-700">{err}</p>}</form>);
}
