import { NextResponse } from "next/server";
import { initialCards } from "@/lib/mockData";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const card = initialCards.find((c) => c.id === id);

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  return NextResponse.json(card);
}