// app/api/cards/route.ts

import { NextResponse } from "next/server";
import { initialCards } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json(initialCards);
}
