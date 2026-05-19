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

export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  const academies = read();
  const idx = academies.findIndex((a) => a.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  academies[idx] = { ...academies[idx], ...body };
  write(academies);
  return NextResponse.json(academies[idx]);
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  let academies = read();
  const len = academies.length;
  academies = academies.filter((a) => a.id !== id);
  if (academies.length === len) return NextResponse.json({ error: "Not found" }, { status: 404 });
  write(academies);
  return NextResponse.json({ deleted: id });
}
