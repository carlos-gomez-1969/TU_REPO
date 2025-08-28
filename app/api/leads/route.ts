import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongo";
import Lead from "@/models/Lead";

// POST /api/leads -> crear lead
export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();
    if (!name || !email) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }
    await dbConnect();
    const lead = await Lead.create({ name, email });
    return NextResponse.json(lead, { status: 201 });
  } catch (e: any) {
    // Manejo básico de duplicado de email
    if (e?.code === 11000) {
      return NextResponse.json({ error: "Este correo ya se encuentra registrado" }, { status: 409 });
    }
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
}

// GET /api/leads -> listar
export async function GET() {
  await dbConnect();
  const leads = await Lead.find().sort({ createdAt: -1 });
  return NextResponse.json(leads);
}

// DELETE /api/leads?id=<mongo_id> -> eliminar
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 });
  await dbConnect();
  await Lead.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
