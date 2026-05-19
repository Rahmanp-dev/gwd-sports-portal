import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "academies.json");

function read() {
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
}
function write(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export async function GET() {
  return NextResponse.json(read());
}

export async function POST(req) {
  const body = await req.json();
  const academies = read();
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
    // Performance metrics
    matchesPlayed: parseInt(body.matchesPlayed) || 0,
    trophies: parseInt(body.trophies) || 0,
    winRate: parseInt(body.winRate) || 0,
    topRank: body.topRank || "",
    // Star players & teams
    starPlayers: Array.isArray(body.starPlayers) ? body.starPlayers : [],
    teams: Array.isArray(body.teams) ? body.teams : [],
  };
  academies.push(entry);
  write(academies);
  return NextResponse.json(entry, { status: 201 });
}
