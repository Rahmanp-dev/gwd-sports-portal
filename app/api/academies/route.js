import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Academy from "@/models/Academy";

export async function GET() {
  try {
    await dbConnect();
    const list = await Academy.find({});
    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const id =
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+$/, "") +
      "-" +
      Date.now().toString(36);
    
    const entry = {
      id,
      name: body.name || "New Academy",
      lat: parseFloat(body.lat) || 17.485,
      lng: parseFloat(body.lng) || 78.3867,
      sport: body.sport || "Cricket",
      students: parseInt(body.students) || 0,
      rating: parseInt(body.rating) || 1,
      city: body.city || "Hyderabad, TG",
      area: body.area || "",
      founded: body.founded || new Date().getFullYear().toString(),
      coach: body.coach || "",
      phone: body.phone || "",
      status: body.status || "active",
      badge: body.badge || "verified",
      createdAt: new Date().toISOString(),
      matchesPlayed: parseInt(body.matchesPlayed) || 0,
      trophies: parseInt(body.trophies) || 0,
      winRate: parseInt(body.winRate) || 0,
      topRank: body.topRank || "",
      starPlayers: Array.isArray(body.starPlayers) ? body.starPlayers : [],
      teams: Array.isArray(body.teams) ? body.teams : [],
    };
    
    const academy = await Academy.create(entry);
    return NextResponse.json(academy, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

