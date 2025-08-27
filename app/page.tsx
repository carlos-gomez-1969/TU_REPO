"use client";
import { useEffect, useState } from "react";

type Lead = { _id: string; name: string; email: string; createdAt?: string };

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function load() {
    const r = await fetch("/api/leads", { cache: "no-store" });
    setLeads(await r.json());
  }
  useEffect(() => { load(); }, []);

  async function addLead(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null); setLoading(true);
    const r = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    const data = await r.json();
    setLoading(false);
    if (!r.ok) {
      setMsg({ type: "err", text: data?.error || "No se pudo guardar" });
      return;
    }
    setMsg({ type: "ok", text: "Lead guardado correctamente" });
    setName(""); setEmail(""); load();
  }

  async function removeLead(id: string) {
    await fetch(`/api/leads?id=${id}`, { method: "DELETE" });
    setMsg({ type: "ok", text: "Lead eliminado" });
    load();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-xl mx-auto p-6">
       {/*<h1 className="text-2xl font-bold tracking-tight">I N G R E S O</h1>*/}
        <h1 className="text-3xl font-bold text-yellow-400 bg-blue-900 text-center py-2 rounded">
          INGRESO
        </h1>  
        <p className="text-slate-600">Nombre y correo de contactos interesados.</p>

        {msg && (
          <div className={`mt-4 rounded-lg border p-3 text-sm
            ${msg.type === "ok" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={addLead} className="mt-6 grid gap-3">
          <input
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-500"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-500"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        <div className="flex justify-center">
          <button
            disabled={loading}
            className="w-1/2 bg-blue-900 text-white py-2 font-medium hover:opacity-90 disabled:opacity-50">
            {loading ? "Guardando…" : "Agregar Registros"}
          </button>
        </div>
        </form>

        <h2 className="mt-8 mb-2 text-lg font-semibold">Vista</h2>
        <ul className="grid gap-3">
          {leads.map((l) => (
            <li key={l._id} className="rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{l.name}</div>
                <div className="text-slate-600 text-sm">{l.email}</div>
              </div>
              <button
                onClick={() => removeLead(l._id)}
                className="text-red-600 hover:text-red-700 text-sm">
                Eliminar
              </button>
            </li>
          ))}
          {leads.length === 0 && <li className="text-slate-500 text-sm">No hay leads aún.</li>}
        </ul>
      </div>
    </main>
  );
}
